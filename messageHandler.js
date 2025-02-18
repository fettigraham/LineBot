const pushMessage = require("./pushMessage");
const { saveUserState, updateUserState, getUserState } = require("./database");

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

module.exports = async function handleMessage(event){
    const userId = event.source.userId;
    let userState = await getUserState(userId);
    if (!userState) {
        userState = "start";
        const currentState = userState;
        const currentDialogue = dialogueTree[currentState];
        await pushMessage(userId, currentDialogue.message);
        console.log('State: ' + currentState);
        await saveUserState(userId, currentState);
    }
    else{
        const currentState = userState;
        const currentDialogue = dialogueTree[currentState];
        const userInput = event.message.text;
        const nextState = currentDialogue.options ? currentDialogue.options[userInput] : null;
        if (nextState) {
            await updateUserState(userId, nextState);
            const nextDialogue = dialogueTree[nextState];
            await pushMessage(userId, nextDialogue.message);
            console.log('State: '+ nextState);
            if (nextState == "smallTea" || nextState == "largeTea" ||
                nextState == "smallCoffee" || nextState == "largeCoffee"){
                await updateUserState(userId, null);
            }

        }
        else {
               console.log(`Invalid input from ${userId}`);
     	       await pushMessage(userId, "I couldn't understand that. Please choose an option from the menu.");
        }
    }
};
