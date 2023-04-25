import { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import MDBox from '../../../components/MDBox';
import { Grid } from '@mui/material';

const EChartsDemo = () => {
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
          text: 'Month wise P&L',
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
          boundaryGap: false,
          data: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
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
            data: [10000, -11000, 13000, 5000, -12000, 12000, 9000],
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
            data: [9000, -12000, 12000, 4000, -13000, 11000, 8000],
            markPoint: {
              data: [
                { name: 'Hello', value: 8000, xAxis: 6, yAxis: -1.5 },
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

  return <MDBox ref={chartRef} style={{ width: '100%', height: '500px' }} />

};

export default EChartsDemo;
