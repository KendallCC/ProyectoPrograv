import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, IconButton, Paper, Typography } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { toast } from 'react-hot-toast';
import HistorialRutinasApi from "../../Services/HistorialRutinas";
import { useNavigate } from 'react-router-dom'
const ActualizarReservaRutina = () => {
  const { Rutinaid } = useParams();
  const [rutina, setRutina] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchRutina = async () => {
      try {
        const response = await HistorialRutinasApi.getHistorialRutinaById(Rutinaid);
        const rutinaData = response.data.results[0];
        setRutina(rutinaData);
      } catch (error) {
        console.error("Error al obtener la rutina:", error);
      }
    };

    fetchRutina();
  }, [Rutinaid]);

  const handleActualizarRutina = async () => {
    try {
      // Determinar el nuevo estado
      const nuevoEstado = rutina.estado === "Activo" ? "Inactivo" : "Activo";

      // Llamada al API para actualizar la rutina con el nuevo estado
      await HistorialRutinasApi.updateHistorialRutina({ id: Rutinaid, estado: nuevoEstado });

      // Mostrar notificación de éxito
      toast.success(`Rutina actualizada a ${nuevoEstado} correctamente`);
      navigate('/Rutina/reservadas')
      // Actualizar el estado local con el nuevo estado
      setRutina(prevRutina => ({ ...prevRutina, estado: nuevoEstado }));
    } catch (error) {
      console.error("Error al actualizar la rutina:", error);
      // Mostrar notificación de error
      toast.error("Ha ocurrido un error al actualizar la rutina");
    }
  };

  return (
    <Paper elevation={3} style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      {rutina ? (
        <div>
          <Typography variant="h6">Detalles de la Reserva de Rutina</Typography>
          <Typography>Nombre de la Rutina: {rutina.nombre_rutina}</Typography>
          <Typography>Nombre del Cliente: {rutina.nombre_cliente}</Typography>
          <Typography>Estado: {rutina.estado}</Typography>
          <IconButton onClick={handleActualizarRutina}>
            <EditIcon />
          </IconButton>
          <Button variant="contained" color="primary" onClick={handleActualizarRutina}>
            {rutina.estado === "Activo" ? "Desactivar Rutina" : "Activar Rutina"}
          </Button>
        </div>
      ) : (
        <Typography>Cargando la información de la rutina...</Typography>
      )}
    </Paper>
  );
};

export default ActualizarReservaRutina;
