const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());


// Obtener tareas
app.get("/tasks", (req, res) => {

    const tasks = JSON.parse(
        fs.readFileSync("tasks.json")
    );

    res.json(tasks);
});


// Agregar tarea
app.post("/tasks", (req, res) => {

    const tasks = JSON.parse(
        fs.readFileSync("tasks.json")
    );

    const newTask = req.body;

    tasks.push(newTask);

    fs.writeFileSync(
        "tasks.json",
        JSON.stringify(tasks, null, 2)
    );

    res.json(newTask);
});


app.listen(3001, () => {
    console.log("Servidor corriendo en puerto 3001");
});