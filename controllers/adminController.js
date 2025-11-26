import Grupo from "../models/Grupo.js";

const panel = async (req, res) => {
  const grupos = await Grupo.findAll({
    where: {
      usuarioId: req.user.id,
    },
  });
  res.render("administracion", {
    pagina: "Panel de administración",
    grupos,
  });
};

export { panel };
