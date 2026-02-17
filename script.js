localStorage.clear();

const inputBox = document.getElementById("input-box");
const inputDate = document.getElementById("input-date");
const groupsContainer = document.getElementById("groups-container");

let groups = ["default"];
loadGroups();
showTask();
createGroupSection("default");

function addTask() {
    if (inputBox.value === '') {
        alert("You must write something!");
        return;
    }

    let li = document.createElement("li");

    //Task name
    let taskText = document.createElement("div");
    taskText.textContent = inputBox.value;
    li.appendChild(taskText);

    //Group
    const selectedGroup = document.getElementById("group-select").value;
    const groupSection = document.querySelector(`.group[data-group="${selectedGroup}"] ul`);


    //Due date
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

    //Delete
    let span = document.createElement("span");
    span.textContent = "\u00d7";
    li.appendChild(span);

    //Adding to group section
    // listContainer.appendChild(li);
    groupSection.appendChild(li);

    inputBox.value = "";
    inputDate.value = "";

    saveData();
}

function addGroup() {
    const input = document.getElementById("group-box");
    const groupName = input.value.trim();

    if (groupName === "") return;

    if (groups.includes(groupName)) {
        alert("Group already exists.");
        return;
    }

    groups.push(groupName);

    updateGroupDropdown();
    createGroupSection(groupName);
    saveGroups();

    input.value = "";
}


function createGroupSection(groupName) {
    const container = document.getElementById("groups-container");

    if (container.querySelector(`[data-group="${groupName}"]`)) return;

    const groupDiv = document.createElement("div");
    groupDiv.className = "group";
    groupDiv.dataset.group = groupName;

    const header = document.createElement("div");
    header.className = "group-header";

    const title = document.createElement("h3");
    title.textContent = groupName === "default" ? "Ungrouped Tasks" : groupName;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "group-delete";
    deleteBtn.textContent = "✕";

    header.appendChild(title);
    header.appendChild(deleteBtn);

    const ul = document.createElement("ul");

    groupDiv.appendChild(header);
    groupDiv.appendChild(ul);
    container.appendChild(groupDiv);
}



function daysUntil(dueDateString) {
    const today = new Date();
    const dueDate = new Date(dueDateString);

    const diffTime = dueDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function updateGroupDropdown() {
    const select = document.getElementById("group-select");
    select.innerHTML = "";

    groups.forEach(group => {
        const option = document.createElement("option");
        option.value = group;
        option.textContent = group === "default" ? "Ungrouped Tasks" : group;
        select.appendChild(option);
    });
}

document.getElementById("groups-container").addEventListener("click", function (e) {
    if (!e.target.classList.contains("group-delete")) return;

    const groupDiv = e.target.closest(".group");
    const groupName = groupDiv.dataset.group;

    if (groupName === "default") {
        alert("The Ungrouped section cannot be deleted.");
        return;
    }

    if (!confirm(`Delete group "${groupName}" and all its tasks?`)) return;

    groupDiv.remove();

    groups = groups.filter(g => g !== groupName);
    saveGroups();
    saveData();
    updateGroupDropdown();
});


groupsContainer.addEventListener("click", function(e) {
    if (e.target.tagName == "LI") {
        e.target.classList.toggle("checked");
        saveData();
    } else if (e.target.tagName == "SPAN") {
        e.target.parentElement.remove();
        saveData();
    }
}, false);


document.getElementById("group-select").addEventListener("change", () => {
    filterTasks();
});

function saveGroups() {
    localStorage.setItem("groups", JSON.stringify(groups));
}

function loadGroups() {
    const stored = localStorage.getItem("groups");

    if (stored) {
        groups = JSON.parse(stored);

        // Safety: ensure default always exists
        if (!groups.includes("default")) {
            groups.unshift("default");
        }
    } else {
        groups = ["default"];
    }

    updateGroupDropdown();

    // Clear and rebuild group sections
    // const container = document.getElementById("groups-container");
    // container.innerHTML = "";

    groups.forEach(group => {
        createGroupSection(group);
    });

    // Force dropdown selection
    document.getElementById("group-select").value = "default";
}

function saveData() {
    localStorage.setItem("data", groupsContainer.innerHTML);
}

function showTask() {
    groupsContainer.innerHTML = localStorage.getItem("data");
}