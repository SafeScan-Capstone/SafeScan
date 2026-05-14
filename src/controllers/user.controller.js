const db = require('../db');

exports.getProfile = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, email, name, avatar, created_at FROM users WHERE id = $1 LIMIT 1',
      [req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = result.rows[0];
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      createdAt: user.created_at,
    });
  } catch (e) {
    console.error('getProfile error:', e.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }

    if (name.trim().length > 80) {
      return res.status(400).json({ error: 'Name must be 80 characters or fewer' });
    }

    // avatar is a base64 data URL or null — cap size to ~2MB base64
    if (avatar && avatar.length > 2 * 1024 * 1024 * 1.4) {
      return res.status(400).json({ error: 'Avatar image is too large' });
    }

    const result = await db.query(
      'UPDATE users SET name = $1, avatar = $2 WHERE id = $3 RETURNING id, email, name, avatar, created_at',
      [name.trim(), avatar ?? null, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      createdAt: user.created_at,
    });
  } catch (e) {
    console.error('updateProfile error:', e.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
