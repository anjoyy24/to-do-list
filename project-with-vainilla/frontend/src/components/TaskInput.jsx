import { useState } from "react";

function TaskInput({ addTask }) {

    const [text, setText] = useState("");

    function handleAdd() {
        addTask(text);
        setText("");
    }

    return (
        <div className="entrada">

            <input
                type="text"
                placeholder="Agregar tarea"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />

            <button onClick={handleAdd}>
                Agregar
            </button>

        </div>
    );
}

export default TaskInput;