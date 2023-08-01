import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Box } from '@mui/material';
import { toast } from 'react-hot-toast';
import serviciosApi from '../../Services/serviciosApi';

const schema = yup.object().shape({
  nombre: yup.string().required('El nombre es requerido'),
  descripcion: yup.string().required('La descripción es requerida'),
  tipo: yup.string().oneOf(['Individual', 'Grupal'], 'Tipo de servicio inválido').required('El tipo de servicio es requerido'),
  imagen_servicio: yup
    .mixed()
    .required('La imagen es requerida')
    .test('fileFormat', 'Formato de imagen inválido', (value) => {
      if (!value || !value[0]) return true;
      const supportedFormats = ['image/jpeg', 'image/png'];
      return supportedFormats.includes(value[0].type);
    }),
});

const FormularioServicio = () => {
  const { handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const [selectedImage, setSelectedImage] = useState(null);

  const onSubmit = async (data) => {
    try {
      const fileInput = document.getElementById('imageInput');
      const file = fileInput.files[0];

      if (file) {
        const reader = new FileReader();

        reader.onloadend = async () => {
          const imageData = reader.result.replace(/^data:image\/[a-z]+;base64,/, '');
          data.imagen_servicio = imageData;
          console.log(imageData);
          try {
            await serviciosApi.createServicios(data);
            toast.success('La actividad ha sido creada exitosamente.');
          } catch (error) {
            console.error('Error al crear la actividad:', error);
            toast.error('Error al crear la actividad.');
          }
        };

        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      toast.error('Error al enviar el formulario.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImage(null);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    const fileInput = document.getElementById('imageInput');
    fileInput.value = ''; // Reset the file input value
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="nombre"
        defaultValue=""
        render={({ field }) => (
          <TextField
            label="Nombre"
            fullWidth
            margin="normal"
            {...field}
            sx={{
              ...(errors.nombre && { '& .MuiInputBase-root': { color: 'red' } }),
            }}
            helperText={errors.nombre?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="descripcion"
        defaultValue=""
        render={({ field }) => (
          <TextField
            label="Descripción"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            {...field}
            sx={{
              ...(errors.descripcion && { '& .MuiInputBase-root': { color: 'red' } }),
            }}
            helperText={errors.descripcion?.message}
          />
        )}
      />

      <Box sx={{ mb: 2 }}>
        <Controller
          control={control}
          name="tipo"
          defaultValue=""
          render={({ field }) => (
            <FormControl component="fieldset" sx={{ color: errors.tipo ? 'red' : undefined }}>
              <FormLabel component="legend">Tipo de Servicio</FormLabel>
              <RadioGroup {...field}>
                <FormControlLabel value="Individual" control={<Radio />} label="Individual" />
                <FormControlLabel value="Grupal" control={<Radio />} label="Grupal" />
              </RadioGroup>
              {errors.tipo && errors.tipo.type === 'required' && <span style={{ color: 'red' }}>{errors.tipo.message}</span>}
            </FormControl>
          )}
        />
      </Box>

      <Controller
        control={control}
        name="imagen_servicio"
        defaultValue={null}
        render={({ field }) => (
          <>
            <Box sx={{ mb: 2 }}>
              <input
                id="imageInput"
                type="file"
                accept="image/jpeg, image/png"
                onChange={(e) => {
                  field.onChange(e.target.files);
                  handleImageChange(e); // Call handleImageChange to show the selected image
                }}
                style={{ display: 'none' }}
              />
              <label htmlFor="imageInput">
                <Button variant="outlined" component="span">
                  Seleccionar Imagen
                </Button>
              </label>
              {selectedImage && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center' }}>
                  <img src={selectedImage} alt="Selected" style={{ maxWidth: '100px', maxHeight: '100px', marginRight: '8px' }} />
                  <Button variant="outlined" onClick={handleRemoveImage}>
                    Eliminar
                  </Button>
                </div>
              )}
              {errors.imagen_servicio && <span style={{ color: 'red' }}>{errors.imagen_servicio.message}</span>}
            </Box>

            <Button type="submit" variant="contained">
              Enviar
            </Button>
          </>
        )}
      />
    </form>
  );
};

export default FormularioServicio;
