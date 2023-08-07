import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, List, ListItem, ListItemText, Card, CardContent, CardHeader, Grid } from '@mui/material';
import ActividadesReservasApi from '../../Services/ActividadesReservasApi';
import Loader from '../others/Loader';
import { Event, Person, CheckCircle, Cancel } from '@mui/icons-material';

const DetalleActividadReservada = () => {
  const { id } = useParams();
  const [reserva, setReserva] = useState(null);

  useEffect(() => {
    ActividadesReservasApi.getReservaById(id)
      .then((response) => {
        setReserva(response.data.results);
      })
      .catch((error) => {
        console.error('Error al obtener los detalles de la reserva:', error);
      });
  }, [id]);

  if (!reserva) {
    return <Loader />;
  }

  return (
    <Card variant="outlined">
      <CardHeader title="Detalle de Reserva" />
      <CardContent>
        <List>
          <ListItem>
            <Grid container alignItems="center" spacing={1}>
              <Grid item>
                <Event />
              </Grid>
              <Grid item>
                <ListItemText primary="ID de Reserva" secondary={reserva.id} />
              </Grid>
            </Grid>
          </ListItem>
          <ListItem>
            <Grid container alignItems="center" spacing={1}>
              <Grid item>
                <Event />
              </Grid>
              <Grid item>
                <ListItemText primary="ID de Actividad Grupal" secondary={reserva.actividad_grupal_id} />
              </Grid>
            </Grid>
          </ListItem>
          <ListItem>
            <Grid container alignItems="center" spacing={1}>
              <Grid item>
                <Person />
              </Grid>
              <Grid item>
                <ListItemText primary="ID de Cliente" secondary={reserva.cliente_id} />
              </Grid>
            </Grid>
          </ListItem>
          <ListItem>
            <Grid container alignItems="center" spacing={1}>
              <Grid item>
                {reserva.estado === 'Activo' ? <CheckCircle /> : <Cancel />}
              </Grid>
              <Grid item>
                <ListItemText primary="Estado de Reserva" secondary={reserva.estado === 'Activo' ? 'Reservado' : 'Cancelado'} />
              </Grid>
            </Grid>
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

export default DetalleActividadReservada;
