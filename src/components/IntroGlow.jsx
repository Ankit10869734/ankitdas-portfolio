import React from 'react';

function IntroGlow({ setStage }) {
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    const delayTimer = setTimeout(() => {
      setIsAnimating(true);
    }, 500);

    const transitionTimer = setTimeout(() => {
      setStage("cake");
    }, 3500);

    return () => {
      clearTimeout(delayTimer);
      clearTimeout(transitionTimer);
    };
  }, [setStage]);

  return (
    <div className="intro-container">
      <div className={`glow-circle ${isAnimating ? 'expand' : ''}`}></div>
    </div>
  );
}

export default IntroGlow;