const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Usuario = sequelize.define("Usuario", {
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nombres: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellidos: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipoDocumento: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  documento: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
  type: DataTypes.STRING,
  allowNull: false,
  unique: true,
  validate: {
    isEmail: true
  }
},
  pais: {
    type: DataTypes.STRING,
  },
  prefijo: {
    type: DataTypes.STRING,
  },
  telefono: {
    type: DataTypes.STRING,
  },
  direccion: {
    type: DataTypes.TEXT,
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  rol: {
  type: DataTypes.STRING,
  allowNull: false,
  defaultValue: "cliente",
  validate: {
    isIn: [["cliente", "asesor", "admin"]],
  },
},
}, {
  tableName: "usuarios", // ⚠️ DEBE coincidir con tu tabla
  timestamps: false      // si tu tabla no usa createdAt y updatedAt
});

module.exports = Usuario;
