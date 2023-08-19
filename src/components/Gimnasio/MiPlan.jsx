import React, { useEffect, useState, useContext } from "react";
import { Button, Paper, Typography } from "@mui/material";
import PlanesApi from "../../Services/PlanesApi";
import { UserContext } from "../../context/UserContext";

const PlanCliente = () => {
  const { decodeToken } = useContext(UserContext);
  const [userData, setUserData] = useState(decodeToken());

  const [planCliente, setPlanCliente] = useState(null);
  const clienteId=userData.id
  useEffect(() => {
    const fetchPlanCliente = async () => {
      try {
        const response = await PlanesApi.getPlanesClientebyidCliente(clienteId);
        setPlanCliente(response.data.results[0]);
        console.log(response.data.results[0]);
      } catch (error) {
        
      }
    };

    fetchPlanCliente();
  }, [clienteId]);

  const handleDesafiliarPlan = async () => {
    try {
      await PlanesApi.ActualizarReservaplan({
        plan_id: planCliente.plan_id,
        cliente_id: planCliente.cliente_id
      });
      console.log("Plan desafiliado exitosamente");
      setPlanCliente(null); // Eliminar la información del plan del estado
    } catch (error) {
      console.error("Error al desafiliar el plan:", error);
    }
  };

  return (
    <Paper
      elevation={3}
      style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}
    >
      {planCliente ? (
        <div>
          <Typography variant="h6">Plan Asignado al Cliente</Typography>
          <Typography>Nombre del Plan: {planCliente.nombre_plan}</Typography>
          <Typography>Fecha Vigencia: {planCliente.fecha_vigencia}</Typography>
          <Typography>Estado: {planCliente.estado_Plan}</Typography>
          {planCliente.estado_Plan === "Activo" && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleDesafiliarPlan}
            >
              Desafiliar Plan
            </Button>
          )}
        </div>
      ) : (
        <Typography>No se encontró un plan asignado al cliente.</Typography>
      )}
    </Paper>
  );
};

export default PlanCliente;
