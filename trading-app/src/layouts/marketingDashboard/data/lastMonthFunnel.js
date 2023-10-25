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
  let lastMonthSignups = (marketingFunnel[0]?.lastMonthSignups)
  let lastMonthtotalActiveTraders = (marketingFunnel[0]?.lastMonthtotalActiveTraders)
  let paidTotaltotalActiveTraders = (marketingFunnel[0]?.paidTotaltotalActiveTraders)
  let paidLastMonthActiveTraders = (marketingFunnel[0]?.paidLastMonthActiveTraders)
  let date = new Date();
  let month = date.getMonth()
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
          min: paidLastMonthActiveTraders,
        //   max: 100,
          max: lastMonthSignups,
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
            { value: paidLastMonthActiveTraders, name: `Paid Users (${monthName}) - ${paidLastMonthActiveTraders}` },
            // { value: paidTotaltotalActiveTraders, name: `Paid Users (Total) - ${paidTotaltotalActiveTraders}` },
            { value: lastMonthtotalActiveTraders, name: `Active Users (${monthName}) - ${lastMonthtotalActiveTraders}` },
            { value: lastMonthSignups, name: `SignUps (${monthName}) - ${lastMonthSignups}` },
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
