const express = require('express');
const router = express.Router();
const pool = require('./../config/db');
const auth = require('./../../middleware/auth');
const requireRole = require('./../../middleware/requireRole');

router.get(
    '/',
    auth,
    requireRole('ADMIN'),
    async (req, res) => {
        const result = await pool.query('SELECT * FROM volunteers');
        res.json(result.rows);
    }
);
// GET volunteer by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'SELECT id, name FROM volunteers WHERE id = $1',
            [id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Volunteer not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});


router.post('/', async (req, res) => {
    const { name, skill, availability } = req.body;
    await pool.query(
        'INSERT INTO volunteers (name, skill, availability) VALUES ($1, $2, $3)',
        [name, skill, availability]
    );
    res.sendStatus(201);
});

module.exports = router;
