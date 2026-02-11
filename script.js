const inputBox = document.getElementById("input-box");
const inputDate = document.getElementById("input-date");
const listContainer = document.getElementById("list-container");

function addTask() {
    if (inputBox.value === '') {
        alert("You must write something!");
        return;
    }

    let li = document.createElement("li");

    // Task title
    let taskText = document.createElement("div");
    taskText.textContent = inputBox.value;
    li.appendChild(taskText);

    // Optional due date
    if (inputDate.value) {
        const days = daysUntil(inputDate.value);

        let dueText = document.createElement("div");
        dueText.className = "due-date";

        if (days > 0) {
            dueText.textContent = `Due in ${days} day${days !== 1 ? 's' : ''}`;
        } else if (days === 0) {
            dueText.textContent = "Due today";
        } else {
            dueText.textContent = `Overdue by ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''}`;
        }

        li.appendChild(dueText);
    }

    // Delete button
    let span = document.createElement("span");
    span.textContent = "\u00d7";
    li.appendChild(span);

    listContainer.appendChild(li);

    inputBox.value = "";
    inputDate.value = "";

    saveData();
}

function daysUntil(dueDateString) {
    const today = new Date();
    const dueDate = new Date(dueDateString);

    const diffTime = dueDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24) + 1);
}

listContainer.addEventListener("click", function(e) {
    if (e.target.tagName == "LI") {
        e.target.classList.toggle("checked");
        saveData();
    } else if (e.target.tagName == "SPAN") {
        e.target.parentElement.remove();
        saveData();
    }
}, false);

function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

function showTask() {
    listContainer.innerHTML = localStorage.getItem("data");
}
showTask()