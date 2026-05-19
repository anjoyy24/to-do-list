const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

addBtn.addEventListener("click", addTask);

function addTask() {
    const taskText = taskInput.value;

    if (taskText === "") {
        alert("Escribe una tarea");
        return;
    }

    // Crear tarea
    const li = document.createElement("li");

    // Texto de tarea
    const span = document.createElement("span");
    span.textContent = taskText;

    // Botón completar
    // Checkbox
    const completeBtn = document.createElement("input");
    completeBtn.type = "checkbox";

    completeBtn.addEventListener("change", () => {
        span.classList.toggle("completed");
    });

    // Botón eliminar
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑";
    deleteBtn.style.display = "flex";
    deleteBtn.style.alignItems = "center";
    deleteBtn.style.width = "40px";
    deleteBtn.style.height = "40px";
    deleteBtn.style.justifyContent = "center";
    deleteBtn.classList.add("delete-btn");

    deleteBtn.addEventListener("click", () => {
        li.remove();
    });

    // Contenedor botones
    // Contenedor izquierdo
    const leftContainer = document.createElement("div");

    leftContainer.style.display = "flex";
    leftContainer.style.alignItems = "center";
    leftContainer.style.gap = "10px";

    leftContainer.appendChild(completeBtn);
    leftContainer.appendChild(span);

    // Agregar elementos al li
    li.appendChild(leftContainer);
    li.appendChild(deleteBtn);
    // Agregar li a la lista
    taskList.appendChild(li);

    // Limpiar input
    taskInput.value = "";
}