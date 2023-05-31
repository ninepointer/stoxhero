import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const GaugeChart = ({myReferralCount}) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);
    const option = {
        series: [
            {
              type: 'gauge',
              startAngle: 180,
              endAngle: 0,
              min: 0,
              max: 10,
              splitNumber: 2,
              itemStyle: {
                color: '#1A73E8',
                shadowColor: 'rgba(0,138,255,0.45)',
                shadowBlur: 10,
                shadowOffsetX: 2,
                shadowOffsetY: 2
              },
              progress: {
                show: true,
                roundCap: true,
                width: 5
              },
              pointer: {
                icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
                length: '80%',
                width: 10,
                offsetCenter: [0, '5%']
              },
              axisLine: {
                roundCap: true,
                lineStyle: {
                  width: 5
                }
              },
              axisTick: {
                splitNumber: 2,
                lineStyle: {
                  width: 0.5,
                  color: '#fff'
                }
              },
              splitLine: {
                length: 5,
                lineStyle: {
                  width: 0.5,
                  color: '#fff'
                }
              },
              axisLabel: {
                distance: 10,
                color: '#fff',
                fontSize: 13
              },
              title: {
                show: false
              },
              detail: {
                backgroundColor: '#000',
                borderColor: '#fff',
                borderWidth: 2,
                width: 'auto',
                lineHeight: 10,
                height: 'auto',
                borderRadius: 5,
                offsetCenter: [0, '35%'],
                valueAnimation: true,
                formatter: function (value) {
                  return '{value|' + value.toFixed(0) + ' Referrals' + '}';
                },
                rich: {
                    value: {
                      fontSize: 10,
                      fontWeight: 'bolder',
                      color: '#fff'
                    },
                    unit: {
                      fontSize: 10,
                      color: '#fff',
                      padding: [0, 0, 0, 0]
                    }
                  }
              },
              data: [
                {
                  value: myReferralCount
                }
              ]
            }
          ]
    };
    option && myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, [myReferralCount]);

  return <div ref={chartRef} style={{ minWidth: '100%', height: '200px', padding:0 }} />;
};

export default GaugeChart;
