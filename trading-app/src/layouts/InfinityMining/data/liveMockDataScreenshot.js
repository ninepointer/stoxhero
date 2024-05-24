import React from 'react';
import html2canvas from 'html2canvas';
import LiveMockDataScreenshot from '../data/liveMockDataScreenshot';

const YourComponent = () => {
  const handleButtonClick = () => {
    const componentRef = document.getElementById('screenshot-component');

    if (componentRef) {
      html2canvas(componentRef).then(canvas => {
        const screenshotData = canvas.toDataURL('image/png');

        // Create a download link
        const link = document.createElement('a');
        link.href = screenshotData;
        link.download = 'screenshot.png';
        link.click();
      });
    }
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Download Screenshot</button>

      <div id="screenshot-component">
        <LiveMockDataScreenshot />
      </div>
    </div>
  );
};

export default YourComponent;
