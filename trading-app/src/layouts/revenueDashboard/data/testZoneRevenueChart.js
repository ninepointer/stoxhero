import React from 'react';
import ReactEcharts from 'echarts-for-react';

const ChartComponent = ({testZoneMonthlyRevenue}) => {
  
  const maxRevenue = Math.max(...testZoneMonthlyRevenue.map(item => item.monthRevenue));
  const roundedMaxRevenue = Math.round((maxRevenue+50000) / 25000) * 25000;
  const interval = Math.ceil(roundedMaxRevenue / 5);
    const option = {
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
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    legend: {
      data: ['TestZone Monthly Revenue']
    },
    xAxis: [
      {
        type: 'category',
        data: testZoneMonthlyRevenue.map(item => item.formattedDate),
        axisPointer: {
          type: 'shadow'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: 'Revenue',
        min: 0,
        max: roundedMaxRevenue,
        interval: interval,
        axisLabel: {
          formatter: '₹{value}'
        }
      },
    ],
    series: [
      {
        name: 'TestZone Monthly Revenue',
        type: 'bar',
        tooltip: {
          formatter: '₹ {b}: {c}',
        },
        data: testZoneMonthlyRevenue.map(item => item.monthRevenue),
      },
    ]
  };

  return <ReactEcharts option={option} />;
};

export default ChartComponent;
