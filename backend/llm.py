import json
import logging
import os
from typing import List, Dict

from dotenv import load_dotenv
from openai import AsyncOpenAI

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

_client = AsyncOpenAI(api_key=os.environ["OPEN_AI_API_KEY"])

MODEL = "gpt-4o-mini"


async def get_culinary_outcomes(source_name: str, source_type: str, target_name: str, target_type: str) -> List[Dict[str, str]]:
    """
    Asks OpenAI to provide the best culinary outcome for combining two items.
    Returns a list with a single dictionary containing 'name', 'directions', and 'icon'.
    """
    prompt = f"""You are a creative Master Chef in a realistic cooking game.
The player is combining:
1. "{source_name}" (Type: {source_type})
2. "{target_name}" (Type: {target_type})

Determine the result of this combination.

Rules:
1. **Be Creative and Generous**: Most ingredient combinations have a valid culinary result — mixing, marinating, enriching, coating, folding, etc. Lean toward finding a valid output.
   - "Dough" + "Egg" -> "Egg Dough" (enriched pasta dough — totally valid).
   - "Water" + "Flour" -> "Dough" (valid mixture).
   - "Flour" + "Butter" -> "Shortcrust" (valid mixture).
2. **Technique amplifies**: If one item is a technique or appliance, the result is a cooked/processed version of the other.
   - "Chicken Thigh" + "Roast" -> "Roast Chicken".
3. **Self-Referentiality**: A recipe can result in one of the inputs if it makes sense (e.g., washing/prepping).
   - "Water" + "Fish" -> "Fish" (Washed Fish).
4. **Garbage only for truly nonsensical combos**: Only return garbage if there is genuinely no culinary logic — e.g., two incompatible raw proteins with no binding purpose, or completely unrelated items.
   - "Chicken" + "Beef" -> "Garbage" (pointless raw meat mix).
   - If in doubt, find a creative result instead of garbage.
5. **Garbage Output**: If failed, set name="garbage", directions="You failed...", icon="🗑️".

Format your response as a JSON object:
{{"name": "Dish Name", "directions": "Brief instructions...", "icon": "emoji"}}

Examples:
- Input: "Water" (ingredient) + "Fish" (ingredient)
  Output: {{"name": "Fish", "directions": "You washed the fish.", "icon": "🐟"}}
- Input: "Dough" (ingredient) + "Egg" (ingredient)
  Output: {{"name": "Egg Dough", "directions": "Enriched dough with egg — perfect for fresh pasta.", "icon": "🍝"}}
- Input: "Chicken Thigh" (ingredient) + "Roast" (technique)
  Output: {{"name": "Roast Chicken", "directions": "Roasted until golden brown.", "icon": "🍗"}}
- Input: "Chicken Thigh" (ingredient) + "Beef Tenderloin" (ingredient)
  Output: {{"name": "garbage", "directions": "Raw meat pile. Not successful.", "icon": "🗑️"}}

Provide ONLY the JSON object.
"""

    try:
        logger.info(f"LLM Request - Combining: '{source_name}' ({source_type}) + '{target_name}' ({target_type})")
        response = await _client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": "You are a helpful assistant that only outputs short, concise JSON."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=150,
        )

        content = response.choices[0].message.content or ""
        logger.info(f"LLM Response raw content: {content}")

        # Strip markdown code fences if present
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()

        outcome = json.loads(content)
        return [outcome]

    except Exception as e:
        logger.error(f"Error calling OpenAI: {e}")
        return []
