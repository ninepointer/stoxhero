import React, { useState, useEffect } from 'react';

const Timer = () => {
  const [remainingTime, setRemainingTime] = useState(null);

  useEffect(() => {
    const targetDate = new Date('2023-07-23T10:00:00'); // Replace with your specific date and time

    const intervalId = setInterval(() => {
      const now = new Date();
      const timeDifference = targetDate - now;

      if (timeDifference > 0) {
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        setRemainingTime(`${days} days ${hours} hrs ${minutes} mins ${seconds} secs`);
      } else {
        clearInterval(intervalId);
        setRemainingTime('Contest Started');
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div>
      <p>{remainingTime}</p>
    </div>
  );
};

export default Timer;
