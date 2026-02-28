
const fs = require('fs/promises');

// function to add new task to list
function addTask(rl,showMenu) {

    console.log('Add task selected.');
    rl.question('What is the title of the task you wish to add?\n', (title) => {

        rl.question(`The title of the task is => "${title}".
Is this correct? (y/n)\n`, (confirmation) => {

        if (confirmation.toLowerCase() === 'y') {

           

           
            fs.readFile('./toDoList.json', 'utf-8', (err, data) => {

                if (err) {
                    console.error(err);
                    return;
                }

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
                
                fs.writeFile('./toDoList.json', JSON.stringify(tasks, null, 2), (err) => {

                    if (err) {
                        console.error(err);
                        return;
                    }

                console.log('Task added successfully.')
                showMenu();



                })
            });
            

    


        } else {

            console.log("Let's try again.");
            addTask(rl,showMenu);
            };



        });

    });

}

// function to view entire list

async function viewList() {
    console.log('\n\n');

    try {
        const data = await fs.readFile('./toDoList.json', 'utf-8');
        const taskList = JSON.parse(data);      
        taskList.forEach((task, index) => {
            let status;           
            if  (task.completed === true)  {
                status = "Completed"
            }         
            else {
                status = "Not completed"
            }
            console.log(`${index + 1}. "${task.taskTitle}" ---- ${status}`)

            

        });

         console.log('\n\n\n');
         return taskList;

        }
        catch (err) {       
        console.error(err);
        throw err;
    }

}

// function to mark a task as completed

async function markTask(rl,showMenu) {

    const taskArray = await viewList();

    rl.question('Which number corresponds to the task you wish to complete/uncomplete?\n', response => {



    });

    

}

// function to delete a task

function deleteTask() {

    
}

function editTaskName() {


}

module.exports = {
    addTask,
    viewList,
    markTask,
    deleteTask,
    editTaskName
}