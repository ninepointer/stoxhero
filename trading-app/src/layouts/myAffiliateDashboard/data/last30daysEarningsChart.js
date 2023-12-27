import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import MDBox from '../../../components/MDBox';
import moment from 'moment'

const EchartsBarChart = ({chartData}) => {
const chartRef = useRef(null);
// {
//   "_id": "2023-12-23",
//   "totalOrder": 1,
//   "totalSignupEarnings": 10,
//   "totalTestzoneEarnings": 0,
//   "totalTenxEarnings": 0,
//   "totalEarnings": 10
// },
const dates = chartData?.map((e)=>{
  let newDate = new Date(e?._id)
  let utcDateString = newDate.toLocaleString("en-US", { timeZone: "UTC" });
  return moment.utc(utcDateString).utcOffset('+00:00').format('DD-MMM')
})

const testzone = chartData?.map((e)=>{
  return (e?.totalTestzoneEarnings)?.toFixed(0)
})

const total = chartData?.map((e)=>{
  return (e?.totalEarnings)?.toFixed(0)
})

const tenx = chartData?.map((e)=>{
  return (e?.totalTenxEarnings)?.toFixed(0)
})

console.log(dates, testzone, total, tenx)

useEffect(() => {
  const chartInstance = echarts.init(chartRef.current);

    const option = {
      title: {
        text: 'Last 30 days daily earnings'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: dates,
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          name: 'Total',
          type: 'bar',
          barWidth: '10%',
          data: total,
        },
        {
          name: 'TenX',
          type: 'bar',
          barWidth: '10%',
          data: tenx,
        },
        {
          name: 'TestZone',
          type: 'bar',
          barWidth: '10%',
          data: testzone,
        },
      ],
    };

    chartInstance.setOption(option);
}, [chartData]); // The empty dependency array ensures that the effect runs only once on mount

  return <MDBox ref={chartRef} style={{ minWidth: '100%', height: '350px' }} />
};

export default EchartsBarChart;
