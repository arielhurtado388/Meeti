const panel = (req, res) => {
  res.render("administracion", {
    pagina: "Panel de administración",
  });
};

export { panel };
