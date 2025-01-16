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
      duration: 0.3,
      ease: "easeOut"
    }}
    whileHover={{ 
      scale: 1.05,
      transition: { duration: 0.2 }
    }}
    style={{ cursor: 'pointer' }}
  >
    <Box sx={{ 
      position: 'relative',
      borderRadius: 2,
      overflow: 'hidden',
      aspectRatio: '16/9',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      background: '#f8f9fa',
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
          objectFit: 'cover',
          transition: 'transform 0.3s ease'
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
          bgcolor: 'rgba(0,0,0,0.6)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
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
              bgcolor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(4px)',
              '&:hover': { 
                bgcolor: 'rgba(255,255,255,0.2)',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s ease'
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
              bgcolor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(4px)',
              '&:hover': { 
                bgcolor: 'rgba(255,255,255,0.2)',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s ease'
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
            fontWeight: 500,
            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          {image.caption}
        </Typography>
      </Box>
    </Box>
  </motion.div>
));

// Pagination dots component
const PaginationDots = memo(({ total, current, onDotClick }) => (
  <Box sx={{ 
    display: 'flex', 
    gap: 1, 
    justifyContent: 'center',
    mt: 2 
  }}>
    {Array.from({ length: total }, (_, i) => (
      <Box
        key={i}
        onClick={() => onDotClick(i)}
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: current === i ? 'primary.main' : 'rgba(0,0,0,0.2)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.2)',
            bgcolor: current === i ? 'primary.main' : 'rgba(0,0,0,0.3)'
          }
        }}
      />
    ))}
  </Box>
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

  const maxVisibleImages = 3; // Limit to 3 images

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
        position: 'relative',
        '&:hover .carousel-nav': {
          opacity: 1
        }
      }}>
        <Box sx={{ 
          display: 'flex',
          overflowX: 'auto',
          gap: 2,
          pb: 2,
          scrollBehavior: 'smooth',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}>
        {Array.from({ length: maxVisibleImages }, (_, i) => {
  const index = (currentIndex + i) % images.length;
  return (
    <Box
      key={images[index].url}
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
        image={images[index]}
        index={index}
        onClick={handleImageClick}
        onDownload={(e) => handleDownload(images[index], e)}
        downloading={downloading}
      />
    </Box>
  );
})}

        </Box>

        {/* Navigation Arrows */}
        {images.length > maxVisibleImages && ( 
          <>
            <IconButton
              className="carousel-nav"
              sx={{ 
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'white',
                bgcolor: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(4px)',
                opacity: 1, // Always visible
                transition: 'all 0.2s ease',
                '&:hover': { 
                  bgcolor: 'rgba(0,0,0,0.7)',
                  transform: 'translateY(-50%) scale(1.1)'
                }
              }}
              onClick={handlePrevious}
            >
              <ChevronLeft />
            </IconButton>
            
            <IconButton
              className="carousel-nav"
              sx={{ 
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'white',
                bgcolor: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(4px)',
                opacity: 1, // Always visible
                transition: 'all 0.2s ease',
                '&:hover': { 
                  bgcolor: 'rgba(0,0,0,0.7)',
                  transform: 'translateY(-50%) scale(1.1)'
                }
              }}
              onClick={handleNext}
            >
              <ChevronRight />
            </IconButton>
          </>
        )}

        {/* Pagination Dots */}
        <PaginationDots 
          total={images.length} 
          current={currentIndex} 
          onDotClick={setCurrentIndex}
        />
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
            backdropFilter: 'blur(8px)',
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
                bgcolor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(4px)',
                '&:hover': { 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.2s ease'
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
              <motion.img
                key={images[currentIndex].url}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1.1 }}
                transition={{ 
                  duration: 0.4,
                  ease: [0.4, 0, 0.2, 1]
                }}
                src={images[currentIndex].url}
                alt={images[currentIndex].alt}
                style={{
                  maxWidth: '95vw',
                  maxHeight: 'calc(100vh - 100px)',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  boxShadow: '0 12px 48px rgba(0,0,0,0.4)'
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
                    bgcolor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(4px)',
                    '&:hover': { 
                      bgcolor: 'rgba(255,255,255,0.2)',
                      transform: 'scale(1.1)'
                    },
                    transition: 'all 0.2s ease'
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
                  bgcolor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(4px)',
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-50%) scale(1.1)'
                  },
                  transition: 'all 0.2s ease'
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
                  bgcolor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(4px)',
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-50%) scale(1.1)'
                  },
                  transition: 'all 0.2s ease'
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
                    maxWidth: '600px',
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  {images[currentIndex].caption}
                </Typography>
              )}

              {/* Modal Pagination Dots */}
              <PaginationDots 
                total={images.length} 
                current={currentIndex} 
                onDotClick={setCurrentIndex}
              />
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}

export default memo(MediaDisplay); 