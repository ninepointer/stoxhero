import * as echarts from 'echarts';
import React, { useEffect, useRef } from 'react';
import MDBox from '../../../components/MDBox';
import moment from 'moment';

export default function Charts({battleUsers}) {
    const chartRef = useRef(null);
  // Dummy data for example purposes
  // const data = [
  //   { date: '2023-07-01', virtual: 150, battle: 100, tenx: 200, total: 450 },
  //   { date: '2023-07-02', virtual: 120, battle: 80, tenx: 180, total: 380 },
  //   { date: '2023-07-03', virtual: 180, battle: 150, tenx: 220, total: 550 },
  //   // Add more data entries for each date
  // ];

  console.log("battleUsers", battleUsers)

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

  const options = {
    title: {
      text: 'Daily Unique Battle Users',
      left: 'left',
    },
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
        magicType: { show: true, type: ['bar', 'line'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    legend: {
        data: ['Battle'],
    },
    grid: {
        right: '2%', // Adjust the right margin as per your requirement
        left: '2%',
        bottom: '2%',
        containLabel: true
    },
    // xAxis: {
    //   type: 'category',
    //   data: data.map(item => item.date),
    // },
    xAxis: [
        {
          type: 'category',
          data: battleUsers.map(item => 
            moment.utc(((new Date(item.date)).toLocaleString("en-US", { timeZone: "UTC" }))).utcOffset('+00:00').format('DD-MMM')),
          axisPointer: {
            type: 'shadow'
          }
        }
    ],
    // yAxis: {
    //   type: 'value',
    // },
    yAxis: [
        {
          type: 'value',
        //   name: 'Net P&L/100',
          // min: npnlMin,
          // max: npnlMax,
          // interval: parseInt(interval),
          axisLabel: {
            formatter: `{value}`
          }
        },
    ],
    series: [
      {
        name: 'Battle Users',
        type: 'line',
        data: battleUsers.map(item => item.battle),
      },
    ],
  };

  chart.setOption(options);

  return () => {
    chart.dispose();
  };
}, [battleUsers]);

  return <MDBox ref={chartRef} style={{ minWidth: '100%', height: '400px' }} />;
};
