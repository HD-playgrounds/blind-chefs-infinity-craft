The Wan image generation model supports **image editing**, **mixed text-and-image output** to meet diverse generation and integration needs.

## Model overview

| **Model** | **Description** | **Output image specifications** |
| --- | --- | --- |
| wan2.6-image | Wan2.6 image Supports image editing and mixed text-and-image output. | Image format: PNG. For image resolution and dimensions, see the [size parameter](#249489db9c7rf). |

**Note**

Before making a call, see the [model list and pricing](/help/en/model-studio/model-pricing#e2540d71a2utl) for each region.

## Prerequisites

You must [obtain an API key](/help/en/model-studio/get-api-key) and [set the API key as an environment variable](/help/en/model-studio/configure-api-key-through-environment-variables).

**Important**

The Singapore, Virginia, and Beijing regions have separate **API keys** and **request endpoints**. Do not use them interchangeably. Cross-region calls result in authentication failures or service errors. For more information, see [Select a region and deployment mode](/help/en/model-studio/regions/).

## **HTTP synchronous call**

Get results in a single request. This simple process is recommended for most scenarios.

**Singapore**: `POST https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation`

**US (Virginia)**: `POST https://dashscope-us.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation`

**China (Beijing)**: `POST https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation`

| #### Request parameters | ## **Image editing** ``` curl --location 'https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation' \\ --header 'Content-Type: application/json' \\ --header "Authorization: Bearer $DASHSCOPE_API_KEY" \\ --data '{ "model": "wan2.6-image", "input": { "messages": [ { "role": "user", "content": [ { "text": "Generate an image of scrambled eggs with tomatoes using the style of image 1 and the background of image 2" }, { "image": "https://cdn.wanx.aliyuncs.com/tmp/pressure/umbrella1.png" }, { "image": "https://img.alicdn.com/imgextra/i3/O1CN01SfG4J41UYn9WNt4X1_!!6000000002530-49-tps-1696-960.webp" } ] } ] }, "parameters": { "prompt_extend": true, "watermark": false, "n": 1, "enable_interleave": false, "size": "1280*1280" } }' ``` ## **Mixed text-and-image output (streaming only)** When mixed text-and-image output is enabled (that is, `parameters.enable_interleave = true`), the synchronous API **only supports streaming output**. Both of the following configuration requirements must be met: - Set `X-DashScope-Sse` to `enable`. - Set `parameters.stream` to `true`. ``` curl --location 'https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation' \\ --header 'Content-Type: application/json' \\ --header "Authorization: Bearer $DASHSCOPE_API_KEY" \\ --header 'X-DashScope-Sse: enable' \\ --data '{ "model": "wan2.6-image", "input": { "messages": [ { "role": "user", "content": [ { "text": "Give me a 3-image tutorial for stir-fried pork with chili peppers" } ] } ] }, "parameters": { "max_images": 3, "size": "1280*1280", "stream": true, "enable_interleave":true } }' ``` |
| --- | --- |
| ##### Headers |
| **Content-Type** `*string*` **(Required)** The content type of the request. You must set this parameter to `application/json`. |
| **Authorization** `*string*` **(Required)** The authentication credentials. This API uses a Model Studio API key for authentication. For example, \\`Bearer sk-xxxx\\`. |
| **X-DashScope-Sse** `*string*` (Optional) Enables streaming output. - When `parameters.enable_interleave=true`, this field **must** be set to `**enable**`. - In other cases, this parameter can be omitted or ignored. |
| ##### Request Body |
| **model** `*string*` **(Required)** The model name. Set to wan2.6-image. |
| **input** `*object*` **(Required)** Basic input information. **Properties** **messages** `*array*` **(Required)** An array of request content. Currently, **only single-turn conversations are supported**. This means you pass one set of role and content parameters. Multi-turn conversations are not supported. **Properties** **role** `*string*` **(Required)** The role of the message. This parameter must be set to `user`. **content** `*array*` **(Required)** An array of message content. **Properties** **text** `*string*` **(Required)** The positive prompt. It describes the content, style, and composition of the image you want to generate. This parameter supports Chinese and English, with a maximum length of 2,000 characters. Each Chinese character, letter, number, or symbol counts as one character. Any excess characters are automatically truncated. For example: Generate an image of scrambled eggs with tomatoes in the style of this reference picture. **Note**: The `content` array must contain exactly one object with a `text` field. **image** `*string*` (Optional) The URL or Base64-encoded string of the input image. Image limits: - Image format: JPEG, JPG, PNG (alpha channel not supported), BMP, WEBP. - Image resolution: The width and height of the image must both be in the range of \\[384, 5000\\] pixels. - File size: Does not exceed 10 MB. Image quantity limits: - The number of input images depends on the `parameters.enable_interleave` parameter. - When `enable_interleave=true` (mixed text-and-image output), you can input **0 to 1** image. - When `enable_interleave=false` (image editing), you **must** input **1 to 4** images. - To input multiple images, pass multiple `image` objects in the `content` array. The order of the images is defined by their order in the array. Supported input formats: 1. Publicly accessible URL - Supports HTTP or HTTPS protocol. - Example: `http://wanx.alicdn.com/material/xxx.jpeg`. 2. A string containing a Base64-encoded image - Format: data:{MIME\\_type};base64,{base64\\_data} - Example: data:image/jpeg;base64,GDU7MtCZzEbTbmRZ... (for illustration only; the complete string must be provided) - For Base64 encoding specifications, see [Image input methods](/help/en/model-studio/wan-image-edit-2-5#8db0e2215frua). |
| **parameters** `*object*` (Optional) Image editing parameters. **Properties** **negative\\_prompt** `*string*` (Optional) A negative prompt that describes the content that you do not want to see in the image. It can be used to constrain the image generation. The maximum length is 500 characters. This parameter supports both Chinese and English. Excess characters are automatically truncated. Example: low resolution, low quality, deformed limbs, deformed fingers, oversaturated, waxy, no facial details, overly smooth, AI-like, chaotic composition, blurry text, distorted text. **size** `*string*` (Optional) The resolution of the output image, in the format of `**width*height**`. - wan2.6-image: The total number of pixels must be between 768\\*768 and 1280\\*1280 (from 589,824 to 1,638,400 pixels), and the aspect ratio must be between 1:4 and 4:1. For example, 1024\\*1536 is a valid resolution. Example: 1280\\*1280. **Recommended resolutions for common aspect ratios** - 1:1: 1280\\*1280 or 1024\\*1024 - 2:3: 800\\*1200 - 3:2: 1200\\*800 - 3:4: 960\\*1280 - 4:3: 1280\\*960 - 9:16: 720\\*1280 - 16:9: 1280\\*720 - 21:9: 1344\\*576 **Rules for output image dimensions** Method 1: Specify the `size` parameter. The output image is generated strictly according to the width and height specified by `size`. Method 2: Do not specify `size`. The output image dimensions are determined by both the maximum total pixels and the aspect ratio rules. The system processes the image based on the total pixels and aspect ratio rules before outputting it. - Total pixel rule: Controlled by `enable_interleave`. - When `enable_interleave=true`: - If the total pixels of the input image are ≤ 1280\\*1280, the output has the same total pixels as the input. - If the total pixels of the input image are > 1280\\*1280, the output total pixels are fixed at 1280\\*1280. - When `enable_interleave=false`: The output total pixels are fixed at 1280\\*1280. - Aspect ratio rule (approximate): - Single-image input: The output aspect ratio is the same as the input image. - Multi-image input: The output aspect ratio is the same as the last input image. > Example: When `enable_interleave=true` and a 720\\*720 image is input, the output image is 720\\*720, matching the input aspect ratio. **enable\\_interleave** `*bool*` (Optional) This parameter controls the image generation mode: - false (default): This indicates image edit mode, which supports multi-image input and subject consistency generation. - Use case: Edit, perform style transfer, or generate images with subject consistency based on one to four input images. - Input: You must provide at least one reference image. - Output: You can generate one to four result images. - true: This enables mixed text-and-image output mode, which supports passing one image or no image. - Use case: Generate content with both text and images based on a text description, or generate an image from text only (text-to-image). - Input: You can provide no image (for text-to-image) or up to one reference image. - Output: Generates content that contains a mix of text and images. **n** `*integer*` (Optional) **Important** The n parameter directly affects the cost. The cost is calculated as follows: Cost = Unit price × Number of successfully generated images. Before making a call, confirm the [model pricing](/help/en/model-studio/model-pricing#e2540d71a2utl). Specifies the number of images to generate. The value range and meaning of this parameter depend on the state of enable\\_interleave (mode switch): - When `enable_interleave=false` (image edit mode): - Function: Directly controls the number of generated images. - Value range: 1 to 4. Default: 4. - During testing, set this value to 1 for low-cost verification. - When `enable_interleave=true` (mixed text-and-image mode): - Restriction: This parameter defaults to 1 and must be fixed at 1. If set to any other value, the API reports an error. - Note: In this mode, to control the maximum number of generated images, use the `max_images` parameter. **max\\_images** `*integer*` (Optional) **Important** The max\\_images parameter affects the cost. The cost is calculated as follows: Unit price × Number of successfully generated images. Before making a call, confirm the [model pricing](/help/en/model-studio/model-pricing#e2540d71a2utl). This parameter takes effect only in mixed text-and-image mode (when `enable_interleave=true`). - Function: Specifies the **maximum number** of images the model can generate in a single response. - Value range: 1 to 5. Default: 5. - Note: This parameter only represents an "upper limit". The actual number of generated images is determined by model inference and may be less than the set value. For example, if set to 5, the model might generate only 3 images based on the content. **prompt\\_extend** `*bool*` (Optional) This parameter takes effect only in image edit mode (when `enable_interleave = false`). Specifies whether to enable prompt rewriting. This feature only optimizes and refines the positive prompt. It does not change the negative prompt. - true (default) - false **stream** `*bool*` (Optional) This parameter controls whether the result is returned as a streaming output. In mixed text-and-image mode (when `enable_interleave = true`), this parameter **must** be set to `true`. - false (default) - true **watermark** `*bool*` (Optional) Specifies whether to add a watermark. The watermark is placed in the bottom-right corner of the image with the fixed text "AI Generated". - false (default) - true **seed** `*integer*` (Optional) The random number seed, with a value range of `[0, 2147483647]`. Using the same `seed` parameter value produces more consistent results. If you do not provide a seed, the algorithm uses a random number. **Note**: The model generation process is probabilistic. Even with the same `seed`, the results are not guaranteed to be identical for every call. |

| #### Response parameters | ## Task succeeded Task data, such as the task status and image URLs, is retained for only 24 hours and is then automatically purged. You must save the generated images promptly. ``` { "output": { "choices": [ { "finish_reason": "stop", "message": { "content": [ { "image": "https://dashscope-result-bj.oss-cn-beijing.aliyuncs.com/xxx.png?Expires=xxx", "type": "image" } ], "role": "assistant" } } ], "finished": true }, "usage": { "image_count": 1, "input_tokens": 0, "output_tokens": 0, "size": "1280*1280", "total_tokens": 0 }, "request_id": "a3f4befe-cacd-49c9-8298-xxxxxx" } ``` ## Task succeeded (streaming output) Task data, such as the task status and image URLs, is retained for only 24 hours and is then automatically purged. You must save the generated images promptly. ``` {"output":{"choices":[{"message":{"content":[{"type":"text","text":"The"}],"role":"assistant"},"finish_reason":"null"}],"finished":true},"usage":{"total_tokens":571,"image_count":3,"output_tokens":543,"size":"1280*1280","input_tokens":28},"request_id":"d2dcb952-bf91-4a6a-aad5-xxxxxx"} {"output":{"choices":[{"message":{"content":[{"type":"text","text":" aroma"}],"role":"assistant"},"finish_reason":"null"}],"finished":true},"usage":{"total_tokens":572,"image_count":3,"output_tokens":544,"size":"1280*1280","input_tokens":28},"request_id":"d2dcb952-bf91-4a6a-aad5-fb1f435e34a9"} {"output":{"choices":[{"message":{"content":[{"type":"text","text":" intertwines"}],"role":"assistant"},"finish_reason":"null"}],"finished":true},"usage":{"total_tokens":573,"image_count":3,"output_tokens":545,"size":"1280*1280","input_tokens":28},"request_id":"d2dcb952-bf91-4a6a-aad5-xxxxxx"} ...... {"output":{"choices":[{"message":{"content":[{"type":"image","image":"https://dashscope-result-bj.oss-cn-beijing.aliyuncs.com/xxx.png?Expires=xxxx"}],"role":"assistant"},"finish_reason":"null"}],"finished":true},"usage":{"total_tokens":557,"image_count":3,"output_tokens":529,"size":"1280*1280","input_tokens":28},"request_id":"d2dcb952-bf91-4a6a-aad5-xxxxxx"} {"output":{"choices":[{"message":{"content":[{"type":"text","text":"While"}],"role":"assistant"},"finish_reason":"null"}],"finished":true},"usage":{"total_tokens":558,"image_count":3,"output_tokens":530,"size":"1280*1280","input_tokens":28},"request_id":"d2dcb952-bf91-4a6a-aad5-xxxxxx"} {"output":{"choices":[{"message":{"content":[{"type":"text","text":" hot"}],"role":"assistant"},"finish_reason":"null"}],"finished":true},"usage":{"total_tokens":559,"image_count":3,"output_tokens":531,"size":"1280*1280","input_tokens":28},"request_id":"d2dcb952-bf91-4a6a-aad5-xxxxxx"} {"output":{"choices":[{"message":{"content":[{"type":"text","text":", pick"}],"role":"assistant"},"finish_reason":"null"}],"finished":true},"usage":{"total_tokens":560,"image_count":3,"output_tokens":532,"size":"1280*1280","input_tokens":28},"request_id":"d2dcb952-bf91-4a6a-aad5-xxxxxx"} {"output":{"choices":[{"message":{"content":[{"type":"text","text":" up"}],"role":"assistant"},"finish_reason":"null"}],"finished":true},"usage":{"total_tokens":561,"image_count":3,"output_tokens":533,"size":"1280*1280","input_tokens":28},"request_id":"d2dcb952-bf91-4a6a-aad5-xxxxxx"} {"output":{"choices":[{"message":{"content":[{"type":"text","text":" a piece"}],"role":"assistant"},"finish_reason":"null"}],"finished":true},"usage":{"total_tokens":562,"image_count":3,"output_tokens":534,"size":"1280*1280","input_tokens":28},"request_id":"d2dcb952-bf91-4a6a-aad5-xxxxxx"} {"output":{"choices":[{"message":{"content":[{"type":"text","text":" of meat"}],"role":"assistant"},"finish_reason":"stop"}],"finished":true},"usage":{"total_tokens":563,"image_count":3,"output_tokens":535,"size":"1280*1280","input_tokens":28},"request_id":"d2dcb952-bf91-4a6a-aad5-xxxxxx"} ``` ## Task error If a task fails to execute, information is returned, and the code and message fields clearly indicate the cause of the error. To resolve the error, see [Error messages](/help/en/model-studio/error-code). ``` { "request_id": "a4d78a5f-655f-9639-8437-xxxxxx", "code": "InvalidParameter", "message": "num_images_per_prompt must be 1" } ``` |
| --- | --- |
| **output** `*object*` The task output information. **Properties** **choices** `*array of object*` The output content generated by the model. **Properties** **finish\\_reason** `*string*` The reason the task stopped. **Non-streaming output scenario**: A value of `stop` indicates a natural stop. **Streaming output scenario**: When streaming output is enabled, this parameter indicates whether the data stream has finished transmitting. - During transmission: Previous data packets will continuously return `"finish_reason": "null"`, indicating that content is still being generated. Continue to receive data. - At the end of transmission: Only the **last** JSON struct will return `"finish_reason":"stop"`, indicating that the streaming request has fully completed. You should stop receiving data. **message** `*object*` The message returned by the model. **Properties** **role** `*string*` The role of the message, fixed to `assistant`. **content** `*array*` **Properties** **type** `*string*` The type of the output. The enumerated values are text and image. **text** `*string*` The generated text. **image** `*string*` The URL of the generated image. The image format is PNG. **The link is valid for 24 hours**. Download and save the image promptly. **finished** `*bool*` A flag indicating if the request has finished. - true: The request is finished. - false: The request is incomplete. |
| **usage** `*object*` Statistics for the output. Only successful results are counted. **Properties** **image\\_count** `*integer*` The number of generated images. **size** `*string*` The resolution of the generated image. Example: 1280\\*1280. **input\\_tokens** `*integer*` Billing is based on the number of images. - In image edit mode, this value is fixed at 0. - In mixed text-and-image mode, this field counts the number of tokens in the input text but is not used for billing. **output\\_tokens** `*integer*` Billing is based on the number of images. - In image edit mode, this value is fixed at 0. - In mixed text-and-image mode, this field counts the number of tokens in the output text but is not used for billing. **total\\_tokens** `*integer*` Billing is based on the number of images. - In image edit mode, this value is fixed at 0. - In mixed text-and-image mode, this field counts the total number of tokens but is not used for billing. |
| **request\\_id** `*string*` The unique request ID. You can use this ID to trace and troubleshoot issues. |
| **code** `*string*` The error code. This parameter is returned only when the request fails. For more information, see [Error messages](/help/en/model-studio/error-code). |     |
| **message** `*string*` A detailed error message. This parameter is returned only when the request fails. For more information, see [Error messages](/help/en/model-studio/error-code). |     |

## **HTTP asynchronous call**

Image generation tasks can take a long time, typically 1 to 2 minutes. Use asynchronous invocation to avoid request timeouts. The entire process involves two core steps: **Create Task -> Poll for Result**. The steps are as follows:

> The specific time required depends on the number of tasks in the queue and the service execution status. Please be patient when retrieving the results.

### Step 1: Create a task to get a task ID

**Singapore**: `POST https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/image-generation/generation`

**US (Virginia):** `POST https://dashscope-us.aliyuncs.com/api/v1/services/aigc/image-generation/generation`

**China (Beijing)**: `POST https://dashscope.aliyuncs.com/api/v1/services/aigc/image-generation/generation`

**Note**

-   After the task is created, use the returned `task_id` to query the result. The \`task\_id\` is valid for 24 hours. **Do not create duplicate tasks**. Instead, use polling to retrieve the result.
    

| #### Request parameters | ## **Image editing** ``` curl --location 'https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/image-generation/generation' \\ --header 'Content-Type: application/json' \\ --header "Authorization: Bearer $DASHSCOPE_API_KEY" \\ --header 'X-DashScope-Async: enable' \\ --data '{ "model": "wan2.6-image", "input": { "messages": [ { "role": "user", "content": [ { "text": "Generate an image of scrambled eggs with tomatoes using the style of image 1 and the background of image 2" }, { "image": "https://cdn.wanx.aliyuncs.com/tmp/pressure/umbrella1.png" }, { "image": "https://img.alicdn.com/imgextra/i3/O1CN01SfG4J41UYn9WNt4X1_!!6000000002530-49-tps-1696-960.webp" } ] } ] }, "parameters": { "prompt_extend": true, "watermark": false, "n": 1, "enable_interleave": false, "size": "1280*1280" } }' ``` ## Mixed text-and-image output ``` curl --location 'https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/image-generation/generation' \\ --header 'Content-Type: application/json' \\ --header "Authorization: Bearer $DASHSCOPE_API_KEY" \\ --header 'X-DashScope-Async: enable' \\ --data '{ "model": "wan2.6-image", "input": { "messages": [ { "role": "user", "content": [ { "text": "Give me a 3-image tutorial for stir-fried pork with chili peppers" } ] } ] }, "parameters": { "max_images": 3, "size": "1280*1280", "enable_interleave":true } }' ``` |
| --- | --- |
| ##### Headers |
| **Content-Type** `*string*` **(Required)** The content type of the request. You must set this parameter to `application/json`. |
| **Authorization** `*string*` **(Required)** The authentication credentials. This API uses a Model Studio API key for authentication. For example, \\`Bearer sk-xxxx\\`. |
| **X-DashScope-Async** `*string*` **(Required)** The asynchronous processing configuration parameter. It **must be set to** `**enable**`. **Important** If you omit this header, an error is returned: "current user api does not support synchronous calls". |
| ##### Request Body |
| **model** `*string*` **(Required)** The model name. Example: wan2.6-image. |
| **input** `*object*` **(Required)** Basic input information. **Properties** **messages** `*array*` **(Required)** An array of request content. Currently, **only single-turn conversations are supported**. This means you pass one set of role and content parameters. Multi-turn conversations are not supported. **Properties** **role** `*string*` **(Required)** The role of the message. This parameter must be set to `user`. **content** `*array*` **(Required)** An array of message content. **Properties** **text** `*string*` **(Required)** The positive prompt. It describes the content, style, and composition of the image you want to generate. This parameter supports Chinese and English, with a maximum length of 2,000 characters. Each Chinese character, letter, number, or symbol counts as one character. Any excess characters are automatically truncated. For example: Generate an image of scrambled eggs with tomatoes in the style of this reference picture. **Note**: The `content` array must contain exactly one object with a `text` field. **image** `*string*` (Optional) The URL or Base64-encoded string of the input image. Image limits: - Image format: JPEG, JPG, PNG (alpha channel not supported), BMP, WEBP. - Image resolution: The width and height of the image must both be in the range of \\[384, 5000\\] pixels. - File size: Does not exceed 10 MB. Image quantity limits: - The number of input images depends on the `parameters.enable_interleave` parameter. - When `enable_interleave=true` (mixed text-and-image output), you can input **0 to 1** image. - When `enable_interleave=false` (image editing), you **must** input **1 to 4** images. - To input multiple images, pass multiple `image` objects in the `content` array. The order of the images is defined by their order in the array. Supported input formats: 1. Publicly accessible URL - Supports HTTP or HTTPS protocol. - Example: `http://wanx.alicdn.com/material/xxx.jpeg`. 2. A string containing a Base64-encoded image - Format: data:{MIME\\_type};base64,{base64\\_data} - Example: data:image/jpeg;base64,GDU7MtCZzEbTbmRZ... (for illustration only; the complete string must be provided) - For Base64 encoding specifications, see [Image input methods](/help/en/model-studio/wan-image-edit-2-5#8db0e2215frua). |
| **parameters** `*object*` (Optional) Image editing parameters. **Properties** **negative\\_prompt** `*string*` (Optional) A negative prompt that describes the content that you do not want to see in the image. It can be used to constrain the image generation. The maximum length is 500 characters. This parameter supports both Chinese and English. Excess characters are automatically truncated. Example: low resolution, low quality, deformed limbs, deformed fingers, oversaturated, waxy, no facial details, overly smooth, AI-like, chaotic composition, blurry text, distorted text. **size** `*string*` (Optional) The resolution of the output image, in the format of `**width*height**`. - wan2.6-image: The total number of pixels must be between 768\\*768 and 1280\\*1280 (from 589,824 to 1,638,400 pixels), and the aspect ratio must be between 1:4 and 4:1. For example, 1024\\*1536 is a valid resolution. Example: 1280\\*1280. **Recommended resolutions for common aspect ratios** - 1:1: 1280\\*1280 or 1024\\*1024 - 2:3: 800\\*1200 - 3:2: 1200\\*800 - 3:4: 960\\*1280 - 4:3: 1280\\*960 - 9:16: 720\\*1280 - 16:9: 1280\\*720 - 21:9: 1344\\*576 **Rules for output image dimensions** Method 1: Specify the `size` parameter. The output image is generated strictly according to the width and height specified by `size`. Method 2: Do not specify `size`. The output image dimensions are determined by both the maximum total pixels and the aspect ratio rules. The system processes the image based on the total pixels and aspect ratio rules before outputting it. - Total pixel rule: Controlled by `enable_interleave`. - When `enable_interleave=true`: - If the total pixels of the input image are ≤ 1280\\*1280, the output has the same total pixels as the input. - If the total pixels of the input image are > 1280\\*1280, the output total pixels are fixed at 1280\\*1280. - When `enable_interleave=false`: The output total pixels are fixed at 1280\\*1280. - Aspect ratio rule (approximate): - Single-image input: The output aspect ratio is the same as the input image. - Multi-image input: The output aspect ratio is the same as the last input image. > Example: When `enable_interleave=true` and a 720\\*720 image is input, the output image is 720\\*720, matching the input aspect ratio. **enable\\_interleave** `*bool*` (Optional) This parameter controls the image generation mode: - false (default): This indicates image edit mode, which supports multi-image input and subject consistency generation. - Use case: Edit, perform style transfer, or generate images with subject consistency based on one to four input images. - Input: You must provide at least one reference image. - Output: You can generate one to four result images. - true: This enables mixed text-and-image output mode, which supports passing one image or no image. - Use case: Generate content with both text and images based on a text description, or generate an image from text only (text-to-image). - Input: You can provide no image (for text-to-image) or up to one reference image. - Output: Generates content that contains a mix of text and images. **n** `*integer*` (Optional) **Important** The n parameter directly affects the cost. The cost is calculated as follows: Cost = Unit price × Number of successfully generated images. Before making a call, confirm the [model pricing](/help/en/model-studio/model-pricing#e2540d71a2utl). Specifies the number of images to generate. The value range and meaning of this parameter depend on the state of enable\\_interleave (mode switch): - When `enable_interleave=false` (image edit mode): - Function: Directly controls the number of generated images. - Value range: 1 to 4. Default: 4. - During testing, set this value to 1 for low-cost verification. - When `enable_interleave=true` (mixed text-and-image mode): - Restriction: This parameter defaults to 1 and must be fixed at 1. If set to any other value, the API reports an error. - Note: In this mode, to control the maximum number of generated images, use the `max_images` parameter. **max\\_images** `*integer*` (Optional) **Important** The max\\_images parameter affects the cost. The cost is calculated as follows: Unit price × Number of successfully generated images. Before making a call, confirm the [model pricing](/help/en/model-studio/model-pricing#e2540d71a2utl). This parameter takes effect only in mixed text-and-image mode (when `enable_interleave=true`). - Function: Specifies the **maximum number** of images the model can generate in a single response. - Value range: 1 to 5. Default: 5. - Note: This parameter only represents an "upper limit". The actual number of generated images is determined by model inference and may be less than the set value. For example, if set to 5, the model might generate only 3 images based on the content. **prompt\\_extend** `*bool*` (Optional) This parameter takes effect only in image edit mode (when `enable_interleave = false`). Specifies whether to enable prompt rewriting. This feature only optimizes and refines the positive prompt. It does not change the negative prompt. - true (default) - false **watermark** `*bool*` (Optional) Specifies whether to add a watermark. The watermark is placed in the bottom-right corner of the image with the fixed text "AI Generated". - false (default) - true **seed** `*integer*` (Optional) The random number seed, with a value range of `[0, 2147483647]`. Using the same `seed` parameter value produces more consistent results. If you do not provide a seed, the algorithm uses a random number. **Note**: The model generation process is probabilistic. Even with the same `seed`, the results are not guaranteed to be identical for every call. |

| #### Response parameters | ### Successful response Save the \\`task\\_id\\` to query the task status and result. ``` { "output": { "task_status": "PENDING", "task_id": "0385dc79-5ff8-4d82-bcb6-xxxxxx" }, "request_id": "4909100c-7b5a-9f92-bfe5-xxxxxx" } ``` ### Error response The task creation failed. For more information, see [Error messages](/help/en/model-studio/error-code) to resolve the issue. ``` { "code": "InvalidApiKey", "message": "No API-key provided.", "request_id": "7438d53d-6eb8-4596-8835-xxxxxx" } ``` |
| --- | --- |
| **output** `*object*` The task output information. **Properties** **task\\_id** `*string*` The task ID. You can use this ID to query the task for up to 24 hours. **task\\_status** `*string*` The task status. **Enumeration** - PENDING - RUNNING - SUCCEEDED - FAILED - CANCELED - UNKNOWN: The task does not exist or its status is unknown. |
| **request\\_id** `*string*` The unique request ID. You can use this ID to trace and troubleshoot issues. |
| **code** `*string*` The error code. This parameter is returned only when the request fails. For more information, see [Error messages](/help/en/model-studio/error-code). |     |
| **message** `*string*` A detailed error message. This parameter is returned only when the request fails. For more information, see [Error messages](/help/en/model-studio/error-code). |     |

### Step 2: Query the result by task ID

**Singapore:** `GET https://dashscope-intl.aliyuncs.com/api/v1/tasks/{task_id}`

**Virginia:** `GET https://dashscope-us.aliyuncs.com/api/v1/tasks/{task_id}`

**Beijing:** `GET https://dashscope.aliyuncs.com/api/v1/tasks/{task_id}`

**Note**

-   **Polling recommendation**: Image generation is a lengthy process. We recommend that you use a **polling** mechanism with a reasonable query interval, such as 10 seconds, to retrieve results.
    
-   **Task status flow**: PENDING -> RUNNING -> SUCCEEDED / FAILED.
    
-   **Result link**: A successful task returns an image link that is valid for **24 hours**. We recommend that you download and transfer the image to permanent storage, such as [Object Storage Service (OSS)](/help/en/oss/user-guide/what-is-oss), immediately after you obtain the link.
    

| #### Request parameters | ## Query task result Replace `{task_id}` with the value of `task_id` that is returned by the previous API call. ``` curl -X GET https://dashscope-intl.aliyuncs.com/api/v1/tasks/{task_id} \\ --header "Authorization: Bearer $DASHSCOPE_API_KEY" ``` |
| --- | --- |
| ##### **Headers** |
| **Authorization** `*string*` **(Required)** The authentication credentials. This API uses a Model Studio API key for authentication. For example, \\`Bearer sk-xxxx\\`. |
| ##### **URL path parameters** |
| **task\\_id** `*string*` **(Required)** The task ID. |

| #### Response parameters | ## Task succeeded Task data, such as the task status and image URLs, is retained for only 24 hours and is then automatically purged. You must save the generated images promptly. ``` { "request_id": "43d9e959-25bc-4dc7-9888-xxxxxx", "output": { "task_id": "858cad55-4bdc-4ba3-ae6c-xxxxxx", "task_status": "SUCCEEDED", "submit_time": "2025-12-16 04:21:02.275", "scheduled_time": "2025-12-16 04:21:02.304", "end_time": "2025-12-16 04:24:46.658", "finished": true, "choices": [ { "finish_reason": "stop", "message": { "role": "assistant", "content": [ { "image": "https://dashscope-result-bj.oss-cn-beijing.aliyuncs.com/1xxx.png?Expires=xxx", "type": "image" } ] } }, { "finish_reason": "stop", "message": { "role": "assistant", "content": [ { "image": "https://dashscope-result-bj.oss-cn-beijing.aliyuncs.com/1xxx.png?Expires=xxx", "type": "image" } ] } } ] }, "usage": { "size": "1280*1280", "total_tokens": 0, "image_count": 2, "output_tokens": 0, "input_tokens": 0 } } ``` ## Task error If task execution fails, the returned information includes code and message fields that specify the cause of the error. See [Error messages](/help/en/model-studio/error-code) for solutions. ``` { "request_id": "a4d78a5f-655f-9639-8437-xxxxxx", "code": "InvalidParameter", "message": "num_images_per_prompt must be 1" } ``` |
| --- | --- |
| **output** `*object*` The task output information. **Properties** **task\\_id** `*string*` The task ID. You can use this ID to query the task for up to 24 hours. **task\\_status** `*string*` The task status. **Enumeration** - PENDING - RUNNING - SUCCEEDED - FAILED - CANCELED - UNKNOWN: The task does not exist or its status is unknown. **Status transitions during polling:** - PENDING → RUNNING → SUCCEEDED or FAILED. - The status of the first query is typically PENDING or RUNNING. - If the status is SUCCEEDED, the response contains the generated image URL. - If the status is FAILED, check the error message and retry. **submit\\_time** `*string*` The time when the task was submitted. The time is in UTC+8. The format is \\`YYYY-MM-DD HH:mm:ss.SSS\\`. **scheduled\\_time** `*string*` The time when the task started running. The time is in UTC+8. The format is \\`YYYY-MM-DD HH:mm:ss.SSS\\`. **end\\_time** `*string*` The time when the task was completed. The time is in UTC+8. The format is \\`YYYY-MM-DD HH:mm:ss.SSS\\`. **finished** `*bool*` A flag indicating if the request has finished. - true: The request is finished. - false: The request is incomplete. **choices** `*array of object*` The output content generated by the model. **Properties** **finish\\_reason** `*string*` The reason the task stopped. A value of `stop` indicates a natural stop. **message** `*object*` The message returned by the model. **Properties** **role** `*string*` The role of the message, fixed to `assistant`. **content** `*array*` **Properties** **type** `*string*` The type of the output. The enumerated values are text and image. **text** `*string*` The generated text. **image** `*string*` The URL of the generated image. The image format is PNG. **The link is valid for 24 hours**. Download and save the image promptly. |
| **usage** `*object*` Statistics for the output. Only successful results are counted. **Properties** **image\\_count** `*integer*` The number of generated images. **size** `*string*` The resolution of the generated image. Example: 1280\\*1280. **input\\_tokens** `*integer*` The number of input tokens. Billing is based on the number of images. This value is fixed at 0. **output\\_tokens** `*integer*` The number of output tokens. Billing is based on the number of images. This value is fixed at 0. **total\\_tokens** `*integer*` The total number of tokens. Billing is based on the number of images. This value is fixed at 0. |
| **request\\_id** `*string*` The unique request ID. You can use this ID to trace and troubleshoot issues. |
| **code** `*string*` The error code. This parameter is returned only when the request fails. For more information, see [Error messages](/help/en/model-studio/error-code). |
| **message** `*string*` A detailed error message. This parameter is returned only when the request fails. For more information, see [Error messages](/help/en/model-studio/error-code). |

## **DashScope Python SDK**

The SDK's parameter naming is mostly consistent with the HTTP API, but the parameter structure is encapsulated according to the language's characteristics.

Because tasks can be time-consuming, the SDK encapsulates the HTTP asynchronous call process and supports both synchronous and asynchronous invocation methods.

> The specific time required depends on the number of tasks in the queue and the service execution status. Please be patient when retrieving the results.

**Important**

Before you run the following code, make sure that your DashScope Python SDK version is `**1.25.8**` **or later**. To update the SDK, see [Install the SDK](/help/en/model-studio/install-sdk).

The `base_url` and API key are different for each region. The following examples show how to make a call in the Singapore region:

**Singapore:** `https://dashscope-intl.aliyuncs.com/api/v1`

**Virginia:** `https://dashscope-us.aliyuncs.com/api/v1`

**Beijing:** `https://dashscope.aliyuncs.com/api/v1`

### **Image editing**

## Synchronous call

##### **Request example**

```
import os
import dashscope
from dashscope.aigc.image_generation import ImageGeneration
from dashscope.api_entities.dashscope_response import Message

# The following is the base_url for the Singapore region. The base_url varies by region.
dashscope.base_http_api_url = 'https://dashscope-intl.aliyuncs.com/api/v1'

# If you have not configured an environment variable, replace the following line with your Model Studio API key: api_key="sk-xxx"
# The API key varies by region. To obtain an API key, see https://www.alibabacloud.com/help/zh/model-studio/get-api-key
api_key = os.getenv("DASHSCOPE_API_KEY")

message = Message(
    role="user",
    # Local files are supported, for example, "image": "file://umbrella1.png"
    content=[
        {
            "text": "Generate an image of scrambled eggs with tomatoes using the style of image 1 and the background of image 2"
        },
        {
            "image": "https://cdn.wanx.aliyuncs.com/tmp/pressure/umbrella1.png"
        },
        {
            "image": "https://img.alicdn.com/imgextra/i3/O1CN01SfG4J41UYn9WNt4X1_!!6000000002530-49-tps-1696-960.webp"
        }
    ]
)
print("----sync call, please wait a moment----")
rsp = ImageGeneration.call(
        model='wan2.6-image',
        api_key=api_key,
        messages=[message],
        negative_prompt="",
        prompt_extend=True,
        watermark=False,
        n=1,
        enable_interleave=False,
        size="1280*1280"
    )

print(rsp)
```

##### Response example

> The URL is valid for 24 hours. Download the image promptly.

```
{
    "status_code": 200,
    "request_id": "b6a4c68d-3a91-4018-ae96-3cf373xxxxxx",
    "code": "",
    "message": "",
    "output": {
        "text": null,
        "finish_reason": null,
        "choices": [
            {
                "finish_reason": "stop",
                "message": {
                    "role": "assistant",
                    "content": [
                        {
                            "image": "https://dashscope-result-bj.oss-cn-beijing.aliyuncs.com/xxxxxx.png?Expires=xxxxxx",
                            "type": "image"
                        }
                    ]
                }
            }
        ],
        "audio": null,
        "finished": true
    },
    "usage": {
        "input_tokens": 0,
        "output_tokens": 0,
        "characters": 0,
        "image_count": 1,
        "size": "1280*1280",
        "total_tokens": 0
    }
}
```

## Asynchronous call

##### **Request example**

```
import os
import dashscope
from dashscope.aigc.image_generation import ImageGeneration
from dashscope.api_entities.dashscope_response import Message
from http import HTTPStatus

# The following is the base_url for the Singapore region. The base_url varies by region.
dashscope.base_http_api_url = 'https://dashscope-intl.aliyuncs.com/api/v1'

# If you have not configured an environment variable, replace the following line with your Model Studio API key: api_key="sk-xxx"
# The API key varies by region. To obtain an API key, see https://www.alibabacloud.com/help/zh/model-studio/get-api-key
api_key = os.getenv("DASHSCOPE_API_KEY")

# Create an asynchronous task
def create_async_task():
    print("Creating async task...")
    message = Message(
        role="user",
        content=[
            {'text': 'Generate an image of scrambled eggs with tomatoes using the style of image 1 and the background of image 2'},
            {'image': 'https://cdn.wanx.aliyuncs.com/tmp/pressure/umbrella1.png'},
            {'image': 'https://img.alicdn.com/imgextra/i3/O1CN01SfG4J41UYn9WNt4X1_!!6000000002530-49-tps-1696-960.webp'}
        ]
    )
    response = ImageGeneration.async_call(
        model="wan2.6-image",
        api_key=api_key,
        messages=[message],
        negative_prompt="",
        prompt_extend=True,
        watermark=False,
        n=1,
        enable_interleave=False,
        size="1280*1280"
    )
    
    if response.status_code == 200:
        print("Task created successfully:", response)
        return response  # Return the task ID
    else:
        raise Exception(f"Failed to create task: {response.code} - {response.message}")

# Wait for the task to complete
def wait_for_completion(task_response):
    print("Waiting for task completion...")
    status = ImageGeneration.wait(task=task_response, api_key=api_key)
    
    if status.output.task_status == "SUCCEEDED":
        print("Task succeeded!")
        print("Response:", status)
    else:
        raise Exception(f"Task failed with status: {status.output.task_status}")

# Fetch task information
def fetch_task_status(task):
    print("Fetching task status...")
    status = ImageGeneration.fetch(task=task, api_key=api_key)
    
    if status.status_code == HTTPStatus.OK:
        print("Task status:", status.output.task_status)
        print("Response details:", status)
    else:
        print(f"Failed to fetch status: {status.code} - {status.message}")

# Cancel the asynchronous task
def cancel_task(task):
    print("Canceling task...")
    response = ImageGeneration.cancel(task=task, api_key=api_key)
    
    if response.status_code == HTTPStatus.OK:
        print("Task canceled successfully:", response.output.task_status)
    else:
        print(f"Failed to cancel task: {response.code} - {response.message}")

# Main execution flow
if __name__ == "__main__":
    task = create_async_task()
    wait_for_completion(task)
```

##### Response example

1\. Example response for creating a task

```
{
    "status_code": 200,
    "request_id": "4fb3050f-de57-4a24-84ff-e37ee5xxxxxx",
    "code": "",
    "message": "",
    "output": {
        "text": null,
        "finish_reason": null,
        "choices": null,
        "audio": null,
        "task_id": "127ec645-118f-4884-955d-0eba8dxxxxxx",
        "task_status": "PENDING"
    },
    "usage": {
        "input_tokens": 0,
        "output_tokens": 0,
        "characters": 0
    }
}
```

2\. Example response for querying a task result

> The URL is valid for 24 hours. Download the image promptly.

```
{
    "status_code": 200,
    "request_id": "b2a7fab4-5e00-4b0a-86fe-8b9964xxxxxx",
    "code": null,
    "message": "",
    "output": {
        "text": null,
        "finish_reason": null,
        "choices": [
            {
                "finish_reason": "stop",
                "message": {
                    "role": "assistant",
                    "content": [
                        {
                            "image": "https://dashscope-result-bj.oss-cn-beijing.aliyuncs.com/xxxxxx.png?Expires=xxxxxx",
                            "type": "image"
                        }
                    ]
                }
            }
        ],
        "audio": null,
        "task_id": "127ec645-118f-4884-955d-0eba8xxxxxx",
        "task_status": "SUCCEEDED",
        "submit_time": "2026-01-09 17:52:04.136",
        "scheduled_time": "2026-01-09 17:52:04.164",
        "end_time": "2026-01-09 17:52:25.408",
        "finished": true
    },
    "usage": {
        "input_tokens": 0,
        "output_tokens": 0,
        "characters": 0,
        "size": "1280*1280",
        "total_tokens": 0,
        "image_count": 1
    }
}
```

### **Mixed text-and-image output**

## Synchronous call (streaming only)

##### **Request example**

```
import os
import dashscope
from dashscope.aigc.image_generation import ImageGeneration
from dashscope.api_entities.dashscope_response import Message

# The following is the base_url for the Singapore region. The base_url varies by region.
dashscope.base_http_api_url = 'https://dashscope-intl.aliyuncs.com/api/v1'

# If you have not configured an environment variable, replace the following line with your Model Studio API key: api_key="sk-xxx"
# The API key varies by region. To obtain an API key, see https://www.alibabacloud.com/help/zh/model-studio/get-api-key
api_key = os.getenv("DASHSCOPE_API_KEY")


def sync_call_with_stream():
    print("\n========== Synchronous call - Streaming text-and-image output ==========")

    image_message = Message(
        role="user",
        content=[
            {
                "text": "Give me a 3-image tutorial for stir-fried pork with chili peppers"
            }
        ]
    )

    image_stream_res = ImageGeneration.call(
        model="wan2.6-image",
        api_key=api_key,
        messages=[image_message],
        stream=True,  # Streaming call only
        negative_prompt="",
        enable_interleave=True,
        max_images=3,
        size="1280*1280"
    )

    print("Streaming output result:")
    for stream_res in image_stream_res:
        print(stream_res)

if __name__ == "__main__":
    sync_call_with_stream()
```

##### Response example

> The URL is valid for 24 hours. You must download the image promptly.

```
{"status_code": 200, "request_id": "5b98e8f3-aeff-4c20-a26c-499a7525axxx", "code": "", "message": "", "output": {"text": null, "finish_reason": null, "choices": [{"finish_reason": "null", "message": {"role": "assistant", "content": [{"type": "text", "text": "Chili"}]}}], "audio": null, "finished": false}, "usage": {"input_tokens": 28, "output_tokens": 0, "characters": 0, "total_tokens": 28, "image_count": 0, "size": "0*0"}}
{"status_code": 200, "request_id": "5b98e8f3-aeff-4c20-a26c-499a7525axxx", "code": "", "message": "", "output": {"text": null, "finish_reason": null, "choices": [{"finish_reason": "null", "message": {"role": "assistant", "content": [{"type": "text", "text": " fried"}]}}], "audio": null, "finished": false}, "usage": {"input_tokens": 28, "output_tokens": 1, "characters": 0, "total_tokens": 29, "image_count": 0, "size": "0*0"}}
{"status_code": 200, "request_id": "5b98e8f3-aeff-4c20-a26c-499a7525axxx", "code": "", "message": "", "output": {"text": null, "finish_reason": null, "choices": [{"finish_reason": "null", "message": {"role": "assistant", "content": [{"type": "text", "text": " pork"}]}}], "audio": null, "finished": false}, "usage": {"input_tokens": 28, "output_tokens": 2, "characters": 0, "total_tokens": 30, "image_count": 0, "size": "0*0"}}

......

{"status_code": 200, "request_id": "5b98e8f3-aeff-4c20-a26c-499a7525axxx", "code": "", "message": "", "output": {"text": null, "finish_reason": null, "choices": [{"finish_reason": "null", "message": {"role": "assistant", "content": [{"type": "text", "text": "."}]}}], "audio": null, "finished": false}, "usage": {"input_tokens": 28, "output_tokens": 398, "characters": 0, "total_tokens": 426, "image_count": 2, "size": "1280*1280"}}
{"status_code": 200, "request_id": "5b98e8f3-aeff-4c20-a26c-499a7525axxx", "code": "", "message": "", "output": {"text": null, "finish_reason": null, "choices": [{"finish_reason": "stop", "message": {"role": "assistant", "content": [{"type": "image", "image": "https://dashscope-result-sh.oss-cn-shanghai.aliyuncs.com/xxx.png?Expires=xxx"}]}}], "audio": null, "finished": true}, "usage": {"input_tokens": 28, "output_tokens": 523, "characters": 0, "total_tokens": 551, "image_count": 3, "size": "1280*1280"}}
```

## Asynchronous call

##### **Request example**

**Note**: Asynchronous calls do not require you to set the stream parameter.

```
import os
import dashscope
from dashscope.aigc.image_generation import ImageGeneration
from dashscope.api_entities.dashscope_response import Message
from http import HTTPStatus

# The following is the base_url for the Singapore region. The base_url varies by region.
dashscope.base_http_api_url = 'https://dashscope-intl.aliyuncs.com/api/v1'

# If you have not configured an environment variable, replace the following line with your Model Studio API key: api_key="sk-xxx"
# The API key varies by region. To obtain an API key, see https://www.alibabacloud.com/help/zh/model-studio/get-api-key
api_key = os.getenv("DASHSCOPE_API_KEY")


def main():
    """Asynchronous call - Text-and-image output"""
    print("========== wan2.6-image Asynchronous call - Text-and-image output ==========")

    image_message = Message(
        role="user",
        content=[
            {
                "text": "Give me a 3-image tutorial for stir-fried pork with chili peppers"
            }
        ]
    )

    # Create an asynchronous task
    print("---async call, creating task----")
    response = ImageGeneration.async_call(
        model="wan2.6-image",
        api_key=api_key,
        messages=[image_message],
        # Asynchronous calls do not require setting the stream parameter
        negative_prompt="",
        enable_interleave=True,
        max_images=3,
        size="1280*1280"
    )

    if response.status_code == HTTPStatus.OK:
        print(f"Task created successfully:")
        print(response)

        # Wait for the task to complete
        print("\n---waiting for task completion----")
        status = ImageGeneration.wait(task=response, api_key=api_key)

        if status.output.task_status == "SUCCEEDED":
            print("Task completed!")
            print(f"Result:")
            print(status)
        else:
            print(f"Task failed with status: {status.output.task_status}")
    else:
        print(f"Task creation failed: {response.code} - {response.message}")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"Execution error: {str(e)}")
        import traceback
        traceback.print_exc()
```

##### Response example

1\. Example response for creating a task

```
{
    "status_code": 200,
    "request_id": "4fb3050f-de57-4a24-84ff-e37ee5xxxxxx",
    "code": "",
    "message": "",
    "output": {
        "text": null,
        "finish_reason": null,
        "choices": null,
        "audio": null,
        "task_id": "5c67585e-a3be-4943-b04d-c3fbb2xxxxxx",
        "task_status": "PENDING"
    },
    "usage": {
        "input_tokens": 0,
        "output_tokens": 0,
        "characters": 0
    }
}
```

2\. Example response for querying a task result

> The URL is valid for 24 hours. You must download the image promptly.

```
{
    "status_code": 200,
    "request_id": "997a759b-fbb9-4b35-9a4d-6dab1xxxxxx",
    "code": null,
    "message": "",
    "output": {
        "text": null,
        "finish_reason": null,
        "choices": [
            {
                "finish_reason": "stop",
                "message": {
                    "role": "assistant",
                    "content": [
                        {
                            "text": "Stir-fried pork with chili peppers is a classic Hunan dish and a beloved home-style favorite for many. It is known for its fresh, spicy flavor and tender meat. The preparation is simple, yet it delivers an ultimate taste experience. Today, let's learn how to make this dish together.\n\nFirst, preparing all the ingredients is the first step to success. Fresh pork, red and green chili peppers, garlic cloves, and ginger slices are essential. Slice the pork thinly, cut the peppers into sections, and slice the garlic and ginger for later use.",
                            "type": "text"
                        },
                        {
                            "image": "https://dashscope-result-sh.oss-cn-shanghai.aliyuncs.com/xxx.png?Expires=xxx",
                            "type": "image"
                        },
                        {
                            "text": "Next is the crucial stir-frying step. Heat the wok with cool oil, add the garlic and ginger slices to release their aroma, then add the sliced pork and stir-fry quickly until the meat changes color. After the pork is fragrant, add the cut chili peppers and continue to stir-fry to fully release their aroma, blending it perfectly with the savory meat.",
                            "type": "text"
                        },
                        {
                            "image": "https://dashscope-result-sh.oss-cn-shanghai.aliyuncs.com/xxx.png?Expires=xxx",
                            "type": "image"
                        },
                        {
                            "text": "Finally, add the right amount of light soy sauce, dark soy sauce, oyster sauce, and a little sugar to season. Stir-fry quickly and evenly to coat every piece of meat and pepper with the sauce. Once the sauce thickens, turn off the heat and serve. This delicious and aromatic stir-fried pork with chili peppers is now ready!",
                            "type": "text"
                        },
                        {
                            "image": "https://dashscope-result-sh.oss-cn-shanghai.aliyuncs.com/xxx.png?Expires=xxx",
                            "type": "image"
                        }
                    ]
                }
            }
        ],
        "audio": null,
        "task_id": "5c67585e-a3be-4943-b04d-c3fbb2xxxxxx",
        "task_status": "SUCCEEDED",
        "submit_time": "2026-01-16 17:47:39.469",
        "scheduled_time": "2026-01-16 17:47:39.804",
        "end_time": "2026-01-16 17:49:46.736",
        "finished": true
    },
    "usage": {
        "input_tokens": 29,
        "output_tokens": 477,
        "characters": 0,
        "size": "1280*1280",
        "total_tokens": 506,
        "image_count": 3
    }
}
```

## **DashScope Java SDK**

The parameter naming in the SDK is mostly consistent with the HTTP API, but the parameter structure is encapsulated based on the characteristics of the programming language.

Because tasks can be time-consuming, the SDK encapsulates the HTTP asynchronous call process and supports both synchronous and asynchronous invocation methods.

> The specific time required depends on the number of tasks in the queue and the service execution status. Be patient when you retrieve the results.

**Important**

Before you run the following code, make sure that the DashScope Java SDK version is `**2.22.6**` **or later**.

The `base_url` and API key are different for each region. The following examples show how to make a call in the Singapore region:

**Singapore:** `https://dashscope-intl.aliyuncs.com/api/v1`

**Virginia:** `https://dashscope-us.aliyuncs.com/api/v1`

**Beijing:** `https://dashscope.aliyuncs.com/api/v1`

### **Image editing**

## Synchronous call

##### **Request example**

```
import com.alibaba.dashscope.aigc.imagegeneration.*;
import com.alibaba.dashscope.exception.ApiException;
import com.alibaba.dashscope.exception.NoApiKeyException;
import com.alibaba.dashscope.exception.UploadFileException;
import com.alibaba.dashscope.utils.Constants;
import com.alibaba.dashscope.utils.JsonUtils;

import java.util.Arrays;
import java.util.Collections;

/**
 * wan2.6-image image editing - Synchronous call example
 */
public class Main {

    static {
        // The following is the base_url for the Singapore region. The base_url varies by region.
        Constants.baseHttpApiUrl = "https://dashscope-intl.aliyuncs.com/api/v1";
    }

    // If you have not configured an environment variable, replace the following line with your Model Studio API key: apiKey="sk-xxx"
    // The API key varies by region. To obtain an API key, see https://www.alibabacloud.com/help/zh/model-studio/get-api-key
    static String apiKey = System.getenv("DASHSCOPE_API_KEY");

    public static void basicCall() throws ApiException, NoApiKeyException, UploadFileException {
        // Build a multi-image input message
        ImageGenerationMessage message = ImageGenerationMessage.builder()
                .role("user")
                .content(Arrays.asList(
                        // Supports multi-image input, allowing multiple reference images
                        Collections.singletonMap("text", "Generate an image of scrambled eggs with tomatoes using the style of image 1 and the background of image 2"),
                        Collections.singletonMap("image", "https://cdn.wanx.aliyuncs.com/tmp/pressure/umbrella1.png"),
                        Collections.singletonMap("image", "https://img.alicdn.com/imgextra/i3/O1CN01SfG4J41UYn9WNt4X1_!!6000000002530-49-tps-1696-960.webp")
                )).build();

        // Image editing uses a normal synchronous call. No need to set stream and enable_interleave.
        ImageGenerationParam param = ImageGenerationParam.builder()
                .apiKey(apiKey)
                .model("wan2.6-image")
                .messages(Collections.singletonList(message))
                .n(1)
                .size("1280*1280")
                .negativePrompt("")
                .promptExtend(true)
                .build();

        ImageGeneration imageGeneration = new ImageGeneration();
        ImageGenerationResult result = null;
        try {
            System.out.println("---sync call for image editing, please wait a moment----");
            result = imageGeneration.call(param);
        } catch (ApiException | NoApiKeyException | UploadFileException e) {
            throw new RuntimeException(e.getMessage());
        }
        System.out.println(JsonUtils.toJson(result));
    }

    public static void main(String[] args) {
        try {
            basicCall();
        } catch (ApiException | NoApiKeyException | UploadFileException e) {
            System.out.println(e.getMessage());
        }
    }
}
```

##### Response example

> The URL is valid for 24 hours. You must download the image promptly.

```
{
    "requestId": "b148327e-830f-414c-a8df-724dec28exxx",
    "usage": {
        "input_tokens": 0,
        "output_tokens": 0,
        "total_tokens": 0,
        "image_count": 1,
        "size": "1280*1280"
    },
    "output": {
        "choices": [
            {
                "finish_reason": "stop",
                "message": {
                    "role": "assistant",
                    "content": [
                        {
                            "image": "https://dashscope-result-sh.oss-cn-shanghai.aliyuncs.com/xxx.png?Expires=xxx",
                            "type": "image"
                        }
                    ]
                }
            }
        ],
        "finished": true
    },
    "status_code": 200,
    "code": "",
    "message": ""
}
```

## Asynchronous call

##### **Request example**

```
import com.alibaba.dashscope.aigc.imagegeneration.*;
import com.alibaba.dashscope.exception.ApiException;
import com.alibaba.dashscope.exception.NoApiKeyException;
import com.alibaba.dashscope.exception.UploadFileException;
import com.alibaba.dashscope.utils.Constants;
import com.alibaba.dashscope.utils.JsonUtils;

import java.util.Arrays;
import java.util.Collections;

/**
 * wan2.6-image image editing - Asynchronous call example
 */
public class Main {

    static {
        // The following is the base_url for the Singapore region. The base_url varies by region.
        Constants.baseHttpApiUrl = "https://dashscope-intl.aliyuncs.com/api/v1";
    }

    // If you have not configured an environment variable, replace the following line with your Model Studio API key: apiKey="sk-xxx"
    // The API key varies by region. To obtain an API key, see https://www.alibabacloud.com/help/zh/model-studio/get-api-key
    static String apiKey = System.getenv("DASHSCOPE_API_KEY");

    public static void asyncCall() throws ApiException, NoApiKeyException, UploadFileException {
        // Build a multi-image input message
        ImageGenerationMessage message = ImageGenerationMessage.builder()
                .role("user")
                .content(Arrays.asList(
                        // Supports multi-image input, allowing multiple reference images
                        Collections.singletonMap("text", "Generate an image of scrambled eggs with tomatoes using the style of image 1 and the background of image 2"),
                        Collections.singletonMap("image", "https://cdn.wanx.aliyuncs.com/tmp/pressure/umbrella1.png"),
                        Collections.singletonMap("image", "https://img.alicdn.com/imgextra/i3/O1CN01SfG4J41UYn9WNt4X1_!!6000000002530-49-tps-1696-960.webp")
                )).build();

        ImageGenerationParam param = ImageGenerationParam.builder()
                .apiKey(apiKey)
                .model("wan2.6-image")
                .n(1)
                .size("1280*1280")
                .negativePrompt("")
                .promptExtend(true)
                .messages(Arrays.asList(message))
                .build();

        ImageGeneration imageGeneration = new ImageGeneration();
        ImageGenerationResult result = null;
        try {
            System.out.println("---async call for image editing, creating task----");
            result = imageGeneration.asyncCall(param);
        } catch (ApiException | NoApiKeyException | UploadFileException e) {
            throw new RuntimeException(e.getMessage());
        }
        System.out.println("Task creation result:");
        System.out.println(JsonUtils.toJson(result));

        String taskId = result.getOutput().getTaskId();
        // Wait for the task to complete
        waitTask(taskId);
    }

    public static void waitTask(String taskId) throws ApiException, NoApiKeyException {
        ImageGeneration imageGeneration = new ImageGeneration();
        System.out.println("\n---waiting for task completion----");
        ImageGenerationResult result = imageGeneration.wait(taskId, apiKey);
        System.out.println("Task completion result:");
        System.out.println(JsonUtils.toJson(result));
    }

    public static void main(String[] args) {
        try {
            asyncCall();
        } catch (ApiException | NoApiKeyException | UploadFileException e) {
            System.out.println(e.getMessage());
        }
    }
}
```

##### Response example

1\. Example response for creating a task

```
{
    "status_code": 200,
    "request_id": "9cd85950-2e26-4b2c-b562-1694cf928xxx",
    "code": "",
    "message": "",
    "output": {
        "task_id": "4c861fbe-af89-4a2f-8fc5-4bb15c313xxx",
        "task_status": "PENDING"
    },
    "usage": null
}
```

2\. Example response for querying a task result

> The URL is valid for 24 hours. You must download the image promptly.

```
{
    "status_code": 200,
    "request_id": "cbdf1424-306e-4a52-82f3-8bf5d8a99xxx",
    "code": "",
    "message": "",
    "output": {
        "choices": [
            {
                "finish_reason": "stop",
                "message": {
                    "role": "assistant",
                    "content": [
                        {
                            "image": "https://dashscope-result-sh.oss-cn-shanghai.aliyuncs.com/xxx.png?Expires=xxx",
                            "type": "image"
                        }
                    ]
                }
            }
        ],
        "task_id": "4c861fbe-af89-4a2f-8fc5-4bb15c3139ba",
        "task_status": "SUCCEEDED",
        "submit_time": "2026-01-16 16:36:06.556",
        "scheduled_time": "2026-01-16 16:36:06.591",
        "end_time": "2026-01-16 16:36:25.190",
        "finished": true
    },
    "usage": {
        "input_tokens": 0,
        "output_tokens": 0,
        "size": "1280*1280",
        "total_tokens": 0,
        "image_count": 1
    }
}
```

### **Mixed text-and-image output**

## Synchronous call (streaming only)

##### **Request example**

```
import com.alibaba.dashscope.aigc.imagegeneration.*;
import com.alibaba.dashscope.exception.ApiException;
import com.alibaba.dashscope.exception.NoApiKeyException;
import com.alibaba.dashscope.exception.UploadFileException;
import com.alibaba.dashscope.utils.Constants;
import com.alibaba.dashscope.utils.JsonUtils;
import io.reactivex.Flowable;

import java.util.Collections;

/**
 * wan2.6-image text-and-image output - Streaming call example
 */
public class Main {

    static {
        // The following is the base_url for the Singapore region. The base_url varies by region.
        Constants.baseHttpApiUrl = "https://dashscope-intl.aliyuncs.com/api/v1";
    }

    // If you have not configured an environment variable, replace the following line with your Model Studio API key: apiKey="sk-xxx"
    // The API key varies by region. To obtain an API key, see https://www.alibabacloud.com/help/zh/model-studio/get-api-key
    static String apiKey = System.getenv("DASHSCOPE_API_KEY");

    public static void streamCall() throws ApiException, NoApiKeyException, UploadFileException {
        ImageGenerationMessage message = ImageGenerationMessage.builder()
                .role("user")
                .content(Collections.singletonList(
                        Collections.singletonMap("text", "Give me a 3-image tutorial for stir-fried pork with chili peppers")
                )).build();

        // Text-and-image output must use a streaming call
        ImageGenerationParam param = ImageGenerationParam.builder()
                .apiKey(apiKey)
                .model("wan2.6-image")
                .messages(Collections.singletonList(message))
                .stream(true) // Streaming output must be enabled
                .enableInterleave(true)
                .size("1280*1280")
                .negativePrompt("")
                .maxImages(3)
                .build();

        ImageGeneration imageGeneration = new ImageGeneration();
        try {
            System.out.println("---stream call for image interleave----");
            Flowable<ImageGenerationResult> resultFlowable = imageGeneration.streamCall(param);
            resultFlowable.blockingForEach(result -> {
                System.out.println(JsonUtils.toJson(result));
            });
        } catch (ApiException | NoApiKeyException | UploadFileException e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    public static void main(String[] args) {
        try {
            streamCall();
        } catch (ApiException | NoApiKeyException | UploadFileException e) {
            System.out.println(e.getMessage());
        }
        System.exit(0);
    }
}
```

##### Response example

> The URL is valid for 24 hours. You must download the image promptly.

```
{"requestId":"12c7432c-8028-4289-a97c-4e22df98bxxx","usage":{"input_tokens":28,"output_tokens":0,"total_tokens":28,"image_count":0,"size":"0*0"},"output":{"choices":[{"finish_reason":"null","message":{"role":"assistant","content":[{"type":"text","text":"Chili peppers"}]}}],"finished":false},"status_code":200,"code":"","message":""}
{"requestId":"12c7432c-8028-4289-a97c-4e22df98bxxx","usage":{"input_tokens":28,"output_tokens":1,"total_tokens":29,"image_count":0,"size":"0*0"},"output":{"choices":[{"finish_reason":"null","message":{"role":"assistant","content":[{"type":"text","text":"stir-fry"}]}}],"finished":false},"status_code":200,"code":"","message":""}
{"requestId":"12c7432c-8028-4289-a97c-4e22df98bxxx","usage":{"input_tokens":28,"output_tokens":2,"total_tokens":30,"image_count":0,"size":"0*0"},"output":{"choices":[{"finish_reason":"null","message":{"role":"assistant","content":[{"type":"text","text":"pork"}]}}],"finished":false},"status_code":200,"code":"","message":""}

......

{"requestId":"12c7432c-8028-4289-a97c-4e22df98bxxx","usage":{"input_tokens":28,"output_tokens":73,"total_tokens":101,"image_count":0,"size":"0*0"},"output":{"choices":[{"finish_reason":"null","message":{"role":"assistant","content":[{"type":"text","text":"."}]}}],"finished":false},"status_code":200,"code":"","message":""}
{"requestId":"12c7432c-8028-4289-a97c-4e22df98bxxx","usage":{"input_tokens":28,"output_tokens":198,"total_tokens":226,"image_count":1,"size":"1280*1280"},"output":{"choices":[{"finish_reason":"null","message":{"role":"assistant","content":[{"type":"image","image":"https://dashscope-result-sh.oss-cn-shanghai.aliyuncs.com/xxx.png?Expires=xxx"}]}}],"finished":false},"status_code":200,"code":"","message":""}
{"requestId":"12c7432c-8028-4289-a97c-4e22df98bxxx","usage":{"input_tokens":28,"output_tokens":199,"total_tokens":227,"image_count":1,"size":"1280*1280"},"output":{"choices":[{"finish_reason":"null","message":{"role":"assistant","content":[{"type":"text","text":"Next"}]}}],"finished":false},"status_code":200,"code":"","message":""}

......

{"requestId":"12c7432c-8028-4289-a97c-4e22df98bxxx","usage":{"input_tokens":28,"output_tokens":245,"total_tokens":273,"image_count":1,"size":"1280*1280"},"output":{"choices":[{"finish_reason":"null","message":{"role":"assistant","content":[{"type":"text","text":"."}]}}],"finished":false},"status_code":200,"code":"","message":""}
{"requestId":"12c7432c-8028-4289-a97c-4e22df98bxxx","usage":{"input_tokens":28,"output_tokens":368,"total_tokens":396,"image_count":2,"size":"1280*1280"},"output":{"choices":[{"finish_reason":"null","message":{"role":"assistant","content":[{"type":"image","image":"https://dashscope-result-sh.oss-cn-shanghai.aliyuncs.com/xxx.png?Expires=xxx"}]}}],"finished":false},"status_code":200,"code":"","message":""}
{"requestId":"12c7432c-8028-4289-a97c-4e22df98bxxx","usage":{"input_tokens":28,"output_tokens":369,"total_tokens":397,"image_count":2,"size":"1280*1280"},"output":{"choices":[{"finish_reason":"null","message":{"role":"assistant","content":[{"type":"text","text":"Finally"}]}}],"finished":false},"status_code":200,"code":"","message":""}

......

{"requestId":"12c7432c-8028-4289-a97c-4e22df98bxxx","usage":{"input_tokens":28,"output_tokens":416,"total_tokens":444,"image_count":2,"size":"1280*1280"},"output":{"choices":[{"finish_reason":"null","message":{"role":"assistant","content":[{"type":"text","text":"pan"}]}}],"finished":false},"status_code":200,"code":"","message":""}
{"requestId":"12c7432c-8028-4289-a97c-4e22df98bxxx","usage":{"input_tokens":28,"output_tokens":417,"total_tokens":445,"image_count":2,"size":"1280*1280"},"output":{"choices":[{"finish_reason":"null","message":{"role":"assistant","content":[{"type":"text","text":"."}]}}],"finished":false},"status_code":200,"code":"","message":""}
{"requestId":"12c7432c-8028-4289-a97c-4e22df98bxxx","usage":{"input_tokens":28,"output_tokens":541,"total_tokens":569,"image_count":3,"size":"1280*1280"},"output":{"choices":[{"finish_reason":"stop","message":{"role":"assistant","content":[{"type":"image","image":"https://dashscope-result-sh.oss-cn-shanghai.aliyuncs.com/xxx.png?Expires=xxx"}]}}],"finished":true},"status_code":200,"code":"","message":""}
```

## Asynchronous call

##### **Request example**

**Note**: Asynchronous calls do not require you to set the stream parameter.

```
import com.alibaba.dashscope.aigc.imagegeneration.*;
import com.alibaba.dashscope.exception.ApiException;
import com.alibaba.dashscope.exception.NoApiKeyException;
import com.alibaba.dashscope.exception.UploadFileException;
import com.alibaba.dashscope.utils.Constants;
import com.alibaba.dashscope.utils.JsonUtils;

import java.util.Collections;

/**
 * wan2.6-image text-and-image output - Asynchronous call example
 */
public class Main {

    static {
        // The following is the base_url for the Singapore region. The base_url varies by region.
        Constants.baseHttpApiUrl = "https://dashscope-intl.aliyuncs.com/api/v1";
    }

    // If you have not configured an environment variable, replace the following line with your Model Studio API key: apiKey="sk-xxx"
    // The API key varies by region. To obtain an API key, see https://www.alibabacloud.com/help/zh/model-studio/get-api-key
    static String apiKey = System.getenv("DASHSCOPE_API_KEY");

    public static void asyncCall() throws ApiException, NoApiKeyException, UploadFileException {
        ImageGenerationMessage message = ImageGenerationMessage.builder()
                .role("user")
                .content(Collections.singletonList(
                        Collections.singletonMap("text", "Give me a 3-image tutorial for stir-fried pork with chili peppers")
                )).build();


        ImageGenerationParam param = ImageGenerationParam.builder()
                .apiKey(apiKey)
                .model("wan2.6-image")
                .size("1280*1280")
                .enableInterleave(true)
                .maxImages(3)
                .negativePrompt("")
                .messages(Collections.singletonList(message))
                .build();

        ImageGeneration imageGeneration = new ImageGeneration();
        ImageGenerationResult result = null;
        try {
            System.out.println("---async call for image interleave, creating task----");
            result = imageGeneration.asyncCall(param);
        } catch (ApiException | NoApiKeyException | UploadFileException e) {
            throw new RuntimeException(e.getMessage());
        }
        System.out.println("Task creation result:");
        System.out.println(JsonUtils.toJson(result));

        String taskId = result.getOutput().getTaskId();
        // Wait for the task to complete
        waitTask(taskId);
    }

    public static void waitTask(String taskId) throws ApiException, NoApiKeyException {
        ImageGeneration imageGeneration = new ImageGeneration();
        System.out.println("\n---waiting for task completion----");
        ImageGenerationResult result = imageGeneration.wait(taskId, apiKey);
        System.out.println("Task completion result:");
        System.out.println(JsonUtils.toJson(result));
    }

    public static void main(String[] args) {
        try {
            asyncCall();
        } catch (ApiException | NoApiKeyException | UploadFileException e) {
            System.out.println(e.getMessage());
        }
    }
}
```

##### Response example

1\. Example response for creating a task

```
{
    "requestId": "7d6c5760-334b-48c4-9b1e-08ee9c7fexxx",
    "output": {
        "task_id": "1bb9d9fa-bf1a-43dc-b5fe-366c1dc70xxx",
        "task_status": "PENDING"
    },
    "status_code": 200,
    "code": "",
    "message": ""
}
```

2\. Example response for querying a task result

> The URL is valid for 24 hours. You must download the image promptly.

```
{
    "requestId": "6ed62b00-2225-4fc3-8ee3-2aed0b484xxx",
    "usage": {
        "input_tokens": 29,
        "output_tokens": 471,
        "total_tokens": 500,
        "image_count": 3,
        "size": "1280*1280"
    },
    "output": {
        "choices": [
            {
                "finish_reason": "stop",
                "message": {
                    "role": "assistant",
                    "content": [
                        {
                            "text": "Stir-fried pork with chili peppers is a classic Hunan dish and a beloved home-style favorite for many. It is known for its fresh, spicy flavor and tender meat. The preparation is simple, yet it delivers an ultimate taste experience. Today, let's learn how to make this dish together.\n\nFirst, preparing all the ingredients is the first step to success. Fresh pork, red and green chili peppers, garlic cloves, and ginger slices are essential. Slice the pork thinly, cut the peppers into sections, and slice the garlic and ginger for later use.",
                            "type": "text"
                        },
                        {
                            "image": "https://dashscope-result-sh.oss-cn-shanghai.aliyuncs.com/xxx.png?Expires=xxx",
                            "type": "image"
                        },
                        {
                            "text": "Next is to marinate the pork. Place the sliced pork in a bowl, add a little light soy sauce, cooking wine, starch, and cooking oil. Mix well by hand and marinate for 10-15 minutes. This will make the pork more tender and flavorful.",
                            "type": "text"
                        },
                        {
                            "image": "https://dashscope-result-sh.oss-cn-shanghai.aliyuncs.com/xxx.png?Expires=xxx",
                            "type": "image"
                        },
                        {
                            "text": "Finally, heat the wok with cool oil, add the marinated pork slices and stir-fry quickly until they change color, then set aside. Leave some oil in the wok, add the garlic and ginger slices to release their aroma, then add the chili peppers and stir-fry until fragrant. Subsequently, return the pork to the wok, add light soy sauce, dark soy sauce, a little sugar, and oyster sauce. Stir-fry quickly and evenly, and garnish with chopped green onions before serving.",
                            "type": "text"
                        },
                        {
                            "image": "https://dashscope-result-sh.oss-cn-shanghai.aliyuncs.com/xxx.png?Expires=xxx",
                            "type": "image"
                        }
                    ]
                }
            }
        ],
        "task_id": "1bb9d9fa-bf1a-43dc-b5fe-366c1dc70836",
        "task_status": "SUCCEEDED",
        "finished": true,
        "submit_time": "2026-01-16 18:26:32.082",
        "scheduled_time": "2026-01-16 18:26:32.133",
        "end_time": "2026-01-16 18:28:41.748"
    },
    "status_code": 200,
    "code": "",
    "message": ""
}
```

## **Limitations**

-   **Data validity**: The `task_id` and image `url` are retained for only 24 hours. After this period, they cannot be queried or downloaded.
    
-   **Content moderation**: The input `prompt` and the output image are both subject to content moderation. Requests that contain prohibited content result in an \`IPInfringementSuspect\` or \`DataInspectionFailed\` error. For more information, see [Error messages](/help/en/model-studio/error-code).
    
-   **Network access configuration**: Image URLs are stored in OSS. If your business system cannot access external OSS URLs due to security policies, you must add the following OSS domain names to your whitelist.
    
    ```
    # List of OSS domain names
    dashscope-result-bj.oss-cn-beijing.aliyuncs.com
    dashscope-result-hz.oss-cn-hangzhou.aliyuncs.com
    dashscope-result-sh.oss-cn-shanghai.aliyuncs.com
    dashscope-result-wlcb.oss-cn-wulanchabu.aliyuncs.com
    dashscope-result-zjk.oss-cn-zhangjiakou.aliyuncs.com
    dashscope-result-sz.oss-cn-shenzhen.aliyuncs.com
    dashscope-result-hy.oss-cn-heyuan.aliyuncs.com
    dashscope-result-cd.oss-cn-chengdu.aliyuncs.com
    dashscope-result-gz.oss-cn-guangzhou.aliyuncs.com
    dashscope-result-wlcb-acdr-1.oss-cn-wulanchabu-acdr-1.aliyuncs.com
    ```
    

## **Billing and rate limiting**

-   For free quota and unit price, see [Model pricing](/help/en/model-studio/model-pricing#e2540d71a2utl).
    
-   For model rate limits, see [Wan](/help/en/model-studio/rate-limit#513e0a3df24v7).
    
-   Billing details: Billing is based on the **number of successfully generated images**. Failed model calls or processing errors do not incur charges or consume the [free quota](/help/en/model-studio/new-free-quota).
    

## **Error codes**

If a call fails, see [Error messages](/help/en/model-studio/error-code) for troubleshooting.

## **FAQ**

**Q: How do I view the inference costs and call volume for the model?**

A: For more information, see [Bill query and cost management](/help/en/model-studio/bill-query-and-cost-management).

**Q: Why do my code examples fail to run?**

A: You may need to upgrade your SDK to the latest version. For update instructions, see [Install the SDK](/help/en/model-studio/install-sdk).

/\* 调整 table 宽度 \*/ .aliyun-docs-content table.medium-width { max-width: 1018px; width: 100%; } .aliyun-docs-content table.table-no-border tr td:first-child { padding-left: 0; } .aliyun-docs-content table.table-no-border tr td:last-child { padding-right: 0; } /\* 支持吸顶 \*/ div:has(.aliyun-docs-content), .aliyun-docs-content .markdown-body { overflow: visible; } .stick-top { position: sticky; top: 46px; } /\*\*代码块字体\*\*/ /\* 减少表格中的代码块 margin，让表格信息显示更紧凑 \*/ .unionContainer .markdown-body table .help-code-block { margin: 0 !important; } /\* 减少表格中的代码块字号，让表格信息显示更紧凑 \*/ .unionContainer .markdown-body .help-code-block pre { font-size: 12px !important; } /\* 减少表格中的代码块字号，让表格信息显示更紧凑 \*/ .unionContainer .markdown-body .help-code-block pre code { font-size: 12px !important; } /\*\* API Reference 表格 \*\*/ .aliyun-docs-content table.api-reference tr td:first-child { margin: 0px; border-bottom: 1px solid #d8d8d8; } .aliyun-docs-content table.api-reference tr:last-child td:first-child { border-bottom: none; } .aliyun-docs-content table.api-reference p { color: #6e6e80; } .aliyun-docs-content table.api-reference b, i { color: #181818; } .aliyun-docs-content table.api-reference .collapse { border: none; margin-top: 4px; margin-bottom: 4px; } .aliyun-docs-content table.api-reference .collapse .expandable-title-bold { padding: 0; } .aliyun-docs-content table.api-reference .collapse .expandable-title { padding: 0; } .aliyun-docs-content table.api-reference .collapse .expandable-title-bold .title { margin-left: 16px; } .aliyun-docs-content table.api-reference .collapse .expandable-title .title { margin-left: 16px; } .aliyun-docs-content table.api-reference .collapse .expandable-title-bold i.icon { position: absolute; color: #777; font-weight: 100; } .aliyun-docs-content table.api-reference .collapse .expandable-title i.icon { position: absolute; color: #777; font-weight: 100; } .aliyun-docs-content table.api-reference .collapse.expanded .expandable-content { padding: 10px 14px 10px 14px !important; margin: 0; border: 1px solid #e9e9e9; } .aliyun-docs-content table.api-reference .collapse .expandable-title-bold b { font-size: 13px; font-weight: normal; color: #6e6e80; } .aliyun-docs-content table.api-reference .collapse .expandable-title b { font-size: 13px; font-weight: normal; color: #6e6e80; } .aliyun-docs-content table.api-reference .tabbed-content-box { border: none; } .aliyun-docs-content table.api-reference .tabbed-content-box section { padding: 8px 0 !important; } .aliyun-docs-content table.api-reference .tabbed-content-box.mini .tab-box { /\* position: absolute; left: 40px; right: 0; \*/ } .aliyun-docs-content .margin-top-33 { margin-top: 33px !important; } .aliyun-docs-content .two-codeblocks pre { max-height: calc(50vh - 136px) !important; height: auto; } .expandable-content section { border-bottom: 1px solid #e9e9e9; padding-top: 6px; padding-bottom: 4px; } .expandable-content section:last-child { border-bottom: none; } .expandable-content section:first-child { padding-top: 0; }