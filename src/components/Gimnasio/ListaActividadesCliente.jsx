import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import ActividadesReservasApi from '../../Services/ActividadesReservasApi';
import { format, parseISO, isAfter, isSameDay, differenceInHours } from 'date-fns';
import { es } from 'date-fns/locale';
import { List, ListItem, ListItemText, ListItemSecondaryAction, Button, Typography, Grid, Box } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import Loader from '../others/Loader';

const ActividadesInscritas = () => {
  const { decodeToken } = useContext(UserContext);
  const [userData, setUserData] = useState(decodeToken());
  const [inscritoActividades, setInscritoActividades] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    ActividadesReservasApi.getClientInscritoActividades(userData.id)
      .then((response) => {
        const filteredActivities = response.data.results.filter(actividad =>
          isAfter(parseISO(actividad.fecha + 'T' + actividad.hora_inicio), new Date()) &&
          (isSameDay(parseISO(actividad.fecha), new Date()) || isAfter(parseISO(actividad.fecha), new Date())) &&
          differenceInHours(parseISO(actividad.fecha + 'T' + actividad.hora_inicio), new Date()) >= 12
        );
        setInscritoActividades(filteredActivities);
        setLoaded(true);
        console.log(filteredActivities);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userData]);

  const handleCancelarReserva = (actividadId) => {
    ActividadesReservasApi.updateEstadoReservas(actividadId)
      .then((response) => {
        setInscritoActividades(prevActivities =>
          prevActivities.map(actividad =>
            actividad.id === actividadId ? { ...actividad, estado: 'Cancelado' } : actividad
          )
        );
        // Agregar lógica para manejar la cancelación exitosa si es necesario
      })
      .catch((error) => {
        console.error('Error al cancelar la reserva:', error);
      });
  };

  return (
    <Box mt={4} p={3} textAlign="center">
      <Typography variant="h4" gutterBottom>
        Actividades Grupales Inscritas
      </Typography>
      {loaded ? (
        <Grid container spacing={2}>
          {inscritoActividades.map((actividad) => (
            <Grid item xs={12} md={3} key={actividad.id}>
              <ListItem
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}
              >
                <ListItemText
                  primary={actividad.servicio_nombre}
                  secondary={
                    <>
                      <strong>Fecha:</strong>{' '}
                      {format(parseISO(actividad.fecha), 'dd/MM/yyyy', { locale: es })}
                      <br />
                      <strong>Hora de Inicio:</strong> {actividad.hora_inicio}
                      <br />
                      <strong>Estado:</strong> {actividad.estado === 'Activo' ? 'Reservado' : 'Cancelado'}
                    </>
                  }
                />
                {actividad.estado === 'Activo' && (
                  <Button
                    variant="outlined"
                    onClick={() => handleCancelarReserva(actividad.id)}
                    startIcon={<CancelIcon />}
                  >
                    Cancelar
                  </Button>
                )}
              </ListItem>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Loader />
      )}
    </Box>
  );
};

export default ActividadesInscritas;
