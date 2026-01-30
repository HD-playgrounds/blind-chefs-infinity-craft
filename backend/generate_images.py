import os
import json
import asyncio
import dashscope
from dashscope.aigc.image_generation import ImageGeneration
from dashscope.api_entities.dashscope_response import Message
import aiohttp
import logging
from pathlib import Path
from dotenv import load_dotenv

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load .env from root (parent of backend)
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

# Constants
API_KEY = os.getenv("DASHSCOPE_API_KEY")
# Try International Endpoint (Singapore)
dashscope.base_http_api_url = 'https://dashscope-intl.aliyuncs.com/api/v1' 
DATASET_PATH = Path("../data/dataset1.json")
OUTPUT_DIR = Path("../public/images/ingredients")
MODEL_NAME = "wan2.6-image"
MAX_CONCURRENT_REQUESTS = 5  # Semaphore to control concurrency

if not API_KEY:
    raise ValueError("DASHSCOPE_API_KEY environment variable is not set")

if not DATASET_PATH.exists():
    raise FileNotFoundError(f"Dataset not found at {DATASET_PATH}")

if not OUTPUT_DIR.exists():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

class ImageGenerator:
    def __init__(self):
        self.semaphore = asyncio.Semaphore(MAX_CONCURRENT_REQUESTS)

    async def generate_image(self, ingredient):
        ingredient_id = ingredient.get("id")
        name = ingredient.get("name")
        output_path = OUTPUT_DIR / f"{ingredient_id}.png"

        if output_path.exists():
            logger.info(f"Image for {name} (ID: {ingredient_id}) already exists. Skipping.")
            return

        prompt = f"You are an illustrator for a realistic cooking simulator game, and your task is to illustrate individual ingredients or cooking techniques. generate an illustration of the ingredient '{name}', watercolor & semi-realistic style on a sticker, transparent background"
        logger.info(f"Generating image for {name} (ID: {ingredient_id}) with prompt: '{prompt}'")

        async with self.semaphore:
            try:
                # Construct the message for the API
                # Wan 2.6 expects a specific format according to the guides
                message = Message(
                    role="user",
                    content=[{"text": prompt}]
                )
                
                # Using the async call from the SDK
                # Note: The guide shows async_call returns a task, then we need to wait for it.
                # However, for simplicity and speed handling multiple requests, we might want to just fire them.
                # But since it's an async API that returns a task ID, we need to poll.
                # To make this efficient, we'll start the task and then have a poller.
                
                # IMPORTANT: The dashscope SDK's async_call is a synchronous method that returns a response 
                # containing the task_id. The actual generation is async on the server.
                # We need to wrap the SDK call in a ThreadPool or use it as is if it's fast enough 
                # (it just makes an HTTP request).
                # But wait, looking at the guide: 
                # response = ImageGeneration.async_call(...)
                # This returns immediately with a task_id.
                
                response = ImageGeneration.async_call(
                    model=MODEL_NAME,
                    api_key=API_KEY,
                    messages=[message],
                    n=1,
                    size="1280*1280", # Standard size
                    enable_interleave=True # Using text-to-image mode
                )
                
                if response.status_code != 200:
                    logger.error(f"Failed to create task for {name}: {response.code} - {response.message}")
                    return

                task_id = response.output.task_id
                logger.info(f"Task created for {name}, Task ID: {task_id}")
                
                # Poll for completion
                await self.wait_for_task(task_id, name, output_path)

            except Exception as e:
                logger.error(f"Error generating image for {name}: {str(e)}")

    async def wait_for_task(self, task_id, name, output_path):
        retries = 0
        max_retries = 60 # Wait up to ~2-3 minutes? Guide says 1-2 mins.
        
        while retries < max_retries:
            await asyncio.sleep(5) # Poll every 5 seconds
            try:
                # ImageGeneration.wait is synchronous and blocks. We should avoid blocking the event loop.
                # Ideally we use fetch() which is also sync but fast? 
                # Actually, let's use the SDK's wait method but run it in an executor if needed, 
                # or just use fetch() in a loop which is what we are doing here manually.
                # The SDK has a fetch method.
                
                # Using run_in_executor to avoid blocking the async loop with sync network calls
                loop = asyncio.get_running_loop()
                status = await loop.run_in_executor(None, lambda: ImageGeneration.fetch(task=task_id, api_key=API_KEY))
                
                if status.output.task_status == "SUCCEEDED":
                    logger.info(f"Task succeeded response: {status}")
                    # Find image in content list
                    image_url = None
                    for item in status.output.choices[0].message.content:
                        if 'image' in item:
                            image_url = item['image']
                            break
                    
                    if image_url:
                        logger.info(f"Task succeeded for {name}. Downloading image from {image_url}")
                        await self.download_image(image_url, output_path)
                    else:
                        logger.error(f"Task succeeded but no image found in content: {status.output.choices[0].message.content}")
                    
                    return
                elif status.output.task_status in ["FAILED", "CANCELED"]:
                    logger.error(f"Task failed for {name}: {status.output.code} - {status.output.message}")
                    return
                
                # If RUNNING or PENDING, continue loop
                logger.debug(f"Task for {name} is {status.output.task_status}...")
                retries += 1
            except Exception as e:
                logger.error(f"Error polling task for {name}: {str(e)}")
                return

        logger.error(f"Timeout waiting for task for {name}")

    async def download_image(self, url, path):
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status == 200:
                    with open(path, 'wb') as f:
                        f.write(await response.read())
                    logger.info(f"Saved image to {path}")
                else:
                    logger.error(f"Failed to download image for {url}: Status {response.status}")

async def main():
    with open(DATASET_PATH, 'r') as f:
        ingredients = json.load(f)

    # Filter for ingredients only (type == "ingredient")
    target_ingredients = [item for item in ingredients if item.get("type") == "ingredient"]
    
    # LIMIT TO 1 FOR TESTING
    target_ingredients = target_ingredients[:1]

    logger.info(f"Found {len(target_ingredients)} ingredients. Starting generation...")
    
    generator = ImageGenerator()
    tasks = [generator.generate_image(ing) for ing in target_ingredients]
    
    # Run all tasks concurrently (limited by semaphore)
    await asyncio.gather(*tasks)
    logger.info("All tasks completed.")

if __name__ == "__main__":
    asyncio.run(main())


## To run the image gen, run venv/bin/python generate_images.py