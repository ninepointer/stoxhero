import { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';

const CandlestickChart = ({ socket, historicalData, instrument, minuteTimeframe }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const candleSeriesRef = useRef();
  const [liveData, setLiveData] = useState();
  const [livePoints, setLivePoints] = useState([]);

  useEffect(()=>{
    socket.on('RealtimeResult', data => {
        if (data.InstrumentIdentifier == instrument) {
          setLiveData(convertLive(data));
          setLivePoints([...livePoints, data.LastTradePrice]);
        }
    });

      function convertLive(data) {
        return {
          time: data.LastTradeTime + 19800,
          open: data.Open,
          high: Math.max(...livePoints) ?? data.high,
          low: Math.min(...livePoints) ?? data.low,
          close: data.LastTradePrice,
        };
      }
  }, [])

  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, { width: 1350, height: 550 });
    candleSeriesRef.current = chartRef.current.addCandlestickSeries();
  
    // Set initial data
    if (historicalData) {
      candleSeriesRef.current.setData(historicalData);
    }
    const timeScale = chartRef.current.timeScale();
    timeScale.applyOptions({
      crosshair: {
        vertLine: {
          labelVisible: true,
          labelBackgroundColor: "#4C525E"
        }
      },
      timeVisible: true
    });

    return () => {
      // Cleanup chart on component unmount
      chartRef.current.remove();
    };
  }, []);

  useEffect(() => {
    if (!candleSeriesRef.current || !historicalData) return;
  
    // Update chart with historical data
    candleSeriesRef.current.setData(historicalData);
  }, [historicalData]);

//   useEffect(() => {
   
//   }, [liveData]);

// if (!candleSeriesRef.current || !liveData || !historicalData) return;

// Merge live data with the last historical data
const newCandle = liveData;
// console.log('newCandle',newCandle);
// console.log('firstCandle', historicalData[0])
// console.log('lastCandle',typeof lastCandle?.time, lastCandle, minuteTimeframe);

if (newCandle) {
    const lastCandle = historicalData[historicalData.length -1];

  const updatedLastCandle = {
    ...lastCandle,
    time: lastCandle?.time + minuteTimeframe*60,
    close: newCandle?.close,
    high: Math.max(lastCandle?.high, newCandle?.high),
    low: Math.min(lastCandle?.low, newCandle?.low),
  };
//   console.log('updatedLastCandle',updatedLastCandle);
  // Create a new data array with the updated last candle
  const newData = [
      ...historicalData.slice(0,historicalData.length-1),
      updatedLastCandle,    
    ];
//   console.log('newData',newData);
//   console.log('historicalData', historicalData);  

  // Update chart with the merged data
  candleSeriesRef.current.setData(newData);
}

  return <div style={{display:'flex',margin:'auto 0', justifyContent:'center', border:'1px solid black'}} ref={chartContainerRef} />;
};

export default CandlestickChart;

