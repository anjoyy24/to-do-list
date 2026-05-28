import { useEffect, useState } from "react";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import FileUpload from "./components/FileUpload";

function App() {

  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {

    const response = await fetch(
      "http://localhost:3000/api/tasks"
    );

    const data = await response.json();

    setTasks(data);
  }

  async function addTask(text) {

    if (text.trim() === "") {
      alert("Escribe una tarea");
      return;
    }

    const response = await fetch(
      "http://localhost:3000/api/tasks",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: text
        })
      }
    );

    const newTask = await response.json();
    setTasks([...tasks, newTask]);
  }

  async function deleteTask(id) {
    await fetch(
      `http://localhost:3000/api/tasks/${id}`,
      {
        method: "DELETE"
      }
    );

    setTasks(
      tasks.filter(task => task.id !== id)
    );
  }

  async function toggleTask(id) {
    const task = tasks.find(t => t.id === id);

    const response = await fetch(
      `http://localhost:3000/api/tasks/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          completed: !task.completed
        })
      }
    );

    const updatedTask = await response.json();

    setTasks(
      tasks.map(t =>
        t.id === id ? updatedTask : t
      )
    );
  }

  return (
    <div className="container">
      <h1>To-do list</h1>

      <TaskInput addTask={addTask} />
      <FileUpload />

      <TaskList
        tasks={tasks}
        deleteTask={deleteTask}
        toggleTask={toggleTask}
      />
    </div>
  );
}

export default App;