const db = require('../db');

exports.getProfile = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, email, name, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    const user = result.rows[0];
    res.json({ id: user.id, email: user.email, name: user.name, createdAt: user.created_at });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const trimmed = name.trim();
    if (trimmed.length > 80) {
      return res.status(400).json({ error: 'Name must be 80 characters or less' });
    }
    const result = await db.query(
      'UPDATE users SET name = $1 WHERE id = $2 RETURNING id, email, name, created_at',
      [trimmed, req.user.id]
    );
    const user = result.rows[0];
    res.json({ id: user.id, email: user.email, name: user.name, createdAt: user.created_at });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
