import express from "express";
import { home } from "../controllers/homeController.js";
import {
  confirmar,
  crearCuenta,
  frmCrearCuenta,
  frmIniciarSesion,
  frmRecuperarPass,
  frmReestablecer,
  iniciarSesion,
  recuperarPass,
  reestablecer,
  usuarioAutenticado,
} from "../controllers/authController.js";
import { panel } from "../controllers/adminController.js";

const router = express.Router();

router.get("/", home);
// Auth
router.get("/crear-cuenta", frmCrearCuenta);
router.post("/crear-cuenta", crearCuenta);
router.get("/iniciar-sesion", frmIniciarSesion);
router.post("/iniciar-sesion", iniciarSesion);
router.get("/confirmar/:token", confirmar);
router.get("/olvide", frmRecuperarPass);
router.post("/olvide", recuperarPass);
router.get("/olvide/:token", frmReestablecer);
router.post("/olvide/:token", reestablecer);

// Panel de administracion
router.get(
  "/administracion",
  // usuarioAutenticado,
  panel
);

export default router;
