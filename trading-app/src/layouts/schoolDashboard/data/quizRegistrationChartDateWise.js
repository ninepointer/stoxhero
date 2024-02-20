import * as echarts from 'echarts';
import React, { useEffect, useRef } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

export default function Charts({ data }) {
  const chartRef = useRef(null);

  data.sort((a, b) => {
    if (a.date < b.date) {
      return -1;
    }
    if (a.date > b.date) {
      return 1;
    }
    return 0;
  });

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    const options = {
      title: {
        text: `Quiz Registered Students Date Wise`,
        left: 'left',
        textStyle: {
          fontSize: 15, // Adjust the font size as needed
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
      },
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: true },
          magicType: { show: true, type: ['line', 'bar', 'area'] },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      legend: {
        data: ['Students'],
      },
      grid: {
        right: '2%', // Adjust the right margin as per your requirement
        left: '2%',
        bottom: '2%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: data?.map(elem => elem?.date),
          axisPointer: {
            type: 'shadow',
          },
          axisLabel: {
            interval: 0, // Display all labels
            rotate: 0, // Rotate labels by 45 degrees
            margin: 10, // Adjust the margin to prevent clipping
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          // name: 'GMV/Revenue',
          axisLabel: {
            formatter: `{value}`,
          },
        },
        {
          type: 'value',
          // name: 'Orders',
          axisLabel: {
            formatter: `{value}`,
          },
        },
      ],
      series: [
        {
          name: 'Students',
          type: 'bar', // Change type to 'line' for area graph
          stack: 'stack', // Set stack property to 'stack'
          itemStyle: {
            color: 'rgba(96, 239, 177, 0.7)', // Change color of the graph
          },
          areaStyle: {}, // Add areaStyle for area graph
          yAxisIndex: 0, // Associate with the first y-axis
          data: data?.map(elem => elem?.users),
        },
      ],
    };

    chart.setOption(options);

    return () => {
      chart.dispose();
    };
  }, [data]);

  useEffect(() => {
    const handleResize = () => {
      const chart = echarts.getInstanceByDom(chartRef.current);
      if (chart) {
        chart.resize();
      }
    };
  
    window.addEventListener('resize', handleResize);
  
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Card style={{ minWidth: '100%', height: '380px', borderRadius: 10 }}>
      <CardContent>
        {/* <MDTypography variant="h6">Last 6 months TestZone Data</MDTypography> */}
        <div style={{ minWidth: '100%', height: '360px' }} ref={chartRef}></div>
      </CardContent>
    </Card>
  );
}
