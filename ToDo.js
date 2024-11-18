document.addEventListener('DOMContentLoaded', loadTasks);

const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filters button');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    const taskText = input.value.trim();
    if (!taskText) {
        alert('Task cannot be empty!');
        return;
    }
    addTask(taskText);
    input.value = '';
});

filterButtons.forEach(button => {
    button.addEventListener('click', () => filterTasks(button.id));
});

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTaskToDOM(task));
}

function addTask(taskText) {
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };
    addTaskToDOM(task);
    saveTask(task);
}

function addTaskToDOM(task) {
    const li = document.createElement('li');
    li.dataset.id = task.id;
    li.className = task.completed ? 'completed' : 'pending';
    li.innerHTML = `
        <span>
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTaskCompletion(${task.id})">
            <label>${task.text}</label>
        </span>
        <div id="crud">
            <button class="edit-button" onclick="editTask(${task.id})">Edit</button>
            <button onclick="deleteTask(${task.id})">Delete</button>
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
    if (newText !== null && newText.trim() !== '') {
        task.text = newText.trim();
        updateTaskInDOM(taskId, newText);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

function updateTaskInDOM(taskId, newText) {
    const li = list.querySelector(`li[data-id='${taskId}']`);
    li.querySelector('label').textContent = newText;
}

function deleteTask(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    list.querySelector(`li[data-id='${taskId}']`).remove();
}

function toggleTaskCompletion(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(t => t.id === taskId);
    task.completed = !task.completed;
    const li = list.querySelector(`li[data-id='${taskId}']`);
    li.className = task.completed ? 'completed' : 'pending';
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function filterTasks(filter) {
    const tasks = Array.from(list.children);
    tasks.forEach(task => {
        if (filter === 'filter-completed' && !task.classList.contains('completed')) {
            task.style.display = 'none';
        } else if (filter === 'filter-pending' && !task.classList.contains('pending')) {
            task.style.display = 'none';
        } else {
            task.style.display = '';
        }
    });
}
