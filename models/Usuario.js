import { Sequelize } from "sequelize";
import db from "../config/db.js";
import bcrypt from "bcrypt";

const Usuario = db.define(
  "usuarios",
  {
    nombre: Sequelize.STRING(60),
    imagen: Sequelize.STRING(60),
    descripcion: Sequelize.TEXT,
    correo: {
      type: Sequelize.STRING(60),
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
    activo: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    token: Sequelize.STRING,
    expira: Sequelize.DATE,
  },
  {
    hooks: {
      // Hook async - mejor rendimiento
      beforeCreate: async (usuario) => {
        usuario.password = Usuario.prototype.hashPass(usuario.password);
      },
    },
  }
);

// Método async para comparar passwords
Usuario.prototype.validarPass = async function (password) {
  return await bcrypt.compare(password, this.password);
};
Usuario.prototype.hashPass = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export default Usuario;
