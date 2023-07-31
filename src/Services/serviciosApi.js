import axios from 'axios';
const BASE_URL=import.meta.env.VITE_BASE_URL+"Servicios"

class ServiciosApi{
    //Definición para Llamar al API y obtener el listado de peliculas
    getServicios(){
        return axios.get(BASE_URL);
    }
    getPServiciosById(Servicio){
        return axios.get(BASE_URL + '/' + Servicio);
    }

    createServicios(Servicio){
        return axios.post(BASE_URL, Servicio);
    }

    updateServicios(Servicio){
        return axios.put(BASE_URL, Servicio);
    }
}

export default new ServiciosApi()