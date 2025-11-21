import passport from "passport";
import LocalSrategy from "passport-local";
import Usuario from "../models/Usuario.js";

passport.use(
  new LocalSrategy(
    {
      usernameField: "correo",
      passwordField: "password",
    },
    async (correo, password, next) => {
      // Se ejecuta al llenar el formulario
      const usuario = await Usuario.findOne({
        where: {
          correo,
          activo: 1,
        },
      });
      if (!usuario)
        return next(null, false, {
          message: "El usuario no existe o no está confirmado",
        });

      const verificarPass = await usuario.validarPass(password);

      if (!verificarPass)
        return next(null, false, {
          message: "La contraseña es incorrecta",
        });

      return next(null, usuario);
    }
  )
);

passport.serializeUser(function (usuario, cb) {
  cb(null, usuario);
});

passport.deserializeUser(function (usuario, cb) {
  cb(null, usuario);
});

export default passport;
