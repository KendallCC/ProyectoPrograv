import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL + "Ejercicios";

class EjerciciosApi {
  //Definición para Llamar al API y obtener el listado de peliculas
  getEjercicios() {
    return axios.get(BASE_URL);
  }
  //obtener por medio de ID
  getEjercicioById(Ejercicioid) {
    return axios.get(BASE_URL + "/" + Ejercicioid);
  }

  createEjercicio(Ejercicioid) {
    return axios.post(BASE_URL, Ejercicioid);
  }

  updateEjercicio(Ejercicioid) {
    return axios.put(BASE_URL, Ejercicioid);
  }
}

export default new EjerciciosApi();
