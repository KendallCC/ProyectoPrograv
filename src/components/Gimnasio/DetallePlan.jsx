import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from "@mui/material";
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
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import PlanesApi from "../../Services/PlanesApi";
import { UserContext } from "../../context/UserContext";
import Loader from "../others/Loader";

export function DetallePlan() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const routeParams = useParams();
  const navigate = useNavigate();
  const { decodeToken } = React.useContext(UserContext);
  const [userData, setUserData] = useState(decodeToken());

  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    PlanesApi.getPlanById(routeParams.id)
      .then((response) => {
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

  const handleOpenModal = () => {
    PlanesApi.getPlanesClientebyidCliente(userData.id)
      .then((response) => {
        console.log(response);
        const activePlan = response.data.results.find(plan => plan.estado_Plan === "Activo");
        console.log('Active plan:',activePlan);
        if (activePlan) {
          toast.error("Primero debe desuscribirse de su plan actual.");
        } else {
          setOpenModal(true);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          // Si el error es debido a que no se encontraron planes activos, permite la contratación
          setOpenModal(true);
        } else {
          console.log(error);
          toast.error("Ocurrió un error al verificar el plan actual del usuario.");
        }
      });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleConfirmContratacion = () => {
    setOpenModal(false);

    const fechaActual = new Date();
    fechaActual.setDate(fechaActual.getDate() + 30);
    const año = fechaActual.getFullYear();
    const mes = ("0" + (fechaActual.getMonth() + 1)).slice(-2);
    const dia = ("0" + fechaActual.getDate()).slice(-2);
    const fechaEn30Dias = `${año}-${mes}-${dia}`;

    const Contratacion = {
      cliente_id: userData.id,
      plan_id: routeParams.id,
      fecha_vigencia: fechaEn30Dias,
      estado_Plan: "Activo",
    };

    PlanesApi.ContratarPlan(Contratacion)
      .then((respuesta) => {
        console.log(respuesta);
        toast.success("Plan contratado exitosamente!");
        setUserData((prevUserData) => ({
          ...prevUserData,
          plan_id: routeParams.id,
        }));
      })
      .catch((error) => {
        console.log(error);
        toast.error("Ocurrió un error al contratar el plan.");
      });
  };

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
                <ListItemButton onClick={() => setOpen(!open)}>
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
              {userData ? (
                <Stack direction="row" spacing={4} sx={{ marginTop: "2rem" }}>
                  {userData.plan_id ? (
                    <Typography variant="body1">
                      Ya tiene un plan activo. No puede contratar otro plan.
                    </Typography>
                  ) : (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleOpenModal}
                    >
                      Contratar Plan
                    </Button>
                  )}
                </Stack>
              ) : (
                <Stack direction="row" spacing={4} sx={{ marginTop: "2rem" }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      navigate("/Registro");
                    }}
                  >
                    Registrate
                  </Button>
                </Stack>
              )}

              <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Confirmar Contratación</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    ¿Está seguro que desea contratar este plan?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseModal} color="primary">
                    Cancelar
                  </Button>
                  <Button onClick={handleConfirmContratacion} color="primary">
                    Confirmar
                  </Button>
                </DialogActions>
              </Dialog>
            </CardContent>
          </Card>
        </Box>
      )}
    </>
  );
}
