import { useState, useEffect, useRef } from "react";

const ITEMS_PER_PAGE = 5;

function FileUpload() {
    const [files, setFiles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchFiles();
    }, []);

    async function fetchFiles() {
        try {
            const response = await fetch("http://localhost:3000/api/files");
            const data = await response.json();
            setFiles(data);
        } catch {
            console.error("No se pudo obtener la lista de archivos");
        }
    }

    async function handleFileSelect(e) {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        await fetch("http://localhost:3000/api/upload", {
            method: "POST",
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
                        <a
                            href={`http://localhost:3000/api/download/${file}`}
                            download={getDisplayName(file)}
                            className="download-btn"
                            title="Descargar"
                        >
                            ⬇
                        </a>
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
