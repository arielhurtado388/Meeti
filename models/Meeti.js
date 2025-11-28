import { Sequelize } from "sequelize";
import db from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import slug from "slug";
import Usuario from "./Usuario.js";
import Grupo from "./Grupo.js";
import shortid from "shortid";

const Meeti = db.define(
  "meetis",
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: uuidv4,
    },
    titulo: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    slug: Sequelize.STRING,
    invitado: Sequelize.STRING,
    cupo: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    descripcion: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    fecha: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    hora: {
      type: Sequelize.TIME,
      allowNull: false,
    },
    direccion: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    ciudad: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    estado: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    pais: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    ubicacion: Sequelize.GEOMETRY("POINT"),
    interesados: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      defaultValue: [],
    },
  },
  {
    hooks: {
      async beforeCreate(meeti) {
        const url = slug(meeti.titulo).toLowerCase();
        meeti.slug = `${url}-${shortid.generate()}`;
      },
    },
  }
);

Meeti.belongsTo(Usuario);
Meeti.belongsTo(Grupo);

export default Meeti;
