const axios = require('axios'); // Import axios for making API requests
module.exports = async function pushMessage(userId, message) {
const LINE_CHANNEL_ACCESS_TOKEN = '93hbF8wnDEgTeLB9unNl8GwfPccNk/AZC4ialXK4WnuSkSoZpvC6TcGywhEGFLARf2raQ+ZvfJ8qEEZCsPhnyRGVy8rDpwtHaFXjiv2cS3XJV7FNKPgf9KeBsF5zEsDiJy+NUqZeDN3O3UZxTVYJoAdB04t89/1O/w1cDnyilFU=';
      try {
        const response = await axios.post(
            'https://api.line.me/v2/bot/message/push',
            {
                to: userId,
                messages: [
                    {
                        type: 'text',
                        text: message
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
                }
            }
        );
        console.log(`Message sent to ${userId}: ${message}`);
    } catch (error) {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
    }

};

