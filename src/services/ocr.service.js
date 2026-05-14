const axios = require('axios');

class OCRError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'OCRError';
    this.code = code;
  }
}

/**
 * Extract text from an image buffer using Groq's vision model.
 * Falls back to OCR.Space if Groq key is unavailable.
 */
module.exports = async function extractTextFromImage(imageBuffer) {
  if (!imageBuffer || !Buffer.isBuffer(imageBuffer)) {
    throw new OCRError('Invalid image buffer', 'OCR_INVALID_INPUT');
  }

  const groqKey = process.env.AI_API_KEY;
  if (groqKey) {
    return extractWithGroq(imageBuffer, groqKey);
  }

  // Fallback: OCR.Space
  const ocrKey = process.env.OCR_SPACE_API_KEY;
  if (!ocrKey) {
    throw new OCRError('No OCR service configured. Set AI_API_KEY or OCR_SPACE_API_KEY.', 'OCR_NOT_CONFIGURED');
  }
  return extractWithOcrSpace(imageBuffer, ocrKey);
};

async function extractWithGroq(imageBuffer, apiKey) {
  try {
    const base64Image = imageBuffer.toString('base64');
    const mimeType = detectMimeType(imageBuffer);

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: { url: `data:${mimeType};base64,${base64Image}` },
              },
              {
                type: 'text',
                text: 'Extract ALL text visible in this product label image exactly as it appears, preserving the layout. Include ingredients list, product name, and any other text. Return only the raw extracted text with no commentary or explanation.',
              },
            ],
          },
        ],
        max_tokens: 2000,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const text = response.data?.choices?.[0]?.message?.content || '';
    return text.trim();
  } catch (error) {
    const msg = error.response?.data?.error?.message || error.message || '';
    console.error('Groq OCR error:', msg);

    if (error.code === 'ECONNABORTED' || msg.includes('timeout')) {
      throw new OCRError('OCR service timed out', 'OCR_TIMEOUT');
    }
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      throw new OCRError('OCR service unavailable', 'OCR_NETWORK_ERROR');
    }

    throw new OCRError(`OCR processing failed: ${msg}`, 'OCR_FAILED');
  }
}

async function extractWithOcrSpace(imageBuffer, apiKey) {
  try {
    const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
    const params = new URLSearchParams({
      apikey: apiKey,
      base64Image,
      language: 'eng',
      isOverlayRequired: 'false',
      detectOrientation: 'true',
      scale: 'true',
      OCREngine: '2',
    });

    const response = await axios.post(
      'https://api.ocr.space/parse/image',
      params.toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 30000,
      }
    );

    if (response.data.IsErroredOnProcessing) {
      const errorMessage = response.data.ErrorMessage?.[0] || 'OCR processing failed';
      if (errorMessage.toLowerCase().includes('daily')) throw new OCRError('OCR daily limit exceeded', 'OCR_DAILY_LIMIT');
      if (errorMessage.toLowerCase().includes('key')) throw new OCRError('OCR API key invalid', 'OCR_AUTH_FAILED');
      throw new OCRError(`OCR processing failed: ${errorMessage}`, 'OCR_FAILED');
    }

    return (response.data.ParsedResults?.[0]?.ParsedText || '').trim();
  } catch (error) {
    if (error instanceof OCRError) throw error;
    const msg = error.message || '';
    if (error.code === 'ECONNABORTED' || msg.includes('timeout')) throw new OCRError('OCR service timed out', 'OCR_TIMEOUT');
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') throw new OCRError('OCR service unavailable', 'OCR_NETWORK_ERROR');
    throw new OCRError(`OCR processing failed: ${msg}`, 'OCR_FAILED');
  }
}

function detectMimeType(buffer) {
  if (buffer[0] === 0xff && buffer[1] === 0xd8) return 'image/jpeg';
  if (buffer[0] === 0x89 && buffer[1] === 0x50) return 'image/png';
  if (buffer[0] === 0x47 && buffer[1] === 0x49) return 'image/gif';
  if (buffer[0] === 0x52 && buffer[1] === 0x49) return 'image/webp';
  return 'image/jpeg';
}
