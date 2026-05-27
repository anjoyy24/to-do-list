import React from 'react';

const TaskItem = ({ task, onToggleComplete, onDeleteTask }) => {
    return (
        <li>
            <div className="left-container">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggleComplete(task.id)}
                />
                <span className={task.completed ? 'completed' : ''}>
                    {task.text}
                </span>
            </div>
            <button
                className="delete-btn"
                onClick={() => onDeleteTask(task.id)}
            >
                🗑
            </button>
        </li>
    );
};

export default TaskItem;