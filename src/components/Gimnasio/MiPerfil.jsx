import React, { useContext, useState, useEffect } from "react";
import {
  Typography,
  Box,
  TextField,
  Grid,
  Divider,
  Paper,
} from "@mui/material";
import ClientesApi from "../../Services/ClientesApi";
import { UserContext } from '../../context/UserContext'

const Miperfil = () => {
  const { user, decodeToken, autorize } = useContext(UserContext);
  const [userData, setUserData] = useState(decodeToken());
  const [clienteData, setClienteData] = useState({});

  useEffect(() => {
    const clienteid = userData.id;
console.log(userData);
    
      ClientesApi.getEclientesId(clienteid)
        .then((response) => {
          setClienteData(response.data.results);
        })
        .catch((error) => {
          console.error("Error fetching cliente data:", error);
        });
    
  }, [userData.id, autorize]);

  return (
    <Box>
      <Typography variant="h4">Detalles del Cliente</Typography>
      <Divider />
      <Paper elevation={3} style={{ padding: "20px" }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Identificación"
              fullWidth
              disabled
              value={clienteData.identificacion || ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre"
              fullWidth
              disabled
              value={clienteData.nombre || ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Apellidos"
              fullWidth
              disabled
              value={clienteData.apellidos || ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Género"
              fullWidth
              disabled
              value={clienteData.sexo === "M" ? "Masculino" : "Femenino"}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Fecha de Nacimiento"
              fullWidth
              type="date"
              disabled
              value={clienteData.fecha_nacimiento || ""}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Teléfono"
              fullWidth
              disabled
              value={clienteData.telefono || ""}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Miperfil;
