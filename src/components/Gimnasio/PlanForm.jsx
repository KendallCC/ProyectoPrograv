import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import { TextField, Button, Card, CardContent, Grid, Select, MenuItem, InputLabel, FormControl, FormHelperText } from '@mui/material';
import PlanesApi from '../../Services/PlanesApi';
import serviciosApi from '../../Services/serviciosApi';

const schema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es requerido').min(5, 'El nombre debe tener al menos 5 caracteres'),
  descripcion: Yup.string().required('La descripción es requerida').min(5, 'La descripción debe tener al menos 5 caracteres'),
  precio: Yup.number().required('El precio es requerido').min(0, 'El precio debe ser mayor o igual a cero'),
});

const PlanForm = () => {
  const [servicios, setServicios] = useState([]);
  const [selectedServicios, setSelectedServicios] = useState([]);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      precio: '',
      servicios: [], // Initialize the services field with an empty array
    },
  });

  useEffect(() => {
    serviciosApi.getServicios()
      .then(response => {
        console.log(response);
        setServicios(response.data.results);
      })
      .catch(error => {
        console.log(error);
        toast.error('Error al cargar los servicios');
      });
  }, []);

  const handleServiciosChange = (event) => {
    setSelectedServicios(event.target.value); // Update state with the selected service IDs
  };

  const onSubmit = (data) => {
    data.servicios = selectedServicios;

    console.log(data);
    PlanesApi.createPlan(data)
      .then(response => {
        console.log(response);
        setSelectedServicios([]); // Reset the selected services after successful submission
        reset(); // Reset the form fields to their initial values
      })
      .catch(error => {
        if (error instanceof SyntaxError) {
          console.log(error);
          throw new Error('Respuesta no válida del servidor');
        }
      });
      // Show a success message or toast notification
      toast.success('El plan ha sido creado exitosamente');
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={6}>
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                label="Nombre"
                variant="outlined"
                fullWidth
                margin="normal"
                {...register('nombre')}
                error={!!errors.nombre}
                helperText={errors?.nombre?.message}
              />
              <TextField
                label="Descripción"
                variant="outlined"
                fullWidth
                margin="normal"
                {...register('descripcion')}
                error={!!errors.descripcion}
                helperText={errors?.descripcion?.message}
              />
              <TextField
                label="Precio"
                variant="outlined"
                fullWidth
                margin="normal"
                {...register('precio')}
                error={!!errors.precio}
                helperText={errors?.precio?.message}
              />
              <FormControl fullWidth error={!!errors.servicios}>
                <InputLabel id="servicios-label">Servicios</InputLabel>
                <Select
                  labelId="servicios-label"
                  id="servicios"
                  multiple
                  value={selectedServicios}
                  onChange={handleServiciosChange}
                  renderValue={(selected) => (
                    <div>
                      {selected.map((value, index) => (
                        <div key={index}>
                          {servicios.find((servicio) => servicio.id === value)?.nombre}
                        </div>
                      ))}
                    </div>
                  )}
                >
                  {servicios.map((servicio, index) => (
                    <MenuItem key={index} value={servicio.id}>
                      {servicio.nombre}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors?.servicios?.message}</FormHelperText>
              </FormControl>
              <Button type="submit" variant="contained" color="primary">
                Crear plan
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default PlanForm;
