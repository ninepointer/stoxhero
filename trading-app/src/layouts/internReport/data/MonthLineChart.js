import { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import MDBox from '../../../components/MDBox';
import { Grid } from '@mui/material';
import dayjs from 'dayjs';

const EChartsDemo = ({traderType, monthWiseData}) => {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  let data = []
  let name = "";
  let chartType;

  if(traderType === "Daily P&L"){
    data = monthWiseData.map((e)=>dayjs(e?._id?.date).format('DD MMM YYYY'));
    name = "Date wise chart";
    chartType = "line";
  } else{
    data = monthWiseData.map((e)=> e?.name);
    name = "Trader wise chart";
    chartType = "bar";
  }

  useEffect(() => {
    if (!chartInstance) {
      setChartInstance(echarts.init(chartRef.current));
    }
  }, [chartInstance, monthWiseData]);

  useEffect(() => {
    // if (traderType === "Daily P&L") {
      const chart = echarts.init(chartRef.current);

      const options = {
        title: {
          text: name,
          left: 'left',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: true },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ['Net P&L'],
        },
        grid: {
          right: '2%', // Adjust the right margin as per your requirement
          left: '2%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: data,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: `{value}`
            }
          },
        ],
        series: [
          {
            name: 'Net P&L',
            type: chartType,
            data: monthWiseData.map((e)=> e?.npnl?.toFixed(2)),
          },
        ],
      };

      chart.setOption(options);

      return () => {
        chart.dispose();
      };
    // } 
    // else if(traderType === "Trader Wise P&L"){

    //   const chart = echarts.init(chartRef.current);

    //   const options = {
    //     title: {
    //       text: 'Trader Wise Chart',
    //       left: 'left',
    //     },
    //     tooltip: {
    //       trigger: 'axis',
    //       axisPointer: {
    //         type: 'cross',
    //         crossStyle: {
    //           color: '#999'
    //         }
    //       }
    //     },
    //     toolbox: {
    //       feature: {
    //         dataView: { show: true, readOnly: true },
    //         magicType: { show: true, type: ['line', 'bar'] },
    //         restore: { show: true },
    //         saveAsImage: { show: true }
    //       }
    //     },
    //     legend: {
    //       data: ['Net P&L', 'Payout'],
    //     },
    //     grid: {
    //       right: '2%', // Adjust the right margin as per your requirement
    //       left: '2%',
    //       bottom: '2%',
    //       containLabel: true
    //     },
    //     xAxis: [
    //       {
    //         type: 'category',
    //         data: data,
    //         axisPointer: {
    //           type: 'shadow'
    //         }
    //       }
    //     ],
    //     yAxis: [
    //       {
    //         type: 'value',
    //         axisLabel: {
    //           formatter: `{value}`
    //         }
    //       },
    //     ],
    //     series: [
    //       {
    //         name: 'Net P&L',
    //         type: 'bar',
    //         data: npnl,
    //       },
    //     ],
    //   };

    //   chart.setOption(options);

    //   return () => {
    //     chart.dispose();
    //   };
    // }
  }, [chartInstance, monthWiseData]);

  return <MDBox ref={chartRef} style={{ width: '100%', height: '400px' }} />

};

export default EChartsDemo;
