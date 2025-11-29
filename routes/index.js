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
  editarGrupo,
  editarImagen,
  eliminarGrupo,
  frmEditarGrupo,
  frmEditarImagen,
  frmEliminarGrupo,
  frmNuevoGrupo,
  subirImagen,
} from "../controllers/grupoController.js";
import {
  crearMeeti,
  editarMeeti,
  eliminarMeeti,
  frmCrearMeeti,
  frmEditarMeeti,
  frmEliminarMeeti,
} from "../controllers/meetiController.js";

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
// Grupos
router.get("/nuevo-grupo", usuarioAutenticado, frmNuevoGrupo);
router.post("/nuevo-grupo", usuarioAutenticado, subirImagen, crearGrupo);
router.get("/editar-grupo/:grupoId", usuarioAutenticado, frmEditarGrupo);
router.post("/editar-grupo/:grupoId", usuarioAutenticado, editarGrupo);
router.get("/imagen-grupo/:grupoId", usuarioAutenticado, frmEditarImagen);
router.post(
  "/imagen-grupo/:grupoId",
  usuarioAutenticado,
  subirImagen,
  editarImagen
);
router.get("/eliminar-grupo/:grupoId", usuarioAutenticado, frmEliminarGrupo);
router.post("/eliminar-grupo/:grupoId", usuarioAutenticado, eliminarGrupo);

// Meeti's
router.get("/nuevo-meeti", usuarioAutenticado, frmCrearMeeti);
router.post("/nuevo-meeti", usuarioAutenticado, crearMeeti);
router.get("/editar-meeti/:id", usuarioAutenticado, frmEditarMeeti);
router.post("/editar-meeti/:id", usuarioAutenticado, editarMeeti);
router.get("/eliminar-meeti/:id", usuarioAutenticado, frmEliminarMeeti);
router.post("/eliminar-meeti/:id", usuarioAutenticado, eliminarMeeti);

export default router;
