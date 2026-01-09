import { useState } from 'react';
import PhotoFocusModal from './PhotoFocusModal';

export default function CollageGrid({ people }) {
  const [selectedPerson, setSelectedPerson] = useState(null);

  const gradients = [
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ffd3a5 0%, #fdc8c4 100%)',
    'linear-gradient(135deg, #c2e9fb 0%, #a1c4fd 100%)'
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden'
      }}
    >
      {/* COLLAGE GRID (this part blurs) */}
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          filter: selectedPerson ? 'blur(8px) brightness(0.7)' : 'none',
          transition: 'filter 0.3s ease'
        }}
      >
        {people.map((person, idx) => (
          <div
            key={person.id}
            onClick={() => setSelectedPerson(person)}
            style={{
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              background: gradients[idx],
              transition: 'transform 0.2s ease'
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onTouchStart={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
            onTouchEnd={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <img
              src={person.photos[0]}
              alt={`${person.from} to ${person.to}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.9,
                transition: 'opacity 0.3s ease'
              }}
            />
          </div>
        ))}
      </div>

      {/* MODAL (NOT blurred) */}
      {selectedPerson && (
        <PhotoFocusModal
          person={selectedPerson}
          onClose={() => setSelectedPerson(null)}
        />
      )}
    </div>
  );
}
