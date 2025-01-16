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
import { Box, Typography, useTheme } from '@mui/material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const LineChartComponent = ({ data, xKey, yKey, title }) => (
  <Box sx={{ width: '100%', minHeight: '300px', height: '40vh' }}>
    <Typography variant="h6" align="center" gutterBottom>
      {title}
    </Typography>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} tick={{ fontSize: '0.8rem' }} />
        <YAxis tick={{ fontSize: '0.8rem' }} />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
        <Line type="monotone" dataKey={yKey} stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </Box>
);

export const PieChartComponent = ({ data, dataKey, nameKey, title }) => (
  <Box sx={{ width: '100%', minHeight: '300px', height: '45vh' }}>
    <Typography variant="h6" align="center" gutterBottom>
      {title}
    </Typography>
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          cx="50%"
          cy="50%"
          outerRadius="80%"
          innerRadius="0%"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={true}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '0.8rem' }} />
      </PieChart>
    </ResponsiveContainer>
  </Box>
);

export const BarChartComponent = ({ data, xKey, yKey, title }) => (
  <Box sx={{ width: '100%', minHeight: '300px', height: '40vh' }}>
    <Typography variant="h6" align="center" gutterBottom>
      {title}
    </Typography>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} tick={{ fontSize: '0.8rem' }} />
        <YAxis tick={{ fontSize: '0.8rem' }} />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
        <Bar dataKey={yKey} maxBarSize={60}>
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