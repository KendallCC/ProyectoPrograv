import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ClientesApi from "../../Services/ClientesApi";
import { Button, Modal, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { toast } from 'react-hot-toast';

const centerContentStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const UpdateUserRoleComponent = () => {
  const { id } = useParams();
  const [selectedRole, setSelectedRole] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCurrentRole = async () => {
      try {
        const response = await ClientesApi.getEclientesId(id);
        if (response.data.status === 200 && response.data.results) {
          setCurrentRole(response.data.results.rol);
          setSelectedRole(response.data.results.rol);
        }
      } catch (error) {
        // Manejar el error en caso de fallo en la petición
      }
    };
    fetchCurrentRole();
  }, [id]);

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleRoleUpdate = () => {
    setShowModal(true);
  };

  const confirmRoleUpdate = async () => {
    const rolesData = {
      id: id,
      role: selectedRole,
    };

    try {
      await ClientesApi.RolUser(rolesData);
      setShowModal(false);
      toast.success('Actualización del rol completa')
    } catch (error) {
      // Manejar el error en caso de fallo en la petición
      toast.error('Actualización del rol no completada')
    }
  };

  return (
    <div style={centerContentStyle}>
      <h2>Asignación de Rol</h2>
      <FormControl>
        <InputLabel>Seleccionar Rol</InputLabel>
        <Select value={selectedRole} onChange={handleRoleChange}>
          <MenuItem value="Administrador">Administrador</MenuItem>
          <MenuItem value="Empleado">Empleado</MenuItem>
          <MenuItem value="Cliente">Cliente</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" onClick={handleRoleUpdate}>
        Actualizar Rol
      </Button>

      <Modal open={showModal} onClose={() => setShowModal(false)} style={centerContentStyle}>
        <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "4px", textAlign: "center" }}>
          <p>¿Estás seguro de asignar los privilegios de {selectedRole} a este usuario?</p>
          <Button variant="contained" onClick={confirmRoleUpdate}>
            Sí, confirmar
          </Button>
          <Button variant="outlined" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default UpdateUserRoleComponent;
