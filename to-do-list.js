
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const tasks = require("./tasks.js");


function showMenu() {
    rl.question(`Welcome to the to-do-list app.
    What would you like to do?
        1. Add task
        2. View list
        3. Complete task
        4. Delete task
        5. Exit menu
    
        Enter a number:`, (answer) => {

        if (answer === "1") {
            
            tasks.addTask();
            showMenu();
        }
        else if (answer === "2") {


        }

        else {


        }


    });

}

showMenu();