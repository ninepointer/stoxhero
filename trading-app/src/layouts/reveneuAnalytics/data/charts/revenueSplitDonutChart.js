import React, { useEffect, useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { apiUrl } from '../../../../constants/constants';
import axios from 'axios';


const PieChart = ({period}) => {
  const chartRef = useRef(null);

  const [data, setData] = useState([]);

  useEffect(() => {
    let call1 = axios.get((`${apiUrl}revenue/bonusrevenuesplit?period=${period}`), {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
    })
    Promise.all([call1])
      .then(([api1Response]) => {
        setData(
          {name:'Signup Bonus',value: api1Response?.data?.bonusAmount},
          {name:'Actual Revenue',value: api1Response?.data?.actualRevenue}
          )
      })
      .catch((error) => {
        console.error(error);
      });

  }, [period])



  // const data = [{name:'Signup Bonus',value: 100},{name:'Actual Revenue',value: 500}]

  useEffect(() => {
    const chartDom = chartRef.current;
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    const options = {
      title: {
        text: 'Revenue Split',
        // subtext: 'Pais user acquisition channels',
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
          // data: creationProcess?.map((item) => ({
          //   value: item?.count,
          //   name: item?.creationProcess,
          // })),
          data: data,
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
