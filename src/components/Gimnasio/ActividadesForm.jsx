import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { toast } from 'react-hot-toast';
import ServiciosApi from '../../Services/serviciosApi';
import ActividadesApi from '../../Services/ActividadesApi';
import Loader from '../others/Loader';

const schema = yup.object().shape({
  servicio_id: yup.number().required('Seleccione un servicio'),
  fecha: yup.date().required('La fecha es requerida').min(new Date(), 'La fecha no puede ser anterior a la fecha actual'),
  hora_inicio: yup.string().required('La hora de inicio es requerida'),
  hora_fin: yup.string().required('La hora de fin es requerida').test('hora', 'La hora de inicio debe ser menor que la hora de fin', function (value) {
    const { hora_inicio } = this.parent;
    return new Date(`01/01/2000 ${hora_inicio}`) < new Date(`01/01/2000 ${value}`);
  }),
  cupo: yup.number().required('El cupo es requerido').positive().integer(),
});

const CrearActividadGrupalForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [servicio_id, setServicioId] = useState('');

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await ServiciosApi.getServicios();
        setServicios(response.data.results);
      } catch (error) {
        console.error('Error al obtener los servicios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServicios();
  }, []);

  const onSubmit = async (data) => {
    try {
      await ActividadesApi.createActividades(data);
      toast.success('La actividad grupal ha sido creada exitosamente.');
      setServicioId('');
    } catch (error) {
      console.error('Error al crear la actividad grupal:', error);
      toast.error('Error al crear la actividad grupal.');
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxWidth: '400px',
            margin: 'auto',
            padding: '24px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="h5" align="center" sx={{ marginBottom: '16px' }}>
            Crear Actividad
          </Typography>
          <FormControl error={!!errors.servicio_id}>
            <InputLabel id="servicio-label">Servicio</InputLabel>
            <Select
              labelId="servicio-label"
              id="servicio_id"
              {...register('servicio_id')}
              value={servicio_id}
              onChange={(event) => setServicioId(event.target.value)}
              error={!!errors.servicio_id}
              label="Servicio"
            >
              {servicios.map((servicio) => (
                <MenuItem key={servicio.id} value={servicio.id}>
                  {servicio.nombre}
                </MenuItem>
              ))}
            </Select>
            {!!errors.servicio_id && (
              <Typography variant="body2" color="error">
                {errors.servicio_id.message}
              </Typography>
            )}
          </FormControl>
          <TextField
            label="Fecha"
            type="date"
            {...register('fecha')}
            error={!!errors.fecha}
            helperText={errors.fecha?.message}
          />
          <TextField
            label="Hora de inicio"
            type="time"
            {...register('hora_inicio')}
            error={!!errors.hora_inicio}
            helperText={errors.hora_inicio?.message}
          />
          <TextField
            label="Hora de fin"
            type="time"
            {...register('hora_fin')}
            error={!!errors.hora_fin}
            helperText={errors.hora_fin?.message}
          />
          <TextField
            label="Cupo"
            type="number"
            {...register('cupo')}
            error={!!errors.cupo}
            helperText={errors.cupo?.message}
          />
          <Button type="submit" variant="contained" color="primary">
            Crear actividad grupal
          </Button>
        </Box>
      )}
    </>
  );
};

export default CrearActividadGrupalForm;
