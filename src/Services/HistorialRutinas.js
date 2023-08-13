import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL + "HistorialRutinas";

class HistorialRutinasApi {
  //Definición para Llamar al API y obtener el listado de peliculas
  getHistorialRutinas() {
    return axios.get(BASE_URL);
  }
  //obtener por medio de ID
  getHistorialRutinaById(Rutinaid) {
    return axios.get(BASE_URL + "/" + Rutinaid);
  }

  getHistorialRutinaByCliente(Clienteid) {
    return axios.post(BASE_URL+"/getbyCliente/"+ Clienteid);
  }

  createHistorialRutina(Ejercicioid) {
    return axios.post(BASE_URL, Ejercicioid);
  }

  updateHistorialRutina(Ejercicioid) {
    return axios.put(BASE_URL, Ejercicioid);
  }
}

export default new HistorialRutinasApi();
