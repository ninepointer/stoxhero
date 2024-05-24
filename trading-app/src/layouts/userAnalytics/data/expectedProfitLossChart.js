import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import dayjs from 'dayjs';

const EchartsBarChart = ({traderType, dateWiseData}) => {
const chartRef = useRef(null);

useEffect(() => {
const chartInstance = echarts.init(chartRef.current);
const option = {
    title: {
        text: 'Expected Average Profit and Loss'
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
        data: ['Expected Average Profit', 'Expected Average Loss']
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
            data: dateWiseData.map((e)=>dayjs(e._id).format('D MMM')),
            axisTick: {
            alignWithLabel: true
             }
        }
    ],
    yAxis: [
        {
        type: 'value',
        },
    ],
    series: [
        {
            name: 'Expected Average Profit',
            type: 'line',
            color:'#2e7d95',
            barWidth: '40%',
            data: dateWiseData.map((e)=>e.expected_avg_profit?.toFixed(2))
        },
        {
            name: 'Expected Average Loss',
            type: 'line',
            color:'#ff0000',
            barWidth: '40%',
            data: dateWiseData.map((e)=>e.expected_avg_loss?.toFixed(2))
        },
    ]
};
chartInstance.setOption(option);
}, [dateWiseData]);

return <div ref={chartRef} style={{ width: '100%', height: '300px' }} />;
};

export default EchartsBarChart;