import json
import re
from sqlmodel import Session, SQLModel, create_engine, select
from models import Item, Recipe, Progression
from database import engine, create_db_and_tables

def migrate_items():
    with open("../data/dataset1.json", "r") as f:
        data = json.load(f)
    
    with Session(engine) as session:
        for item_data in data:
            item = Item(
                id=item_data["id"],
                name=item_data["name"],
                type=item_data["type"],
                icon=item_data["icon"],
                isBase=item_data.get("isBase", False),
                directions=item_data.get("directions")
            )
            session.add(item)
        session.commit()
    print(f"Migrated {len(data)} items.")

def migrate_recipes():
    # Read recipeGraph.ts to extract patterns
    with open("../src/lib/recipeGraph.ts", "r") as f:
        content = f.read()

    # Extract static recipes
    static_recipes = re.findall(r'"(\d+,\d+)": (\d+)', content)
    
    with Session(engine) as session:
        # Static Recipes
        for key, result_id in static_recipes:
            source, target = map(int, key.split(","))
            recipe = Recipe(
                source_id=source,
                target_id=target,
                result_id=int(result_id),
                is_order_dependent=(key == "14,8") # Only one order-dependent for now as per code
            )
            session.add(recipe)
        
        # Dynamic Expansion: Spices
        spices = [13, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51]
        main_dishes = [22, 26, 31, 32, 33, 34, 35, 36, 37, 38, 39, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150]
        for dish in main_dishes:
            for spice in spices:
                # Check if static recipe already exists
                key = f"{min(dish, spice)},{max(dish, spice)}"
                # (Simple check for this migration)
                session.add(Recipe(source_id=dish, target_id=spice, result_id=dish))

        # Dynamic Expansion: Techniques
        techniques = [15, 16, 17, 18, 19, 20, 185, 186, 187, 188, 189, 190, 191]
        for ing in range(1, 151):
            for tech in techniques:
                if tech in [16, 19, 188, 190]: # Heat/Oven/Bake/Grill
                    if ing == 5: session.add(Recipe(source_id=ing, target_id=tech, result_id=22))
                    if ing == 21: session.add(Recipe(source_id=ing, target_id=tech, result_id=108))
                    if ing == 8: session.add(Recipe(source_id=ing, target_id=tech, result_id=32))

        session.commit()
    print("Migrated recipes.")

def init_progression():
    # Set initial core set as unlocked/mastered if needed, or just discovered
    core_set = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 185]
    with Session(engine) as session:
        for item_id in core_set:
            prog = Progression(item_id=item_id, is_discovered=True, is_unlocked=True, mastery_count=0)
            session.add(prog)
        session.commit()
    print("Initialized core progression.")

if __name__ == "__main__":
    create_db_and_tables()
    migrate_items()
    migrate_recipes()
    init_progression()
