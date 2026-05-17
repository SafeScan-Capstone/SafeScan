const ocr = require('../services/ocr.service');
const analyzeRuleBased = require('../services/ingredientAnalysis.service');
const { analyzeWithAI } = require('../services/aiModel.service');
const { 
  analyzeTextWithDataset, 
  isDatasetAvailable, 
  mapRiskLevelToScanRisk, 
  parseIngredientTokens,
  matchIngredientsWithDataset,
  extractIngredientsSection 
} = require('../services/datasetAnalysis.service');
const { explainIngredients, explainIngredientsBatched, isApiKeyConfigured } = require('../services/aiExplain.service');
const { analyzeIngredient } = require('../services/analyzeIngredient');

const db = require('../db');

// Maximum number of ingredients to send to AI at once
const MAX_AI_INGREDIENTS = parseInt(process.env.MAX_AI_INGREDIENTS || '25', 10);

/**
 * POST /api/scan
 * multipart/form-data: image=<file>
 * Optional: productCategory (string)
 * Returns extractedText + analysis.
 * 
 * Public endpoint - works for guests and authenticated users
 * If authenticated: saves scan to history
 * If guest: returns results without saving
 */
exports.scanImage = async (req, res) => {
  const isAuthenticated = req.user && req.user.id;
  const mode = isAuthenticated ? 'user' : 'guest';

  try {
    if (!req.file) {
      return res.status(400).json({
        error: "Image file is required. Use multipart/form-data with key 'image'.",
        requestId: req.id,
      });
    }

    let extractedText;
    try {
      extractedText = await ocr(req.file.buffer);
    } catch (ocrError) {
      console.error('OCR processing error:', ocrError.message);
      const ocrMessages = {
        OCR_NOT_CONFIGURED: ['OCR service not configured', 'Please set OCR_SPACE_API_KEY in environment variables', 503],
        OCR_DAILY_LIMIT:    ['OCR daily limit exceeded', 'OCR.Space free API daily limit reached. Try again tomorrow.', 503],
        OCR_AUTH_FAILED:    ['OCR API key invalid', 'Please check your OCR_SPACE_API_KEY', 503],
        OCR_NETWORK_ERROR:  ['OCR service unavailable', 'Network error connecting to OCR service', 503],
        OCR_TIMEOUT:        ['OCR service timed out', 'The image took too long to process. Try a smaller image.', 503],
        OCR_FAILED:         ['OCR processing failed', ocrError.message || 'Failed to extract text from image', 500],
      };
      const [error, details, status] = ocrMessages[ocrError.code] || ['Scan processing failed', 'OCR extraction failed', 500];
      return res.status(status).json({ error, details, requestId: req.id });
    }

    if (!extractedText || extractedText.length < 3) {
      return res.status(422).json({
        error: 'Unable to read the label text. Try better lighting, move closer, or hold the camera steady.',
        requestId: req.id,
      });
    }

    const ingredientsText = extractIngredientsSection(extractedText);
    const userId = isAuthenticated ? req.user.id : null;
    const productCategory = req.body.productCategory || null;
    const analysis = await performFullAnalysis(ingredientsText);

    let scanId = null;
    let saved = false;

    if (isAuthenticated) {
      let client;
      try {
        client = await db.pool.connect();
        await client.query('BEGIN');

        const scanResult = await client.query(
          'INSERT INTO scans (user_id, image_path, ocr_text, product_category, overall_risk) VALUES ($1, $2, $3, $4, $5) RETURNING id',
          [userId, req.file.originalname ?? null, extractedText, productCategory, analysis.risk_level]
        );
        scanId = scanResult.rows[0].id;

        for (const result of (analysis.ingredients || [])) {
          const riskValue = mapStatusToDbValue(result.status);
          let ingredientResult = await client.query(
            'SELECT id FROM ingredients WHERE LOWER(name) = LOWER($1)', [result.name]
          );
          let ingredientId;
          if (ingredientResult.rows.length === 0) {
            const newIng = await client.query(
              'INSERT INTO ingredients (name, normalized_name, risk) VALUES ($1, $2, $3) RETURNING id',
              [result.name, result.name.toLowerCase(), riskValue]
            );
            ingredientId = newIng.rows[0].id;
          } else {
            ingredientId = ingredientResult.rows[0].id;
          }
          await client.query(
            'INSERT INTO scan_ingredients (scan_id, ingredient_id, raw_text, risk) VALUES ($1, $2, $3, $4)',
            [scanId, ingredientId, result.name, riskValue]
          );
        }

        await client.query('COMMIT');
        saved = true;
      } catch (dbError) {
        if (client) await client.query('ROLLBACK').catch(() => {});
        console.warn(`Failed to save scan: ${dbError.message}`);
      } finally {
        if (client) client.release();
      }
    }

    res.json({
      scanId, saved, mode, extractedText, ingredientsText, productCategory,
      risk_level: analysis.risk_level,
      overallRisk: analysis.risk_level,
      ingredients: analysis.ingredients,
      summary: analysis.summary,
      source: analysis.source,
      disclaimer: 'SafeScan provides informational guidance only and is not medical advice. If you have a reaction or concern, consult a healthcare professional.',
    });
  } catch (e) {
    console.error('Scan image error:', e.message);
    return res.status(500).json({ error: 'Scan processing failed', details: 'An unexpected error occurred', requestId: req.id });
  }
};

/**
 * POST /api/scan/analyze
 * JSON: { text: "...", productCategory: "..." }
 * Use this after the user edits OCR text on the frontend.
 * 
 * Public endpoint - works for guests and authenticated users
 * If authenticated: saves scan to history
 * If guest: returns results without saving
 */
exports.analyzeText = async (req, res, next) => {
  const isAuthenticated = req.user && req.user.id;
  const mode = isAuthenticated ? 'user' : 'guest';

  try {
    const { text, productCategory } = req.body || {};
    
    // Validate text is required
    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        error: 'Text is required',
      });
    }

    // Extract ingredients section from text
    const ingredientsText = extractIngredientsSection(text);

    // Perform full analysis with dataset + AI
    const analysis = await performFullAnalysis(ingredientsText);

    // Get user ID if authenticated
    const userId = isAuthenticated ? req.user.id : null;
    let scanId = null;
    let saved = false;
    
    if (isAuthenticated) {
      let client;
      try {
        client = await db.pool.connect();
        await client.query('BEGIN');

        const scanResult = await client.query(
          'INSERT INTO scans (user_id, ocr_text, product_category, overall_risk) VALUES ($1, $2, $3, $4) RETURNING id',
          [userId, text, productCategory || null, analysis.risk_level]
        );
        scanId = scanResult.rows[0].id;

        for (const ing of (analysis.ingredients || [])) {
          const scanRisk = mapStatusToDbValue(ing.status);
          let ingredientResult = await client.query(
            'SELECT id FROM ingredients WHERE LOWER(name) = LOWER($1)', [ing.name]
          );
          let ingredientId;
          if (ingredientResult.rows.length === 0) {
            const newIng = await client.query(
              'INSERT INTO ingredients (name, normalized_name, risk) VALUES ($1, $2, $3) RETURNING id',
              [ing.name, ing.name.toLowerCase(), scanRisk]
            );
            ingredientId = newIng.rows[0].id;
          } else {
            ingredientId = ingredientResult.rows[0].id;
          }
          await client.query(
            'INSERT INTO scan_ingredients (scan_id, ingredient_id, raw_text, risk) VALUES ($1, $2, $3, $4)',
            [scanId, ingredientId, ing.name, scanRisk]
          );
        }

        await client.query('COMMIT');
        saved = true;
      } catch (dbError) {
        if (client) await client.query('ROLLBACK').catch(() => {});
        console.warn(`Failed to save scan: ${dbError.message}`);
      } finally {
        if (client) client.release();
      }
    }

    // Build response with all ingredients in order
    const response = {
      scanId,
      saved,
      mode,
      extractedText: text,
      ingredientsText,
      productCategory: productCategory || null,
      risk_level: analysis.risk_level,
      overallRisk: analysis.risk_level,
      ingredients: analysis.ingredients,
      summary: analysis.summary,
      source: analysis.source,
      disclaimer:
        'SafeScan provides informational guidance only and is not medical advice. If you have a reaction or concern, consult a healthcare professional.',
    };

    res.json(response);
  } catch (e) {
    console.error(`Analyze text error: ${e.message}`);
    res.status(500).json({
      error: 'An error occurred while analyzing the text. Please try again.',
    });
  }
};

/**
 * Perform full analysis: dataset + AI for unmatched ingredients
 * Returns ingredients in the SAME order as parsed tokens
 * @param {string} text - Ingredient text to analyze
 * @returns {Promise<Object>} - Analysis result with all ingredients classified
 */
async function performFullAnalysis(text) {
  // Step 1: Parse ingredients into tokens (preserves order) and clean them
  let tokens = parseIngredientTokens(text)
    .map(t => t.trim())
    .filter(t => t.length > 1);
  
  if (!tokens || tokens.length === 0) {
    return createEmptyAnalysisResult();
  }

  // Step 2: Try dataset analysis to get known and unknown
  let knownResults = [];
  let unknownNames = [];
  let datasetAvailable = false;
  
  try {
    datasetAvailable = await isDatasetAvailable();
    if (datasetAvailable) {
      const result = await matchIngredientsWithDataset(tokens);
      knownResults = result.knownResults || [];
      unknownNames = result.unknownNames || [];
    } else {
      // Dataset not available - all are unknown
      unknownNames = [...tokens];
    }
  } catch (datasetError) {
    console.warn(`Dataset match failed: ${datasetError.message}`);
    // If dataset fails, treat all as unknown
    unknownNames = [...tokens];
  }

  // Step 3: AI classify unknown ingredients (if any and AI is configured)
  // Use explainIngredientsBatched for automatic deduplication and batching
  let aiResults = [];
  
  if (unknownNames.length > 0 && isApiKeyConfigured()) {
    try {
      // Use the batched function which handles deduplication and batching automatically
      const aiResponse = await explainIngredientsBatched(unknownNames, MAX_AI_INGREDIENTS);
      
      if (aiResponse && Array.isArray(aiResponse)) {
        aiResults = aiResponse.map(aiResult => ({
          name: aiResult.name,
          status: mapAIStatusToStatus(aiResult.status),
          reason: aiResult.explanation || '',
          source: 'ai'
        }));

        // Cache AI results back into dataset_rows so future scans are instant
        for (const result of aiResults) {
          if (result.status === 'Unknown') continue;
          const riskMap = { Safe: 'LOW', Risky: 'MEDIUM', Restricted: 'HIGH' };
          const riskLevel = riskMap[result.status] || 'LOW';
          db.query(
            `INSERT INTO dataset_rows (ingredient_name, risk_level, reason)
             VALUES ($1, $2, $3)
             ON CONFLICT (ingredient_name) DO NOTHING`,
            [result.name.toLowerCase(), riskLevel, result.reason]
          ).catch(() => {});
        }
      }
    } catch (aiError) {
      console.warn(`AI classification failed: ${aiError.message}`);
      // Don't crash - those ingredients will be marked as Unknown
    }
  }

  // Step 4: Build final structured ingredients array in SAME order as tokens
  const finalIngredients = [];

  // Normalize tokens to improve mapping consistency and then analyze each ingredient
  for (const token of tokens) {
    // Always normalize OCR noise into candidate standardized names
    // (Normalization is handled inside analyzeIngredient; we keep the variable for future AI wiring.)
    // eslint-disable-next-line no-unused-vars
    const normalizedCandidates = [];
    try {
      const candidates = require('../services/normalizeIngredient').normalizeIngredient(token);
      if (Array.isArray(candidates) && candidates.length > 0) {
        normalizedCandidates.push(...candidates);
      }
    } catch (e) {
      // ignore; analyzeIngredient will fallback
    }


    // Deterministically build full analysis JSON (KB fallback is guaranteed)
    // If AI were added later, analyzeIngredient can be expanded to incorporate it.
    // For now, this guarantees strict JSON and removes the "No AI output returned" issue.
    // eslint-disable-next-line no-await-in-loop
    const analysis = await analyzeIngredient(token);

    // Derive legacy fields for existing frontend logic
    const statusMap = { SAFE: 'Safe', CAUTION: 'Risky', AVOID: 'Restricted' };
    finalIngredients.push({
      ...analysis,
      // legacy fields used by Results.jsx transformResults()
      name: analysis.ingredient,
      status: statusMap[analysis.status] || 'Unknown',
      reason: analysis.description,
      explanation: analysis.description,
      fromAI: analysis.sources?.some(s => String(s).toLowerCase().includes('ai')) || false,
      fromGemini: false,
    });

  }

  // Step 5: Calculate summary counts
  const summary = {
    safeCount: finalIngredients.filter(ing => ing.status === 'Safe').length,
    riskyCount: finalIngredients.filter(ing => ing.status === 'Risky').length,
    restrictedCount: finalIngredients.filter(ing => ing.status === 'Restricted').length,
    unknownCount: finalIngredients.filter(ing => ing.status === 'Unknown').length
  };

  // Step 6: Determine overall risk level (highest severity)
  let risk_level = 'LOW';
  if (finalIngredients.some(ing => ing.status === 'Restricted')) {
    risk_level = 'HIGH';
  } else if (finalIngredients.some(ing => ing.status === 'Risky')) {
    risk_level = 'MEDIUM';
  } else if (finalIngredients.some(ing => ing.status === 'Unknown')) {
    risk_level = 'MEDIUM'; // Unknowns are treated as potentially risky
  }

  // Step 7: Determine source
  let source = 'rules';
  if (datasetAvailable && knownResults.length > 0) {
    source = aiResults.length > 0 ? 'dataset+ai' : 'dataset';
  } else if (aiResults.length > 0) {
    source = 'ai';
  }

  return {
    risk_level,
    overallRisk: risk_level,
    ingredients: finalIngredients,
    summary,
    source
  };
}

/**
 * Create empty analysis result when no ingredients found
 */
function createEmptyAnalysisResult() {
  return {
    risk_level: 'LOW',
    overallRisk: 'LOW',
    ingredients: [],
    summary: {
      safeCount: 0,
      riskyCount: 0,
      restrictedCount: 0,
      unknownCount: 0
    },
    source: 'rules'
  };
}

/**
 * Map status to database risk value
 */
function mapStatusToDbValue(status) {
  switch (status) {
    case 'Safe':
      return 'safe';
    case 'Risky':
      return 'risky';
    case 'Restricted':
      return 'restricted';
    default:
      return 'unknown';
  }
}

/**
 * Map AI status to standard status (Safe|Risky|Restricted|Unknown)
 */
function mapAIStatusToStatus(status) {
  if (!status) return 'Unknown';
  
  const normalized = String(status).toLowerCase().trim();
  
  if (normalized === 'safe') return 'Safe';
  if (normalized === 'risky') return 'Risky';
  if (normalized === 'restricted') return 'Restricted';
  
  return 'Unknown';
}

/**
 * Calculate summary counts from analysis results
 */
function calculateSummary(analysis) {
  if (!analysis.ingredients || analysis.ingredients.length === 0) {
    return {
      safeCount: 0,
      riskyCount: 0,
      restrictedCount: 0,
      unknownCount: 0
    };
  }
  
  return {
    safeCount: analysis.ingredients.filter(ing => ing.status === 'Safe').length,
    riskyCount: analysis.ingredients.filter(ing => ing.status === 'Risky').length,
    restrictedCount: analysis.ingredients.filter(ing => ing.status === 'Restricted').length,
    unknownCount: analysis.ingredients.filter(ing => ing.status === 'Unknown').length
  };
}

/**
 * Convert AI result format to rule-based format for unified response
 */
function convertAIRuleToFormat(aiResult) {
  const matchedIngredients = aiResult.matched_ingredients.map((ing) => ({
    name: ing.name,
    risk_level: ing.risk === 'HIGH' ? 'HIGH' : ing.risk === 'LOW' ? 'LOW' : 'MEDIUM',
    reason: ing.reason || ''
  }));

  const summary = {
    safeCount: matchedIngredients.filter(m => m.risk_level === 'LOW').length,
    riskyCount: matchedIngredients.filter(m => m.risk_level === 'MEDIUM').length,
    restrictedCount: matchedIngredients.filter(m => m.risk_level === 'HIGH').length
  };

  let risk_level = 'LOW';
  if (matchedIngredients.some(m => m.risk_level === 'HIGH')) {
    risk_level = 'HIGH';
  } else if (matchedIngredients.some(m => m.risk_level === 'MEDIUM')) {
    risk_level = 'MEDIUM';
  }

  const results = aiResult.matched_ingredients.map((ing) => ({
    ingredient: ing.name,
    status: ing.risk === 'HIGH' ? 'Restricted' : ing.risk === 'LOW' ? 'Safe' : 'Risky',
    explanation: ing.reason || '',
    matchedKey: ing.name.toLowerCase(),
  }));

  return {
    ingredients: aiResult.matched_ingredients.map((ing) => ing.name),
    results,
    summary,
    risk_level,
    matched_ingredients: matchedIngredients,
    explanations: aiResult.explanations || [],
    recommendations: aiResult.recommendations,
    model_version: aiResult.model_version,
  };
}

