import React from 'react';
import { Box } from '@mui/material';
import RichTextRenderer from './RichTextRenderer';
import DataTable from './DataTable';
import Charts from './Charts';
import MediaDisplay from './MediaDisplay';

const VisualizationRenderer = ({ content }) => {
  const renderContent = () => {
    switch (content.type) {
      case 'text':
        return <RichTextRenderer content={content.data} />;
      
      case 'table':
        return (
          <DataTable
            data={content.data}
            columns={content.columns}
          />
        );
      
      case 'line-chart':
        return (
          <Charts.LineChartComponent
            data={content.data}
            xKey={content.xKey}
            yKey={content.yKey}
            title={content.title}
          />
        );
      
      case 'pie-chart':
        return (
          <Charts.PieChartComponent
            data={content.data}
            dataKey={content.dataKey}
            nameKey={content.nameKey}
            title={content.title}
          />
        );
      
      case 'bar-chart':
        return (
          <Charts.BarChartComponent
            data={content.data}
            xKey={content.xKey}
            yKey={content.yKey}
            title={content.title}
          />
        );
      
      case 'images':
        return <MediaDisplay images={content.data} />;
      
      default:
        return <RichTextRenderer content={content.data} />;
    }
  };

  return (
    <Box sx={{ width: '100%', my: 2 }}>
      {renderContent()}
    </Box>
  );
};

export default VisualizationRenderer;

// Example usage:
/*
const content = {
  type: 'line-chart',
  data: [
    { month: 'Jan', sales: 4000 },
    { month: 'Feb', sales: 3000 },
    // ...
  ],
  xKey: 'month',
  yKey: 'sales',
  title: 'Monthly Sales'
};

// or

const content = {
  type: 'text',
  data: '# Hello\nThis is **markdown** content'
};

// or

const content = {
  type: 'table',
  data: [
    { id: 1, name: 'John', sales: 100 },
    { id: 2, name: 'Jane', sales: 200 }
  ],
  columns: [
    { id: 'id', label: 'ID', numeric: true },
    { id: 'name', label: 'Name' },
    { id: 'sales', label: 'Sales', numeric: true }
  ]
};

// or

const content = {
  type: 'images',
  data: [
    { url: 'image1.jpg', alt: 'Description 1' },
    { url: 'image2.jpg', alt: 'Description 2' }
  ]
};
*/ 