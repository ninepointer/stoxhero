import React from 'react';
import style from './ProgressBar.module.css';

function ProgressBar({entryFee, progress}) {

  const fillWidth = {
    width: `${progress}%`,
    backgroundColor: entryFee > 0 ? "#ffffff" : "#fb8c00"
  };

  return (
    <div className={style.progressBarContainer}>
      <div className={style.progressBarFill} style={fillWidth}>
      </div>
    </div>
  );
}

export default ProgressBar;
