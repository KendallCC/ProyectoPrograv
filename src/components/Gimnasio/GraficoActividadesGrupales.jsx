import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import ActividadesApi from '../../Services/ActividadesApi';

const ActivityParticipantsChart = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState('2023-08-01');
  const [endDate, setEndDate] = useState('2023-08-10');

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    try {
      const response = await ActividadesApi.DatosTablaGrupal({
        fecha_inicio: startDate,
        fecha_fin: endDate,
      });
      setData(response.data.results);
      console.log(response);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <Container>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h6" gutterBottom textAlign={'center'}>
          Gráfico de Cantidad de Participantes por Actividad Grupal
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <span style={{ margin: '0 10px' }}>Desde</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <span style={{ margin: '0 10px' }}>hasta</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ marginLeft: '10px' }}
          />
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="actividad" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cantidad_participantes" fill="#8884d8" />
            {/* Etiqueta para las fechas */}
            <text
              x="50%"
              y="0"
              dy={-10}
              textAnchor="middle"
              fill="#8884d8"
              fontSize={12}
            >
              Desde: {startDate} hasta: {endDate}
            </text>
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Container>
  );
};

export default ActivityParticipantsChart;
