import * as echarts from 'echarts';
import React, { useEffect, useRef } from 'react';
import MDBox from '../../../components/MDBox';
import moment from 'moment';

export default function Charts({ dailyUsers }) {
  const chartRef = useRef(null);
  // Dummy data for example purposes

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    const options = {
      title: {
        text: 'Daily Unique Stock Users',
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
        data: ['Stock'],
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
          data: dailyUsers.map(item =>
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
          axisLabel: {
            formatter: `{value}`
          }
        },
      ],
      series: [
        {
          name: 'Stock Users',
          type: 'line',
          data: dailyUsers.map(item => item.stockTrading),
        },
      ],
    };

    chart.setOption(options);

    return () => {
      chart.dispose();
    };
  }, [dailyUsers]);

  return <MDBox ref={chartRef} style={{ minWidth: '100%', height: '400px' }} />;
};
