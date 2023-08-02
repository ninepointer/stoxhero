import React, { useState, useEffect } from 'react';
import axios from "axios";
const Timer = ({socket}) => {
  const [remainingTime, setRemainingTime] = useState(null);
  const [setting, setSetting] = useState([]);
  const [serverTime, setServerTime] = useState("");
  const [color, setColor] = useState()
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  useEffect(() => {
    axios.get(`${baseUrl}api/v1/readsetting`, {withCredentials: true})
      .then((res) => {
        setSetting(res.data);
      });
  }, []);

  useEffect(()=>{
    socket.on("serverTime", (data)=>{
      console.log("serverTime", data)
      setServerTime(data)
    })
  }, [])

  useEffect(() => {
    const startTime = new Date("2023-08-02T11:36:00.822Z");
    const startTimeTarget = new Date("2023-08-02T12:38:00.822Z");
    const endTime = new Date("2023-08-02T11:40:00.822Z");
    const endTimeTarget = new Date("2023-08-02T13:52:00.822Z");
    const now = new Date(serverTime);

    if(now.getTime() >= startTime.getTime() && now.getTime() <= startTimeTarget.getTime()){
        const timeDifference = startTimeTarget - now;

        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    
        setRemainingTime(`${minutes} mins ${seconds} secs`);
        setColor("green");
    } 
    if(now.getTime() >= endTime.getTime() && now.getTime() <= endTimeTarget.getTime()){
        const timeDifference = endTimeTarget - now;

        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    
        setRemainingTime(`${minutes} mins ${seconds} secs`);
        setColor("red");
    }

    if(now.getTime() < endTime.getTime() && now.getTime() > endTimeTarget.getTime() && now.getTime() < startTime.getTime() && now.getTime() > startTimeTarget.getTime()){
      setRemainingTime("");
    }

  }, [serverTime]);

  useEffect(() => {
    return () => {
      socket.close();
    }
  }, []);

  return (
    <div style={{display: "flex", justifyContent: "center", alignContent: "center", alignItems: "center", gap: "5px"}}>
      <p style={{color: color}}>{color==="green" ? `App Online in` : `App Offline in`}</p>
      <p style={{color: color, backgroundColor: "#D3D3D3", borderRadius: "5px", padding: "2px"}}>{remainingTime}</p>
    </div>
  );
};

export default Timer;
