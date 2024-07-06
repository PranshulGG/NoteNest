const addTaskFab = document.getElementById('AddTodo');
const addTaskDialog = document.getElementById('addTodoItemDialog');
const addTaskInput = document.getElementById('addTaskInput');
const AddTaskDialogBtn = document.getElementById('AddTaskDialogBtn');
const taskList = document.getElementById('taskList');
const completedTaskList = document.getElementById('completedTaskList');

loadTasks()

addTaskFab.addEventListener('click', () =>{
    addTaskDialog.show()
    dialogcolor();
});

addTaskDialog.addEventListener('close', () =>{
    checkTHEME()
    addTaskInput.value = ''
    addTaskInput.dispatchEvent(new Event('input'));

});

function checkValidTask(){
    if(addTaskInput.value.trim() === ""){
        AddTaskDialogBtn.disabled = true;
    } else{
        AddTaskDialogBtn.disabled = false;
    }
}

addTaskInput.addEventListener('input', checkValidTask)



AddTaskDialogBtn.addEventListener('click', addTask)


function addTask() {
    const taskText = addTaskInput.value.trim();
    if (taskText !== '') {
        const listItem = createTaskItem(taskText, false);
        taskList.appendChild(listItem);
        saveTasks();

    }
}

function createTaskItem(taskText, completed) {
    const listItem = document.createElement('taskItemWrap');
    const checkbox = document.createElement('md-checkbox');
    // checkbox.type = 'checkbox';
    checkbox.checked = completed;
    checkbox.addEventListener('change', toggleTaskCompletion);
    const taskSpan = document.createElement('span');
    taskSpan.innerHTML = taskText;

    listItem.appendChild(checkbox);
    listItem.appendChild(taskSpan);

    addSwipeHandlers(listItem);

    if (completed) {
        completedTaskList.appendChild(listItem);
        listItem.classList.add('completedTask');
    } else {
        taskList.appendChild(listItem);
        listItem.classList.remove('completedTask');
    }

    return listItem;
}

function toggleTaskCompletion() {
    const listItem = this.parentElement;
    if (this.checked) {
        setTimeout(() =>{
        listItem.style.opacity = '0.5'
        listItem.style.transform = 'translateX(110%)';
        },  100);

        listItem.style.transition = 'opacity 0.2s ease-out, transform .3s ease-in'

        setTimeout(() =>{
            completedTaskList.appendChild(listItem);
            listItem.classList.add('completedTask');
        listItem.style.opacity = ''
        listItem.style.transition = ''
        listItem.style.transform = ''
        saveTasks();

        }, 500);

    } else {

        setTimeout(() =>{
            listItem.style.opacity = '0.5'
        listItem.style.transform = 'translateX(-110%)';
            },  100);
    
            listItem.style.transition = 'opacity 0.2s ease-out, transform .3s ease-in'

    
            setTimeout(() =>{
                taskList.appendChild(listItem);
                listItem.classList.remove('completedTask');
            listItem.style.opacity = ''
            listItem.style.transition = ''
        listItem.style.transform = '';
            saveTasks();
    
            }, 500);
    }
}

function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll('taskItemWrap').forEach(li => {
        tasks.push({ text: li.querySelector('span').textContent, completed: false });
    });
    completedTaskList.querySelectorAll('taskItemWrap').forEach(li => {
        tasks.push({ text: li.querySelector('span').textContent, completed: true });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));

    if(tasks.length === 0){
        document.getElementById('mark_3').hidden = false;
    } else{
        document.getElementById('mark_3').hidden = true;
    }
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        createTaskItem(task.text, task.completed);
    });

    
    if(tasks.length === 0){
        document.getElementById('mark_3').hidden = false;
    } else{
        document.getElementById('mark_3').hidden = true;
    }
}

function addSwipeHandlers(listItem) {
    let startX;
    let startTime;
    let swiped = false;

    listItem.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startTime = new Date().getTime();
        swiped = false;
    });

    listItem.addEventListener('touchmove', (e) => {
        if (swiped) return;
        const deltaX = e.touches[0].clientX - startX;
        const elapsedTime = new Date().getTime() - startTime;
        if (Math.abs(deltaX) > 50 && elapsedTime < 300) {
            listItem.style.transform = `translateX(${deltaX}px)`;
            listItem.style.background = 'var(--Error-Container)'
        }
    });

    listItem.addEventListener('touchend', (e) => {
        const deltaX = e.changedTouches[0].clientX - startX;
        const elapsedTime = new Date().getTime() - startTime;

        listItem.style.transform = 'translateX(0%)';
        listItem.style.background = ''
        listItem.style.transition = 'all 0.2s ease-out';


        setTimeout(() =>{
            listItem.style.transition = '';
        }, 250);


        if (Math.abs(deltaX) > 100 && elapsedTime < 300) {
            swiped = true;
            listItem.classList.add('deleting');
            listItem.style.transform = 'translateX(-110%)';
            listItem.style.transition = 'all 0.2s ease-out';

            ShowSnack('Task was deleted', 2000, 3, 'fixed', 'tab-content-1', 'fab_2', '', fortab= true)
            setTimeout(() => {
                listItem.remove();
                saveTasks();
            listItem.style.transition = '';

            }, 400);
        }
    });
}


document.getElementById('todos-tabs').addEventListener('change', () =>{
    if (event.target.activeTabIndex === 0) {
        taskList.hidden = false;
        completedTaskList.hidden = true;
      } else{
        taskList.hidden = true;
        completedTaskList.hidden = false;
      }
});