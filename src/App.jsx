import React, { useState } from 'react';
import { AnimatePresence, motion } from "framer-motion";

import IntroGlow from './components/IntroGlow';
import CakeScene from './components/CakeScene';
import CollageGrid from "./components/CollageGrid";

import './index.css';
import { recipient, people } from './data';

function App() {
  const [stage, setStage] = useState("intro");

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {stage === "intro" && (
          <motion.div
            key="intro"
            style={{ height: "100%" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <IntroGlow setStage={setStage} />
          </motion.div>
        )}

        {stage === "cake" && (
          <motion.div
            key="cake"
            style={{ height: "100%" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            <CakeScene
              setStage={setStage}
              recipientName={recipient.name}
            />
          </motion.div>
        )}

        {stage === "collage" && (
          <motion.div
            key="collage"
            style={{ height: "100%" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <CollageGrid people={people} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
