import { useState } from "react";

function TodoForm({ addTask }) {

    const [input, setInput] = useState("");

    const handleSubmit = () => {
        addTask(input);
        setInput("");
    };

    return (
        
        <div className="entrada">
            <input
                type="text"
                placeholder="Agregar tarea"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />

            <button onClick={handleSubmit}>
                Agregar
            </button>

        </div>
    );
}

export default TodoForm;