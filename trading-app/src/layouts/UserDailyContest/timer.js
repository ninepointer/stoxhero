import React, { useState, useEffect } from 'react';
import axios from "axios";

const Timer = ({date, setTimeDifference, serverTime, id}) => {
  const [remainingTime, setRemainingTime] = useState(null);
  // const [serverTime, setServerTime] = useState();
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

  // useEffect(() => {
  //   axios.get(`${baseUrl}api/v1/servertime`)
  //     .then((res) => {
  //       setServerTime(res.data.data);
  //     })
  // }, [])

  useEffect(() => {
    const targetDate = new Date(date); // Replace with your specific date and time
    const now = new Date(serverTime);
    const intervalId = setInterval(() => {
      // console.log("timeDifference first", now, targetDate, serverTime)
      // console.log("timeDifference before", now)
      now.setSeconds(now.getSeconds() + 1);
      // console.log("timeDifference after", now)
      const timeDifference = targetDate - now;
      // console.log("timeDifference timer", timeDifference)
      // setTimeDifference(timeDifference) 
      // setTimeDifference(prevArray => [...prevArray, {id: id, value: timeDifference}])
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
