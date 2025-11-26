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
import {
  crearGrupo,
  frmNuevoGrupo,
  subirImagen,
} from "../controllers/grupoController.js";

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
router.get("/administracion", usuarioAutenticado, panel);
router.get("/nuevo-grupo", usuarioAutenticado, frmNuevoGrupo);
router.post("/nuevo-grupo", usuarioAutenticado, subirImagen, crearGrupo);

export default router;
