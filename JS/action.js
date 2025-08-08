document.addEventListener('DOMContentLoaded', () => {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const tasksList = document.getElementById('tasks');
    const taskInput = document.getElementById('task-input');
    const dateInput = document.getElementById('date-input');
    const newTaskForm = document.getElementById('new-task-form');
    const filterBtns = document.querySelectorAll('.filter-btn');

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const renderTasks = (filter = 'all') => {
        tasksList.innerHTML = '';
        tasks.forEach((task, index) => {
            if (filter === 'complete' && !task.completed) return;
            if (filter === 'incomplete' && task.completed) return;

            const li = document.createElement('li');
            li.className = 'task-item' + (task.completed ? ' completed' : '');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => {
                task.completed = checkbox.checked;
                saveTasks();
                renderTasks(filter);
            });
            li.appendChild(checkbox);

            const span = document.createElement('span');
            span.className = 'task-name';
            span.textContent = task.name;
            li.appendChild(span);

            if (task.date) {
                const dateSpan = document.createElement('span');
                dateSpan.className = 'task-date';
                dateSpan.textContent = task.date;
                li.appendChild(dateSpan);
            }

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'task-actions';

            const ubahBtn = document.createElement('button');
            ubahBtn.textContent = 'Ubah';
            ubahBtn.className = 'ubah-btn';
            ubahBtn.addEventListener('click', () => {
                const newName = prompt("Ubah tugas:", task.name);
                if (newName !== null && newName.trim() !== "") {
                    task.name = newName.trim();
                    saveTasks();
                    renderTasks(filter);
                }
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Hapus';
            deleteBtn.addEventListener('click', () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks(filter);
            });

            actionsDiv.appendChild(ubahBtn);
            actionsDiv.appendChild(deleteBtn);
            li.appendChild(actionsDiv);

            tasksList.appendChild(li);
        });
    };

    newTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskName = taskInput.value.trim();
        const taskDate = dateInput.value;
        if (!taskName) return;
        tasks.push({ name: taskName, date: taskDate, completed: false });
        saveTasks();
        taskInput.value = '';
        dateInput.value = '';
        renderTasks(document.querySelector('.filter-btn.active').dataset.filter);
    });

    filterBtns.forEach(button => {
        button.addEventListener('click', () => {
            filterBtns.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderTasks(button.dataset.filter);
        });
    });

    renderTasks();
});
