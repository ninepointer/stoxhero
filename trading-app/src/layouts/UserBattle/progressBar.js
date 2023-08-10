import React, { useState } from 'react';
import './ProgressBar.css';

function ProgressBar({progress}) {

  const fillWidth = {
    width: `${progress}%`,
    backgroundColor: "white"
  };

  return (
    <div className="progress-bar-container">
      <div className="progress-bar-fill" style={fillWidth}>
      </div>
    </div>
  );
}

export default ProgressBar;
