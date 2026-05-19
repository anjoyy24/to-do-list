import { useState } from "react";
import "./App.css";

import TodoForm from "./components/todoForm";
import TodoList from "./components/todoList";

function App() {

  const [tasks, setTasks] = useState([]);

  // Agregar tarea
  const addTask = (text) => {

    if (text.trim() === "") return;

    const newTask = {
      id: Date.now(),
      text: text,
      completed: false
    };

    setTasks([...tasks, newTask]);
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