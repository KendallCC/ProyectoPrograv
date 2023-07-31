import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useParams } from 'react-router-dom'; // Import useParams hook
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

const schema = yup.object().shape({
  nombre: yup.string().required('El nombre es requerido'),
  tipo: yup.string().required('El tipo es requerido'),
  // No need to add repeticiones to yup schema since we'll handle validation manually
});

const RutinaUpdateForm = () => {
  const { id } = useParams(); // Get the ID from the URL

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [rutina, setRutina] = useState(null); // State to store the fetched rutina
  const [ejercicios, setEjercicios] = useState([]);
  const [selectedEjercicios, setSelectedEjercicios] = useState([]);

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

  useEffect(() => {
    // Fetch the rutina data based on the ID from the URL
    const fetchRutina = async () => {
      try {
        const response = await RutinasApi.getRutinaById(id);
        console.log(response.data.results.ejercicios);
        setRutina(response.data.results);

        // Set the default selectedEjercicios based on the fetched rutina data
        setSelectedEjercicios(response.data.results.ejercicios);

        // Set the default values for repeticiones fields based on the fetched rutina data
        response.data.results.ejercicios.forEach((ejercicio) => {
          setValue(`repeticiones_${ejercicio.id}`, ejercicio.repeticiones);
        });

        // Trigger the validation for the ejercicios field initially
        trigger('ejercicios');
      } catch (error) {
        console.error('Error fetching rutina:', error);
      }
    };

    if (id) {
      fetchRutina();
    }
  }, [id, setValue, trigger]);

  const handleEjercicioChange = (event) => {
    setSelectedEjercicios(
      event.target.value.map((ejercicioId) => {
        return ejercicios.find((ejercicio) => ejercicio.id === ejercicioId);
      })
    );
  };

  const onSubmit = async (data) => {
    try {
      // Check if there are selected exercises
      if (selectedEjercicios.length === 0) {
        toast.error('Seleccione al menos un ejercicio');
        return;
      }

      // Check if repeticiones are empty or not greater than 0
      for (const ejercicio of selectedEjercicios) {
        const repeticionesValue = data[`repeticiones_${ejercicio.id}`];
        if (!repeticionesValue || repeticionesValue <= 0) {
          toast.error(
            `Las repeticiones para el ejercicio "${ejercicio.nombre}" deben ser mayores que 0`
          );
          return;
        }
      }

      // Format the data to have an array of objects containing ejercicio_id and repeticiones
      const ejerciciosData = selectedEjercicios.map((ejercicio) => ({
        ejercicio_id: ejercicio.id,
        repeticiones: data[`repeticiones_${ejercicio.id}`],
      }));

      const formData = {
        nombre: data.nombre,
        tipo: data.tipo,
        ejercicios: ejerciciosData,
      };

      console.log(formData);
      await RutinasApi.updateRutina(formData); // Use the updateRutina method to update the rutina

      toast.success('Rutina actualizada exitosamente');
    } catch (error) {
      console.error('Error updating routine:', error);
      toast.error('Hubo un error al actualizar la rutina');
    }
  };

  useEffect(() => {
    // Trigger the validation for the repeticiones fields when selectedEjercicios change
    trigger(
      selectedEjercicios.map((ejercicio) => `repeticiones_${ejercicio.id}`)
    );
  }, [selectedEjercicios, trigger]);

  if (!rutina) {
    return <div>Cargando...</div>; // Show a loading state while fetching the rutina
  }

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
        defaultValue={rutina.nombre} // Set the default value for the name field
        error={!!errors.nombre}
        helperText={errors.nombre?.message}
      />
      <TextField
        label="Tipo"
        {...register('tipo')}
        defaultValue={rutina.tipo} // Set the default value for the tipo field
        error={!!errors.tipo}
        helperText={errors.tipo?.message}
      />

      <FormControl fullWidth>
        <InputLabel id="ejercicio-select-label">Ejercicios</InputLabel>
        <Select
          labelId="ejercicio-select-label"
          multiple
          value={selectedEjercicios.map((ejercicio) => ejercicio.id)} // Use selectedEjercicios to set the selected values
          onChange={handleEjercicioChange}
          error={!!errors.ejercicios}
        >
          {ejercicios.map((ejercicio) => (
            <MenuItem key={ejercicio.id} value={ejercicio.id}>
              {ejercicio.nombre}
            </MenuItem>
          ))}
        </Select>
        {errors.ejercicios && (
          <span style={{ color: 'red' }}>{errors.ejercicios.message}</span>
        )}
      </FormControl>

      {ejercicios.map((ejercicio) =>
        selectedEjercicios.map((selectedEjercicio) =>
          selectedEjercicio.id === ejercicio.id ? (
            <Controller
              key={ejercicio.id}
              name={`repeticiones_${ejercicio.id}`}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <div>
                  <TextField
                    {...field}
                    type="number"
                    label={`Repeticiones para ${ejercicio.nombre}`}
                    error={!!errors[`repeticiones_${ejercicio.id}`]}
                    helperText={
                      errors[`repeticiones_${ejercicio.id}`]?.message
                    }
                  />
                </div>
              )}
            />
          ) : null
        )
      )}

      <Button type="submit" variant="contained" color="primary">
        Actualizar
      </Button>
    </Box>
  );
};

export default RutinaUpdateForm;
