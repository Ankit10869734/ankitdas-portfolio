import React from 'react';
import { motion, AnimatePresence } from "framer-motion";

function CakeScene({ setStage, recipientName }) {
  const [isBlowing, setIsBlowing] = React.useState(false);
  const [extinguishedCandles, setExtinguishedCandles] = React.useState([]);
  const [showExit, setShowExit] = React.useState(false);
  const totalCandles = 5;

  const handleBlow = () => {
    if (isBlowing) return;
    setIsBlowing(true);

    const candles = Array.from({ length: totalCandles }, (_, i) => i);

    candles.forEach((candle, index) => {
      setTimeout(() => {
        setExtinguishedCandles(prev => [...prev, candle]);
      }, index * 200);
    });

    // Start exit animation
    setTimeout(() => {
      setShowExit(true);
    }, totalCandles * 200 + 500);
  };

  return (
    <div className="cake-container">
      <div className="cake-content">
        <h1 className="birthday-text">Happy Birthday {recipientName}</h1>

        <div className="cake">
          <div className="candles">
            {Array.from({ length: totalCandles }, (_, i) => (
              <div key={i} className="candle">
                <div className={`flame ${extinguishedCandles.includes(i) ? 'out' : ''}`} />
                <div className="wick" />
                <div className="candle-body" />
              </div>
            ))}
          </div>

          <div className="cake-layer cake-top" />
          <div className="cake-layer cake-middle" />
          <div className="cake-layer cake-bottom" />
        </div>

        <button
          className={`blow-button ${isBlowing ? 'blowing' : ''}`}
          onClick={handleBlow}
          disabled={isBlowing}
        >
          {isBlowing ? 'Blowing...' : 'Tap to blow the candles'}
        </button>

        {isBlowing && <div className="airflow" />}
      </div>

      {/* CENTER-EXPANDING EXIT WITH PROPER LIFECYCLE */}
      <AnimatePresence>
        {showExit && (
          <motion.div
            key="exit"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 3, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            onAnimationComplete={() => {
              // Move to collage ONLY after animation finishes
              setStage("collage");
            }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              width: "200vmax",
              height: "200vmax",
              background:
                "radial-gradient(circle, #ffffff 0%, #fff5f5 40%, #ffe5f0 70%)",
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              zIndex: 9999,
              pointerEvents: "none"
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default CakeScene;
