// src/components/PhotoFocusModal.jsx
import { useState, useEffect } from 'react';

export default function PhotoFocusModal({ person, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [touchStart, setTouchStart] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : person.photos.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < person.photos.length - 1 ? prev + 1 : 0));
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(20px)',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'relative',
          width: '90%',
          maxWidth: '600px',
          transform: isVisible ? 'scale(1)' : 'scale(0.9)',
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.4s ease'
        }}
      >
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '-48px',
            right: 0,
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '48px',
            fontWeight: '300',
            cursor: 'pointer',
            zIndex: 10,
            padding: 0,
            lineHeight: 1,
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          ×
        </button>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative' }}>
            <img
              src={person.photos[currentIndex]}
              alt={`${person.from} to ${person.to}`}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '60vh',
                objectFit: 'contain',
                display: 'block'
              }}
            />

            {person.photos.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(4px)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    fontSize: '32px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 1)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.8)'}
                >
                  ‹
                </button>
                <button
                  onClick={handleNext}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(4px)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    fontSize: '32px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 1)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.8)'}
                >
                  ›
                </button>

                <div style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: '8px'
                }}>
                  {person.photos.map((_, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: idx === currentIndex ? '24px' : '8px',
                        height: '8px',
                        borderRadius: '4px',
                        background: idx === currentIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div style={{
  padding: '14px 16px',
  textAlign: 'center',
  background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
}}>
  <span style={{
    fontSize: '16px',
    fontWeight: 500,
    color: '#333',
    opacity: 0.9
  }}>
    {person.message}
  </span>
</div>

        </div>
      </div>
    </div>
  );
}