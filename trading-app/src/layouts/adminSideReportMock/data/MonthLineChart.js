import { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import MDBox from '../../../components/MDBox';
// import { Grid } from '@mui/material';
import dayjs from 'dayjs';

const EChartsDemo = ({cumulativeData, monthWiseData, alignment}) => {

  let data;
  if(alignment === "Company Daily P&L"){
    data = monthWiseData.map((e)=>dayjs(e?.date).format('DD MMM YYYY'));
  } else{
    data = monthWiseData.map((e)=>e?.name);
  }
  


  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
// console.log("names", monthWiseData.map((e)=>e?.name))
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
            magicType: { type: [ 'bar'] },
            restore: {},
            saveAsImage: {},
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: data,
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
            data: monthWiseData?.map((e)=>e?.npnl.toFixed(2)),
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
            name: 'Cumm. Net P&L',
            type: 'bar',
            data: cumulativeData?.map((e)=>e.npnl.toFixed(2)),
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
        ],
      });
    }
  }, [chartInstance, monthWiseData]);

  return <MDBox ref={chartRef} style={{ width: '100%', height: '400px' }} />

};

export default EChartsDemo;
