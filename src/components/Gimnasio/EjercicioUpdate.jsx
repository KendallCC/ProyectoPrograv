import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, Typography, Box } from '@mui/material';
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
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

const EjercicioUpdateForm = () => {
  const { id } = useParams(); // Obtenemos el id de la URL utilizando useParams

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();

  const [imageData, setImageData] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);

  useEffect(() => {
    const fetchEjercicioData = async () => {
      try {
        const response = await EjerciciosApi.getEjercicioById(id);
        console.log(response.data.results);
        const datos = response.data.results;
        setValue('nombre', datos.nombre);
        setValue('descripcion', datos.descripcion);
        setValue('equipamiento', datos.equipamiento);

        const currentImagesArray = datos.imagenes_ejercicio || [];
        setCurrentImages(currentImagesArray);
      } catch (error) {
        console.error('Error al obtener los datos del ejercicio:', error);
        toast.error('Error al obtener los datos del ejercicio.');
      }
    };
    fetchEjercicioData();
  }, [id, setValue]);

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

  const handleDeleteImage = (index) => {
    const updatedImages = [...imageData];
    updatedImages.splice(index, 1);
    setImageData(updatedImages);
  };

  const onSubmit = async (data) => {
    try {
      const formData = { ...data, imagenes_ejercicio: imageData };

      // Si no se seleccionó ninguna imagen nueva, mantener las imágenes actuales
      if (imageData.length === 0) {
        formData.imagenes_ejercicio = currentImages;
      }

      await EjerciciosApi.updateEjercicio({ ...formData, id });
      toast.success('Ejercicio actualizado exitosamente.');
      navigate('/ListaEjercicios')
    } catch (error) {
      console.error('Error al actualizar el ejercicio:', error);
      toast.error('Hubo un error al actualizar el ejercicio.');
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
        Actualizar Ejercicio
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
          {imageData.map((imageData, index) => (
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
      </div>
      <Button type="submit" variant="contained" color="primary">
        Actualizar
      </Button>
    </Box>
  );
};

export default EjercicioUpdateForm;
