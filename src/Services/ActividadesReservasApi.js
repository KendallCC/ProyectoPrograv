import axios from 'axios';
const BASE_URL=import.meta.env.VITE_BASE_URL+"ActividadesReservas"

class ActividadesReservasApi{
    //Definición para Llamar al API y obtener el listado de peliculas
    getReservas(){
        return axios.get(BASE_URL);
    }
    getReservaById(ActividadId){
        return axios.get(BASE_URL + '/' + ActividadId);
    }
    createReservas(plan){
        return axios.post(BASE_URL, plan);
    }

    updateReservas(plan){
        return axios.put(BASE_URL, plan);
    }

    updateEstadoReservas($actividadId){
        return axios.put(`${BASE_URL}/updateEstadoReservas/${$actividadId}`);
    }

    getClientInscritoActividades(usuarioId) {
        return axios.get(`${BASE_URL}/getInscritoByCliente/${usuarioId}`);
      }
}

export default new ActividadesReservasApi();