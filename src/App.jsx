// src/App.jsx
import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Registro from "./routes/Registro";
import Login from "./routes/Login"; // Asumimos que el componente Login se moverá a su propio archivo
import DashboardCliente from "./routes/DashboardCliente";
import DashboardAdmin from "./routes/DashboardAdmin";
import DashboardAsesor from "./routes/DashboardAsesor";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Ruta Cliente */}
        <Route
          path="/dashboard/cliente"
          element={
            <ProtectedRoute>
              <DashboardCliente />
            </ProtectedRoute>
          }
        />

        {/* Ruta Admin */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />

        {/* Ruta Asesor */}
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