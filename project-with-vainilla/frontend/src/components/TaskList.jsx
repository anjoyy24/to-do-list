import { useState } from "react";
import TaskItem from "./TaskItem";

const ITEMS_PER_PAGE = 5;

function TaskList({ tasks, deleteTask, toggleTask, editTask }) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(tasks.length / ITEMS_PER_PAGE));
    const paginated = tasks.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div>
            <div className="list-container">
                {paginated.map(task => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        deleteTask={deleteTask}
                        toggleTask={toggleTask}
                        editTask={editTask}
                    />
                ))}
            </div>

            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <span
                        key={page}
                        className={`page-btn${page === currentPage ? " active" : ""}`}
                        onClick={() => setCurrentPage(page)}
                    >
                        {page}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default TaskList;
