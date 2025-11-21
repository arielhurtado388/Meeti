const frmCrearCuenta = (req, res) => {
  res.render("crear-cuenta", {
    pagina: "Crea tu cuenta",
  });
};

const crearCuenta = async (req, res) => {};

export { frmCrearCuenta, crearCuenta };
