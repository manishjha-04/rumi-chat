import React, { useState, useCallback, memo } from 'react';
import { Box, Typography, IconButton, Modal, Fade } from '@mui/material';
import { ChevronLeft, ChevronRight, Close, ZoomIn } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Memoized image component to prevent unnecessary re-renders
const ImageCard = memo(({ image, index, onClick, onDownload, downloading }) => (
  <motion.div
    key={image.url}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ 
      delay: Math.min(index * 0.1, 0.3),
      duration: 0.2
    }}
    whileHover={{ 
      scale: 1.03,
      transition: { duration: 0.2 }
    }}
    style={{ cursor: 'pointer' }}
  >
    <Box sx={{ 
      position: 'relative',
      borderRadius: 2,
      overflow: 'hidden',
      aspectRatio: '16/9',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
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
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <IconButton
            onClick={(e) => onDownload(e)}
            disabled={downloading}
            sx={{ 
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
            }}
          >
            {downloading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                ⭕
              </motion.div>
            ) : '⬇️'}
          </IconButton>
          <IconButton
            onClick={() => onClick(index)}
            sx={{ 
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
            }}
          >
            <ZoomIn />
          </IconButton>
        </Box>
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
  const [downloading, setDownloading] = useState(false);

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

  const handleDownload = async (image, e) => {
    e.stopPropagation();
    try {
      setDownloading(true);
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = image.alt || 'image';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {title && (
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2,
            fontWeight: 600,
            color: 'text.primary',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {title}
        </Typography>
      )}
      
      <Box sx={{ 
        display: 'flex',
        overflowX: 'auto',
        gap: 2,
        pb: 2,
        scrollBehavior: 'smooth',
        '&::-webkit-scrollbar': {
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '4px',
          '&:hover': {
            background: '#555',
          },
        },
      }}>
        {images.map((image, index) => (
          <Box
            key={image.url}
            sx={{
              flex: '0 0 auto',
              width: {
                xs: '280px',
                sm: '320px',
                md: '360px'
              }
            }}
          >
            <ImageCard
              image={image}
              index={index}
              onClick={handleImageClick}
              onDownload={(e) => handleDownload(image, e)}
              downloading={downloading}
            />
          </Box>
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
            justifyContent: 'center',
            p: 2
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
                  objectFit: 'contain',
                  borderRadius: '8px'
                }}
              />

              <Box sx={{
                position: 'absolute',
                bottom: -60,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 2,
                alignItems: 'center'
              }}>
                <IconButton
                  sx={{ 
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                  onClick={(e) => handleDownload(images[currentIndex], e)}
                  disabled={downloading}
                >
                  <Box component="span" sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    {downloading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        ⭕
                      </motion.div>
                    ) : '⬇️'}
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      {downloading ? 'Downloading...' : 'Download'}
                    </Typography>
                  </Box>
                </IconButton>
              </Box>

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