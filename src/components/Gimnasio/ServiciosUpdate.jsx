import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Box, Typography, Card, CardContent, CardMedia } from '@mui/material';
import { toast } from 'react-hot-toast';
import serviciosApi from '../../Services/serviciosApi';
import { useNavigate } from 'react-router-dom'
const schema = yup.object().shape({
  nombre: yup.string().required('El nombre es requerido'),
  descripcion: yup.string().required('La descripción es requerida'),
  tipo: yup.string().oneOf(['Individual', 'Grupal'], 'Tipo de servicio inválido').required('El tipo de servicio es requerido'),
});

const FormularioServicio = () => {
  const { id } = useParams();
  const { handleSubmit, control, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();
  const [servicioData, setServicioData] = React.useState(null);
  const [selectedImage, setSelectedImage] = React.useState(null);

  useEffect(() => {
    const fetchServicioData = async () => {
      try {
        const response = await serviciosApi.getPServiciosById(id);
        const datos = response.data.results[0];
        setServicioData(datos);
        setValue('nombre', datos.nombre);
        setValue('descripcion', datos.descripcion);
        setValue('tipo', datos.tipo);
      } catch (error) {
        console.error('Error al obtener los datos del servicio:', error);
        toast.error('Error al obtener los datos del servicio.');
      }
    };
    fetchServicioData();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      if (data.imagen_servicio) {
        const file = data.imagen_servicio[0];

        const reader = new FileReader();

        reader.onloadend = async () => {
          const imageData = reader.result.replace(/^data:image\/[a-z]+;base64,/, '');
          data.imagen_servicio = imageData;

          try {
            await serviciosApi.updateServicios({ id: servicioData.id, ...data });
            toast.success('El servicio ha sido actualizado exitosamente.');
            navigate('/ListaServicios')
          } catch (error) {
            console.error('Error al actualizar el servicio:', error);
            toast.error('Error al actualizar el servicio.');
          }
        };

        reader.readAsDataURL(file);
      } else {
        try {
          await serviciosApi.updateServicios({ id: servicioData.id, ...data });
          toast.success('El servicio ha sido actualizado exitosamente.');
          navigate('/ListaServicios')
        } catch (error) {
          console.error('Error al actualizar el servicio:', error);
          toast.error('Error al actualizar el servicio.');
        }
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
    fileInput.value = '';
  };

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto', padding: '16px' }}>
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
                {errors.tipo && errors.tipo.type === 'required' && (
                  <span style={{ color: 'red' }}>{errors.tipo.message}</span>
                )}
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
                    handleImageChange(e);
                  }}
                  style={{ display: 'none' }}
                />
                <label htmlFor="imageInput">
                  <Button variant="outlined" component="span">
                    Seleccionar Imagen
                  </Button>
                </label>
                {servicioData && servicioData.imagen_servicio && (
                  <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="bold" textAlign="center" sx={{ mb: '8px' }}>
                      Imagen existente:
                    </Typography>
                    <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                      <CardMedia
                        component="img"
                        src={`data:image/jpeg;base64,${servicioData.imagen_servicio}`}
                        alt="Existing"
                        sx={{ maxWidth: '100%', maxHeight: '100%', height: 'auto' }}
                      />
                    </Box>
                  </div>
                )}
                {selectedImage && (
                  <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="bold" textAlign="center" sx={{ mb: '8px' }}>
                      Imagen a actualizar:
                    </Typography>
                    <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                      <CardMedia
                        component="img"
                        src={selectedImage}
                        alt="Selected"
                        sx={{ maxWidth: '100%', maxHeight: '100%', height: 'auto' }}
                      />
                      <Button variant="outlined" onClick={handleRemoveImage} sx={{ mt: '8px' }}>
                        Eliminar
                      </Button>
                    </Box>
                  </div>
                )}
                {errors.imagen_servicio && (
                  <span style={{ color: 'red', mt: '8px', display: 'block' }}>{errors.imagen_servicio.message}</span>
                )}
              </Box>

              <Button type="submit" variant="contained">
                Actualizar
              </Button>
            </>
          )}
        />
      </form>
    </Card>
  );
};

export default FormularioServicio;
