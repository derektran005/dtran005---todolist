const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const dateInput = document.getElementById("todo-date");
const groupInput = document.getElementById("todo-group");
const groupsDiv = document.getElementById("groups");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let collapsedGroups = JSON.parse(localStorage.getItem("collapsedGroups")) || {};

function save() {
  localStorage.setItem("todos", JSON.stringify(todos));
  localStorage.setItem("collapsedGroups", JSON.stringify(collapsedGroups));
}

function groupTodos() {
  return todos.reduce((acc, todo) => {
    acc[todo.group] = acc[todo.group] || [];
    acc[todo.group].push(todo);
    return acc;
  }, {});
}

function render() {
  groupsDiv.innerHTML = "";
  const grouped = groupTodos();

  Object.keys(grouped).forEach(group => {
    const groupDiv = document.createElement("div");
    groupDiv.className = "group";

    const header = document.createElement("div");
    header.className = "group-header";
    header.textContent = group || "Ungrouped";
    header.onclick = () => {
      collapsedGroups[group] = !collapsedGroups[group];
      save();
      render();
    };

    groupDiv.appendChild(header);

    if (!collapsedGroups[group]) {
      grouped[group].forEach((todo, index) => {
        const item = document.createElement("div");
        item.className = "todo-item";
        if (todo.completed) item.classList.add("completed");

        item.draggable = true;
        item.ondragstart = e => e.dataTransfer.setData("id", todo.id);
        item.ondragover = e => e.preventDefault();
        item.ondrop = e => {
          const draggedId = e.dataTransfer.getData("id");
          moveTodo(draggedId, todo.id);
        };

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;
        checkbox.onchange = () => {
          todo.completed = checkbox.checked;
          save();
          render();
        };

        const span = document.createElement("span");
        span.textContent = `${todo.text}${todo.dueDate ? " (Due: " + todo.dueDate + ")" : ""}`;

        const del = document.createElement("button");
        del.textContent = "X";
        del.onclick = () => {
          todos = todos.filter(t => t.id !== todo.id);
          save();
          render();
        };

        const drag = document.createElement("span");
        drag.textContent = "≡";
        drag.className = "drag-handle";

        item.append(checkbox, drag, span, del);
        groupDiv.appendChild(item);
      });
    }

    groupsDiv.appendChild(groupDiv);
  });
}

function moveTodo(fromId, toId) {
  const fromIndex = todos.findIndex(t => t.id === fromId);
  const toIndex = todos.findIndex(t => t.id === toId);
  const [moved] = todos.splice(fromIndex, 1);
  todos.splice(toIndex, 0, moved);
  save();
  render();
}

form.onsubmit = e => {
  e.preventDefault();

  todos.push({
    id: crypto.randomUUID(),
    text: input.value.trim(),
    completed: false,
    dueDate: dateInput.value || null,
    group: groupInput.value.trim() || "Ungrouped"
  });

  form.reset();
  save();
  render();
};

render();
