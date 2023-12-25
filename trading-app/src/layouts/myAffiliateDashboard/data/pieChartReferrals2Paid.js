import React, { useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import MDBox from '../../../components/MDBox';


const PieChart = () => {
  const chartRef = useRef(null);
  const creationProcess = [{creationProcess:"Referrals",count:12},{creationProcess:"Active",count:2},{creationProcess:"Paid",count:1}]
  useEffect(() => {
    const chartDom = chartRef.current;
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    const options = {
    //   title: {
    //     text: 'Referral 2 Active',
    //     subtext: 'Pais user acquisition channels',
    //     left: 'center',
    //   },
      tooltip: {
        trigger: 'item',
      },
    //   legend: {
    //     orient: 'vertical',
    //     left: 'left',
    //   },
      series: [
        {
          name: 'Status',
          type: 'pie',
          radius: '70%',
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

return <MDBox ref={chartRef} style={{ minWidth: '100%', height: '205px' }} />
  
};

export default PieChart;
