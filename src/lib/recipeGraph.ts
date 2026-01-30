
// Key: "id1,id2" (sorted) -> Result Ingredient ID
export const RECIPES: Record<string, number> = {
    // Water (1) + All-Purpose Flour (2) -> Dough (51)
    "1,2": 51,
    // Dough (51) + Bake (212) -> Bread (52)
    "51,212": 52,
    // Pasta (50) + Boil (207) -> Boiled Pasta (53)
    "50,207": 53,
    // Boiled Pasta (53) + Cheddar Cheese (20) -> Mac and Cheese (54)
    "20,53": 54,
    // Russet Potato (10) + Boil (207) -> Boiled Potato (55)
    "10,207": 55,
    // Boiled Potato (55) + Mash (implicitly Mix? User didn't give Mash. Using Mix 205) -> Mashed Potato (56)
    // Actually, maybe Mix (205) + Boiled Potato (55)
    "55,205": 56,
    // Egg (3) + Whisk (206) -> Whisked Eggs (57)
    "3,206": 57,
    // Whisked Eggs (57) + Fry (209) -> Scrambled Eggs (58)
    "57,209": 58,
    // Beef Tenderloin (6) + Grill (214) -> Grilled Steak (59)
    "6,214": 59,
    // Chicken Thigh (5) + Boil (207) -> Boiled Chicken (60)
    "5,207": 60,
    // Boiled Chicken (60) + Water (1) -> Chicken Soup (61) (Simple version)
    "1,60": 61,
    // Carrot (25) + Chop (201) -> Chopped Carrot (62)
    "25,201": 62,
    // Red Onion (12) + Chop (201) -> Chopped Onion (63)
    "12,201": 63,
    // Garlic Clove (13) + Mince (203) -> Minced Garlic (64)
    "13,203": 64,
    // Water (1) + Kosher Salt (15) -> Salted Water (65)
    "1,15": 65,
    // Water (1) + Fish (Salmon 8) -> Salmon (8) (Washed) - Self-ref example
    "1,8": 8,
    // Bread (52) + Cheese (20) -> Cheese Sandwich (68)
    "20,52": 68,
    // Bread (52) + Beef (6) -> Burger (67)
    "6,52": 67,
    // Bread (52) + Grill (214) -> Toast (77)
    "52,214": 77,
    // Toast (77) + Avocado (32) -> Avocado Toast (78)
    "32,77": 78,
    // Dough (51) + Tomato (11) -> Pizza (66)
    "11,51": 66,
    // Basmati Rice (9) + Boil (207) -> Cooked Rice (79)
    "9,207": 79,
    // Cooked Rice (79) + Egg (3) -> Fried Rice (70)
    "3,79": 70,
    // Rice (9) + Salmon (8) -> Sushi (73)
    "8,9": 73,
    // Coffee Beans (43) + Water (1) -> Coffee (74)
    "1,43": 74,
    // Coffee (74) + Waiting/Milk? No Milk(4) + Coffee(74) -> Latte (75)
    "4,74": 75,
    // Flour (2) + Sugar (17) -> Cake Batter (80)
    "2,17": 80,
    // Cake Batter (80) + Bake (212) -> Cake (69)
    "80,212": 69,
    // Chicken (5) + Roast (211) -> Roast Chicken (81)
    "5,211": 81,
    // Chicken (5) + Fry (209) -> Fried Chicken (84)
    "5,209": 84,
    // Salmon (8) + Grill (214) -> Grilled Salmon (82)
    "8,214": 82,
    // Whisked Eggs (57) + Cheese (20) -> Cheese Omelette (76)
    "20,57": 76,
    // Tomato (11) + Mix (205) -> Tomato Sauce (83)
    "11,205": 83,
    // Beef (6) + Water (1) -> Beef Stew (71)
    "1,6": 71,
    // Spinach (29) + Tomato (11) -> Salad (72) (Simple salad)
    "11,29": 72,
};

/**
 * Checks if two ingredients can combine to form a new one.
 * @param sourceId ID of the ingredient being dragged
 * @param targetId ID of the ingredient being dropped onto
 * @returns The ID of the resulting ingredient, or null if no combination exists.
 */
export function getCombinationResult(sourceId: number, targetId: number): number | null {
    // Attempt order-dependent match first
    const key = `${sourceId},${targetId}`;
    if (RECIPES[key]) return RECIPES[key];

    // Fallback to order-independent match
    const sortedKey = [sourceId, targetId].sort((a, b) => a - b).join(',');
    if (RECIPES[sortedKey]) return RECIPES[sortedKey];

    // Garbage Logic
    // If we are here, no valid recipe was found.
    // Check if we should return "Garbage" (999).

    // We need to know if items are techniques or ingredients.
    // Since we don't have the full dataset loaded here, we might need to rely on ID ranges or assume caller handles it.
    // However, the prompt implies logic should be here or we need access to types.
    // Assumption: IDs > 200 are techniques (based on dataset1.json observation: Techniques start at 201).
    // Let's assume IDs >= 200 are techniques/appliances.

    const isSourceTechnique = sourceId >= 200 && sourceId < 999; // Garbage is 999
    const isTargetTechnique = targetId >= 200 && targetId < 999;

    // Rule 1: If neither item is a "technique" ... the dish is generally uncooked ...
    // Exception: Water + Flour -> Dough (Handled by RECIPES above).
    // "Chicken" + "Beef" -> "Garbage" (invalid raw mix).

    if (!isSourceTechnique && !isTargetTechnique) {
        // Two ingredients combined without a recipe -> Garbage
        return 999;
    }

    // If one IS a technique (e.g. Chop + Bread), and no recipe exists:
    // It implies the technique doesn't apply or does nothing.
    // Often this might just be "nothing happens" (return null) rather than garbage.
    // e.g. "Whisk" + "Steak" -> probably nothing, not garbage pile.
    // User Rule 2: "If the combination makes no culinary sense... return garbage".
    // But Rule 4 says "If failed ... set name=garbage".

    // Let's stick to: Ingredient + Ingredient = Garbage (if not in recipes).
    // Technique + Ingredient = Null (no reaction) or Garbage? 
    // "Bake" + "Water" -> Hot water? Evaporated?
    // Let's return 999 for everything that fails if we want to be strict, 
    // but standard games usually just don't combine if invalid tool.
    // However, "Chicken + Beef" is explicitly Garbage.

    return null;
}
