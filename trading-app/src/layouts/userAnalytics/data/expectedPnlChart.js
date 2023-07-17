import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import dayjs from 'dayjs';

const EchartsBarChart = ({traderType, dateWiseData}) => {
const chartRef = useRef(null);

useEffect(() => {
const chartInstance = echarts.init(chartRef.current);
const option = {
    title: {
        text: 'Expected P&L and Risk to Reward Ratio'
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
        data: ['Expected Net P&L', 'Risk-Reward Ratio']
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
        name:'PNL Axis',
        axisLine: {
            // show: true,
            lineStyle: {
                color:'#2e7d95',
            }
          },
        },
        {
        type: 'value',
        name: 'Risk-Reward Axis',
        axisLine: {
            // show: true,
            lineStyle: {
                color:'#ff0000',
            }
          },
        }
    ],
    series: [
        {
            name: 'Expected Net P&L',
            type: 'line',
            yAxisIndex:0,
            color:'#2e7d95',
            barWidth: '40%',
            data: dateWiseData.map((e)=>e.expected_pnl)
        },
        {
            name: 'Risk-Reward Ratio',
            yAxisIndex:1,
            type: 'line',
            color:'#ff0000',
            barWidth: '40%',
            data: dateWiseData.map((e)=>e.riskRewardRatio)
        },
    ]
};
chartInstance.setOption(option);
}, [dateWiseData]);

return <div ref={chartRef} style={{ width: '100%', height: '300px' }} />;
};

export default EchartsBarChart;