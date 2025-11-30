import moment from "moment";
import Grupo from "../../models/Grupo.js";
import Meeti from "../../models/Meeti.js";
import Usuario from "../../models/Usuario.js";
import { Sequelize } from "sequelize";

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

const confirmarAsistencia = async (req, res) => {
  const { accion } = req.body;
  if (accion === "confirmar") {
    Meeti.update(
      {
        interesados: Sequelize.fn(
          "array_append",
          Sequelize.col("interesados"),
          req.user.id
        ),
      },
      {
        where: { slug: req.params.slug },
      }
    );
    res.send("Has confirmado tu asistencia");
  } else {
    Meeti.update(
      {
        interesados: Sequelize.fn(
          "array_remove",
          Sequelize.col("interesados"),
          req.user.id
        ),
      },
      {
        where: { slug: req.params.slug },
      }
    );
    res.send("Has cancelado tu asistencia");
  }
};

const mostrarAsistentes = async (req, res) => {
  const meeti = await Meeti.findOne({
    where: {
      slug: req.params.slug,
    },
    attributes: ["interesados"],
  });

  const { interesados } = meeti;

  const asistentes = await Usuario.findAll({
    where: {
      id: interesados,
    },
    attributes: ["nombre", "imagen"],
  });

  res.render("asistentes-meeti", {
    pagina: "Lista de asistentes",
    asistentes,
  });
};

const mostrarUsuario = async (req, res) => {
  const [usuario, grupos] = await Promise.all([
    Usuario.findOne({
      where: {
        id: req.params.id,
      },
    }),
    Grupo.findAll({
      where: {
        usuarioId: req.params.id,
      },
    }),
  ]);
  if (!usuario) {
    return res.redirect("/");
  }

  res.render("mostrar-perfil", {
    pagina: `Perfil: ${usuario.nombre}`,
    usuario,
    grupos,
  });
};

export { mostrarMeeti, confirmarAsistencia, mostrarAsistentes, mostrarUsuario };
