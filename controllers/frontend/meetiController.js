import moment from "moment";
import Grupo from "../../models/Grupo.js";
import Meeti from "../../models/Meeti.js";
import Usuario from "../../models/Usuario.js";

const mostrarMeeti = async (req, res) => {
  const meeti = await Meeti.findOne({
    where: {
      slug: req.params.slug,
    },
    include: [
      {
        model: Grupo,
      },
      {
        model: Usuario,
        attributes: ["id", "nombre", "imagen"],
      },
    ],
  });

  if (!meeti) {
    res.redirect("/");
  }
  res.render("mostrar-meeti", {
    pagina: meeti.titulo,
    meeti,
    moment,
  });
};

export { mostrarMeeti };
