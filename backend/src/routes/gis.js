const express = require('express');
const router = express.Router();

const db = require('./../config/db');
router.get('/disasters', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                id,
                type,
                location,
                status,
                severity,
                latitude,
                longitude
            FROM disasters
        `);

        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Failed to fetch incidents'
        });
    }
});

router.get('/shelters', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT id, name, capacity, status, latitude, longitude
            FROM shelters
        `);

        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Failed to fetch shelters'
        });
    }
});

router.get('/resources', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT *
            FROM resources
        `);

        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Failed to fetch resources'
        });
    }
});

router.get('/blocked-routes', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT *
            FROM blocked_routes
        `);

        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Failed to fetch blocked routes'
        });
    }
});

module.exports = router;