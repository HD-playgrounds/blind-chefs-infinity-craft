import httpx
import json
import logging
from typing import List, Dict, Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# LM Studio default is often 1234, but we'll make it configurable
LM_STUDIO_BASE_URL = "http://localhost:1234/v1"

async def get_culinary_outcomes(source_name: str, target_name: str) -> List[Dict[str, str]]:
    """
    Asks LM Studio to provide the best culinary outcome for combining two items.
    Returns a list with a single dictionary containing 'name', 'directions', and 'icon'.
    """
    prompt = f"""You are a Master Chef in a realistic cooking game.
The player is combining: "{source_name}" and "{target_name}. First determine if the two ingredients will generate a successful mix.
We will have ingredients and cooking techniques, if no technique is applied, assume that it is uncooked.
If not, return 'garbage' as the name, 'You failed to create a successful mix.' as the directions, and '🗑️' as the icon.
If so, provide the single best, most creative and logical culinary outcome that results from this combination. Be realistic.
Provide:
1. A short name (1-3 words).
2. A brief set of directions (1 sentence).
3. A single emoji that represents the dish.

Format your response as a JSON object:
{{"name": "Dish Name", "directions": "Brief instructions...", "icon": "emoji"}}

Rules:
- Be creative but logical.
- The results should be culinary in nature (dishes, sauces, prepared ingredients, or techniques).
- Return ONLY the JSON object.

Important:
- Make sure we validate if the dish is successful or not. If not, return 'garbage' as the name, 'You failed to create a successful mix.' as the directions, and '🗑️' as the icon.
- If the dish is successful, return the name of the dish, the directions, and the icon.
- If there is no cooking technique such as "bake", "fry", assume the dish is not cooked.

Example:
Input: "water" and "fish"
Output: {{"name": "fish", "directions": "You failed to create a successful mix.", "icon": "🗑️"}}

Input: "water" and "fire"
Output: {{"name": "steam", "directions": "You successfully created steam.", "icon": "💨"}}

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
            # Ensure it's returned as a list for compatibility with the existing backend loop
            return [outcome]

    except Exception as e:
        logger.error(f"Error calling LM Studio: {e}")
        return []
