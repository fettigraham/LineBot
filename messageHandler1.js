const pushMessage = require("./pushMessage");

// Dialogue tree structure
const dialogueTree = {
    start: {
        message: "Would you like a tea, or coffee? (Type 1 for tea, 2 for coffee)",
        options: {
            1: "tea",
            2: "coffee"
        }
    },
    tea: {
        message: "Okay, you want a tea. Large, or small? (Type 1 for large, 2 for small)",
        options: {
            1: "largeTea",
            2: "smallTea"
        }
    },
    coffee: {
        message: "Okay, you want a coffee. Large, or small? (Type 1 for large, 2 for small)",
        options: {
            1: "largeCoffee",
            2: "smallCoffee"
        }
    },
    largeTea: {
        message: "One large tea coming up. Message me again to place another order. Thank you!"
    },
    smallTea: {
        message: "One small tea coming up. Message me again to place another order. Thank you!"
    },
    largeCoffee: {
        message: "One large coffee coming up. Message me again to place another order. Thank you!"
    },
    smallCoffee: {
        message: "One small coffee coming up. Message me again to place another order. Thank you!"
    }
};

module.exports = async function handleMessage(event, userSessions){
    const userId = event.source.userId;
    if (!userSessions[userId]) {
        userSessions[userId] = { state: "start" };
        const currentState = userSessions[userId].state;
        const currentDialogue = dialogueTree[currentState];
        await pushMessage(userId, currentDialogue.message);
        console.log('State: ' + currentState);
    }
    else{
        const currentState = userSessions[userId].state;
        const currentDialogue = dialogueTree[currentState];
        const userInput = event.message.text;
        const nextState = currentDialogue.options ? currentDialogue.options[userInput] : null;
        if (nextState) {
            userSessions[userId].state = nextState;
        }
        else {
               console.log(`Invalid input from ${userId}`);
        }
        const nextDialogue = dialogueTree[nextState];
        await pushMessage(userId, nextDialogue.message);
        console.log('State: '+ userSessions[userId].state);
        if (userSessions[userId].state == "smallTea" || userSessions[userId].state == "largeTea" || 
            userSessions[userId].state == "smallCoffee" || userSessions[userId].state == "smallCoffee"){
            delete userSessions[userId];
        }
    }
};
