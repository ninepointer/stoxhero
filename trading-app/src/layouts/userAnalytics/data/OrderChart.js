import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import dayjs from 'dayjs';

const EchartsBarChart = ({traderType, dateWiseData}) => {
const chartRef = useRef(null);

useEffect(() => {
const chartInstance = echarts.init(chartRef.current);
const option = {
    title: {
        text: 'Orders and Brokerage'
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
    legend: {
        data: ['Orders', 'Brokerage']
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
            data:  dateWiseData.map((e)=>dayjs(e.date).format('D MMM')),
            axisTick: {
            alignWithLabel: true
             }
        }
    ],
    yAxis: [
        {
        type: 'value',
        name:'Orders'
        },
        {
        type: 'value',
        name:'Brokerage'
        }
    ],
    series: [
        {
            name: 'Orders',
            type: 'bar',
            barWidth: '30%',
            yAxisIndex:0,
            color: '#344767',
            data: dateWiseData.map((e)=>e.noOfTrade)
        },
        {
            name: 'Brokerage',
            type: 'bar',
            barWidth: '30%',
            yAxisIndex:1,
            color: '#2ff000',
            data: dateWiseData.map((e)=>e.brokerage)
        },
    ]
};
chartInstance.setOption(option);
}, [dateWiseData]);

return <div ref={chartRef} style={{ width: '100%', height: '300px' }} />;
};

export default EchartsBarChart;