import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, FormControl, FormControlLabel, Radio, RadioGroup, FormLabel, Grid, Card,Typography } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { format } from 'date-fns';
import ClientesApi from '../../services/ClientesApi';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'

const schema = yup.object().shape({
  identificacion: yup
    .string()
    .matches(/^\d{9,}$/, 'Debe tener al menos 9 dígitos')
    .required('Campo obligatorio'),
  nombre: yup.string().min(3, 'Mínimo 3 caracteres').required('Campo obligatorio'),
  apellidos: yup.string().min(3, 'Mínimo 3 caracteres').required('Campo obligatorio'),
  sexo: yup.string().oneOf(['M', 'F'], 'Seleccione una opción válida').required('Campo obligatorio'),
  fecha_nacimiento: yup
    .date()
    .max(new Date(), 'La fecha no puede ser mayor a la actual')
    .required('Campo obligatorio'), 
  telefono: yup.string().matches(/^\d{8,}$/, 'Debe tener al menos 8 dígitos').required('Campo obligatorio'),
  correo_electronico: yup.string().email('Correo electrónico inválido').required('Campo obligatorio'),
  contraseña: yup
    .string()
    .matches(/^(?=.*[A-Z])(?=.*\d\d).{8,}$/, 'Debe tener al menos 8 caracteres, 1 letra mayúscula y 2 números')
    .required('Campo obligatorio'),
});

const ClienteForm = () => {
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    // Formatear la fecha de nacimiento a "YYYY-MM-DD"
    try {
    const formattedDate = format(new Date(data.fecha_nacimiento), 'yyyy-MM-dd');
    data.fecha_nacimiento = formattedDate;
    const fecha = new Date();
    const fecha_inscripcion=`${fecha.getFullYear()}-${fecha.getMonth()+1}-${fecha.getDate()}`
    data.fecha_inscripcion=fecha_inscripcion;
    console.log(data);
    await ClientesApi.createclientes(data);
    toast.success('Agregado con exito')
    navigate('/Login')
    }catch (error) {
      console.error(error);

    }
  };

  return (
    <Card variant="outlined" style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <Typography variant="h5" align="center" sx={{ marginBottom: '16px' }}>
        Registro
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Controller
              name="identificacion"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Identificación (Cédula)"
                  variant="outlined"
                  fullWidth
                  error={!!errors.identificacion}
                  helperText={errors.identificacion?.message}
                  inputProps={{ maxLength: 10 }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="nombre"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nombre"
                  variant="outlined"
                  fullWidth
                  error={!!errors.nombre}
                  helperText={errors.nombre?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="apellidos"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Apellidos"
                  variant="outlined"
                  fullWidth
                  error={!!errors.apellidos}
                  helperText={errors.apellidos?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset" error={!!errors.sexo}>
              <FormLabel component="legend">Sexo</FormLabel>
              <Controller
                name="sexo"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <RadioGroup row {...field}>
                    <FormControlLabel value="M" control={<Radio />} label="Masculino" />
                    <FormControlLabel value="F" control={<Radio />} label="Femenino" />
                  </RadioGroup>
                )}
              />
              {errors.sexo && <span style={{ color: 'red' }}>{errors.sexo?.message}</span>}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="fecha_nacimiento"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  type="date"
                  label="Fecha de Nacimiento"
                  variant="outlined"
                  fullWidth
                  error={!!errors.fecha_nacimiento}
                  helperText={errors.fecha_nacimiento?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="telefono"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Teléfono"
                  variant="outlined"
                  fullWidth
                  error={!!errors.telefono}
                  helperText={errors.telefono?.message}
                  inputProps={{ maxLength: 10 }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="correo_electronico"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Correo Electrónico"
                  variant="outlined"
                  fullWidth
                  error={!!errors.correo_electronico}
                  helperText={errors.correo_electronico?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="contraseña"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  type="password"
                  label="Contraseña"
                  variant="outlined"
                  fullWidth
                  error={!!errors.contraseña}
                  helperText={errors.contraseña?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Registrar
            </Button>
          </Grid>
        </Grid>
      </form>
    </Card>
  );
};

export default ClienteForm;
