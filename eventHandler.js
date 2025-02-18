const handleMessage = require("./messageHandler");
module.exports = async function handleEvent(event) {
  switch (event.type) {
    case 'message':
      // Handle message event
      console.log('Handling message event');
      handleMessage(event);
      break;
    case 'follow':
      // Handle follow event
      console.log('Handling follow event:', event);
      break;
    // Add more cases as needed
    default:
      console.log('Unknown event type:', event.type);
  }
};
