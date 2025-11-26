import Grupo from "../models/Grupo.js";

const frmCrearMeeti = async (req, res) => {
  const grupos = await Grupo.findAll({
    where: {
      usuarioId: req.user.id,
    },
  });
  res.render("nuevo-meeti", {
    pagina: "Crear nuevo meeti",
    grupos,
  });
};

export { frmCrearMeeti };
