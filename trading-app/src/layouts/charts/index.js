import React, { useState, useEffect, useContext } from 'react';
import CandlestickChart from './chart';
import io from 'socket.io-client';
import { userContext } from "../../AuthContext";
import { useLocation } from 'react-router-dom';


const Index = () => {
  const [response, setResponse] = useState("");
  const getDetails = useContext(userContext);
  const location = useLocation();
  console.log('location', location.search);
  const [timeFrame, setTimeFrame] = useState(15);
  const [minuteTimeframe, setMinuteTimeframe] = useState(15);
  const [period, setPeriod] = useState('MINUTE'); // Change this to set the timeframe
  const [historicalData, setHistoricalData] = useState([]);
  const [instrument, setInstrument] = useState(location?.search?.split('=')[1] ?? 'NIFTY-I')
  const [livePoints, setLivePoints] = useState([]);
  // const [liveData, setLiveData] = useState();
  const socketUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:9000/";

  const socket = io.connect(socketUrl);
  useEffect(() => {
    

    socket.on('connect', () => {
      socket.emit('userId', getDetails.userDetails._id);
      getHistory(); // Get the history right after establishing the WebSocket connection
      getLive();
    });

    socket.on('HistoryOHLCResult', data => {
      // Convert and set the historical data
      console.log('setting historical data', data.length);
      setLivePoints([]);
      setHistoricalData(convertData(data.Result.reverse()));
      // console.log('history', convertData(data.Result));
    });


    // Function to convert the data format to what the chart expects
    function convertData(data) {
      return data.map(item => ({
        time: item.LastTradeTime + 19800,
        open: item.Open,
        high: item.High,
        low: item.Low,
        close: item.Close,
      }));
    }

    const getHistory = () => {
      console.log('calling getHistory', period, timeFrame);
      socket.emit('GetHistory', {
        MessageType: 'GetHistory',
        Exchange: 'NFO',
        InstrumentIdentifier: instrument,
        Periodicity: period,
        Period: timeFrame,
      });
    }

    console.log("period", period, timeFrame)
    const getLive = () => {
      socket.emit('SubscribeRealtime', {
        MessageType: 'SubscribeRealtime',
        Exchange: 'NFO',
        InstrumentIdentifier: instrument,
      });
    }

    const now = new Date();
    now.setHours(now.getHours()); // +5:30 for Indian Standard Time
    now.setMinutes(now.getMinutes()); // +5:30 for Indian Standard Time

    let nextMark;
    if (now.getHours() < 9 || (now.getHours() === 9 && now.getMinutes() < 15) || now.getDay() === 0 || now.getDay() === 6) {
      // If current time is before 9:15 or it's a weekend, set next mark to next working day's 9:15
      const nextWorkingDay = now.getDay() === 0 ? 1 : 2; // If today is Sunday, next working day is 1 day after. Else, it's 2 days after.
      nextMark = new Date(now.getFullYear(), now.getMonth(), now.getDate() + nextWorkingDay, 9, 15, 0, 0);
    } else if (now.getHours() > 15 || (now.getHours() === 15 && now.getMinutes() > 30)) {
      // If current time is after 15:30, set next mark to next working day's 9:15
      const nextWorkingDay = now.getDay() === 5 ? 3 : 1; // If today is Friday, next working day is 3 days after. Else, it's 1 day after.
      nextMark = new Date(now.getFullYear(), now.getMonth(), now.getDate() + nextWorkingDay, 9, 15, 0, 0);
    } else {
      // If it's working hours, set next mark to the next timeframe mark
      const currentMinuteMark = Math.floor(now.getMinutes() / minuteTimeframe) * minuteTimeframe;
      nextMark = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), currentMinuteMark + minuteTimeframe, 0, 0);
    }

    const intervalTime = minuteTimeframe * 60 * 1000;

    // Get the history at the next mark and then every timeframe minutes after that
    const timeoutId = setTimeout(() => {
      getHistory();

      const intervalId = setInterval(() => {
        const currentTime = new Date();
        currentTime.setHours(currentTime.getHours()); // +5:30 for Indian Standard Time
        currentTime.setMinutes(currentTime.getMinutes()); // +5:30 for Indian Standard Time

        if (!(currentTime.getHours() < 9 || currentTime.getHours() > 15 || (currentTime.getHours() === 15 && currentTime.getMinutes() > 30) || currentTime.getDay() === 0 || currentTime.getDay() === 6)) {
          getHistory();
        }
      }, intervalTime);

      return () => clearInterval(intervalId);
    }, nextMark - now);

    console.log('nextMark', nextMark);

    return () => {
      clearTimeout(timeoutId);
      socket.disconnect();
    };
  }, [minuteTimeframe]);

  const handleChange = (event) => {
    const selectedValue = parseInt(event.target.value, 10);
    console.log("selectedValue", selectedValue)
    setMinuteTimeframe(selectedValue);
    setTimeFrame(selectedValue / 60 >= 1 ? Math.floor(selectedValue / 60) : selectedValue);
    if (selectedValue / 60 >= 1 && selectedValue < 1440) {
      setPeriod('HOUR')
    } else if(selectedValue / 1440 >= 1) {
      setPeriod('DAY')
    } else{
      setPeriod('MINUTE')
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ display: 'flex', justifyContent: 'center', margin: '0px', padding: '0px' }}>
        {instrument.split("_")[1]
          ? `${instrument.split("_")[1]} ${instrument.split("_")[4]} ${instrument.split("_")[3]}`
          : instrument}
      </h2>
      <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Time frame</span>
      <select style={{ margin: '20px', fontSize: '14px', padding: '5px', borderRadius: "2px" }} onChange={handleChange}>
        <option value={1} style={{ backgroundColor: '#f0f0f0', color: "#2C2C2C" }} selected={timeFrame === 1 && period === 'MINUTE'}>
          1 minute
        </option>
        <option value={2} style={{ backgroundColor: '#f0f0f0', color: "#2C2C2C" }} selected={timeFrame === 2 && period === 'MINUTE'}>
          2 minutes
        </option>
        <option value={3} style={{ backgroundColor: '#f0f0f0', color: "#2C2C2C" }} selected={timeFrame === 3 && period === 'MINUTE'}>
          3 minutes
        </option>
        <option value={4} style={{ backgroundColor: '#f0f0f0', color: "#2C2C2C" }} selected={timeFrame === 4 && period === 'MINUTE'}>
          4 minutes
        </option>
        <option value={5} style={{ backgroundColor: '#f0f0f0', color: "#2C2C2C" }} selected={timeFrame === 5 && period === 'MINUTE'}>
          5 minutes
        </option>
        <option value={15} style={{ backgroundColor: '#f0f0f0', color: "#2C2C2C" }} selected={timeFrame === 15 && period === 'MINUTE'}>
          15 minutes
        </option>
        <option value={30} style={{ backgroundColor: '#f0f0f0' }} selected={timeFrame === 30 && period === 'MINUTE'}>
          30 minutes
        </option>
        <option value={60} style={{ backgroundColor: '#f0f0f0' }} selected={timeFrame === 1 && period === 'HOUR'}>
          1 hour
        </option>
        <option value={240} style={{ backgroundColor: '#f0f0f0' }} selected={timeFrame === 4 && period === 'HOUR'}>
          4 hours
        </option>
        <option value={1440} style={{ backgroundColor: '#f0f0f0' }} selected={timeFrame === 1 && period === 'DAY'}>
          1 day
        </option>
      </select>
      <CandlestickChart
        socket={socket}
        instrument={instrument}
        historicalData={historicalData}
        minuteTimeframe={minuteTimeframe}
      />
    </div>

  )
}

export default Index