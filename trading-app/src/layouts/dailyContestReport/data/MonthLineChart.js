import { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import MDBox from '../../../components/MDBox';
import { Grid } from '@mui/material';
import dayjs from 'dayjs';

const EChartsDemo = ({monthWiseData}) => {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  // console.log("monthWiseData", monthWiseData)

  useEffect(() => {
    if (!chartInstance) {
      setChartInstance(echarts.init(chartRef.current));
    }
  }, [chartInstance, monthWiseData]);

  useEffect(() => {
    if (chartInstance) {
      chartInstance.setOption({
        title: {
          text: 'Trader wise P&L',
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
            magicType: { type: ['bar'] },
            restore: {},
            saveAsImage: {},
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: monthWiseData.map((e)=>(e?.name)),
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}',
          },
        },
        series: [
          {
            name: 'Net P&L',
            type: 'bar',
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
