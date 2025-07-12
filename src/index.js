import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Punto de entrada de la aplicación React
const root = ReactDOM.createRoot(document.getElementById("root"));

// Renderizar la aplicación dentro del <div id="root"> en public/index.html
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
