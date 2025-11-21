import Usuario from "../models/Usuario.js";
import { check, validationResult } from "express-validator";

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
  const nuevoUsuario = await Usuario.create(req.body);
  req.flash("exito", "Hemos enviado un correo para verificar tu cuenta");
  res.redirect("/iniciar-sesion");

  // TODO: Enviar email
};

const frmIniciarSesion = (req, res) => {
  res.render("iniciar-sesion", {
    pagina: "Iniciar sesión",
  });
};

export { frmCrearCuenta, crearCuenta, frmIniciarSesion };
