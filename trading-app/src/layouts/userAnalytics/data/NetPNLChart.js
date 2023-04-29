import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const EchartsBarChart = ({traderType, dateWiseData}) => {
const chartRef = useRef(null);

useEffect(() => {
const chartInstance = echarts.init(chartRef.current);
const option = {
    title: {
        text: 'Net P&L'
      },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
        type: 'shadow'
        }
    },
    toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          magicType: { type: ['line', 'bar'] },
          saveAsImage: {}
        }
      },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            data: dateWiseData.map((e)=>e.date),
            axisTick: {
            alignWithLabel: true
             }
        }
    ],
    yAxis: [
        {
        type: 'value'
        }
    ],
    series: [
        {
            name: 'Net P&L',
            type: 'bar',
            color:'#1A73E8',
            barWidth: '60%',
            data: dateWiseData.map((e)=>e.npnl),
        }
    ]
};
chartInstance.setOption(option);
}, [dateWiseData]);

return <div ref={chartRef} style={{ width: '100%', height: '300px' }} />;
};

export default EchartsBarChart;