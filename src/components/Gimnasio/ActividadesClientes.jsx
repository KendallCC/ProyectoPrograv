import React, { useState, useEffect, useContext } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea, Grid, Box, Button } from "@mui/material";
import { format, parseISO, isAfter, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import ActividadesApi from "../../Services/ActividadesApi";
import ActividadesReservasApi from "../../Services/ActividadesReservasApi";
import { UserContext } from '../../context/UserContext';
import { toast } from "react-hot-toast";
import Loader from "../others/Loader";
const ActividadesClientes = () => {
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const { decodeToken } = useContext(UserContext);
  const [userData, setUserData] = useState(decodeToken());

  useEffect(() => {
    ActividadesApi.getActividades()
      .then((response) => {
        console.log(response.data.results);
        const filteredData = response.data.results.filter(item =>
          isAfter(parseISO(item.fecha + "T" + item.hora_inicio), new Date()) &&
          (isSameDay(parseISO(item.fecha), new Date()) || isAfter(parseISO(item.fecha), new Date())) &&
          !item.Clientes_Inscritos.includes(userData.id)&&
          item.Clientes_Inscritos.length < item.cupo 
        );
        setData(filteredData);
        setLoaded(true);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userData]);

  const handleReserva = (actividadId) => {
    const reservaData = {
      actividad_id: actividadId,
      cliente_id: userData.id,
    };

    ActividadesReservasApi.createReservas(reservaData)
      .then((response) => {
        console.log("Reserva realizada:", response.data);
        // Actualizar el estado para que no se muestre la actividad reservada
        const updatedData = data.filter(item => item.id !== actividadId);
        setData(updatedData);
        // Agregar lógica para manejar la reserva exitosa si es necesario
        toast.success('Se a registrado con exito en la actividad')
      })
      .catch((error) => {
        console.error("Error al realizar la reserva:", error);
      });
  };

  return (
    <>
      {loaded ? (
        <Grid container spacing={4} sx={{ display: "flex", flexWrap: "wrap" }}>
          {data.map((item) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={item.id}
              sx={{ flexBasis: "100%", flexGrow: 1 }}
            >
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  maxWidth: 500,
                  maxHeight: 400,
                  margin: 2,
                }}
              >
                <CardActionArea>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 2,
                    }}
                  >
                    <img
                      src={`data:image/jpeg;base64,${item.imagen_servicio}`}
                      alt={item.servicio_nombre}
                      style={{ width: 50, height: 50, marginRight: 8 }}
                    />
                    <Typography
                      variant="h6"
                      color="text.primary"
                      textAlign="left"
                    >
                      {item.servicio_nombre}
                    </Typography>
                  </Box>
                  <CardContent>
                    <Typography variant="body1" component="div">
                      <strong>Fecha de la Actividad:</strong>{" "}
                      {format(parseISO(item.fecha), "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
                    </Typography>
                    <Typography variant="body1" component="div">
                      <strong>Hora de inicio:</strong> {item.hora_inicio}
                    </Typography>
                    <Typography variant="body1" component="div">
                      <strong>Hora de Fin:</strong> {item.hora_fin}
                    </Typography>
                    <Typography variant="body1" component="div">
                      <strong>Cupos en la actividad:</strong> {item.cupo}
                    </Typography>
                    <Typography variant="body1" component="div">
                      <strong>Cupos Registrados:</strong> {item.Clientes_Inscritos.length}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <Box sx={{ display: "flex", justifyContent: "center", marginTop: "auto", padding: 2 }}>
                  <Button variant="contained" color="primary" onClick={() => handleReserva(item.id)}>
                    Reservar
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Loader/>
      )}
    </>
  );
};

export default ActividadesClientes;
