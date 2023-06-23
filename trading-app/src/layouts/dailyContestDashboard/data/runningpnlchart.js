import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const EChartsChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    let chartInstance = null;
    let data = [];
    let now = new Date(1997, 9, 3);
    let oneDay = 24 * 3600 * 1000;
    let value = Math.random() * 1000;

    const randomData = () => {
      now = new Date(+now + oneDay);
      value = value + Math.random() * 21 - 10;
      return {
        name: now.toString(),
        value: [
          [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
          Math.round(value)
        ]
      };
    };

    // Initialize chart
    chartInstance = echarts.init(chartRef.current);

    const option = {
      title: {
        text: 'Mock P&L'
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          params = params[0];
          var date = new Date(params.name);
          return (
            date.getDate() +
            '/' +
            (date.getMonth() + 1) +
            '/' +
            date.getFullYear() +
            ' : ' +
            params.value[1]
          );
        },
        axisPointer: {
          animation: false
        }
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: false
        }
      },
      series: [
        {
          name: 'Fake Data',
          type: 'line',
          showSymbol: false,
          data: data
        }
      ]
    };

    // Generate initial data
    for (let i = 0; i < 1000; i++) {
      data.push(randomData());
    }

    // Set initial chart option
    chartInstance.setOption(option);

    // Update chart data every second
    setInterval(() => {
      for (let i = 0; i < 5; i++) {
        data.shift();
        data.push(randomData());
      }
      chartInstance.setOption({
        series: [
          {
            data: data
          }
        ]
      });
    }, 1000);

    // Clean up on component unmount
    return () => {
      clearInterval();
      chartInstance.dispose();
    };
  }, []);

  return <div id="main" style={{ width: '100%', height: '400px' }} ref={chartRef}></div>;
};

export default EChartsChart;
