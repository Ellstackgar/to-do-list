
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const fs = require('fs/promises');

// function that gets reused when wanting to print activities in to-do-list to user
// in reader-friendly language
function statusChecker(completed) {

    if  (completed === true)  {
        return "Completed";
    }  else {
        return "Not completed";
    };

};

// function to represent asking the user and resolving the promise as their answer,
// putting it as a variable using async/await

function ask(question) {
    return new Promise(resolve => {
        rl.question(question, answer => {
            resolve(answer);
        });
    });
}

// function to add new task to list
async function addTask(showMenu) {

    console.log('Add task selected.\n');

 const title = await confirmingLoop(
        async () => {
            return await ask('What is the title of the task you wish to add?\n') 
        },
        (value) => {
            return `The title of the task is => "${value}".\nIs this correct? (y/n)\n`
        }
    );

    try {

        const data = await fs.readFile('./toDoList.json', 'utf-8');
        const tasks = JSON.parse(data);
                
        let newID = 1;

        if (tasks.length > 0) {
            const idList = tasks.map(task => task.id);
            newID = Math.max(...idList) + 1;
        }                             

        tasks.push({
        id: newID,
        taskTitle: title,
        completed: false
        });    
                
        await fs.writeFile('./toDoList.json', JSON.stringify(tasks, null, 2));
        console.log('Task added successfully.')

        } catch (err) {
            console.error(err);
        };

        showMenu();

    };

// function to view entire list

async function viewList() {
    console.log('\nThis is the Task List:');

    try {
        const data = await fs.readFile('./toDoList.json', 'utf-8');
        const taskList = JSON.parse(data);      
        taskList.forEach((task, index) => {
            const status = statusChecker(task.completed);

            console.log(`${index + 1}. "${task.taskTitle}" ---- ${status}`)

            

        });

         console.log('\n\n');
         return taskList;

        }
        catch (err) {       
        console.error(err);
        throw err;
    }

}

// function that gets reused for requesting user's confirmation
async function confirmingLoop(getTitle, askConfirmation) {

    let confirmed = false;
    let value;

    while (!confirmed) {
        value = await getTitle();
        const confirmation = await ask(askConfirmation(value));

        if (confirmation.trim().toLowerCase() === 'y') {

            confirmed = true
        }

    }


}

// function to validate the user input for the confirmingLoop function

async function validator() { 
    if (Number.isNaN(index)) {
        console.log('That is not a valid number.')
                
    }
}
// function to mark a task as completed

async function markTask(showMenu) {

    const taskArray = await viewList();

// not sure what to do with titleMark yet i'll decide
    const titleMark = await confirmingLoop(
        async () => {
            return await ask(`Which number corresponds to the task you wish to complete/uncomplete?
To exit type "0".`)
        },
        (index) => {

           
            const selectedTask = taskArray[index-1];
            const status = statusChecker(selectedTask.completed);

            return (`\nThis is the task the task you have chosen:\n
${index}. "${selectedTask.taskTitle}" ---- ${status}
Is this correct? (y/n)`)
            }
        )
    }





// function to delete a task

function deleteTask() {

    
}

function editTaskName() {


}

module.exports = {
    ask,
    addTask,
    viewList,
    markTask,
    deleteTask,
    editTaskName
};