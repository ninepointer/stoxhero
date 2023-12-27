import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import MDBox from '../../../components/MDBox';
import moment from 'moment'

const EchartsBarChart = ({chartData}) => {
const chartRef = useRef(null);
const dates = chartData?.map((e)=>{
  let newDate = new Date(e?._id)
  let utcDateString = newDate.toLocaleString("en-US", { timeZone: "UTC" });
  return moment.utc(utcDateString).utcOffset('+00:00').format('DD-MMM')
})

const order = chartData?.map((e)=>{
  return (e?.totalOrder)?.toFixed(0)
})
useEffect(() => {
  const chartInstance = echarts.init(chartRef.current);

    const option = {
      title: {
        text: 'Last 30 days orders'
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
          name: 'Direct',
          type: 'line',
          barWidth: '60%',
          data: order,
        },
      ],
    };

    chartInstance.setOption(option);
}, [chartData]); // The empty dependency array ensures that the effect runs only once on mount

  return <MDBox ref={chartRef} style={{ minWidth: '100%', height: '410px' }} />
};

export default EchartsBarChart;
