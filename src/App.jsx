import React, { useState } from "react";
import "./App.css";
import DashboardCliente from "./routes/DashboardCliente";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import Registro from "./routes/Registro";
import ProtectedRoute from "./components/ProtectedRoute";

// ----------------------
// Componente Login
// ----------------------
const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documento: usuario, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        alert("¡Inicio de sesión exitoso!");
        navigate("/dashboard");
      } else {
        alert(data.msg || "Usuario o contraseña incorrectos");
      }
    } catch (error) {
      alert("Error de conexión con el servidor.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container">
        <header>
          <h1>Consultorio Académico Virtual Empresarial Uniminuto</h1>
        </header>

        <main>
          <section className="content">
            <h1>Bienvenido a CAVE-U</h1>
            <h5>
              Plataforma de consultoría académica para estudiantes y empresarios
            </h5>
            <hr />
            <h2>Inicio de Sesión</h2>

            <form className="form-box" onSubmit={handleLogin}>
              <label htmlFor="usuario">Documento:</label>
              <input
                type="text"
                id="usuario"
                name="usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />

              <label htmlFor="password">Contraseña:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn primary"
                  disabled={loading}
                >
                  {loading ? (
                    "Cargando..."
                  ) : (
                    <>
                      <img
                        src="https://cuatrimestral.aulasuniminuto.edu.co/theme/image.php/uniminuto/auth_oidc/1750887109/0/customicon"
                        alt="icono"
                        className="btn-icon"
                      />
                      Iniciar Sesión
                    </>
                  )}
                </button>
              </div>

              <div className="register-link">
                <p>
                  ¿No tienes cuenta? <Link to="/registro">Registrarse</Link>
                </p>
              </div>
            </form>
          </section>
        </main>
      </div>

      <footer className="footer">
        <p>&copy; 2025 CAVE-U Todos los derechos Reservados. UNIMINUTO ©2025</p>
      </footer>
    </>
  );
};

// ----------------------
// Dashboard protegido
// ----------------------
const Dashboard = () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const navigate = useNavigate();
  const [pregunta, setPregunta] = useState("");
  const [archivo, setArchivo] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/");
  };

  const handleFileChange = (e) => {
    setArchivo(e.target.files[0]);
  };

  const handleSubmitConsulta = async (e) => {
    e.preventDefault();

    if (!pregunta && !archivo) {
      alert("Debes escribir una pregunta o adjuntar un documento.");
      return;
    }

    const formData = new FormData();
    formData.append("pregunta", pregunta);
    formData.append("usuarioId", usuario._id);
    if (archivo) formData.append("archivo", archivo);

    try {
      const res = await fetch("http://localhost:3000/api/consultas", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Consulta enviada correctamente.");
        setPregunta("");
        setArchivo(null);
      } else {
        alert(data.msg || "Error al enviar la consulta.");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión al enviar la consulta.");
    }
  };

  return (
    <div className="container">
      <h2>Bienvenido, {usuario?.nombres || "Usuario"} 👋</h2>
      <p>Tipo: {usuario?.tipo}</p>

      {usuario?.tipo === "estudiante" || usuario?.tipo === "empresa" ? (
        <form onSubmit={handleSubmitConsulta} className="form-box">
          <label htmlFor="pregunta">Tu pregunta:</label>
          <textarea
            id="pregunta"
            name="pregunta"
            rows="5"
            value={pregunta}
            onChange={(e) => setPregunta(e.target.value)}
            placeholder="Escribe tu consulta aquí..."
            required={!archivo}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "1rem",
              marginBottom: "15px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          ></textarea>

          <label htmlFor="archivo">Adjuntar documento:</label>
          <input
            type="file"
            id="archivo"
            name="archivo"
            accept=".pdf,.doc,.docx,.jpg,.png"
            onChange={handleFileChange}
          />

          <div className="form-actions">
            <button type="submit" className="btn primary">
              Enviar consulta
            </button>
          </div>
        </form>
      ) : (
        <p>No tienes permisos para enviar consultas.</p>
      )}

      <button
        onClick={handleLogout}
        className="btn primary"
        style={{ marginTop: "20px" }}
      >
        Cerrar sesión
      </button>
    </div>
  );
};
// ----------------------
// Enrutamiento general
// ----------------------
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardCliente />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
