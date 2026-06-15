import { useEffect, useState } from "react";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import FileUpload from "./components/FileUpload";
import AuthForm from "./components/AuthForm";

function App() {
  const [tasks, setTasks] = useState([]);
  const [serverError, setServerError] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [username, setUsername] = useState(() => localStorage.getItem("username"));

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  function handleLogin(newToken, newUsername) {
    localStorage.setItem("token", newToken);
    localStorage.setItem("username", newUsername);
    setToken(newToken);
    setUsername(newUsername);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken(null);
    setUsername(null);
    setTasks([]);
  }

  function authHeaders() {
    return { Authorization: `Bearer ${token}` };
  }

  async function fetchTasks() {
    try {
      const response = await fetch("/api/tasks", {
        headers: authHeaders()
      });
      if (response.status === 401) { handleLogout(); return; }
      const data = await response.json();
      setServerError(false);
      setTasks(data);
    } catch {
      setServerError(true);
    }
  }

  async function addTask(text) {
    if (text.trim() === "") { alert("Escribe una tarea"); return; }
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ text })
    });
    const newTask = await response.json();
    setTasks([...tasks, newTask]);
  }

  async function deleteTask(id) {
    await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
      headers: authHeaders()
    });
    setTasks(tasks.filter(task => task._id !== id));
  }

  async function editTask(id, newText) {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ text: newText })
    });
    const updatedTask = await response.json();
    setTasks(tasks.map(t => (t._id === id ? updatedTask : t)));
  }

  async function toggleTask(id) {
    const task = tasks.find(t => t._id === id);
    const response = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ completed: !task.completed })
    });
    const updatedTask = await response.json();
    setTasks(tasks.map(t => (t._id === id ? updatedTask : t)));
  }

  if (!token) {
    return <AuthForm onLogin={handleLogin} />;
  }

  return (
    <div className="app-wrapper">
      {serverError && (
        <div className="server-error">
          ⚠ No se puede conectar al servidor. Asegúrate de que el backend esté corriendo en el puerto 3000.
        </div>
      )}

      <div className="app-header">
        <span className="app-user">👤 {username}</span>
        <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>
      </div>

      <div className="panel">
        <h2 className="panel-title">Todo List</h2>
        <TaskInput addTask={addTask} />
        <TaskList tasks={tasks} deleteTask={deleteTask} toggleTask={toggleTask} editTask={editTask} />
      </div>

      <div className="panel">
        <h2 className="panel-title">Archivos</h2>
        <FileUpload token={token} />
      </div>
    </div>
  );
}

export default App;
