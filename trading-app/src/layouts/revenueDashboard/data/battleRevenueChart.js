import * as echarts from 'echarts';
import React, { useEffect, useRef } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

export default function Charts({ battleMonthlyRevenue }) {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    const options = {
      title: {
        text: 'Last 6 Months Battle',
        left: 'left',
        textStyle: {
          fontSize: 10, // Adjust the font size as needed
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
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      legend: {
        data: ['GMV', 'Revenue', 'Orders', 'Unique Paid Users'],
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
          data: battleMonthlyRevenue?.map((item) => item?.formattedDate),
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
            formatter: `₹{value}`,
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
          name: 'GMV',
          type: 'bar',
          yAxisIndex: 0, // Associate with the first y-axis
          data: battleMonthlyRevenue?.map((item) => (item?.monthGMV).toFixed(0)),
        },
        {
          name: 'Revenue',
          type: 'bar',
          yAxisIndex: 0, // Associate with the first y-axis
          data: battleMonthlyRevenue?.map((item) => (item?.monthRevenue)?.toFixed(0)),
        },
        {
          name: 'Orders',
          type: 'line',
          yAxisIndex: 1, // Associate with the second y-axis
          data: battleMonthlyRevenue?.map((item) => item?.totalOrder),
        },
        {
          name: 'Unique Paid Users',
          type: 'line',
          yAxisIndex: 1, // Associate with the second y-axis
          data: battleMonthlyRevenue?.map((item) => item?.uniqueUsersCount),
        },
      ],
    };

    chart.setOption(options);

    return () => {
      chart.dispose();
    };
  }, [battleMonthlyRevenue]);

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
    <Card style={{ minWidth: '100%', height: '380px', borderRadius:1 }}>
      <CardContent>
        {/* <MDTypography variant="h6">Last 6 months TestZone Data</MDTypography> */}
        <div style={{ minWidth: '100%', height: '360px' }} ref={chartRef}></div>
      </CardContent>
    </Card>
  );
}
