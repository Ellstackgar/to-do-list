
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const fs = require('fs/promises');

// function to load tasks when writing to toDoList.json
async function loadTasks() {
    const data = await fs.readFile('./toDoList.json', 'utf-8');
    if (data.trim() === '') {       
        return null;
    }
    return JSON.parse(data);
}

// function to save the new information to toDoList.json
async function saveTasks(tasks) {
    await fs.writeFile('./toDoList.json', JSON.stringify(tasks, null, 2));
}

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
async function addTask() {

    console.log('Add task selected.\n');
    try {

    const title = await confirmingLoop(
        async () => {
            return await ask('What is the title of the task you wish to add?\nEnter "0" to exit.\n') 
        },
        (value) => {
            return ('The title of the task is => "${value}".\nIs this correct? (y/n)\n')
        },
        (couldBeZero) => {
            if (couldBeZero.trim() === '0') {
                return 'cancel';
            }
            return couldBeZero;
            }       
    );   
        if (title === null) {
            await ask('Enter to return to the menu.\n');
            return;
        }

        const tasks = await loadTasks();
                
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
                
        await saveTasks(tasks);

        console.log('Task added successfully.')

        } catch (err) {
            console.error(err);
        };
        return;

    };

// function to view entire list

async function viewList() {


    try {

        
        const taskList = await loadTasks();

        if (taskList === null) {
            console.log('\nThere is no to-do-list.\nPlease add new tasks in order to see the list.')
            return null;

        } else if (taskList.length === 0) {                     
            console.log('\nThere is no to-do-list.\nPlease add new tasks in order to see the list.')
            return null;          
        }
       
        console.log('\nThis is the Task List:');
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
async function confirmingLoop(getTitle, askConfirmation, numberValidator, arrayLength) {

    let confirmed = false;
    let value;
    let validated;
    while (!confirmed) {
        value = await getTitle();

        if (numberValidator) {
            validated = numberValidator(value, arrayLength);

            if (validated === "invalid") {
                continue;

            } else if (validated === "cancel") {
                return null;
                
            }
            value = validated;
        }

        const confirmation = await ask(askConfirmation(value));

        if (confirmation.trim().toLowerCase() === 'y') {
            confirmed = true
        }
    }
    return value;
}

// function to validate the user input for the confirmingLoop function

function validator(index, max) { 

    const num = Number(index);

    if (Number.isNaN(num)) {
        console.log('\nThat is not a valid number.\n');
        return "invalid";

    } else if (num === 0) {
        console.log('\nGoing back to the Menu.\n');
        return "cancel";
    
    } else if (num < 0 || num > max) {
        console.log('\nThat number is out of range.\n')
        return "invalid";

    } else {
        return num;

    }
}

// function that contains shared logic between markTask and deleteTask

async function modifyTask(firstLine, arrayOperation, successText) {

    try {
        const taskArray = await viewList();

        if (taskArray === null) {
            await ask('Enter to return to the menu.\n');
            return;
        }

        const titleMarker = await confirmingLoop(
            async () => {
                return await ask(`Which number corresponds to the task you wish to ${firstLine}?
To exit type "0".\n`)
            },
            (index) => {           
                const selectedTask = taskArray[index-1];
                const status = statusChecker(selectedTask.completed);

                return (`\nThis is the task the task you have chosen:\n
${index}. "${selectedTask.taskTitle}" ---- ${status}
Is this correct? (y/n)\n`)}, 
                validator,
                taskArray.length
            );
    
        if (titleMarker === null) {  
            await ask('Enter to return to the menu.\n');             
            return;
        }
    
        const updatedArray = await arrayOperation(taskArray,titleMarker);
                  
        await saveTasks(updatedArray);
        console.log(successText)
    
        } catch (err) {
                console.error(err);
    };
}


// function to mark a task as completed

async function markTask() {   
    await modifyTask(
        'complete/uncomplete',
        (taskArray,index) => {
        taskArray[index -1].completed = !taskArray[index - 1].completed;
        return taskArray;
        },
        '\nTask successfully updated.\n'
    ) 
}

// function to delete a task

async function deleteTask() {
    await modifyTask(
        'delete',
        (taskArray,index) => {
        taskArray.splice(index-1, 1);
        return taskArray;
        },
        '\nTask successfully deleted.\n'
    )
    
}


async function editTaskName() {
    await modifyTask(
        'edit the task name of',
       async (taskArray, titleMarker) => {
        const newName = await confirmingLoop(
            async () => {
                return await ask(`What is the new title of the task?\n`)           
        },
            (name) => {
            return (`The new title is => "${name}".\nIs that correct? (y/n)\n`)
            }
        )      
          taskArray[titleMarker - 1].taskTitle = newName;
           return taskArray;
        },
        '\nTask name successfully changed\n'
        )
}

module.exports = {
    ask,
    addTask,
    viewList,
    markTask,
    deleteTask,
    editTaskName
};