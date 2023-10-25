import { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import MDBox from '../../../components/MDBox';
import { Grid } from '@mui/material';
import dayjs from 'dayjs';

const EChartsDemo = ({traderType, monthWiseData}) => {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    if (!chartInstance) {
      setChartInstance(echarts.init(chartRef.current));
    }
  }, [chartInstance, monthWiseData]);

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
          data: monthWiseData.map((e)=>dayjs(e.date).format('MMM YYYY')),
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}',
          },
        },
        series: [
          {
            name: 'Gross P&L',
            type: 'line',
            data: monthWiseData.map((e)=>e.gpnl.toFixed(2)),
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
            data: monthWiseData.map((e)=>e.npnl.toFixed(2)),
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
  }, [chartInstance, monthWiseData]);

  return <MDBox ref={chartRef} style={{ width: '100%', height: '400px' }} />

};

export default EChartsDemo;
