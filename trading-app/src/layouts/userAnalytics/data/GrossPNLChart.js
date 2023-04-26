import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const EchartsBarChart = () => {
const chartRef = useRef(null);

useEffect(() => {
const chartInstance = echarts.init(chartRef.current);
const option = {
    title: {
        text: 'Gross P&L'
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
            data: ['12-Apr', '13-Apr', '14-Apr', '15-Ap', '16-Apr', '17-Apr', '18-Apr', '19-Apr', '20-Apr', '21-Ap', '24-Apr', '25-Apr', '26-Apr'],
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
            name: 'Gross P&L',
            type: 'bar',
            color:'#2e7d32',
            barWidth: '60%',
            data: [55, 102, -200, 34, 39, 33, 22, 102, 200, 34, 39, 33, 22]
        }
    ]
};
chartInstance.setOption(option);
}, []);

return <div ref={chartRef} style={{ width: '100%', height: '300px' }} />;
};

export default EchartsBarChart;