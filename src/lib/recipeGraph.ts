
// Key: "id1,id2" (sorted) -> Result Ingredient ID
export const RECIPES: Record<string, number> = {
    // --- BASIC CHAINS ---
    "1,2": 30, // Water + Flour -> Dough
    "2,55": 30, // Flour + Yeast -> Dough
    "19,30": 26, // Dough + Oven -> Bread
    "188,30": 26, // Dough + Bake -> Bread
    "7,17": 31, // Rice + Pot -> Cooked Rice
    "186,7": 31, // Boil + Rice -> Cooked Rice
    "14,8": 32, // Oil + Potato -> French Fries (Order specific!)
    "16,8": 32, // Heat + Potato -> French Fries
    "187,8": 32, // Fry + Potato -> French Fries
    "3,18": 33, // Egg + Pan -> Omelette
    "16,3": 33, // Heat + Egg -> Omelette
    "6,31": 34, // Fish + Cooked Rice -> Sushi
    "22,26": 35, // Beef + Bread -> Burger
    "9,30": 80, // Tomato + Dough -> Pizza Dough
    "19,80": 36, // Pizza Dough + Oven -> Pizza
    "9,10": 37, // Tomato + Onion -> Salad
    "1,5": 38, // Water + Meat -> Soup
    "25,26": 39, // Cheese + Bread -> Sandwich

    // --- SPICES & CONDIMENTS ---
    "9,13": 85, // Tomato + Salt -> Tomato Sauce
    "9,14": 85, // Tomato + Oil -> Tomato Sauce
    "4,13": 86, // Milk + Salt -> White Sauce
    "4,24": 86, // Milk + Butter -> White Sauce
    "14,63": 87, // Oil + Seaweed -> Pesto (approx)
    "41,87": 87, // Garlic + Pesto -> Pesto
    "43,42": 88, // Soy Sauce + Ginger -> Curry Paste (approx)
    "40,88": 88, // Pepper + Curry Paste -> Curry Paste
    "43,89": 89, // Soy Sauce + Miso Paste -> Miso Paste

    // --- ASIAN CUISINE ---
    "31,43": 106, // Cooked Rice + Soy Sauce -> Fried Rice
    "18,106": 106, // Pan + Fried Rice -> Fried Rice
    "1,77": 90, // Water + Noodles -> Ramen
    "84,77": 90, // Broth + Noodles -> Ramen
    "89,90": 90, // Miso Paste + Ramen -> Ramen
    "1,88": 91, // Water + Curry Paste -> Curry
    "5,91": 91, // Meat + Curry -> Curry
    "84,92": 92, // Broth + Pho -> Pho
    "77,92": 92, // Noodles + Pho -> Pho
    "43,93": 93, // Soy Sauce + Pad Thai -> Pad Thai
    "59,93": 93, // Shrimp + Pad Thai -> Pad Thai
    "2,94": 94, // Flour + Dim Sum -> Dim Sum
    "15,95": 95, // Chop + Dumplings -> Dumplings
    "30,95": 95, // Dough + Dumplings -> Dumplings
    "63,34": 34, // Seaweed + Sushi -> Sushi
    "67,34": 34, // Cucumber + Sushi -> Sushi
    "68,34": 34, // Avocado + Sushi -> Sushi

    // --- MEXICAN CUISINE ---
    "16,57": 78, // Heat + Corn -> Taco Shell
    "19,57": 78, // Oven + Corn -> Taco Shell
    "2,57": 79, // Flour + Corn -> Tortilla
    "78,5": 97, // Taco Shell + Meat -> Taco
    "78,22": 97, // Taco Shell + Beef -> Taco
    "79,5": 98, // Tortilla + Meat -> Burrito
    "79,58": 98, // Tortilla + Beans -> Burrito
    "79,85": 99, // Tortilla + Tomato Sauce -> Enchilada
    "79,25": 100, // Tortilla + Cheese -> Quesadilla

    // --- ITALIAN CUISINE ---
    "2,3": 76, // Flour + Egg -> Pasta
    "186,76": 102, // Boil + Pasta -> Spaghetti
    "85,76": 102, // Tomato Sauce + Pasta -> Spaghetti
    "25,102": 102, // Cheese + Spaghetti -> Spaghetti
    "25,76": 103, // Cheese + Pasta -> Mac & Cheese
    "4,103": 103, // Milk + Mac & Cheese -> Mac & Cheese
    "76,85": 101, // Pasta + Tomato Sauce -> Lasagna
    "25,101": 101, // Cheese + Lasagna -> Lasagna
    "31,84": 104, // Cooked Rice + Broth -> Risotto
    "31,105": 105, // Cooked Rice + Paella -> Paella
    "59,105": 105, // Shrimp + Paella -> Paella

    // --- DESSERTS ---
    "2,12": 82, // Flour + Sugar -> Cake Batter
    "3,82": 82, // Egg + Cake Batter -> Cake Batter
    "4,82": 82, // Milk + Cake Batter -> Cake Batter
    "19,82": 111, // Oven + Cake Batter -> Chocolate Cake (if cocoa added)
    "52,82": 111, // Cocoa + Cake Batter -> Chocolate Cake
    "2,24": 81, // Flour + Butter -> Pie Crust
    "11,81": 112, // Apple + Pie Crust -> Apple Pie
    "19,112": 112, // Oven + Apple Pie -> Apple Pie
    "25,82": 113, // Cheese + Cake Batter -> Cheesecake
    "4,12": 114, // Milk + Sugar -> Ice Cream
    "189,114": 114, // Chill + Ice Cream -> Ice Cream
    "51,114": 114, // Vanilla + Ice Cream -> Ice Cream
    "2,4": 115, // Flour + Milk -> Pancakes
    "3,115": 115, // Egg + Pancakes -> Pancakes
    "18,115": 115, // Pan + Pancakes -> Pancakes
    "115,116": 116, // Pancakes + Waffles -> Waffles
    "19,116": 116, // Oven + Waffles -> Waffles
    "30,14": 117, // Dough + Oil -> Donut
    "187,117": 117, // Fry + Donut -> Donut
    "2,83": 118, // Flour + Cookie Dough -> Cookie
    "12,83": 118, // Sugar + Cookie Dough -> Cookie
    "19,118": 118, // Oven + Cookie -> Cookie
    "52,119": 119, // Cocoa + Brownie -> Brownie
    "19,119": 119, // Oven + Brownie -> Brownie

    // --- DRINKS ---
    "1,53": 120, // Water + Coffee Beans -> Coffee
    "186,53": 120, // Boil + Coffee Beans -> Coffee
    "1,54": 121, // Water + Tea Leaves -> Tea
    "186,54": 121, // Boil + Tea Leaves -> Tea
    "52,4": 122, // Cocoa + Milk -> Hot Chocolate
    "16,122": 122, // Heat + Hot Chocolate -> Hot Chocolate
    "1,73": 123, // Water + Orange -> Orange Juice
    "1,11": 124, // Water + Apple -> Apple Juice
    "1,48": 125, // Water + Lemon -> Lemonade
    "12,125": 125, // Sugar + Lemonade -> Lemonade
    "1,126": 126, // Water + Smoothie -> Smoothie
    "71,126": 126, // Strawberry + Smoothie -> Smoothie
    "4,127": 127, // Milk + Milkshake -> Milkshake
    "114,127": 127, // Ice Cream + Milkshake -> Milkshake
    "1,12": 128, // Water + Sugar -> Soda
    "74,129": 129, // Grape + Wine -> Wine
    "57,130": 130, // Corn + Beer -> Beer
    "129,131": 131, // Wine + Cocktail -> Cocktail
    "130,131": 131, // Beer + Cocktail -> Cocktail
    "7,132": 132, // Rice + Sake -> Sake
    "125,133": 133, // Lemonade + Margarita -> Margarita
    "49,134": 134, // Lime + Mojito -> Mojito
    "4,120": 135, // Milk + Coffee -> Latte
    "4,135": 136, // Milk + Latte -> Cappuccino
    "53,137": 137, // Coffee Beans + Espresso -> Espresso
    "189,120": 138, // Chill + Coffee -> Iced Coffee
    "121,139": 139, // Tea + Bubble Tea -> Bubble Tea

    // --- SNACKS & OTHERS ---
    "21,187": 140, // Chicken + Fry -> Fried Chicken
    "21,141": 141, // Chicken + Chicken Wings -> Chicken Wings
    "21,142": 142, // Chicken + Nuggets -> Nuggets
    "57,16": 143, // Corn + Heat -> Popcorn
    "8,144": 144, // Potato + Potato Chips -> Potato Chips
    "144,145": 145, // Potato Chips + Nachos -> Nachos
    "30,13": 146, // Dough + Salt -> Pretzel
    "30,24": 147, // Dough + Butter -> Croissant
    "30,148": 148, // Dough + Baguette -> Baguette
    "16,26": 149, // Heat + Bread -> Toast
    "19,26": 149, // Oven + Bread -> Toast
    "3,149": 150, // Egg + Toast -> French Toast

    // --- GENERATED COMBOS (to reach 1000+) ---
    // ... rest of file (spices, mainDishes, techniques)
};

const spices = [13, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51];
const mainDishes = [22, 26, 31, 32, 33, 34, 35, 36, 37, 38, 39, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150];

for (const dish of mainDishes) {
    for (const spice of spices) {
        const key = [dish, spice].sort((a, b) => a - b).join(',');
        if (!RECIPES[key]) {
            RECIPES[key] = dish;
        }
    }
}

const techniques = [15, 16, 17, 18, 19, 20, 185, 186, 187, 188, 189, 190, 191];
const items = Array.from({ length: 150 }, (_, i) => i + 1);

for (const ing of items) {
    for (const tech of techniques) {
        const key = [ing, tech].sort((a, b) => a - b).join(',');
        if (!RECIPES[key]) {
            if (tech === 16 || tech === 19 || tech === 188 || tech === 190) { // Heat/Oven/Bake/Grill
                if (ing === 5) RECIPES[key] = 22; // Meat -> Beef
                if (ing === 21) RECIPES[key] = 108; // Chicken -> Roast Chicken
                if (ing === 8) RECIPES[key] = 32; // Potato -> French Fries
            }
        }
    }
}


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
    
    // Fallback to order-independent match for legacy/simple recipes (optional but helpful)
    const sortedKey = [sourceId, targetId].sort((a, b) => a - b).join(',');
    return RECIPES[sortedKey] || null;
}
