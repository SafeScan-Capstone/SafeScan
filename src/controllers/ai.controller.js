const { explainIngredients, checkHealth } = require('../services/aiExplain.service');

/**
 * GET /api/aiAction/health
 * Health check for AI service
 * Public endpoint (no auth required)
 */
exports.health = async (req, res) => {
  try {
    const healthStatus = await checkHealth();
    
    // Return 200 if available, 503 if unavailable
    if (healthStatus.status === 'available') {
      return res.status(200).json({
        status: 'available',
        provider: healthStatus.provider,
        model: healthStatus.model
      });
    }
    
    // Return 503 with unavailable status
    return res.status(503).json({
      status: 'unavailable',
      provider: healthStatus.provider,
      model: healthStatus.model,
      message: 'AI_API_KEY is not configured'
    });
  } catch (error) {
    console.error('AI health check error:', error.message);
    res.status(503).json({ status: 'error', message: error.message });
  }
};

/**
 * POST /api/aiAction/explain
 * Explain/classify ingredients using AI
 * Protected route (requires JWT Bearer token)
 * 
 * Request body:
 * {
 *   "ingredients": ["name1", "name2", ...]
 * }
 * 
 * Response:
 * [
 *   { "name": "name1", "status": "Safe" | "Risky" | "Restricted", "explanation": "..." },
 *   ...
 * ]
 */
exports.explainIngredients = async (req, res) => {
  const { ingredients } = req.body;

  try {
    // Call AI service to explain ingredients
    const results = await explainIngredients(ingredients);

    // Return the results
    res.json(results);
  } catch (error) {
    console.error('AI explain controller error:', error.message);

    // Check if it's a configuration error
    if (error.message.includes('not configured') || error.message.includes('Missing AI_API_KEY')) {
      return res.status(503).json({
        error: 'AI service unavailable'
      });
    }

    // Check if it's a timeout error
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return res.status(503).json({
        error: 'AI service unavailable'
      });
    }

    // For any other errors, return 503
    return res.status(503).json({
      error: 'AI service unavailable'
    });
  }
};
