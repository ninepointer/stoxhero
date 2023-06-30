import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const EchartsComponent = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: true },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      legend: {
        data: ['Net P&L(StoxHero)', 'Net P&L(Infinity)']
      },
      grid: {
        right: '2%', // Adjust the right margin as per your requirement
        left: '2%',
        bottom: '2%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['20-Jan(M)', '21-Jan(T)', '22-Jan(W)', '23-Jan(T)', '24-Jan(F)', '26-Jan(M)', '29-Jan(T)', '30-Jan(F)', '01-Feb(M)', '02-Feb(T)', '03-Feb(W)', '04-Feb(T)'],
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Net P&L',
          min: -250000,
          max: 250000,
          interval: 25000,
          axisLabel: {
            formatter: `{value} ₹`
          }
        },
      ],
      series: [
        {
          name: 'Net P&L(StoxHero)',
          type: 'bar',
          tooltip: {
            formatter: '{c} ₹'
          },
          data: [
            -10000, -20000, -45000, -32000, 30000, 23000, 80000, -155000, 23000, 15000, -220000, 15000
          ]
        },
        {
          name: 'Net P&L(Infinity)',
          type: 'bar',
          tooltip: {
            formatter: '{c} ₹'
          },
          data: [
            -12000, -10000, -45000, -38000, 10000, 23000, 50000, -255000, 25000, 25000, -220000, 15000
          ]
        },
      ]
    };

    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ minWidth: '100%', height: '400px' }} />;
};

export default EchartsComponent;
