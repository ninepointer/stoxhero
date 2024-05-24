import React, { useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';


const PieChart = ({creationProcess}) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartDom = chartRef.current;
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    const options = {
      title: {
        text: 'Acquisition Channels',
        subtext: 'Pais user acquisition channels',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
    //   legend: {
    //     orient: 'vertical',
    //     left: 'left',
    //   },
      series: [
        {
          name: 'Channel',
          type: 'pie',
          radius: '60%',
          data: creationProcess?.map((item) => ({
            value: item?.count,
            name: item?.creationProcess,
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };

    if (options) {
      myChart.setOption(options);
    }

    // Cleanup function to dispose the chart when the component unmounts
    return () => {
      myChart.dispose();
    };
  }, []); // Empty dependency array ensures useEffect runs once after the initial render

//   return <div ref={chartRef} style={{ minWidth: '100%', height: '380px' }} />;

  return (
    <Card style={{ minWidth: '100%', height: '380px', borderRadius:1, alignContent:'center' }}>
      <CardContent>
        {/* <MDTypography variant="h6">Last 6 months TestZone Data</MDTypography> */}
        <div ref={chartRef} style={{ minWidth: '100%', height: '380px' }} />
      </CardContent>
    </Card>
  );
};

export default PieChart;
