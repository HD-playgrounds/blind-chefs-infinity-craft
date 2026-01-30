
import { getCombinationResult, RECIPES } from './recipeGraph';

function runTests() {
    let passed = 0;
    let failed = 0;

    function assert(condition: boolean, message: string) {
        if (condition) {
            console.log(`✅ ${message}`);
            passed++;
        } else {
            console.error(`❌ ${message}`);
            failed++;
        }
    }

    console.log("Running Recipe Tests...");

    // Test 1: Water + Flour -> Dough
    const doughId = getCombinationResult(1, 2);
    assert(doughId === 51, `Water (1) + Flour (2) should be Dough (51). Got: ${doughId}`);

    // Test 2: Dough + Bake -> Bread
    const breadId = getCombinationResult(51, 212);
    assert(breadId === 52, `Dough (51) + Bake (212) should be Bread (52). Got: ${breadId}`);

    // Test 3: Chicken (5) + Beef (6) -> Garbage (999) (Rule 1: Ingredient + Ingredient = Garbage)
    const garbageId = getCombinationResult(5, 6);
    assert(garbageId === 999, `Chicken (5) + Beef (6) should be Garbage (999). Got: ${garbageId}`);

    // Test 4: Whisk (206) + Steak (6) -> Null (Technique without recipe should return null/nothing, not garbage? Or garbage?)
    // My implementation returns null for (Technique + Ingredient) mismatch.
    const nullId = getCombinationResult(206, 6);
    assert(nullId === null, `Whisk (206) + Steak (6) should be null. Got: ${nullId}`);

    // Test 5: Water (1) + Salt (15) -> Salted Water (65)
    // Order independent check
    const saltedWaterId = getCombinationResult(15, 1);
    assert(saltedWaterId === 65, `Salt (15) + Water (1) should be Salted Water (65). Got: ${saltedWaterId}`);

    console.log(`\nTests Completed: ${passed} Passed, ${failed} Failed.`);
}

runTests();
