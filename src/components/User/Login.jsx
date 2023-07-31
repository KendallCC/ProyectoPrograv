import * as React from 'react';
import { useState, useContext } from 'react';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { UserContext } from '../../context/UserContext';
import toast from 'react-hot-toast';
import ClienteApi from '../../services/ClientesApi';

export function Login() {
  const navigate = useNavigate();
  const { saveUser } = useContext(UserContext);

  const loginSchema = yup.object({
    email: yup.string().required('El email es requerido').email('Formato email'),
    password: yup.string().required('El password es requerido'),
  });

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(loginSchema),
  });

  const [error, setError] = useState('');

  const onSubmit = (data) => {
    ClienteApi.loginUser(data)
      .then((response) => {
        const responseData = response.data.results;
        // Respuesta del API
        if (responseData && responseData !== 'Usuario no valido') {
          // Guardar Token
          saveUser(responseData);
          toast.success('Ingreso válido', {
            duration: 4000,
            position: 'top-center',
          });
          return navigate('/');
        } else {
          setError('Usuario o contraseña incorrectos'); // Setear el mensaje de error
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error('Hubo un problema al procesar la solicitud')
      });
  };

  const onError = (errors, e) => console.log(errors, e);

  return (
    <>
      <Toaster /> {/* Agregamos el componente Toaster fuera del formulario */}
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12}>
            <Typography variant='h5' gutterBottom>
              Login
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl variant='standard' fullWidth sx={{ m: 1 }}>
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id='email'
                    label='Email'
                    error={Boolean(errors.email)}
                    helperText={errors.email ? errors.email.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl variant='standard' fullWidth sx={{ m: 1 }}>
              <Controller
                name='password'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id='password'
                    label='Password'
                    type='password'
                    error={Boolean(errors.password)}
                    helperText={errors.password ? errors.password.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Button type='submit' variant='contained' color='secondary' sx={{ m: 1 }}>Login</Button>
          </Grid>
        </Grid>
      </form>
      {error && ( // Mostramos el toast de error si hay un mensaje de error
        <div>
          {error}
          <button onClick={() => setError('')}>Cerrar</button>
        </div>
      )}
    </>
  );
}
