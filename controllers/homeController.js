import moment from "moment";
import Categoria from "../models/Categoria.js";
import Meeti from "../models/Meeti.js";
import { Op } from "sequelize";
import Grupo from "../models/Grupo.js";
import Usuario from "../models/Usuario.js";

const home = async (req, res) => {
  const [categorias, meetis] = await Promise.all([
    Categoria.findAll(),
    Meeti.findAll({
      limit: 3,
      attributes: ["titulo", "slug", "fecha", "hora"],
      where: {
        fecha: {
          [Op.gte]: moment(new Date()).format("YYYY-MM-DD"),
        },
      },
      order: [["fecha", "DESC"]],
      include: [
        {
          model: Grupo,
          attributes: ["imagen"],
        },
        {
          model: Usuario,
          attributes: ["nombre", "imagen"],
        },
      ],
    }),
  ]);

  res.render("home", {
    pagina: "Inicio",
    categorias,
    moment,
    meetis,
  });
};

export { home };
