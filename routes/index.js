import express from "express";
import { frmCrearCuenta } from "../controllers/authController.js";

const router = express.Router();

router.get("/crear-cuenta", frmCrearCuenta);

export default router;
