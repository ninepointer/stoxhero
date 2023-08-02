import { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import MDBox from '../../../components/MDBox';
import { Grid } from '@mui/material';
import dayjs from 'dayjs';

const EChartsDemo = ({traderType, monthWiseData, liveUser, expiredUser}) => {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  let data = [];
  let payout = [];
  let npnl = [];

  if(traderType === "Daily P&L"){
    data = monthWiseData.map((e)=>dayjs(e?._id?.date).format('DD MMM YYYY'));
  } else{
    let data1 = liveUser.map((e)=> e?.name);
    let data2 = expiredUser.map((e)=> e?.name);

    let pay1 = liveUser.map((e)=> e?.payout?.toFixed(2));
    let pay2 = expiredUser.map((e)=> e?.payout?.toFixed(2));

    let net1 = liveUser.map((e)=> e?.npnl?.toFixed(2));
    let net2 = expiredUser.map((e)=> e?.npnl?.toFixed(2));

    data = data1.concat(data2);
    npnl = net1.concat(net2);
    payout = pay1.concat(pay2);
  }


  useEffect(() => {
    if (!chartInstance) {
      setChartInstance(echarts.init(chartRef.current));
    }
  }, [chartInstance, monthWiseData]);

    useEffect(() => {
      if (traderType === "Daily P&L") {
        const chart = echarts.init(chartRef.current);

        const options = {
          title: {
            text: 'Subscription Wise Chart',
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
              type: 'bar',
              data: monthWiseData.map((e)=> e?.npnl),
            },
          ],
        };
  
        chart.setOption(options);
  
        return () => {
          chart.dispose();
        };
      } else if(traderType === "Trader Wise P&L"){

        const chart = echarts.init(chartRef.current);

        const options = {
          title: {
            text: 'Trader Wise Chart',
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
            data: ['Net P&L', 'Payout'],
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
              type: 'bar',
              data: npnl,
            },
            {
              name: 'Payout',
              type: 'bar',
              data: payout,
            },
          ],
        };
  
        chart.setOption(options);
  
        return () => {
          chart.dispose();
        };
      }
    }, [chartInstance, monthWiseData, liveUser, expiredUser]);


  return <MDBox ref={chartRef} style={{ width: '100%', height: '400px' }} />

};

export default EChartsDemo;
