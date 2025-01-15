import React, { useState, useCallback, memo } from 'react';
import { Box, Typography, IconButton, Modal, Fade } from '@mui/material';
import { ChevronLeft, ChevronRight, Close, ZoomIn } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Memoized image component to prevent unnecessary re-renders
const ImageCard = memo(({ image, index, onClick }) => (
  <motion.div
    key={image.url}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ 
      delay: Math.min(index * 0.1, 0.3), // Cap the delay at 0.3s
      duration: 0.2
    }}
    whileHover={{ 
      scale: 1.03,
      transition: { duration: 0.2 }
    }}
    onClick={() => onClick(index)}
    style={{ cursor: 'pointer' }}
  >
    <Box sx={{ 
      position: 'relative',
      borderRadius: 2,
      overflow: 'hidden',
      aspectRatio: '4/3',
      boxShadow: 2,
      '&:hover .overlay': {
        opacity: 1
      }
    }}>
      <img
        src={image.url}
        alt={image.alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
        loading="lazy"
      />
      <Box
        className="overlay"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0,0,0,0.5)',
          opacity: 0,
          transition: 'opacity 0.2s',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 2
        }}
      >
        <ZoomIn sx={{ color: 'white', mb: 1 }} />
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'white',
            textAlign: 'center',
            fontWeight: 500
          }}
        >
          {image.caption}
        </Typography>
      </Box>
    </Box>
  </motion.div>
));

const MediaDisplay = ({ images, title }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = useCallback((e) => {
    e?.stopPropagation();
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNext = useCallback((e) => {
    e?.stopPropagation();
    setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  const handleImageClick = useCallback((index) => {
    setSelectedImage(images[index]);
    setCurrentIndex(index);
  }, [images]);

  const handleKeyDown = useCallback((e) => {
    if (selectedImage) {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setSelectedImage(null);
    }
  }, [selectedImage, handlePrevious, handleNext]);

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleClose = useCallback(() => setSelectedImage(null), []);

  return (
    <Box sx={{ width: '100%' }}>
      {title && (
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2,
            fontWeight: 600,
            color: 'text.primary'
          }}
        >
          {title}
        </Typography>
      )}
      
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(auto-fill, minmax(250px, 1fr))'
        },
        gap: 2
      }}>
        {images.map((image, index) => (
          <ImageCard
            key={image.url}
            image={image}
            index={index}
            onClick={handleImageClick}
          />
        ))}
      </Box>

      <Modal
        open={selectedImage !== null}
        onClose={handleClose}
        closeAfterTransition
        keepMounted={false}
      >
        <Fade in={selectedImage !== null}>
          <Box sx={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <IconButton
              sx={{ 
                position: 'absolute', 
                right: 16, 
                top: 16,
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
              onClick={handleClose}
            >
              <Close />
            </IconButton>
            
            <Box sx={{ 
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <img
                src={images[currentIndex].url}
                alt={images[currentIndex].alt}
                style={{
                  maxWidth: '100%',
                  maxHeight: 'calc(100vh - 150px)',
                  objectFit: 'contain'
                }}
              />

              <IconButton
                sx={{ 
                  position: 'absolute',
                  left: -60,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                }}
                onClick={handlePrevious}
              >
                <ChevronLeft />
              </IconButton>
              
              <IconButton
                sx={{ 
                  position: 'absolute',
                  right: -60,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                }}
                onClick={handleNext}
              >
                <ChevronRight />
              </IconButton>

              {images[currentIndex].caption && (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'white',
                    textAlign: 'center',
                    mt: 2,
                    maxWidth: '600px'
                  }}
                >
                  {images[currentIndex].caption}
                </Typography>
              )}
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default memo(MediaDisplay); 