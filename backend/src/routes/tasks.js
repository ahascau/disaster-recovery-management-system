const express = require('express');
const router = express.Router();
const pool = require('./../config/db');
const auth = require('./../../middleware/auth');

router.use(auth);

router.get('/me', auth, async (req, res) => {
    const userId = req.user.id;

    try {

        const volunteer = await pool.query(
            'SELECT id FROM volunteers WHERE user_id = $1',
            [userId]
        );

        if (volunteer.rows.length === 0) {
            return res.status(404).json({ error: 'Volunteer not found' });
        }

        const volunteerId = volunteer.rows[0].id;

        const tasks = await pool.query(
            'SELECT * FROM tasks t WHERE t.volunteer_id = $1',
            [volunteerId]
        );

        res.json(tasks.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.patch('/:taskId/status', async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;

    try {
        const result = await pool.query(
            'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
            [status, taskId]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});
// GET tasks for a specific volunteer
router.get('/:volunteerId', async (req, res) => {
    const { volunteerId } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM tasks WHERE volunteer_id = $1',
            [volunteerId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// GET tasks for a specific disaster
router.get('/', auth, async (req, res) => {
    const { disaster_id } = req.query; // get disaster id from query param

    try {
        let result;
        if (disaster_id) {
            // join with volunteers to get volunteer names
            result = await pool.query(
                `SELECT t.id, t.task_description, t.status, t.volunteer_id, v.name AS volunteer_name
                 FROM tasks t
                 LEFT JOIN volunteers v ON t.volunteer_id = v.id
                 WHERE t.disaster_id = $1`,
                [disaster_id]
            );
        } else {
            // return all tasks if no disaster_id
            result = await pool.query(
                `SELECT t.id, t.task_description, t.status, t.volunteer_id, v.name AS volunteer_name
                 FROM tasks t
                 LEFT JOIN volunteers v ON t.volunteer_id = v.id`
            );
        }

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});




router.put('/:id/assign', async (req, res) => {
    const { id } = req.params; // task id
    const { volunteer_id } = req.body;

    try {
        // Check if volunteer exists and is available
        const volCheck = await pool.query(
            'SELECT id, availability FROM volunteers WHERE id = $1',
            [volunteer_id]
        );

        if (volCheck.rows.length === 0) {
            return res.status(400).json({ error: 'Volunteer does not exist' });
        }

        const volunteer = volCheck.rows[0];
        if (volunteer.availability !== 'Available') {
            return res.status(400).json({ error: 'Volunteer is not available' });
        }

        // Assign the volunteer and update task status to 'Assigned'
        const taskResult = await pool.query(
            `UPDATE tasks 
             SET volunteer_id = $1, status = 'Assigned' 
             WHERE id = $2 
             RETURNING *`,
            [volunteer_id, id]
        );

        // Mark volunteer as deployed
        await pool.query(
            'UPDATE volunteers SET availability = $1 WHERE id = $2',
            ['Deployed', volunteer_id]
        );

        res.json(taskResult.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});



module.exports = router;