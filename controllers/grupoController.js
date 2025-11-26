import { check, validationResult } from "express-validator";
import Categoria from "../models/Categoria.js";
import Grupo from "../models/Grupo.js";

const frmNuevoGrupo = async (req, res) => {
  const categorias = await Categoria.findAll();
  res.render("nuevo-grupo", {
    pagina: "Crea un nuevo grupo",
    categorias,
  });
};

const crearGrupo = async (req, res) => {
  await check("nombre")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .run(req);
  await check("descripcion")
    .isLength({ min: 10, max: 1500 })
    .withMessage("La descripción debe tener entre 10 y 1500 caracteres")
    .run(req);
  await check("categoria")
    .notEmpty()
    .withMessage("La categoría es obligatoria")
    .run(req);
  //   await check("imagen")
  //     .notEmpty()
  //     .withMessage("La imagen es obligatoria")
  //     .run(req);

  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    const erroresArray = errores.errors.map((error) => error.msg);
    req.flash("error", erroresArray);
    return res.redirect("/nuevo-grupo");
  }
  const grupo = req.body;
  grupo.usuarioId = req.user.id;
  grupo.categoriaId = req.body.categoria;

  try {
    await Grupo.create(grupo);
    req.flash("exito", "Se ha creado el grupo correctamenta");
    res.redirect("/administracion");
  } catch (error) {
    console.log(error);
  }
};

export { frmNuevoGrupo, crearGrupo };
