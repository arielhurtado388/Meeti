import express from "express";
import { home } from "../controllers/homeController.js";
import { crearCuenta, frmCrearCuenta } from "../controllers/authController.js";

const router = express.Router();

router.get("/", home);
router.get("/crear-cuenta", frmCrearCuenta);
router.post("/crear-cuenta", crearCuenta);

export default router;
