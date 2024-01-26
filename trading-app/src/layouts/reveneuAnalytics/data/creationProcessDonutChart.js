import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { apiUrl } from '../../../constants/constants';
import axios from 'axios';

const PieChart = ({period}) => {
  const chartRef = useRef(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    let call1 = axios.get((`${apiUrl}revenue/signupchannels?period=${period}`), {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
    })
    Promise.all([call1])
      .then(([api1Response]) => {
        const groupedData = (api1Response.data.data).reduce((result, item) => {
          const channel = item.channel;
        
          if (!result[channel]) {
            result[channel] = {
              totalUnits: 0,
              totalRevenue: 0,
            };
          }
        
          result[channel].totalUnits += item.totalUnits;
          result[channel].totalRevenue += item.totalRevenue;
        
          return result;
        }, {});
        
        const groupedArray = Object.entries(groupedData).map(([channel, { totalUnits, totalRevenue, items }]) => ({
          channel,
          totalUnits,
          totalRevenue,
          items,
        }));
        console.log(groupedArray)
        setData(groupedArray)
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
        text: 'Revenue Channels',
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
          data: data?.map((item) => ({
            value:  item?.totalRevenue?.toFixed(2),
            // "₹" + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(item?.totalRevenue) || 0),
            name: item?.channel,
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
  }, [data]); // Empty dependency array ensures useEffect runs once after the initial render

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
