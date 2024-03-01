const express = require('express');
const router = express.Router();
const pool = require('../config/db');

const convertRows = (rows) => {
    return rows.map(row => {
        return Object.fromEntries(Object.entries(row).map(([key, value]) => {
            if (typeof value === 'bigint') {
                return [key, value.toString()];
            }
            return [key, value];
        }));
    });
};

router.get('/', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM sensor_data");
        const jsonFriendlyRows = convertRows(rows);

        res.header('Content-Type', 'application/json');
        res.send(JSON.stringify(jsonFriendlyRows));
    } catch (err) {
        console.error('Database query failed:', err.message);
        res.status(500).send('Error reading measurement data: ' + err.message);
    } finally {
        if (conn) conn.end();
    }
});

router.get('/current', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = 'SELECT temperature, humidity, charge FROM sensor_data ORDER BY timestamp DESC LIMIT 1';
        const rows = await conn.query(query);

        if (rows.length > 0) {
            const currentData = rows[0];
            res.json(currentData);
        } else {
            res.status(404).send('No data available.')
        }
    } catch (err) {
        console.error('Failed to query the latest data:', err.message);
        res.status(500).send('Error fetching current data: ' + err.message);
    } finally {
        if (conn) conn.end();
    }
});

module.exports = router;