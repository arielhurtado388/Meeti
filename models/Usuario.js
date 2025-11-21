import { Sequelize } from "sequelize";
import db from "../config/db.js";
import bcrypt from "bcrypt";

const Usuario = db.define(
  "usuarios",
  {
    nombre: Sequelize.STRING(60),
    imagen: Sequelize.STRING(60),
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
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);
      },
    },
  }
);

// Método async para comparar passwords
Usuario.prototype.validarPass = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default Usuario;
