import React, { useEffect } from 'react';
import * as echarts from 'echarts/core';
import { GridComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import moment from 'moment';

// Importing necessary ECharts components
echarts.use([GridComponent, LineChart, CanvasRenderer]);

export default function EChartsLineChart({ data }) {
  useEffect(() => {
    // Initialize ECharts instance
    const chartDom = document.getElementById('main');
    const myChart = echarts.init(chartDom);

    // Prepare the option for the line chart
    const option = {
      xAxis: {
        type: 'category',
        data: data?.map(e => e?.date),
      },
      yAxis: {
        type: 'value',
      },
      series: [{
        data: data?.map(e => e?.value), // Assuming your data contains a 'value' property
        type: 'line',
        smooth: true,
      }],
    };

    // Set the option to the chart
    myChart.setOption(option);

    // Clean up
    return () => {
      myChart.dispose(); // Dispose the chart when the component unmounts
    };
  }, [data]); // Re-run the effect if 'data' prop changes

  return <div id="main" style={{ width: '100%', height: '300px' }} />;
}
