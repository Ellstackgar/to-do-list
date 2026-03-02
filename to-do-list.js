const tasks = require("./tasks.js");



async function showMenu() {
    const answer = await tasks.ask(`Welcome to the to-do-list app.
What would you like to do?
    1. Add task
    2. View list
    3. Complete/uncomplete task
    4. Delete task
    5. Edit task name
    6. Exit menu
    
Enter a number:\n`);

        if (answer === "1") {
            
            tasks.addTask(showMenu);
        }

        else if (answer === "2") {

            await tasks.viewList();
            
            await tasks.ask('Press "Enter" to return to the menu\n');
            showMenu();
        } else if (answer === "3") {
           
            await tasks.markTask();
            showMenu();
        } else if (answer === "4") {

            tasks.deleteTask();
            showMenu();
        } else if (answer === "5") {

            tasks.editTaskName();
            showMenu();
        } else if (answer === "6") {

            console.log("Exiting Menu\nGoodbye!")
        } else {

            console.log("Invalid Input. Please enter one of the following numbers!")
            showMenu();

        }
    };


showMenu();