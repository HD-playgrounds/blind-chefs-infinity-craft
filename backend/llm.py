import httpx
import json
import logging
from typing import List, Dict, Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# LM Studio default is often 1234, but we'll make it configurable
LM_STUDIO_BASE_URL = "http://localhost:1234/v1"

async def get_culinary_outcomes(source_name: str, source_type: str, target_name: str, target_type: str) -> List[Dict[str, str]]:
    """
    Asks LM Studio to provide the best culinary outcome for combining two items.
    Returns a list with a single dictionary containing 'name', 'directions', and 'icon'.
    """
    prompt = f"""You are a Master Chef in a realistic cooking game.
The player is combining:
1. "{source_name}" (Type: {source_type})
2. "{target_name}" (Type: {target_type})

Determine the result of this combination.

Rules:
1. **Technique Requirement**: If neither item is a "technique" (and neither is an Appliance acting as one), the dish is generally **uncooked** or a simple mixture.
   - Exception: "Water" + "Flour" -> "Dough" (valid mixture).
   - "Chicken" + "Beef" -> "Garbage" (invalid raw mix).
2. **Success Validation**: If the combination makes no culinary sense or yields an inedible/failed mess, return "garbage".
3. **Self-Referentiality**: A recipe can result in one of the inputs if it makes sense (e.g., washing/prepping).
   - Example: "Water" + "Fish" -> "Fish" (Washed Fish). 
   - Example: "Chop" + "Carrot" -> "Chopped Carrot" (if one is a tool/technique).
4. **Garbage Output**: If failed, set name="garbage", directions="You failed...", icon="🗑️".

Format your response as a JSON object:
{{"name": "Dish Name", "directions": "Brief instructions...", "icon": "emoji"}}

Examples:
- Input: "Water" (ingredient) + "Fish" (ingredient)
  Output: {{"name": "Fish", "directions": "You washed the fish.", "icon": "🐟"}}
- Input: "Chicken Thigh" (ingredient) + "Roast" (technique)
  Output: {{"name": "Roast Chicken", "directions": "Roasted until golden brown.", "icon": "🍗"}}
- Input: "Chicken Thigh" (ingredient) + "Beef Tenderloin" (ingredient)
  Output: {{"name": "garbage", "directions": "Raw meat pile. Not successful.", "icon": "🗑️"}}

Provide ONLY the JSON object.
"""

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{LM_STUDIO_BASE_URL}/chat/completions",
                json={
                    "messages": [
                        {"role": "system", "content": "You are a helpful assistant that only outputs short, concise JSON."},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.7,
                    "max_tokens": 150,
                }
            )
            
            if response.status_code != 200:
                logger.error(f"LM Studio returned status {response.status_code}: {response.text}")
                return []

            result = response.json()
            content = result["choices"][0]["message"]["content"]
            
            # Extract JSON if the model included prose (safety)
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            
            outcome = json.loads(content)
            return [outcome]

    except Exception as e:
        logger.error(f"Error calling LM Studio: {e}")
        return []
