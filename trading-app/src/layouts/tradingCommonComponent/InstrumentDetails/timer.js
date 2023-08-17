import React, { useState, useEffect } from 'react';
import axios from "axios";
import { TiMediaRecord } from 'react-icons/ti';
import MDTypography from '../../../components/MDTypography';
const Timer = ({socket}) => {
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  const [remainingTime, setRemainingTime] = useState(null);
  const [setting, setSetting] = useState([]);
  const [serverTime, setServerTime] = useState("");
  const [color, setColor] = useState();
  const [timerVisibility, setTimerVisibility] = useState(false);
  const [goingOnline, setGoingOnline] = useState();
  const [holiday, setHoliday] = useState([]);
  const [nextTradingDay, setNextTradingDay] = useState([]);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  useEffect(() => {
    axios.get(`${baseUrl}api/v1/readsetting`, {withCredentials: true})
      .then((res) => {
        setSetting(res.data);
    });

    axios.get(`${baseUrl}api/v1/tradingholiday/dates/${new Date(todayDate)}/${new Date(`${todayDate}T23:59:00.000Z`)}`, {withCredentials: true})
    .then((res) => {
      setHoliday(res.data.data);
    });

    axios.get(`${baseUrl}api/v1/tradingholiday/nextTradingDay`, {withCredentials: true})
    .then((res) => {
      setNextTradingDay(res.data.data);
    });
  }, []);

  useEffect(()=>{
    socket.on("serverTime", (data)=>{
      // console.log("serverTime", data)
      setServerTime(data)
    })
  }, [])

  useEffect(() => {

    let date = new Date();
    let weekDay = date.getDay();
    if (weekDay > 0 && weekDay < 6 && holiday === 0) {

      const appStartTime = new Date(setting[0]?.time?.appStartTime);
      const startTimer = new Date(setting[0]?.time?.timerStartTimeInStart);
      const appEndTime = new Date(setting[0]?.time?.appEndTime);
      const endTimer = new Date(setting[0]?.time?.timerStartTimeInEnd);

      console.log("timerStartInOnline", appStartTime, startTimer, appEndTime, endTimer)

      appStartTime.setHours(appStartTime.getHours() - 5);
      appStartTime.setMinutes(appStartTime.getMinutes() - 30);
      const appStartHour = appStartTime.getHours().toString().padStart(2, '0');
      const appStartMinute = appStartTime.getMinutes().toString().padStart(2, '0');

      appEndTime.setHours(appEndTime.getHours() - 5);
      appEndTime.setMinutes(appEndTime.getMinutes() - 30);
      const appEndHour = appEndTime.getHours().toString().padStart(2, '0');
      const appEndMinute = appEndTime.getMinutes().toString().padStart(2, '0');

      startTimer.setHours(startTimer.getHours() - 5);
      startTimer.setMinutes(startTimer.getMinutes() - 30);
      const appStartTimerHour = startTimer.getHours().toString().padStart(2, '0');
      const appStartTimerMinute = startTimer.getMinutes().toString().padStart(2, '0');

      endTimer.setHours(endTimer.getHours() - 5);
      endTimer.setMinutes(endTimer.getMinutes() - 30);
      const appEndTimerHour = endTimer.getHours().toString().padStart(2, '0');
      const appEndTimerMinute = endTimer.getMinutes().toString().padStart(2, '0');



      const timerStartInOnline = new Date(`${todayDate}T${appStartTimerHour}:${appStartTimerMinute}:00.000Z`);
      const appOnlineTime = new Date(`${todayDate}T${appStartHour}:${appStartMinute}:00.000Z`);
      const timerStartInOffline = new Date(`${todayDate}T${appEndTimerHour}:${appEndTimerMinute}:00.822Z`);
      const appOfflineTime = new Date(`${todayDate}T${appEndHour}:${appEndMinute}:00.822Z`);
      // console.log("timer time", timerStartInOnline)
      const now = new Date(serverTime);

      if (now.getTime() >= timerStartInOnline.getTime() && now.getTime() <= appOnlineTime.getTime()) {
        const timeDifference = appOnlineTime - now;

        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        setRemainingTime(`${minutes} mins ${seconds} secs`);
        setTimerVisibility(true);
        setColor("green");
        setGoingOnline(true);
      }
      if (now.getTime() >= timerStartInOffline.getTime() && now.getTime() <= appOfflineTime.getTime()) {
        const timeDifference = appOfflineTime - now;

        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        setRemainingTime(`${minutes} mins ${seconds} secs`);
        setTimerVisibility(true);
        setColor("red");
        setGoingOnline(false);
      }

      if (now.getTime() < timerStartInOnline.getTime()){ 
        let time = new Date(`${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`);
        setRemainingTime(changeDateFormat(time) && `Trading Resumes at ${changeDateFormat(time)}`);
        setColor("red")
        setTimerVisibility(false);
      }

      if(now.getTime() > appOfflineTime.getTime()) {
        // let time = new Date(`${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()+1).padStart(2, '0')}`);
        // console.log("changeDateFormat", changeDateFormat(time))
        setRemainingTime(`Trading Resumes at ${changeDateFormat(nextTradingDay)}`);
        setColor("red")
        setTimerVisibility(false);
      }

      if (now.getTime() > appOnlineTime.getTime() && now.getTime() < timerStartInOffline.getTime()) {
        setRemainingTime("Trading Enabled");
        setColor("green");
        setTimerVisibility(false);
      }
    } else{
      setRemainingTime(changeDateFormat(nextTradingDay) && `Trading Resumes at ${changeDateFormat(nextTradingDay)}`);
      setColor("red")
      setTimerVisibility(false);
    }

  }, [serverTime, setting, nextTradingDay]);

  // useEffect(() => {
  //   return () => {
  //     socket.close();
  //   }
  // }, []);

  function changeDateFormat(givenDate) {

    const date = new Date(givenDate);

    const appStartTime = new Date(setting[0]?.time?.appStartTime);
    const appStartHour = appStartTime.getHours().toString().padStart(2, '0');
    const appStartMinute = appStartTime.getMinutes().toString().padStart(2, '0');

    // Format the date as "dd Month yyyy | hh:mm AM/PM"
    const formattedDate = `${date.getDate()} ${getMonthName(date.getMonth())} ${date.getFullYear()} ${formatTime(appStartHour, appStartMinute)}`;

    console.log(formattedDate);

    // Helper function to get the month name
    function getMonthName(month) {
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      return monthNames[month];
    }

    // Helper function to format time as "hh:mm AM/PM"
    function formatTime(hours, minutes) {
      const meridiem = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes.toString().padStart(2, "0");
      return `${formattedHours}:${formattedMinutes} ${meridiem}`;
    }

    return formattedDate;

  }
  // style={{ display: "flex", justifyContent: "center", alignContent: "center", alignItems: "center" , gap: "5px"}}
  return (
    <div style={ window.outerWidth >= 1200 ? { display: "flex", justifyContent: "center", alignContent: "center", alignItems: "center" , gap: "5px"} : {display: "flex", justifyContent: "center", alignContent: "center", alignItems: "center", flexDirection: "column"}}>
      {timerVisibility ?
        <>
          <p style={{ color: color,  textAlign:"center" }}>{goingOnline ? `You can place trades in` :  `Open trades will be auto squared off in` } </p>
          {/* <span style={{ color: color, backgroundColor: "#D3D3D3", borderRadius: "5px", padding: "2px" }}>{remainingTime}</span></p> */}
          <p style={{ color: color, backgroundColor: "#D3D3D3", borderRadius: "5px", padding: "2px", textAlign:"center", width: window.outerWidth < 1200 && "150px" }}>{remainingTime}</p>
        </>
        :
        <>
        {remainingTime &&
        <div style={{display: "flex", justifyContent: "center", alignContent: "center", alignItems: "center" , gap: "5px"}}>
          <MDTypography
            color={color==="green" ? "success" : "error"}
            style={{display:"flex",alignItems:"center"}}
            >
              <TiMediaRecord sx={{ margin: 2 }} size={15} />
            </MDTypography>
            <p style={{ color: color }}> {remainingTime} </p>
          </div>
        }

        </>
      }
    </div>
  );
};

export default Timer;
