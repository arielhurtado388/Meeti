import express from "express";
import { home } from "../controllers/homeController.js";
import {
  cambiarPassword,
  cerrarSesion,
  confirmar,
  crearCuenta,
  editarPerfil,
  frmCambiarPassword,
  frmCrearCuenta,
  frmEditarPerfil,
  frmImagenPerfil,
  frmIniciarSesion,
  frmRecuperarPass,
  frmReestablecer,
  imagenPerfil,
  iniciarSesion,
  recuperarPass,
  reestablecer,
  subirImagenPerfil,
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
import {
  confirmarAsistencia,
  mostrarAsistentes,
  mostrarCategoria,
  mostrarGrupo,
  mostrarMeeti,
  mostrarUsuario,
} from "../controllers/frontend/meetiController.js";

const router = express.Router();

// Area publica
router.get("/", home);
router.get("/meeti/:slug", mostrarMeeti);
router.post("/confirmar-asistencia/:slug", confirmarAsistencia);
router.get("/asistentes/:slug", mostrarAsistentes);
router.get("/usuarios/:id", mostrarUsuario);
router.get("/grupos/:id", mostrarGrupo);
router.get("/categoria/:slug", mostrarCategoria);

// Area Privada
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
router.get("/cerrar-sesion", usuarioAutenticado, cerrarSesion);

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

// Editar perfil
router.get("/editar-perfil", usuarioAutenticado, frmEditarPerfil);
router.post("/editar-perfil", usuarioAutenticado, editarPerfil);

// Cambiar password
router.get("/cambiar-password", usuarioAutenticado, frmCambiarPassword);
router.post("/cambiar-password", usuarioAutenticado, cambiarPassword);

// Imagen perfil
router.get("/imagen-perfil", usuarioAutenticado, frmImagenPerfil);
router.post(
  "/imagen-perfil",
  usuarioAutenticado,
  subirImagenPerfil,
  imagenPerfil
);

export default router;
