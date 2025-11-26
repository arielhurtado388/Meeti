import { check, validationResult } from "express-validator";
import Categoria from "../models/Categoria.js";
import Grupo from "../models/Grupo.js";
import multer from "multer";
import shortid from "shortid";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frmNuevoGrupo = async (req, res) => {
  const categorias = await Categoria.findAll();
  res.render("nuevo-grupo", {
    pagina: "Crea un nuevo grupo",
    categorias,
  });
};

const configuracionmulter = {
  limits: { fileSize: 100000 },
  storage: multer.diskStorage({
    destination: (req, file, next) => {
      next(null, __dirname + "/../public/uploads/grupos");
    },
    filename: (req, file, next) => {
      const extension = file.mimetype.split("/")[1];
      next(null, `${shortid.generate()}.${extension}`);
    },
  }),
  fileFilter: (req, file, next) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      next(null, true);
    } else {
      next(new Error("Formato no válido"), false);
    }
  },
};
const upload = multer(configuracionmulter).single("imagen");

const subirImagen = (req, res, next) => {
  upload(req, res, function (error) {
    if (error) {
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          req.flash("error", "El archivo es muy grande");
        } else {
          req.flash("error", error.message);
        }
      } else if (error.hasOwnProperty("message")) {
        req.flash("error", error.message);
      }
      return res.redirect("/nuevo-grupo");
    } else {
      next();
    }
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

  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    const erroresArray = errores.errors.map((error) => error.msg);
    req.flash("error", erroresArray);
    return res.redirect("/nuevo-grupo");
  }
  const grupo = req.body;
  grupo.usuarioId = req.user.id;
  grupo.categoriaId = req.body.categoria;

  if (req.file) {
    grupo.imagen = req.file.filename;
  }

  try {
    await Grupo.create(grupo);
    req.flash("exito", "Se ha creado el grupo correctamenta");
    res.redirect("/administracion");
  } catch (error) {
    console.log(error);
  }
};

export { frmNuevoGrupo, subirImagen, crearGrupo };
