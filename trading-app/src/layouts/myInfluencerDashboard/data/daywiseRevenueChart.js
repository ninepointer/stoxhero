import React, { useEffect } from "react";
import * as echarts from "echarts/core";
import { GridComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import moment from "moment";

echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition]);

export default function EChartsLineChart({ data, type }) {

  useEffect(() => {
    const chartDom = document.getElementById(`main-${type}`);
    const myChart = echarts.init(chartDom, "transparent");
    const option = {
      xAxis: {
        type: "category",
        data: data?.map((e) => e?.date),
      },
      yAxis: {
        type: "value",
      },
      grid: {
        show: true,
        top: "5%",
        left: "1%",
        right: "1%",
        bottom: "5%",
        containLabel: true,
        borderWidth: 0, // Remove border around grid
        backgroundColor: "transparent", // Set background color of grid to transparent
        borderColor: "transparent", // Set border color of grid to transparent
      },
      series: [
        {
          data: data?.map((e) => e?.data),
          type: "bar",
          smooth: true,
        },
      ],
    };
    myChart.setOption(option);

    // Clean up
    return () => {
      myChart.dispose(); // Dispose the chart when the component unmounts
    };
  }, [data]); // Empty dependency array ensures this effect runs only once after initial render

  return <div id={`main-${type}`} style={{ width: "100%", height: "300px" }} />;
}
