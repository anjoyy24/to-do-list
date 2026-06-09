import { useState, useEffect, useRef, useCallback } from "react";

const ITEMS_PER_PAGE = 5;

function FileUpload({ token }) {
    const [files, setFiles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const fileInputRef = useRef(null);

    function authHeaders() {
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    const fetchFiles = useCallback(async () => {
        try {
            const response = await fetch("/api/files", {
                headers: authHeaders()
            });
            const data = await response.json();
            setFiles(Array.isArray(data) ? data : []);
        } catch {
            console.error("No se pudo obtener la lista de archivos");
        }
    }, [token]);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    async function handleDelete(filename) {
        const response = await fetch(
            `/api/files/${encodeURIComponent(filename)}`,
            {
                method: "DELETE",
                headers: authHeaders()
            }
        );

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            alert(data.error || "Error al eliminar el archivo");
            return;
        }

        await fetchFiles();

        setCurrentPage(prev => {
            const newTotal = Math.max(1, Math.ceil((files.length - 1) / ITEMS_PER_PAGE));
            return prev > newTotal ? newTotal : prev;
        });
    }

    async function handleFileSelect(e) {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        await fetch("/api/upload", {
            method: "POST",
            headers: authHeaders(),
            body: formData
        });

        e.target.value = "";
        await fetchFiles();
    }

    function getDisplayName(filename) {
        return filename.replace(/^\d+-/, "");
    }

    const totalPages = Math.max(1, Math.ceil(files.length / ITEMS_PER_PAGE));
    const paginated = files.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div>
            <div className="upload-btn-container">
                <button onClick={() => fileInputRef.current.click()}>
                    Subir archivo
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleFileSelect}
                />
            </div>

            <div className="list-container">
                {paginated.map(file => (
                    <div key={file} className="file-item">
                        <span className="file-name">{getDisplayName(file)}</span>
                        <div className="file-actions">
                            <a
                                href={`/api/download/${encodeURIComponent(file)}`}
                                download={getDisplayName(file)}
                                className="download-btn"
                                title="Descargar"
                            >
                                ⬇
                            </a>
                            <button
                                className="file-delete-btn"
                                title="Eliminar"
                                onClick={() => handleDelete(file)}
                            >
                                🗑
                            </button>
                        </div>
                    </div>
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

export default FileUpload;
