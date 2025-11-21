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
} from "../controllers/authController.js";

const router = express.Router();

router.get("/", home);
router.get("/crear-cuenta", frmCrearCuenta);
router.post("/crear-cuenta", crearCuenta);
router.get("/iniciar-sesion", frmIniciarSesion);
router.post("/iniciar-sesion", iniciarSesion);
router.get("/confirmar/:token", confirmar);
router.get("/olvide", frmRecuperarPass);
router.post("/olvide", recuperarPass);
router.get("/olvide/:token", frmReestablecer);
router.post("/olvide/:token", reestablecer);

export default router;
