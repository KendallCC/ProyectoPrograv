import axios from 'axios';
const BASE_URL=import.meta.env.VITE_BASE_URL+"Actividades"

class ActividadesApi{
    //Definición para Llamar al API y obtener el listado de peliculas
    getActividades(){
        return axios.get(BASE_URL);
    }
    getActividadById(ActividadId){
        return axios.get(BASE_URL + '/' + ActividadId);
    }
    createActividades(plan){
        return axios.post(BASE_URL, plan);
    }

    updateActividades(plan){
        return axios.put(BASE_URL, plan);
    }

    DatosTablaGrupal(fechas){
        return axios.post(BASE_URL+'/DatosTabla/',fechas)
    }

}

export default new ActividadesApi();