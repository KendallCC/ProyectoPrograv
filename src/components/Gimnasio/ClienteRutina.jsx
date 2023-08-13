import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, MenuItem, Paper, Select, Typography } from "@mui/material";
import { toast } from "react-hot-toast";
import * as yup from "yup";
import RutinasApi from "../../Services/RutinasApi";
import ClientesApi from "../../Services/ClientesApi";
import HistorialRutinasApi from "../../Services/HistorialRutinas";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from 'react-router-dom'
const schema = yup.object().shape({
  actividadId: yup.string().required("Seleccione una actividad"),
  clienteId: yup.string().required("Seleccione un cliente"),
});

const ReservarRutina = () => {
  const { handleSubmit, control, formState, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const [actividades, setActividades] = useState([{ id: "", nombre: "Seleccione una opción" }]);
  const [clientes, setClientes] = useState([{ id: "", nombre: "Seleccione una opción" }]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchRutinas = async () => {
      try {
        const response = await RutinasApi.getRutinas();
        setActividades([{ id: "", nombre: "Seleccione una opción" }, ...response.data.results]);
      } catch (error) {
        console.error("Error al obtener las actividades:", error);
      }
    };

    const fetchClientes = async () => {
      try {
        const response = await ClientesApi.getclientes();
        setClientes([{ id: "", nombre: "Seleccione una opción" }, ...response.data.results]);
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
      }
    };

    fetchRutinas();
    fetchClientes();
  }, []);

  const onSubmit = async (data) => {
    try {
      const nuevaRutina = {
        id_rutina: data.actividadId,
        id_cliente: data.clienteId
      };

      await HistorialRutinasApi.createHistorialRutina(nuevaRutina);
      console.log(nuevaRutina);
      toast.success("Reserva de rutina realizada exitosamente");
      navigate('/Rutina/reservadas')
      reset(); // Limpiar el formulario


    } catch (error) {
      console.error("Error al crear la reserva de rutina:", error);
      toast.error("Ha ocurrido un error al realizar la reserva");
    }
  };

  return (
    <Paper elevation={3} style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <Typography variant="h6">Reservar Rutina</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="actividadId"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <div>
              <Typography variant="subtitle1">Seleccionar Rutina:</Typography>
              <Select {...field} label="Actividad" fullWidth required>
                {actividades.map((actividad) => (
                  <MenuItem key={actividad.id} value={actividad.id}>
                    {actividad.nombre}
                  </MenuItem>
                ))}
              </Select>
            </div>
          )}
        />
        <Controller
          name="clienteId"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <div>
              <Typography variant="subtitle1">Seleccionar Cliente:</Typography>
              <Select {...field} label="Cliente" fullWidth required>
                {clientes.map((cliente) => (
                  <MenuItem key={cliente.id} value={cliente.id}>
                    {cliente.nombre}
                  </MenuItem>
                ))}
              </Select>
            </div>
          )}
        />
        <Button type="submit" variant="contained" color="primary" disabled={formState.isSubmitting}>
          Reservar
        </Button>
      </form>
    </Paper>
  );
};

export default ReservarRutina;
