const axios = require('axios');

const OCR_SPACE_API_URL = 'https://api.ocr.space/parse/image';

class OCRError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'OCRError';
    this.code = code;
  }
}

module.exports = async function extractTextFromImage(imageBuffer) {
  if (!imageBuffer || !Buffer.isBuffer(imageBuffer)) {
    throw new OCRError('Invalid image buffer', 'OCR_INVALID_INPUT');
  }

  const apiKey = process.env.OCR_SPACE_API_KEY;
  if (!apiKey) {
    throw new OCRError('OCR service not configured. Set OCR_SPACE_API_KEY in environment.', 'OCR_NOT_CONFIGURED');
  }

  try {
    // Use base64 encoding — more reliable than multipart in serverless environments
    const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

    const params = new URLSearchParams();
    params.append('apikey', apiKey);
    params.append('base64Image', base64Image);
    params.append('language', 'eng');
    params.append('isOverlayRequired', 'false');
    params.append('detectOrientation', 'true');
    params.append('scale', 'true');
    params.append('OCREngine', '2');

    const response = await axios.post(OCR_SPACE_API_URL, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 30000,
    });

    if (response.data.IsErroredOnProcessing) {
      const errorMessage = response.data.ErrorMessage?.[0] || 'OCR processing failed';
      console.error('OCR.Space API error:', errorMessage);
      if (errorMessage.toLowerCase().includes('daily')) {
        throw new OCRError('OCR daily limit exceeded', 'OCR_DAILY_LIMIT');
      }
      if (errorMessage.toLowerCase().includes('credit') || errorMessage.toLowerCase().includes('key')) {
        throw new OCRError('OCR API key invalid or insufficient credits', 'OCR_AUTH_FAILED');
      }
      throw new OCRError(`OCR processing failed: ${errorMessage}`, 'OCR_FAILED');
    }

    if (!response.data.ParsedResults || response.data.ParsedResults.length === 0) {
      return '';
    }

    return (response.data.ParsedResults[0]?.ParsedText || '').trim();

  } catch (error) {
    if (error instanceof OCRError) throw error;

    const msg = error.message || '';
    console.error('OCR.Space error:', msg, error.response?.data || '');

    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
      throw new OCRError('OCR service unavailable due to network issue', 'OCR_NETWORK_ERROR');
    }
    if (error.code === 'ECONNABORTED' || msg.includes('timeout')) {
      throw new OCRError('OCR service timed out', 'OCR_TIMEOUT');
    }

    throw new OCRError(`OCR processing failed: ${msg}`, 'OCR_FAILED');
  }
};
