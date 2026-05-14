const app = require('../src/app');
const db = require('../src/db');

// Initialize DB schema on cold start (idempotent — uses IF NOT EXISTS)
db.initSchema().catch(e => console.error('Schema init error:', e.message));

module.exports = app;
