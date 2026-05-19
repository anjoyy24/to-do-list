function TodoItem({ task, deleteTask, toggleTask }) {

    return (
        <li>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                }}
            >

                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                />

                <span className={task.completed ? "completed" : ""}>
                    {task.text}
                </span>

            </div>

            <button
                className="delete-btn"
                onClick={() => deleteTask(task.id)}
            >
                🗑
            </button>

        </li>
    );
}

export default TodoItem;