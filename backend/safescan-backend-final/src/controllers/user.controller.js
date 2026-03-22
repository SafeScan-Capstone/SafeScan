const db = require('../db');

exports.getProfile = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, email, name, avatar, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    const user = result.rows[0];
    res.json({ id: user.id, email: user.email, name: user.name, avatar: user.avatar, createdAt: user.created_at });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const trimmed = name.trim();
    if (trimmed.length > 80) {
      return res.status(400).json({ error: 'Name must be 80 characters or less' });
    }
    // Validate avatar if provided (must be a base64 data URL)
    if (avatar && typeof avatar === 'string' && !avatar.startsWith('data:image/')) {
      return res.status(400).json({ error: 'Invalid avatar format' });
    }
    const result = await db.query(
      'UPDATE users SET name = $1, avatar = $2 WHERE id = $3 RETURNING id, email, name, avatar, created_at',
      [trimmed, avatar ?? null, req.user.id]
    );
    const user = result.rows[0];
    res.json({ id: user.id, email: user.email, name: user.name, avatar: user.avatar, createdAt: user.created_at });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
