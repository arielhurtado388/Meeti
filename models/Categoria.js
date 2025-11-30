import { Sequelize } from "sequelize";
import db from "../config/db.js";

const Categoria = db.define(
  "categorias",
  {
    nombre: Sequelize.TEXT,
    slug: Sequelize.TEXT,
  },
  {
    timestamps: false,
  }
);

export default Categoria;
