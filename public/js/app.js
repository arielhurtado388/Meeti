import { OpenStreetMapProvider } from "leaflet-geosearch";

const lat = -0.2264187180561161;
const lng = -78.50334164279307;

const map = L.map("mapa").setView([lat, lng], 15);
let markers = new L.FeatureGroup().addTo(map);
let marker;

document.addEventListener("DOMContentLoaded", () => {
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const buscador = document.querySelector("#formbuscador");
  buscador.addEventListener("input", buscarDireccion);
});

function buscarDireccion(e) {
  if (e.target.value.length > 8) {
    // Limpiar pin anterior
    markers.clearLayers();

    // Utilizar el provider y geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();

    // Utilizar el provider
    const provider = new OpenStreetMapProvider();
    provider.search({ query: e.target.value }).then(function (resultado) {
      geocodeService
        .reverse()
        .latlng(resultado[0].bounds[0], 15)
        .run(function (error, result) {
          llenarInputs(result);
          // Mostrar el mapa
          map.setView(resultado[0].bounds[0], 15);
          // Agregar el pin
          marker = new L.marker(resultado[0].bounds[0], {
            draggable: true,
            autoPan: true,
          })
            .addTo(map)
            .bindPopup(resultado[0].label)
            .openPopup();
          markers.addLayer(marker);

          // Detectar movimiento del pin
          marker.on("moveend", function (e) {
            marker = e.target;
            const posicion = marker.getLatLng();
            map.panTo(new L.LatLng(posicion.lat, posicion.lng));
            // Reverse geocoding cuando el usuario mueva el pin
            geocodeService
              .reverse()
              .latlng(posicion, 15)
              .run(function (error, result) {
                llenarInputs(result);
                // Asignar valores al marker
                marker.bindPopup(result.address.LongLabel);
              });
          });
        });
    });
  }
}

function llenarInputs(resultado) {
  document.querySelector("#direccion").value = resultado.address.Address || "";
  document.querySelector("#ciudad").value = resultado.address.City || "";
  document.querySelector("#estado").value = resultado.address.Region || "";
  document.querySelector("#pais").value = resultado.address.CntryName || "";
  document.querySelector("#lat").value = resultado.latlng.lat || "";
  document.querySelector("#lng").value = resultado.latlng.lng || "";
}
