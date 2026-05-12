import React, { useEffect, useState } from 'react';
import './SplashScreen.css';
import logoImage from '../assets/logo-chatbot.svg';

const SplashScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 5000); // Show splash screen for 3 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="splash-screen">
      <div className="logo-container">
        <div className="logo">
          <img src={logoImage} alt="Chatbot Logo" className="splash-logo" />
        </div>
        <h1 className="logo-text">Chatbot Edukasi</h1>
      </div>
    </div>
  );
};

export default SplashScreen;