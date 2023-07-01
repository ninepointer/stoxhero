import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import MDBox from '../../../components/MDBox';

export default function TraderDetails({bothSideTradeData, isLoading}) {
  const chartRef = useRef(null);
  let dates = []
  let stoxHeroNpnl = []
  let infinityNpnl = []
  dates = Object.keys(bothSideTradeData)
  let pnlValues = Object.values(bothSideTradeData)
  stoxHeroNpnl = pnlValues?.map((elem)=>{
    return elem?.stoxHero?.npnl
  })
  infinityNpnl = pnlValues?.map((elem)=>{
    return elem?.infinity?.npnl
  })
  let stoxHeroMaxValue = Math.max(...stoxHeroNpnl)
  let infinityMaxValue = Math.max(...infinityNpnl)
  let stoxHeroMinValue = Math.min(...stoxHeroNpnl)
  let infinityMinValue = Math.min(...infinityNpnl)
  console.log(stoxHeroMaxValue,infinityMaxValue)
  let maxValue = stoxHeroMaxValue > infinityMaxValue ? stoxHeroMaxValue : infinityMaxValue
  let minValue = stoxHeroMinValue < infinityMinValue ? stoxHeroMinValue : infinityMinValue
  let interval = Math.round(Math.abs(maxValue/10),0)

  console.log(dates)
  console.log(stoxHeroNpnl,infinityNpnl)
  console.log(maxValue,minValue,interval)
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
        data: ['Net P&L(StoxHero)', 'Net P&L(Infinity)']
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
          data: dates,
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Net P&L',
          // min: parseInt(minValue),
          // max: parseInt(maxValue),
          // interval: parseInt(interval),
          axisLabel: {
            formatter: `{value} ₹`
          }
        },
      ],
      series: [
        {
          name: 'Net P&L(StoxHero)',
          type: 'bar',
          tooltip: {
            formatter: '{c} ₹'
          },
          data: stoxHeroNpnl
        },
        {
          name: 'Net P&L(Infinity)',
          type: 'bar',
          tooltip: {
            formatter: '{c} ₹'
          },
          data: infinityNpnl
        },
      ]
    };

    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, [bothSideTradeData]);

  return isLoading ? <MDBox ref={chartRef} style={{ minWidth: '100%', height: '400px', filter: 'blur(2px)' }} /> : <MDBox ref={chartRef} style={{ minWidth: '100%', height: '400px' }} />;
};
