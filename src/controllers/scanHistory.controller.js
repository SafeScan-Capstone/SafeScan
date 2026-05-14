const db = require('../db');

function capitalizeRisk(str) {
  if (!str) return 'Unknown';
  const s = str.toLowerCase();
  if (s === 'safe') return 'Safe';
  if (s === 'risky') return 'Risky';
  if (s === 'restricted') return 'Restricted';
  return 'Unknown';
}

/**
 * GET /api/scans/:id
 * Protected route (JWT required)
 * Returns full details of a single scan including all ingredients
 */
exports.getScanById = async (req, res) => {
  try {
    const userId = req.user.id;
    const scanId = parseInt(req.params.id, 10);

    if (!scanId || isNaN(scanId)) {
      return res.status(400).json({ error: 'Invalid scan ID' });
    }

    const scanResult = await db.query(
      `SELECT id, created_at, ocr_text, product_category, overall_risk
       FROM scans WHERE id = $1 AND user_id = $2`,
      [scanId, userId]
    );

    if (scanResult.rows.length === 0) {
      return res.status(404).json({ error: 'Scan not found' });
    }

    const scan = scanResult.rows[0];

    const ingredientsResult = await db.query(
      `SELECT si.raw_text AS name, si.risk AS status,
              COALESCE(dr.reason, i.notes, '') AS reason
       FROM scan_ingredients si
       LEFT JOIN ingredients i ON si.ingredient_id = i.id
       LEFT JOIN dataset_rows dr ON LOWER(si.raw_text) = dr.ingredient_name
       WHERE si.scan_id = $1
       ORDER BY si.id`,
      [scanId]
    );

    const ingredients = ingredientsResult.rows.map(row => ({
      name: row.name,
      status: capitalizeRisk(row.status),
      reason: row.reason || '',
    }));

    const summary = {
      safeCount: ingredients.filter(i => i.status === 'Safe').length,
      riskyCount: ingredients.filter(i => i.status === 'Risky').length,
      restrictedCount: ingredients.filter(i => i.status === 'Restricted').length,
      unknownCount: ingredients.filter(i => i.status === 'Unknown').length,
    };

    res.json({
      scanId: scan.id,
      createdAt: scan.created_at,
      extractedText: scan.ocr_text,
      productCategory: scan.product_category,
      risk_level: scan.overall_risk || 'LOW',
      overallRisk: scan.overall_risk || 'LOW',
      ingredients,
      summary,
      saved: true,
      mode: 'user',
      disclaimer: 'SafeScan provides informational guidance only and is not medical advice.',
    });
  } catch (e) {
    console.error('Error fetching scan by ID:', e.message);
    res.status(500).json({ error: 'Failed to fetch scan' });
  }
};

/**
 * GET /api/scans
 * Protected route (JWT required)
 * Returns paginated scan history for the logged-in user
 * Includes productCategory and summary counts (safeCount, riskyCount, restrictedCount)
 */
exports.getScanHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    // Get total count for pagination
    const countResult = await db.query(
      'SELECT COUNT(*) FROM scans WHERE user_id = $1',
      [userId]
    );
    const total = parseInt(countResult.rows[0].count, 10);

    // Get scans with ingredient summary
    // Summary counts: safeCount (LOW), riskyCount (MEDIUM), restrictedCount (HIGH)
    // Using lowercase comparison for risk values: 'safe', 'risky', 'restricted'
    const scansResult = await db.query(
      `SELECT 
        s.id,
        s.created_at,
        s.ocr_text as "extractedText",
        s.product_category as "productCategory",
        COALESCE(
          json_build_object(
            'safeCount', SUM(CASE WHEN LOWER(si.risk) = 'safe' THEN 1 ELSE 0 END),
            'riskyCount', SUM(CASE WHEN LOWER(si.risk) = 'risky' THEN 1 ELSE 0 END),
            'restrictedCount', SUM(CASE WHEN LOWER(si.risk) = 'restricted' THEN 1 ELSE 0 END)
          ),
          '{"safeCount": 0, "riskyCount": 0, "restrictedCount": 0}'::json
        ) as summary
      FROM scans s
      LEFT JOIN scan_ingredients si ON s.id = si.scan_id
      WHERE s.user_id = $1
      GROUP BY s.id
      ORDER BY s.created_at DESC
      LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const scans = scansResult.rows.map(row => ({
      id: row.id,
      createdAt: row.created_at,
      extractedText: row.extractedText,
      productCategory: row.productCategory,
      summary: row.summary
    }));

    res.json({
      data: scans,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (e) {
    console.error('Error fetching scan history:', e);
    next(e);
  }
};
