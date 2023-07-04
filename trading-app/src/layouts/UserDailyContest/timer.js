import React, { useState, useEffect } from 'react';
import axios from "axios";

const Timer = ({date, setTimeDifference, serverTime, id}) => {
  const [remainingTime, setRemainingTime] = useState(null);
  // const [serverTime, setServerTime] = useState();
  // let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  // const []

  useEffect(() => {
    const targetDate = new Date(date); // Replace with your specific date and time
    const now = new Date(serverTime);
    const intervalId = setInterval(() => {
      now.setSeconds(now.getSeconds() + 1);
      const timeDifference = targetDate - now;
      setTimeDifference(prevArray => {
        const index = prevArray.findIndex(item => item.id === id);
  
        if (index !== -1) {
          // If id exists, update the value
          const updatedArray = [...prevArray];
          updatedArray[index].value = timeDifference;
          return updatedArray;
        } else {
          // If id doesn't exist, push a new element
          return [...prevArray, { id, value: timeDifference }];
        }
      });
      console.log("timeDifference", timeDifference, id)
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
