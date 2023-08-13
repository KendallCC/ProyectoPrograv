import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Divider, Paper } from "@mui/material";
import HistorialRutinasApi from "../../Services/HistorialRutinas";

const DetalleReservaCliente = () => {
  const { id } = useParams();
  const [rutinas, setRutinas] = useState([]);

  useEffect(() => {
    const fetchRutinas = async () => {
      try {
        const response = await HistorialRutinasApi.getHistorialRutinaByCliente(id);
        setRutinas(response.data.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchRutinas();
  }, [id]);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Historial de Rutinas del Cliente
      </Typography>
      <Divider />
      {rutinas.map((rutina) => (
        <Paper key={rutina.id_rutina} elevation={3} style={{ margin: "16px 0", padding: "16px" }}>
          <Typography variant="h6">{rutina.nombre_rutina}</Typography>
          <Typography variant="body1">Estado: {rutina.estado}</Typography>
          <Typography variant="body2">ID de Rutina: {rutina.id_rutina}</Typography>
          <Typography variant="body2">Nombre del Cliente: {rutina.nombre_cliente}</Typography>
          <Typography variant="body2">ID de Cliente: {rutina.id_cliente}</Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default DetalleReservaCliente;
