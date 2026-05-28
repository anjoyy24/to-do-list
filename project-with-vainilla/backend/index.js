import express from 'express';
import cors from 'cors';
import multer from "multer";
import fs from "fs";

const app = express();

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json());

let tasks = [];
//req es la solicitud que hace el cliente
// res es la respuesta que el servidor le da al cliente
// get-all
app.get("/api/tasks", (req, res) => { //esta es la ruta o el endpoint
    res.json(tasks);
});

//get-by-id
app.get("/api/tasks/:id", (req, res) => {
    const task = tasks.find(t => t.id == req.params.id);
    if (task) {
        res.json(task);
    }else{
        res.status(404).json({ error: "Tarea no encontrada" });
    }
});

app.post("/api/tasks", (req, res) => {
    const task = {
        id: Date.now(),
        text: req.body.text,
        completed: false
    };
    tasks.push(task);
    res.status(201).json(task);
});

app.delete("/api/tasks/:id", (req, res) => {
    const exists = tasks.some(t => t.id == req.params.id);
    if(!exists){
        return res.status(404).json({ error: "Tarea no encontrada" });
    }
    // es como decir, quédate con todas las tareas que sean diferentes al id de la tarea actual (t.id)
    tasks = tasks.filter(t => t.id != req.params.id);
    res.status(200).json({ ok: true });
});

app.patch("/api/tasks/:id", (req, res) => {
    const task = tasks.find(t => t.id == req.params.id);

    if (!task) {
        return res.status(404).json({ error: "Tarea no encontrada" });
    }

    // actualizar estado si viene
    if (req.body.completed !== undefined) {
        task.completed = req.body.completed;
    }

    // actualizar texto si viene
    if (req.body.text !== undefined) {
        task.text = req.body.text;
    }

    res.json(task);
});

app.post("/api/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No se subió ningún archivo" });
    }
        res.status(201).json( {message: "Archivo subido", file: req.file});
    }
);

app.get("/api/files", (req, res) => {

    fs.readdir("uploads", (err, files) => {

        if (err) {
            return res.status(500).json({
                error: "Error leyendo archivos"
            });
        }

        res.json(files);
    });
});

app.get("/api/download/:name", (req, res) => {

    const filePath = `uploads/${req.params.name}`;
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Archivo no encontrado"});
    }
    res.download(filePath);
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
