import React, { useState, useEffect, memo, useRef } from "react";
import { useNavigate } from "react-router-dom";

const CountdownTimer = ({ targetDate,text, contestId, portfolioId, isDummy, contestName, redirect }) => {
  console.log(targetDate,text, contestId, portfolioId, isDummy, contestName, redirect)
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());
  const navigate = useNavigate();
  const flag = useRef(true);


  useEffect(() => {
    const timerId = setInterval(() => {

      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  function calculateTimeRemaining() {
    const timeDiff = Date.parse(targetDate) - Date.parse(new Date());
    const seconds = Math.floor((timeDiff / 1000) % 60);
    const minutes = Math.floor((timeDiff / 1000 / 60) % 60);
    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    return {
      total: timeDiff,
      days,
      hours,
      minutes,
      seconds,
    };
  }

  const { days, hours, minutes, seconds } = timeRemaining

  console.log(timeRemaining.total <= 0 , !isDummy , flag.current , redirect)

 if(timeRemaining.total <= 0 && !isDummy && flag.current && redirect){
    console.log("timer running 2nd")
    navigate(`/battleground`, {
      state: {contestId: contestId, portfolioId: portfolioId}
    });
  } else if(timeRemaining.total <= 0 && isDummy && redirect){
    flag.current = (false)
    console.log("timer running 1st")
    navigate(`/battleground/${contestName}`, {
      state: {contestId: contestId, portfolioId: portfolioId, isDummy: false, redirect: true}
    });
  }

  if (timeRemaining.total <= 0) {
    return <div>{text}</div>
  }



  return (
    <div>
      {days} days, {hours} hrs, {minutes} mins, {seconds} sec
    </div>
  );
};

export default memo(CountdownTimer);
