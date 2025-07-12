import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Registro = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    tipo: "estudiante",
    nombres: "",
    apellidos: "",
    tipoDocumento: "",
    documento: "",
    email: "",
    pais: "",
    prefijo: "+57",
    telefono: "",
    direccion: "",
    password: "",
    confirmPassword: "",
  });

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [errorContraseña, setErrorContraseña] = useState("");

  const prefijos = {
    Colombia: "+57",
    México: "+52",
    Perú: "+51",
    Argentina: "+54",
    Chile: "+56",
    España: "+34",
    USA: "+1",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleMostrarPassword = () => {
    setMostrarPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!regexEmail.test(form.email)) {
      alert("Por favor ingresa un correo electrónico válido.");
      return;
    }

    if (!regexPassword.test(form.password)) {
      setErrorContraseña(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número."
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrorContraseña("⚠️ Las contraseñas no coinciden.");
      return;
    }

    setErrorContraseña("");

    const nuevoUsuario = {
      tipo: form.tipo,
      nombres: form.nombres,
      apellidos: form.apellidos,
      tipoDocumento: form.tipoDocumento,
      documento: form.documento,
      email: form.email,
      pais: form.pais,
      prefijo: form.prefijo,
      telefono: form.telefono,
      direccion: form.direccion,
      password: form.password,
    };

    try {
      const respuesta = await fetch("http://localhost:5000/api/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoUsuario),
      });

      const data = await respuesta.json();

      if (respuesta.ok) {
        alert("✅ Registro exitoso. Ya puedes iniciar sesión.");
        navigate("/");
      } else {
        alert(data.msg || "❌ Error en el registro.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error al conectar con el servidor.");
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
            <h5>Registra tu información para acceder a la consultoría</h5>
            <hr />
            <h2>Registro</h2>

            <form className="form-box" onSubmit={handleSubmit}>
              <div className="registro-form-grid">
                <div className="registro-form-full">
                  <label>¿Eres estudiante o empresa?</label>
                  <select
                    name="tipo"
                    value={form.tipo}
                    onChange={handleChange}
                    className="registro-select"
                    required
                  >
                    <option value="estudiante">Estudiante</option>
                    <option value="empresa">Empresa</option>
                  </select>
                </div>

                <div>
                  <label>Nombres:</label>
                  <input
                    type="text"
                    name="nombres"
                    value={form.nombres}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label>Apellidos:</label>
                  <input
                    type="text"
                    name="apellidos"
                    value={form.apellidos}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label>Tipo de documento:</label>
                  <select
                    name="tipoDocumento"
                    value={form.tipoDocumento}
                    onChange={handleChange}
                    className="registro-select"
                    required
                  >
                    <option value="">Selecciona uno</option>
                    <option value="CC">Cédula de ciudadanía</option>
                    <option value="TI">Tarjeta de identidad</option>
                    <option value="CE">Cédula de extranjería</option>
                    <option value="NIT">NIT</option>
                    <option value="Pasaporte">Pasaporte</option>
                  </select>
                </div>

                <div>
                  <label>Número de documento:</label>
                  <input
                    type="text"
                    name="documento"
                    value={form.documento}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="registro-form-full">
                  <label>Correo electrónico:</label>
                  <input
                    type="email"
                    name="email"
                    className="registro-input"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label>País:</label>
                  <select
                    name="pais"
                    value={form.pais}
                    onChange={handleChange}
                    className="registro-select"
                    required
                  >
                    <option value="">Selecciona país</option>
                    {Object.keys(prefijos).map((pais) => (
                      <option key={pais} value={pais}>
                        {pais}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Prefijo telefónico:</label>
                  <select
                    name="prefijo"
                    value={form.prefijo}
                    onChange={handleChange}
                    className="registro-select"
                    required
                  >
                    {Object.entries(prefijos).map(([pais, codigo]) => (
                      <option key={codigo} value={codigo}>
                        {pais} ({codigo})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="registro-form-full">
                  <label>Número de teléfono:</label>
                  <input
                    type="tel"
                    name="telefono"
                    className="registro-input"
                    value={form.telefono}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="registro-form-full">
                  <label>Dirección:</label>
                  <input
                    type="text"
                    name="direccion"
                    value={form.direccion}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="registro-form-full">
                  <label>Contraseña:</label>
                  <div className="input-password-wrapper">
                    <input
                      type={mostrarPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                    <button type="button" className="ojito-btn" onClick={toggleMostrarPassword}>
                      {mostrarPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <div className="registro-form-full">
                  <label>Confirmar Contraseña:</label>
                  <div className="input-password-wrapper">
                    <input
                      type={mostrarPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button type="button" className="ojito-btn" onClick={toggleMostrarPassword}>
                      {mostrarPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {errorContraseña && (
                    <p style={{ color: "red", fontSize: "14px", marginTop: "4px" }}>
                      {errorContraseña}
                    </p>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn primary">
                  Registrarse
                </button>
              </div>

              <div className="register-link">
                <p>
                  ¿Ya tienes una cuenta? <Link to="/">Iniciar Sesión</Link>
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

export default Registro;
