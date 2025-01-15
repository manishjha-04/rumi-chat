import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import { Box } from '@mui/material';

const RichTextRenderer = ({ content }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  return (
    <Box sx={{ 
      '& pre': { 
        background: '#2d2d2d',
        padding: 2,
        borderRadius: 1,
        overflow: 'auto'
      },
      '& code': {
        fontFamily: 'monospace'
      },
      '& ul, & ol': {
        paddingLeft: 3
      },
      '& blockquote': {
        borderLeft: '4px solid #ccc',
        margin: 0,
        paddingLeft: 2
      }
    }}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </Box>
  );
};

export default RichTextRenderer; 