// Rate limiting store (in-memory for now)
const rateLimits = new Map();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimits.entries()) {
    if (now - data.resetTime > 300000) { // 5 minutes
      rateLimits.delete(key);
    }
  }
}, 300000);

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get user identifier (IP address)
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.split(',')[0] : req.connection.remoteAddress;

  // Rate limiting: 50 requests per 5 minutes per IP
  const now = Date.now();
  const userLimit = rateLimits.get(ip) || { count: 0, resetTime: now };

  if (now > userLimit.resetTime) {
    // Reset window
    userLimit.count = 0;
    userLimit.resetTime = now + 300000; // 5 minutes
  }

  if (userLimit.count >= 50) {
    return res.status(429).json({
      error: 'Rate limit exceeded. Try again in a few minutes.'
    });
  }

  userLimit.count++;
  rateLimits.set(ip, userLimit);

  // Get text and voice from request
  const { text, voiceId } = req.body;

  if (!text || !voiceId) {
    return res.status(400).json({ error: 'Missing text or voiceId' });
  }

  // Validate text length (max 500 chars to prevent abuse)
  if (text.length > 500) {
    return res.status(400).json({ error: 'Text too long (max 500 characters)' });
  }

  // Get API key from environment variable
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    // Call ElevenLabs API
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs error:', errorText);
      return res.status(response.status).json({
        error: 'ElevenLabs API error',
        details: errorText
      });
    }

    // Get audio data
    const audioBuffer = await response.arrayBuffer();

    // Return audio with proper headers
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.send(Buffer.from(audioBuffer));

  } catch (error) {
    console.error('TTS proxy error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
