import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL + "Usuario";

class ClientesApi {
  //Definición para Llamar al API y obtener el listado de peliculas
  getclientes() {
    return axios.get(BASE_URL);
  }
  //obtener por medio de ID
  getEclientesId(clienteid) {
    return axios.get(BASE_URL + "/" + clienteid);
  }

  createclientes(cliente) {
    return axios.post(BASE_URL, cliente);
  }

  updateclientes(cliente) {
    return axios.put(BASE_URL, cliente);
  }

  loginUser(User) {
    return axios.post(BASE_URL + "/login/", User);
  }

  RolUser(roles) {
    return axios.post(BASE_URL + "/rol/", roles);
  }
}

export default new ClientesApi();
