import { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';

const CandlestickChart = ({ socket, historicalData, instrument, minuteTimeframe }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const candleSeriesRef = useRef();
  const [liveData, setLiveData] = useState();
  const [livePoints, setLivePoints] = useState([]);

  useEffect(() => {
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
  }, [minuteTimeframe])

  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, { width: window.outerWidth >= 1200 ? 1200 : 340, height: window.outerWidth >= 1200 ? 468 : 368 });
    candleSeriesRef.current = chartRef.current.addCandlestickSeries();

    // Set initial data
    if (historicalData) {
      const sortedData = historicalData.sort((a, b) => a.time - b.time);
      candleSeriesRef.current.setData(sortedData);
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

    // Sort historicalData array in ascending order by time
    const sortedData = historicalData.sort((a, b) => a.time - b.time);

    // Update chart with sorted historical data
    candleSeriesRef.current.setData(sortedData);
  }, [historicalData]);


  // Merge live data with the last historical data
  const newCandle = liveData;

  if (newCandle) {
    const lastCandle = historicalData[historicalData.length - 1];

    const updatedTime = lastCandle ? lastCandle?.time : lastCandle?.time + minuteTimeframe * 60

    // console.log("updatedTime", updatedTime, minuteTimeframe, historicalData[historicalData.length - 1])
    const updatedLastCandle = {
      ...lastCandle,
      time: updatedTime,
      close: newCandle?.close,
      high: Math.max(lastCandle?.high, newCandle?.high),
      low: Math.min(lastCandle?.low, newCandle?.low),
    };

    // Create a new data array with the updated last candle
    const newData = [
      ...historicalData.slice(0, historicalData.length - 1),
      updatedLastCandle,
    ];

    // Update chart with the merged data
    const sortedData = newData.sort((a, b) => a.time - b.time);
    candleSeriesRef.current.setData(sortedData);
  }

  //width: "1200px", height: "480px",
  return <div style={{ border: "1px solid black" }} ref={chartContainerRef} />;
};

export default CandlestickChart;