import fetch from 'node-fetch';

const engineId = 'stable-diffusion-512-v2-0';
const apiHost = process.env.API_HOST ?? 'https://api.stability.ai';
const apiKey = process.env.REACT_APP_STABILITY_API_KEY;

interface GenerationResponse {
  artifacts: Array<{
    base64: string;
    seed: number;
    finishReason: string;
  }>;
}

export const getImage = async (text: string) => {
  if (!apiKey) throw new Error('Missing Stability API key.');
  try {
    const response = await fetch(`${apiHost}/v1beta/generation/${engineId}/text-to-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: text,
          },
        ],
        cfg_scale: 7,
        clip_guidance_preset: 'FAST_BLUE',
        height: 512,
        width: 512,
        samples: 1,
        steps: 50,
      }),
    });

    if (!response.ok) {
      throw new Error(`Non-200 response: ${await response.text()}`);
    }
    const responseJSON = (await response.json()) as GenerationResponse;
    return `data:image/gif;base64,${responseJSON.artifacts[0].base64}`;
  } catch (error) {
    console.log('error', error);
  }
};
