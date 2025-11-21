const home = (req, res) => {
  res.render("home", {
    pagina: "Inicio",
  });
};

export { home };
