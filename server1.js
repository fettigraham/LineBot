const express = require('express');
const fs = require('fs');
const https = require('https');
const axios = require('axios'); // Import axios for making API requests
const app = express();
const handleEvent = require("./eventHandler");

app.use(express.json());

// HTTPS server options
const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/zzza.space/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/zzza.space/fullchain.pem')
};

// Store user sessions and dialogue states
const userSessions = {};

// Handle webhook POST requests
app.post('/webhook', async (req, res) => {
    const events = req.body.events;

    if (events && events.length > 0) {
        await Promise.all(events.map(async (event) => {
		await handleEvent(event, userSessions);
   	 }));
   }
    res.status(200).send('Webhook received successfully!');
});

// Start the HTTPS server
https.createServer(options, app).listen(3000, () => {
    console.log('HTTPS Server running on port 3000');
});
