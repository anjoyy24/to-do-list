import { useState } from "react";

function FileUpload() {

    const [file, setFile] = useState(null);

    async function handleUpload() {

        const formData = new FormData();

        formData.append("file", file);

        await fetch(
            "http://localhost:3000/api/upload",
            {
                method: "POST",
                body: formData
            }
        );

        alert("Archivo subido");
    }

    return (
        <div className="file-upload">

            <label>Subir archivo:</label>
            <label className="custom-file-upload">
                Seleccionar archivo

                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                />
            </label>

            <button onClick={handleUpload}>
                Subir
            </button>

        </div>
    );
}
export default FileUpload;

