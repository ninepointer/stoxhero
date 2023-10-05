import React, { useEffect, useRef } from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';
import MDBox from '../../../components/MDBox';

const FunnelChart = ({marketingFunnel, monthNumber, yearNumber}) => {
  const chartRef = useRef(null);
  
  let thisMonthSignups = (marketingFunnel[0]?.thisMonthSignups)
  let thisMonthtotalActiveTraders = (marketingFunnel[0]?.thisMonthtotalActiveTraders)
  let paidThisMonthActiveTraders = (marketingFunnel[0]?.paidThisMonthActiveTraders)
  const monthNames = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];
  const monthName = monthNames[parseInt(monthNumber) - 1];
  
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
        data: ['SignUps', 'Active Users','Paid Users']
      },
      series: [
        {
          name: 'Funnel',
          type: 'funnel',
          left: '10%',
          top: 60,
          bottom: 60,
          width: '80%',
          min: paidThisMonthActiveTraders,
          max: thisMonthSignups,
          minSize: '10%',
          maxSize: '100%',
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
            { value: paidThisMonthActiveTraders, name: `New Paid Users (${monthName}) - ${paidThisMonthActiveTraders}` },
            { value: thisMonthtotalActiveTraders, name: `New Active Users (${monthName}) - ${thisMonthtotalActiveTraders}` },
            { value: thisMonthSignups, name: `New SignUps (${monthName}) - ${thisMonthSignups}` },
          ]
        }
      ]
    };

    chart.setOption(option);

    // Clean up the chart when the component unmounts
    return () => {
        chart.dispose();
    };
  }, [marketingFunnel]);

  return <MDBox ref={chartRef} style={{ minWidth: '100%', height: '400px' }} />
};

export default FunnelChart;
