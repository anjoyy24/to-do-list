import { useEffect, useState } from "react";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import FileUpload from "./components/FileUpload";

function App() {
  const [tasks, setTasks] = useState([]);
  const [serverError, setServerError] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const response = await fetch("http://localhost:3000/api/tasks");
      const data = await response.json();
      setServerError(false);
      setTasks(data);
    } catch {
      setServerError(true);
    }
  }

  async function addTask(text) {
    if (text.trim() === "") {
      alert("Escribe una tarea");
      return;
    }

    const response = await fetch("http://localhost:3000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const newTask = await response.json();
    setTasks([...tasks, newTask]);
  }

  async function deleteTask(id) {
    await fetch(`http://localhost:3000/api/tasks/${id}`, { method: "DELETE" });
    setTasks(tasks.filter(task => task.id !== id));
  }

  async function editTask(id, newText) {
    const response = await fetch(`http://localhost:3000/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newText })
    });
    const updatedTask = await response.json();
    setTasks(tasks.map(t => (t.id === id ? updatedTask : t)));
  }

  async function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    const response = await fetch(`http://localhost:3000/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed })
    });
    const updatedTask = await response.json();
    setTasks(tasks.map(t => (t.id === id ? updatedTask : t)));
  }

  return (
    <div className="app-wrapper">
      {serverError && (
        <div className="server-error">
          ⚠ No se puede conectar al servidor. Asegúrate de que el backend esté corriendo en el puerto 3000.
        </div>
      )}
      <div className="panel">
        <h2 className="panel-title">TODO LIST</h2>
        <TaskInput addTask={addTask} />
        <TaskList tasks={tasks} deleteTask={deleteTask} toggleTask={toggleTask} editTask={editTask} />
      </div>
      <div className="panel">
        <h2 className="panel-title">ARCHIVOS</h2>
        <FileUpload />
      </div>
    </div>
  );
}

export default App;
