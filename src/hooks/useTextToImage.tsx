import {useCallback, useEffect, useState} from 'react';
import fetch from 'node-fetch';
import fs from 'fs';

const engineId = 'stable-diffusion-512-v2-0';
const apiHost = process.env.API_HOST ?? 'https://api.stability.ai';
const apiKey = process.env.STABILITY_API_KEY || 'sk-9vMfcofaT9G23Ovqfp50mnKEld9boO3XEpAuhkRe8kCNxG76';

interface GenerationResponse {
  artifacts: Array<{
    base64: string;
    seed: number;
    finishReason: string;
  }>;
}

export const useTextToImage = () => {
  const [image, setImage] = useState<string>('');

  const [loaded, setLoaded] = useState<Boolean>(false);

  if (!apiKey) throw new Error('Missing Stability API key.');

  const sendQuery = useCallback(async () => {
    try {
      await setLoaded(true);
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
              text: 'A cat on a cliff',
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
      console.log('res - ', responseJSON);
      /*
      responseJSON.artifacts.forEach((image, index) => {
        fs.writeFileSync(`./out/v1beta_txt2img_${index}.png`, Buffer.from(image.base64, 'base64'));
      });
      */
      setImage(`data:image/gif;base64,${responseJSON.artifacts[0].base64}`);
      setLoaded(false);
      return responseJSON;
    } catch (error) {
      console.log('error', error);
    }
  }, []);

  useEffect(() => {
    sendQuery();
  }, [sendQuery]);

  return {image, loaded};
};