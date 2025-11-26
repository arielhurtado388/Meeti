import { Sequelize } from "sequelize";
import db from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import Categoria from "./Categoria.js";
import Usuario from "./Usuario.js";

const Grupo = db.define("grupos", {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: uuidv4,
  },
  nombre: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
  descripcion: {
    type: Sequelize.STRING(1500),
    allowNull: false,
  },
  imagen: Sequelize.TEXT,
  url: Sequelize.TEXT,
});

Grupo.belongsTo(Categoria);
Grupo.belongsTo(Usuario);

export default Grupo;
