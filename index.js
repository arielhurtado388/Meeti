import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import dotenv from "dotenv";
import expressEjsLayouts from "express-ejs-layouts";
import router from "./routes/index.js";
import db from "./config/db.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import flash from "connect-flash";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";

dotenv.config({ path: ".env" });

try {
  await db.authenticate();
  await db.sync();
  console.log("DB conectada");
} catch (error) {
  console.error("Error DB:", error);
  process.exit(1);
}

// Crear la app
const app = express();
app.use(express.json());

// Habilitar lectura de datos de formularios
app.use(express.urlencoded({ extended: true }));

// Habilitar EJS
app.use(expressEjsLayouts);
app.set("view engine", "ejs");

// Ubicacion vista
app.set("views", path.join(__dirname, "./views"));

// Archivos estaticos
app.use(express.static("public"));

// Habilitar cookie parser
app.use(cookieParser());

// Crear la sesion
app.use(
  session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
  })
);

// Inicializar passport
app.use(passport.initialize());
app.use(passport.session());

// Agregar flash messages
app.use(flash());

// Middleware propio
app.use((req, res, next) => {
  res.locals.usuario = { ...req.user } || null;
  res.locals.mensajes = req.flash();
  const fecha = new Date();
  res.locals.year = fecha.getFullYear();
  next();
});

// Routing
app.use("/", router);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
