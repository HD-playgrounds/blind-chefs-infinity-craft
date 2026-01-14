
// Key: "id1,id2" (sorted) -> Result Ingredient ID
export const RECIPES: Record<string, number> = {
    // Flour (2) + Oven (19) -> Bread (26)
    "2,19": 26,
    // Meat (5) + Fire (16) -> Beef (22) (Approximation for "Cooked Meat")
    "5,16": 22,
    // Potato (8) + Oil (14) -> Fry (28) (Just a test, maybe chips? But Fry is a technique. Let's use Fry technique)
    // Actually, let's say Pan (18) + Oil (14) -> Fry (28)? That's weird.
    // Let's stick to item combinations.

    // Water (1) + Rice (7) -> ? (No cooked rice item)
    // Sugar (12) + Water (1) -> ?

    // Let's add more logical ones if possible, or just stick to the safe ones.
    // Bread (26) + Cheese (25) -> ? (Sandwich? Not in list)
};

/**
 * Checks if two ingredients can combine to form a new one.
 * @param id1 ID of first ingredient
 * @param id2 ID of second ingredient
 * @returns The ID of the resulting ingredient, or null if no combination exists.
 */
export function getCombinationResult(id1: number, id2: number): number | null {
    const key = [id1, id2].sort((a, b) => a - b).join(',');
    return RECIPES[key] || null;
}
