import { useState, useEffect } from "react"; import "./App.css";
//useEffect ejecutar algo cuando carga la página o cuando cambia algo
import axios from "axios";

import TodoForm from "./components/todoForm";
import TodoList from "./components/todoList";

function App() {

  const [tasks, setTasks] = useState([]);

  useEffect(() => {

    axios
      .get("http://localhost:3001/tasks")
      .then((res) => {

        setTasks(res.data);

      });

  }, []);
  // Agregar tarea
  const addTask = (text) => {

    if (text.trim() === "") return;

    const newTask = {
      id: Date.now(),
      text: text,
      completed: false
    };

    axios
      .post("http://localhost:3001/tasks", newTask)
      .then(() => {

        setTasks([...tasks, newTask]);

      });
  };

  // Eliminar tarea
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Completar tarea
  const toggleTask = (id) => {
    setTasks(
      tasks.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  return (
    <div className="container">

      <h1>To-do list</h1>

      <TodoForm addTask={addTask} />

      <TodoList
        tasks={tasks}
        deleteTask={deleteTask}
        toggleTask={toggleTask}
      />

    </div>
  );
}

export default App;