import shortid from "shortid";
import { confirmarCuenta, recuperarAcceso } from "../helpers/correos.js";
import Usuario from "../models/Usuario.js";
import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import passport from "passport";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { unlink } from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configuracionmulter = {
  limits: { fileSize: 100000 },
  storage: multer.diskStorage({
    destination: (req, file, next) => {
      next(null, __dirname + "/../public/uploads/perfiles");
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

const subirImagenPerfil = (req, res, next) => {
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

const frmCrearCuenta = (req, res) => {
  res.render("crear-cuenta", {
    pagina: "Crea tu cuenta",
  });
};

const crearCuenta = async (req, res) => {
  await check("correo")
    .isEmail()
    .withMessage("El correo no es válido")
    .run(req);
  await check("nombre")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .run(req);
  await check("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .run(req);
  await check("repetir")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Las contraseñas no coinciden")
    .run(req);

  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    const erroresArray = errores.errors.map((error) => error.msg);
    req.flash("error", erroresArray);
    return res.redirect("/crear-cuenta");
  }
  const usuario = await Usuario.findOne({
    where: {
      correo: req.body.correo,
    },
  });

  if (usuario) {
    req.flash("error", "El usuario ya está registrado");
    return res.redirect("/crear-cuenta");
  }
  // Usuario nuevo y todos los campos validados
  const nuevoUsuario = new Usuario(req.body);

  // Generar token
  const token = shortid.generate();
  nuevoUsuario.token = token;
  await nuevoUsuario.save();

  // TODO: Enviar email
  confirmarCuenta({
    nombre: nuevoUsuario.nombre,
    correo: nuevoUsuario.correo,
    token,
  });

  req.flash("exito", "Hemos enviado un correo para verificar tu cuenta");
  res.redirect("/iniciar-sesion");
};

const frmIniciarSesion = (req, res) => {
  res.render("iniciar-sesion", {
    pagina: "Iniciar sesión",
  });
};

const iniciarSesion = passport.authenticate("local", {
  successRedirect: "/administracion",
  failureRedirect: "/iniciar-sesion",
  failureFlash: true,
  badRequestMessage: "Ambos campos son obligatorios",
});

// Revisa si el usuario esta autenticado o no
const usuarioAutenticado = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/iniciar-sesion");
};

const confirmar = async (req, res) => {
  const usuario = await Usuario.findOne({
    where: {
      token: req.params.token,
    },
  });

  if (!usuario) {
    req.flash("error", "El token no es válido");
    return res.redirect("/olvide");
  }

  usuario.token = null;
  usuario.activo = 1;
  await usuario.save();

  req.flash("exito", "Cuenta confirmada correctamente");
  res.redirect("/iniciar-sesion");
};

const frmRecuperarPass = (req, res) => {
  res.render("olvide", {
    pagina: "Olvidé mi contraseña",
  });
};

const recuperarPass = async (req, res) => {
  await check("correo")
    .isEmail()
    .withMessage("El correo es obligatorio")
    .run(req);

  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    const erroresArray = errores.errors.map((error) => error.msg);
    req.flash("error", erroresArray);
    return res.redirect("/olvide");
  }
  const usuario = await Usuario.findOne({
    where: {
      correo: req.body.correo,
    },
  });

  if (!usuario) {
    req.flash("error", "El usuario no existe");
    return res.redirect("/olvide");
  }

  const token = shortid.generate();
  usuario.token = token;
  await usuario.save();

  recuperarAcceso({
    nombre: usuario.nombre,
    correo: usuario.correo,
    token,
  });
  req.flash("exito", "Hemos enviado las instrucciones a tu correo");
  return res.redirect("/olvide");
};

const frmReestablecer = (req, res) => {
  res.render("recuperar", {
    pagina: "Recuperar contraseña",
  });
};

const reestablecer = async (req, res) => {
  await check("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .run(req);

  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    const erroresArray = errores.errors.map((error) => error.msg);
    req.flash("error", erroresArray);
    return res.redirect(`/olvide/${req.params.token}`);
  }

  const usuario = await Usuario.findOne({
    where: {
      token: req.params.token,
    },
  });

  if (!usuario) {
    req.flash("error", "El token no es válido");
    return res.redirect(`/olvide/${req.params.token}`);
  }

  // Generar password y guardar cambios
  const salt = await bcrypt.genSalt(10);
  usuario.password = await bcrypt.hash(req.body.password, salt);
  usuario.token = null;
  await usuario.save();
  req.flash("exito", "La contraseña se cambió correctamente");
  return res.redirect("/iniciar-sesion");
};

const frmEditarPerfil = async (req, res) => {
  const usuario = await Usuario.findByPk(req.user.id);

  res.render("editar-perfil", {
    pagina: "Editar perfil",
    usuario,
  });
};

const editarPerfil = async (req, res) => {
  await check("nombre")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .run(req);
  await check("correo")
    .isEmail()
    .withMessage("El correo no es válido")
    .run(req);
  await check("descripcion")
    .isLength({ min: 10, max: 1500 })
    .withMessage("La descripción debe tener entre 10 y 1500 caracteres")
    .run(req);

  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    const erroresArray = errores.errors.map((error) => error.msg);
    req.flash("error", erroresArray);
    return res.redirect("/editar-perfil");
  }

  const usuario = await Usuario.findByPk(req.user.id);
  const { nombre, descripcion, correo } = req.body;
  usuario.nombre = nombre;
  usuario.descripcion = descripcion;
  usuario.correo = correo;

  await usuario.save();
  req.flash("exito", "Cambios guardados correctamente");
  res.redirect("/administracion");
};

const frmCambiarPassword = (req, res) => {
  res.render("cambiar-password", {
    pagina: "Cambiar contraseña",
  });
};
const cambiarPassword = async (req, res) => {
  await check("anterior")
    .notEmpty()
    .withMessage("La contraseña anterior es obligatoria")
    .run(req);
  await check("nuevo")
    .notEmpty()
    .withMessage("La contraseña nueva es obligatoria")
    .run(req);

  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    const erroresArray = errores.errors.map((error) => error.msg);
    req.flash("error", erroresArray);
    return res.redirect("/cambiar-password");
  }

  const usuario = await Usuario.findByPk(req.user.id);

  // Verificar si el anterior es correcto
  const verificarPass = await usuario.validarPass(req.body.anterior);

  if (!verificarPass) {
    req.flash("error", "La contraseña anterior es incorrecta");
    return res.redirect("/cambiar-password");
  }

  // Si es correcto hashear el nuevo  asignarlo
  const hash = await usuario.hashPass(req.body.nuevo);
  usuario.password = hash;

  // Guardar los cambios y redireccionar
  await usuario.save();

  req.logout(req.user, (err) => {
    if (err) return next(err);
    req.flash(
      "exito",
      "Cambios guardados correctamente, vuelve a iniciar sesión"
    );
    res.redirect("/iniciar-sesion");
  });
};

const frmImagenPerfil = async (req, res) => {
  const usuario = await Usuario.findByPk(req.user.id);

  res.render("imagen-perfil", {
    pagina: "Subir imagen de perfil",
    usuario,
  });
};
const imagenPerfil = async (req, res) => {
  const usuario = await Usuario.findByPk(req.user.id);

  if (req.file && usuario.imagen) {
    const imagenAnteriorPath =
      __dirname + `/../public/uploads/perfiles/${usuario.imagen}`;
    unlink(imagenAnteriorPath, (error) => {
      if (error) {
        console.log(error);
      }
      return;
    });
  }

  if (req.file) {
    usuario.imagen = req.file.filename;
  }

  await usuario.save();
  req.flash("exito", "Cambios guardados correctamente");
  res.redirect("/administracion");
};

const cerrarSesion = (req, res) => {
  req.logout(req.user, (err) => {
    if (err) return next(err);
    req.flash("exito", "Sesión cerrada correctamente, vuelve a iniciar sesión");
    res.redirect("/iniciar-sesion");
  });
};

export {
  frmCrearCuenta,
  crearCuenta,
  frmIniciarSesion,
  iniciarSesion,
  usuarioAutenticado,
  confirmar,
  frmRecuperarPass,
  recuperarPass,
  frmReestablecer,
  reestablecer,
  frmEditarPerfil,
  editarPerfil,
  frmCambiarPassword,
  cambiarPassword,
  frmImagenPerfil,
  subirImagenPerfil,
  imagenPerfil,
  cerrarSesion,
};
