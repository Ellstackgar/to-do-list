
// function to add new task to list
function addTask(rl,showMenu) {

    console.log('Add task selected.');
    rl.question('What is the title of the task you wish to add?\n', (title) => {

        rl.question(`The title of the task is => "${title}".
Is this correct? (y/n)\n`, (confirmation) => {

        if (confirmation.toLowerCase() === 'y') {

           

            const fs = require('fs');
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

function viewList() {


}

// function to mark a task as completed

function completeTask() {


}

// function to delete a task

function deleteTask() {

    
}

module.exports = {
    addTask,
    viewList,
    completeTask,
    deleteTask
}