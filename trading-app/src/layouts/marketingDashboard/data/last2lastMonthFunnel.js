import React, { useEffect, useRef } from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';
import MDBox from '../../../components/MDBox';

const FunnelChart = ({marketingFunnel}) => {
  const chartRef = useRef(null);
  let totalSignups = (marketingFunnel[0]?.totalSignups);
//   let totalActiveTraders = (marketingFunnel[0]?.totalActiveTraders/marketingFunnel[0]?.totalSignups)*100
//   let thisMonthSignups = (marketingFunnel[0]?.thisMonthSignups/marketingFunnel[0]?.totalSignups)*100
//   let thisMonthtotalActiveTraders = (marketingFunnel[0]?.thisMonthtotalActiveTraders/marketingFunnel[0]?.totalSignups)*100
//   let paidTotaltotalActiveTraders = (marketingFunnel[0]?.paidTotaltotalActiveTraders/marketingFunnel[0]?.totalSignups)*100
//   let paidThisMonthActiveTraders = (marketingFunnel[0]?.paidThisMonthActiveTraders/marketingFunnel[0]?.totalSignups)*100
  
  let totalActiveTraders = (marketingFunnel[0]?.totalActiveTraders)
  let last2lastMonthSignups = (marketingFunnel[0]?.last2lastMonthSignups)
  let last2lastMonthtotalActiveTraders = (marketingFunnel[0]?.last2lastMonthtotalActiveTraders)
  let paidTotaltotalActiveTraders = (marketingFunnel[0]?.paidTotaltotalActiveTraders)
  let paidLast2LastMonthActiveTraders = (marketingFunnel[0]?.paidLast2LastMonthActiveTraders)
  let date = new Date();
  let month = date.getMonth() -1
  const monthNames = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];
  const monthName = monthNames[month - 1];
  
  useEffect(() => {
    const chart = echarts.init(chartRef.current);
    // Define your ECharts options here
    const option = {
      title: {
        text: `${monthName}'s New SignUp Funnel`
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}'
      },
      toolbox: {
        feature: {
          dataView: { readOnly: false },
          restore: {},
          saveAsImage: {}
        }
      },
      legend: {
        data: ['Total SignUps', 'New SignUps', 'Total Active Users', 'New Active Users','Total Paid Users', 'New Paid Users']
      },
      series: [
        {
          name: 'Funnel',
          type: 'funnel',
          left: '10%',
          top: 60,
          bottom: 60,
          width: '80%',
        //   min: 0,
          min: paidLast2LastMonthActiveTraders,
        //   max: 100,
          max: last2lastMonthSignups,
          minSize: '10%',
        //   minSize: paidThisMonthActiveTraders,
          maxSize: '100%',
        //   maxSize: totalSignups,
          sort: 'descending',
          gap: 2,
          label: {
            show: true,
            position: 'inside'
          },
          labelLine: {
            length: 10,
            lineStyle: {
              width: 1,
              type: 'solid'
            }
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1
          },
          emphasis: {
            label: {
              fontSize: 20
            }
          },
          data: [
            { value: paidLast2LastMonthActiveTraders, name: `Paid Users (${monthName}) - ${paidLast2LastMonthActiveTraders}` },
            // { value: paidTotaltotalActiveTraders, name: `Paid Users (Total) - ${paidTotaltotalActiveTraders}` },
            { value: last2lastMonthtotalActiveTraders, name: `Active Users (${monthName}) - ${last2lastMonthtotalActiveTraders}` },
            { value: last2lastMonthSignups, name: `SignUps (${monthName}) - ${last2lastMonthSignups}` },
            // { value: totalActiveTraders, name: `Active Users (Total) - ${totalActiveTraders}` },
            // { value: totalSignups, name: `SignUps (Total) - ${totalSignups}` }
          ]
        }
      ]
    };

    // Render the chart using ECharts
    // const chart = document.getElementById('main');
    // const myChart = echarts.init(chart);
    chart.setOption(option);

    // Clean up the chart when the component unmounts
    return () => {
        chart.dispose();
    };
  }, [marketingFunnel]);

  return <MDBox ref={chartRef} style={{ minWidth: '100%', height: '400px' }} />
};

export default FunnelChart;
