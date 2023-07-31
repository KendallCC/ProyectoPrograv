import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, Typography, Box } from '@mui/material';
import { toast } from 'react-hot-toast';
import EjerciciosApi from '../../Services/EjerciciosApi';

const schema = yup.object().shape({
  nombre: yup.string().required('El nombre es requerido'),
  descripcion: yup
    .string()
    .min(5, 'La descripción debe tener al menos 5 caracteres')
    .required('La descripción es requerida'),
  equipamiento: yup.string().min(5,'El equipamiento debe tener mas de 5 caracterres').required('El equipamiento es requerido'),
});

const EjercicioForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const [imageData, setImageData] = useState([]);

  const handleImageChange = async (e) => {
    try {
      const files = e.target.files;
      const imageDataArray = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const base64String = await readFileAsDataURL(file);
        imageDataArray.push(base64String);
      }

      setImageData(imageDataArray);
    } catch (error) {
      console.error(error);
    }
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (data) => {
    try {
      if (imageData.length === 0) {
        toast.error('Seleccione al menos una imagen');
        return;
      }

      const formData = { ...data, imagenes_ejercicio: imageData };
      console.log(formData);

      await EjerciciosApi.createEjercicio(formData);
      toast.success('Elemento creado exitosamente');
    } catch (error) {
      toast.error('Hubo un error al crear el elemento');
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
        marginBottom:'10rem'
      }}
    >
      <Typography variant="h5" align="center" sx={{ marginBottom: '16px' }}>
        Crear Ejercicio
      </Typography>
      <TextField
        label="Nombre"
        {...register('nombre')}
        error={!!errors.nombre}
        helperText={errors.nombre?.message}
      />
      <TextField
        label="Descripción"
        multiline
        minRows={4}
        maxRows={8}
        {...register('descripcion')}
        error={!!errors.descripcion}
        helperText={errors.descripcion?.message}
      />
      <TextField
        label="Equipamiento"
        {...register('equipamiento')}
        error={!!errors.equipamiento}
        helperText={errors.equipamiento?.message}
      />
      <div>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          style={{ display: 'none' }}
          id="image-input"
        />
        <label htmlFor="image-input">
          <Button variant="contained" component="span">
            Seleccione una o varias imágenes
          </Button>
        </label>
        {errors.imagen && (
          <Typography variant="body2" color="error">
            {errors.imagen.message}
          </Typography>
        )}
      </div>
      <Button type="submit" variant="contained" color="primary">
        Crear
      </Button>
    </Box>
  );
};

export default EjercicioForm;
