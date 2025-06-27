import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Box, Typography } from '@mui/material';
const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];
const Dashboard = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/collections')
      .then((response) => {
        console.log('API response:', response);
        setChartData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching chart data:', error);
      });
  }, []);

  return (
    <Navbar>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ flexWrap: 'wrap' }}>
        {/* Bar Chart */}
        <BarChart width={450} height={300} data={chartData}>
          <CartesianGrid strokeDasharray=" " />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" barSize={10}/>
        </BarChart>

        <PieChart width={300} height={300}>
          <Tooltip />
          <Legend />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </Box>
    </Navbar>
  );
};

export default Dashboard;
