import { check, validationResult } from "express-validator";
import Grupo from "../models/Grupo.js";
import Meeti from "../models/Meeti.js";

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

const crearMeeti = async (req, res) => {
  await check("grupoId")
    .notEmpty()
    .withMessage("El grupo es obligatorio")
    .run(req);
  await check("titulo")
    .notEmpty()
    .withMessage("El titulo es obligatorio")
    .run(req);
  await check("descripcion")
    .isLength({ min: 10, max: 1500 })
    .withMessage("La descripción debe tener entre 10 y 1500 caracteres")
    .run(req);
  await check("fecha")
    .notEmpty()
    .withMessage("La fecha es obligatoria")
    .run(req);
  await check("hora").notEmpty().withMessage("La hora es obligatoria").run(req);
  await check("direccion")
    .notEmpty()
    .withMessage("La dirección es obligatoria")
    .run(req);
  await check("ciudad")
    .notEmpty()
    .withMessage("La ciudad es obligatoria")
    .run(req);
  await check("estado")
    .notEmpty()
    .withMessage("El estado es obligatorio")
    .run(req);
  await check("pais").notEmpty().withMessage("El país es obligatorio").run(req);

  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    const erroresArray = errores.errors.map((error) => error.msg);
    req.flash("error", erroresArray);
    return res.redirect("/nuevo-meeti");
  }

  const meeti = req.body;
  meeti.usuarioId = req.user.id;
  const point = {
    type: "Point",
    coordinates: [parseFloat(req.body.lat), parseFloat(req.body.lng)],
  };
  meeti.ubicacion = point;
  if (req.body.cupo === "") {
    meeti.cupo = 0;
  }

  try {
    await Meeti.create(meeti);
    req.flash("exito", "Meeti creado correctamente");
    res.redirect("/administracion");
  } catch (error) {
    console.log(error);
  }
};

export { frmCrearMeeti, crearMeeti };
