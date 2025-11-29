import moment from "moment";
import Grupo from "../models/Grupo.js";
import Meeti from "../models/Meeti.js";
import { Op } from "sequelize";

const panel = async (req, res) => {
  const fechaACtual = moment(new Date()).format("YYYY-MM-DD");
  const [grupos, meetis, anterioresMeetis] = await Promise.all([
    Grupo.findAll({
      where: {
        usuarioId: req.user.id,
      },
    }),
    Meeti.findAll({
      where: {
        usuarioId: req.user.id,
        fecha: {
          [Op.gte]: fechaACtual,
        },
      },
    }),
    Meeti.findAll({
      where: {
        usuarioId: req.user.id,
        fecha: {
          [Op.lt]: fechaACtual,
        },
      },
    }),
  ]);
  res.render("administracion", {
    pagina: "Panel de administración",
    grupos,
    meetis,
    moment,
    anterioresMeetis,
  });
};

export { panel };
