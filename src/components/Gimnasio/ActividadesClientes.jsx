import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea, Grid, Box, Button } from "@mui/material";
import { useState, useEffect } from "react";
import Loader from "../others/Loader";
import ActividadesApi from "../../Services/ActividadesApi";
import { format, parseISO, isAfter, isSameDay, isBefore } from "date-fns";
import { es } from "date-fns/locale"; // Importa el idioma español para las fechas

const ActividadesClientes = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    ActividadesApi.getActividades()
      .then((response) => {
        console.log(response.data);
        setData(response.data);
        setError(response.error);
        setLoaded(true);
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          console.log(error);
          throw new Error("Respuesta no válida del servidor");
        }
      });
  }, []);

  const fechaHoraActual = new Date();

  return (
    <>
      {!loaded && <Loader />}
      {data && (
        <Grid container spacing={4} sx={{ display: "flex", flexWrap: "wrap" }}>
          {data.results
            .filter(
              (item) =>
                (isAfter(
                  parseISO(item.fecha + "T" + item.hora_inicio),
                  fechaHoraActual
                ) ||
                  (isSameDay(
                    parseISO(item.fecha + "T" + item.hora_inicio),
                    fechaHoraActual
                  ) &&
                    isBefore(
                      parseISO(item.fecha + "T" + item.hora_inicio),
                      fechaHoraActual
                    ))) &&
                item.Clientes_Inscritos < item.cupo
            )
            .map((item) => (
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
                        src={`data:image/jpeg;base64,${item.imagen_servicio}`} // Reemplaza "item.imagen_servicio" por la URL de la imagen del logo
                        alt={item.nombre_servicio}
                        style={{ width: 50, height: 50, marginRight: 8 }}
                      />
                      <Typography
                        variant="h6"
                        color="text.primary"
                        textAlign="left"
                      >
                        {item.nombre_servicio}
                      </Typography>
                    </Box>
                    <CardContent>
                      <Typography variant="body1" component="div">
                        <strong>Fecha de la Actividad:</strong>{" "}
                        {format(
                          parseISO(item.fecha),
                          "EEEE d 'de' MMMM 'de' yyyy",
                          { locale: es }
                        )}
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
                        <strong>Cupos Registrados:</strong> {item.Clientes_Inscritos}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <Box sx={{ display: "flex", justifyContent: "center", marginTop: "auto", padding: 2 }}>
                    <Button variant="contained" color="primary">
                      Reservar
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
        </Grid>
      )}
    </>
  );
};

export default ActividadesClientes;
