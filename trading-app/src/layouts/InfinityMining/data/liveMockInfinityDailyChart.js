import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import MDBox from '../../../components/MDBox';
import moment, { min } from 'moment';

export default function TraderDetails({bothSideTradeData, isLoading}) {
  const chartRef = useRef(null);
  let dates = []
  let convertedDates = []
  let stoxHeroNpnl = []
  let infinityNpnl = []
  dates = Object.keys(bothSideTradeData)

  convertedDates = dates?.map((date)=>{
    let tradeDate = new Date(date)
    let utcDateString = tradeDate.toLocaleString("en-US", { timeZone: "UTC" });
    return moment.utc(utcDateString).utcOffset('+00:00').format('DD-MMM')
  })

  let pnlValues = Object.values(bothSideTradeData)
  stoxHeroNpnl = pnlValues?.map((elem)=>{
    return (elem?.stoxHero?.npnl)?.toFixed(0)
  })
  infinityNpnl = pnlValues?.map((elem)=>{
    return (elem?.infinity?.npnl)?.toFixed(0)
  })
  let stoxHeroMaxValue = Math.max(...stoxHeroNpnl)
  let infinityMaxValue = Math.max(...infinityNpnl)
  let stoxHeroMinValue = Math.min(...stoxHeroNpnl)
  let infinityMinValue = Math.min(...infinityNpnl)
  console.log(stoxHeroMaxValue,infinityMaxValue)
  let maxValue = stoxHeroMaxValue > infinityMaxValue ? stoxHeroMaxValue : infinityMaxValue
  let minValue = stoxHeroMinValue < infinityMinValue ? stoxHeroMinValue : infinityMinValue
  let interval = Math.round(Math.abs(maxValue/10),0)

  let value = maxValue > -minValue ? Math.round(maxValue/10000)*10000 + 10000 : Math.round(-minValue/10000)*10000 + 10000

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
          data: convertedDates,
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Net P&L(in ₹)',
          min: parseInt(-value),
          max: parseInt(value),
          // interval: parseInt(interval),
          axisLabel: {
            formatter: `{value}`
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
