const express = require('express');
const router = express.Router();
const pool = require('./../config/db');

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM resources');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.post('/', async (req, res) => {
    const { name, type, quantity } = req.body;
    await pool.query(
        'INSERT INTO resources (name, type, quantity) VALUES ($1, $2, $3)',
        [name, type, quantity]
    );
    res.sendStatus(201);
});

// UPDATE a resource
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, quantity, status } = req.body;

    try {
        const result = await pool.query(
            `UPDATE resources 
       SET name = $1, quantity = $2, status = $3 
       WHERE id = $4 
       RETURNING *`,
            [name, quantity, status, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Resource not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const resource = await pool.query(
            'SELECT * FROM resources WHERE id = $1',
            [id]
        );

        const locations = await pool.query(
            'SELECT * FROM resource_locations WHERE resource_id = $1',
            [id]
        );

        const distributions = await pool.query(
            `SELECT rd.*, d.type AS disaster_type
             FROM resource_distributions rd
             JOIN disasters d ON rd.disaster_id = d.id
             WHERE rd.resource_id = $1`,
            [id]
        );

        res.json({
            resource: resource.rows[0],
            locations: locations.rows,
            distributions: distributions.rows
        });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

router.post('/assign', async (req, res) => {
    const { resource_id, location_id, disaster_id, quantity, destination } = req.body;

    try {
        const loc = await pool.query(
            'SELECT quantity FROM resource_locations WHERE id=$1',
            [location_id]
        );

        if (loc.rows[0].quantity < quantity) {
            return res.status(400).json({ error: 'Insufficient quantity' });
        }

        await pool.query(
            'UPDATE resource_locations SET quantity = quantity - $1 WHERE id = $2',
            [quantity, location_id]
        );

        await pool.query(
            `INSERT INTO resource_distributions
             (resource_id, disaster_id, quantity, destination)
             VALUES ($1,$2,$3,$4)`,
            [resource_id, disaster_id, quantity, destination]
        );

        res.json({ message: 'Resource assigned successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});


module.exports = router;
