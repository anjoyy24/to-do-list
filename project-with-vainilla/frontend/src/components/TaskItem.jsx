import { useState } from "react";

function TaskItem({ task, deleteTask, toggleTask, editTask }) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(task.text);

    function handleSave() {
        const trimmed = draft.trim();
        if (trimmed && trimmed !== task.text) {
            editTask(task._id, trimmed);
        } else {
            setDraft(task.text);
        }
        setEditing(false);
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") handleSave();
        if (e.key === "Escape") {
            setDraft(task.text);
            setEditing(false);
        }
    }

    return (
        <div className="task-item">
            <div className="task-left">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task._id)}
                />
                {editing ? (
                    <input
                        className="task-edit-input"
                        value={draft}
                        autoFocus
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                ) : (
                    <span className={task.completed ? "completed" : ""}>
                        {task.text}
                    </span>
                )}
            </div>

            <div className="task-actions">
                {editing ? (
                    <>
                        <button className="save-btn" onClick={handleSave}>✓</button>
                        <button className="cancel-btn" onClick={() => { setDraft(task.text); setEditing(false); }}>✕</button>
                    </>
                ) : (
                    <button className="edit-btn" onClick={() => setEditing(true)}>✏</button>
                )}
                <button className="delete-btn" onClick={() => deleteTask(task._id)}>🗑</button>
            </div>
        </div>
    );
}

export default TaskItem;
