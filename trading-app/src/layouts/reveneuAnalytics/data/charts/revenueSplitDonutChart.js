import React, { useEffect, useRef, useState, memo } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { Card, CircularProgress, Grid } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import { apiUrl } from '../../../../constants/constants';
import axios from 'axios';


const PieChart = ({ period }) => {
  const chartRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    setLoading(true)
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
        setData([
          {
            name: 'Signup Bonus', value: api1Response?.data?.data?.bonusAmount?.toFixed(0)
          },
          {
            name: 'Actual Revenue', value: api1Response?.data?.data?.actualRevenue?.toFixed(0)
          }
        ])

        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });

  }, [period])

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
  }, [data, loading]); // Empty dependency array ensures useEffect runs once after the initial render

  return (
    <>
      {
        loading ?
          <Grid p={1} container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ borderRadius: 5, width: '100%', height: 'auto' }}>
            <CircularProgress color='dark' />
          </Grid>
          :
          <Card style={{ minWidth: '100%', height: '380px', borderRadius: 1, alignContent: 'center' }}>
            <CardContent>
              <div ref={chartRef} style={{ minWidth: '100%', height: '380px' }} />
            </CardContent>
          </Card>
      }
    </>
  );
};

export default memo(PieChart);
