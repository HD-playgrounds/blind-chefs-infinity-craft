
// Key: "id1,id2" (sorted) -> Result Ingredient ID
export const RECIPES: Record<string, number> = {
    // Recipes will be re-populated as we implement realism
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
    return RECIPES[sortedKey] || null;
}
