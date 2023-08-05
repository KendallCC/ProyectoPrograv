import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import PhoneIcon from "@mui/icons-material/Phone";
import MailIcon from "@mui/icons-material/Mail";
import StarIcon from "@mui/icons-material/Star";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import WcIcon from "@mui/icons-material/Wc";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useParams } from 'react-router-dom';
import ClientesApi from "../../services/ClientesApi";
import PlanesApi from "../../services/PlanesApi";

const DetallePerfilCliente = () => {
    const { id } = useParams(); // Obtener el ID del plan desde los parámetros de la URL
  const clienteId = id;
  const [cliente, setCliente] = useState({});
  const [plan, setPlan] = useState({});
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await ClientesApi.getEclientesId(clienteId);
        setCliente(response.data.results);

        if (response.data.results.planes[0] != null) {
          const planId = response.data.results.planes[0].plan_id;
          const planResponse = await PlanesApi.getPlanById(planId);
          setPlan(planResponse.data.results);
          setServiciosSeleccionados(planResponse.data.results.servicios); // Update selected services
        } else {
          setPlan({});
          setServiciosSeleccionados([]); // No plan, no services
        }
      } catch (error) {
        console.error("Error fetching client details:", error);
      }
    };

    fetchCliente();
  }, [clienteId]);

  const handlePlanClick = (event, planId) => {
    setMenuAnchorEl(event.currentTarget);
    if (planId === plan.id) {
      setServiciosSeleccionados(plan.servicios);
    } else {
      setServiciosSeleccionados([]);
    }
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <Paper elevation={3} style={{ padding: "20px", margin: "20px", textAlign: "center" }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5">Detalles del Perfil</Typography>
        </Grid>
        <Grid item xs={6}>
          <List>
            <ListItem>
              <ListItemIcon>
                <AssignmentIndIcon />
              </ListItemIcon>
              <ListItemText
                primary="Identificación"
                secondary={cliente.identificacion}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Nombre" secondary={cliente.nombre} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Apellidos" secondary={cliente.apellidos} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <WcIcon />
              </ListItemIcon>
              <ListItemText primary="Sexo" secondary={cliente.sexo == 'M' ?   "Masculino":'Femenino'} />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={6}>
          <List>
            <ListItem>
              <ListItemIcon>
                <CalendarTodayIcon />
              </ListItemIcon>
              <ListItemText
                primary="Fecha de Nacimiento"
                secondary={cliente.fecha_nacimiento}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PhoneIcon />
              </ListItemIcon>
              <ListItemText primary="Teléfono" secondary={cliente.telefono} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <EventIcon />
              </ListItemIcon>
              <ListItemText
                primary="Fecha de Inscripción"
                secondary={cliente.fecha_inscripcion}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Estado" secondary={cliente.estado} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <MailIcon />
              </ListItemIcon>
              <ListItemText
                primary="Correo Electrónico"
                secondary={cliente.correo_electronico}
              />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">
            Plan Actual
          </Typography>
          {plan.nombre ? (
            <Box
              style={{
                margin: "20px",
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "10px",
                background: "#f5f5f5",
              }}
            >
              <Typography variant="h5">{plan.nombre}</Typography>
              <Typography>{plan.descripcion}</Typography>
              <Typography>
                <strong>₡{plan.precio} </strong>
              </Typography>
            </Box>
          ) : (
            <Typography variant="subtitle1">
              No posee planes contratados
            </Typography>
          )}
        </Grid>
        <Grid item xs={12} >
          <Typography variant="h6">
            Servicios del Plan Actual
          </Typography>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {serviciosSeleccionados.length > 0 ? (
              <List>
                {serviciosSeleccionados.map((servicio) => (
                  <ListItem key={servicio} sx={{ textAlign: 'center' }}>
                    <ListItemIcon>
                      <StarIcon />
                    </ListItemIcon>
                    <ListItemText primary={servicio} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="subtitle1">
                No hay servicios seleccionados
              </Typography>
            )}
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default DetallePerfilCliente;
