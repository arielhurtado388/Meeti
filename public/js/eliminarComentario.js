import axios from "axios";
import Swal from "sweetalert2";

document.addEventListener("DOMContentLoaded", () => {
  const formsEliminar = document.querySelectorAll(".eliminar-comentario");

  if (formsEliminar) {
    formsEliminar.forEach((form) => {
      form.addEventListener("submit", eliminarComentario);
    });
  }
});

function eliminarComentario(e) {
  e.preventDefault();

  Swal.fire({
    title: "¿Eliminar comentario?",
    text: "Un comentario eliminado no se puede recuperar",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      const idComentario = this.children[0].value;

      const datos = {
        idComentario,
      };

      axios
        .post(this.action, datos)
        .then((respuesta) => {
          Swal.fire({
            title: "Eliminado",
            text: respuesta.data,
            icon: "success",
          });
          this.parentElement.parentElement.remove();
        })
        .catch((error) => {
          if (error.response.status === 403 || error.response.status === 404) {
            Swal.fire({
              title: "Error",
              text: error.response.data,
              icon: "error",
            });
          }
        });
    }
  });
}
