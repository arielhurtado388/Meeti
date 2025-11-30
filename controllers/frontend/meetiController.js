import moment from "moment";
import Grupo from "../../models/Grupo.js";
import Meeti from "../../models/Meeti.js";
import Usuario from "../../models/Usuario.js";
import { Sequelize } from "sequelize";
import Categoria from "../../models/Categoria.js";
import { check, validationResult } from "express-validator";
import Comentario from "../../models/Comentario.js";

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

  const comentarios = await Comentario.findAll({
    where: {
      meetiId: meeti.id,
    },
    include: [
      {
        model: Usuario,
        attributes: ["id", "nombre", "imagen"],
      },
    ],
  });

  res.render("mostrar-meeti", {
    pagina: meeti.titulo,
    meeti,
    comentarios,
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

const mostrarGrupo = async (req, res) => {
  const [grupo, meetis] = await Promise.all([
    Grupo.findOne({
      where: {
        id: req.params.id,
      },
    }),
    Meeti.findAll({
      where: {
        grupoId: req.params.id,
      },
      order: [["fecha", "ASC"]],
    }),
  ]);

  if (!grupo) {
    return res.redirect("/");
  }

  res.render("mostrar-grupo", {
    pagina: `Información del grupo: ${grupo.nombre}`,
    grupo,
    meetis,
    moment,
  });
};

const mostrarCategoria = async (req, res) => {
  const categoria = await Categoria.findOne({
    where: {
      slug: req.params.slug,
    },
    attributes: ["id", "nombre"],
  });

  const meetis = await Meeti.findAll({
    order: [
      ["fecha", "ASC"],
      ["hora", "ASC"],
    ],
    include: [
      {
        model: Grupo,
        where: {
          categoriaId: categoria.id,
        },
      },
      {
        model: Usuario,
      },
    ],
  });

  if (!categoria) {
    return res.redirect("/");
  }

  res.render("categoria", {
    pagina: `Categoría: ${categoria.nombre}`,
    meetis,
    moment,
  });
};

const guardarComentario = async (req, res) => {
  await check("comentario")
    .isLength({ min: 10, max: 1500 })
    .withMessage("El comentario debe tener entre 10 y 1500 caracteres")
    .run(req);

  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    const erroresArray = errores.errors.map((error) => error.msg);
    req.flash("error", erroresArray);
    return res.redirect(`/meeti/${req.params.slug}`);
  }

  const meeti = await Meeti.findOne({
    where: {
      slug: req.params.slug,
    },
  });

  try {
    await Comentario.create({
      mensaje: req.body.comentario,
      usuarioId: req.user.id,
      meetiId: meeti.id,
    });
    req.flash("exito", "Comentario realizado correctamente");
    res.redirect(`/meeti/${req.params.slug}`);
  } catch (error) {
    console.log(error);
  }
};

const eliminarComentario = async (req, res) => {
  const { idComentario } = req.body;

  const comentario = await Comentario.findOne({
    where: {
      id: idComentario,
    },
  });

  if (!comentario) {
    return res.status(404).send("Acción no válida");
  }

  const meeti = await Meeti.findOne({
    where: {
      id: comentario.meetiId,
    },
  });

  if (comentario.usuarioId !== req.user.id || meeti.usuarioId !== req.user.id) {
    return res.status(403).send("Acción no válida");
  }

  await comentario.destroy({
    where: {
      id: comentario.id,
    },
  });
  res.status(200).send("Comentario eliminado correctamente");
};

export {
  mostrarMeeti,
  confirmarAsistencia,
  mostrarAsistentes,
  mostrarUsuario,
  mostrarGrupo,
  mostrarCategoria,
  guardarComentario,
  eliminarComentario,
};
