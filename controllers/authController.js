import shortid from "shortid";
import { confirmarCuenta, recuperarAcceso } from "../helpers/correos.js";
import Usuario from "../models/Usuario.js";
import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import passport from "passport";

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
};
