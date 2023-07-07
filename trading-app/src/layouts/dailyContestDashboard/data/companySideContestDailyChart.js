import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import MDBox from '../../../components/MDBox';
import moment, { min } from 'moment';

export default function TraderDetails() {
  const chartRef = useRef(null);
  
  useEffect(() => {
    const chart = echarts.init(chartRef.current);

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
          dataView: { show: true, readOnly: true },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      legend: {
        data: ['Net P&L', 'Payout']
      },
      grid: {
        right: '2%', // Adjust the right margin as per your requirement
        left: '2%',
        bottom: '2%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['1-Jan','2-Jan','3-Jan','4-Jan','5-Jan'],
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Net P&L',
          min: -100000,
          max: 100000,
          // interval: parseInt(interval),
          axisLabel: {
            formatter: `{value} ₹`
          }
        },
      ],
      series: [
        {
          name: 'Net P&L',
          type: 'bar',
          tooltip: {
            formatter: '{c} ₹'
          },
          data: [-20000,23000,34000,-10000,-25000]
        },
        {
          name: 'Payout',
          type: 'bar',
          tooltip: {
            formatter: '{c} ₹'
          },
          data: [2000,3000,3200,2000,1500]
        },
      ]
    };

    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, []);

  return false ? <MDBox ref={chartRef} style={{ minWidth: '100%', height: '400px', filter: 'blur(2px)' }} /> : <MDBox ref={chartRef} style={{ minWidth: '100%', height: '400px' }} />;
};
