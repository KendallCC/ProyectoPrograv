import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
} from '@mui/material';
import { toast } from 'react-hot-toast';
import PlanesApi from '../../Services/PlanesApi';
import ServiciosApi from '../../Services/serviciosApi';
import { useNavigate } from 'react-router-dom'
const schema = yup.object().shape({
  nombre: yup.string().required('El nombre es requerido').min(5, 'El nombre debe tener al menos 5 caracteres'),
  descripcion: yup.string().required('La descripción es requerida').min(5, 'La descripción debe tener al menos 5 caracteres'),
  precio: yup.number().required('El precio es requerido').min(0, 'El precio debe ser mayor o igual a cero'),
});

const PlanUpdateForm = () => {
  const { id } = useParams(); // Obtener el ID del plan desde los parámetros de la URL
  const [servicios, setServicios] = useState([]);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();
  // Estado local para almacenar los IDs de los servicios seleccionados
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);

  useEffect(() => {
    // Obtener los datos del plan por su ID y asignarlos a los campos del formulario
    PlanesApi.getPlanById(id)
      .then(response => {
        console.log(response);
        const plan = response.data.results;
        setValue('nombre', plan.nombre);
        setValue('descripcion', plan.descripcion);
        setValue('precio', plan.precio);

        // Obtener la lista de servicios para mostrar en el campo de selección
        ServiciosApi.getServicios()
          .then(response => {
            setServicios(response.data.results);

            // Convertir el array de nombres de servicios en un array de IDs de servicios seleccionados
            const selectedServiceIds = plan.servicios.map(servicioNombre => {
              const servicio = response.data.results.find(servicio => servicio.nombre === servicioNombre);
              return servicio ? servicio.id : null;
            }).filter(Boolean);
            setSelectedServiceIds(selectedServiceIds); // Establecer los IDs de los servicios seleccionados en el estado local
          })
          .catch(error => {
            console.log(error);
            toast.error('Error al cargar los servicios');
          });
      })
      .catch(error => {
        console.log(error);
        toast.error('Error al obtener los datos del plan');
      });
  }, [id, setValue]);

  // Manejar cambios en el combo box de servicios
  const handleServicesChange = (event) => {
    const selectedServiceIds = event.target.value;
    setSelectedServiceIds(selectedServiceIds);
  };

  const onSubmit = async (data) => {
    try {
      // Enviar los datos actualizados del plan al servidor con los IDs de los servicios seleccionados
      await PlanesApi.updatePlan({ ...data, id, servicios: selectedServiceIds });

      // Mostrar un mensaje de éxito o una notificación de éxito
      toast.success('El plan ha sido actualizado exitosamente.');
      navigate('/listaPlanes')
    } catch (error) {
      console.error('Error al actualizar el plan:', error);
      toast.error('Error al actualizar el plan.');
    }
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
                  value={selectedServiceIds} // Utilizar el array de IDs de servicios seleccionados
                  multiple
                  onChange={handleServicesChange} // Manejar cambios en el combo box
                >
                  {/* Utilizar el array de servicios para poblar el combo box */}
                  {servicios.map(servicio => (
                    <MenuItem key={servicio.id} value={servicio.id}>
                      {servicio.nombre}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors?.servicios?.message}</FormHelperText>
              </FormControl>
              <Button type="submit" variant="contained" color="primary">
                Actualizar plan
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default PlanUpdateForm;
