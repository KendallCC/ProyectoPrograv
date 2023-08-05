import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, Typography, Box } from '@mui/material';
import { toast } from 'react-hot-toast';
import EjerciciosApi from '../../Services/EjerciciosApi';
import { useNavigate } from 'react-router-dom'
const schema = yup.object().shape({
  nombre: yup.string().required('El nombre es requerido'),
  descripcion: yup
    .string()
    .min(5, 'La descripción debe tener al menos 5 caracteres')
    .required('La descripción es requerida'),
  equipamiento: yup
    .string()
    .min(5, 'El equipamiento debe tener más de 5 caracteres')
    .required('El equipamiento es requerido'),
});

const EjercicioForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();
  const [imageData, setImageData] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

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
      setSelectedImages(imageDataArray);
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

  const handleDeleteImage = (index) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setImageData(updatedImages);
    setSelectedImages(updatedImages);
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
      navigate('/ListaEjercicios')
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
        marginBottom: '10rem',
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

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            maxWidth: '250px',
            marginTop: '8px',
          }}
        >
          {selectedImages.map((imageData, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                maxWidth: '100%',
                maxHeight: '100%',
                overflow: 'hidden',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              <img
                src={`data:image/jpeg;base64,${imageData}`}
                alt={`Imagen ${index + 1}`}
                style={{ width: '100%', height: 'auto' }}
              />
              <Button
                onClick={() => handleDeleteImage(index)}
                variant="contained"
                color="error"
                size="small"
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  minWidth: 'unset',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                }}
              >
                X
              </Button>
            </div>
          ))}
        </div>
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
