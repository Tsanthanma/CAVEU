import React, { useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

import Registro from "./routes/Registro";
import DashboardCliente from "./routes/DashboardCliente";
import DashboardAdmin from "./routes/DashboardAdmin";
import DashboardAsesor from "./routes/DashboardAsesor";
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

        // ✅ Redirigir según el rol
        const rol = data.usuario.rol;
        if (rol === "admin") {
          navigate("/dashboard/admin");
        } else if (rol === "asesor") {
          navigate("/dashboard/asesor");
        } else {
          navigate("/dashboard/cliente");
        }
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
// Enrutamiento general
// ----------------------
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />


        {/* Cliente */}
        <Route
          path="/dashboard/cliente"
          element={
            <ProtectedRoute>
              <DashboardCliente />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />

        {/* Asesor */}
        <Route
          path="/dashboard/asesor"
          element={
            <ProtectedRoute>
              <DashboardAsesor />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
