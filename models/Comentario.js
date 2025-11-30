import { Sequelize } from "sequelize";
import db from "../config/db.js";
import Usuario from "./Usuario.js";
import Meeti from "./Meeti.js";

const Comentario = db.define(
  "comentarios",
  {
    mensaje: Sequelize.TEXT,
  },
  {
    timestamps: false,
  }
);

Comentario.belongsTo(Usuario);
Comentario.belongsTo(Meeti);

export default Comentario;
