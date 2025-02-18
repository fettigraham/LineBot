const pushMessage = require("./pushMessage");
const { saveUserState, updateUserState, getUserState,
	getCurrentOrder, addToOrder, saveCurrentOrder,
	clearCurrentOrder } = require("./database");
// Dialogue tree structure
const dialogueTree = {
    start: {
        message: "Would you like tea, or coffee? (Type 1 for tea, 2 for coffee)",
        options: {
            1: "tea",
            2: "coffee"
        }
    },
    tea: {
        message: "Okay, you want tea. How many would you like?"
         },
    coffee: {
        message: "Okay, you want coffee. How many would you like?" 
         },
    addAnother: {
        message: "Would you like to add another item? (Choose y/n)",
	options: {
	    "y": "start",
	    "Y": "start",
	    "n": "saveOrder"
	}
    },
    saveOrder: {
        message: "Your order has been submitted. Send any message to start another order"
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
    else if(userState == "start"){
        const currentState = userState;
        const currentDialogue = dialogueTree[currentState];
        const userInput = event.message.text;
        const nextState = currentDialogue.options ? currentDialogue.options[userInput] : null;
        if (nextState) {
            await updateUserState(userId, nextState);
            const nextDialogue = dialogueTree[nextState];
            await pushMessage(userId, nextDialogue.message);
            console.log('State: '+ nextState);
        }
        else {
               console.log(`Invalid input from ${userId}`);
     	       await pushMessage(userId, "I couldn't understand that. Please choose an option from the menu.");
        }
    }
    else if(userState == "tea" || userState == "coffee"){
	await addToOrder(userId, userState, event.message.text);
	await updateUserState(userId, "addAnother");
        await pushMessage(userId, dialogueTree["addAnother"].message);
    }
    else if(userState == "addAnother"){
        const currentState = userState;
        const currentDialogue = dialogueTree[currentState];
        const userInput = event.message.text;
        const nextState = currentDialogue.options ? currentDialogue.options[userInput] : null;
        await updateUserState(userId, nextState);
        const nextDialogue = dialogueTree[nextState];
        await pushMessage(userId, nextDialogue.message);
        console.log('State: '+ nextState);
	if(nextState == "saveOrder"){
	    await saveCurrentOrder(userId);
	    await clearCurrentOrder(userId);
	    await updateUserState(userId, null);
	}
    }
};
