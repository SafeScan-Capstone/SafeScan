/**
 * Centralised risk-level mapping utilities.
 *
 * Dataset uses: LOW / MEDIUM / HIGH
 * Database (scan_ingredients.risk) uses: safe / risky / restricted
 */

const DATASET_TO_DB = {
  LOW: 'safe',
  MEDIUM: 'risky',
  HIGH: 'restricted',
};

const DB_TO_DATASET = {
  safe: 'LOW',
  risky: 'MEDIUM',
  restricted: 'HIGH',
};

/**
 * Convert dataset risk level (LOW/MEDIUM/HIGH) to DB risk value (safe/risky/restricted).
 * @param {string} riskLevel
 * @returns {string}
 */
function datasetToDb(riskLevel) {
  return DATASET_TO_DB[riskLevel] ?? 'safe';
}

/**
 * Convert DB risk value (safe/risky/restricted) to dataset risk level (LOW/MEDIUM/HIGH).
 * @param {string} dbRisk
 * @returns {string}
 */
function dbToDataset(dbRisk) {
  return DB_TO_DATASET[dbRisk] ?? 'LOW';
}

module.exports = { datasetToDb, dbToDataset };
