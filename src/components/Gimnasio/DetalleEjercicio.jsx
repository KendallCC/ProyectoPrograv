import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import EjerciciosApi from '../../Services/EjerciciosApi';

const EjercicioDetalle = () => {
  const { id } = useParams();
  const [ejercicio, setEjercicio] = useState(null);

  useEffect(() => {
    const fetchEjercicio = async () => {
      try {
        const response = await EjerciciosApi.getEjercicioById(id);
        setEjercicio(response.data.results);
        console.log(response.data.results);
      } catch (error) {
        console.error('Error fetching ejercicio:', error);
      }
    };

    fetchEjercicio();
  }, [id]);

  if (!ejercicio) {
    return <Typography variant="h5">Cargando...</Typography>;
  }

  return (
    <Card sx={{ maxWidth: 700, margin: 'auto', marginTop: 4 , textAlign: 'center' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{fontWeight:'bolder'}}>
          {ejercicio.nombre}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {ejercicio.descripcion}
        </Typography>
        {ejercicio.imagenes_ejercicio.map((imagen, index) => (
            
          <CardMedia key={index} component="img" height="350" src={`data:image/jpeg;base64,${imagen.imagen_ejercicio}`} alt={`Imagen ${index + 1}`} sx={{border:'solid '}}/>
        ))}
      </CardContent>
    </Card>
  );
};

export default EjercicioDetalle;
