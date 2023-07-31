import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  id: yup.number().required('El ID es requerido'), // Agrega la validación para el ID
  servicio_id: yup.number().required('Seleccione un servicio'),
  fecha: yup.date().required('La fecha es requerida').min(new Date(), 'La fecha no puede ser anterior a la fecha actual'),
  hora_inicio: yup.string().required('La hora de inicio es requerida'),
  hora_fin: yup.string().required('La hora de fin es requerida').test('hora', 'La hora de inicio debe ser menor que la hora de fin', function (value) {
    const { hora_inicio } = this.parent;
    return new Date(`01/01/2000 ${hora_inicio}`) < new Date(`01/01/2000 ${value}`);
  }),
  cupo: yup.number().required('El cupo es requerido').positive().integer(),
});

const ActualizarActividadForm = () => {
  const { id } = useParams(); // Obtiene el parámetro de la ruta para el ID de la actividad
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [servicio_id, setServicioId] = useState('');
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await ServiciosApi.getServicios();
        console.log(response);
        setServicios(response.data.results);
      } catch (error) {
        console.error('Error al obtener los servicios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServicios();
  }, []);
 
  useEffect(() => {
    const fetchActividad = async () => {
      try {
        const response = await ActividadesApi.getActividadById(id);
        const actividad = response.data; // Suponiendo que la respuesta de la API devuelve un objeto con los datos de la actividad
        const actividadEdit=actividad.results;
     
        setServicioId(actividadEdit.servicio_id)
        setValue('id', actividadEdit.id); // Asigna el ID al campo correspondiente
        setValue('servicio_id', actividadEdit.servicio_id);
        setValue('fecha', actividadEdit.fecha);
        setValue('hora_inicio', actividadEdit.hora_inicio);
        setValue('hora_fin', actividadEdit.hora_fin);
        setValue('cupo', actividadEdit.cupo);
        //setValue('clientes_inscritos', actividadEdit.Clientes_Inscritos);
      } catch (error) {
        console.error('Error al obtener la actividad:', error);
      }
    };

    fetchActividad();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      await ActividadesApi.updateActividades(data);
      toast.success('La actividad grupal ha sido actualizada exitosamente.');
    } catch (error) {
      console.error('Error al actualizar la actividad grupal:', error);
      toast.error('Error al actualizar la actividad grupal.');
    }
  };

  return (
    <>
      {loading ? (
       <Loader/>
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
            Actualizar Actividad
          </Typography>
          <TextField
            label="ID"
            disabled // Deshabilita el campo de entrada para el ID
            {...register('id')}
            error={!!errors.id}
            helperText={errors.id?.message}
            value={id}
          />
          <FormControl error={!!errors.servicio_id}>
            <InputLabel id="servicio-label">Servicio</InputLabel>
            <Select
              labelId="servicio-label"
              id="servicio_id"
              value={servicio_id}
              {...register('servicio_id')}
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
          {/* Eliminar el campo "Clientes Inscritos" */}
          <Button type="submit" variant="contained" color="primary">
            Actualizar actividad grupal
          </Button>
        </Box>
      )}
    </>
  );
};

export default ActualizarActividadForm;
