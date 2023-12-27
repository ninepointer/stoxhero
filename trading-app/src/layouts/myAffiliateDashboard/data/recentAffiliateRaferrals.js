import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import MDBox from '../../../components/MDBox';

const EchartsBarChart = ({traderType, dateWiseData}) => {
const chartRef = useRef(null);

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
          data: ['17 Dec', '18 Dec', '19 Dec', '20 Dec', '21 Dec', '22 Dec', '23 Dec', '24 Dec'],
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
          data: [100 ,10, 52, 200, 334, 390, 330, 220],
        },
      ],
    };

    chartInstance.setOption(option);
}, []); // The empty dependency array ensures that the effect runs only once on mount

  return <MDBox ref={chartRef} style={{ minWidth: '100%', height: '410px' }} />
};

export default EchartsBarChart;
