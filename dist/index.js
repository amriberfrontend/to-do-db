const taskTitle = document.getElementById("title");
const taskDescription = document.getElementById("description");
const save = document.getElementById("save");
const taskList = document.getElementById("view__list");
save.addEventListener("click", (e) => {
    console.log("click");
    e.preventDefault();
    e.stopPropagation();
    addTask();
});
// Create
let db;
const openOrCreateDB = globalThis.indexedDB.open('todoDB', 1);
openOrCreateDB.onerror = () => {
    throw new Error("Unable to access database: " + db);
};
openOrCreateDB.onsuccess = () => {
    console.log("Succesfully opened DB");
    db = openOrCreateDB.result;
};
openOrCreateDB.onupgradeneeded = (e) => {
    const db = openOrCreateDB.result;
    const table = db.createObjectStore("todo_table", { keyPath: 'id', autoIncrement: true });
    table.createIndex('title', 'title', { unique: false });
    table.createIndex('desc', 'desc', { unique: false });
};
function addTask() {
    const newTask = { title: taskTitle.value, body: taskDescription.value };
    const transaction = db.transaction(["todo_table"], "readwrite");
    const taskStore = transaction.objectStore("todo_table");
    const query = taskStore.add(newTask);
    query.onsuccess = () => {
        console.log("Succesfullly added task");
        taskTitle.textContent = "";
        taskDescription.textContent = "";
    };
    transaction.onerror = () => {
        alert("Couldn't add task");
    };
    transaction.oncomplete = () => {
        showTasks();
    };
}
// Read
function showTasks() {
    taskList.innerHTML = "";
    const objectStore = db.transaction('todo_table').objectStore('todo_table');
    const request = objectStore.getAll();
    request.onsuccess = () => {
        const tasks = request.result;
        for (const task of tasks) {
            const listItem = document.createElement('li');
            const h3 = document.createElement('h3');
            const pg = document.createElement('p');
            listItem.appendChild(h3);
            listItem.appendChild(pg);
            taskList.appendChild(listItem);
            h3.textContent = task.title;
            pg.textContent = task.body;
            listItem.setAttribute('data-id', task.id);
            const deleteBtn = document.createElement('button');
            listItem.appendChild(deleteBtn);
            deleteBtn.textContent = 'Remove';
            deleteBtn.addEventListener("click", function () { removeTask(listItem); });
        }
    };
}
// Update
// Delete
function removeTask(e) {
    const taskID = parseInt(e.getAttribute("data-id"));
    const transaction = db.transaction(['todo_table'], 'readwrite');
    const objectStore = transaction.objectStore('todo_table');
    objectStore.delete(taskID);
    transaction.oncomplete = () => {
        e.parentNode?.removeChild(e);
        if (!taskList.firstChild) {
            const noTaskItem = document.createElement("li");
            noTaskItem.textContent = "No tasks ongoing";
            taskList.append(noTaskItem);
        }
    };
}
//# sourceMappingURL=index.js.map