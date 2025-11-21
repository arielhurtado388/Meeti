import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function confirmarCuenta(datos) {
  const { nombre, correo, token } = datos;
  transport.sendMail({
    from: "Meeti <noreply@arielhurtado.online>",
    to: correo,
    subject: "Confirma tu cuenta",
    text: "Confirma tu cuenta",
    html: `
    <p>Hola ${nombre}, para confirmar tu cuenta en Meeti presiona en el enlace:</p>
    <a href="${process.env.BACK_URL}/confirmar/${token}">Confirmar cuenta</a>
    `,
  });
}

function recuperarAcceso(datos) {
  const { nombre, correo, token } = datos;
  transport.sendMail({
    from: "Meeti <noreply@arielhurtado.online>",
    to: correo,
    subject: "Recupera tu contraseña",
    text: "Recupera tu contraseña",
    html: `
    <p>Hola ${nombre}, para recuperar tu contraseña en Meeti presiona en el enlace:</p>
    <a href="${process.env.BACK_URL}/olvide/${token}">Recuperar contraseña</a>
    `,
  });
}

export { confirmarCuenta, recuperarAcceso };
