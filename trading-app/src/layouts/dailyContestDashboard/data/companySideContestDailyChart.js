import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import MDBox from '../../../components/MDBox';
import moment, { min } from 'moment';

export default function TraderDetails({completedContest, isLoading}) {
  const chartRef = useRef(null);
  // console.log("Completed TestZone Data:", completedContest, isLoading);

  let dates = []
  let npnl = []
  let payout = []
  let numberOfContests = []

  dates = completedContest?.map((e)=>{
    let tradeDate = new Date(e?.contestDate)
    let utcDateString = tradeDate.toLocaleString("en-US", { timeZone: "UTC" });
    return moment.utc(utcDateString).utcOffset('+00:00').format('DD-MMM')
  })

  npnl = completedContest?.map((e)=>{
    return (e?.totalNpnl/100)?.toFixed(0)
  })

  payout = completedContest?.map((e)=>{
    return (e?.totalPayout)?.toFixed(0)
  })

  numberOfContests = completedContest?.map((e)=>{
    return (e?.numberOfContests)
  })

  let npnlMax = Math.max(...npnl)
  let npnlMin = Math.max(...npnl)

  let maxValue = npnlMax > (npnlMin  > 0 ? npnlMin : -npnlMin) ? npnlMax : (npnlMin  > 0 ? npnlMin : -npnlMin)
  let minValue = -maxValue

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    const option = {
      title: {
        text: 'TestZone NPNL & Payouts(Trader)',
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
        data: ['Net P&L/100', 'Payout','# of TestZones']
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
          name: '# of TestZones',
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
          name: '# of TestZones',
          type: 'bar',
          yAxisIndex: 1,
          tooltip: {
            formatter: '{c}'
          },
          data: numberOfContests
        },
      ]
    };

    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, [completedContest]);

  return isLoading ? <MDBox ref={chartRef} style={{ minWidth: '100%', height: '400px', filter: 'blur(2px)' }} /> : <MDBox ref={chartRef} style={{ minWidth: '100%', height: '400px' }} />;
};
