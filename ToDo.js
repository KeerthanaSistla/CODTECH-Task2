document.addEventListener('DOMContentLoaded', loadTasks);

const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    addTask(input.value);
    input.value = '';
});

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        addTaskToDOM(task);
    });
}

function addTask(taskText) {
    const task = {
        id: Date.now(),
        text: taskText
    };
    addTaskToDOM(task);
    saveTask(task);
}

function addTaskToDOM(task) {
    const li = document.createElement('li');
    li.dataset.id = task.id;
    li.innerHTML = `
        <span><input type="checkbox" name="x" class="checkbox"><label for="x">   ${task.text}</label></span>
        <div id=crud>
            <button id="edit" class="edit-button" onclick="editTask(${task.id})">Edit</button>
            <button id="delete" onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `;
    list.appendChild(li);
}

function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function editTask(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(t => t.id === taskId);
    const newText = prompt('Edit task:', task.text);
    if (newText !== null) {
        task.text = newText;
        updateTaskInDOM(taskId, newText);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

function updateTaskInDOM(taskId, newText) {
    const li = list.querySelector(`li[data-id='${taskId}']`);
    li.querySelector('span').textContent = newText;
}

function deleteTask(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    list.querySelector(`li[data-id='${taskId}']`).remove();
}
