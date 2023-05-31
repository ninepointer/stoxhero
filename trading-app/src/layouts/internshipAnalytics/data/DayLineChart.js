import { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import MDBox from '../../../components/MDBox';
import { Grid } from '@mui/material';

const EChartsDemo = (traderType) => {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    if (!chartInstance) {
      setChartInstance(echarts.init(chartRef.current));
    }
  }, [chartInstance]);

  useEffect(() => {
    if (chartInstance) {
      chartInstance.setOption({
        title: {
          text: 'Yesterday\'s P&L',
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {},
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none',
            },
            dataView: { readOnly: true },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {},
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: ['9:15', '9:16', '9:17', '9:18', '9:19', '9:20', '9:21','9:22','9:23','9:24','9:25','9:26','9:27'],
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}',
          },
        },
        series: [
          {
            name: 'Gorss P&L',
            type: 'line',
            data: [10000, 11000, 13000, 5000, 4000, 6000, 7000, 5000, 3000, 2000, 1000, 500, 800],
            markPoint: {
              data: [
                { type: 'max', name: 'Max' },
                { type: 'min', name: 'Min' },
              ],
            },
            markLine: {
              data: [{ type: 'average', name: 'Avg' }],
            },
          },
          {
            name: 'Net P&L',
            type: 'line',
            data: [9000, 9500, 12500, 3500, 2800, 4300, 5800, 3000, 500, -1500, -3000, -3200, -2300],
            markPoint: {
              data: [
                { name: 'Hello', value: 7000, xAxis: 6, yAxis: -1.5 },
              ],
            },
            markLine: {
              data: [
                { type: 'average', name: 'Avg' },
                [
                  {
                    symbol: 'none',
                    x: '90%',
                    yAxis: 'max',
                  },
                  {
                    symbol: 'circle',
                    label: {
                      position: 'start',
                      formatter: 'Max',
                    },
                    type: 'max',
                    name: 'Hello',
                  },
                ],
              ],
            },
          },
          
        ],
      });
    }
  }, [chartInstance]);

  return <MDBox ref={chartRef} style={{ width: '100%', height: '400px' }} />

};

export default EChartsDemo;



