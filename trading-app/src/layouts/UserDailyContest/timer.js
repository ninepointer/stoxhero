import React, { memo, useState, useEffect } from 'react';

const Timer = ({socket, date, setTimeDifference, id, elem}) => {
  const [remainingTime, setRemainingTime] = useState(null);
  const [serverTime, setServerTime] = useState();

  useEffect(()=>{
    socket.on("serverTime", (data)=>{
      // console.log("serverTime", data)
      setServerTime(data)
    })
  }, [])

  useEffect(() => {
    const targetDate = new Date(date); // Replace with your specific date and time
    const now = new Date(serverTime);
    const timeDifference = targetDate - now;
    // console.log("timediffrence timer", timeDifference)
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
    // console.log("timeDifference", timeDifference, id)
    if (timeDifference > 0) {
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      setRemainingTime(`${days} days ${hours} hrs ${minutes} mins ${seconds} secs`);
    } else if(timeDifference <= 0) {
      setRemainingTime('Contest Started');
    }
  }, [serverTime]);

  useEffect(() => {
    return () => {
      socket.close();
    }
  }, []);

  return (
    <div>
      <p style={{color: elem.entryFee>0 ? "white" : "black"}}>{remainingTime}</p>
    </div>
  );
};

export default memo(Timer);
