import React,{useState, useEffect} from 'react';
import CandlestickChart from './chart';
import io from 'socket.io-client';

const Index = () => {
    const [response, setResponse] = useState("");
    const[timeFrame, setTimeFrame] = useState(15);

    const [minuteTimeframe, setMinuteTimeframe] = useState(15);
    const [period, setPeriod] = useState('MINUTE'); // Change this to set the timeframe
  const [historicalData, setHistoricalData] = useState([]);
  const [liveData, setLiveData] = useState([]);

  useEffect(() => {
    const socket = io.connect('http://localhost:9000');

    socket.on('connect', () => {
      getHistory(); // Get the history right after establishing the WebSocket connection
      getLive();
    });

    socket.on('HistoryOHLCResult', data => {
      // Convert and set the historical data
      setHistoricalData(convertData(data.Result));
    });

    socket.on('RealtimeResult', data => {
      // Set the live data
      setLiveData(convertData(data));
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
        InstrumentIdentifier: 'NIFTY-I',
        Periodicity: period,
        Period: timeFrame,
      });
    }
    const getLive = () => {
      socket.emit('SubscribeRealtime', {
        MessageType: 'SubscribeRealtime',
        Exchange: 'NFO',
        InstrumentIdentifier: 'NIFTY-I',
      });
    }

    const now = new Date();
    now.setHours(now.getHours() + 5); // +5:30 for Indian Standard Time
    now.setMinutes(now.getMinutes() + 30); // +5:30 for Indian Standard Time

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
        currentTime.setHours(currentTime.getHours() + 5); // +5:30 for Indian Standard Time
        currentTime.setMinutes(currentTime.getMinutes() + 30); // +5:30 for Indian Standard Time

        if (!(currentTime.getHours() < 9 || currentTime.getHours() > 15 || (currentTime.getHours() === 15 && currentTime.getMinutes() > 30) || currentTime.getDay() === 0 || currentTime.getDay() === 6)) {
          getHistory();
        }
      }, intervalTime);

      return () => clearInterval(intervalId);
    }, nextMark - now);

    return () => {
      clearTimeout(timeoutId);
      socket.disconnect();
    };
  }, [minuteTimeframe]);

    const handleChange = (event) =>{
        const selectedValue = parseInt(event.target.value, 10);
        setMinuteTimeframe(selectedValue);
        setTimeFrame(selectedValue/60 >= 1? Math.floor(selectedValue/60):selectedValue); 
        if(selectedValue/60 >= 1){
          setPeriod('HOUR')
        }else{
          setPeriod('MINUTE')
        }
        console.log("Selected timeframe:", selectedValue);
    }
  
  return (
    <div>
        <select onChange={handleChange}>
            <option value={1}>1 minute</option>
            <option value={5}>5 minutes</option>
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
            <option value={240}>4 hours</option>
        </select>
        <CandlestickChart historicalData={historicalData.reverse()} liveData={liveData}/>
    </div>
  )
}

export default Index