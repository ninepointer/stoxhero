import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import dayjs from 'dayjs';

const EchartsBarChart = ({traderType, dateWiseData}) => {
const chartRef = useRef(null);

useEffect(() => {
const chartInstance = echarts.init(chartRef.current);
const option = {
    title: {
        text: 'Gross P&l, Net P&l, Brokerage'
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
            data: dateWiseData.map((e)=>dayjs(e.date).format('D MMM')),
            axisTick: {
            alignWithLabel: true
             }
        }
    ],
    yAxis: [
        {
        type: 'value',
        name:'PNL Axis'
        },
        {
        type: 'value',
        name: 'Brokerage Axis',
        axisLine: {
            show: true,
            lineStyle: {
                color:'#344767',
            }
          },
        }
    ],
    series: [
        {
            name: 'Gross P&L',
            type: 'bar',
            yAxisIndex:0,
            color:'#2e7d32',
            barWidth: '40%',
            data: dateWiseData.map((e)=>e.gpnl)
        },
        {
            name: 'Net P&L',
            type: 'bar',
            yAxisIndex:0,
            color:'#2e7d95',
            barWidth: '40%',
            data: dateWiseData.map((e)=>e.npnl)
        },
        {
            name: 'Brokerage',
            yAxisIndex:1,
            type: 'line',
            color:'#344767',
            barWidth: '40%',
            data: dateWiseData.map((e)=>e.brokerage)
        },
    ]
};
chartInstance.setOption(option);
}, [dateWiseData]);

return <div ref={chartRef} style={{ width: '100%', height: '300px' }} />;
};

export default EchartsBarChart;