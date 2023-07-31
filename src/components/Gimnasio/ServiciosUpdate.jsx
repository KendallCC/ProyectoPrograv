import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Box } from '@mui/material';
import { toast } from 'react-hot-toast';
import serviciosApi from '../../Services/serviciosApi';

const schema = yup.object().shape({
  nombre: yup.string().required('El nombre es requerido'),
  descripcion: yup.string().required('La descripción es requerida'),
  tipo: yup.string().oneOf(['Individual', 'Grupal'], 'Tipo de servicio inválido').required('El tipo de servicio es requerido'),
});

const FormularioServicio = () => {
  const { id } = useParams(); // Obtenemos el id de la URL utilizando useParams
  const { handleSubmit, control, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  const [servicioData, setServicioData] = React.useState(null);
  const [imagePreview, setImagePreview] = React.useState(null);

  useEffect(() => {
    const fetchServicioData = async () => {
      try {
        const response = await serviciosApi.getPServiciosById(id);
        const datos = response.data.results[0];
        setServicioData(datos);
        setValue('nombre', datos.nombre);
        setValue('descripcion', datos.descripcion);
        setValue('tipo', datos.tipo);
        setImagePreview(datos.imagen_servicio); // Establecer la URL de la imagen en el estado
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
            await serviciosApi.updateServicios({ id: servicioData.id, ...data }); // Incluimos el ID del servicio en el objeto data
            toast.success('El servicio ha sido actualizado exitosamente.');
          } catch (error) {
            console.error('Error al actualizar el servicio:', error);
            toast.error('Error al actualizar el servicio.');
          }
        };

        reader.readAsDataURL(file);
      } else {
        try {
          await serviciosApi.updateServicios({ id: servicioData.id, ...data }); // Incluimos el ID del servicio en el objeto data
          toast.success('El servicio ha sido actualizado exitosamente.');
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
            <FormControl
              component="fieldset"
              sx={{ color: errors.tipo ? 'red' : undefined }}
            >
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
                onChange={(e) => field.onChange(e.target.files)}
                style={{ display: 'none' }}
              />
              <label htmlFor="imageInput">
                <Button variant="outlined" component="span">
                  Seleccionar Imagen
                </Button>
              </label>
              {imagePreview && (
                <img
                  src={`data:image/jpeg;base64,${imagePreview}`}
                  alt="Vista previa de la imagen"
                  style={{ maxWidth: '100%', maxHeight: '300px' }}
                />
              )}
            </Box>

            {errors.imagen_servicio && (
              <span style={{ color: 'red' }}>{errors.imagen_servicio.message}</span>
            )}

            <Button type="submit" variant="contained">
              Actualizar
            </Button>
          </>
        )}
      />
    </form>
  );
};

export default FormularioServicio;
