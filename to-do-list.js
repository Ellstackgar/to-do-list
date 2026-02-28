
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
    3. Complete/uncomplete task
    4. Delete task
    5. Edit task name
    6. Exit menu
    
Enter a number:\n`, (answer) => {

        if (answer === "1") {
            
            tasks.addTask(rl, showMenu);
        }

        else if (answer === "2") {

            tasks.viewList();
            
            rl.question('Press "Enter" to return to the menu\n', () => {
           showMenu();
        });

        }

        else if (answer === "3") {

            tasks.markTask(rl,showMenu);
            

        }

        else if (answer === "4") {

            tasks.deleteTask();
            showMenu();
        }

        else if (answer === "5") {

            tasks.editTaskName();
            showMenu();
        }

        else if (answer === "6") {

            console.log("Exiting Menu\nGoodbye!")
        }

        else {

            console.log("Invalid Input. Please enter one of the following numbers!")
            showMenu();

        }


    });

}

showMenu();