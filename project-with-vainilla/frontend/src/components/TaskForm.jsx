import React, { useState } from 'react';

const TaskForm = ({ onAddTask }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim() === '') {
            alert('Escribe una tarea');
            return;
        }
        onAddTask(inputValue.trim());
        setInputValue('');
    };

    return (
        <form className="entrada" onSubmit={handleSubmit}>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Agregar tarea"
            />
            <button type="submit">Agregar</button>
        </form>
    );
};

export default TaskForm;