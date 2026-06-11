import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from "multer";
import fs from "fs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'todo-list-secret-key-2024';
const PORT = process.env.PORT || 3000;
const UPLOADS_DIR = process.env.VERCEL ? '/tmp/uploads' : 'uploads';

fs.mkdirSync(UPLOADS_DIR, { recursive: true });

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch(err => { console.error('Error conectando a MongoDB:', err); process.exit(1); });

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const taskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, UPLOADS_DIR); },
    filename: (req, file, cb) => { cb(null, Date.now() + "-" + file.originalname); }
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json());

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


app.post("/api/auth/register", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword });
        const token = jwt.sign({ id: user._id, username }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, username });
    } catch (err) {
        console.error('Error al crear usuario:', err.message);
        if (err.code === 11000) return res.status(409).json({ error: 'El usuario ya existe' });
        res.status(500).json({ error: 'Error al crear usuario' });
    }
});

app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }
        const token = jwt.sign({ id: user._id, username }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, username });
    } catch {
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});


app.get("/api/tasks", verifyToken, async (req, res) => {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
});

app.get("/api/tasks/:id", verifyToken, async (req, res) => {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (task) res.json(task);
    else res.status(404).json({ error: "Tarea no encontrada" });
});

app.post("/api/tasks", verifyToken, async (req, res) => {
    const task = await Task.create({ userId: req.user.id, text: req.body.text });
    res.status(201).json(task);
});

app.delete("/api/tasks/:id", verifyToken, async (req, res) => {
    const result = await Task.deleteOne({ _id: req.params.id, userId: req.user.id });
    if (result.deletedCount === 0) return res.status(404).json({ error: "Tarea no encontrada" });
    res.status(200).json({ ok: true });
});

app.patch("/api/tasks/:id", verifyToken, async (req, res) => {
    const updates = {};
    if (req.body.completed !== undefined) updates.completed = req.body.completed;
    if (req.body.text !== undefined) updates.text = req.body.text;
    const task = await Task.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        updates,
        { new: true }
    );
    if (!task) return res.status(404).json({ error: "Tarea no encontrada" });
    res.json(task);
});


app.post("/api/upload", verifyToken, upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No se subió ningún archivo" });
    res.status(201).json({ message: "Archivo subido", file: req.file });
});

app.get("/api/files", verifyToken, (req, res) => {
    fs.readdir(UPLOADS_DIR, (err, files) => {
        if (err) return res.json([]);
        res.json(files);
    });
});

app.delete("/api/files/:name", verifyToken, (req, res) => {
    const filePath = `${UPLOADS_DIR}/${req.params.name}`;
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Archivo no encontrado" });
    }
    fs.unlink(filePath, (err) => {
        if (err) return res.status(500).json({ error: "Error eliminando archivo" });
        res.json({ ok: true });
    });
});

app.get("/api/download/:name", (req, res) => {
    const filePath = `${UPLOADS_DIR}/${req.params.name}`;
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: "Archivo no encontrado" });
    res.download(filePath);
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

export default app;
