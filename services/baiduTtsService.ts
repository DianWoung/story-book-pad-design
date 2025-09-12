const BAIDU_TTS_API_KEY = 'wGNUdEc5aXGH6CA2yind8u77';
const BAIDU_TTS_SECRET_KEY = 'QlHr7PKuWcU94aTn12kzesgKZSqAk2IW';

let accessToken: string | null = null;
let tokenExpiresAt: number = 0;

async function getAccessToken(): Promise<string> {
  // Return cached token if it's still valid
  if (accessToken && Date.now() < tokenExpiresAt) {
    return accessToken;
  }

  // NOTE: In a real-world application, this client-side token request is insecure
  // and would likely be blocked by CORS. This should be handled by a backend server
  // that proxies the request to Baidu. For this project, we assume the environment
  // allows this request to succeed.
  const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${BAIDU_TTS_API_KEY}&client_secret=${BAIDU_TTS_SECRET_KEY}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Baidu token API request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
       throw new Error(`Baidu token API error: ${data.error_description}`);
    }

    accessToken = data.access_token;
    // Refresh token 1 minute before it expires
    tokenExpiresAt = Date.now() + (data.expires_in * 1000) - 60000; 
    return accessToken as string;
  } catch (error) {
    console.error("Failed to fetch Baidu TTS access token:", error);
    throw new Error("Could not authenticate with the voice generation service.");
  }
}

export const generateSpeech = async (text: string, lang: 'en' | 'zh'): Promise<Blob> => {
  const token = await getAccessToken();
  const cuid = 'ai_storybook_generator_web_client';
  const language = lang === 'en' ? 'en' : 'zh';
  // Use expressive premium voices
  const persona = lang === 'en' ? 1110 : 3;

  const params = new URLSearchParams({
    tex: text,
    tok: token,
    cuid: cuid,
    ctp: '1',
    lan: language,
    per: persona.toString(),
    spd: '5', // Speed (0-15, default 5)
    pit: '5', // Pitch (0-15, default 5)
    vol: '5', // Volume (0-15, default 5)
    aue: '3', // Audio encoding: 3 for mp3
  });

  const url = `https://tsn.baidu.com/text2audio?${params.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Baidu TTS API request failed with status ${response.status}`);
  }

  const blob = await response.blob();

  // Baidu returns a JSON error with a 200 status code if the text is invalid
  if (blob.type === 'application/json') {
    const errorText = await blob.text();
    const errorData = JSON.parse(errorText);
    console.error("Baidu TTS API error:", errorData);
    throw new Error(`Voice generation failed: ${errorData.err_msg}`);
  }

  return blob;
};
