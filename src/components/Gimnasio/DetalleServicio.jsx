// DetalleServicio.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import serviciosApi from '../../Services/serviciosApi';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

const DetalleServicio = () => {
  const { id } = useParams();
  const [servicio, setServicio] = useState(null);

  useEffect(() => {
    const fetchServicio = async () => {
      const servicioData = await serviciosApi.getPServiciosById(id);
      console.log(servicioData);
      setServicio(servicioData.data.results[0]);
    };

    fetchServicio();
  }, [id]);

  if (!servicio) {
    return <CircularProgress />;
  }

  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Card sx={{ maxWidth: 400 }}>
        <CardMedia
          component="img"
          height="350"
          image={`data:image/jpeg;base64,${servicio.imagen_servicio}`}
          alt="Imagen del Servicio"
        />
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{textAlign:'center'}}>
            Detalle del Servicio
          </Typography>
          <Typography variant="body1" gutterBottom>
           <strong>Nombre:</strong>  {servicio.nombre}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Descripción:</strong> {servicio.descripcion}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Tipo:</strong> {servicio.tipo}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DetalleServicio;
