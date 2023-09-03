import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import MDBox from '../../../components/MDBox';
import moment, { min } from 'moment';

export default function TraderDetails({completedMarginX, isLoading}) {
  const chartRef = useRef(null);
  // console.log("Completed Contest Data:", completedContest, isLoading);

  let dates = []
  let npnl = []
  let payout = []
  let numberOfMarginXs = []

  dates = completedMarginX?.map((e)=>{
    let tradeDate = new Date(e?.MarginXDate)
    let utcDateString = tradeDate.toLocaleString("en-US", { timeZone: "UTC" });
    return moment.utc(utcDateString).utcOffset('+00:00').format('DD-MMM')
  })

  npnl = completedMarginX?.map((e)=>{
    return (e?.totalNpnl/100)?.toFixed(0)
  })

  payout = completedMarginX?.map((e)=>{
    return (e?.totalPayout)?.toFixed(0)
  })

  numberOfMarginXs = completedMarginX?.map((e)=>{
    return (e?.numberOfMarginX)
  })

  let npnlMax = Math.max(...npnl)
  let npnlMin = Math.max(...npnl)

  let maxValue = npnlMax > (npnlMin  > 0 ? npnlMin : -npnlMin) ? npnlMax : (npnlMin  > 0 ? npnlMin : -npnlMin)
  let minValue = -maxValue

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    const option = {
      title: {
        text: 'MarginX NPNL & Payouts(Trader)',
        left: 'left',
      },
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
        data: ['Net P&L/100', 'Payout','# of MarginXs']
      },
      grid: {
        right: '2.5%', // Adjust the right margin as per your requirement
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
          name: 'Net P&L/100',
          // min: npnlMin,
          // max: npnlMax,
          // interval: parseInt(interval),
          axisLabel: {
            formatter: `{value} ₹`
          }
        },
        {
          type: 'value',
          name: '# of MarginXs',
          min: -3.2,
          max: 8,
          offset: 0,
          // interval: 2,
          axisLabel: {
            formatter: `{value}`
          }
        },
      ],
      series: [
        {
          name: 'Net P&L/100',
          type: 'bar',
          yAxisIndex: 0,
          tooltip: {
            formatter: '{c} ₹'
          },
          data: npnl
        },
        {
          name: 'Payout',
          type: 'bar',
          yAxisIndex: 0,
          tooltip: {
            formatter: '{c} ₹'
          },
          data: payout
        },
        {
          name: '# of MarginXs',
          type: 'bar',
          yAxisIndex: 1,
          tooltip: {
            formatter: '{c}'
          },
          data: numberOfMarginXs
        },
      ]
    };

    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, [completedMarginX]);

  return isLoading ? <MDBox ref={chartRef} style={{ minWidth: '100%', height: '400px', filter: 'blur(2px)' }} /> : <MDBox ref={chartRef} style={{ minWidth: '100%', height: '400px' }} />;
};
