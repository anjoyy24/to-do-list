import express from 'express';
import cors from 'cors';
import multer from "multer";
import fs from "fs";
import jwt from "jsonwebtoken";

const app = express();
const JWT_SECRET = 'todo-list-secret-key-2024';

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, "uploads/"); },
    filename: (req, file, cb) => { cb(null, Date.now() + "-" + file.originalname); }
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json());

let users = [];
let tasks = [];

// ── Auth middleware ───────────────────────────

function verifyToken(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No autorizado' });
    }
    try {
        req.user = jwt.verify(auth.slice(7), JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ error: 'Token inválido o expirado' });
    }
}

// ── Auth routes ───────────────────────────────

app.post("/api/auth/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
    }
    if (users.find(u => u.username === username)) {
        return res.status(409).json({ error: 'El usuario ya existe' });
    }
    const user = { id: Date.now(), username, password };
    users.push(user);
    const token = jwt.sign({ id: user.id, username }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, username });
});

app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
    const token = jwt.sign({ id: user.id, username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, username });
});

// ── Task routes (protected, per-user) ─────────

app.get("/api/tasks", verifyToken, (req, res) => {
    res.json(tasks.filter(t => t.userId === req.user.id));
});

app.get("/api/tasks/:id", verifyToken, (req, res) => {
    const task = tasks.find(t => t.id == req.params.id && t.userId === req.user.id);
    if (task) res.json(task);
    else res.status(404).json({ error: "Tarea no encontrada" });
});

app.post("/api/tasks", verifyToken, (req, res) => {
    const task = { id: Date.now(), userId: req.user.id, text: req.body.text, completed: false };
    tasks.push(task);
    res.status(201).json(task);
});

app.delete("/api/tasks/:id", verifyToken, (req, res) => {
    const exists = tasks.some(t => t.id == req.params.id && t.userId === req.user.id);
    if (!exists) return res.status(404).json({ error: "Tarea no encontrada" });
    tasks = tasks.filter(t => !(t.id == req.params.id && t.userId === req.user.id));
    res.status(200).json({ ok: true });
});

app.patch("/api/tasks/:id", verifyToken, (req, res) => {
    const task = tasks.find(t => t.id == req.params.id && t.userId === req.user.id);
    if (!task) return res.status(404).json({ error: "Tarea no encontrada" });
    if (req.body.completed !== undefined) task.completed = req.body.completed;
    if (req.body.text !== undefined) task.text = req.body.text;
    res.json(task);
});

// ── File routes (protected) ───────────────────

app.post("/api/upload", verifyToken, upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No se subió ningún archivo" });
    res.status(201).json({ message: "Archivo subido", file: req.file });
});

app.get("/api/files", verifyToken, (req, res) => {
    fs.readdir("uploads", (err, files) => {
        if (err) return res.status(500).json({ error: "Error leyendo archivos" });
        res.json(files);
    });
});

app.delete("/api/files/:name", verifyToken, (req, res) => {
    const filePath = `uploads/${req.params.name}`;
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Archivo no encontrado" });
    }
    fs.unlink(filePath, (err) => {
        if (err) return res.status(500).json({ error: "Error eliminando archivo" });
        res.json({ ok: true });
    });
});

app.get("/api/download/:name", (req, res) => {
    const filePath = `uploads/${req.params.name}`;
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: "Archivo no encontrado" });
    res.download(filePath);
});

app.listen(3000, () => console.log("Server is running on port 3000"));