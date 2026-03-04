const db = require('../db');

// Whitelist of allowed sort fields to prevent SQL injection
const ALLOWED_SORT_FIELDS = ['created_at', 'updated_at', 'name', 'risk_level'];

// Whitelist of allowed filter keys (JSON data fields)
const ALLOWED_FILTER_KEYS = ['name', 'risk_level', 'category', 'status', 'source'];

class DatasetRepository {
  async upsertMany(rows) {
    if (!rows.length) return { inserted: 0, updated: 0, skipped: 0 };

    const values = rows.map((row, index) => `($${index * 5 + 1}, $${index * 5 + 2}, $${index * 5 + 3}, $${index * 5 + 4}, $${index * 5 + 5})`).join(', ');
    const params = rows.flatMap(row => [row.row_hash, JSON.stringify(row.data), row.source_sheet_id, row.source_range, new Date()]);

    const query = `
      INSERT INTO dataset_rows (row_hash, data, source_sheet_id, source_range, updated_at)
      VALUES ${values}
      ON CONFLICT (row_hash) DO UPDATE SET
        data = EXCLUDED.data,
        source_sheet_id = EXCLUDED.source_sheet_id,
        source_range = EXCLUDED.source_range,
        updated_at = EXCLUDED.updated_at
      RETURNING (xmax = 0) AS inserted
    `;

    const result = await db.query(query, params);
    const inserted = result.rows.filter(r => r.inserted).length;
    const updated = result.rows.length - inserted;
    return { inserted, updated, skipped: 0 };
  }

  async list({ page, limit, search, sortBy, order, filters }) {
    const offset = (page - 1) * limit;
    let whereClauses = [];
    let params = [];
    let paramIndex = 1;

    if (search) {
      whereClauses.push(`data::text ILIKE $${paramIndex++}`);
      params.push(`%${search}%`);
    }

    Object.keys(filters).forEach(key => {
      // Only allow whitelisted filter keys
      if (!ALLOWED_FILTER_KEYS.includes(key)) return;
      if (filters[key]) {
        whereClauses.push(`(data->>'${key}') ILIKE $${paramIndex++}`);
        params.push(`%${filters[key]}%`);
      }
    });

    const whereClause = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Whitelist sortBy to prevent SQL injection
    const safeSortBy = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'created_at';
    const safeOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    let orderBy;
    if (['created_at', 'updated_at'].includes(safeSortBy)) {
      orderBy = `${safeSortBy} ${safeOrder}`;
    } else {
      orderBy = `(data->>'${safeSortBy}') ${safeOrder} NULLS LAST`;
    }

    const query = `
      SELECT id, row_hash, data, source_sheet_id, source_range, created_at, updated_at
      FROM dataset_rows
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    params.push(limit, offset);

    const result = await db.query(query, params);
    return result.rows;
  }

  async count({ search, filters }) {
    let whereClauses = [];
    let params = [];
    let paramIndex = 1;

    if (search) {
      whereClauses.push(`data::text ILIKE $${paramIndex++}`);
      params.push(`%${search}%`);
    }

    Object.keys(filters).forEach(key => {
      // Only allow whitelisted filter keys
      if (!ALLOWED_FILTER_KEYS.includes(key)) return;
      if (filters[key]) {
        whereClauses.push(`(data->>'${key}') ILIKE $${paramIndex++}`);
        params.push(`%${filters[key]}%`);
      }
    });

    const whereClause = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const query = `SELECT COUNT(*) as total FROM dataset_rows ${whereClause}`;
    const result = await db.query(query, params);
    return result.rows[0] ? parseInt(result.rows[0].total) : 0;
  }
}

module.exports = new DatasetRepository();
