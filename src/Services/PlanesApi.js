import axios from 'axios';
const BASE_URL=import.meta.env.VITE_BASE_URL+'plan'

class ListadoPlanes{
    //Definición para Llamar al API y obtener el listado de peliculas
    getPlanes(){
        return axios.get(BASE_URL);
    }
    //obtener por medio de ID
 getPlanById(PlanId){
        return axios.get(BASE_URL + '/' + PlanId);
    }

    createPlan(plan){
        return axios.post(BASE_URL, plan);
    }

    updatePlan(plan){
        return axios.put(BASE_URL, plan);
    }

}

export default new ListadoPlanes()