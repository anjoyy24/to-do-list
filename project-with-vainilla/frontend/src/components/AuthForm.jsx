import { useState } from "react";

function AuthForm({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

        try {
            const response = await fetch(`http://localhost:3000${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Error al autenticar");
                return;
            }

            onLogin(data.token, data.username);
        } catch {
            setError("No se pudo conectar al servidor. ¿Está el backend corriendo?");
        } finally {
            setLoading(false);
        }
    }

    function switchMode() {
        setIsLogin(!isLogin);
        setError("");
        setUsername("");
        setPassword("");
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <h1 className="auth-title">To-Do List</h1>
                <p className="auth-subtitle">{isLogin ? "Inicia sesión para continuar" : "Crea tu cuenta"}</p>

                <form onSubmit={handleSubmit} className="auth-form">
                    <input
                        type="text"
                        placeholder="Usuario"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="auth-input"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="auth-input"
                        required
                    />

                    {error && <p className="auth-error">{error}</p>}

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? "..." : isLogin ? "Entrar" : "Registrarse"}
                    </button>
                </form>

                <p className="auth-toggle">
                    {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
                    <span onClick={switchMode}>
                        {isLogin ? "Regístrate" : "Inicia sesión"}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default AuthForm;