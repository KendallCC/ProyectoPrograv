import React, { useEffect, useState,useContext } from "react";
import { Typography, Container, Grid, Paper, Divider, IconButton } from "@mui/material";
import HistorialRutinasApi from "../../Services/HistorialRutinas";
import { UserContext } from "../../context/UserContext";
import { useNavigate, Link } from 'react-router-dom'
import AccessibilityIcon from '@mui/icons-material/Accessibility';
const RutinasAsignadas = () => {
  const [rutinas, setRutinas] = useState([]);
  const { user, decodeToken, autorize } = useContext(UserContext);
  const [userData, setUserData] = useState(decodeToken());
  const clienteId=userData.id
  useEffect(() => {
    const fetchRutinasByCliente = async () => {
      try {
        const response = await HistorialRutinasApi.getHistorialRutinaByCliente(clienteId);
        setRutinas(response.data.results);
        console.log(response.data.results);
      } catch (error) {
        console.error("Error al obtener las rutinas asignadas:", error);
      }
    };

    fetchRutinasByCliente();
  }, [clienteId]);

  return (
    <Container maxWidth="md" style={{ marginTop: "20px" }}>
      <Typography variant="h4">Rutinas Asignadas</Typography>
      <Divider style={{ margin: "10px 0" }} />
      <Grid container spacing={3}>
        {rutinas.map((rutina) => (
          <Grid item xs={12} md={6} key={rutina.id}>
            <Paper elevation={3} style={{ padding: "20px", textAlign: "center" }}>
              <Typography variant="h6">{rutina.nombre_rutina}</Typography>
              <IconButton component='a' href={`../DetalleRutina/${rutina.id_rutina}`}>
              <AccessibilityIcon />
              <Typography variant="h6"> Ver ejercicios de la rutina</Typography>
            </IconButton>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default RutinasAsignadas;
