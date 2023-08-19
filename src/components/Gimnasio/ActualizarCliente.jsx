import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ClientesApi from "../../Services/ClientesApi";
import { Button, Modal, TextField } from "@mui/material";
import { toast } from "react-hot-toast";

const centerContentStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "50vh",
};

const schema = yup.object().shape({
  nombre: yup.string().required("Este campo es requerido").min(5, "Mínimo 5 caracteres"),
  apellidos: yup.string().required("Este campo es requerido").min(5, "Mínimo 5 caracteres"),
  sexo: yup.string().required("Este campo es requerido"),
  telefono: yup.string().required("Este campo es requerido").min(5, "Mínimo 5 caracteres"),
  fecha_nacimiento: yup.string().required("Este campo es requerido"),
  estado: yup.string().required("Este campo es requerido").min(5, "Mínimo 5 caracteres"),
});

const ActualizarUsuario = () => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const { handleSubmit, control, formState } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await ClientesApi.getEclientesId(id);
        if (response.data.status === 200 && response.data.results) {
          setUserDetails(response.data.results);
        }
      } catch (error) {
        // Manejar el error en caso de fallo en la petición
      }
    };
    fetchUserDetails();
  }, [id]);

  const handleUpdate = () => {
    setShowModal(true);
  };

  const confirmUpdate = async () => {
    const userData = {
      id: id,
      nombre: userDetails.nombre,
      apellidos: userDetails.apellidos,
      sexo: userDetails.sexo,
      telefono: userDetails.telefono,
      fecha_nacimiento: userDetails.fecha_nacimiento,
      estado: userDetails.estado,
    };

    try {
      await ClientesApi.updateclientes(userData);
      setShowModal(false);
      toast.success("Actualización exitosa");
    } catch (error) {
      // Manejar el error en caso de fallo en la petición
      toast.error("Ha ocurrido un error");
    }
  };

  return (
    <div style={centerContentStyle}>
      <h2>Actualizar Usuario</h2>
      {userDetails && (
        <form onSubmit={handleSubmit(confirmUpdate)}>
          <Controller
            name="nombre"
            control={control}
            defaultValue={userDetails.nombre}
            render={({ field, fieldState }) => (
              <TextField
                label="Nombre"
                {...field}
                error={fieldState.error?.message !== undefined}
                helperText={fieldState.error?.message || ""}
                fullWidth
                margin="normal"
                variant="outlined"
              />
            )}
          />
          <Controller
            name="apellidos"
            control={control}
            defaultValue={userDetails.apellidos}
            render={({ field, fieldState }) => (
              <TextField
                label="Apellidos"
                {...field}
                error={fieldState.error?.message !== undefined}
                helperText={fieldState.error?.message || ""}
                fullWidth
                margin="normal"
                variant="outlined"
              />
            )}
          />
          <Controller
            name="sexo"
            control={control}
            defaultValue={userDetails.sexo}
            render={({ field, fieldState }) => (
              <TextField
                label="Sexo"
                {...field}
                error={fieldState.error?.message !== undefined}
                helperText={fieldState.error?.message || ""}
                fullWidth
                margin="normal"
                variant="outlined"
              />
            )}
          />
          <Controller
            name="telefono"
            control={control}
            defaultValue={userDetails.telefono}
            render={({ field, fieldState }) => (
              <TextField
                label="Teléfono"
                {...field}
                error={fieldState.error?.message !== undefined}
                helperText={fieldState.error?.message || ""}
                fullWidth
                margin="normal"
                variant="outlined"
              />
            )}
          />
          <Controller
            name="fecha_nacimiento"
            control={control}
            defaultValue={userDetails.fecha_nacimiento}
            render={({ field, fieldState }) => (
              <TextField
                label="Fecha de Nacimiento"
                {...field}
                error={fieldState.error?.message !== undefined}
                helperText={fieldState.error?.message || ""}
                fullWidth
                margin="normal"
                variant="outlined"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
          <Controller
            name="estado"
            control={control}
            defaultValue={userDetails.estado}
            render={({ field, fieldState }) => (
              <TextField
                label="Estado"
                {...field}
                error={fieldState.error?.message !== undefined}
                helperText={fieldState.error?.message || ""}
                fullWidth
                margin="normal"
                variant="outlined"
              />
            )}
          />
          <Button variant="contained" type="submit" disabled={formState.isSubmitting}>
            Actualizar Usuario
          </Button>
        </form>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} style={centerContentStyle}>
        <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "4px", textAlign: "center" }}>
          <p>¿Estás seguro de actualizar los detalles de este usuario?</p>
          <Button variant="contained" onClick={handleSubmit(confirmUpdate)} disabled={formState.isSubmitting}>
            Sí, confirmar
          </Button>
          <Button variant="outlined" onClick={() => setShowModal(false)} disabled={formState.isSubmitting}>
            Cancelar
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ActualizarUsuario;
