import React from 'react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Box, Typography } from '@mui/material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const LineChartComponent = ({ data, xKey, yKey, title }) => (
  <Box sx={{ width: '100%', height: 400 }}>
    <Typography variant="h6" align="center" gutterBottom>
      {title}
    </Typography>
    <ResponsiveContainer>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey={yKey} stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  </Box>
);

export const PieChartComponent = ({ data, dataKey, nameKey, title }) => (
  <Box sx={{ width: '100%', height: 400 }}>
    <Typography variant="h6" align="center" gutterBottom>
      {title}
    </Typography>
    <ResponsiveContainer>
      <PieChart>
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          cx="50%"
          cy="50%"
          outerRadius={150}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </Box>
);

export const BarChartComponent = ({ data, xKey, yKey, title }) => (
  <Box sx={{ width: '100%', height: 400 }}>
    <Typography variant="h6" align="center" gutterBottom>
      {title}
    </Typography>
    <ResponsiveContainer>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={yKey} fill="#8884d8">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </Box>
);

export default {
  LineChartComponent,
  PieChartComponent,
  BarChartComponent
}; 