import React, { useEffect, useRef } from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';
import MDBox from '../../../components/MDBox';

const FunnelChart = ({marketingFunnelLifetime}) => {
  const chartRef = useRef(null);
  let totalSignups = (marketingFunnelLifetime[0]?.totalSignups);
  let totalActiveTraders = (marketingFunnelLifetime[0]?.totalActiveTraders)
  let paidTotaltotalActiveTraders = (marketingFunnelLifetime[0]?.paidTotaltotalActiveTraders)
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
        text: `Lifetime SignUp Funnel`
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
        data: ['SignUps (Lifetime)', 'Active Users (Lifetime)', 'Paid Users (Lifetime)']
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
          min: paidTotaltotalActiveTraders,
        //   max: 100,
          max: totalSignups,
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
            { value: paidTotaltotalActiveTraders, name: `Paid Users (Lifetime) - ${paidTotaltotalActiveTraders}` },
            { value: totalActiveTraders, name: `Active Users (Lifetime) - ${totalActiveTraders}` },
            { value: totalSignups, name: `SignUps (Lifetime) - ${totalSignups}` },
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
  }, [marketingFunnelLifetime]);

  return <MDBox ref={chartRef} style={{ minWidth: '100%', height: '400px' }} />
};

export default FunnelChart;
