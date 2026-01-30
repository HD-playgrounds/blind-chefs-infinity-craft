import requests
import time

BASE_URL = "http://localhost:8000"

def seed_recipes():
    print("Seeding recipes via API...")
    
    # Define pairs to seed (Source ID, Target ID)
    # IDs refer to:
    # 5: Chicken Thigh
    # 6: Beef Tenderloin
    # 9: Basmati Rice
    # 10: Russet Potato
    # 50: Pasta
    # Techniques:
    # 211: Roast
    # 214: Grill
    # 209: Fry
    # 207: Boil
    
    pairs = [
        (5, 211), # Chicken + Roast -> Roast Chicken
        (6, 214), # Beef + Grill -> Grilled Beef
        (10, 209), # Potato + Fry -> Fries
        (50, 207), # Pasta + Boil -> Cooked Pasta
        (9, 207),  # Rice + Boil -> Cooked Rice
        (1, 207),  # Water + Boil -> Hot Water/Steam (Test)
        (5, 6),    # Chicken + Beef -> Garbage (Test validation)
    ]

    for source, target in pairs:
        print(f"Combining {source} + {target}...")
        try:
            response = requests.post(f"{BASE_URL}/combine", params={"source_id": source, "target_id": target})
            if response.status_code == 200:
                data = response.json()
                print(f"Result: ID {data.get('result_id')} (Unlocked: {data.get('is_unlocked')})")
            else:
                print(f"Error: {response.text}")
        except Exception as e:
            print(f"Request failed: {e}")
        
        # Polite delay for LLM
        time.sleep(1)

if __name__ == "__main__":
    seed_recipes()
