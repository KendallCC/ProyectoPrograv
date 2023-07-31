import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea, CardMedia, Box, Collapse } from "@mui/material";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import esLocale from "date-fns/locale/es";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventIcon from "@mui/icons-material/Event";

import Loader from "../others/Loader";
import ActividadesApi from "../../Services/ActividadesApi";

const DetalleActividadAdmin = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [expandClientes, setExpandClientes] = useState(false);
  const routeParams = useParams();

  useEffect(() => {
    ActividadesApi.getActividadById(routeParams.id)
      .then((response) => {
        setData(response.data.results);
        console.log(response.data.results.Clientes_Inscritos[0]);
        setError(response.error);
        setLoaded(true);
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          throw new Error("Respuesta no válida del servidor");
        }
      });
  }, [routeParams.id]);

  const formatDate = (dateString) => {
    const formattedDate = format(new Date(dateString), "EEEE d 'de' MMMM 'de' y", { locale: esLocale });
    return formattedDate;
  };

  const toggleClientes = () => {
    setExpandClientes(!expandClientes);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      {!loaded && <Loader />}
      {data ? (
        <Card sx={{ width: 400 }}>
          <CardActionArea>
            <CardMedia
              component="img"
              src={`data:image/jpeg;base64,${data.imagen_servicio}`}
              style={{
                width: "250px",
                height: "auto",
                objectFit: "cover",
                maxHeight: 300,
                margin: "0 auto",
              }}
            />
            <CardContent>
              <Typography variant="h5" component="div" textAlign="center">
                <strong>{data.nombre_servicio}</strong>
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                gutterBottom
                textAlign="center"
              >
                <EventIcon fontSize="small" />{" "}
                <strong>{formatDate(''+data.fecha)}</strong>
                
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                gutterBottom
                textAlign="center"
              >
                <AccessTimeIcon fontSize="small" />{" "}
                <strong>Horario de la actividad:</strong> {data.hora_inicio} -{" "}
                {data.hora_fin}
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                gutterBottom
                textAlign="center"
              >
                <strong>Cupos en la actividad:</strong> {data.cupo}
              </Typography>

              {data.Clientes_Inscritos.length === 0 ? (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  gutterBottom
                  textAlign="center"
                >
                  <strong>No hay clientes registrados</strong>
                </Typography>
              ) : (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  gutterBottom
                  textAlign="center"
                  style={{ cursor: "pointer" }}
                  onClick={toggleClientes}
                >
                  <strong>Ver Clientes Inscritos</strong>
                </Typography>
              )}

              <Collapse in={expandClientes} timeout="auto" unmountOnExit>
                <Box textAlign="center">
                  {data.Clientes_Inscritos.length === 0 ? (
                    <Typography variant="body1" color="text.secondary">
                      No hay clientes registrados
                    </Typography>
                  ) : (
                    data.Clientes_Inscritos.map((cliente, index) => (
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        key={index}
                      >
                        {`${index + 1} - ${cliente.nombre_completo}`}
                      </Typography>
                    ))
                  )}
                </Box>
              </Collapse>
            </CardContent>
          </CardActionArea>
        </Card>
      ) : (
        <Typography variant="body1" color="text.secondary" gutterBottom textAlign="center">
          <strong>No hay datos disponibles</strong>
        </Typography>
      )}
    </Box>
  );
};

export default DetalleActividadAdmin;
