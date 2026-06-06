const express = require('express');
const router = express.Router();
const pool = require('./../config/db');
const auth = require('./../../middleware/auth');



// GET all disasters
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM disasters order by ID');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// GET disaster by id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM disasters WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// POST new disaster
router.post('/', async (req, res) => {
    try {
        const { type, location, status } = req.body;
        const result = await pool.query(
            'INSERT INTO disasters (type, location, status) VALUES ($1, $2, $3) RETURNING *',
            [type, location, status]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// PUT update disaster
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { type, location, status } = req.body;
        const result = await pool.query(
            'UPDATE disasters SET type=$1, location=$2, status=$3 WHERE id=$4 RETURNING *',
            [type, location, status, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// DELETE disaster
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM disasters WHERE id=$1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
