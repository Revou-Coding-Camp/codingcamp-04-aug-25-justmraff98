const todoInput = document.getElementById("todo-input");
const todoDate = document.getElementById("todo-date");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const filter = document.getElementById("filter");

let todos = [];

// Ambil data dari localStorage saat load
function loadTodos() {
    const saved = localStorage.getItem("todos");
    todos = saved ? JSON.parse(saved) : [];
}

// Simpan data ke localStorage
function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos() {
    todoList.innerHTML = "";
    const filterValue = filter.value;

    todos.forEach((todo, index) => {
        if (filterValue !== "all" && todo.status !== filterValue) return;

        const tr = document.createElement("tr");
        tr.className = todo.status;

        tr.innerHTML = `
            <td>${todo.text}</td>
            <td>${todo.date}</td>
            <td>${statusText(todo.status)}</td>
            <td class="actions">
                <button class="status-btn" onclick="changeStatus(${index})">Status</button>
                <button class="edit-btn" onclick="editTodo(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteTodo(${index})">Hapus</button>
            </td>
        `;
        todoList.appendChild(tr);
    });
}

function statusText(status) {
    if (status === "completed") return "Selesai";
    if (status === "in-progress") return "Sedang dikerjakan";
    return "Belum selesai";
}

function addTodo() {
    const text = todoInput.value.trim();
    const date = todoDate.value;
    if (!text || !date) {
        alert("Isi tugas dan tanggal terlebih dahulu!");
        return;
    }
    todos.push({ text, date, status: "not-started" });
    saveTodos();
    todoInput.value = "";
    todoDate.value = "";
    renderTodos();
}

function editTodo(index) {
    const newText = prompt("Edit tugas:", todos[index].text);
    const newDate = prompt("Edit tanggal (YYYY-MM-DD):", todos[index].date);
    if (newText && newDate) {
        todos[index].text = newText;
        todos[index].date = newDate;
        saveTodos();
        renderTodos();
    }
}

function deleteTodo(index) {
    if (confirm("Hapus tugas ini?")) {
        todos.splice(index, 1);
        saveTodos();
        renderTodos();
    }
}

function changeStatus(index) {
    const statuses = ["not-started", "in-progress", "completed"];
    let currentIndex = statuses.indexOf(todos[index].status);
    let nextIndex = (currentIndex + 1) % statuses.length;
    todos[index].status = statuses[nextIndex];
    saveTodos();
    renderTodos();
}

addBtn.addEventListener("click", addTodo);
filter.addEventListener("change", renderTodos);


loadTodos();
renderTodos();
