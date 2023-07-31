import axios from 'axios';
const BASE_URL=import.meta.env.VITE_BASE_URL+"rutinas"

class RutinasApi{
    //Definición para Llamar al API y obtener el listado de peliculas
    getRutinas(){
        return axios.get(BASE_URL);
    }
    getRutinaById(Rutinaid){
        return axios.get(BASE_URL + '/' + Rutinaid);
    }
    createRutina(Rutina){
        return axios.post(BASE_URL, Rutina);
    }

    updateRutina(Rutina){
        return axios.put(BASE_URL, Rutina);
    }
}

export default new RutinasApi()