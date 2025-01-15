import React, { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Box, IconButton, Paper } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

const MediaDisplay = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <Paper
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: 800,
        margin: 'auto',
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 300,
          position: 'relative'
        }}
      >
        <LazyLoadImage
          src={images[currentIndex].url}
          alt={images[currentIndex].alt || ''}
          effect="blur"
          style={{
            maxWidth: '100%',
            maxHeight: '500px',
            objectFit: 'contain'
          }}
        />
        
        {images.length > 1 && (
          <>
            <IconButton
              sx={{
                position: 'absolute',
                left: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)'
                }
              }}
              onClick={handlePrevious}
            >
              <ArrowBack />
            </IconButton>
            <IconButton
              sx={{
                position: 'absolute',
                right: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)'
                }
              }}
              onClick={handleNext}
            >
              <ArrowForward />
            </IconButton>
          </>
        )}
      </Box>
    </Paper>
  );
};

export default MediaDisplay; 