import React from "react";
import { useState, useEffect } from "react";
import PlanesApi from "../../Services/PlanesApi";
import { useParams } from "react-router-dom";
import Loader from "../others/Loader";
import { Box, Card, CardContent, Typography } from "@mui/material";

//del menu desplegable
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";

//del boton de contrato
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

export function DetallePlan() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  //servicios
  const [servicios, setServicios] = useState([]);

  //del menu
  const [open, setOpen] = React.useState(true);
  const handleClick = () => {
    setOpen(!open);
  };

  const routeParams = useParams();

  useEffect(() => {
    PlanesApi.getPlanById(routeParams.id)
      .then((response) => {
        console.log(response.data.results);
        setData(response.data.results);
        setError(response.error);
        setLoaded(true);
        setServicios(response.data.results.servicios);
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          console.log(error);
          throw new Error("Respuesta no válida del servidor");
        }
      });
  }, [routeParams.id]);

  return (
    <>
      {!loaded && <Loader />}
      {data && (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card sx={{ maxWidth: 900 }}>
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Typography gutterBottom variant="h2" component="div">
                Plan: {data.nombre}
              </Typography>

              <Typography variant="h4" color="text.secondary">
                {data.descripcion}
              </Typography>
              <Typography
                variant="h3"
                color="text.secondary"
                sx={{ marginTop: "2rem" }}
              >
                Precio: ₡{data.precio}
              </Typography>

              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                }}
                component="nav"
                aria-labelledby="nested-list-subheader"
              >
                <ListItemButton onClick={handleClick}>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary="Servicios" />
                  {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {servicios.map((servicio, index) => (
                      <ListItemButton key={index} sx={{ pl: 4 }}>
                        <ListItemIcon>
                          <StarBorder />
                        </ListItemIcon>
                        <ListItemText primary={servicio} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </List>

              <Stack direction="row" spacing={4} sx={{ marginTop: "2rem" }}>
                <Button variant="contained" color="secondary">
                  Contratar Plan
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      )}
    </>
  );
}
