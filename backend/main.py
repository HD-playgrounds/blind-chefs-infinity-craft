from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from typing import List, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from models import Item, Recipe, Progression
from database import engine

app = FastAPI(title="Blind Chef API")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the exact origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_session():
    with Session(engine) as session:
        yield session

@app.get("/items", response_model=List[Item])
def read_items(session: Session = Depends(get_session)):
    return session.exec(select(Item)).all()

# Expanded CORE_SET to give more variety at start
CORE_SET = [
    1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 21, 23, 24, 25, 40, 41, 48, 52, 200, 201, 202, # Ingredients
    15, 16, 185, 186, 187, 188, 189, # Techniques
    17, 18, 19, 20, 190, 191 # Appliances
]

@app.get("/progression")
def read_progression(session: Session = Depends(get_session)):
    results = session.exec(select(Progression)).all()
    
    # Self-healing: Ensure all core set items exist in progression
    existing_prog_ids = {p.item_id for p in results}
    added_new = False
    for item_id in CORE_SET:
        if item_id not in existing_prog_ids:
            logger.info(f"Adding missing core item {item_id} to progression...")
            prog = Progression(item_id=item_id, is_discovered=True, is_unlocked=True, mastery_count=0)
            session.add(prog)
            added_new = True
    
    if added_new:
        session.commit()
        results = session.exec(select(Progression)).all()

    return {
        "discovered_ids": [p.item_id for p in results if p.is_discovered],
        "unlocked_base_ids": [p.item_id for p in results if p.is_unlocked],
        "mastery_counts": {p.item_id: p.mastery_count for p in results}
    }

import random
from llm import get_culinary_outcomes

@app.post("/combine")
async def combine_items(source_id: int, target_id: int, session: Session = Depends(get_session)):
    # 1. Fetch source and target item names for the LLM
    source_item = session.exec(select(Item).where(Item.id == source_id)).first()
    target_item = session.exec(select(Item).where(Item.id == target_id)).first()
    
    if not source_item or not target_item:
        raise HTTPException(status_code=404, detail="Item not found")

    # 2. Check DB for existing recipes (any order)
    recipes = session.exec(
        select(Recipe).where(
            ((Recipe.source_id == source_id) & (Recipe.target_id == target_id)) |
            ((Recipe.source_id == target_id) & (Recipe.target_id == source_id))
        )
    ).all()
    
    # Filter for order-dependent if applicable
    order_match = [r for r in recipes if r.is_order_dependent and r.source_id == source_id and r.target_id == target_id]
    if order_match:
        recipes = order_match
    else:
        # Fallback to non-order-dependent ones
        recipes = [r for r in recipes if not r.is_order_dependent]

    result_id = None
    
    # 3. If no recipe exists, call LM Studio
    if not recipes:
        logger.info(f"No recipe found for {source_item.name} + {target_item.name}. Generating with LLM...")
        outcomes = await get_culinary_outcomes(source_item.name, target_item.name)
        
        if outcomes:
            # Create new items and recipes
            for outcome in outcomes:
                # Check if item with this name already exists to avoid duplicates
                existing_item = session.exec(select(Item).where(Item.name == outcome["name"])).first()
                if existing_item:
                    new_item_id = existing_item.id
                else:
                    # Find a new ID range (start from 1000)
                    max_id = session.exec(select(Item.id).order_by(Item.id.desc())).first() or 1000
                    new_item_id = max(max_id + 1, 1000)
                    
                    new_item = Item(
                        id=new_item_id,
                        name=outcome["name"],
                        type="ingredient", # Default to ingredient for generated ones
                        icon=outcome.get("icon", "✨"), # Use LLM icon or fallback
                        directions=outcome["directions"]
                    )
                    session.add(new_item)
                    session.flush() # Get the result into the session
                
                # Add the recipe
                session.add(Recipe(
                    source_id=source_id,
                    target_id=target_id,
                    result_id=new_item_id,
                    is_order_dependent=False
                ))
            
            session.commit()
            
            # Re-fetch recipes
            recipes = session.exec(
                select(Recipe).where(Recipe.source_id == source_id, Recipe.target_id == target_id)
            ).all()

    if not recipes:
        return {"result_id": None}

    # 4. Pick one result randomly (variability!)
    recipe = random.choice(recipes)
    result_id = recipe.result_id
    
    # 5. Update progression
    prog = session.exec(select(Progression).where(Progression.item_id == result_id)).first()
    if not prog:
        prog = Progression(item_id=result_id, is_discovered=True, mastery_count=1)
        session.add(prog)
    else:
        prog.is_discovered = True
        prog.mastery_count += 1
    
    # Unlock if it's a base item (unlikely for generated ones but good to have)
    item = session.exec(select(Item).where(Item.id == result_id)).first()
    if item and item.isBase:
        prog.is_unlocked = True
        
    session.commit()
    session.refresh(prog)

    return {
        "result_id": result_id,
        "mastery_count": prog.mastery_count,
        "is_unlocked": prog.is_unlocked
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

