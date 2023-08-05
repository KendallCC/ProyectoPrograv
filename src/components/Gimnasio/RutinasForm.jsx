import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import EjerciciosApi from '../../Services/EjerciciosApi';
import RutinasApi from '../../Services/RutinasApi';
import { useNavigate } from 'react-router-dom'

const schema = yup.object().shape({
  nombre: yup.string().required('El nombre es requerido'),
  tipo: yup.string().required('El tipo es requerido'),
});

const RutinaForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();
  const [ejercicios, setEjercicios] = useState([]);
  const [selectedEjercicioIds, setSelectedEjercicioIds] = useState([]);

  useEffect(() => {
    // Fetch the list of exercises from the API
    const fetchEjercicios = async () => {
      try {
        const response = await EjerciciosApi.getEjercicios();
        console.log(response);
        setEjercicios(response.data.results);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };

    fetchEjercicios();
  }, []);

  const handleEjercicioChange = (event) => {
    setSelectedEjercicioIds(event.target.value);
  };

  const onSubmit = async (data) => {
    try {
      // Format the data to have an array of objects containing ejercicio_id and repeticiones
      const ejerciciosData = selectedEjercicioIds.map((ejercicioId) => ({
        ejercicio_id: ejercicioId,
        repeticiones: data[`repeticiones_${ejercicioId}`],
      }));

      const formData = {
        nombre: data.nombre,
        tipo: data.tipo,
        ejercicios: ejerciciosData,
      };

      console.log(formData);
      await RutinasApi.createRutina(formData);

      toast.success('Rutina creada exitosamente');
      navigate('/listaRutinas')
    } catch (error) {
      console.error('Error creating routine:', error);
      toast.error('Hubo un error al crear la rutina');
    }
  };

  return (
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
      <TextField
        label="Nombre"
        {...register('nombre')}
        error={!!errors.nombre}
        helperText={errors.nombre?.message}
      />
      <TextField
        label="Tipo"
        {...register('tipo')}
        error={!!errors.tipo}
        helperText={errors.tipo?.message}
      />

      <FormControl fullWidth>
        <InputLabel id="ejercicio-select-label">Ejercicios</InputLabel>
        <Select
          labelId="ejercicio-select-label"
          multiple
          value={selectedEjercicioIds}
          onChange={handleEjercicioChange}
        >
          {ejercicios.map((ejercicio) => (
            <MenuItem key={ejercicio.id} value={ejercicio.id}>
              {ejercicio.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {ejercicios.map((ejercicio) =>
        selectedEjercicioIds.includes(ejercicio.id) ? (
          <Controller
            key={ejercicio.id}
            name={`repeticiones_${ejercicio.id}`}
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label={`Repeticiones para ${ejercicio.nombre}`}
              />
            )}
          />
        ) : null
      )}

      <Button type="submit" variant="contained" color="primary">
        Crear
      </Button>
    </Box>
  );
};

export default RutinaForm;
