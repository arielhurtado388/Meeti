import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import express from "express";
import dotenv from "dotenv";
import expressEjsLayouts from "express-ejs-layouts";
import router from "./routes/index.js";

dotenv.config({ path: ".env" });

const app = express();

// Habilitar EJS
app.use(expressEjsLayouts);
app.set("view engine", "ejs");

// Ubicacion vista
app.set("views", path.join(__dirname, "./views"));

// Archivos estaticos
app.use(express.static("public"));

// Middleware propio
app.use((req, res, next) => {
  const fecha = new Date();
  res.locals.year = fecha.getFullYear();
  next();
});

// Routing
app.use("/", router);

app.listen(process.env.PORT, () => {
  console.log(`El servidor esta en el puerto ${process.env.PORT}`);
});
