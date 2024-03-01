const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const pool = require('./config/db');
require('dotenv').config();
const measurementsRoute = require('./routes/measurements');
const errorHandler = require('./utils/errorHandler');

const app = express();
const port = process.env.PORT;

app.use(express.static("public"));
app.use('/api/measurements', measurementsRoute);
app.use(errorHandler);

const server = http.createServer(app);
const wss = new WebSocket.Server({server});

wss.on("connection", function connection(ws) {
    console.log("New connection!");

    ws.on("message", async function incoming(message) {
        try {
            let obj = JSON.parse(message);
            if (obj.method && obj.method === "NotifyFullStatus") {
                console.log("Received: " + message);
                const {tC: temperature} = obj.params['temperature:0'];
                const {rh: humidity} = obj.params['humidity:0'];
                const {percent: charge } = obj.params['devicepower:0'].battery;
                let timestamp = Date.now();

                console.log(`${new Date(timestamp)}: ${temperature}°C and ${humidity}%`);
                console.log(`Battery: ${charge}%`);
                await storeValues(timestamp, temperature, humidity, charge)
            }
        } catch (err) {
            console.error("An error occurred:", err);
        }
    });
});

async function storeValues(timestamp, temperature, humidity, charge) {
    let conn;
    try {
        conn = await pool.getConnection();
        const res = await conn.query("INSERT INTO sensor_data (timestamp, temperature, humidity, charge) VALUES (?, ?, ?, ?)", [timestamp, temperature, humidity, charge]);
        console.log("Data successfully stored with ID:", res.insertId);
    } catch (err) {
        console.error("An error occurred while writing data to the database:", err);
    } finally {
        if (conn) await conn.end();
    }
}

server.listen(port, () => {
    console.log(`Server started on port ${server.address().port}`);
});