const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/db');

const SECRET = 'your_secret_key';

// REGISTER
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
        `INSERT INTO users (name, email, password, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [name, email, hashedPassword, role || 'end-user']
    );

    res.json({ id: result.rows[0].id });
});

// LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const result = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );

    const user = result.rows[0];

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
        { id: user.id, role: user.role },
        SECRET
    );

    res.json({ token,
    role:user.role,
    id:user.id});
});

module.exports = router;