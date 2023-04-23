import React, { useState, useEffect, memo, useRef } from "react";
import { useNavigate } from "react-router-dom";

const CountdownTimer = ({ targetDate,text, contestId, portfolioId, isDummy, contestName, redirect, minEntry, entry }) => {
  //console.log(targetDate,text, contestId, portfolioId, isDummy, contestName, redirect)
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());
  const navigate = useNavigate();
  const flag = useRef(true);


  useEffect(() => {
    setTimeout(()=>{
      flag.current = true;
    }, 10000)
    
    const timerId = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [targetDate]);

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

  // async function updateStatus(){
  //   const res = await fetch(`${baseUrl}api/v1/contest/${contestId}/updateStatus`, {
  //     method: "PATCH",
  //     credentials:"include",
  //     headers: {
  //         "content-type" : "application/json",
  //         "Access-Control-Allow-Credentials": true
  //     },
  //     body: JSON.stringify({
  //       status: "Cancelled"
  //     })
  //   });
  
  //   const updateContestStatus = await res.json();

  // }

  const { days, hours, minutes, seconds } = timeRemaining

  console.log(timeRemaining.total <= 0 , !isDummy , flag.current , redirect, entry , minEntry)
  // if(timeRemaining.total <= 0 && entry < minEntry){
  //   //console.log("in timer if");
  //   updateStatus().then(()=>{})
  //   navigate(`/battleground/${contestName}`, {
  //     state: {isContestCancelled: true, isDummy: true, redirect: false}
  //   });
  // } else 
  if(timeRemaining.total <= 0 && !isDummy && flag.current && redirect){
    console.log("timer running 2nd")
    navigate(`/battleground/result`, {
      state: {contestId: contestId, portfolioId: portfolioId}
    });
  } else if(timeRemaining.total <= 0 && isDummy && redirect){
    flag.current = (false)
    //console.log("timer running 1st")
    navigate(`/battleground/${contestName}`, {
      state: {contestId: contestId, portfolioId: portfolioId, isDummy: false, redirect: true}
    });
  }


  if (timeRemaining.total <= 0 && text !== "Contest Ends") {
    return <div>{text}</div>
  }

  //console.log("time difference", timeRemaining.total)



  return (
    <div>
      {days >= 0 &&
      `${days} days, ${hours} hrs, ${minutes} mins, ${seconds} seconds` 
      }
    </div>
  );
};

export default memo(CountdownTimer);
