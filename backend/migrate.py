import json
import re
from sqlmodel import Session, SQLModel, create_engine, select
from models import Item, Recipe, Progression
from database import engine, create_db_and_tables

def migrate_items():
    with open("../data/dataset1.json", "r") as f:
        data = json.load(f)
    
    with Session(engine) as session:
        # Clear existing items to avoid conflicts if ID reuse happens
        # (Optional: depends on dev env preference, but safer for "reseed")
        # For now, we assume a fresh start or we just upsert.
        # Since we are changing IDs completely, it's better to clear or just add.
        # But `create_db_and_tables` doesn't drop tables. 
        # Ideally, we should truncate tables here or use a drop_all approach if we want a clean slate.
        # Let's trust the user to restart cleanly or just add these. 
        # actually, to avoid duplicates with old "Meat" (id=5) vs "Chicken Thigh" (id=5), 
        # we should probably clear tables if we can.
        # But `migrate.py` is usually additive. 
        # Let's just UPSERT/Merge based on ID? No, IDs are changing meaning.
        # Best to just clear tables in this script for this specific "Reset".
        
        session.exec(select(Recipe)).all() # Check connection
        # Truncate tables (sqlite doesn't support TRUNCATE, use delete)
        session.query(Progression).delete()
        session.query(Recipe).delete()
        session.query(Item).delete()
        session.commit()

        print("Cleared existing data.")

        for item_data in data:
            item = Item(
                id=item_data["id"],
                name=item_data["name"],
                type=item_data["type"],
                icon=item_data.get("icon", ""),
                isBase=item_data.get("isBase", False),
                directions=item_data.get("directions")
            )
            session.add(item)
        session.commit()
    print(f"Migrated {len(data)} items.")

def migrate_recipes():
    # Previous logic relied on specific IDs (14,8 -> 32). 
    # With new IDs, those are invalid. We will clear the recipe migration for now.
    # In the future, we will add realistic recipes here.
    
    with Session(engine) as session:
         # Example placeholder recipe: Water (1) + All-Purpose Flour (2) -> Dough (Not in DB yet)
         # We need to add "Dough" to dataset1.json if we want it, or just rely on dynamic later.
         # For now, NO recipes are seeded to prevent crashes.
         pass

    print("Migrated recipes (None for now).")

def init_progression():
    # Unlock all base ingredients
    with open("../data/dataset1.json", "r") as f:
        data = json.load(f)
        
    with Session(engine) as session:
        for item in data:
            if item.get("isBase"):
                prog = Progression(item_id=item["id"], is_discovered=True, is_unlocked=True, mastery_count=0)
                session.add(prog)
        session.commit()
    print("Initialized core progression.")

if __name__ == "__main__":
    create_db_and_tables()
    migrate_items()
    migrate_recipes()
    init_progression()

