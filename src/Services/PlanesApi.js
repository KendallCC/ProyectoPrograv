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

    ContratarPlan(contratacion){
        return axios.post(BASE_URL+ '/ContratarPlan/' , contratacion);
    }

    getPlanesClientebyidCliente(idcliente){
        return axios.post(BASE_URL+ '/reservasCliente/' , idcliente)
    }

    ActualizarReservaplan(planid){
        return axios.post(BASE_URL+ '/ActualizarReservaPlan/' , planid)
    }

    obtenerplanesServiciosporClienteid(cliente){
        return axios.post(BASE_URL+ '/planesServiciosporidCliente/' , cliente)
    }

    obtenerHistorialPLanes(){
        return axios.post(BASE_URL+ '/HistorialPlanes/')
    }
//TODO HistorialPlanes  


}

export default new ListadoPlanes()