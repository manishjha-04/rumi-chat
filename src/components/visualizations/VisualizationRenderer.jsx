import React, { useState, useRef, useCallback, memo } from 'react';
import { Box, IconButton, Tooltip, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import RichTextRenderer from './RichTextRenderer';
import DataTable from './DataTable';
import Charts from './Charts';
import MediaDisplay from './MediaDisplay';
import { 
  DownloadOutlined, 
  ShareOutlined,
  PictureAsPdfOutlined,
  TableChartOutlined,
  ImageOutlined
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CSVLink } from 'react-csv';

// Memoized export menu to prevent unnecessary re-renders
const ExportMenu = memo(({ anchorEl, onClose, onExport, showCSV }) => (
  <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={onClose}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
  >
    <MenuItem onClick={() => onExport('pdf')}>
      <ListItemIcon>
        <PictureAsPdfOutlined fontSize="small" />
      </ListItemIcon>
      <ListItemText>Export as PDF</ListItemText>
    </MenuItem>
    {showCSV && (
      <MenuItem onClick={() => onExport('csv')}>
        <ListItemIcon>
          <TableChartOutlined fontSize="small" />
        </ListItemIcon>
        <ListItemText>Export as CSV</ListItemText>
      </MenuItem>
    )}
    <MenuItem onClick={() => onExport('image')}>
      <ListItemIcon>
        <ImageOutlined fontSize="small" />
      </ListItemIcon>
      <ListItemText>Export as Image</ListItemText>
    </MenuItem>
  </Menu>
));

const VisualizationRenderer = ({ content }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const contentRef = useRef(null);
  const csvLinkRef = useRef(null);

  const handleExportClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleExport = useCallback(async (format) => {
    handleClose();
    
    try {
      switch (format) {
        case 'pdf':
          if (contentRef.current) {
            const canvas = await html2canvas(contentRef.current, {
              scale: 2,
              useCORS: true,
              logging: false
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
              orientation: 'landscape',
              unit: 'px',
              format: [canvas.width / 2, canvas.height / 2]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
            pdf.save(`${content.title || 'export'}.pdf`);
          }
          break;

        case 'csv':
          if (content.type === 'table' && csvLinkRef.current) {
            csvLinkRef.current.link.click();
          }
          break;

        case 'image':
          if (contentRef.current) {
            const canvas = await html2canvas(contentRef.current, {
              scale: 2,
              useCORS: true,
              logging: false
            });
            const link = document.createElement('a');
            link.download = `${content.title || 'export'}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
          }
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
      // Here you could add a proper error notification
    }
  }, [content.title]);

  const renderExportOptions = useCallback(() => {
    if (!['table', 'line-chart', 'pie-chart', 'bar-chart'].includes(content.type)) {
      return null;
    }

    const csvData = content.type === 'table' ? content.data : [];
    
    return (
      <>
        <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1, zIndex: 50 }}>
          <Tooltip title="Export">
            <IconButton 
              size="small" 
              onClick={handleExportClick}
              sx={{ 
                bgcolor: 'background.paper',
                boxShadow: 1,
                '&:hover': { bgcolor: 'background.paper', opacity: 0.9 }
              }}
            >
              <DownloadOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share">
            <IconButton 
              size="small"
              sx={{ 
                bgcolor: 'background.paper',
                boxShadow: 1,
                '&:hover': { bgcolor: 'background.paper', opacity: 0.9 }
              }}
            >
              <ShareOutlined />
            </IconButton>
          </Tooltip>
        </Box>

        <ExportMenu
          anchorEl={anchorEl}
          onClose={handleClose}
          onExport={handleExport}
          showCSV={content.type === 'table'}
        />

        {content.type === 'table' && (
          <CSVLink
            data={csvData}
            filename={`${content.title || 'export'}.csv`}
            ref={csvLinkRef}
            style={{ display: 'none' }}
          />
        )}
      </>
    );
  }, [content.type, anchorEl, handleClose, handleExport, handleExportClick]);

  const renderContent = useCallback(() => {
    const animationProps = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.2 }
    };

    const contentWrapper = (children) => (
      <motion.div {...animationProps}>
        <Box ref={contentRef} sx={{ 
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 2,
          p: 3,
          width: '100%'
        }}>
          {children}
        </Box>
      </motion.div>
    );

    switch (content.type) {
      case 'text':
        return contentWrapper(
          <RichTextRenderer content={content.data} />
        );
      
      case 'table':
        return contentWrapper(
          <DataTable
            data={content.data}
            columns={content.columns}
          />
        );
      
      case 'line-chart':
        return contentWrapper(
          <Charts.LineChartComponent
            data={content.data}
            xKey={content.xKey}
            yKey={content.yKey}
            title={content.title}
          />
        );
      
      case 'pie-chart':
        return contentWrapper(
          <Charts.PieChartComponent
            data={content.data}
            dataKey={content.dataKey}
            nameKey={content.nameKey}
            title={content.title}
          />
        );
      
      case 'bar-chart':
        return contentWrapper(
          <Charts.BarChartComponent
            data={content.data}
            xKey={content.xKey}
            yKey={content.yKey}
            title={content.title}
          />
        );
      
      case 'images':
        return contentWrapper(
          <MediaDisplay 
            images={content.data}
            title={content.title}
          />
        );
      
      default:
        return contentWrapper(
          <RichTextRenderer content={content.data} />
        );
    }
  }, [content]);

  return (
    <Box sx={{ width: '100%', my: 2, position: 'relative' }}>
      {renderContent()}
      {renderExportOptions()}
    </Box>
  );
};

export default memo(VisualizationRenderer);

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