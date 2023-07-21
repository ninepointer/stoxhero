// import "./styles.css";

// import React, { useEffect, useRef } from "react";
// import { createChart } from "lightweight-charts";

// const CandlestickChart = ({historicalData, liveData}) => {
//   const chartContainerRef = useRef();

//   const data = [
//     {
//       "LastTradeTime": 1686812400,
//       "QuotationLot": 50,
//       "TradedQty": 100250,
//       "OpenInterest": 9892350,
//       "Open": 18790.4,
//       "High": 18797.3,
//       "Low": 18777,
//       "Close": 18789.15
//     },
//     {
//       "LastTradeTime": 1686810600,
//       "QuotationLot": 50,
//       "TradedQty": 202500,
//       "OpenInterest": 9894000,
//       "Open": 18783.65,
//       "High": 18800.65,
//       "Low": 18776.6,
//       "Close": 18791.45
//     },
//     {
//       "LastTradeTime": 1686808800,
//       "QuotationLot": 50,
//       "TradedQty": 572850,
//       "OpenInterest": 9904900,
//       "Open": 18791.95,
//       "High": 18794.85,
//       "Low": 18770,
//       "Close": 18783.65
//     },
//     {
//       "LastTradeTime": 1686807000,
//       "QuotationLot": 50,
//       "TradedQty": 566200,
//       "OpenInterest": 9857900,
//       "Open": 18840.2,
//       "High": 18845.5,
//       "Low": 18791,
//       "Close": 18792.55
//     },
//     {
//       "LastTradeTime": 1686805200,
//       "QuotationLot": 50,
//       "TradedQty": 289850,
//       "OpenInterest": 9877100,
//       "Open": 18856.45,
//       "High": 18861.65,
//       "Low": 18834.8,
//       "Close": 18840.2
//     },
//     {
//       "LastTradeTime": 1686803400,
//       "QuotationLot": 50,
//       "TradedQty": 680950,
//       "OpenInterest": 9801750,
//       "Open": 18831.9,
//       "High": 18867.5,
//       "Low": 18825.3,
//       "Close": 18853.8
//     },
//     {
//       "LastTradeTime": 1686801600,
//       "QuotationLot": 50,
//       "TradedQty": 561850,
//       "OpenInterest": 9662900,
//       "Open": 18796.2,
//       "High": 18836,
//       "Low": 18787,
//       "Close": 18831.65
//     },
//     {
//       "LastTradeTime": 1686799800,
//       "QuotationLot": 50,
//       "TradedQty": 509700,
//       "OpenInterest": 9593450,
//       "Open": 18818.25,
//       "High": 18819.35,
//       "Low": 18782.8,
//       "Close": 18798.9
//     },
//     {
//       "LastTradeTime": 1686736800,
//       "QuotationLot": 50,
//       "TradedQty": 1550,
//       "OpenInterest": 9630400,
//       "Open": 18809.5,
//       "High": 18809.5,
//       "Low": 18809.5,
//       "Close": 18809.5
//     },
//     {
//       "LastTradeTime": 1686735000,
//       "QuotationLot": 50,
//       "TradedQty": 640600,
//       "OpenInterest": 9630400,
//       "Open": 18824.4,
//       "High": 18832,
//       "Low": 18808.3,
//       "Close": 18808.3
//     },
//     {
//       "LastTradeTime": 1686733200,
//       "QuotationLot": 50,
//       "TradedQty": 282650,
//       "OpenInterest": 9553350,
//       "Open": 18817.2,
//       "High": 18825,
//       "Low": 18808.35,
//       "Close": 18823.7
//     },
//     {
//       "LastTradeTime": 1686731400,
//       "QuotationLot": 50,
//       "TradedQty": 292150,
//       "OpenInterest": 9505000,
//       "Open": 18823.05,
//       "High": 18828,
//       "Low": 18810.95,
//       "Close": 18817.2
//     },
//     {
//       "LastTradeTime": 1686729600,
//       "QuotationLot": 50,
//       "TradedQty": 191850,
//       "OpenInterest": 9417550,
//       "Open": 18825,
//       "High": 18828.3,
//       "Low": 18812.2,
//       "Close": 18823.05
//     },
//     {
//       "LastTradeTime": 1686727800,
//       "QuotationLot": 50,
//       "TradedQty": 324950,
//       "OpenInterest": 9378500,
//       "Open": 18807.75,
//       "High": 18825,
//       "Low": 18807.05,
//       "Close": 18825
//     },
//     {
//       "LastTradeTime": 1686726000,
//       "QuotationLot": 50,
//       "TradedQty": 196650,
//       "OpenInterest": 9328450,
//       "Open": 18806,
//       "High": 18812.7,
//       "Low": 18798.65,
//       "Close": 18807.6
//     },
//     {
//       "LastTradeTime": 1686724200,
//       "QuotationLot": 50,
//       "TradedQty": 214800,
//       "OpenInterest": 9265600,
//       "Open": 18801,
//       "High": 18810,
//       "Low": 18795.55,
//       "Close": 18804.35
//     },
//     {
//       "LastTradeTime": 1686722400,
//       "QuotationLot": 50,
//       "TradedQty": 158700,
//       "OpenInterest": 9207900,
//       "Open": 18785.35,
//       "High": 18802.65,
//       "Low": 18783.6,
//       "Close": 18801
//     },
//     {
//       "LastTradeTime": 1686720600,
//       "QuotationLot": 50,
//       "TradedQty": 152200,
//       "OpenInterest": 9165700,
//       "Open": 18790.95,
//       "High": 18792,
//       "Low": 18777,
//       "Close": 18786
//     },
//     {
//       "LastTradeTime": 1686718800,
//       "QuotationLot": 50,
//       "TradedQty": 253500,
//       "OpenInterest": 9134500,
//       "Open": 18769.15,
//       "High": 18793.3,
//       "Low": 18766.6,
//       "Close": 18790
//     },
//     {
//       "LastTradeTime": 1686717000,
//       "QuotationLot": 50,
//       "TradedQty": 153400,
//       "OpenInterest": 9149650,
//       "Open": 18761.7,
//       "High": 18770.75,
//       "Low": 18754.95,
//       "Close": 18769.15
//     },
//     {
//       "LastTradeTime": 1686715200,
//       "QuotationLot": 50,
//       "TradedQty": 375050,
//       "OpenInterest": 9182200,
//       "Open": 18784.6,
//       "High": 18789.2,
//       "Low": 18750,
//       "Close": 18762.3
//     },
//     {
//       "LastTradeTime": 1686713400,
//       "QuotationLot": 50,
//       "TradedQty": 395800,
//       "OpenInterest": 9167150,
//       "Open": 18750.05,
//       "High": 18810,
//       "Low": 18750.05,
//       "Close": 18786.05
//     },
//     {
//       "LastTradeTime": 1686650400,
//       "QuotationLot": 50,
//       "TradedQty": 50,
//       "OpenInterest": 9161550,
//       "Open": 18775.3,
//       "High": 18775.3,
//       "Low": 18775.3,
//       "Close": 18775.3
//     },
//     {
//       "LastTradeTime": 1686648600,
//       "QuotationLot": 50,
//       "TradedQty": 625200,
//       "OpenInterest": 9161550,
//       "Open": 18773.6,
//       "High": 18782,
//       "Low": 18765,
//       "Close": 18775.9
//     },
//     {
//       "LastTradeTime": 1686646800,
//       "QuotationLot": 50,
//       "TradedQty": 179000,
//       "OpenInterest": 9249450,
//       "Open": 18754,
//       "High": 18775,
//       "Low": 18752.1,
//       "Close": 18774
//     },
//     {
//       "LastTradeTime": 1686645000,
//       "QuotationLot": 50,
//       "TradedQty": 227950,
//       "OpenInterest": 9240050,
//       "Open": 18750.4,
//       "High": 18762,
//       "Low": 18747,
//       "Close": 18754
//     },
//     {
//       "LastTradeTime": 1686643200,
//       "QuotationLot": 50,
//       "TradedQty": 157200,
//       "OpenInterest": 9253650,
//       "Open": 18767.75,
//       "High": 18776,
//       "Low": 18750.15,
//       "Close": 18750.15
//     },
//     {
//       "LastTradeTime": 1686641400,
//       "QuotationLot": 50,
//       "TradedQty": 124000,
//       "OpenInterest": 9254350,
//       "Open": 18771.35,
//       "High": 18779.4,
//       "Low": 18763.3,
//       "Close": 18767.75
//     },
//     {
//       "LastTradeTime": 1686639600,
//       "QuotationLot": 50,
//       "TradedQty": 105650,
//       "OpenInterest": 9221050,
//       "Open": 18774.7,
//       "High": 18778.15,
//       "Low": 18766.25,
//       "Close": 18771.35
//     },
//     {
//       "LastTradeTime": 1686637800,
//       "QuotationLot": 50,
//       "TradedQty": 145000,
//       "OpenInterest": 9210700,
//       "Open": 18777.5,
//       "High": 18780.35,
//       "Low": 18770.6,
//       "Close": 18774.7
//     },
//     {
//       "LastTradeTime": 1686636000,
//       "QuotationLot": 50,
//       "TradedQty": 282350,
//       "OpenInterest": 9252250,
//       "Open": 18775.1,
//       "High": 18783,
//       "Low": 18766.05,
//       "Close": 18778.4
//     },
//     {
//       "LastTradeTime": 1686634200,
//       "QuotationLot": 50,
//       "TradedQty": 290050,
//       "OpenInterest": 9188100,
//       "Open": 18759,
//       "High": 18777.85,
//       "Low": 18756.35,
//       "Close": 18775.1
//     },
//     {
//       "LastTradeTime": 1686632400,
//       "QuotationLot": 50,
//       "TradedQty": 149650,
//       "OpenInterest": 9184550,
//       "Open": 18763,
//       "High": 18769.5,
//       "Low": 18752.85,
//       "Close": 18758.8
//     },
//     {
//       "LastTradeTime": 1686630600,
//       "QuotationLot": 50,
//       "TradedQty": 258000,
//       "OpenInterest": 9202600,
//       "Open": 18762,
//       "High": 18768.3,
//       "Low": 18757.1,
//       "Close": 18763
//     },
//     {
//       "LastTradeTime": 1686628800,
//       "QuotationLot": 50,
//       "TradedQty": 611300,
//       "OpenInterest": 9204050,
//       "Open": 18750.35,
//       "High": 18773.45,
//       "Low": 18744.9,
//       "Close": 18761.2
//     },
//     {
//       "LastTradeTime": 1686627000,
//       "QuotationLot": 50,
//       "TradedQty": 701100,
//       "OpenInterest": 9192900,
//       "Open": 18735.35,
//       "High": 18753,
//       "Low": 18721,
//       "Close": 18750
//     },
//     {
//       "LastTradeTime": 1686564000,
//       "QuotationLot": 50,
//       "TradedQty": 0,
//       "OpenInterest": 9292650,
//       "Open": 18690.4,
//       "High": 18690.4,
//       "Low": 18690.4,
//       "Close": 18690.4
//     },
//     {
//       "LastTradeTime": 1686562200,
//       "QuotationLot": 50,
//       "TradedQty": 490750,
//       "OpenInterest": 9292650,
//       "Open": 18700,
//       "High": 18704.9,
//       "Low": 18672,
//       "Close": 18690.4
//     },
//     {
//       "LastTradeTime": 1686560400,
//       "QuotationLot": 50,
//       "TradedQty": 159750,
//       "OpenInterest": 9181850,
//       "Open": 18670,
//       "High": 18700,
//       "Low": 18666.3,
//       "Close": 18699.95
//     },
//     {
//       "LastTradeTime": 1686558600,
//       "QuotationLot": 50,
//       "TradedQty": 371400,
//       "OpenInterest": 9186650,
//       "Open": 18683.85,
//       "High": 18705.6,
//       "Low": 18661.95,
//       "Close": 18670.5
//     },
//     {
//       "LastTradeTime": 1686556800,
//       "QuotationLot": 50,
//       "TradedQty": 167700,
//       "OpenInterest": 9197700,
//       "Open": 18681.3,
//       "High": 18693.7,
//       "Low": 18670,
//       "Close": 18683
//     },
//     {
//       "LastTradeTime": 1686555000,
//       "QuotationLot": 50,
//       "TradedQty": 231400,
//       "OpenInterest": 9172600,
//       "Open": 18655,
//       "High": 18688,
//       "Low": 18655,
//       "Close": 18681.3
//     },
//     {
//       "LastTradeTime": 1686553200,
//       "QuotationLot": 50,
//       "TradedQty": 154650,
//       "OpenInterest": 9232550,
//       "Open": 18653.45,
//       "High": 18662.75,
//       "Low": 18649,
//       "Close": 18658.05
//     },
//     {
//       "LastTradeTime": 1686551400,
//       "QuotationLot": 50,
//       "TradedQty": 233150,
//       "OpenInterest": 9246100,
//       "Open": 18692.95,
//       "High": 18697,
//       "Low": 18650.25,
//       "Close": 18655
//     },
//     {
//       "LastTradeTime": 1686549600,
//       "QuotationLot": 50,
//       "TradedQty": 136950,
//       "OpenInterest": 9248400,
//       "Open": 18674,
//       "High": 18694.1,
//       "Low": 18670.65,
//       "Close": 18693.8
//     },
//     {
//       "LastTradeTime": 1686547800,
//       "QuotationLot": 50,
//       "TradedQty": 270150,
//       "OpenInterest": 9217650,
//       "Open": 18678.45,
//       "High": 18690.25,
//       "Low": 18670.85,
//       "Close": 18675
//     },
//     {
//       "LastTradeTime": 1686546000,
//       "QuotationLot": 50,
//       "TradedQty": 321000,
//       "OpenInterest": 9454600,
//       "Open": 18671.85,
//       "High": 18683.45,
//       "Low": 18665,
//       "Close": 18678.4
//     },
//     {
//       "LastTradeTime": 1686544200,
//       "QuotationLot": 50,
//       "TradedQty": 258000,
//       "OpenInterest": 9428800,
//       "Open": 18640,
//       "High": 18677,
//       "Low": 18632,
//       "Close": 18671.6
//     },
//     {
//       "LastTradeTime": 1686542400,
//       "QuotationLot": 50,
//       "TradedQty": 557000,
//       "OpenInterest": 9421950,
//       "Open": 18657,
//       "High": 18667.15,
//       "Low": 18633,
//       "Close": 18640
//     },
//     {
//       "LastTradeTime": 1686540600,
//       "QuotationLot": 50,
//       "TradedQty": 509700,
//       "OpenInterest": 9739250,
//       "Open": 18649.95,
//       "High": 18659.7,
//       "Low": 18624.1,
//       "Close": 18655.75
//     },
//     {
//       "LastTradeTime": 1686304800,
//       "QuotationLot": 50,
//       "TradedQty": 0,
//       "OpenInterest": 10206200,
//       "Open": 18630,
//       "High": 18630,
//       "Low": 18630,
//       "Close": 18630
//     },
//     {
//       "LastTradeTime": 1686303000,
//       "QuotationLot": 50,
//       "TradedQty": 678400,
//       "OpenInterest": 10206200,
//       "Open": 18644.85,
//       "High": 18649.55,
//       "Low": 18623.1,
//       "Close": 18630
//     },
//     {
//       "LastTradeTime": 1686301200,
//       "QuotationLot": 50,
//       "TradedQty": 426650,
//       "OpenInterest": 10145550,
//       "Open": 18632,
//       "High": 18660.6,
//       "Low": 18629,
//       "Close": 18642.25
//     },
//     {
//       "LastTradeTime": 1686299400,
//       "QuotationLot": 50,
//       "TradedQty": 526300,
//       "OpenInterest": 10186750,
//       "Open": 18645.85,
//       "High": 18649.65,
//       "Low": 18618.35,
//       "Close": 18631.25
//     },
//     {
//       "LastTradeTime": 1686297600,
//       "QuotationLot": 50,
//       "TradedQty": 347750,
//       "OpenInterest": 10110550,
//       "Open": 18650.1,
//       "High": 18666.8,
//       "Low": 18634.6,
//       "Close": 18646
//     },
//     {
//       "LastTradeTime": 1686295800,
//       "QuotationLot": 50,
//       "TradedQty": 358000,
//       "OpenInterest": 10059300,
//       "Open": 18662.4,
//       "High": 18673.75,
//       "Low": 18645,
//       "Close": 18650.1
//     },
//     {
//       "LastTradeTime": 1686294000,
//       "QuotationLot": 50,
//       "TradedQty": 356650,
//       "OpenInterest": 10046800,
//       "Open": 18687.95,
//       "High": 18707.1,
//       "Low": 18658,
//       "Close": 18662.4
//     },
//     {
//       "LastTradeTime": 1686292200,
//       "QuotationLot": 50,
//       "TradedQty": 163150,
//       "OpenInterest": 9991750,
//       "Open": 18691.9,
//       "High": 18699,
//       "Low": 18679,
//       "Close": 18687.95
//     },
//     {
//       "LastTradeTime": 1686290400,
//       "QuotationLot": 50,
//       "TradedQty": 169850,
//       "OpenInterest": 10013300,
//       "Open": 18689.75,
//       "High": 18699.9,
//       "Low": 18676,
//       "Close": 18691.9
//     },
//     {
//       "LastTradeTime": 1686288600,
//       "QuotationLot": 50,
//       "TradedQty": 403400,
//       "OpenInterest": 10042100,
//       "Open": 18668.45,
//       "High": 18692.05,
//       "Low": 18656.15,
//       "Close": 18689.75
//     },
//     {
//       "LastTradeTime": 1686286800,
//       "QuotationLot": 50,
//       "TradedQty": 370250,
//       "OpenInterest": 10042700,
//       "Open": 18680,
//       "High": 18699,
//       "Low": 18662.25,
//       "Close": 18668.75
//     },
//     {
//       "LastTradeTime": 1686285000,
//       "QuotationLot": 50,
//       "TradedQty": 574450,
//       "OpenInterest": 10017750,
//       "Open": 18734,
//       "High": 18736,
//       "Low": 18680.55,
//       "Close": 18681.85
//     },
//     {
//       "LastTradeTime": 1686283200,
//       "QuotationLot": 50,
//       "TradedQty": 813500,
//       "OpenInterest": 9944600,
//       "Open": 18710,
//       "High": 18730.5,
//       "Low": 18675,
//       "Close": 18730.5
//     },
//     {
//       "LastTradeTime": 1686281400,
//       "QuotationLot": 50,
//       "TradedQty": 413550,
//       "OpenInterest": 9907350,
//       "Open": 18724.95,
//       "High": 18739.95,
//       "Low": 18710,
//       "Close": 18711
//     },
//     {
//       "LastTradeTime": 1686218400,
//       "QuotationLot": 50,
//       "TradedQty": 50,
//       "OpenInterest": 9983650,
//       "Open": 18722,
//       "High": 18722,
//       "Low": 18722,
//       "Close": 18722
//     },
//     {
//       "LastTradeTime": 1686216600,
//       "QuotationLot": 50,
//       "TradedQty": 1108850,
//       "OpenInterest": 9983650,
//       "Open": 18716.3,
//       "High": 18725,
//       "Low": 18693.5,
//       "Close": 18722
//     },
//     {
//       "LastTradeTime": 1686214800,
//       "QuotationLot": 50,
//       "TradedQty": 642450,
//       "OpenInterest": 9861450,
//       "Open": 18754.05,
//       "High": 18762,
//       "Low": 18706.75,
//       "Close": 18715.45
//     },
//     {
//       "LastTradeTime": 1686213000,
//       "QuotationLot": 50,
//       "TradedQty": 487250,
//       "OpenInterest": 9849300,
//       "Open": 18789,
//       "High": 18794,
//       "Low": 18741,
//       "Close": 18754.05
//     },
//     {
//       "LastTradeTime": 1686211200,
//       "QuotationLot": 50,
//       "TradedQty": 409050,
//       "OpenInterest": 9823300,
//       "Open": 18755.2,
//       "High": 18789.65,
//       "Low": 18752.55,
//       "Close": 18789
//     },
//     {
//       "LastTradeTime": 1686209400,
//       "QuotationLot": 50,
//       "TradedQty": 209100,
//       "OpenInterest": 9860700,
//       "Open": 18764.2,
//       "High": 18768,
//       "Low": 18746,
//       "Close": 18754.95
//     },
//     {
//       "LastTradeTime": 1686207600,
//       "QuotationLot": 50,
//       "TradedQty": 267700,
//       "OpenInterest": 9842550,
//       "Open": 18765,
//       "High": 18771.7,
//       "Low": 18750.9,
//       "Close": 18764.2
//     },
//     {
//       "LastTradeTime": 1686205800,
//       "QuotationLot": 50,
//       "TradedQty": 699450,
//       "OpenInterest": 9808350,
//       "Open": 18756,
//       "High": 18776.1,
//       "Low": 18744.9,
//       "Close": 18765
//     },
//     {
//       "LastTradeTime": 1686204000,
//       "QuotationLot": 50,
//       "TradedQty": 864350,
//       "OpenInterest": 9751600,
//       "Open": 18821.4,
//       "High": 18824.95,
//       "Low": 18755,
//       "Close": 18758
//     },
//     {
//       "LastTradeTime": 1686202200,
//       "QuotationLot": 50,
//       "TradedQty": 243150,
//       "OpenInterest": 9786250,
//       "Open": 18838.9,
//       "High": 18840.95,
//       "Low": 18811.15,
//       "Close": 18821.4
//     },
//     {
//       "LastTradeTime": 1686200400,
//       "QuotationLot": 50,
//       "TradedQty": 209050,
//       "OpenInterest": 9705750,
//       "Open": 18832.45,
//       "High": 18842,
//       "Low": 18824.45,
//       "Close": 18838.9
//     },
//     {
//       "LastTradeTime": 1686198600,
//       "QuotationLot": 50,
//       "TradedQty": 454150,
//       "OpenInterest": 9630550,
//       "Open": 18820.05,
//       "High": 18839.85,
//       "Low": 18807.25,
//       "Close": 18834
//     },
//     {
//       "LastTradeTime": 1686196800,
//       "QuotationLot": 50,
//       "TradedQty": 324000,
//       "OpenInterest": 9600150,
//       "Open": 18816.95,
//       "High": 18828.9,
//       "Low": 18808.4,
//       "Close": 18821
//     },
//     {
//       "LastTradeTime": 1686195000,
//       "QuotationLot": 50,
//       "TradedQty": 435800,
//       "OpenInterest": 9591450,
//       "Open": 18811.1,
//       "High": 18819.9,
//       "Low": 18780,
//       "Close": 18817.05
//     },
//     {
//       "LastTradeTime": 1686132000,
//       "QuotationLot": 50,
//       "TradedQty": 350,
//       "OpenInterest": 9768650,
//       "Open": 18800.2,
//       "High": 18800.2,
//       "Low": 18800.2,
//       "Close": 18800.2
//     },
//     {
//       "LastTradeTime": 1686130200,
//       "QuotationLot": 50,
//       "TradedQty": 1014100,
//       "OpenInterest": 9768650,
//       "Open": 18795.75,
//       "High": 18807.65,
//       "Low": 18789.6,
//       "Close": 18800
//     },
//     {
//       "LastTradeTime": 1686128400,
//       "QuotationLot": 50,
//       "TradedQty": 573300,
//       "OpenInterest": 9568000,
//       "Open": 18786.4,
//       "High": 18802,
//       "Low": 18782,
//       "Close": 18798
//     },
//     {
//       "LastTradeTime": 1686126600,
//       "QuotationLot": 50,
//       "TradedQty": 516550,
//       "OpenInterest": 9426200,
//       "Open": 18769.35,
//       "High": 18794.7,
//       "Low": 18768.9,
//       "Close": 18786.9
//     },
//     {
//       "LastTradeTime": 1686124800,
//       "QuotationLot": 50,
//       "TradedQty": 234000,
//       "OpenInterest": 9296450,
//       "Open": 18758.5,
//       "High": 18769.35,
//       "Low": 18748.9,
//       "Close": 18769.15
//     },
//     {
//       "LastTradeTime": 1686123000,
//       "QuotationLot": 50,
//       "TradedQty": 205350,
//       "OpenInterest": 9237550,
//       "Open": 18762.95,
//       "High": 18769.75,
//       "Low": 18757.2,
//       "Close": 18758.15
//     },
//     {
//       "LastTradeTime": 1686121200,
//       "QuotationLot": 50,
//       "TradedQty": 539750,
//       "OpenInterest": 9170750,
//       "Open": 18744,
//       "High": 18774,
//       "Low": 18738.6,
//       "Close": 18760.2
//     },
//     {
//       "LastTradeTime": 1686119400,
//       "QuotationLot": 50,
//       "TradedQty": 189750,
//       "OpenInterest": 9083300,
//       "Open": 18743.1,
//       "High": 18746.85,
//       "Low": 18735.8,
//       "Close": 18744
//     },
//     {
//       "LastTradeTime": 1686117600,
//       "QuotationLot": 50,
//       "TradedQty": 147300,
//       "OpenInterest": 9034900,
//       "Open": 18733.55,
//       "High": 18744.85,
//       "Low": 18724.65,
//       "Close": 18743.1
//     },
//     {
//       "LastTradeTime": 1686115800,
//       "QuotationLot": 50,
//       "TradedQty": 141450,
//       "OpenInterest": 9018350,
//       "Open": 18727.1,
//       "High": 18738.8,
//       "Low": 18726.5,
//       "Close": 18733.55
//     },
//     {
//       "LastTradeTime": 1686114000,
//       "QuotationLot": 50,
//       "TradedQty": 210950,
//       "OpenInterest": 8979600,
//       "Open": 18735.95,
//       "High": 18738,
//       "Low": 18716,
//       "Close": 18727.1
//     },
//     {
//       "LastTradeTime": 1686112200,
//       "QuotationLot": 50,
//       "TradedQty": 274900,
//       "OpenInterest": 8992650,
//       "Open": 18728.75,
//       "High": 18737.6,
//       "Low": 18721.65,
//       "Close": 18735.95
//     },
//     {
//       "LastTradeTime": 1686110400,
//       "QuotationLot": 50,
//       "TradedQty": 314600,
//       "OpenInterest": 8934600,
//       "Open": 18725.4,
//       "High": 18733.8,
//       "Low": 18719.35,
//       "Close": 18728.75
//     },
//     {
//       "LastTradeTime": 1686108600,
//       "QuotationLot": 50,
//       "TradedQty": 565800,
//       "OpenInterest": 8861050,
//       "Open": 18715.5,
//       "High": 18732.45,
//       "Low": 18706.6,
//       "Close": 18725.25
//     },
//     {
//       "LastTradeTime": 1686045600,
//       "QuotationLot": 50,
//       "TradedQty": 0,
//       "OpenInterest": 9290300,
//       "Open": 18683.95,
//       "High": 18683.95,
//       "Low": 18683.95,
//       "Close": 18683.95
//     },
//     {
//       "LastTradeTime": 1686043800,
//       "QuotationLot": 50,
//       "TradedQty": 1310650,
//       "OpenInterest": 9290300,
//       "Open": 18631.05,
//       "High": 18685.35,
//       "Low": 18631.05,
//       "Close": 18683.95
//     },
//     {
//       "LastTradeTime": 1686042000,
//       "QuotationLot": 50,
//       "TradedQty": 167550,
//       "OpenInterest": 9511250,
//       "Open": 18629.6,
//       "High": 18639,
//       "Low": 18621,
//       "Close": 18631.05
//     },
//     {
//       "LastTradeTime": 1686040200,
//       "QuotationLot": 50,
//       "TradedQty": 211550,
//       "OpenInterest": 9525000,
//       "Open": 18635.6,
//       "High": 18639.65,
//       "Low": 18617.35,
//       "Close": 18630.55
//     },
//     {
//       "LastTradeTime": 1686038400,
//       "QuotationLot": 50,
//       "TradedQty": 215450,
//       "OpenInterest": 9504050,
//       "Open": 18634,
//       "High": 18644.85,
//       "Low": 18631.85,
//       "Close": 18635.6
//     },
//     {
//       "LastTradeTime": 1686036600,
//       "QuotationLot": 50,
//       "TradedQty": 252550,
//       "OpenInterest": 9405650,
//       "Open": 18642,
//       "High": 18644.9,
//       "Low": 18628.3,
//       "Close": 18634.2
//     },
//     {
//       "LastTradeTime": 1686034800,
//       "QuotationLot": 50,
//       "TradedQty": 208600,
//       "OpenInterest": 9329950,
//       "Open": 18617.4,
//       "High": 18643,
//       "Low": 18617.4,
//       "Close": 18642
//     },
//     {
//       "LastTradeTime": 1686033000,
//       "QuotationLot": 50,
//       "TradedQty": 220900,
//       "OpenInterest": 9347300,
//       "Open": 18620.3,
//       "High": 18620.3,
//       "Low": 18605.55,
//       "Close": 18617.35
//     },
//     {
//       "LastTradeTime": 1686031200,
//       "QuotationLot": 50,
//       "TradedQty": 239750,
//       "OpenInterest": 9342150,
//       "Open": 18631.25,
//       "High": 18631.45,
//       "Low": 18611.45,
//       "Close": 18618.15
//     },
//     {
//       "LastTradeTime": 1686029400,
//       "QuotationLot": 50,
//       "TradedQty": 465700,
//       "OpenInterest": 9334800,
//       "Open": 18639.95,
//       "High": 18640.9,
//       "Low": 18614,
//       "Close": 18631.25
//     },
//     {
//       "LastTradeTime": 1686027600,
//       "QuotationLot": 50,
//       "TradedQty": 327500,
//       "OpenInterest": 9256150,
//       "Open": 18642,
//       "High": 18652.55,
//       "Low": 18627.1,
//       "Close": 18639.95
//     },
//     {
//       "LastTradeTime": 1686025800,
//       "QuotationLot": 50,
//       "TradedQty": 458600,
//       "OpenInterest": 9269100,
//       "Open": 18666,
//       "High": 18669.95,
//       "Low": 18641,
//       "Close": 18642
//     },
//     {
//       "LastTradeTime": 1686024000,
//       "QuotationLot": 50,
//       "TradedQty": 409900,
//       "OpenInterest": 9224450,
//       "Open": 18682.6,
//       "High": 18700.75,
//       "Low": 18665,
//       "Close": 18666
//     },
//     {
//       "LastTradeTime": 1686022200,
//       "QuotationLot": 50,
//       "TradedQty": 600400,
//       "OpenInterest": 9236050,
//       "Open": 18675,
//       "High": 18696.65,
//       "Low": 18659.9,
//       "Close": 18683.95
//     },
//     {
//       "LastTradeTime": 1685959200,
//       "QuotationLot": 50,
//       "TradedQty": 200,
//       "OpenInterest": 9253600,
//       "Open": 18702,
//       "High": 18702,
//       "Low": 18702,
//       "Close": 18702
//     },
//     {
//       "LastTradeTime": 1685957400,
//       "QuotationLot": 50,
//       "TradedQty": 630200,
//       "OpenInterest": 9253600,
//       "Open": 18708.3,
//       "High": 18712.5,
//       "Low": 18685.95,
//       "Close": 18703
//     },
//     {
//       "LastTradeTime": 1685955600,
//       "QuotationLot": 50,
//       "TradedQty": 162200,
//       "OpenInterest": 9333850,
//       "Open": 18716.1,
//       "High": 18721.45,
//       "Low": 18698,
//       "Close": 18710
//     },
//     {
//       "LastTradeTime": 1685953800,
//       "QuotationLot": 50,
//       "TradedQty": 121000,
//       "OpenInterest": 9330750,
//       "Open": 18718.2,
//       "High": 18722,
//       "Low": 18705.1,
//       "Close": 18716.1
//     },
//     {
//       "LastTradeTime": 1685952000,
//       "QuotationLot": 50,
//       "TradedQty": 143600,
//       "OpenInterest": 9332350,
//       "Open": 18706.55,
//       "High": 18724.35,
//       "Low": 18703.25,
//       "Close": 18717.3
//     },
//     {
//       "LastTradeTime": 1685950200,
//       "QuotationLot": 50,
//       "TradedQty": 150050,
//       "OpenInterest": 9313750,
//       "Open": 18709.65,
//       "High": 18717.25,
//       "Low": 18695,
//       "Close": 18706.55
//     },
//     {
//       "LastTradeTime": 1685948400,
//       "QuotationLot": 50,
//       "TradedQty": 171450,
//       "OpenInterest": 9305950,
//       "Open": 18716,
//       "High": 18717,
//       "Low": 18698,
//       "Close": 18708.8
//     },
//     {
//       "LastTradeTime": 1685946600,
//       "QuotationLot": 50,
//       "TradedQty": 113500,
//       "OpenInterest": 9308500,
//       "Open": 18713.6,
//       "High": 18723.6,
//       "Low": 18709.3,
//       "Close": 18714.95
//     },
//     {
//       "LastTradeTime": 1685944800,
//       "QuotationLot": 50,
//       "TradedQty": 226200,
//       "OpenInterest": 9289800,
//       "Open": 18722.1,
//       "High": 18725.4,
//       "Low": 18711,
//       "Close": 18713.65
//     },
//     {
//       "LastTradeTime": 1685943000,
//       "QuotationLot": 50,
//       "TradedQty": 189050,
//       "OpenInterest": 9219450,
//       "Open": 18714.9,
//       "High": 18729,
//       "Low": 18711.5,
//       "Close": 18724.9
//     },
//     {
//       "LastTradeTime": 1685941200,
//       "QuotationLot": 50,
//       "TradedQty": 238050,
//       "OpenInterest": 9232900,
//       "Open": 18713.5,
//       "High": 18719.95,
//       "Low": 18702.4,
//       "Close": 18712
//     },
//     {
//       "LastTradeTime": 1685939400,
//       "QuotationLot": 50,
//       "TradedQty": 462100,
//       "OpenInterest": 9286600,
//       "Open": 18708,
//       "High": 18727.4,
//       "Low": 18700.55,
//       "Close": 18712.05
//     },
//     {
//       "LastTradeTime": 1685937600,
//       "QuotationLot": 50,
//       "TradedQty": 396850,
//       "OpenInterest": 9213950,
//       "Open": 18698.7,
//       "High": 18710.9,
//       "Low": 18676.6,
//       "Close": 18708.45
//     },
//     {
//       "LastTradeTime": 1685935800,
//       "QuotationLot": 50,
//       "TradedQty": 601600,
//       "OpenInterest": 9139600,
//       "Open": 18700.2,
//       "High": 18715,
//       "Low": 18685.1,
//       "Close": 18699.85
//     },
//     {
//       "LastTradeTime": 1685700000,
//       "QuotationLot": 50,
//       "TradedQty": 950,
//       "OpenInterest": 9257550,
//       "Open": 18633,
//       "High": 18633,
//       "Low": 18633,
//       "Close": 18633
//     },
//     {
//       "LastTradeTime": 1685698200,
//       "QuotationLot": 50,
//       "TradedQty": 783300,
//       "OpenInterest": 9257550,
//       "Open": 18628,
//       "High": 18662.9,
//       "Low": 18612.55,
//       "Close": 18631.6
//     },
//     {
//       "LastTradeTime": 1685696400,
//       "QuotationLot": 50,
//       "TradedQty": 425450,
//       "OpenInterest": 9146250,
//       "Open": 18611.4,
//       "High": 18629.6,
//       "Low": 18585.4,
//       "Close": 18628
//     },
//     {
//       "LastTradeTime": 1685694600,
//       "QuotationLot": 50,
//       "TradedQty": 569800,
//       "OpenInterest": 9055500,
//       "Open": 18656.55,
//       "High": 18665.95,
//       "Low": 18595.05,
//       "Close": 18612
//     },
//     {
//       "LastTradeTime": 1685692800,
//       "QuotationLot": 50,
//       "TradedQty": 487650,
//       "OpenInterest": 9087250,
//       "Open": 18663.3,
//       "High": 18675.5,
//       "Low": 18653.2,
//       "Close": 18656.6
//     },
//     {
//       "LastTradeTime": 1685691000,
//       "QuotationLot": 50,
//       "TradedQty": 480150,
//       "OpenInterest": 9091450,
//       "Open": 18635,
//       "High": 18663.85,
//       "Low": 18622.55,
//       "Close": 18663.05
//     },
//     {
//       "LastTradeTime": 1685689200,
//       "QuotationLot": 50,
//       "TradedQty": 145450,
//       "OpenInterest": 9045300,
//       "Open": 18621.25,
//       "High": 18639.05,
//       "Low": 18618.7,
//       "Close": 18635
//     },
//     {
//       "LastTradeTime": 1685687400,
//       "QuotationLot": 50,
//       "TradedQty": 326850,
//       "OpenInterest": 9046600,
//       "Open": 18631.1,
//       "High": 18642.55,
//       "Low": 18609.2,
//       "Close": 18621.25
//     },
//     {
//       "LastTradeTime": 1685685600,
//       "QuotationLot": 50,
//       "TradedQty": 284350,
//       "OpenInterest": 8994700,
//       "Open": 18607.7,
//       "High": 18634.7,
//       "Low": 18605.85,
//       "Close": 18631.1
//     },
//     {
//       "LastTradeTime": 1685683800,
//       "QuotationLot": 50,
//       "TradedQty": 182550,
//       "OpenInterest": 9030700,
//       "Open": 18607.65,
//       "High": 18616,
//       "Low": 18595.65,
//       "Close": 18607.7
//     },
//     {
//       "LastTradeTime": 1685682000,
//       "QuotationLot": 50,
//       "TradedQty": 287150,
//       "OpenInterest": 9011950,
//       "Open": 18572.95,
//       "High": 18613.95,
//       "Low": 18567,
//       "Close": 18607
//     },
//     {
//       "LastTradeTime": 1685680200,
//       "QuotationLot": 50,
//       "TradedQty": 651450,
//       "OpenInterest": 9028350,
//       "Open": 18582,
//       "High": 18586.45,
//       "Low": 18556.35,
//       "Close": 18570.8
//     },
//     {
//       "LastTradeTime": 1685678400,
//       "QuotationLot": 50,
//       "TradedQty": 629900,
//       "OpenInterest": 8937850,
//       "Open": 18639.95,
//       "High": 18653.7,
//       "Low": 18581,
//       "Close": 18582
//     },
//     {
//       "LastTradeTime": 1685676600,
//       "QuotationLot": 50,
//       "TradedQty": 752900,
//       "OpenInterest": 8824900,
//       "Open": 18618.65,
//       "High": 18656.9,
//       "Low": 18610.7,
//       "Close": 18638
//     },
//     {
//       "LastTradeTime": 1685613600,
//       "QuotationLot": 50,
//       "TradedQty": 600,
//       "OpenInterest": 9291350,
//       "Open": 18574.8,
//       "High": 18574.8,
//       "Low": 18574.8,
//       "Close": 18574.8
//     },
//     {
//       "LastTradeTime": 1685611800,
//       "QuotationLot": 50,
//       "TradedQty": 1061050,
//       "OpenInterest": 9291350,
//       "Open": 18595.6,
//       "High": 18600.3,
//       "Low": 18550,
//       "Close": 18573.95
//     },
//     {
//       "LastTradeTime": 1685610000,
//       "QuotationLot": 50,
//       "TradedQty": 387150,
//       "OpenInterest": 9355000,
//       "Open": 18603.9,
//       "High": 18605.7,
//       "Low": 18576.05,
//       "Close": 18597.45
//     },
//     {
//       "LastTradeTime": 1685608200,
//       "QuotationLot": 50,
//       "TradedQty": 253800,
//       "OpenInterest": 9328250,
//       "Open": 18589.25,
//       "High": 18609.05,
//       "Low": 18582.5,
//       "Close": 18603.9
//     },
//     {
//       "LastTradeTime": 1685606400,
//       "QuotationLot": 50,
//       "TradedQty": 324250,
//       "OpenInterest": 9314300,
//       "Open": 18620,
//       "High": 18623,
//       "Low": 18581.2,
//       "Close": 18591
//     },
//     {
//       "LastTradeTime": 1685604600,
//       "QuotationLot": 50,
//       "TradedQty": 190050,
//       "OpenInterest": 9416150,
//       "Open": 18618,
//       "High": 18631.05,
//       "Low": 18610.65,
//       "Close": 18619.95
//     },
//     {
//       "LastTradeTime": 1685602800,
//       "QuotationLot": 50,
//       "TradedQty": 243700,
//       "OpenInterest": 9411000,
//       "Open": 18616.05,
//       "High": 18625.95,
//       "Low": 18610.05,
//       "Close": 18615.55
//     },
//     {
//       "LastTradeTime": 1685601000,
//       "QuotationLot": 50,
//       "TradedQty": 535100,
//       "OpenInterest": 9453250,
//       "Open": 18625.3,
//       "High": 18632.45,
//       "Low": 18595.5,
//       "Close": 18616.05
//     },
//     {
//       "LastTradeTime": 1685599200,
//       "QuotationLot": 50,
//       "TradedQty": 128000,
//       "OpenInterest": 9390250,
//       "Open": 18633.75,
//       "High": 18640.55,
//       "Low": 18621.9,
//       "Close": 18625.3
//     },
//     {
//       "LastTradeTime": 1685597400,
//       "QuotationLot": 50,
//       "TradedQty": 129200,
//       "OpenInterest": 9372400,
//       "Open": 18634.95,
//       "High": 18648.4,
//       "Low": 18626.4,
//       "Close": 18633.8
//     },
//     {
//       "LastTradeTime": 1685595600,
//       "QuotationLot": 50,
//       "TradedQty": 245000,
//       "OpenInterest": 9366950,
//       "Open": 18633.3,
//       "High": 18644.8,
//       "Low": 18626.25,
//       "Close": 18634.95
//     },
//     {
//       "LastTradeTime": 1685593800,
//       "QuotationLot": 50,
//       "TradedQty": 331850,
//       "OpenInterest": 9364800,
//       "Open": 18650,
//       "High": 18654.95,
//       "Low": 18620.05,
//       "Close": 18633.3
//     },
//     {
//       "LastTradeTime": 1685592000,
//       "QuotationLot": 50,
//       "TradedQty": 702300,
//       "OpenInterest": 9389200,
//       "Open": 18594,
//       "High": 18659,
//       "Low": 18590.2,
//       "Close": 18651.7
//     },
//     {
//       "LastTradeTime": 1685590200,
//       "QuotationLot": 50,
//       "TradedQty": 540250,
//       "OpenInterest": 9336250,
//       "Open": 18624.95,
//       "High": 18633.4,
//       "Low": 18596.05,
//       "Close": 18597.05
//     },
//     {
//       "LastTradeTime": 1685527200,
//       "QuotationLot": 50,
//       "TradedQty": 1100,
//       "OpenInterest": 9797500,
//       "Open": 18622.6,
//       "High": 18622.6,
//       "Low": 18622.6,
//       "Close": 18622.6
//     },
//     {
//       "LastTradeTime": 1685525400,
//       "QuotationLot": 50,
//       "TradedQty": 1046550,
//       "OpenInterest": 9797500,
//       "Open": 18637,
//       "High": 18651.55,
//       "Low": 18606.05,
//       "Close": 18624.95
//     },
//     {
//       "LastTradeTime": 1685523600,
//       "QuotationLot": 50,
//       "TradedQty": 348500,
//       "OpenInterest": 9684100,
//       "Open": 18623.45,
//       "High": 18636.8,
//       "Low": 18616.35,
//       "Close": 18635
//     },
//     {
//       "LastTradeTime": 1685521800,
//       "QuotationLot": 50,
//       "TradedQty": 376350,
//       "OpenInterest": 9714100,
//       "Open": 18617,
//       "High": 18624,
//       "Low": 18590.1,
//       "Close": 18623.2
//     },
//     {
//       "LastTradeTime": 1685520000,
//       "QuotationLot": 50,
//       "TradedQty": 329550,
//       "OpenInterest": 9704400,
//       "Open": 18600.6,
//       "High": 18618.75,
//       "Low": 18590,
//       "Close": 18616.8
//     },
//     {
//       "LastTradeTime": 1685518200,
//       "QuotationLot": 50,
//       "TradedQty": 192750,
//       "OpenInterest": 9692550,
//       "Open": 18602.2,
//       "High": 18603.6,
//       "Low": 18581.2,
//       "Close": 18600.55
//     },
//     {
//       "LastTradeTime": 1685516400,
//       "QuotationLot": 50,
//       "TradedQty": 424400,
//       "OpenInterest": 9680000,
//       "Open": 18575.65,
//       "High": 18604,
//       "Low": 18567.05,
//       "Close": 18602.1
//     },
//     {
//       "LastTradeTime": 1685514600,
//       "QuotationLot": 50,
//       "TradedQty": 329800,
//       "OpenInterest": 9645200,
//       "Open": 18586.85,
//       "High": 18593.85,
//       "Low": 18566,
//       "Close": 18577
//     },
//     {
//       "LastTradeTime": 1685512800,
//       "QuotationLot": 50,
//       "TradedQty": 717350,
//       "OpenInterest": 9645200,
//       "Open": 18617.95,
//       "High": 18618.85,
//       "Low": 18572,
//       "Close": 18586.85
//     },
//     {
//       "LastTradeTime": 1685511000,
//       "QuotationLot": 50,
//       "TradedQty": 254650,
//       "OpenInterest": 9644200,
//       "Open": 18627.8,
//       "High": 18637.45,
//       "Low": 18615.45,
//       "Close": 18617.9
//     },
//     {
//       "LastTradeTime": 1685509200,
//       "QuotationLot": 50,
//       "TradedQty": 426950,
//       "OpenInterest": 9666450,
//       "Open": 18627.65,
//       "High": 18632,
//       "Low": 18606.25,
//       "Close": 18627.7
//     },
//     {
//       "LastTradeTime": 1685507400,
//       "QuotationLot": 50,
//       "TradedQty": 475850,
//       "OpenInterest": 9752250,
//       "Open": 18634.7,
//       "High": 18660.95,
//       "Low": 18624.3,
//       "Close": 18628.6
//     },
//     {
//       "LastTradeTime": 1685505600,
//       "QuotationLot": 50,
//       "TradedQty": 811050,
//       "OpenInterest": 9734250,
//       "Open": 18638,
//       "High": 18649,
//       "Low": 18620,
//       "Close": 18634
//     },
//     {
//       "LastTradeTime": 1685503800,
//       "QuotationLot": 50,
//       "TradedQty": 835600,
//       "OpenInterest": 9870700,
//       "Open": 18680.6,
//       "High": 18680.6,
//       "Low": 18626.85,
//       "Close": 18637.45
//     },
//     {
//       "LastTradeTime": 1685440800,
//       "QuotationLot": 50,
//       "TradedQty": 50,
//       "OpenInterest": 10073700,
//       "Open": 18720,
//       "High": 18720,
//       "Low": 18720,
//       "Close": 18720
//     },
//     {
//       "LastTradeTime": 1685439000,
//       "QuotationLot": 50,
//       "TradedQty": 524450,
//       "OpenInterest": 10073700,
//       "Open": 18713.9,
//       "High": 18722.2,
//       "Low": 18696,
//       "Close": 18720
//     },
//     {
//       "LastTradeTime": 1685437200,
//       "QuotationLot": 50,
//       "TradedQty": 300300,
//       "OpenInterest": 10034450,
//       "Open": 18697.15,
//       "High": 18724.7,
//       "Low": 18690.9,
//       "Close": 18713
//     },
//     {
//       "LastTradeTime": 1685435400,
//       "QuotationLot": 50,
//       "TradedQty": 182750,
//       "OpenInterest": 10018800,
//       "Open": 18687,
//       "High": 18710.8,
//       "Low": 18684.2,
//       "Close": 18697.4
//     },
//     {
//       "LastTradeTime": 1685433600,
//       "QuotationLot": 50,
//       "TradedQty": 149650,
//       "OpenInterest": 9998550,
//       "Open": 18691.05,
//       "High": 18702.95,
//       "Low": 18685.4,
//       "Close": 18687
//     },
//     {
//       "LastTradeTime": 1685431800,
//       "QuotationLot": 50,
//       "TradedQty": 146250,
//       "OpenInterest": 9953400,
//       "Open": 18684.7,
//       "High": 18699,
//       "Low": 18679,
//       "Close": 18691.05
//     },
//     {
//       "LastTradeTime": 1685430000,
//       "QuotationLot": 50,
//       "TradedQty": 171500,
//       "OpenInterest": 9937500,
//       "Open": 18683.05,
//       "High": 18687.1,
//       "Low": 18661,
//       "Close": 18684.7
//     },
//     {
//       "LastTradeTime": 1685428200,
//       "QuotationLot": 50,
//       "TradedQty": 98500,
//       "OpenInterest": 9938900,
//       "Open": 18675,
//       "High": 18698,
//       "Low": 18673.9,
//       "Close": 18683.05
//     },
//     {
//       "LastTradeTime": 1685426400,
//       "QuotationLot": 50,
//       "TradedQty": 147050,
//       "OpenInterest": 9931550,
//       "Open": 18689.75,
//       "High": 18703.4,
//       "Low": 18671.55,
//       "Close": 18674.55
//     },
//     {
//       "LastTradeTime": 1685424600,
//       "QuotationLot": 50,
//       "TradedQty": 258100,
//       "OpenInterest": 9922100,
//       "Open": 18666.1,
//       "High": 18692.5,
//       "Low": 18661,
//       "Close": 18689.75
//     },
//     {
//       "LastTradeTime": 1685422800,
//       "QuotationLot": 50,
//       "TradedQty": 450450,
//       "OpenInterest": 9877350,
//       "Open": 18716.5,
//       "High": 18716.5,
//       "Low": 18662.3,
//       "Close": 18668.55
//     },
//     {
//       "LastTradeTime": 1685421000,
//       "QuotationLot": 50,
//       "TradedQty": 444550,
//       "OpenInterest": 9923150,
//       "Open": 18713,
//       "High": 18742.4,
//       "Low": 18709.45,
//       "Close": 18718
//     },
//     {
//       "LastTradeTime": 1685419200,
//       "QuotationLot": 50,
//       "TradedQty": 428750,
//       "OpenInterest": 9797750,
//       "Open": 18712,
//       "High": 18727.5,
//       "Low": 18694.7,
//       "Close": 18713
//     },
//     {
//       "LastTradeTime": 1685417400,
//       "QuotationLot": 50,
//       "TradedQty": 526200,
//       "OpenInterest": 9703850,
//       "Open": 18660,
//       "High": 18719.4,
//       "Low": 18654.05,
//       "Close": 18711
//     },
//     {
//       "LastTradeTime": 1685354400,
//       "QuotationLot": 50,
//       "TradedQty": 150,
//       "OpenInterest": 9688300,
//       "Open": 18674.85,
//       "High": 18674.85,
//       "Low": 18674.85,
//       "Close": 18674.85
//     },
//     {
//       "LastTradeTime": 1685352600,
//       "QuotationLot": 50,
//       "TradedQty": 588350,
//       "OpenInterest": 9688300,
//       "Open": 18678,
//       "High": 18694,
//       "Low": 18664.05,
//       "Close": 18675
//     },
//     {
//       "LastTradeTime": 1685350800,
//       "QuotationLot": 50,
//       "TradedQty": 290700,
//       "OpenInterest": 9813100,
//       "Open": 18667.3,
//       "High": 18685,
//       "Low": 18656.2,
//       "Close": 18679.95
//     },
//     {
//       "LastTradeTime": 1685349000,
//       "QuotationLot": 50,
//       "TradedQty": 389250,
//       "OpenInterest": 9839900,
//       "Open": 18698.15,
//       "High": 18706,
//       "Low": 18651.05,
//       "Close": 18666.75
//     },
//     {
//       "LastTradeTime": 1685347200,
//       "QuotationLot": 50,
//       "TradedQty": 270050,
//       "OpenInterest": 9802000,
//       "Open": 18683.75,
//       "High": 18701.7,
//       "Low": 18680,
//       "Close": 18699
//     },
//     {
//       "LastTradeTime": 1685345400,
//       "QuotationLot": 50,
//       "TradedQty": 212600,
//       "OpenInterest": 9743050,
//       "Open": 18667.7,
//       "High": 18690.2,
//       "Low": 18663.15,
//       "Close": 18685
//     },
//     {
//       "LastTradeTime": 1685343600,
//       "QuotationLot": 50,
//       "TradedQty": 535250,
//       "OpenInterest": 9771900,
//       "Open": 18693.45,
//       "High": 18693.45,
//       "Low": 18657.05,
//       "Close": 18667.7
//     },
//     {
//       "LastTradeTime": 1685341800,
//       "QuotationLot": 50,
//       "TradedQty": 123700,
//       "OpenInterest": 9933900,
//       "Open": 18702.1,
//       "High": 18707.05,
//       "Low": 18686.35,
//       "Close": 18693.45
//     },
//     {
//       "LastTradeTime": 1685340000,
//       "QuotationLot": 50,
//       "TradedQty": 142850,
//       "OpenInterest": 9928150,
//       "Open": 18709.2,
//       "High": 18716.9,
//       "Low": 18691.5,
//       "Close": 18702.1
//     },
//     {
//       "LastTradeTime": 1685338200,
//       "QuotationLot": 50,
//       "TradedQty": 284700,
//       "OpenInterest": 9900950,
//       "Open": 18695,
//       "High": 18717.5,
//       "Low": 18691.5,
//       "Close": 18709.2
//     },
//     {
//       "LastTradeTime": 1685336400,
//       "QuotationLot": 50,
//       "TradedQty": 307800,
//       "OpenInterest": 9827550,
//       "Open": 18681.55,
//       "High": 18702.15,
//       "Low": 18677.95,
//       "Close": 18695
//     },
//     {
//       "LastTradeTime": 1685334600,
//       "QuotationLot": 50,
//       "TradedQty": 602000,
//       "OpenInterest": 9968500,
//       "Open": 18669.15,
//       "High": 18688.85,
//       "Low": 18648.2,
//       "Close": 18681.7
//     },
//     {
//       "LastTradeTime": 1685332800,
//       "QuotationLot": 50,
//       "TradedQty": 688000,
//       "OpenInterest": 9864600,
//       "Open": 18697,
//       "High": 18702.85,
//       "Low": 18661.1,
//       "Close": 18670
//     },
//     {
//       "LastTradeTime": 1685331000,
//       "QuotationLot": 50,
//       "TradedQty": 1083750,
//       "OpenInterest": 9738150,
//       "Open": 18697.15,
//       "High": 18709.9,
//       "Low": 18665,
//       "Close": 18697.5
//     },
//     {
//       "LastTradeTime": 1685095200,
//       "QuotationLot": 50,
//       "TradedQty": 0,
//       "OpenInterest": 9979850,
//       "Open": 18570.2,
//       "High": 18570.2,
//       "Low": 18570.2,
//       "Close": 18570.2
//     },
//     {
//       "LastTradeTime": 1685093400,
//       "QuotationLot": 50,
//       "TradedQty": 971550,
//       "OpenInterest": 9979850,
//       "Open": 18571.05,
//       "High": 18590,
//       "Low": 18561,
//       "Close": 18570.2
//     },
//     {
//       "LastTradeTime": 1685091600,
//       "QuotationLot": 50,
//       "TradedQty": 441950,
//       "OpenInterest": 9981050,
//       "Open": 18575.45,
//       "High": 18584,
//       "Low": 18556.05,
//       "Close": 18571.05
//     },
//     {
//       "LastTradeTime": 1685089800,
//       "QuotationLot": 50,
//       "TradedQty": 611200,
//       "OpenInterest": 9942300,
//       "Open": 18557.5,
//       "High": 18587.55,
//       "Low": 18556.5,
//       "Close": 18574.45
//     },
//     {
//       "LastTradeTime": 1685088000,
//       "QuotationLot": 50,
//       "TradedQty": 729800,
//       "OpenInterest": 9735800,
//       "Open": 18515.75,
//       "High": 18566,
//       "Low": 18513.05,
//       "Close": 18557.4
//     },
//     {
//       "LastTradeTime": 1685086200,
//       "QuotationLot": 50,
//       "TradedQty": 331200,
//       "OpenInterest": 9423150,
//       "Open": 18523.45,
//       "High": 18528.5,
//       "Low": 18502.6,
//       "Close": 18515.75
//     },
//     {
//       "LastTradeTime": 1685084400,
//       "QuotationLot": 50,
//       "TradedQty": 430800,
//       "OpenInterest": 9443800,
//       "Open": 18511,
//       "High": 18531.8,
//       "Low": 18505.2,
//       "Close": 18523.6
//     },
//     {
//       "LastTradeTime": 1685082600,
//       "QuotationLot": 50,
//       "TradedQty": 402400,
//       "OpenInterest": 9365850,
//       "Open": 18517.6,
//       "High": 18530,
//       "Low": 18507,
//       "Close": 18512.05
//     },
//     {
//       "LastTradeTime": 1685080800,
//       "QuotationLot": 50,
//       "TradedQty": 502100,
//       "OpenInterest": 9292750,
//       "Open": 18497.6,
//       "High": 18523.75,
//       "Low": 18495,
//       "Close": 18519.7
//     },
//     {
//       "LastTradeTime": 1685079000,
//       "QuotationLot": 50,
//       "TradedQty": 610750,
//       "OpenInterest": 9133200,
//       "Open": 18465.4,
//       "High": 18504,
//       "Low": 18465.4,
//       "Close": 18497.6
//     },
//     {
//       "LastTradeTime": 1685077200,
//       "QuotationLot": 50,
//       "TradedQty": 324300,
//       "OpenInterest": 9024300,
//       "Open": 18466.1,
//       "High": 18479,
//       "Low": 18460.55,
//       "Close": 18468
//     },
//     {
//       "LastTradeTime": 1685075400,
//       "QuotationLot": 50,
//       "TradedQty": 379750,
//       "OpenInterest": 8935050,
//       "Open": 18456.1,
//       "High": 18470.75,
//       "Low": 18445,
//       "Close": 18466.1
//     },
//     {
//       "LastTradeTime": 1685073600,
//       "QuotationLot": 50,
//       "TradedQty": 711000,
//       "OpenInterest": 8922300,
//       "Open": 18448.35,
//       "High": 18462.05,
//       "Low": 18424.05,
//       "Close": 18456.1
//     },
//     {
//       "LastTradeTime": 1685071800,
//       "QuotationLot": 50,
//       "TradedQty": 775450,
//       "OpenInterest": 8793850,
//       "Open": 18440.35,
//       "High": 18451,
//       "Low": 18419,
//       "Close": 18449.5
//     },
//     {
//       "LastTradeTime": 1685007000,
//       "QuotationLot": 50,
//       "TradedQty": 899900,
//       "OpenInterest": 5106200,
//       "Open": 18306.3,
//       "High": 18333.05,
//       "Low": 18303.5,
//       "Close": 18324.9
//     },
//     {
//       "LastTradeTime": 1685005200,
//       "QuotationLot": 50,
//       "TradedQty": 478150,
//       "OpenInterest": 5481200,
//       "Open": 18251.4,
//       "High": 18308.95,
//       "Low": 18247,
//       "Close": 18304.35
//     },
//     {
//       "LastTradeTime": 1685003400,
//       "QuotationLot": 50,
//       "TradedQty": 555650,
//       "OpenInterest": 5693450,
//       "Open": 18212.55,
//       "High": 18269.5,
//       "Low": 18211.65,
//       "Close": 18249.9
//     },
//     {
//       "LastTradeTime": 1685000600,
//       "QuotationLot": 50,
//       "TradedQty": 369550,
//       "OpenInterest": 5797900,
//       "Open": 18218.8,
//       "High": 18226.5,
//       "Low": 18202.75,
//       "Close": 18212.8
//     },
//     {
//       "LastTradeTime": 1684999800,
//       "QuotationLot": 50,
//       "TradedQty": 311900,
//       "OpenInterest": 5852700,
//       "Open": 18231,
//       "High": 18234.75,
//       "Low": 18210.15,
//       "Close": 18218.8
//     },
//     {
//       "LastTradeTime": 1684998000,
//       "QuotationLot": 50,
//       "TradedQty": 351600,
//       "OpenInterest": 5928650,
//       "Open": 18249.8,
//       "High": 18249.8,
//       "Low": 18225.75,
//       "Close": 18231
//     },
//     {
//       "LastTradeTime": 1684996200,
//       "QuotationLot": 50,
//       "TradedQty": 357250,
//       "OpenInterest": 5950700,
//       "Open": 18239.1,
//       "High": 18257.65,
//       "Low": 18230,
//       "Close": 18246.75
//     },
//     {
//       "LastTradeTime": 1684994400,
//       "QuotationLot": 50,
//       "TradedQty": 447150,
//       "OpenInterest": 6061850,
//       "Open": 18225.2,
//       "High": 18243.3,
//       "Low": 18212.5,
//       "Close": 18239.1
//     },
//     {
//       "LastTradeTime": 1684992600,
//       "QuotationLot": 50,
//       "TradedQty": 536850,
//       "OpenInterest": 6068800,
//       "Open": 18261.6,
//       "High": 18263.65,
//       "Low": 18224.95,
//       "Close": 18227
//     },
//     {
//       "LastTradeTime": 1684990800,
//       "QuotationLot": 50,
//       "TradedQty": 294950,
//       "OpenInterest": 6180400,
//       "Open": 18255.5,
//       "High": 18269,
//       "Low": 18250,
//       "Close": 18261.1
//     },
//     {
//       "LastTradeTime": 1684989000,
//       "QuotationLot": 50,
//       "TradedQty": 426200,
//       "OpenInterest": 6175600,
//       "Open": 18279,
//       "High": 18293.5,
//       "Low": 18252,
//       "Close": 18255.55
//     },
//     {
//       "LastTradeTime": 1684987200,
//       "QuotationLot": 50,
//       "TradedQty": 564050,
//       "OpenInterest": 6239700,
//       "Open": 18260,
//       "High": 18305.45,
//       "Low": 18241,
//       "Close": 18279.25
//     },
//     {
//       "LastTradeTime": 1684985400,
//       "QuotationLot": 50,
//       "TradedQty": 408950,
//       "OpenInterest": 6322400,
//       "Open": 18270,
//       "High": 18299.45,
//       "Low": 18253.2,
//       "Close": 18260.15
//     },
//     {
//       "LastTradeTime": 1684922400,
//       "QuotationLot": 50,
//       "TradedQty": 150,
//       "OpenInterest": 8647950,
//       "Open": 18300.3,
//       "High": 18300.3,
//       "Low": 18300.3,
//       "Close": 18300.3
//     },
//     {
//       "LastTradeTime": 1684920600,
//       "QuotationLot": 50,
//       "TradedQty": 1091800,
//       "OpenInterest": 8647950,
//       "Open": 18273.1,
//       "High": 18305,
//       "Low": 18273.1,
//       "Close": 18301
//     },
//     {
//       "LastTradeTime": 1684918800,
//       "QuotationLot": 50,
//       "TradedQty": 804250,
//       "OpenInterest": 8929750,
//       "Open": 18324.3,
//       "High": 18344.15,
//       "Low": 18265.2,
//       "Close": 18273.7
//     },
//     {
//       "LastTradeTime": 1684917000,
//       "QuotationLot": 50,
//       "TradedQty": 329550,
//       "OpenInterest": 8968400,
//       "Open": 18312.2,
//       "High": 18333.95,
//       "Low": 18302.6,
//       "Close": 18324.3
//     },
//     {
//       "LastTradeTime": 1684915200,
//       "QuotationLot": 50,
//       "TradedQty": 310400,
//       "OpenInterest": 8987200,
//       "Open": 18314.85,
//       "High": 18338.3,
//       "Low": 18307.2,
//       "Close": 18312.2
//     },
//     {
//       "LastTradeTime": 1684913400,
//       "QuotationLot": 50,
//       "TradedQty": 411850,
//       "OpenInterest": 8983350,
//       "Open": 18333.9,
//       "High": 18337.4,
//       "Low": 18302,
//       "Close": 18314.9
//     },
//     {
//       "LastTradeTime": 1684911600,
//       "QuotationLot": 50,
//       "TradedQty": 398850,
//       "OpenInterest": 9001600,
//       "Open": 18341.75,
//       "High": 18345.1,
//       "Low": 18323,
//       "Close": 18333.9
//     },
//     {
//       "LastTradeTime": 1684909800,
//       "QuotationLot": 50,
//       "TradedQty": 413650,
//       "OpenInterest": 9015950,
//       "Open": 18368.15,
//       "High": 18368.15,
//       "Low": 18337.15,
//       "Close": 18342.65
//     },
//     {
//       "LastTradeTime": 1684908000,
//       "QuotationLot": 50,
//       "TradedQty": 333850,
//       "OpenInterest": 8984600,
//       "Open": 18388.8,
//       "High": 18388.8,
//       "Low": 18358.45,
//       "Close": 18368.15
//     },
//     {
//       "LastTradeTime": 1684906200,
//       "QuotationLot": 50,
//       "TradedQty": 269000,
//       "OpenInterest": 8958300,
//       "Open": 18385.8,
//       "High": 18394.5,
//       "Low": 18373.2,
//       "Close": 18385.15
//     },
//     {
//       "LastTradeTime": 1684904400,
//       "QuotationLot": 50,
//       "TradedQty": 474200,
//       "OpenInterest": 8903350,
//       "Open": 18357.05,
//       "High": 18394.5,
//       "Low": 18353.85,
//       "Close": 18385.75
//     },
//     {
//       "LastTradeTime": 1684902600,
//       "QuotationLot": 50,
//       "TradedQty": 674750,
//       "OpenInterest": 8729500,
//       "Open": 18353.65,
//       "High": 18384,
//       "Low": 18350,
//       "Close": 18357.05
//     },
//     {
//       "LastTradeTime": 1684900800,
//       "QuotationLot": 50,
//       "TradedQty": 655800,
//       "OpenInterest": 8638500,
//       "Open": 18314.05,
//       "High": 18356.4,
//       "Low": 18313.5,
//       "Close": 18353.65
//     },
//     {
//       "LastTradeTime": 1684899000,
//       "QuotationLot": 50,
//       "TradedQty": 550550,
//       "OpenInterest": 8507300,
//       "Open": 18301,
//       "High": 18315.45,
//       "Low": 18284.5,
//       "Close": 18313
//     },
//     {
//       "LastTradeTime": 1684836000,
//       "QuotationLot": 50,
//       "TradedQty": 200,
//       "OpenInterest": 9970400,
//       "Open": 18358.1,
//       "High": 18358.1,
//       "Low": 18358.1,
//       "Close": 18358.1
//     },
//     {
//       "LastTradeTime": 1684834200,
//       "QuotationLot": 50,
//       "TradedQty": 1019800,
//       "OpenInterest": 9970400,
//       "Open": 18384.25,
//       "High": 18388,
//       "Low": 18347.75,
//       "Close": 18358.1
//     },
//     {
//       "LastTradeTime": 1684832400,
//       "QuotationLot": 50,
//       "TradedQty": 534050,
//       "OpenInterest": 9920900,
//       "Open": 18413.7,
//       "High": 18416.75,
//       "Low": 18361.7,
//       "Close": 18386.15
//     },
//     {
//       "LastTradeTime": 1684830600,
//       "QuotationLot": 50,
//       "TradedQty": 221300,
//       "OpenInterest": 10033500,
//       "Open": 18411.3,
//       "High": 18418.8,
//       "Low": 18401,
//       "Close": 18412.2
//     },
//     {
//       "LastTradeTime": 1684828800,
//       "QuotationLot": 50,
//       "TradedQty": 210700,
//       "OpenInterest": 10064450,
//       "Open": 18407,
//       "High": 18419,
//       "Low": 18402.65,
//       "Close": 18411.3
//     },
//     {
//       "LastTradeTime": 1684827000,
//       "QuotationLot": 50,
//       "TradedQty": 369800,
//       "OpenInterest": 10002100,
//       "Open": 18422.95,
//       "High": 18429,
//       "Low": 18392.2,
//       "Close": 18407.45
//     },
//     {
//       "LastTradeTime": 1684825200,
//       "QuotationLot": 50,
//       "TradedQty": 220950,
//       "OpenInterest": 9909000,
//       "Open": 18412.95,
//       "High": 18422.1,
//       "Low": 18408,
//       "Close": 18422.1
//     },
//     {
//       "LastTradeTime": 1684823400,
//       "QuotationLot": 50,
//       "TradedQty": 169800,
//       "OpenInterest": 9823050,
//       "Open": 18405.85,
//       "High": 18418.25,
//       "Low": 18404.55,
//       "Close": 18412.05
//     },
//     {
//       "LastTradeTime": 1684821600,
//       "QuotationLot": 50,
//       "TradedQty": 263700,
//       "OpenInterest": 9764250,
//       "Open": 18412.05,
//       "High": 18415.35,
//       "Low": 18400.05,
//       "Close": 18405.5
//     },
//     {
//       "LastTradeTime": 1684819800,
//       "QuotationLot": 50,
//       "TradedQty": 212500,
//       "OpenInterest": 9711100,
//       "Open": 18411.3,
//       "High": 18423.75,
//       "Low": 18408,
//       "Close": 18414
//     },
//     {
//       "LastTradeTime": 1684818000,
//       "QuotationLot": 50,
//       "TradedQty": 300550,
//       "OpenInterest": 9697550,
//       "Open": 18405.85,
//       "High": 18425,
//       "Low": 18402.1,
//       "Close": 18411.9
//     },
//     {
//       "LastTradeTime": 1684816200,
//       "QuotationLot": 50,
//       "TradedQty": 262600,
//       "OpenInterest": 9669600,
//       "Open": 18406.9,
//       "High": 18411.95,
//       "Low": 18391.05,
//       "Close": 18405.85
//     },
//     {
//       "LastTradeTime": 1684814400,
//       "QuotationLot": 50,
//       "TradedQty": 527250,
//       "OpenInterest": 9642300,
//       "Open": 18393.5,
//       "High": 18414.5,
//       "Low": 18393.5,
//       "Close": 18406.9
//     },
//     {
//       "LastTradeTime": 1684812600,
//       "QuotationLot": 50,
//       "TradedQty": 618050,
//       "OpenInterest": 9679050,
//       "Open": 18361.1,
//       "High": 18397.4,
//       "Low": 18350.05,
//       "Close": 18393.45
//     },
//     {
//       "LastTradeTime": 1684749600,
//       "QuotationLot": 50,
//       "TradedQty": 50,
//       "OpenInterest": 10527850,
//       "Open": 18324.65,
//       "High": 18324.65,
//       "Low": 18324.65,
//       "Close": 18324.65
//     },
//     {
//       "LastTradeTime": 1684747800,
//       "QuotationLot": 50,
//       "TradedQty": 703550,
//       "OpenInterest": 10527850,
//       "Open": 18332.9,
//       "High": 18350,
//       "Low": 18318.85,
//       "Close": 18324.9
//     },
//     {
//       "LastTradeTime": 1684746000,
//       "QuotationLot": 50,
//       "TradedQty": 337700,
//       "OpenInterest": 10701000,
//       "Open": 18315.95,
//       "High": 18342,
//       "Low": 18308.6,
//       "Close": 18331.75
//     },
//     {
//       "LastTradeTime": 1684744200,
//       "QuotationLot": 50,
//       "TradedQty": 312750,
//       "OpenInterest": 10675800,
//       "Open": 18314.15,
//       "High": 18335.75,
//       "Low": 18309,
//       "Close": 18315.95
//     },
//     {
//       "LastTradeTime": 1684742400,
//       "QuotationLot": 50,
//       "TradedQty": 438850,
//       "OpenInterest": 10613950,
//       "Open": 18291.45,
//       "High": 18317.45,
//       "Low": 18265.65,
//       "Close": 18313.5
//     },
//     {
//       "LastTradeTime": 1684740600,
//       "QuotationLot": 50,
//       "TradedQty": 318900,
//       "OpenInterest": 10653100,
//       "Open": 18315.05,
//       "High": 18328.35,
//       "Low": 18286,
//       "Close": 18291.45
//     },
//     {
//       "LastTradeTime": 1684738800,
//       "QuotationLot": 50,
//       "TradedQty": 380650,
//       "OpenInterest": 10693850,
//       "Open": 18316.25,
//       "High": 18320,
//       "Low": 18292.6,
//       "Close": 18318.05
//     },
//     {
//       "LastTradeTime": 1684737000,
//       "QuotationLot": 50,
//       "TradedQty": 472250,
//       "OpenInterest": 10686700,
//       "Open": 18320.15,
//       "High": 18350,
//       "Low": 18305.65,
//       "Close": 18316.25
//     },
//     {
//       "LastTradeTime": 1684735200,
//       "QuotationLot": 50,
//       "TradedQty": 315500,
//       "OpenInterest": 10608050,
//       "Open": 18312,
//       "High": 18330,
//       "Low": 18304,
//       "Close": 18323.15
//     },
//     {
//       "LastTradeTime": 1684733400,
//       "QuotationLot": 50,
//       "TradedQty": 305350,
//       "OpenInterest": 10593800,
//       "Open": 18326,
//       "High": 18333,
//       "Low": 18312,
//       "Close": 18312
//     },
//     {
//       "LastTradeTime": 1684731600,
//       "QuotationLot": 50,
//       "TradedQty": 453250,
//       "OpenInterest": 10654900,
//       "Open": 18291,
//       "High": 18328.3,
//       "Low": 18283.6,
//       "Close": 18326.5
//     },
//     {
//       "LastTradeTime": 1684729800,
//       "QuotationLot": 50,
//       "TradedQty": 577500,
//       "OpenInterest": 10584150,
//       "Open": 18291,
//       "High": 18294.8,
//       "Low": 18241,
//       "Close": 18292.85
//     },
//     {
//       "LastTradeTime": 1684728000,
//       "QuotationLot": 50,
//       "TradedQty": 708000,
//       "OpenInterest": 10560150,
//       "Open": 18273.6,
//       "High": 18315,
//       "Low": 18266.65,
//       "Close": 18290.95
//     },
//     {
//       "LastTradeTime": 1684726200,
//       "QuotationLot": 50,
//       "TradedQty": 666050,
//       "OpenInterest": 10560850,
//       "Open": 18215,
//       "High": 18279.9,
//       "Low": 18195.1,
//       "Close": 18273.1
//     },
//     {
//       "LastTradeTime": 1684490400,
//       "QuotationLot": 50,
//       "TradedQty": 250,
//       "OpenInterest": 11011450,
//       "Open": 18231,
//       "High": 18231,
//       "Low": 18231,
//       "Close": 18231
//     },
//     {
//       "LastTradeTime": 1684488600,
//       "QuotationLot": 50,
//       "TradedQty": 958600,
//       "OpenInterest": 11011450,
//       "Open": 18207.45,
//       "High": 18242,
//       "Low": 18192.5,
//       "Close": 18231
//     },
//     {
//       "LastTradeTime": 1684486800,
//       "QuotationLot": 50,
//       "TradedQty": 577550,
//       "OpenInterest": 11120400,
//       "Open": 18195,
//       "High": 18222.7,
//       "Low": 18185,
//       "Close": 18207
//     },
//     {
//       "LastTradeTime": 1684485000,
//       "QuotationLot": 50,
//       "TradedQty": 597550,
//       "OpenInterest": 11045650,
//       "Open": 18173,
//       "High": 18210,
//       "Low": 18173,
//       "Close": 18192.4
//     },
//     {
//       "LastTradeTime": 1684483200,
//       "QuotationLot": 50,
//       "TradedQty": 199900,
//       "OpenInterest": 10958600,
//       "Open": 18153.7,
//       "High": 18184.85,
//       "Low": 18141,
//       "Close": 18172.25
//     },
//     {
//       "LastTradeTime": 1684481400,
//       "QuotationLot": 50,
//       "TradedQty": 177250,
//       "OpenInterest": 10991150,
//       "Open": 18132,
//       "High": 18164,
//       "Low": 18132,
//       "Close": 18153.7
//     },
//     {
//       "LastTradeTime": 1684479600,
//       "QuotationLot": 50,
//       "TradedQty": 331950,
//       "OpenInterest": 10996250,
//       "Open": 18166.05,
//       "High": 18166.95,
//       "Low": 18120.05,
//       "Close": 18132
//     },
//     {
//       "LastTradeTime": 1684477800,
//       "QuotationLot": 50,
//       "TradedQty": 143050,
//       "OpenInterest": 11029950,
//       "Open": 18185,
//       "High": 18189.45,
//       "Low": 18159.95,
//       "Close": 18166.9
//     },
//     {
//       "LastTradeTime": 1684476000,
//       "QuotationLot": 50,
//       "TradedQty": 281350,
//       "OpenInterest": 11042250,
//       "Open": 18177.25,
//       "High": 18185,
//       "Low": 18154.35,
//       "Close": 18185
//     },
//     {
//       "LastTradeTime": 1684474200,
//       "QuotationLot": 50,
//       "TradedQty": 887700,
//       "OpenInterest": 11039050,
//       "Open": 18120,
//       "High": 18204.95,
//       "Low": 18116.25,
//       "Close": 18177.25
//     },
//     {
//       "LastTradeTime": 1684472400,
//       "QuotationLot": 50,
//       "TradedQty": 369100,
//       "OpenInterest": 11161950,
//       "Open": 18117,
//       "High": 18126.8,
//       "Low": 18084.05,
//       "Close": 18120
//     },
//     {
//       "LastTradeTime": 1684470600,
//       "QuotationLot": 50,
//       "TradedQty": 677500,
//       "OpenInterest": 11206250,
//       "Open": 18115,
//       "High": 18121,
//       "Low": 18092.1,
//       "Close": 18117
//     },
//     {
//       "LastTradeTime": 1684468800,
//       "QuotationLot": 50,
//       "TradedQty": 807800,
//       "OpenInterest": 11033950,
//       "Open": 18172.45,
//       "High": 18176.35,
//       "Low": 18106,
//       "Close": 18115
//     },
//     {
//       "LastTradeTime": 1684467000,
//       "QuotationLot": 50,
//       "TradedQty": 517650,
//       "OpenInterest": 10907250,
//       "Open": 18210,
//       "High": 18212.4,
//       "Low": 18165.05,
//       "Close": 18173.1
//     },
//     {
//       "LastTradeTime": 1684404000,
//       "QuotationLot": 50,
//       "TradedQty": 250,
//       "OpenInterest": 10969750,
//       "Open": 18180,
//       "High": 18180,
//       "Low": 18180,
//       "Close": 18180
//     },
//     {
//       "LastTradeTime": 1684402200,
//       "QuotationLot": 50,
//       "TradedQty": 947200,
//       "OpenInterest": 10969750,
//       "Open": 18188.95,
//       "High": 18196.95,
//       "Low": 18150.8,
//       "Close": 18180
//     },
//     {
//       "LastTradeTime": 1684400400,
//       "QuotationLot": 50,
//       "TradedQty": 307550,
//       "OpenInterest": 10851450,
//       "Open": 18200,
//       "High": 18204.85,
//       "Low": 18176.9,
//       "Close": 18189.95
//     },
//     {
//       "LastTradeTime": 1684398600,
//       "QuotationLot": 50,
//       "TradedQty": 408750,
//       "OpenInterest": 10839850,
//       "Open": 18222.85,
//       "High": 18228.95,
//       "Low": 18182.2,
//       "Close": 18202.95
//     },
//     {
//       "LastTradeTime": 1684396800,
//       "QuotationLot": 50,
//       "TradedQty": 395300,
//       "OpenInterest": 10789300,
//       "Open": 18232.2,
//       "High": 18245,
//       "Low": 18191.9,
//       "Close": 18222.85
//     },
//     {
//       "LastTradeTime": 1684395000,
//       "QuotationLot": 50,
//       "TradedQty": 242150,
//       "OpenInterest": 10813400,
//       "Open": 18213.75,
//       "High": 18232.95,
//       "Low": 18210.3,
//       "Close": 18230
//     },
//     {
//       "LastTradeTime": 1684393200,
//       "QuotationLot": 50,
//       "TradedQty": 333900,
//       "OpenInterest": 10820400,
//       "Open": 18229.8,
//       "High": 18245.1,
//       "Low": 18207.15,
//       "Close": 18213.25
//     },
//     {
//       "LastTradeTime": 1684391400,
//       "QuotationLot": 50,
//       "TradedQty": 391950,
//       "OpenInterest": 10822150,
//       "Open": 18273.65,
//       "High": 18275,
//       "Low": 18221.65,
//       "Close": 18227.25
//     },
//     {
//       "LastTradeTime": 1684389600,
//       "QuotationLot": 50,
//       "TradedQty": 186350,
//       "OpenInterest": 10811350,
//       "Open": 18267,
//       "High": 18282.9,
//       "Low": 18256.15,
//       "Close": 18273.65
//     },
//     {
//       "LastTradeTime": 1684387800,
//       "QuotationLot": 50,
//       "TradedQty": 178100,
//       "OpenInterest": 10794350,
//       "Open": 18259.35,
//       "High": 18277.85,
//       "Low": 18255.45,
//       "Close": 18268
//     },
//     {
//       "LastTradeTime": 1684386000,
//       "QuotationLot": 50,
//       "TradedQty": 217750,
//       "OpenInterest": 10802650,
//       "Open": 18262,
//       "High": 18264.85,
//       "Low": 18242.05,
//       "Close": 18259.35
//     },
//     {
//       "LastTradeTime": 1684384200,
//       "QuotationLot": 50,
//       "TradedQty": 389600,
//       "OpenInterest": 10834250,
//       "Open": 18271.8,
//       "High": 18273.95,
//       "Low": 18240,
//       "Close": 18262
//     },
//     {
//       "LastTradeTime": 1684382400,
//       "QuotationLot": 50,
//       "TradedQty": 552400,
//       "OpenInterest": 10818500,
//       "Open": 18304.25,
//       "High": 18314.85,
//       "Low": 18262.1,
//       "Close": 18271.8
//     },
//     {
//       "LastTradeTime": 1684380600,
//       "QuotationLot": 50,
//       "TradedQty": 777150,
//       "OpenInterest": 10799350,
//       "Open": 18290,
//       "High": 18324.55,
//       "Low": 18277.15,
//       "Close": 18306
//     },
//     {
//       "LastTradeTime": 1684317600,
//       "QuotationLot": 50,
//       "TradedQty": 0,
//       "OpenInterest": 11309350,
//       "Open": 18231.95,
//       "High": 18231.95,
//       "Low": 18231.95,
//       "Close": 18231.95
//     },
//     {
//       "LastTradeTime": 1684315800,
//       "QuotationLot": 50,
//       "TradedQty": 817150,
//       "OpenInterest": 11309350,
//       "Open": 18204.6,
//       "High": 18233.45,
//       "Low": 18194.55,
//       "Close": 18231.95
//     },
//     {
//       "LastTradeTime": 1684314000,
//       "QuotationLot": 50,
//       "TradedQty": 518800,
//       "OpenInterest": 11331900,
//       "Open": 18180.15,
//       "High": 18218,
//       "Low": 18180,
//       "Close": 18200.25
//     },
//     {
//       "LastTradeTime": 1684312200,
//       "QuotationLot": 50,
//       "TradedQty": 256350,
//       "OpenInterest": 11408800,
//       "Open": 18184.95,
//       "High": 18189.95,
//       "Low": 18166.95,
//       "Close": 18178.45
//     },
//     {
//       "LastTradeTime": 1684310400,
//       "QuotationLot": 50,
//       "TradedQty": 377650,
//       "OpenInterest": 11529450,
//       "Open": 18166.55,
//       "High": 18192.6,
//       "Low": 18160.5,
//       "Close": 18184.95
//     },
//     {
//       "LastTradeTime": 1684308600,
//       "QuotationLot": 50,
//       "TradedQty": 367350,
//       "OpenInterest": 11511050,
//       "Open": 18175.35,
//       "High": 18184.35,
//       "Low": 18157.6,
//       "Close": 18167.05
//     },
//     {
//       "LastTradeTime": 1684306800,
//       "QuotationLot": 50,
//       "TradedQty": 415400,
//       "OpenInterest": 11550500,
//       "Open": 18189.65,
//       "High": 18205.1,
//       "Low": 18170,
//       "Close": 18175.35
//     },
//     {
//       "LastTradeTime": 1684305000,
//       "QuotationLot": 50,
//       "TradedQty": 553200,
//       "OpenInterest": 11594750,
//       "Open": 18184.4,
//       "High": 18195.25,
//       "Low": 18166.25,
//       "Close": 18191.15
//     },
//     {
//       "LastTradeTime": 1684303200,
//       "QuotationLot": 50,
//       "TradedQty": 1148100,
//       "OpenInterest": 11616250,
//       "Open": 18249.05,
//       "High": 18249.05,
//       "Low": 18173.85,
//       "Close": 18185
//     },
//     {
//       "LastTradeTime": 1684301400,
//       "QuotationLot": 50,
//       "TradedQty": 1710800,
//       "OpenInterest": 11529600,
//       "Open": 18259.2,
//       "High": 18270.2,
//       "Low": 18241.4,
//       "Close": 18249.05
//     },
//     {
//       "LastTradeTime": 1684299600,
//       "QuotationLot": 50,
//       "TradedQty": 540300,
//       "OpenInterest": 11805100,
//       "Open": 18275,
//       "High": 18280,
//       "Low": 18252.05,
//       "Close": 18259.45
//     },
//     {
//       "LastTradeTime": 1684297800,
//       "QuotationLot": 50,
//       "TradedQty": 369600,
//       "OpenInterest": 11784500,
//       "Open": 18301.9,
//       "High": 18313.9,
//       "Low": 18273,
//       "Close": 18275
//     },
//     {
//       "LastTradeTime": 1684296000,
//       "QuotationLot": 50,
//       "TradedQty": 478550,
//       "OpenInterest": 11739900,
//       "Open": 18289.35,
//       "High": 18311.9,
//       "Low": 18282,
//       "Close": 18304
//     },
//     {
//       "LastTradeTime": 1684294200,
//       "QuotationLot": 50,
//       "TradedQty": 452250,
//       "OpenInterest": 11741100,
//       "Open": 18315.6,
//       "High": 18328.35,
//       "Low": 18285,
//       "Close": 18291
//     },
//     {
//       "LastTradeTime": 1684231200,
//       "QuotationLot": 50,
//       "TradedQty": 600,
//       "OpenInterest": 12032700,
//       "Open": 18325.1,
//       "High": 18325.1,
//       "Low": 18325.1,
//       "Close": 18325.1
//     },
//     {
//       "LastTradeTime": 1684229400,
//       "QuotationLot": 50,
//       "TradedQty": 1168750,
//       "OpenInterest": 12032700,
//       "Open": 18362,
//       "High": 18362,
//       "Low": 18312,
//       "Close": 18326.1
//     },
//     {
//       "LastTradeTime": 1684227600,
//       "QuotationLot": 50,
//       "TradedQty": 484950,
//       "OpenInterest": 12027800,
//       "Open": 18380.6,
//       "High": 18390,
//       "Low": 18353,
//       "Close": 18363.05
//     },
//     {
//       "LastTradeTime": 1684225800,
//       "QuotationLot": 50,
//       "TradedQty": 346500,
//       "OpenInterest": 12000000,
//       "Open": 18403.15,
//       "High": 18409.9,
//       "Low": 18364.9,
//       "Close": 18380.6
//     },
//     {
//       "LastTradeTime": 1684224000,
//       "QuotationLot": 50,
//       "TradedQty": 201400,
//       "OpenInterest": 11965550,
//       "Open": 18397.85,
//       "High": 18414,
//       "Low": 18388.25,
//       "Close": 18403.15
//     },
//     {
//       "LastTradeTime": 1684222200,
//       "QuotationLot": 50,
//       "TradedQty": 209550,
//       "OpenInterest": 11944950,
//       "Open": 18387.7,
//       "High": 18407.85,
//       "Low": 18385,
//       "Close": 18397.85
//     },
//     {
//       "LastTradeTime": 1684220400,
//       "QuotationLot": 50,
//       "TradedQty": 280150,
//       "OpenInterest": 11810650,
//       "Open": 18397.35,
//       "High": 18409.45,
//       "Low": 18376.25,
//       "Close": 18387.7
//     },
//     {
//       "LastTradeTime": 1684218600,
//       "QuotationLot": 50,
//       "TradedQty": 125600,
//       "OpenInterest": 11739400,
//       "Open": 18382.5,
//       "High": 18404.1,
//       "Low": 18382.15,
//       "Close": 18397.35
//     },
//     {
//       "LastTradeTime": 1684216800,
//       "QuotationLot": 50,
//       "TradedQty": 342500,
//       "OpenInterest": 11746950,
//       "Open": 18390.1,
//       "High": 18396.75,
//       "Low": 18370.05,
//       "Close": 18382.5
//     },
//     {
//       "LastTradeTime": 1684215000,
//       "QuotationLot": 50,
//       "TradedQty": 244700,
//       "OpenInterest": 11705600,
//       "Open": 18414.9,
//       "High": 18422.5,
//       "Low": 18384.1,
//       "Close": 18388.35
//     },
//     {
//       "LastTradeTime": 1684213200,
//       "QuotationLot": 50,
//       "TradedQty": 267750,
//       "OpenInterest": 11711900,
//       "Open": 18413.5,
//       "High": 18418.8,
//       "Low": 18392,
//       "Close": 18414.9
//     },
//     {
//       "LastTradeTime": 1684211400,
//       "QuotationLot": 50,
//       "TradedQty": 253700,
//       "OpenInterest": 11686200,
//       "Open": 18425.65,
//       "High": 18445.75,
//       "Low": 18406.3,
//       "Close": 18413.5
//     },
//     {
//       "LastTradeTime": 1684209600,
//       "QuotationLot": 50,
//       "TradedQty": 451200,
//       "OpenInterest": 11668500,
//       "Open": 18421.5,
//       "High": 18441.95,
//       "Low": 18388.55,
//       "Close": 18426.9
//     },
//     {
//       "LastTradeTime": 1684207800,
//       "QuotationLot": 50,
//       "TradedQty": 549550,
//       "OpenInterest": 11650950,
//       "Open": 18439,
//       "High": 18445.6,
//       "Low": 18396,
//       "Close": 18422.15
//     },
//     {
//       "LastTradeTime": 1684144800,
//       "QuotationLot": 50,
//       "TradedQty": 50,
//       "OpenInterest": 11846900,
//       "Open": 18411.35,
//       "High": 18411.35,
//       "Low": 18411.35,
//       "Close": 18411.35
//     },
//     {
//       "LastTradeTime": 1684143000,
//       "QuotationLot": 50,
//       "TradedQty": 988600,
//       "OpenInterest": 11846900,
//       "Open": 18457.15,
//       "High": 18460,
//       "Low": 18404.1,
//       "Close": 18408
//     },
//     {
//       "LastTradeTime": 1684141200,
//       "QuotationLot": 50,
//       "TradedQty": 278200,
//       "OpenInterest": 11848300,
//       "Open": 18442.55,
//       "High": 18464.85,
//       "Low": 18439.1,
//       "Close": 18460
//     },
//     {
//       "LastTradeTime": 1684139400,
//       "QuotationLot": 50,
//       "TradedQty": 344750,
//       "OpenInterest": 11776950,
//       "Open": 18462.55,
//       "High": 18473.1,
//       "Low": 18440,
//       "Close": 18443.95
//     },
//     {
//       "LastTradeTime": 1684137600,
//       "QuotationLot": 50,
//       "TradedQty": 227650,
//       "OpenInterest": 11779250,
//       "Open": 18455,
//       "High": 18468.3,
//       "Low": 18448.55,
//       "Close": 18462
//     },
//     {
//       "LastTradeTime": 1684135800,
//       "QuotationLot": 50,
//       "TradedQty": 189250,
//       "OpenInterest": 11768400,
//       "Open": 18452.95,
//       "High": 18459.2,
//       "Low": 18446.2,
//       "Close": 18455
//     },
//     {
//       "LastTradeTime": 1684134000,
//       "QuotationLot": 50,
//       "TradedQty": 238100,
//       "OpenInterest": 11727050,
//       "Open": 18442.15,
//       "High": 18459,
//       "Low": 18435,
//       "Close": 18452.8
//     },
//     {
//       "LastTradeTime": 1684132200,
//       "QuotationLot": 50,
//       "TradedQty": 249500,
//       "OpenInterest": 11685100,
//       "Open": 18429.55,
//       "High": 18444.95,
//       "Low": 18423,
//       "Close": 18442.25
//     },
//     {
//       "LastTradeTime": 1684130400,
//       "QuotationLot": 50,
//       "TradedQty": 275700,
//       "OpenInterest": 11645600,
//       "Open": 18434.85,
//       "High": 18439.95,
//       "Low": 18428,
//       "Close": 18429.55
//     },
//     {
//       "LastTradeTime": 1684128600,
//       "QuotationLot": 50,
//       "TradedQty": 345500,
//       "OpenInterest": 11577100,
//       "Open": 18400.75,
//       "High": 18436,
//       "Low": 18400.75,
//       "Close": 18434.9
//     },
//     {
//       "LastTradeTime": 1684126800,
//       "QuotationLot": 50,
//       "TradedQty": 217700,
//       "OpenInterest": 11537350,
//       "Open": 18395.4,
//       "High": 18410,
//       "Low": 18390.1,
//       "Close": 18400.75
//     },
//     {
//       "LastTradeTime": 1684125000,
//       "QuotationLot": 50,
//       "TradedQty": 465600,
//       "OpenInterest": 11501200,
//       "Open": 18383.7,
//       "High": 18407.45,
//       "Low": 18383.7,
//       "Close": 18395.4
//     },
//     {
//       "LastTradeTime": 1684123200,
//       "QuotationLot": 50,
//       "TradedQty": 807450,
//       "OpenInterest": 11518850,
//       "Open": 18354.3,
//       "High": 18388.9,
//       "Low": 18337.25,
//       "Close": 18383.7
//     },
//     {
//       "LastTradeTime": 1684121400,
//       "QuotationLot": 50,
//       "TradedQty": 586050,
//       "OpenInterest": 11700400,
//       "Open": 18300,
//       "High": 18370,
//       "Low": 18288,
//       "Close": 18353.1
//     },
//     {
//       "LastTradeTime": 1683885600,
//       "QuotationLot": 50,
//       "TradedQty": 0,
//       "OpenInterest": 11773250,
//       "Open": 18334,
//       "High": 18334,
//       "Low": 18334,
//       "Close": 18334
//     },
//     {
//       "LastTradeTime": 1683883800,
//       "QuotationLot": 50,
//       "TradedQty": 617650,
//       "OpenInterest": 11773250,
//       "Open": 18347.4,
//       "High": 18353.15,
//       "Low": 18325.8,
//       "Close": 18334
//     },
//     {
//       "LastTradeTime": 1683882000,
//       "QuotationLot": 50,
//       "TradedQty": 350250,
//       "OpenInterest": 11834750,
//       "Open": 18345,
//       "High": 18360,
//       "Low": 18330.45,
//       "Close": 18351.5
//     },
//     {
//       "LastTradeTime": 1683880200,
//       "QuotationLot": 50,
//       "TradedQty": 280000,
//       "OpenInterest": 11740150,
//       "Open": 18353,
//       "High": 18365,
//       "Low": 18343.05,
//       "Close": 18345
//     },
//     {
//       "LastTradeTime": 1683878400,
//       "QuotationLot": 50,
//       "TradedQty": 414650,
//       "OpenInterest": 11717850,
//       "Open": 18320.5,
//       "High": 18359.9,
//       "Low": 18320.5,
//       "Close": 18353
//     },
//     {
//       "LastTradeTime": 1683876600,
//       "QuotationLot": 50,
//       "TradedQty": 434050,
//       "OpenInterest": 11656700,
//       "Open": 18333.75,
//       "High": 18344.7,
//       "Low": 18320.15,
//       "Close": 18320.6
//     },
//     {
//       "LastTradeTime": 1683874800,
//       "QuotationLot": 50,
//       "TradedQty": 327700,
//       "OpenInterest": 11541950,
//       "Open": 18313.15,
//       "High": 18332.95,
//       "Low": 18306,
//       "Close": 18332.15
//     },
//     {
//       "LastTradeTime": 1683873000,
//       "QuotationLot": 50,
//       "TradedQty": 230250,
//       "OpenInterest": 11512000,
//       "Open": 18304,
//       "High": 18319,
//       "Low": 18292,
//       "Close": 18312.55
//     },
//     {
//       "LastTradeTime": 1683871200,
//       "QuotationLot": 50,
//       "TradedQty": 183750,
//       "OpenInterest": 11500400,
//       "Open": 18287.2,
//       "High": 18306.05,
//       "Low": 18284.7,
//       "Close": 18304
//     },
//     {
//       "LastTradeTime": 1683869400,
//       "QuotationLot": 50,
//       "TradedQty": 330250,
//       "OpenInterest": 11498900,
//       "Open": 18298.8,
//       "High": 18310,
//       "Low": 18277.2,
//       "Close": 18287.4
//     },
//     {
//       "LastTradeTime": 1683867600,
//       "QuotationLot": 50,
//       "TradedQty": 367200,
//       "OpenInterest": 11471150,
//       "Open": 18283,
//       "High": 18305.35,
//       "Low": 18280,
//       "Close": 18298.8
//     },
//     {
//       "LastTradeTime": 1683865800,
//       "QuotationLot": 50,
//       "TradedQty": 450800,
//       "OpenInterest": 11462450,
//       "Open": 18258,
//       "High": 18292.7,
//       "Low": 18252.2,
//       "Close": 18282
//     },
//     {
//       "LastTradeTime": 1683864000,
//       "QuotationLot": 50,
//       "TradedQty": 1286450,
//       "OpenInterest": 11486000,
//       "Open": 18258,
//       "High": 18265,
//       "Low": 18215.45,
//       "Close": 18257.05
//     },
//     {
//       "LastTradeTime": 1683862200,
//       "QuotationLot": 50,
//       "TradedQty": 873900,
//       "OpenInterest": 11645700,
//       "Open": 18298.95,
//       "High": 18299,
//       "Low": 18250,
//       "Close": 18258.6
//     },
//     {
//       "LastTradeTime": 1683799200,
//       "QuotationLot": 50,
//       "TradedQty": 600,
//       "OpenInterest": 11886250,
//       "Open": 18356,
//       "High": 18356,
//       "Low": 18356,
//       "Close": 18356
//     },
//     {
//       "LastTradeTime": 1683797400,
//       "QuotationLot": 50,
//       "TradedQty": 1108200,
//       "OpenInterest": 11886250,
//       "Open": 18339.1,
//       "High": 18370,
//       "Low": 18328.85,
//       "Close": 18359
//     },
//     {
//       "LastTradeTime": 1683795600,
//       "QuotationLot": 50,
//       "TradedQty": 572100,
//       "OpenInterest": 11686750,
//       "Open": 18360,
//       "High": 18367.55,
//       "Low": 18316,
//       "Close": 18336.75
//     },
//     {
//       "LastTradeTime": 1683793800,
//       "QuotationLot": 50,
//       "TradedQty": 329050,
//       "OpenInterest": 11731150,
//       "Open": 18363.8,
//       "High": 18390.55,
//       "Low": 18347.3,
//       "Close": 18361.15
//     },
//     {
//       "LastTradeTime": 1683792000,
//       "QuotationLot": 50,
//       "TradedQty": 147000,
//       "OpenInterest": 11717950,
//       "Open": 18361.45,
//       "High": 18373,
//       "Low": 18350,
//       "Close": 18363.8
//     },
//     {
//       "LastTradeTime": 1683790200,
//       "QuotationLot": 50,
//       "TradedQty": 246550,
//       "OpenInterest": 11701000,
//       "Open": 18357.95,
//       "High": 18372.55,
//       "Low": 18354.55,
//       "Close": 18361.45
//     },
//     {
//       "LastTradeTime": 1683788400,
//       "QuotationLot": 50,
//       "TradedQty": 161100,
//       "OpenInterest": 11597850,
//       "Open": 18356.2,
//       "High": 18362.9,
//       "Low": 18339.2,
//       "Close": 18357.95
//     },
//     {
//       "LastTradeTime": 1683786600,
//       "QuotationLot": 50,
//       "TradedQty": 178850,
//       "OpenInterest": 11584900,
//       "Open": 18336.3,
//       "High": 18357,
//       "Low": 18330,
//       "Close": 18356.7
//     },
//     {
//       "LastTradeTime": 1683784800,
//       "QuotationLot": 50,
//       "TradedQty": 237900,
//       "OpenInterest": 11578500,
//       "Open": 18363,
//       "High": 18367,
//       "Low": 18333.05,
//       "Close": 18337
//     },
//     {
//       "LastTradeTime": 1683783000,
//       "QuotationLot": 50,
//       "TradedQty": 150900,
//       "OpenInterest": 11544200,
//       "Open": 18369.7,
//       "High": 18374.85,
//       "Low": 18356.75,
//       "Close": 18363.1
//     },
//     {
//       "LastTradeTime": 1683781200,
//       "QuotationLot": 50,
//       "TradedQty": 298950,
//       "OpenInterest": 11505350,
//       "Open": 18358.2,
//       "High": 18380,
//       "Low": 18354.2,
//       "Close": 18369.05
//     },
//     {
//       "LastTradeTime": 1683779400,
//       "QuotationLot": 50,
//       "TradedQty": 420550,
//       "OpenInterest": 11448000,
//       "Open": 18342.05,
//       "High": 18365,
//       "Low": 18339.3,
//       "Close": 18358.2
//     },
//     {
//       "LastTradeTime": 1683777600,
//       "QuotationLot": 50,
//       "TradedQty": 574150,
//       "OpenInterest": 11302400,
//       "Open": 18345,
//       "High": 18364.95,
//       "Low": 18320,
//       "Close": 18342.05
//     },
//     {
//       "LastTradeTime": 1683775800,
//       "QuotationLot": 50,
//       "TradedQty": 612500,
//       "OpenInterest": 11246650,
//       "Open": 18375.1,
//       "High": 18390,
//       "Low": 18340,
//       "Close": 18343.45
//     },
//     {
//       "LastTradeTime": 1683712800,
//       "QuotationLot": 50,
//       "TradedQty": 50,
//       "OpenInterest": 11312200,
//       "Open": 18342.85,
//       "High": 18342.85,
//       "Low": 18342.85,
//       "Close": 18342.85
//     },
//     {
//       "LastTradeTime": 1683711000,
//       "QuotationLot": 50,
//       "TradedQty": 830650,
//       "OpenInterest": 11312200,
//       "Open": 18322,
//       "High": 18358.5,
//       "Low": 18317,
//       "Close": 18343
//     },
//     {
//       "LastTradeTime": 1683709200,
//       "QuotationLot": 50,
//       "TradedQty": 160550,
//       "OpenInterest": 11320650,
//       "Open": 18321.9,
//       "High": 18327.65,
//       "Low": 18305.05,
//       "Close": 18322
//     },
//     {
//       "LastTradeTime": 1683707400,
//       "QuotationLot": 50,
//       "TradedQty": 306350,
//       "OpenInterest": 11305300,
//       "Open": 18316,
//       "High": 18341.65,
//       "Low": 18311.95,
//       "Close": 18321.5
//     },
//     {
//       "LastTradeTime": 1683705600,
//       "QuotationLot": 50,
//       "TradedQty": 314800,
//       "OpenInterest": 11299050,
//       "Open": 18288,
//       "High": 18322.95,
//       "Low": 18275,
//       "Close": 18316
//     },
//     {
//       "LastTradeTime": 1683703800,
//       "QuotationLot": 50,
//       "TradedQty": 292650,
//       "OpenInterest": 11320500,
//       "Open": 18326.3,
//       "High": 18330,
//       "Low": 18280,
//       "Close": 18287.95
//     },
//     {
//       "LastTradeTime": 1683702000,
//       "QuotationLot": 50,
//       "TradedQty": 176500,
//       "OpenInterest": 11318000,
//       "Open": 18317,
//       "High": 18334.35,
//       "Low": 18313.3,
//       "Close": 18326.3
//     },
//     {
//       "LastTradeTime": 1683700200,
//       "QuotationLot": 50,
//       "TradedQty": 141550,
//       "OpenInterest": 11314800,
//       "Open": 18312.55,
//       "High": 18326.85,
//       "Low": 18305,
//       "Close": 18317
//     },
//     {
//       "LastTradeTime": 1683698400,
//       "QuotationLot": 50,
//       "TradedQty": 353400,
//       "OpenInterest": 11346150,
//       "Open": 18305.4,
//       "High": 18333.75,
//       "Low": 18303,
//       "Close": 18312.55
//     },
//     {
//       "LastTradeTime": 1683696600,
//       "QuotationLot": 50,
//       "TradedQty": 158250,
//       "OpenInterest": 11372650,
//       "Open": 18285.35,
//       "High": 18306.95,
//       "Low": 18279,
//       "Close": 18305.4
//     },
//     {
//       "LastTradeTime": 1683694800,
//       "QuotationLot": 50,
//       "TradedQty": 301050,
//       "OpenInterest": 11359300,
//       "Open": 18296.95,
//       "High": 18312.6,
//       "Low": 18277.35,
//       "Close": 18285.35
//     },
//     {
//       "LastTradeTime": 1683693000,
//       "QuotationLot": 50,
//       "TradedQty": 542350,
//       "OpenInterest": 11356800,
//       "Open": 18265,
//       "High": 18296.8,
//       "Low": 18255.55,
//       "Close": 18295
//     },
//     {
//       "LastTradeTime": 1683691200,
//       "QuotationLot": 50,
//       "TradedQty": 765400,
//       "OpenInterest": 11336750,
//       "Open": 18335.95,
//       "High": 18337.9,
//       "Low": 18261.7,
//       "Close": 18264.1
//     },
//     {
//       "LastTradeTime": 1683689400,
//       "QuotationLot": 50,
//       "TradedQty": 412450,
//       "OpenInterest": 11303350,
//       "Open": 18325,
//       "High": 18356.4,
//       "Low": 18323,
//       "Close": 18336.3
//     },
//     {
//       "LastTradeTime": 1683626400,
//       "QuotationLot": 50,
//       "TradedQty": 450,
//       "OpenInterest": 11362000,
//       "Open": 18305,
//       "High": 18305,
//       "Low": 18305,
//       "Close": 18305
//     },
//     {
//       "LastTradeTime": 1683624600,
//       "QuotationLot": 50,
//       "TradedQty": 603200,
//       "OpenInterest": 11362000,
//       "Open": 18309.2,
//       "High": 18320,
//       "Low": 18294.15,
//       "Close": 18304.55
//     },
//     {
//       "LastTradeTime": 1683622800,
//       "QuotationLot": 50,
//       "TradedQty": 257750,
//       "OpenInterest": 11424450,
//       "Open": 18312.5,
//       "High": 18324.9,
//       "Low": 18293,
//       "Close": 18309.2
//     },
//     {
//       "LastTradeTime": 1683621000,
//       "QuotationLot": 50,
//       "TradedQty": 707800,
//       "OpenInterest": 11402450,
//       "Open": 18293.6,
//       "High": 18315,
//       "Low": 18270.15,
//       "Close": 18312.5
//     },
//     {
//       "LastTradeTime": 1683619200,
//       "QuotationLot": 50,
//       "TradedQty": 376850,
//       "OpenInterest": 11465450,
//       "Open": 18320,
//       "High": 18332.9,
//       "Low": 18293,
//       "Close": 18293
//     },
//     {
//       "LastTradeTime": 1683617400,
//       "QuotationLot": 50,
//       "TradedQty": 471100,
//       "OpenInterest": 11405300,
//       "Open": 18345,
//       "High": 18349,
//       "Low": 18314.05,
//       "Close": 18319
//     },
//     {
//       "LastTradeTime": 1683615600,
//       "QuotationLot": 50,
//       "TradedQty": 298700,
//       "OpenInterest": 11317350,
//       "Open": 18366.15,
//       "High": 18373.9,
//       "Low": 18333.5,
//       "Close": 18344
//     },
//     {
//       "LastTradeTime": 1683613800,
//       "QuotationLot": 50,
//       "TradedQty": 102000,
//       "OpenInterest": 11252400,
//       "Open": 18375.9,
//       "High": 18379,
//       "Low": 18363,
//       "Close": 18366.15
//     },
//     {
//       "LastTradeTime": 1683612000,
//       "QuotationLot": 50,
//       "TradedQty": 163900,
//       "OpenInterest": 11236850,
//       "Open": 18372.95,
//       "High": 18378,
//       "Low": 18357.6,
//       "Close": 18374.75
//     },
//     {
//       "LastTradeTime": 1683610200,
//       "QuotationLot": 50,
//       "TradedQty": 212400,
//       "OpenInterest": 11202300,
//       "Open": 18384.7,
//       "High": 18387.35,
//       "Low": 18364,
//       "Close": 18372
//     },
//     {
//       "LastTradeTime": 1683608400,
//       "QuotationLot": 50,
//       "TradedQty": 291900,
//       "OpenInterest": 11154000,
//       "Open": 18376.9,
//       "High": 18388.85,
//       "Low": 18360.1,
//       "Close": 18384.65
//     },
//     {
//       "LastTradeTime": 1683606600,
//       "QuotationLot": 50,
//       "TradedQty": 383250,
//       "OpenInterest": 11125800,
//       "Open": 18371,
//       "High": 18383.6,
//       "Low": 18368.05,
//       "Close": 18376.9
//     },
//     {
//       "LastTradeTime": 1683604800,
//       "QuotationLot": 50,
//       "TradedQty": 597150,
//       "OpenInterest": 11020550,
//       "Open": 18334,
//       "High": 18375,
//       "Low": 18318.15,
//       "Close": 18370.4
//     },
//     {
//       "LastTradeTime": 1683603000,
//       "QuotationLot": 50,
//       "TradedQty": 371100,
//       "OpenInterest": 10876400,
//       "Open": 18335.6,
//       "High": 18353.5,
//       "Low": 18328.5,
//       "Close": 18335.05
//     },
//     {
//       "LastTradeTime": 1683540000,
//       "QuotationLot": 50,
//       "TradedQty": 0,
//       "OpenInterest": 11224050,
//       "Open": 18317.5,
//       "High": 18317.5,
//       "Low": 18317.5,
//       "Close": 18317.5
//     },
//     {
//       "LastTradeTime": 1683538200,
//       "QuotationLot": 50,
//       "TradedQty": 858650,
//       "OpenInterest": 11224050,
//       "Open": 18313.35,
//       "High": 18328.1,
//       "Low": 18291,
//       "Close": 18317.5
//     },
//     {
//       "LastTradeTime": 1683536400,
//       "QuotationLot": 50,
//       "TradedQty": 410650,
//       "OpenInterest": 11098750,
//       "Open": 18324.1,
//       "High": 18331.45,
//       "Low": 18310.1,
//       "Close": 18313.55
//     },
//     {
//       "LastTradeTime": 1683534600,
//       "QuotationLot": 50,
//       "TradedQty": 243200,
//       "OpenInterest": 10968300,
//       "Open": 18342.5,
//       "High": 18344,
//       "Low": 18312.25,
//       "Close": 18324.1
//     },
//     {
//       "LastTradeTime": 1683532800,
//       "QuotationLot": 50,
//       "TradedQty": 208050,
//       "OpenInterest": 10973500,
//       "Open": 18334.9,
//       "High": 18344.7,
//       "Low": 18314.5,
//       "Close": 18342.5
//     },
//     {
//       "LastTradeTime": 1683531000,
//       "QuotationLot": 50,
//       "TradedQty": 215150,
//       "OpenInterest": 10971600,
//       "Open": 18317.1,
//       "High": 18340,
//       "Low": 18312.25,
//       "Close": 18337.9
//     },
//     {
//       "LastTradeTime": 1683529200,
//       "QuotationLot": 50,
//       "TradedQty": 268900,
//       "OpenInterest": 10926000,
//       "Open": 18313.2,
//       "High": 18336,
//       "Low": 18312.1,
//       "Close": 18317.1
//     },
//     {
//       "LastTradeTime": 1683527400,
//       "QuotationLot": 50,
//       "TradedQty": 426650,
//       "OpenInterest": 10864200,
//       "Open": 18309,
//       "High": 18327.2,
//       "Low": 18296,
//       "Close": 18313.2
//     },
//     {
//       "LastTradeTime": 1683525600,
//       "QuotationLot": 50,
//       "TradedQty": 407800,
//       "OpenInterest": 10731000,
//       "Open": 18288.2,
//       "High": 18315.15,
//       "Low": 18287,
//       "Close": 18309
//     },
//     {
//       "LastTradeTime": 1683523800,
//       "QuotationLot": 50,
//       "TradedQty": 335450,
//       "OpenInterest": 10690200,
//       "Open": 18282.5,
//       "High": 18293.15,
//       "Low": 18266,
//       "Close": 18289.85
//     },
//     {
//       "LastTradeTime": 1683522000,
//       "QuotationLot": 50,
//       "TradedQty": 452950,
//       "OpenInterest": 10623300,
//       "Open": 18282.6,
//       "High": 18296,
//       "Low": 18271,
//       "Close": 18282.35
//     },
//     {
//       "LastTradeTime": 1683520200,
//       "QuotationLot": 50,
//       "TradedQty": 618700,
//       "OpenInterest": 10485000,
//       "Open": 18259,
//       "High": 18288.65,
//       "Low": 18240.2,
//       "Close": 18282.6
//     },
//     {
//       "LastTradeTime": 1683518400,
//       "QuotationLot": 50,
//       "TradedQty": 860450,
//       "OpenInterest": 10407950,
//       "Open": 18219.55,
//       "High": 18260,
//       "Low": 18217.2,
//       "Close": 18258.75
//     },
//     {
//       "LastTradeTime": 1683516600,
//       "QuotationLot": 50,
//       "TradedQty": 747600,
//       "OpenInterest": 10262750,
//       "Open": 18160,
//       "High": 18225,
//       "Low": 18147,
//       "Close": 18217.55
//     },
//     {
//       "LastTradeTime": 1683280800,
//       "QuotationLot": 50,
//       "TradedQty": 0,
//       "OpenInterest": 10365950,
//       "Open": 18130.1,
//       "High": 18130.1,
//       "Low": 18130.1,
//       "Close": 18130.1
//     },
//     {
//       "LastTradeTime": 1683279000,
//       "QuotationLot": 50,
//       "TradedQty": 1171250,
//       "OpenInterest": 10365950,
//       "Open": 18151.55,
//       "High": 18153.4,
//       "Low": 18115,
//       "Close": 18130.1
//     },
//     {
//       "LastTradeTime": 1683277200,
//       "QuotationLot": 50,
//       "TradedQty": 386950,
//       "OpenInterest": 10317200,
//       "Open": 18171,
//       "High": 18184,
//       "Low": 18144,
//       "Close": 18155.55
//     },
//     {
//       "LastTradeTime": 1683275400,
//       "QuotationLot": 50,
//       "TradedQty": 368100,
//       "OpenInterest": 10330600,
//       "Open": 18175.1,
//       "High": 18204.9,
//       "Low": 18168,
//       "Close": 18171
//     },
//     {
//       "LastTradeTime": 1683273600,
//       "QuotationLot": 50,
//       "TradedQty": 462650,
//       "OpenInterest": 10350300,
//       "Open": 18197.4,
//       "High": 18215.4,
//       "Low": 18153,
//       "Close": 18177.6
//     },
//     {
//       "LastTradeTime": 1683271800,
//       "QuotationLot": 50,
//       "TradedQty": 240300,
//       "OpenInterest": 10291400,
//       "Open": 18210.6,
//       "High": 18213.45,
//       "Low": 18172.3,
//       "Close": 18197.4
//     },
//     {
//       "LastTradeTime": 1683270000,
//       "QuotationLot": 50,
//       "TradedQty": 417250,
//       "OpenInterest": 10288350,
//       "Open": 18193,
//       "High": 18222.8,
//       "Low": 18176.55,
//       "Close": 18209.85
//     },
//     {
//       "LastTradeTime": 1683268200,
//       "QuotationLot": 50,
//       "TradedQty": 755600,
//       "OpenInterest": 10275450,
//       "Open": 18137.35,
//       "High": 18194.85,
//       "Low": 18125.3,
//       "Close": 18189.7
//     },
//     {
//       "LastTradeTime": 1683266400,
//       "QuotationLot": 50,
//       "TradedQty": 698850,
//       "OpenInterest": 10299450,
//       "Open": 18179.7,
//       "High": 18196.7,
//       "Low": 18136.5,
//       "Close": 18137.35
//     },
//     {
//       "LastTradeTime": 1683264600,
//       "QuotationLot": 50,
//       "TradedQty": 1379500,
//       "OpenInterest": 10270800,
//       "Open": 18262.45,
//       "High": 18263.8,
//       "Low": 18155.55,
//       "Close": 18179.2
//     },
//     {
//       "LastTradeTime": 1683262800,
//       "QuotationLot": 50,
//       "TradedQty": 301500,
//       "OpenInterest": 10243450,
//       "Open": 18254.05,
//       "High": 18267.75,
//       "Low": 18251,
//       "Close": 18262.45
//     },
//     {
//       "LastTradeTime": 1683261000,
//       "QuotationLot": 50,
//       "TradedQty": 395200,
//       "OpenInterest": 10173800,
//       "Open": 18237.2,
//       "High": 18260.75,
//       "Low": 18235.75,
//       "Close": 18254
//     },
//     {
//       "LastTradeTime": 1683259200,
//       "QuotationLot": 50,
//       "TradedQty": 665750,
//       "OpenInterest": 10106250,
//       "Open": 18224.1,
//       "High": 18240.2,
//       "Low": 18220.05,
//       "Close": 18237.1
//     },
//     {
//       "LastTradeTime": 1683257400,
//       "QuotationLot": 50,
//       "TradedQty": 1165700,
//       "OpenInterest": 9907800,
//       "Open": 18180,
//       "High": 18250,
//       "Low": 18180,
//       "Close": 18223.65
//     },
//     {
//       "LastTradeTime": 1683194400,
//       "QuotationLot": 50,
//       "TradedQty": 350,
//       "OpenInterest": 9843200,
//       "Open": 18287,
//       "High": 18287,
//       "Low": 18287,
//       "Close": 18287
//     },
//     {
//       "LastTradeTime": 1683192600,
//       "QuotationLot": 50,
//       "TradedQty": 1625700,
//       "OpenInterest": 9843200,
//       "Open": 18285.35,
//       "High": 18315.9,
//       "Low": 18277,
//       "Close": 18287
//     },
//     {
//       "LastTradeTime": 1683190800,
//       "QuotationLot": 50,
//       "TradedQty": 535450,
//       "OpenInterest": 9930550,
//       "Open": 18252.75,
//       "High": 18287,
//       "Low": 18251.3,
//       "Close": 18285.35
//     },
//     {
//       "LastTradeTime": 1683189000,
//       "QuotationLot": 50,
//       "TradedQty": 423650,
//       "OpenInterest": 9885000,
//       "Open": 18239.9,
//       "High": 18258,
//       "Low": 18230,
//       "Close": 18250.95
//     },
//     {
//       "LastTradeTime": 1683187200,
//       "QuotationLot": 50,
//       "TradedQty": 184650,
//       "OpenInterest": 9869100,
//       "Open": 18242.5,
//       "High": 18249.95,
//       "Low": 18236.6,
//       "Close": 18239.9
//     },
//     {
//       "LastTradeTime": 1683185400,
//       "QuotationLot": 50,
//       "TradedQty": 586100,
//       "OpenInterest": 9815600,
//       "Open": 18218.15,
//       "High": 18250,
//       "Low": 18214.3,
//       "Close": 18243.9
//     },
//     {
//       "LastTradeTime": 1683183600,
//       "QuotationLot": 50,
//       "TradedQty": 253150,
//       "OpenInterest": 9689500,
//       "Open": 18218,
//       "High": 18223.45,
//       "Low": 18210.1,
//       "Close": 18218.2
//     },
//     {
//       "LastTradeTime": 1683181800,
//       "QuotationLot": 50,
//       "TradedQty": 216200,
//       "OpenInterest": 9604500,
//       "Open": 18213.4,
//       "High": 18223.5,
//       "Low": 18201.2,
//       "Close": 18219.5
//     },
//     {
//       "LastTradeTime": 1683180000,
//       "QuotationLot": 50,
//       "TradedQty": 220650,
//       "OpenInterest": 9606550,
//       "Open": 18195.95,
//       "High": 18217.55,
//       "Low": 18195.5,
//       "Close": 18212.15
//     },
//     {
//       "LastTradeTime": 1683178200,
//       "QuotationLot": 50,
//       "TradedQty": 241650,
//       "OpenInterest": 9617950,
//       "Open": 18199,
//       "High": 18209.85,
//       "Low": 18192.15,
//       "Close": 18196.3
//     },
//     {
//       "LastTradeTime": 1683176400,
//       "QuotationLot": 50,
//       "TradedQty": 262800,
//       "OpenInterest": 9603000,
//       "Open": 18184.9,
//       "High": 18204.7,
//       "Low": 18181.55,
//       "Close": 18199
//     },
//     {
//       "LastTradeTime": 1683174600,
//       "QuotationLot": 50,
//       "TradedQty": 393250,
//       "OpenInterest": 9594300,
//       "Open": 18162.9,
//       "High": 18187.75,
//       "Low": 18160.9,
//       "Close": 18184.9
//     },
//     {
//       "LastTradeTime": 1683172800,
//       "QuotationLot": 50,
//       "TradedQty": 419650,
//       "OpenInterest": 9591750,
//       "Open": 18165.15,
//       "High": 18167.75,
//       "Low": 18147.25,
//       "Close": 18162.95
//     },
//     {
//       "LastTradeTime": 1683171000,
//       "QuotationLot": 50,
//       "TradedQty": 559050,
//       "OpenInterest": 9502000,
//       "Open": 18119.85,
//       "High": 18167.9,
//       "Low": 18113.1,
//       "Close": 18166.75
//     },
//     {
//       "LastTradeTime": 1683108000,
//       "QuotationLot": 50,
//       "TradedQty": 0,
//       "OpenInterest": 9843500,
//       "Open": 18147.3,
//       "High": 18147.3,
//       "Low": 18147.3,
//       "Close": 18147.3
//     },
//     {
//       "LastTradeTime": 1683106200,
//       "QuotationLot": 50,
//       "TradedQty": 675900,
//       "OpenInterest": 9843500,
//       "Open": 18141.2,
//       "High": 18163.6,
//       "Low": 18129.15,
//       "Close": 18147.3
//     },
//     {
//       "LastTradeTime": 1683104400,
//       "QuotationLot": 50,
//       "TradedQty": 417950,
//       "OpenInterest": 9792450,
//       "Open": 18142.6,
//       "High": 18160.3,
//       "Low": 18136.05,
//       "Close": 18139.05
//     },
//     {
//       "LastTradeTime": 1683102600,
//       "QuotationLot": 50,
//       "TradedQty": 1791750,
//       "OpenInterest": 9852800,
//       "Open": 18112.5,
//       "High": 18150,
//       "Low": 18111.25,
//       "Close": 18142
//     },
//     {
//       "LastTradeTime": 1683100800,
//       "QuotationLot": 50,
//       "TradedQty": 599500,
//       "OpenInterest": 9790350,
//       "Open": 18157.65,
//       "High": 18162.5,
//       "Low": 18100.3,
//       "Close": 18113.9
//     },
//     {
//       "LastTradeTime": 1683099000,
//       "QuotationLot": 50,
//       "TradedQty": 219600,
//       "OpenInterest": 9776150,
//       "Open": 18151.1,
//       "High": 18165,
//       "Low": 18144,
//       "Close": 18157.65
//     },
//     {
//       "LastTradeTime": 1683097200,
//       "QuotationLot": 50,
//       "TradedQty": 256400,
//       "OpenInterest": 9729500,
//       "Open": 18138.35,
//       "High": 18160.15,
//       "Low": 18132.15,
//       "Close": 18151.15
//     },
//     {
//       "LastTradeTime": 1683095400,
//       "QuotationLot": 50,
//       "TradedQty": 189950,
//       "OpenInterest": 9673150,
//       "Open": 18147,
//       "High": 18150,
//       "Low": 18130.05,
//       "Close": 18139.5
//     },
//     {
//       "LastTradeTime": 1683093600,
//       "QuotationLot": 50,
//       "TradedQty": 219150,
//       "OpenInterest": 9599600,
//       "Open": 18152.8,
//       "High": 18154.05,
//       "Low": 18131,
//       "Close": 18147.1
//     },
//     {
//       "LastTradeTime": 1683091800,
//       "QuotationLot": 50,
//       "TradedQty": 349250,
//       "OpenInterest": 9530600,
//       "Open": 18172.15,
//       "High": 18174,
//       "Low": 18141.1,
//       "Close": 18151
//     },
//     {
//       "LastTradeTime": 1683090000,
//       "QuotationLot": 50,
//       "TradedQty": 286800,
//       "OpenInterest": 9520500,
//       "Open": 18156.1,
//       "High": 18180,
//       "Low": 18155.9,
//       "Close": 18172.15
//     },
//     {
//       "LastTradeTime": 1683088200,
//       "QuotationLot": 50,
//       "TradedQty": 310450,
//       "OpenInterest": 9481000,
//       "Open": 18158,
//       "High": 18164.8,
//       "Low": 18148.3,
//       "Close": 18156.1
//     },
//     {
//       "LastTradeTime": 1683086400,
//       "QuotationLot": 50,
//       "TradedQty": 600700,
//       "OpenInterest": 9461950,
//       "Open": 18134.9,
//       "High": 18158,
//       "Low": 18122.55,
//       "Close": 18157.8
//     },
//     {
//       "LastTradeTime": 1683084600,
//       "QuotationLot": 50,
//       "TradedQty": 872500,
//       "OpenInterest": 9450350,
//       "Open": 18154.9,
//       "High": 18159.75,
//       "Low": 18114.5,
//       "Close": 18134.85
//     },
//     {
//       "LastTradeTime": 1683021600,
//       "QuotationLot": 50,
//       "TradedQty": 100,
//       "OpenInterest": 9754750,
//       "Open": 18204.75,
//       "High": 18204.75,
//       "Low": 18204.75,
//       "Close": 18204.75
//     },
//     {
//       "LastTradeTime": 1683019800,
//       "QuotationLot": 50,
//       "TradedQty": 789400,
//       "OpenInterest": 9754750,
//       "Open": 18220.7,
//       "High": 18233.65,
//       "Low": 18201,
//       "Close": 18202
//     },
//     {
//       "LastTradeTime": 1683018000,
//       "QuotationLot": 50,
//       "TradedQty": 309700,
//       "OpenInterest": 9822250,
//       "Open": 18231.85,
//       "High": 18242,
//       "Low": 18203.05,
//       "Close": 18220.95
//     },
//     {
//       "LastTradeTime": 1683016200,
//       "QuotationLot": 50,
//       "TradedQty": 160300,
//       "OpenInterest": 10054050,
//       "Open": 18232.4,
//       "High": 18238,
//       "Low": 18221.85,
//       "Close": 18232.7
//     },
//     {
//       "LastTradeTime": 1683014400,
//       "QuotationLot": 50,
//       "TradedQty": 218950,
//       "OpenInterest": 10016250,
//       "Open": 18229.1,
//       "High": 18237.55,
//       "Low": 18217.95,
//       "Close": 18232.4
//     },
//     {
//       "LastTradeTime": 1683012600,
//       "QuotationLot": 50,
//       "TradedQty": 159050,
//       "OpenInterest": 10027800,
//       "Open": 18235.8,
//       "High": 18244.5,
//       "Low": 18226.4,
//       "Close": 18229.1
//     },
//     {
//       "LastTradeTime": 1683010800,
//       "QuotationLot": 50,
//       "TradedQty": 154350,
//       "OpenInterest": 10029500,
//       "Open": 18215.15,
//       "High": 18238.3,
//       "Low": 18208.55,
//       "Close": 18236.85
//     },
//     {
//       "LastTradeTime": 1683009000,
//       "QuotationLot": 50,
//       "TradedQty": 358200,
//       "OpenInterest": 10032000,
//       "Open": 18223.05,
//       "High": 18235,
//       "Low": 18214.05,
//       "Close": 18215.2
//     },
//     {
//       "LastTradeTime": 1683007200,
//       "QuotationLot": 50,
//       "TradedQty": 158000,
//       "OpenInterest": 9847150,
//       "Open": 18221.45,
//       "High": 18229.95,
//       "Low": 18211.55,
//       "Close": 18223.05
//     },
//     {
//       "LastTradeTime": 1683005400,
//       "QuotationLot": 50,
//       "TradedQty": 405550,
//       "OpenInterest": 9809850,
//       "Open": 18229,
//       "High": 18242,
//       "Low": 18196.5,
//       "Close": 18221.45
//     },
//     {
//       "LastTradeTime": 1683003600,
//       "QuotationLot": 50,
//       "TradedQty": 247350,
//       "OpenInterest": 9746000,
//       "Open": 18217.05,
//       "High": 18236,
//       "Low": 18210,
//       "Close": 18229
//     },
//     {
//       "LastTradeTime": 1683001800,
//       "QuotationLot": 50,
//       "TradedQty": 483900,
//       "OpenInterest": 9693300,
//       "Open": 18228.75,
//       "High": 18247.25,
//       "Low": 18213.75,
//       "Close": 18217.05
//     },
//     {
//       "LastTradeTime": 1683000000,
//       "QuotationLot": 50,
//       "TradedQty": 803250,
//       "OpenInterest": 9571150,
//       "Open": 18228.6,
//       "High": 18243,
//       "Low": 18214,
//       "Close": 18230.3
//     },
//     {
//       "LastTradeTime": 1682998200,
//       "QuotationLot": 50,
//       "TradedQty": 1477450,
//       "OpenInterest": 9377350,
//       "Open": 18180.45,
//       "High": 18230,
//       "Low": 18180.45,
//       "Close": 18228.4
//     },
//     {
//       "LastTradeTime": 1682676000,
//       "QuotationLot": 50,
//       "TradedQty": 300,
//       "OpenInterest": 8931700,
//       "Open": 18112.15,
//       "High": 18112.15,
//       "Low": 18112.15,
//       "Close": 18112.15
//     },
//     {
//       "LastTradeTime": 1682674200,
//       "QuotationLot": 50,
//       "TradedQty": 1498350,
//       "OpenInterest": 8931700,
//       "Open": 18060.45,
//       "High": 18128.5,
//       "Low": 18059.3,
//       "Close": 18113.2
//     },
//     {
//       "LastTradeTime": 1682672400,
//       "QuotationLot": 50,
//       "TradedQty": 515900,
//       "OpenInterest": 8592200,
//       "Open": 18040,
//       "High": 18073,
//       "Low": 18040,
//       "Close": 18060.8
//     },
//     {
//       "LastTradeTime": 1682670600,
//       "QuotationLot": 50,
//       "TradedQty": 395800,
//       "OpenInterest": 8530350,
//       "Open": 18047.1,
//       "High": 18064.9,
//       "Low": 18028.85,
//       "Close": 18040.05
//     },
//     {
//       "LastTradeTime": 1682668800,
//       "QuotationLot": 50,
//       "TradedQty": 197050,
//       "OpenInterest": 8460500,
//       "Open": 18050.6,
//       "High": 18056.35,
//       "Low": 18040.15,
//       "Close": 18047.05
//     },
//     {
//       "LastTradeTime": 1682667000,
//       "QuotationLot": 50,
//       "TradedQty": 235050,
//       "OpenInterest": 8422850,
//       "Open": 18038.6,
//       "High": 18063,
//       "Low": 18038.6,
//       "Close": 18050.8
//     },
//     {
//       "LastTradeTime": 1682665200,
//       "QuotationLot": 50,
//       "TradedQty": 251850,
//       "OpenInterest": 8362400,
//       "Open": 18050.1,
//       "High": 18060,
//       "Low": 18036,
//       "Close": 18039.55
//     },
//     {
//       "LastTradeTime": 1682663400,
//       "QuotationLot": 50,
//       "TradedQty": 372850,
//       "OpenInterest": 8458350,
//       "Open": 18040.05,
//       "High": 18057.5,
//       "Low": 18040.05,
//       "Close": 18051.35
//     },
//     {
//       "LastTradeTime": 1682661600,
//       "QuotationLot": 50,
//       "TradedQty": 210900,
//       "OpenInterest": 8511250,
//       "Open": 18036,
//       "High": 18048.85,
//       "Low": 18026.15,
//       "Close": 18040.05
//     },
//     {
//       "LastTradeTime": 1682659800,
//       "QuotationLot": 50,
//       "TradedQty": 367700,
//       "OpenInterest": 8481300,
//       "Open": 18025.5,
//       "High": 18044.7,
//       "Low": 18025.2,
//       "Close": 18036
//     },
//     {
//       "LastTradeTime": 1682658000,
//       "QuotationLot": 50,
//       "TradedQty": 358350,
//       "OpenInterest": 8441350,
//       "Open": 17988,
//       "High": 18029.4,
//       "Low": 17987.15,
//       "Close": 18025
//     },
//     {
//       "LastTradeTime": 1682656200,
//       "QuotationLot": 50,
//       "TradedQty": 525600,
//       "OpenInterest": 8471150,
//       "Open": 18003,
//       "High": 18007.85,
//       "Low": 17965,
//       "Close": 17988
//     },
//     {
//       "LastTradeTime": 1682654400,
//       "QuotationLot": 50,
//       "TradedQty": 488850,
//       "OpenInterest": 8504650,
//       "Open": 17986.9,
//       "High": 18013,
//       "Low": 17986.9,
//       "Close": 18003.65
//     },
//     {
//       "LastTradeTime": 1682652600,
//       "QuotationLot": 50,
//       "TradedQty": 901300,
//       "OpenInterest": 8449250,
//       "Open": 18030.25,
//       "High": 18054.85,
//       "Low": 17985.6,
//       "Close": 17988.65
//     },
//     {
//       "LastTradeTime": 1682589600,
//       "QuotationLot": 50,
//       "TradedQty": 0,
//       "OpenInterest": 6242100,
//       "Open": 17919.4,
//       "High": 17919.4,
//       "Low": 17919.4,
//       "Close": 17919.4
//     },
//     {
//       "LastTradeTime": 1682587800,
//       "QuotationLot": 50,
//       "TradedQty": 970650,
//       "OpenInterest": 6242100,
//       "Open": 17889.45,
//       "High": 17920.05,
//       "Low": 17888,
//       "Close": 17919.4
//     },
//     {
//       "LastTradeTime": 1682586000,
//       "QuotationLot": 50,
//       "TradedQty": 648050,
//       "OpenInterest": 6726050,
//       "Open": 17877.1,
//       "High": 17903,
//       "Low": 17876,
//       "Close": 17890
//     },
//     {
//       "LastTradeTime": 1682584200,
//       "QuotationLot": 50,
//       "TradedQty": 574650,
//       "OpenInterest": 6753400,
//       "Open": 17890,
//       "High": 17895.05,
//       "Low": 17860,
//       "Close": 17877.25
//     },
//     {
//       "LastTradeTime": 1682582400,
//       "QuotationLot": 50,
//       "TradedQty": 489850,
//       "OpenInterest": 6846100,
//       "Open": 17876.45,
//       "High": 17894,
//       "Low": 17873.8,
//       "Close": 17891.35
//     },
//     {
//       "LastTradeTime": 1682580600,
//       "QuotationLot": 50,
//       "TradedQty": 673900,
//       "OpenInterest": 6782700,
//       "Open": 17850.45,
//       "High": 17881.65,
//       "Low": 17841.05,
//       "Close": 17875.95
//     },
//     {
//       "LastTradeTime": 1682578800,
//       "QuotationLot": 50,
//       "TradedQty": 484700,
//       "OpenInterest": 6599250,
//       "Open": 17848.25,
//       "High": 17857.8,
//       "Low": 17842.95,
//       "Close": 17850.3
//     },
//     {
//       "LastTradeTime": 1682577000,
//       "QuotationLot": 50,
//       "TradedQty": 708250,
//       "OpenInterest": 6357950,
//       "Open": 17853.25,
//       "High": 17856.25,
//       "Low": 17838.55,
//       "Close": 17848
//     },
//     {
//       "LastTradeTime": 1682575200,
//       "QuotationLot": 50,
//       "TradedQty": 692500,
//       "OpenInterest": 6173350,
//       "Open": 17847.2,
//       "High": 17859.5,
//       "Low": 17840,
//       "Close": 17853.25
//     },
//     {
//       "LastTradeTime": 1682573400,
//       "QuotationLot": 50,
//       "TradedQty": 323500,
//       "OpenInterest": 6359850,
//       "Open": 17832,
//       "High": 17849,
//       "Low": 17827.6,
//       "Close": 17847.2
//     },
//     {
//       "LastTradeTime": 1682571600,
//       "QuotationLot": 50,
//       "TradedQty": 321300,
//       "OpenInterest": 6397600,
//       "Open": 17840.75,
//       "High": 17850,
//       "Low": 17826.1,
//       "Close": 17832
//     },
//     {
//       "LastTradeTime": 1682569800,
//       "QuotationLot": 50,
//       "TradedQty": 484250,
//       "OpenInterest": 6492050,
//       "Open": 17838.4,
//       "High": 17842,
//       "Low": 17823.8,
//       "Close": 17840.75
//     },
//     {
//       "LastTradeTime": 1682568000,
//       "QuotationLot": 50,
//       "TradedQty": 376250,
//       "OpenInterest": 6586500,
//       "Open": 17828.05,
//       "High": 17845,
//       "Low": 17806.7,
//       "Close": 17838
//     },
//     {
//       "LastTradeTime": 1682566200,
//       "QuotationLot": 50,
//       "TradedQty": 314350,
//       "OpenInterest": 6665450,
//       "Open": 17791,
//       "High": 17831,
//       "Low": 17791,
//       "Close": 17828
//     },
//     {
//       "LastTradeTime": 1682503200,
//       "QuotationLot": 50,
//       "TradedQty": 0,
//       "OpenInterest": 8326950,
//       "Open": 17823.5,
//       "High": 17823.5,
//       "Low": 17823.5,
//       "Close": 17823.5
//     },
//     {
//       "LastTradeTime": 1682501400,
//       "QuotationLot": 50,
//       "TradedQty": 1252850,
//       "OpenInterest": 8326950,
//       "Open": 17785.95,
//       "High": 17830,
//       "Low": 17782.65,
//       "Close": 17823.5
//     },
//     {
//       "LastTradeTime": 1682499600,
//       "QuotationLot": 50,
//       "TradedQty": 429350,
//       "OpenInterest": 8052500,
//       "Open": 17785.8,
//       "High": 17795,
//       "Low": 17777.65,
//       "Close": 17786.5
//     },
//     {
//       "LastTradeTime": 1682497800,
//       "QuotationLot": 50,
//       "TradedQty": 291150,
//       "OpenInterest": 7936200,
//       "Open": 17790.3,
//       "High": 17808.5,
//       "Low": 17782.75,
//       "Close": 17786.2
//     },
//     {
//       "LastTradeTime": 1682496000,
//       "QuotationLot": 50,
//       "TradedQty": 419850,
//       "OpenInterest": 7918700,
//       "Open": 17786.45,
//       "High": 17799.45,
//       "Low": 17778.2,
//       "Close": 17792.25
//     },
//     {
//       "LastTradeTime": 1682494200,
//       "QuotationLot": 50,
//       "TradedQty": 593850,
//       "OpenInterest": 7696500,
//       "Open": 17792.65,
//       "High": 17794.8,
//       "Low": 17766.5,
//       "Close": 17786.1
//     },
//     {
//       "LastTradeTime": 1682492400,
//       "QuotationLot": 50,
//       "TradedQty": 528450,
//       "OpenInterest": 7496600,
//       "Open": 17797.35,
//       "High": 17819,
//       "Low": 17788.2,
//       "Close": 17794.95
//     },
//     {
//       "LastTradeTime": 1682490600,
//       "QuotationLot": 50,
//       "TradedQty": 708300,
//       "OpenInterest": 7378200,
//       "Open": 17791,
//       "High": 17806.55,
//       "Low": 17775.55,
//       "Close": 17797.85
//     },
//     {
//       "LastTradeTime": 1682488800,
//       "QuotationLot": 50,
//       "TradedQty": 265850,
//       "OpenInterest": 7189850,
//       "Open": 17780.75,
//       "High": 17795,
//       "Low": 17774.55,
//       "Close": 17790.75
//     },
//     {
//       "LastTradeTime": 1682487000,
//       "QuotationLot": 50,
//       "TradedQty": 248300,
//       "OpenInterest": 7183300,
//       "Open": 17769.45,
//       "High": 17789.3,
//       "Low": 17765.05,
//       "Close": 17782.85
//     },
//     {
//       "LastTradeTime": 1682485200,
//       "QuotationLot": 50,
//       "TradedQty": 291550,
//       "OpenInterest": 7230500,
//       "Open": 17769.8,
//       "High": 17775.95,
//       "Low": 17756.25,
//       "Close": 17769.4
//     },
//     {
//       "LastTradeTime": 1682483400,
//       "QuotationLot": 50,
//       "TradedQty": 384000,
//       "OpenInterest": 7231800,
//       "Open": 17744.4,
//       "High": 17774.85,
//       "Low": 17737.9,
//       "Close": 17769.9
//     },
//     {
//       "LastTradeTime": 1682481600,
//       "QuotationLot": 50,
//       "TradedQty": 690500,
//       "OpenInterest": 7278400,
//       "Open": 17738.15,
//       "High": 17748.55,
//       "Low": 17722,
//       "Close": 17744.4
//     },
//     {
//       "LastTradeTime": 1682479800,
//       "QuotationLot": 50,
//       "TradedQty": 419500,
//       "OpenInterest": 7227400,
//       "Open": 17754.9,
//       "High": 17769.9,
//       "Low": 17737.15,
//       "Close": 17738.25
//     },
//     {
//       "LastTradeTime": 1682416800,
//       "QuotationLot": 50,
//       "TradedQty": 2450,
//       "OpenInterest": 8685700,
//       "Open": 17776,
//       "High": 17776,
//       "Low": 17776,
//       "Close": 17776
//     },
//     {
//       "LastTradeTime": 1682415000,
//       "QuotationLot": 50,
//       "TradedQty": 703100,
//       "OpenInterest": 8685700,
//       "Open": 17797.95,
//       "High": 17799.05,
//       "Low": 17772,
//       "Close": 17776
//     },
//     {
//       "LastTradeTime": 1682413200,
//       "QuotationLot": 50,
//       "TradedQty": 516300,
//       "OpenInterest": 8712250,
//       "Open": 17813.55,
//       "High": 17816.85,
//       "Low": 17788.65,
//       "Close": 17794.85
//     },
//     {
//       "LastTradeTime": 1682411400,
//       "QuotationLot": 50,
//       "TradedQty": 597000,
//       "OpenInterest": 8657750,
//       "Open": 17768.25,
//       "High": 17822.7,
//       "Low": 17766,
//       "Close": 17813.55
//     },
//     {
//       "LastTradeTime": 1682409600,
//       "QuotationLot": 50,
//       "TradedQty": 446300,
//       "OpenInterest": 8612050,
//       "Open": 17785.9,
//       "High": 17798.9,
//       "Low": 17754.1,
//       "Close": 17769.1
//     },
//     {
//       "LastTradeTime": 1682407800,
//       "QuotationLot": 50,
//       "TradedQty": 259250,
//       "OpenInterest": 8694850,
//       "Open": 17780.75,
//       "High": 17792.15,
//       "Low": 17770.05,
//       "Close": 17785.5
//     },
//     {
//       "LastTradeTime": 1682406000,
//       "QuotationLot": 50,
//       "TradedQty": 482250,
//       "OpenInterest": 8667850,
//       "Open": 17782.75,
//       "High": 17785,
//       "Low": 17758.9,
//       "Close": 17780.85
//     },
//     {
//       "LastTradeTime": 1682404200,
//       "QuotationLot": 50,
//       "TradedQty": 459400,
//       "OpenInterest": 8706900,
//       "Open": 17793.2,
//       "High": 17798.85,
//       "Low": 17779,
//       "Close": 17781.75
//     },
//     {
//       "LastTradeTime": 1682402400,
//       "QuotationLot": 50,
//       "TradedQty": 348300,
//       "OpenInterest": 8767050,
//       "Open": 17798,
//       "High": 17806.95,
//       "Low": 17789,
//       "Close": 17793.2
//     },
//     {
//       "LastTradeTime": 1682400600,
//       "QuotationLot": 50,
//       "TradedQty": 339450,
//       "OpenInterest": 8783900,
//       "Open": 17776.75,
//       "High": 17804.7,
//       "Low": 17770.8,
//       "Close": 17798
//     },
//     {
//       "LastTradeTime": 1682398800,
//       "QuotationLot": 50,
//       "TradedQty": 413900,
//       "OpenInterest": 8824550,
//       "Open": 17773.55,
//       "High": 17790,
//       "Low": 17771.05,
//       "Close": 17776.75
//     },
//     {
//       "LastTradeTime": 1682397000,
//       "QuotationLot": 50,
//       "TradedQty": 466250,
//       "OpenInterest": 8883900,
//       "Open": 17750.6,
//       "High": 17780,
//       "Low": 17745,
//       "Close": 17774
//     },
//     {
//       "LastTradeTime": 1682395200,
//       "QuotationLot": 50,
//       "TradedQty": 477450,
//       "OpenInterest": 8871650,
//       "Open": 17747.8,
//       "High": 17764.6,
//       "Low": 17739.05,
//       "Close": 17750.05
//     },
//     {
//       "LastTradeTime": 1682393400,
//       "QuotationLot": 50,
//       "TradedQty": 527850,
//       "OpenInterest": 8938400,
//       "Open": 17776.1,
//       "High": 17778,
//       "Low": 17732.3,
//       "Close": 17745.05
//     },
//     {
//       "LastTradeTime": 1682330400,
//       "QuotationLot": 50,
//       "TradedQty": 4400,
//       "OpenInterest": 9869650,
//       "Open": 17768.95,
//       "High": 17772,
//       "Low": 17768.95,
//       "Close": 17768.95
//     },
//     {
//       "LastTradeTime": 1682328600,
//       "QuotationLot": 50,
//       "TradedQty": 911950,
//       "OpenInterest": 9869650,
//       "Open": 17761.6,
//       "High": 17771,
//       "Low": 17752.45,
//       "Close": 17767.3
//     },
//     {
//       "LastTradeTime": 1682326800,
//       "QuotationLot": 50,
//       "TradedQty": 718850,
//       "OpenInterest": 9839750,
//       "Open": 17737.2,
//       "High": 17765.6,
//       "Low": 17721.1,
//       "Close": 17760
//     },
//     {
//       "LastTradeTime": 1682325000,
//       "QuotationLot": 50,
//       "TradedQty": 384600,
//       "OpenInterest": 9736050,
//       "Open": 17720.05,
//       "High": 17743,
//       "Low": 17716,
//       "Close": 17738.8
//     },
//     {
//       "LastTradeTime": 1682323200,
//       "QuotationLot": 50,
//       "TradedQty": 614650,
//       "OpenInterest": 9669500,
//       "Open": 17718.15,
//       "High": 17743.9,
//       "Low": 17718.15,
//       "Close": 17720.05
//     },
//     {
//       "LastTradeTime": 1682321400,
//       "QuotationLot": 50,
//       "TradedQty": 732800,
//       "OpenInterest": 9533150,
//       "Open": 17691.95,
//       "High": 17725,
//       "Low": 17685.25,
//       "Close": 17718.15
//     },
//     {
//       "LastTradeTime": 1682319600,
//       "QuotationLot": 50,
//       "TradedQty": 597350,
//       "OpenInterest": 9429100,
//       "Open": 17667.25,
//       "High": 17704.3,
//       "Low": 17667.2,
//       "Close": 17691.5
//     },
//     {
//       "LastTradeTime": 1682317800,
//       "QuotationLot": 50,
//       "TradedQty": 221050,
//       "OpenInterest": 9394450,
//       "Open": 17650,
//       "High": 17667.7,
//       "Low": 17648,
//       "Close": 17667.25
//     },
//     {
//       "LastTradeTime": 1682316000,
//       "QuotationLot": 50,
//       "TradedQty": 325550,
//       "OpenInterest": 9415350,
//       "Open": 17653.8,
//       "High": 17657.95,
//       "Low": 17633.2,
//       "Close": 17648.95
//     },
//     {
//       "LastTradeTime": 1682314200,
//       "QuotationLot": 50,
//       "TradedQty": 293000,
//       "OpenInterest": 9418900,
//       "Open": 17663.1,
//       "High": 17673.95,
//       "Low": 17650.8,
//       "Close": 17652.9
//     },
//     {
//       "LastTradeTime": 1682312400,
//       "QuotationLot": 50,
//       "TradedQty": 354200,
//       "OpenInterest": 9403850,
//       "Open": 17647.5,
//       "High": 17669.5,
//       "Low": 17643.1,
//       "Close": 17662.65
//     },
//     {
//       "LastTradeTime": 1682310600,
//       "QuotationLot": 50,
//       "TradedQty": 301250,
//       "OpenInterest": 9357550,
//       "Open": 17650,
//       "High": 17657.35,
//       "Low": 17635.1,
//       "Close": 17647.5
//     },
//     {
//       "LastTradeTime": 1682308800,
//       "QuotationLot": 50,
//       "TradedQty": 3341800,
//       "OpenInterest": 9316050,
//       "Open": 17672,
//       "High": 17683.1,
//       "Low": 17641.55,
//       "Close": 17648.35
//     },
//     {
//       "LastTradeTime": 1682307000,
//       "QuotationLot": 50,
//       "TradedQty": 735650,
//       "OpenInterest": 9237900,
//       "Open": 17715,
//       "High": 17716,
//       "Low": 17671.5,
//       "Close": 17674.25
//     },
//     {
//       "LastTradeTime": 1682071200,
//       "QuotationLot": 50,
//       "TradedQty": 400,
//       "OpenInterest": 9387350,
//       "Open": 17650.75,
//       "High": 17650.75,
//       "Low": 17650.75,
//       "Close": 17650.75
//     },
//     {
//       "LastTradeTime": 1682069400,
//       "QuotationLot": 50,
//       "TradedQty": 643500,
//       "OpenInterest": 9387350,
//       "Open": 17662,
//       "High": 17670,
//       "Low": 17645,
//       "Close": 17651
//     },
//     {
//       "LastTradeTime": 1682067600,
//       "QuotationLot": 50,
//       "TradedQty": 352800,
//       "OpenInterest": 9421950,
//       "Open": 17663.55,
//       "High": 17671.15,
//       "Low": 17640.4,
//       "Close": 17659.25
//     },
//     {
//       "LastTradeTime": 1682065800,
//       "QuotationLot": 50,
//       "TradedQty": 372750,
//       "OpenInterest": 9459950,
//       "Open": 17632.85,
//       "High": 17665,
//       "Low": 17623,
//       "Close": 17663.95
//     },
//     {
//       "LastTradeTime": 1682064000,
//       "QuotationLot": 50,
//       "TradedQty": 371750,
//       "OpenInterest": 9485750,
//       "Open": 17618,
//       "High": 17640,
//       "Low": 17615.05,
//       "Close": 17632.85
//     },
//     {
//       "LastTradeTime": 1682062200,
//       "QuotationLot": 50,
//       "TradedQty": 667000,
//       "OpenInterest": 9455800,
//       "Open": 17605,
//       "High": 17620,
//       "Low": 17583,
//       "Close": 17618
//     },
//     {
//       "LastTradeTime": 1682060400,
//       "QuotationLot": 50,
//       "TradedQty": 230100,
//       "OpenInterest": 9409400,
//       "Open": 17605.3,
//       "High": 17626.15,
//       "Low": 17602.55,
//       "Close": 17605
//     },
//     {
//       "LastTradeTime": 1682058600,
//       "QuotationLot": 50,
//       "TradedQty": 329150,
//       "OpenInterest": 9399400,
//       "Open": 17635.85,
//       "High": 17637.15,
//       "Low": 17604,
//       "Close": 17604
//     },
//     {
//       "LastTradeTime": 1682056800,
//       "QuotationLot": 50,
//       "TradedQty": 149900,
//       "OpenInterest": 9402100,
//       "Open": 17632.85,
//       "High": 17644.5,
//       "Low": 17623,
//       "Close": 17637.55
//     },
//     {
//       "LastTradeTime": 1682055000,
//       "QuotationLot": 50,
//       "TradedQty": 152300,
//       "OpenInterest": 9394650,
//       "Open": 17628,
//       "High": 17640.65,
//       "Low": 17620,
//       "Close": 17632.85
//     },
//     {
//       "LastTradeTime": 1682053200,
//       "QuotationLot": 50,
//       "TradedQty": 420950,
//       "OpenInterest": 9380950,
//       "Open": 17625,
//       "High": 17638.95,
//       "Low": 17611.5,
//       "Close": 17628
//     },
//     {
//       "LastTradeTime": 1682051400,
//       "QuotationLot": 50,
//       "TradedQty": 342100,
//       "OpenInterest": 9350900,
//       "Open": 17634.2,
//       "High": 17645.65,
//       "Low": 17617,
//       "Close": 17625.9
//     },
//     {
//       "LastTradeTime": 1682049600,
//       "QuotationLot": 50,
//       "TradedQty": 1597400,
//       "OpenInterest": 9365550,
//       "Open": 17687.15,
//       "High": 17690,
//       "Low": 17632.5,
//       "Close": 17636.95
//     },
//     {
//       "LastTradeTime": 1682047800,
//       "QuotationLot": 50,
//       "TradedQty": 476850,
//       "OpenInterest": 9295000,
//       "Open": 17650,
//       "High": 17689.85,
//       "Low": 17647.05,
//       "Close": 17688.15
//     },
//     {
//       "LastTradeTime": 1681984800,
//       "QuotationLot": 50,
//       "TradedQty": 0,
//       "OpenInterest": 9681550,
//       "Open": 17655,
//       "High": 17655,
//       "Low": 17655,
//       "Close": 17655
//     },
//     {
//       "LastTradeTime": 1681983000,
//       "QuotationLot": 50,
//       "TradedQty": 692750,
//       "OpenInterest": 9681550,
//       "Open": 17643.4,
//       "High": 17663.75,
//       "Low": 17638.15,
//       "Close": 17655
//     },
//     {
//       "LastTradeTime": 1681981200,
//       "QuotationLot": 50,
//       "TradedQty": 208250,
//       "OpenInterest": 9668750,
//       "Open": 17636.65,
//       "High": 17644,
//       "Low": 17630.6,
//       "Close": 17642.25
//     },
//     {
//       "LastTradeTime": 1681979400,
//       "QuotationLot": 50,
//       "TradedQty": 324300,
//       "OpenInterest": 9779650,
//       "Open": 17620.55,
//       "High": 17644,
//       "Low": 17610.95,
//       "Close": 17637.1
//     },
//     {
//       "LastTradeTime": 1681977600,
//       "QuotationLot": 50,
//       "TradedQty": 241650,
//       "OpenInterest": 9773900,
//       "Open": 17630,
//       "High": 17642,
//       "Low": 17617.6,
//       "Close": 17622
//     },
//     {
//       "LastTradeTime": 1681975800,
//       "QuotationLot": 50,
//       "TradedQty": 383200,
//       "OpenInterest": 9726100,
//       "Open": 17641,
//       "High": 17642.95,
//       "Low": 17611.3,
//       "Close": 17628.2
//     },
//     {
//       "LastTradeTime": 1681974000,
//       "QuotationLot": 50,
//       "TradedQty": 189100,
//       "OpenInterest": 9667850,
//       "Open": 17655.2,
//       "High": 17659.65,
//       "Low": 17632.1,
//       "Close": 17641
//     },
//     {
//       "LastTradeTime": 1681972200,
//       "QuotationLot": 50,
//       "TradedQty": 103800,
//       "OpenInterest": 9630450,
//       "Open": 17658.8,
//       "High": 17662.5,
//       "Low": 17645,
//       "Close": 17659.9
//     },
//     {
//       "LastTradeTime": 1681970400,
//       "QuotationLot": 50,
//       "TradedQty": 210250,
//       "OpenInterest": 9618950,
//       "Open": 17653,
//       "High": 17665,
//       "Low": 17642,
//       "Close": 17658
//     },
//     {
//       "LastTradeTime": 1681968600,
//       "QuotationLot": 50,
//       "TradedQty": 251450,
//       "OpenInterest": 9649300,
//       "Open": 17645,
//       "High": 17656.45,
//       "Low": 17626,
//       "Close": 17649.35
//     },
//     {
//       "LastTradeTime": 1681966800,
//       "QuotationLot": 50,
//       "TradedQty": 878200,
//       "OpenInterest": 9646550,
//       "Open": 17638.55,
//       "High": 17644.75,
//       "Low": 17624.05,
//       "Close": 17644.75
//     },
//     {
//       "LastTradeTime": 1681965000,
//       "QuotationLot": 50,
//       "TradedQty": 555500,
//       "OpenInterest": 9535050,
//       "Open": 17685.65,
//       "High": 17690,
//       "Low": 17635.45,
//       "Close": 17640
//     },
//     {
//       "LastTradeTime": 1681963200,
//       "QuotationLot": 50,
//       "TradedQty": 503150,
//       "OpenInterest": 9445350,
//       "Open": 17715.6,
//       "High": 17725,
//       "Low": 17680,
//       "Close": 17685.65
//     },
//     {
//       "LastTradeTime": 1681961400,
//       "QuotationLot": 50,
//       "TradedQty": 639050,
//       "OpenInterest": 9350400,
//       "Open": 17681.1,
//       "High": 17717.95,
//       "Low": 17660.6,
//       "Close": 17715
//     },
//     {
//       "LastTradeTime": 1681898400,
//       "QuotationLot": 50,
//       "TradedQty": 450,
//       "OpenInterest": 9485050,
//       "Open": 17645,
//       "High": 17645,
//       "Low": 17645,
//       "Close": 17645
//     },
//     {
//       "LastTradeTime": 1681896600,
//       "QuotationLot": 50,
//       "TradedQty": 741650,
//       "OpenInterest": 9485050,
//       "Open": 17631.1,
//       "High": 17665.45,
//       "Low": 17628.95,
//       "Close": 17645
//     },
//     {
//       "LastTradeTime": 1681894800,
//       "QuotationLot": 50,
//       "TradedQty": 233050,
//       "OpenInterest": 9531300,
//       "Open": 17646,
//       "High": 17651.9,
//       "Low": 17628,
//       "Close": 17633.05
//     },
//     {
//       "LastTradeTime": 1681893000,
//       "QuotationLot": 50,
//       "TradedQty": 361350,
//       "OpenInterest": 9513950,
//       "Open": 17637.25,
//       "High": 17652.55,
//       "Low": 17623.05,
//       "Close": 17645.05
//     },
//     {
//       "LastTradeTime": 1681891200,
//       "QuotationLot": 50,
//       "TradedQty": 728300,
//       "OpenInterest": 9453450,
//       "Open": 17668.15,
//       "High": 17671.3,
//       "Low": 17622,
//       "Close": 17637.3
//     },
//     {
//       "LastTradeTime": 1681889400,
//       "QuotationLot": 50,
//       "TradedQty": 236050,
//       "OpenInterest": 9464050,
//       "Open": 17696.45,
//       "High": 17697.1,
//       "Low": 17662.8,
//       "Close": 17668.15
//     },
//     {
//       "LastTradeTime": 1681887600,
//       "QuotationLot": 50,
//       "TradedQty": 178750,
//       "OpenInterest": 9513450,
//       "Open": 17689.95,
//       "High": 17707.9,
//       "Low": 17687.35,
//       "Close": 17695.95
//     },
//     {
//       "LastTradeTime": 1681885800,
//       "QuotationLot": 50,
//       "TradedQty": 513000,
//       "OpenInterest": 9516800,
//       "Open": 17689,
//       "High": 17705.3,
//       "Low": 17679.95,
//       "Close": 17690
//     },
//     {
//       "LastTradeTime": 1681884000,
//       "QuotationLot": 50,
//       "TradedQty": 534650,
//       "OpenInterest": 9322400,
//       "Open": 17672.05,
//       "High": 17706.8,
//       "Low": 17668.95,
//       "Close": 17689
//     },
//     {
//       "LastTradeTime": 1681882200,
//       "QuotationLot": 50,
//       "TradedQty": 183950,
//       "OpenInterest": 9364700,
//       "Open": 17680,
//       "High": 17691.5,
//       "Low": 17667.9,
//       "Close": 17672.05
//     },
//     {
//       "LastTradeTime": 1681880400,
//       "QuotationLot": 50,
//       "TradedQty": 185150,
//       "OpenInterest": 9386300,
//       "Open": 17682.95,
//       "High": 17693.35,
//       "Low": 17665.85,
//       "Close": 17680
//     },
//     {
//       "LastTradeTime": 1681878600,
//       "QuotationLot": 50,
//       "TradedQty": 286900,
//       "OpenInterest": 9361950,
//       "Open": 17673.8,
//       "High": 17684.15,
//       "Low": 17655.4,
//       "Close": 17682.95
//     },
//     {
//       "LastTradeTime": 1681876800,
//       "QuotationLot": 50,
//       "TradedQty": 482800,
//       "OpenInterest": 9332300,
//       "Open": 17674.1,
//       "High": 17710.8,
//       "Low": 17666.05,
//       "Close": 17673.85
//     },
//     {
//       "LastTradeTime": 1681875000,
//       "QuotationLot": 50,
//       "TradedQty": 410250,
//       "OpenInterest": 9237950,
//       "Open": 17700,
//       "High": 17700,
//       "Low": 17660.05,
//       "Close": 17674.1
//     },
//     {
//       "LastTradeTime": 1681812000,
//       "QuotationLot": 50,
//       "TradedQty": 0,
//       "OpenInterest": 9857550,
//       "Open": 17709.1,
//       "High": 17709.1,
//       "Low": 17709.1,
//       "Close": 17709.1
//     },
//     {
//       "LastTradeTime": 1681810200,
//       "QuotationLot": 50,
//       "TradedQty": 625650,
//       "OpenInterest": 9857550,
//       "Open": 17700,
//       "High": 17721.85,
//       "Low": 17700,
//       "Close": 17709.1
//     },
//     {
//       "LastTradeTime": 1681808400,
//       "QuotationLot": 50,
//       "TradedQty": 495950,
//       "OpenInterest": 9825050,
//       "Open": 17689.15,
//       "High": 17714.9,
//       "Low": 17674.15,
//       "Close": 17698.05
//     },
//     {
//       "LastTradeTime": 1681806600,
//       "QuotationLot": 50,
//       "TradedQty": 456150,
//       "OpenInterest": 9731550,
//       "Open": 17677,
//       "High": 17692.5,
//       "Low": 17666,
//       "Close": 17689.15
//     },
//     {
//       "LastTradeTime": 1681804800,
//       "QuotationLot": 50,
//       "TradedQty": 842900,
//       "OpenInterest": 9691750,
//       "Open": 17707,
//       "High": 17710.75,
//       "Low": 17652.85,
//       "Close": 17676
//     },
//     {
//       "LastTradeTime": 1681803000,
//       "QuotationLot": 50,
//       "TradedQty": 322300,
//       "OpenInterest": 9615700,
//       "Open": 17754.9,
//       "High": 17759.7,
//       "Low": 17705.25,
//       "Close": 17705.4
//     },
//     {
//       "LastTradeTime": 1681801200,
//       "QuotationLot": 50,
//       "TradedQty": 268150,
//       "OpenInterest": 9631700,
//       "Open": 17724,
//       "High": 17755.2,
//       "Low": 17723.35,
//       "Close": 17754.45
//     },
//     {
//       "LastTradeTime": 1681799400,
//       "QuotationLot": 50,
//       "TradedQty": 206350,
//       "OpenInterest": 9612200,
//       "Open": 17710.65,
//       "High": 17736,
//       "Low": 17705.45,
//       "Close": 17728.8
//     },
//     {
//       "LastTradeTime": 1681797600,
//       "QuotationLot": 50,
//       "TradedQty": 231900,
//       "OpenInterest": 9610100,
//       "Open": 17725.65,
//       "High": 17727.05,
//       "Low": 17700,
//       "Close": 17708
//     },
//     {
//       "LastTradeTime": 1681795800,
//       "QuotationLot": 50,
//       "TradedQty": 226250,
//       "OpenInterest": 9584350,
//       "Open": 17722,
//       "High": 17729.95,
//       "Low": 17709.75,
//       "Close": 17725.4
//     },
//     {
//       "LastTradeTime": 1681794000,
//       "QuotationLot": 50,
//       "TradedQty": 455850,
//       "OpenInterest": 9547900,
//       "Open": 17700.35,
//       "High": 17734.35,
//       "Low": 17690.15,
//       "Close": 17720.8
//     },
//     {
//       "LastTradeTime": 1681792200,
//       "QuotationLot": 50,
//       "TradedQty": 617200,
//       "OpenInterest": 9590800,
//       "Open": 17715.15,
//       "High": 17715.15,
//       "Low": 17678.1,
//       "Close": 17701.5
//     },
//     {
//       "LastTradeTime": 1681790400,
//       "QuotationLot": 50,
//       "TradedQty": 882350,
//       "OpenInterest": 9460850,
//       "Open": 17773,
//       "High": 17780,
//       "Low": 17700,
//       "Close": 17715.1
//     },
//     {
//       "LastTradeTime": 1681788600,
//       "QuotationLot": 50,
//       "TradedQty": 578050,
//       "OpenInterest": 9347250,
//       "Open": 17775,
//       "High": 17780,
//       "Low": 17741.1,
//       "Close": 17773.7
//     },
//     {
//       "LastTradeTime": 1681725600,
//       "QuotationLot": 50,
//       "TradedQty": 0,
//       "OpenInterest": 10013550,
//       "Open": 17751,
//       "High": 17751,
//       "Low": 17751,
//       "Close": 17751
//     },
//     {
//       "LastTradeTime": 1681723800,
//       "QuotationLot": 50,
//       "TradedQty": 671700,
//       "OpenInterest": 10013550,
//       "Open": 17752.85,
//       "High": 17773.05,
//       "Low": 17747.15,
//       "Close": 17751
//     },
//     {
//       "LastTradeTime": 1681722000,
//       "QuotationLot": 50,
//       "TradedQty": 397750,
//       "OpenInterest": 9968950,
//       "Open": 17754.95,
//       "High": 17768.5,
//       "Low": 17733.4,
//       "Close": 17753.75
//     },
//     {
//       "LastTradeTime": 1681720200,
//       "QuotationLot": 50,
//       "TradedQty": 229800,
//       "OpenInterest": 9961800,
//       "Open": 17746.95,
//       "High": 17756.95,
//       "Low": 17735,
//       "Close": 17754
//     },
//     {
//       "LastTradeTime": 1681718400,
//       "QuotationLot": 50,
//       "TradedQty": 178650,
//       "OpenInterest": 9936550,
//       "Open": 17727.5,
//       "High": 17749.95,
//       "Low": 17716.7,
//       "Close": 17746.95
//     },
//     {
//       "LastTradeTime": 1681716600,
//       "QuotationLot": 50,
//       "TradedQty": 292000,
//       "OpenInterest": 9936050,
//       "Open": 17752.6,
//       "High": 17756.8,
//       "Low": 17713,
//       "Close": 17727.5
//     },
//     {
//       "LastTradeTime": 1681714800,
//       "QuotationLot": 50,
//       "TradedQty": 296300,
//       "OpenInterest": 9954700,
//       "Open": 17755.05,
//       "High": 17767.6,
//       "Low": 17747.25,
//       "Close": 17752
//     },
//     {
//       "LastTradeTime": 1681713000,
//       "QuotationLot": 50,
//       "TradedQty": 367350,
//       "OpenInterest": 9934050,
//       "Open": 17736.4,
//       "High": 17759.9,
//       "Low": 17717.85,
//       "Close": 17755.05
//     },
//     {
//       "LastTradeTime": 1681711200,
//       "QuotationLot": 50,
//       "TradedQty": 481650,
//       "OpenInterest": 9866850,
//       "Open": 17718.55,
//       "High": 17743.5,
//       "Low": 17710.65,
//       "Close": 17736.4
//     },
//     {
//       "LastTradeTime": 1681709400,
//       "QuotationLot": 50,
//       "TradedQty": 268700,
//       "OpenInterest": 9909850,
//       "Open": 17729.6,
//       "High": 17741.1,
//       "Low": 17706.3,
//       "Close": 17717.95
//     },
//     {
//       "LastTradeTime": 1681707600,
//       "QuotationLot": 50,
//       "TradedQty": 695850,
//       "OpenInterest": 9889450,
//       "Open": 17705.6,
//       "High": 17745,
//       "Low": 17690,
//       "Close": 17729.6
//     },
//     {
//       "LastTradeTime": 1681705800,
//       "QuotationLot": 50,
//       "TradedQty": 830250,
//       "OpenInterest": 9899050,
//       "Open": 17650.2,
//       "High": 17714,
//       "Low": 17640,
//       "Close": 17705.6
//     },
//     {
//       "LastTradeTime": 1681704000,
//       "QuotationLot": 50,
//       "TradedQty": 1626100,
//       "OpenInterest": 9870100,
//       "Open": 17691.5,
//       "High": 17717,
//       "Low": 17650,
//       "Close": 17651.8
//     },
//     {
//       "LastTradeTime": 1681702200,
//       "QuotationLot": 50,
//       "TradedQty": 2187600,
//       "OpenInterest": 9631300,
//       "Open": 17820.1,
//       "High": 17854,
//       "Low": 17690,
//       "Close": 17691.5
//     },
//     {
//       "LastTradeTime": 1681380000,
//       "QuotationLot": 50,
//       "TradedQty": 1400,
//       "OpenInterest": 10032400,
//       "Open": 17884,
//       "High": 17884,
//       "Low": 17884,
//       "Close": 17884
//     },
//     {
//       "LastTradeTime": 1681378200,
//       "QuotationLot": 50,
//       "TradedQty": 961800,
//       "OpenInterest": 10032400,
//       "Open": 17871.05,
//       "High": 17889.9,
//       "Low": 17856.35,
//       "Close": 17882
//     },
//     {
//       "LastTradeTime": 1681376400,
//       "QuotationLot": 50,
//       "TradedQty": 544600,
//       "OpenInterest": 9866700,
//       "Open": 17853.2,
//       "High": 17877,
//       "Low": 17842.2,
//       "Close": 17871
//     },
//     {
//       "LastTradeTime": 1681374600,
//       "QuotationLot": 50,
//       "TradedQty": 470700,
//       "OpenInterest": 9787100,
//       "Open": 17831.35,
//       "High": 17856,
//       "Low": 17825.4,
//       "Close": 17852.1
//     },
//     {
//       "LastTradeTime": 1681372800,
//       "QuotationLot": 50,
//       "TradedQty": 335850,
//       "OpenInterest": 9797900,
//       "Open": 17810.85,
//       "High": 17833.55,
//       "Low": 17805.15,
//       "Close": 17831.4
//     },
//     {
//       "LastTradeTime": 1681371000,
//       "QuotationLot": 50,
//       "TradedQty": 249500,
//       "OpenInterest": 9750000,
//       "Open": 17825.85,
//       "High": 17828.9,
//       "Low": 17792.95,
//       "Close": 17810.9
//     },
//     {
//       "LastTradeTime": 1681369200,
//       "QuotationLot": 50,
//       "TradedQty": 432550,
//       "OpenInterest": 9754000,
//       "Open": 17788.3,
//       "High": 17826.95,
//       "Low": 17775,
//       "Close": 17825.75
//     },
//     {
//       "LastTradeTime": 1681367400,
//       "QuotationLot": 50,
//       "TradedQty": 312800,
//       "OpenInterest": 9735800,
//       "Open": 17817.45,
//       "High": 17819.9,
//       "Low": 17777.45,
//       "Close": 17786.6
//     },
//     {
//       "LastTradeTime": 1681365600,
//       "QuotationLot": 50,
//       "TradedQty": 287950,
//       "OpenInterest": 9710400,
//       "Open": 17788.6,
//       "High": 17820.7,
//       "Low": 17787.4,
//       "Close": 17818.8
//     },
//     {
//       "LastTradeTime": 1681363800,
//       "QuotationLot": 50,
//       "TradedQty": 565150,
//       "OpenInterest": 9676250,
//       "Open": 17803,
//       "High": 17808.4,
//       "Low": 17782,
//       "Close": 17789.9
//     },
//     {
//       "LastTradeTime": 1681362000,
//       "QuotationLot": 50,
//       "TradedQty": 652350,
//       "OpenInterest": 9698600,
//       "Open": 17839.7,
//       "High": 17853.4,
//       "Low": 17800,
//       "Close": 17802.2
//     },
//     {
//       "LastTradeTime": 1681360200,
//       "QuotationLot": 50,
//       "TradedQty": 474200,
//       "OpenInterest": 9658300,
//       "Open": 17844.55,
//       "High": 17846,
//       "Low": 17825.05,
//       "Close": 17840.35
//     },
//     {
//       "LastTradeTime": 1681358400,
//       "QuotationLot": 50,
//       "TradedQty": 854100,
//       "OpenInterest": 9669550,
//       "Open": 17860,
//       "High": 17878,
//       "Low": 17837,
//       "Close": 17844.55
//     },
//     {
//       "LastTradeTime": 1681356600,
//       "QuotationLot": 50,
//       "TradedQty": 665650,
//       "OpenInterest": 9420900,
//       "Open": 17850,
//       "High": 17865,
//       "Low": 17829.2,
//       "Close": 17860
//     },
//     {
//       "LastTradeTime": 1681293600,
//       "QuotationLot": 50,
//       "TradedQty": 300,
//       "OpenInterest": 9935200,
//       "Open": 17863.35,
//       "High": 17863.35,
//       "Low": 17863.35,
//       "Close": 17863.35
//     },
//     {
//       "LastTradeTime": 1681291800,
//       "QuotationLot": 50,
//       "TradedQty": 774550,
//       "OpenInterest": 9935200,
//       "Open": 17840,
//       "High": 17868.7,
//       "Low": 17839.45,
//       "Close": 17860
//     },
//     {
//       "LastTradeTime": 1681290000,
//       "QuotationLot": 50,
//       "TradedQty": 581400,
//       "OpenInterest": 10084400,
//       "Open": 17861.9,
//       "High": 17867.7,
//       "Low": 17830,
//       "Close": 17837.75
//     },
//     {
//       "LastTradeTime": 1681288200,
//       "QuotationLot": 50,
//       "TradedQty": 341850,
//       "OpenInterest": 10133900,
//       "Open": 17867.9,
//       "High": 17872,
//       "Low": 17854,
//       "Close": 17861.7
//     },
//     {
//       "LastTradeTime": 1681286400,
//       "QuotationLot": 50,
//       "TradedQty": 497850,
//       "OpenInterest": 10160950,
//       "Open": 17849.5,
//       "High": 17879.7,
//       "Low": 17846.8,
//       "Close": 17867.9
//     },
//     {
//       "LastTradeTime": 1681284600,
//       "QuotationLot": 50,
//       "TradedQty": 616850,
//       "OpenInterest": 10050650,
//       "Open": 17825.15,
//       "High": 17863.7,
//       "Low": 17816.35,
//       "Close": 17850
//     },
//     {
//       "LastTradeTime": 1681282800,
//       "QuotationLot": 50,
//       "TradedQty": 305900,
//       "OpenInterest": 9930400,
//       "Open": 17826.2,
//       "High": 17836.45,
//       "Low": 17820,
//       "Close": 17825
//     },
//     {
//       "LastTradeTime": 1681281000,
//       "QuotationLot": 50,
//       "TradedQty": 238750,
//       "OpenInterest": 9845350,
//       "Open": 17817.6,
//       "High": 17830,
//       "Low": 17804,
//       "Close": 17828
//     },
//     {
//       "LastTradeTime": 1681279200,
//       "QuotationLot": 50,
//       "TradedQty": 217500,
//       "OpenInterest": 9813150,
//       "Open": 17821.8,
//       "High": 17827.4,
//       "Low": 17815,
//       "Close": 17817.45
//     },
//     {
//       "LastTradeTime": 1681277400,
//       "QuotationLot": 50,
//       "TradedQty": 203900,
//       "OpenInterest": 9751650,
//       "Open": 17814.4,
//       "High": 17821.85,
//       "Low": 17803.1,
//       "Close": 17821.85
//     },
//     {
//       "LastTradeTime": 1681275600,
//       "QuotationLot": 50,
//       "TradedQty": 308350,
//       "OpenInterest": 9719100,
//       "Open": 17795.55,
//       "High": 17818.9,
//       "Low": 17788.65,
//       "Close": 17814.4
//     },
//     {
//       "LastTradeTime": 1681273800,
//       "QuotationLot": 50,
//       "TradedQty": 472800,
//       "OpenInterest": 9721200,
//       "Open": 17821.5,
//       "High": 17821.5,
//       "Low": 17788.1,
//       "Close": 17795.55
//     },
//     {
//       "LastTradeTime": 1681272000,
//       "QuotationLot": 50,
//       "TradedQty": 534200,
//       "OpenInterest": 9670350,
//       "Open": 17817.85,
//       "High": 17834.1,
//       "Low": 17814.65,
//       "Close": 17822.95
//     },
//     {
//       "LastTradeTime": 1681270200,
//       "QuotationLot": 50,
//       "TradedQty": 656500,
//       "OpenInterest": 9489600,
//       "Open": 17806.15,
//       "High": 17825.35,
//       "Low": 17778.3,
//       "Close": 17818
//     },
//     {
//       "LastTradeTime": 1681207200,
//       "QuotationLot": 50,
//       "TradedQty": 500,
//       "OpenInterest": 9766500,
//       "Open": 17787,
//       "High": 17787,
//       "Low": 17787,
//       "Close": 17787
//     },
//     {
//       "LastTradeTime": 1681205400,
//       "QuotationLot": 50,
//       "TradedQty": 596850,
//       "OpenInterest": 9766500,
//       "Open": 17782.25,
//       "High": 17796.25,
//       "Low": 17776.4,
//       "Close": 17789.1
//     },
//     {
//       "LastTradeTime": 1681203600,
//       "QuotationLot": 50,
//       "TradedQty": 298550,
//       "OpenInterest": 9745350,
//       "Open": 17772,
//       "High": 17788.6,
//       "Low": 17770.2,
//       "Close": 17779.95
//     },
//     {
//       "LastTradeTime": 1681201800,
//       "QuotationLot": 50,
//       "TradedQty": 224750,
//       "OpenInterest": 9743400,
//       "Open": 17779.5,
//       "High": 17785.95,
//       "Low": 17760.55,
//       "Close": 17772.1
//     },
//     {
//       "LastTradeTime": 1681200000,
//       "QuotationLot": 50,
//       "TradedQty": 390250,
//       "OpenInterest": 9744550,
//       "Open": 17745.35,
//       "High": 17782,
//       "Low": 17745.35,
//       "Close": 17778.55
//     },
//     {
//       "LastTradeTime": 1681198200,
//       "QuotationLot": 50,
//       "TradedQty": 252700,
//       "OpenInterest": 9744100,
//       "Open": 17747,
//       "High": 17750,
//       "Low": 17726.1,
//       "Close": 17745.35
//     },
//     {
//       "LastTradeTime": 1681196400,
//       "QuotationLot": 50,
//       "TradedQty": 257950,
//       "OpenInterest": 9717350,
//       "Open": 17729.3,
//       "High": 17754.7,
//       "Low": 17728,
//       "Close": 17747.65
//     },
//     {
//       "LastTradeTime": 1681194600,
//       "QuotationLot": 50,
//       "TradedQty": 433650,
//       "OpenInterest": 9735500,
//       "Open": 17751.2,
//       "High": 17759.45,
//       "Low": 17715.75,
//       "Close": 17728.85
//     },
//     {
//       "LastTradeTime": 1681192800,
//       "QuotationLot": 50,
//       "TradedQty": 430500,
//       "OpenInterest": 9787300,
//       "Open": 17763.1,
//       "High": 17764,
//       "Low": 17735,
//       "Close": 17750.9
//     },
//     {
//       "LastTradeTime": 1681191000,
//       "QuotationLot": 50,
//       "TradedQty": 416250,
//       "OpenInterest": 10096350,
//       "Open": 17772,
//       "High": 17790,
//       "Low": 17754.65,
//       "Close": 17763.1
//     },
//     {
//       "LastTradeTime": 1681189200,
//       "QuotationLot": 50,
//       "TradedQty": 366050,
//       "OpenInterest": 10121450,
//       "Open": 17781,
//       "High": 17787,
//       "Low": 17759.75,
//       "Close": 17771.9
//     },
//     {
//       "LastTradeTime": 1681187400,
//       "QuotationLot": 50,
//       "TradedQty": 827850,
//       "OpenInterest": 10204350,
//       "Open": 17784.4,
//       "High": 17809.35,
//       "Low": 17777.05,
//       "Close": 17781.25
//     },
//     {
//       "LastTradeTime": 1681185600,
//       "QuotationLot": 50,
//       "TradedQty": 765900,
//       "OpenInterest": 10013650,
//       "Open": 17757.4,
//       "High": 17786.7,
//       "Low": 17757.4,
//       "Close": 17784.45
//     },
//     {
//       "LastTradeTime": 1681183800,
//       "QuotationLot": 50,
//       "TradedQty": 1080750,
//       "OpenInterest": 9904400,
//       "Open": 17730,
//       "High": 17768.25,
//       "Low": 17723.65,
//       "Close": 17755.85
//     },
//     {
//       "LastTradeTime": 1681120800,
//       "QuotationLot": 50,
//       "TradedQty": 1400,
//       "OpenInterest": 10480050,
//       "Open": 17677,
//       "High": 17677,
//       "Low": 17677,
//       "Close": 17677
//     },
//     {
//       "LastTradeTime": 1681119000,
//       "QuotationLot": 50,
//       "TradedQty": 433350,
//       "OpenInterest": 10480050,
//       "Open": 17682.05,
//       "High": 17692,
//       "Low": 17674,
//       "Close": 17676
//     },
//     {
//       "LastTradeTime": 1681117200,
//       "QuotationLot": 50,
//       "TradedQty": 308200,
//       "OpenInterest": 10509900,
//       "Open": 17668.9,
//       "High": 17694.85,
//       "Low": 17658.45,
//       "Close": 17684.4
//     },
//     {
//       "LastTradeTime": 1681115400,
//       "QuotationLot": 50,
//       "TradedQty": 551650,
//       "OpenInterest": 10497650,
//       "Open": 17702.6,
//       "High": 17712.1,
//       "Low": 17653.6,
//       "Close": 17667.9
//     },
//     {
//       "LastTradeTime": 1681113600,
//       "QuotationLot": 50,
//       "TradedQty": 307000,
//       "OpenInterest": 10544700,
//       "Open": 17727.7,
//       "High": 17727.7,
//       "Low": 17702,
//       "Close": 17702
//     },
//     {
//       "LastTradeTime": 1681111800,
//       "QuotationLot": 50,
//       "TradedQty": 226650,
//       "OpenInterest": 10528350,
//       "Open": 17747,
//       "High": 17750,
//       "Low": 17720.05,
//       "Close": 17727.45
//     },
//     {
//       "LastTradeTime": 1681110000,
//       "QuotationLot": 50,
//       "TradedQty": 308600,
//       "OpenInterest": 10551850,
//       "Open": 17737.05,
//       "High": 17754,
//       "Low": 17728,
//       "Close": 17746.6
//     },
//     {
//       "LastTradeTime": 1681108200,
//       "QuotationLot": 50,
//       "TradedQty": 423750,
//       "OpenInterest": 10497950,
//       "Open": 17724,
//       "High": 17744.35,
//       "Low": 17722.65,
//       "Close": 17737.1
//     },
//     {
//       "LastTradeTime": 1681106400,
//       "QuotationLot": 50,
//       "TradedQty": 357400,
//       "OpenInterest": 10455950,
//       "Open": 17691.8,
//       "High": 17727,
//       "Low": 17687.65,
//       "Close": 17724
//     },
//     {
//       "LastTradeTime": 1681104600,
//       "QuotationLot": 50,
//       "TradedQty": 289800,
//       "OpenInterest": 10455550,
//       "Open": 17677.4,
//       "High": 17695.7,
//       "Low": 17677.4,
//       "Close": 17691.8
//     },
//     {
//       "LastTradeTime": 1681102800,
//       "QuotationLot": 50,
//       "TradedQty": 327250,
//       "OpenInterest": 10446250,
//       "Open": 17665,
//       "High": 17687.05,
//       "Low": 17663.55,
//       "Close": 17677.4
//     },
//     {
//       "LastTradeTime": 1681101000,
//       "QuotationLot": 50,
//       "TradedQty": 411600,
//       "OpenInterest": 10418950,
//       "Open": 17682,
//       "High": 17697.65,
//       "Low": 17663,
//       "Close": 17665.05
//     },
//     {
//       "LastTradeTime": 1681099200,
//       "QuotationLot": 50,
//       "TradedQty": 807950,
//       "OpenInterest": 10415450,
//       "Open": 17682.8,
//       "High": 17714.95,
//       "Low": 17656,
//       "Close": 17683
//     },
//     {
//       "LastTradeTime": 1681097400,
//       "QuotationLot": 50,
//       "TradedQty": 575750,
//       "OpenInterest": 10384150,
//       "Open": 17671,
//       "High": 17700,
//       "Low": 17665.1,
//       "Close": 17681.65
//     },
//     {
//       "LastTradeTime": 1680775200,
//       "QuotationLot": 50,
//       "TradedQty": 150,
//       "OpenInterest": 11048200,
//       "Open": 17650.6,
//       "High": 17650.6,
//       "Low": 17650.6,
//       "Close": 17650.6
//     },
//     {
//       "LastTradeTime": 1680773400,
//       "QuotationLot": 50,
//       "TradedQty": 932000,
//       "OpenInterest": 11048200,
//       "Open": 17649.25,
//       "High": 17655.6,
//       "Low": 17628.8,
//       "Close": 17650.6
//     },
//     {
//       "LastTradeTime": 1680771600,
//       "QuotationLot": 50,
//       "TradedQty": 379700,
//       "OpenInterest": 10876300,
//       "Open": 17634,
//       "High": 17660.05,
//       "Low": 17630.05,
//       "Close": 17650.6
//     },
//     {
//       "LastTradeTime": 1680769800,
//       "QuotationLot": 50,
//       "TradedQty": 344200,
//       "OpenInterest": 10812550,
//       "Open": 17618.25,
//       "High": 17643.5,
//       "Low": 17615.25,
//       "Close": 17634.85
//     },
//     {
//       "LastTradeTime": 1680768000,
//       "QuotationLot": 50,
//       "TradedQty": 831900,
//       "OpenInterest": 10782300,
//       "Open": 17677.5,
//       "High": 17679.95,
//       "Low": 17603,
//       "Close": 17618
//     },
//     {
//       "LastTradeTime": 1680766200,
//       "QuotationLot": 50,
//       "TradedQty": 758150,
//       "OpenInterest": 10797800,
//       "Open": 17706,
//       "High": 17709.85,
//       "Low": 17666.35,
//       "Close": 17677.95
//     },
//     {
//       "LastTradeTime": 1680764400,
//       "QuotationLot": 50,
//       "TradedQty": 601800,
//       "OpenInterest": 10747850,
//       "Open": 17672.8,
//       "High": 17715.95,
//       "Low": 17664.3,
//       "Close": 17705.55
//     },
//     {
//       "LastTradeTime": 1680762600,
//       "QuotationLot": 50,
//       "TradedQty": 212800,
//       "OpenInterest": 10780700,
//       "Open": 17657.45,
//       "High": 17675.45,
//       "Low": 17653,
//       "Close": 17670.25
//     },
//     {
//       "LastTradeTime": 1680760800,
//       "QuotationLot": 50,
//       "TradedQty": 306750,
//       "OpenInterest": 10791000,
//       "Open": 17663.65,
//       "High": 17677.9,
//       "Low": 17655,
//       "Close": 17657.45
//     },
//     {
//       "LastTradeTime": 1680759000,
//       "QuotationLot": 50,
//       "TradedQty": 543750,
//       "OpenInterest": 10775700,
//       "Open": 17663.15,
//       "High": 17676,
//       "Low": 17647.9,
//       "Close": 17663
//     },
//     {
//       "LastTradeTime": 1680757200,
//       "QuotationLot": 50,
//       "TradedQty": 492700,
//       "OpenInterest": 10793200,
//       "Open": 17638,
//       "High": 17666.65,
//       "Low": 17634.9,
//       "Close": 17664.95
//     },
//     {
//       "LastTradeTime": 1680755400,
//       "QuotationLot": 50,
//       "TradedQty": 1251700,
//       "OpenInterest": 10762250,
//       "Open": 17581.5,
//       "High": 17662.15,
//       "Low": 17574,
//       "Close": 17638
//     },
//     {
//       "LastTradeTime": 1680753600,
//       "QuotationLot": 50,
//       "TradedQty": 583750,
//       "OpenInterest": 10731100,
//       "Open": 17582.45,
//       "High": 17587.3,
//       "Low": 17557.1,
//       "Close": 17581.45
//     },
//     {
//       "LastTradeTime": 1680751800,
//       "QuotationLot": 50,
//       "TradedQty": 626200,
//       "OpenInterest": 10616050,
//       "Open": 17599.8,
//       "High": 17599.8,
//       "Low": 17575,
//       "Close": 17583.5
//     },
//     {
//       "LastTradeTime": 1680688800,
//       "QuotationLot": 50,
//       "TradedQty": 250,
//       "OpenInterest": 11211350,
//       "Open": 17625.35,
//       "High": 17625.35,
//       "Low": 17625.35,
//       "Close": 17625.35
//     },
//     {
//       "LastTradeTime": 1680687000,
//       "QuotationLot": 50,
//       "TradedQty": 1086800,
//       "OpenInterest": 11211350,
//       "Open": 17620.05,
//       "High": 17630,
//       "Low": 17605,
//       "Close": 17626.95
//     },
//     {
//       "LastTradeTime": 1680685200,
//       "QuotationLot": 50,
//       "TradedQty": 1011000,
//       "OpenInterest": 11174400,
//       "Open": 17607.5,
//       "High": 17623.95,
//       "Low": 17590.75,
//       "Close": 17618
//     },
//     {
//       "LastTradeTime": 1680683400,
//       "QuotationLot": 50,
//       "TradedQty": 346850,
//       "OpenInterest": 11002250,
//       "Open": 17587.75,
//       "High": 17609.65,
//       "Low": 17586,
//       "Close": 17607.2
//     },
//     {
//       "LastTradeTime": 1680681600,
//       "QuotationLot": 50,
//       "TradedQty": 474650,
//       "OpenInterest": 10919100,
//       "Open": 17608.9,
//       "High": 17610,
//       "Low": 17583.05,
//       "Close": 17588.5
//     },
//     {
//       "LastTradeTime": 1680679800,
//       "QuotationLot": 50,
//       "TradedQty": 477200,
//       "OpenInterest": 10903550,
//       "Open": 17603,
//       "High": 17620,
//       "Low": 17597.4,
//       "Close": 17606.2
//     },
//     {
//       "LastTradeTime": 1680678000,
//       "QuotationLot": 50,
//       "TradedQty": 594250,
//       "OpenInterest": 10917500,
//       "Open": 17580,
//       "High": 17610,
//       "Low": 17576.8,
//       "Close": 17605.85
//     },
//     {
//       "LastTradeTime": 1680676200,
//       "QuotationLot": 50,
//       "TradedQty": 297200,
//       "OpenInterest": 10932900,
//       "Open": 17576.05,
//       "High": 17589.45,
//       "Low": 17570,
//       "Close": 17580
//     },
//     {
//       "LastTradeTime": 1680674400,
//       "QuotationLot": 50,
//       "TradedQty": 207800,
//       "OpenInterest": 10896500,
//       "Open": 17563,
//       "High": 17580,
//       "Low": 17555.5,
//       "Close": 17576.45
//     },
//     {
//       "LastTradeTime": 1680672600,
//       "QuotationLot": 50,
//       "TradedQty": 296850,
//       "OpenInterest": 10883800,
//       "Open": 17552.55,
//       "High": 17567.5,
//       "Low": 17545.1,
//       "Close": 17562.5
//     },
//     {
//       "LastTradeTime": 1680670800,
//       "QuotationLot": 50,
//       "TradedQty": 640450,
//       "OpenInterest": 10876650,
//       "Open": 17564.35,
//       "High": 17582.8,
//       "Low": 17546.1,
//       "Close": 17555.1
//     },
//     {
//       "LastTradeTime": 1680669000,
//       "QuotationLot": 50,
//       "TradedQty": 615400,
//       "OpenInterest": 10973950,
//       "Open": 17540.8,
//       "High": 17570,
//       "Low": 17537.1,
//       "Close": 17566
//     },
//     {
//       "LastTradeTime": 1680667200,
//       "QuotationLot": 50,
//       "TradedQty": 720600,
//       "OpenInterest": 10876050,
//       "Open": 17537.1,
//       "High": 17550,
//       "Low": 17524.4,
//       "Close": 17541
//     },
//     {
//       "LastTradeTime": 1680665400,
//       "QuotationLot": 50,
//       "TradedQty": 1091400,
//       "OpenInterest": 10825650,
//       "Open": 17500,
//       "High": 17544.65,
//       "Low": 17486.8,
//       "Close": 17535.1
//     },
//     {
//       "LastTradeTime": 1680516000,
//       "QuotationLot": 50,
//       "TradedQty": 1800,
//       "OpenInterest": 11568050,
//       "Open": 17474.95,
//       "High": 17474.95,
//       "Low": 17474.95,
//       "Close": 17474.95
//     },
//     {
//       "LastTradeTime": 1680514200,
//       "QuotationLot": 50,
//       "TradedQty": 783100,
//       "OpenInterest": 11568050,
//       "Open": 17459.1,
//       "High": 17481.9,
//       "Low": 17452.6,
//       "Close": 17473
//     },
//     {
//       "LastTradeTime": 1680512400,
//       "QuotationLot": 50,
//       "TradedQty": 522200,
//       "OpenInterest": 11482400,
//       "Open": 17439.55,
//       "High": 17473,
//       "Low": 17434.25,
//       "Close": 17457.7
//     },
//     {
//       "LastTradeTime": 1680510600,
//       "QuotationLot": 50,
//       "TradedQty": 325200,
//       "OpenInterest": 11441200,
//       "Open": 17419.95,
//       "High": 17446.65,
//       "Low": 17415,
//       "Close": 17440
//     },
//     {
//       "LastTradeTime": 1680508800,
//       "QuotationLot": 50,
//       "TradedQty": 223350,
//       "OpenInterest": 11346400,
//       "Open": 17421.6,
//       "High": 17430,
//       "Low": 17414,
//       "Close": 17419.95
//     },
//     {
//       "LastTradeTime": 1680507000,
//       "QuotationLot": 50,
//       "TradedQty": 336400,
//       "OpenInterest": 11281700,
//       "Open": 17416.15,
//       "High": 17449.15,
//       "Low": 17410.1,
//       "Close": 17423
//     },
//     {
//       "LastTradeTime": 1680505200,
//       "QuotationLot": 50,
//       "TradedQty": 189400,
//       "OpenInterest": 11222800,
//       "Open": 17432,
//       "High": 17435,
//       "Low": 17415.05,
//       "Close": 17416.4
//     },
//     {
//       "LastTradeTime": 1680503400,
//       "QuotationLot": 50,
//       "TradedQty": 283700,
//       "OpenInterest": 11192750,
//       "Open": 17422,
//       "High": 17439.6,
//       "Low": 17416.05,
//       "Close": 17431.65
//     },
//     {
//       "LastTradeTime": 1680501600,
//       "QuotationLot": 50,
//       "TradedQty": 295450,
//       "OpenInterest": 11217850,
//       "Open": 17390.05,
//       "High": 17425,
//       "Low": 17383.85,
//       "Close": 17422
//     },
//     {
//       "LastTradeTime": 1680499800,
//       "QuotationLot": 50,
//       "TradedQty": 404150,
//       "OpenInterest": 11273050,
//       "Open": 17410.95,
//       "High": 17419.1,
//       "Low": 17386,
//       "Close": 17390
//     },
//     {
//       "LastTradeTime": 1680498000,
//       "QuotationLot": 50,
//       "TradedQty": 692050,
//       "OpenInterest": 11257250,
//       "Open": 17441.95,
//       "High": 17443,
//       "Low": 17403.15,
//       "Close": 17410.95
//     },
//     {
//       "LastTradeTime": 1680496200,
//       "QuotationLot": 50,
//       "TradedQty": 482650,
//       "OpenInterest": 11579050,
//       "Open": 17449,
//       "High": 17455.15,
//       "Low": 17426.95,
//       "Close": 17444.4
//     },
//     {
//       "LastTradeTime": 1680494400,
//       "QuotationLot": 50,
//       "TradedQty": 851100,
//       "OpenInterest": 11571050,
//       "Open": 17410.9,
//       "High": 17456,
//       "Low": 17395.9,
//       "Close": 17446.9
//     },
//     {
//       "LastTradeTime": 1680492600,
//       "QuotationLot": 50,
//       "TradedQty": 831750,
//       "OpenInterest": 11595450,
//       "Open": 17470,
//       "High": 17489,
//       "Low": 17406.8,
//       "Close": 17413.3
//     },
//     {
//       "LastTradeTime": 1680256800,
//       "QuotationLot": 50,
//       "TradedQty": 1200,
//       "OpenInterest": 12123550,
//       "Open": 17442.25,
//       "High": 17442.25,
//       "Low": 17442.25,
//       "Close": 17442.25
//     },
//     {
//       "LastTradeTime": 1680255000,
//       "QuotationLot": 50,
//       "TradedQty": 1221100,
//       "OpenInterest": 12123550,
//       "Open": 17448.75,
//       "High": 17466,
//       "Low": 17423,
//       "Close": 17440.35
//     },
//     {
//       "LastTradeTime": 1680253200,
//       "QuotationLot": 50,
//       "TradedQty": 481950,
//       "OpenInterest": 12152050,
//       "Open": 17443.9,
//       "High": 17463.95,
//       "Low": 17424,
//       "Close": 17453
//     },
//     {
//       "LastTradeTime": 1680251400,
//       "QuotationLot": 50,
//       "TradedQty": 509600,
//       "OpenInterest": 12215050,
//       "Open": 17435.5,
//       "High": 17459.85,
//       "Low": 17429.45,
//       "Close": 17440.75
//     },
//     {
//       "LastTradeTime": 1680249600,
//       "QuotationLot": 50,
//       "TradedQty": 548850,
//       "OpenInterest": 12282600,
//       "Open": 17403.25,
//       "High": 17445,
//       "Low": 17396.25,
//       "Close": 17435
//     },
//     {
//       "LastTradeTime": 1680247800,
//       "QuotationLot": 50,
//       "TradedQty": 263400,
//       "OpenInterest": 12308300,
//       "Open": 17397.1,
//       "High": 17412,
//       "Low": 17394.15,
//       "Close": 17403.9
//     },
//     {
//       "LastTradeTime": 1680246000,
//       "QuotationLot": 50,
//       "TradedQty": 658150,
//       "OpenInterest": 12273100,
//       "Open": 17380.6,
//       "High": 17417,
//       "Low": 17375.35,
//       "Close": 17397.1
//     },
//     {
//       "LastTradeTime": 1680244200,
//       "QuotationLot": 50,
//       "TradedQty": 282450,
//       "OpenInterest": 12293550,
//       "Open": 17364.75,
//       "High": 17380,
//       "Low": 17358.2,
//       "Close": 17380
//     },
//     {
//       "LastTradeTime": 1680242400,
//       "QuotationLot": 50,
//       "TradedQty": 466650,
//       "OpenInterest": 12212950,
//       "Open": 17353.1,
//       "High": 17377.7,
//       "Low": 17352,
//       "Close": 17364
//     },
//     {
//       "LastTradeTime": 1680240600,
//       "QuotationLot": 50,
//       "TradedQty": 444600,
//       "OpenInterest": 12140950,
//       "Open": 17342,
//       "High": 17356.45,
//       "Low": 17332.5,
//       "Close": 17353.1
//     },
//     {
//       "LastTradeTime": 1680238800,
//       "QuotationLot": 50,
//       "TradedQty": 931450,
//       "OpenInterest": 12009900,
//       "Open": 17351.55,
//       "High": 17351.55,
//       "Low": 17326.1,
//       "Close": 17341.35
//     },
//     {
//       "LastTradeTime": 1680237000,
//       "QuotationLot": 50,
//       "TradedQty": 447300,
//       "OpenInterest": 12048900,
//       "Open": 17361.25,
//       "High": 17380,
//       "Low": 17347.9,
//       "Close": 17351.05
//     },
//     {
//       "LastTradeTime": 1680235200,
//       "QuotationLot": 50,
//       "TradedQty": 873050,
//       "OpenInterest": 11989950,
//       "Open": 17365,
//       "High": 17385,
//       "Low": 17348,
//       "Close": 17360.2
//     },
//     {
//       "LastTradeTime": 1680233400,
//       "QuotationLot": 50,
//       "TradedQty": 1503500,
//       "OpenInterest": 11915750,
//       "Open": 17271,
//       "High": 17369.95,
//       "Low": 17271,
//       "Close": 17363.7
//     },
//     {
//       "LastTradeTime": 1680082200,
//       "QuotationLot": 50,
//       "TradedQty": 1197600,
//       "OpenInterest": 7004600,
//       "Open": 17010,
//       "High": 17090.6,
//       "Low": 17009.4,
//       "Close": 17081.2
//     },
//     {
//       "LastTradeTime": 1680080400,
//       "QuotationLot": 50,
//       "TradedQty": 783150,
//       "OpenInterest": 7414200,
//       "Open": 17020,
//       "High": 17022,
//       "Low": 16990.05,
//       "Close": 17012.35
//     },
//     {
//       "LastTradeTime": 1680078600,
//       "QuotationLot": 50,
//       "TradedQty": 1032000,
//       "OpenInterest": 8079000,
//       "Open": 17028.1,
//       "High": 17058.95,
//       "Low": 17012.15,
//       "Close": 17019.7
//     },
//     {
//       "LastTradeTime": 1680076800,
//       "QuotationLot": 50,
//       "TradedQty": 769900,
//       "OpenInterest": 7919350,
//       "Open": 17021,
//       "High": 17031.45,
//       "Low": 16993.85,
//       "Close": 17029.25
//     },
//     {
//       "LastTradeTime": 1680075000,
//       "QuotationLot": 50,
//       "TradedQty": 1709150,
//       "OpenInterest": 7827850,
//       "Open": 16977.8,
//       "High": 17022,
//       "Low": 16969.6,
//       "Close": 17019.6
//     },
//     {
//       "LastTradeTime": 1680073200,
//       "QuotationLot": 50,
//       "TradedQty": 745600,
//       "OpenInterest": 7961650,
//       "Open": 16952,
//       "High": 16976.9,
//       "Low": 16948.6,
//       "Close": 16976.9
//     },
//     {
//       "LastTradeTime": 1680071400,
//       "QuotationLot": 50,
//       "TradedQty": 656950,
//       "OpenInterest": 7595450,
//       "Open": 16976,
//       "High": 16982.15,
//       "Low": 16942,
//       "Close": 16951.55
//     },
//     {
//       "LastTradeTime": 1680069600,
//       "QuotationLot": 50,
//       "TradedQty": 432350,
//       "OpenInterest": 7532450,
//       "Open": 16989.1,
//       "High": 16989.1,
//       "Low": 16960.05,
//       "Close": 16975.8
//     },
//     {
//       "LastTradeTime": 1680067800,
//       "QuotationLot": 50,
//       "TradedQty": 2026100,
//       "OpenInterest": 7549600,
//       "Open": 17024.45,
//       "High": 17031.7,
//       "Low": 16967.95,
//       "Close": 16988.95
//     },
//     {
//       "LastTradeTime": 1680066000,
//       "QuotationLot": 50,
//       "TradedQty": 799750,
//       "OpenInterest": 6876550,
//       "Open": 17046.3,
//       "High": 17056.6,
//       "Low": 17022.45,
//       "Close": 17024.95
//     },
//     {
//       "LastTradeTime": 1680064200,
//       "QuotationLot": 50,
//       "TradedQty": 582200,
//       "OpenInterest": 6700600,
//       "Open": 17030.1,
//       "High": 17049,
//       "Low": 17014.25,
//       "Close": 17046
//     },
//     {
//       "LastTradeTime": 1680062400,
//       "QuotationLot": 50,
//       "TradedQty": 985450,
//       "OpenInterest": 6628950,
//       "Open": 17005,
//       "High": 17040.8,
//       "Low": 16999.2,
//       "Close": 17030.35
//     },
//     {
//       "LastTradeTime": 1680060600,
//       "QuotationLot": 50,
//       "TradedQty": 543750,
//       "OpenInterest": 6429950,
//       "Open": 16983,
//       "High": 17019,
//       "Low": 16982.55,
//       "Close": 17006
//     },
//     {
//       "LastTradeTime": 1679997600,
//       "QuotationLot": 50,
//       "TradedQty": 250,
//       "OpenInterest": 10137900,
//       "Open": 16977.7,
//       "High": 16977.7,
//       "Low": 16977.7,
//       "Close": 16977.7
//     },
//     {
//       "LastTradeTime": 1679995800,
//       "QuotationLot": 50,
//       "TradedQty": 1118350,
//       "OpenInterest": 10137900,
//       "Open": 16972.75,
//       "High": 16989,
//       "Low": 16943.85,
//       "Close": 16977.65
//     },
//     {
//       "LastTradeTime": 1679994000,
//       "QuotationLot": 50,
//       "TradedQty": 644900,
//       "OpenInterest": 10024600,
//       "Open": 16951.35,
//       "High": 16977,
//       "Low": 16946.5,
//       "Close": 16970.85
//     },
//     {
//       "LastTradeTime": 1679992200,
//       "QuotationLot": 50,
//       "TradedQty": 792150,
//       "OpenInterest": 9873400,
//       "Open": 16963.3,
//       "High": 16976.55,
//       "Low": 16927.45,
//       "Close": 16951.5
//     },
//     {
//       "LastTradeTime": 1679990400,
//       "QuotationLot": 50,
//       "TradedQty": 611050,
//       "OpenInterest": 10093300,
//       "Open": 16975,
//       "High": 16992.6,
//       "Low": 16943,
//       "Close": 16963.2
//     },
//     {
//       "LastTradeTime": 1679988600,
//       "QuotationLot": 50,
//       "TradedQty": 461050,
//       "OpenInterest": 9951800,
//       "Open": 16995.15,
//       "High": 17015,
//       "Low": 16966.1,
//       "Close": 16975.2
//     },
//     {
//       "LastTradeTime": 1679986800,
//       "QuotationLot": 50,
//       "TradedQty": 472050,
//       "OpenInterest": 9880150,
//       "Open": 16984,
//       "High": 17009.95,
//       "Low": 16984,
//       "Close": 16995.45
//     },
//     {
//       "LastTradeTime": 1679985000,
//       "QuotationLot": 50,
//       "TradedQty": 505750,
//       "OpenInterest": 9725200,
//       "Open": 17004.55,
//       "High": 17005.4,
//       "Low": 16980.55,
//       "Close": 16984
//     },
//     {
//       "LastTradeTime": 1679983200,
//       "QuotationLot": 50,
//       "TradedQty": 363300,
//       "OpenInterest": 9712650,
//       "Open": 16992.45,
//       "High": 17024.4,
//       "Low": 16984.95,
//       "Close": 17005.1
//     },
//     {
//       "LastTradeTime": 1679981400,
//       "QuotationLot": 50,
//       "TradedQty": 388800,
//       "OpenInterest": 9699050,
//       "Open": 16969.95,
//       "High": 17004.2,
//       "Low": 16968.3,
//       "Close": 16991.95
//     },
//     {
//       "LastTradeTime": 1679979600,
//       "QuotationLot": 50,
//       "TradedQty": 540800,
//       "OpenInterest": 9735850,
//       "Open": 16997.25,
//       "High": 16997.55,
//       "Low": 16968,
//       "Close": 16969.95
//     },
//     {
//       "LastTradeTime": 1679977800,
//       "QuotationLot": 50,
//       "TradedQty": 540350,
//       "OpenInterest": 9724300,
//       "Open": 17014.1,
//       "High": 17039.8,
//       "Low": 16995,
//       "Close": 16998.2
//     },
//     {
//       "LastTradeTime": 1679976000,
//       "QuotationLot": 50,
//       "TradedQty": 682150,
//       "OpenInterest": 9667200,
//       "Open": 17046.35,
//       "High": 17062.45,
//       "Low": 17011.55,
//       "Close": 17014.1
//     },
//     {
//       "LastTradeTime": 1679974200,
//       "QuotationLot": 50,
//       "TradedQty": 1347600,
//       "OpenInterest": 9550500,
//       "Open": 17065,
//       "High": 17088.25,
//       "Low": 17033,
//       "Close": 17046.35
//     },
//     {
//       "LastTradeTime": 1679911200,
//       "QuotationLot": 50,
//       "TradedQty": 1300,
//       "OpenInterest": 11094200,
//       "Open": 17024.55,
//       "High": 17024.55,
//       "Low": 17024.55,
//       "Close": 17024.55
//     },
//     {
//       "LastTradeTime": 1679909400,
//       "QuotationLot": 50,
//       "TradedQty": 1392800,
//       "OpenInterest": 11094200,
//       "Open": 17087,
//       "High": 17087,
//       "Low": 17007.05,
//       "Close": 17028.1
//     },
//     {
//       "LastTradeTime": 1679907600,
//       "QuotationLot": 50,
//       "TradedQty": 689450,
//       "OpenInterest": 11080050,
//       "Open": 17115,
//       "High": 17124.55,
//       "Low": 17090.05,
//       "Close": 17093
//     },
//     {
//       "LastTradeTime": 1679905800,
//       "QuotationLot": 50,
//       "TradedQty": 1015100,
//       "OpenInterest": 10927000,
//       "Open": 17062.9,
//       "High": 17121.55,
//       "Low": 17051,
//       "Close": 17115
//     },
//     {
//       "LastTradeTime": 1679904000,
//       "QuotationLot": 50,
//       "TradedQty": 469350,
//       "OpenInterest": 10660850,
//       "Open": 17008,
//       "High": 17068,
//       "Low": 17005.15,
//       "Close": 17063.9
//     },
//     {
//       "LastTradeTime": 1679902200,
//       "QuotationLot": 50,
//       "TradedQty": 682650,
//       "OpenInterest": 10672850,
//       "Open": 17052.45,
//       "High": 17057.1,
//       "Low": 17000.85,
//       "Close": 17009.65
//     },
//     {
//       "LastTradeTime": 1679900400,
//       "QuotationLot": 50,
//       "TradedQty": 388300,
//       "OpenInterest": 11031150,
//       "Open": 17078.1,
//       "High": 17089,
//       "Low": 17048.45,
//       "Close": 17052.25
//     },
//     {
//       "LastTradeTime": 1679898600,
//       "QuotationLot": 50,
//       "TradedQty": 692500,
//       "OpenInterest": 11015250,
//       "Open": 17047.6,
//       "High": 17095,
//       "Low": 17043.6,
//       "Close": 17075
//     },
//     {
//       "LastTradeTime": 1679896800,
//       "QuotationLot": 50,
//       "TradedQty": 931600,
//       "OpenInterest": 10950800,
//       "Open": 17012.1,
//       "High": 17065,
//       "Low": 17007.1,
//       "Close": 17046
//     },
//     {
//       "LastTradeTime": 1679895000,
//       "QuotationLot": 50,
//       "TradedQty": 331000,
//       "OpenInterest": 10854400,
//       "Open": 17022.4,
//       "High": 17031,
//       "Low": 16991.9,
//       "Close": 17012.1
//     },
//     {
//       "LastTradeTime": 1679893200,
//       "QuotationLot": 50,
//       "TradedQty": 975300,
//       "OpenInterest": 11116200,
//       "Open": 17052.65,
//       "High": 17055,
//       "Low": 17000,
//       "Close": 17022.4
//     },
//     {
//       "LastTradeTime": 1679891400,
//       "QuotationLot": 50,
//       "TradedQty": 781150,
//       "OpenInterest": 11292350,
//       "Open": 17052.05,
//       "High": 17066.35,
//       "Low": 17025,
//       "Close": 17051.95
//     },
//     {
//       "LastTradeTime": 1679889600,
//       "QuotationLot": 50,
//       "TradedQty": 1219250,
//       "OpenInterest": 11250550,
//       "Open": 17006.45,
//       "High": 17069.7,
//       "Low": 17006.45,
//       "Close": 17055
//     },
//     {
//       "LastTradeTime": 1679887800,
//       "QuotationLot": 50,
//       "TradedQty": 1271900,
//       "OpenInterest": 11197800,
//       "Open": 16995.25,
//       "High": 17015,
//       "Low": 16940.8,
//       "Close": 17005
//     },
//     {
//       "LastTradeTime": 1679652000,
//       "QuotationLot": 50,
//       "TradedQty": 2600,
//       "OpenInterest": 11647600,
//       "Open": 16938,
//       "High": 16938,
//       "Low": 16938,
//       "Close": 16938
//     },
//     {
//       "LastTradeTime": 1679650200,
//       "QuotationLot": 50,
//       "TradedQty": 1261500,
//       "OpenInterest": 11647600,
//       "Open": 17006.2,
//       "High": 17007.55,
//       "Low": 16931.95,
//       "Close": 16940.5
//     },
//     {
//       "LastTradeTime": 1679648400,
//       "QuotationLot": 50,
//       "TradedQty": 709600,
//       "OpenInterest": 11799300,
//       "Open": 16992.35,
//       "High": 17014.85,
//       "Low": 16975,
//       "Close": 16999.15
//     },
//     {
//       "LastTradeTime": 1679646600,
//       "QuotationLot": 50,
//       "TradedQty": 827100,
//       "OpenInterest": 11770900,
//       "Open": 17051.85,
//       "High": 17054.5,
//       "Low": 16987.85,
//       "Close": 16991.05
//     },
//     {
//       "LastTradeTime": 1679644800,
//       "QuotationLot": 50,
//       "TradedQty": 632750,
//       "OpenInterest": 11737900,
//       "Open": 17090.4,
//       "High": 17094.95,
//       "Low": 17027.3,
//       "Close": 17051.5
//     },
//     {
//       "LastTradeTime": 1679643000,
//       "QuotationLot": 50,
//       "TradedQty": 444850,
//       "OpenInterest": 11783950,
//       "Open": 17060,
//       "High": 17114.7,
//       "Low": 17058.75,
//       "Close": 17089.7
//     },
//     {
//       "LastTradeTime": 1679641200,
//       "QuotationLot": 50,
//       "TradedQty": 538350,
//       "OpenInterest": 11786150,
//       "Open": 17097.25,
//       "High": 17101.5,
//       "Low": 17052,
//       "Close": 17060.5
//     },
//     {
//       "LastTradeTime": 1679639400,
//       "QuotationLot": 50,
//       "TradedQty": 452750,
//       "OpenInterest": 11780800,
//       "Open": 17101,
//       "High": 17119.9,
//       "Low": 17089.6,
//       "Close": 17095.05
//     },
//     {
//       "LastTradeTime": 1679637600,
//       "QuotationLot": 50,
//       "TradedQty": 438100,
//       "OpenInterest": 11811650,
//       "Open": 17064.7,
//       "High": 17110,
//       "Low": 17055,
//       "Close": 17101
//     },
//     {
//       "LastTradeTime": 1679635800,
//       "QuotationLot": 50,
//       "TradedQty": 269350,
//       "OpenInterest": 11868650,
//       "Open": 17044.95,
//       "High": 17087.6,
//       "Low": 17042,
//       "Close": 17064
//     },
//     {
//       "LastTradeTime": 1679634000,
//       "QuotationLot": 50,
//       "TradedQty": 325950,
//       "OpenInterest": 11900750,
//       "Open": 17050,
//       "High": 17062.4,
//       "Low": 17030.25,
//       "Close": 17043.5
//     },
//     {
//       "LastTradeTime": 1679632200,
//       "QuotationLot": 50,
//       "TradedQty": 595000,
//       "OpenInterest": 11889500,
//       "Open": 17083.55,
//       "High": 17109.8,
//       "Low": 17038.8,
//       "Close": 17047.85
//     },
//     {
//       "LastTradeTime": 1679630400,
//       "QuotationLot": 50,
//       "TradedQty": 871300,
//       "OpenInterest": 11853450,
//       "Open": 17033.1,
//       "High": 17092,
//       "Low": 17010.1,
//       "Close": 17083.55
//     },
//     {
//       "LastTradeTime": 1679628600,
//       "QuotationLot": 50,
//       "TradedQty": 846400,
//       "OpenInterest": 11788600,
//       "Open": 17079.95,
//       "High": 17117.9,
//       "Low": 17026,
//       "Close": 17032
//     },
//     {
//       "LastTradeTime": 1679565600,
//       "QuotationLot": 50,
//       "TradedQty": 1250,
//       "OpenInterest": 12200150,
//       "Open": 17082,
//       "High": 17082,
//       "Low": 17082,
//       "Close": 17082
//     },
//     {
//       "LastTradeTime": 1679563800,
//       "QuotationLot": 50,
//       "TradedQty": 1582400,
//       "OpenInterest": 12200150,
//       "Open": 17119.45,
//       "High": 17139.4,
//       "Low": 17066.95,
//       "Close": 17081
//     },
//     {
//       "LastTradeTime": 1679562000,
//       "QuotationLot": 50,
//       "TradedQty": 899350,
//       "OpenInterest": 12298300,
//       "Open": 17130,
//       "High": 17136.7,
//       "Low": 17102.15,
//       "Close": 17120.95
//     },
//     {
//       "LastTradeTime": 1679560200,
//       "QuotationLot": 50,
//       "TradedQty": 781150,
//       "OpenInterest": 12077900,
//       "Open": 17188.9,
//       "High": 17195,
//       "Low": 17129.05,
//       "Close": 17130
//     },
//     {
//       "LastTradeTime": 1679558400,
//       "QuotationLot": 50,
//       "TradedQty": 319250,
//       "OpenInterest": 12056850,
//       "Open": 17214.95,
//       "High": 17223.1,
//       "Low": 17182.55,
//       "Close": 17188
//     },
//     {
//       "LastTradeTime": 1679556600,
//       "QuotationLot": 50,
//       "TradedQty": 309900,
//       "OpenInterest": 12086950,
//       "Open": 17216.1,
//       "High": 17228.1,
//       "Low": 17200,
//       "Close": 17214.95
//     },
//     {
//       "LastTradeTime": 1679554800,
//       "QuotationLot": 50,
//       "TradedQty": 652500,
//       "OpenInterest": 12114450,
//       "Open": 17187.45,
//       "High": 17239.55,
//       "Low": 17185.65,
//       "Close": 17217.15
//     },
//     {
//       "LastTradeTime": 1679553000,
//       "QuotationLot": 50,
//       "TradedQty": 182500,
//       "OpenInterest": 12130100,
//       "Open": 17199.9,
//       "High": 17205,
//       "Low": 17182.8,
//       "Close": 17186.4
//     },
//     {
//       "LastTradeTime": 1679551200,
//       "QuotationLot": 50,
//       "TradedQty": 345250,
//       "OpenInterest": 12119000,
//       "Open": 17175,
//       "High": 17201.2,
//       "Low": 17175,
//       "Close": 17199
//     },
//     {
//       "LastTradeTime": 1679549400,
//       "QuotationLot": 50,
//       "TradedQty": 259400,
//       "OpenInterest": 12059100,
//       "Open": 17177.1,
//       "High": 17186,
//       "Low": 17156.05,
//       "Close": 17175
//     },
//     {
//       "LastTradeTime": 1679547600,
//       "QuotationLot": 50,
//       "TradedQty": 629200,
//       "OpenInterest": 12044050,
//       "Open": 17213,
//       "High": 17218.25,
//       "Low": 17167.35,
//       "Close": 17176.15
//     },
//     {
//       "LastTradeTime": 1679545800,
//       "QuotationLot": 50,
//       "TradedQty": 1038600,
//       "OpenInterest": 12119000,
//       "Open": 17160,
//       "High": 17214.95,
//       "Low": 17159.3,
//       "Close": 17214.4
//     },
//     {
//       "LastTradeTime": 1679544000,
//       "QuotationLot": 50,
//       "TradedQty": 943400,
//       "OpenInterest": 11883200,
//       "Open": 17090,
//       "High": 17163,
//       "Low": 17076.25,
//       "Close": 17159.5
//     },
//     {
//       "LastTradeTime": 1679542200,
//       "QuotationLot": 50,
//       "TradedQty": 843150,
//       "OpenInterest": 11717800,
//       "Open": 17124.9,
//       "High": 17150,
//       "Low": 17081,
//       "Close": 17091.2
//     },
//     {
//       "LastTradeTime": 1679479200,
//       "QuotationLot": 50,
//       "TradedQty": 100,
//       "OpenInterest": 12023600,
//       "Open": 17183.95,
//       "High": 17183.95,
//       "Low": 17183.95,
//       "Close": 17183.95
//     },
//     {
//       "LastTradeTime": 1679477400,
//       "QuotationLot": 50,
//       "TradedQty": 803450,
//       "OpenInterest": 12023600,
//       "Open": 17172.9,
//       "High": 17198.45,
//       "Low": 17165.95,
//       "Close": 17183.3
//     },
//     {
//       "LastTradeTime": 1679475600,
//       "QuotationLot": 50,
//       "TradedQty": 284850,
//       "OpenInterest": 12113650,
//       "Open": 17162,
//       "High": 17176.1,
//       "Low": 17149,
//       "Close": 17172.75
//     },
//     {
//       "LastTradeTime": 1679473800,
//       "QuotationLot": 50,
//       "TradedQty": 166700,
//       "OpenInterest": 12132750,
//       "Open": 17171,
//       "High": 17186,
//       "Low": 17163.05,
//       "Close": 17164.35
//     },
//     {
//       "LastTradeTime": 1679472000,
//       "QuotationLot": 50,
//       "TradedQty": 265000,
//       "OpenInterest": 12157100,
//       "Open": 17162.05,
//       "High": 17190,
//       "Low": 17146,
//       "Close": 17170
//     },
//     {
//       "LastTradeTime": 1679470200,
//       "QuotationLot": 50,
//       "TradedQty": 260500,
//       "OpenInterest": 12155300,
//       "Open": 17170.2,
//       "High": 17182.8,
//       "Low": 17151.2,
//       "Close": 17162.05
//     },
//     {
//       "LastTradeTime": 1679468400,
//       "QuotationLot": 50,
//       "TradedQty": 285300,
//       "OpenInterest": 12129450,
//       "Open": 17185.8,
//       "High": 17203.85,
//       "Low": 17162.3,
//       "Close": 17170.2
//     },
//     {
//       "LastTradeTime": 1679466600,
//       "QuotationLot": 50,
//       "TradedQty": 165650,
//       "OpenInterest": 12137800,
//       "Open": 17182,
//       "High": 17189.65,
//       "Low": 17163.5,
//       "Close": 17185
//     },
//     {
//       "LastTradeTime": 1679464800,
//       "QuotationLot": 50,
//       "TradedQty": 218850,
//       "OpenInterest": 12156900,
//       "Open": 17183,
//       "High": 17193.6,
//       "Low": 17163.1,
//       "Close": 17182
//     },
//     {
//       "LastTradeTime": 1679463000,
//       "QuotationLot": 50,
//       "TradedQty": 411000,
//       "OpenInterest": 12166300,
//       "Open": 17165,
//       "High": 17184.15,
//       "Low": 17142.1,
//       "Close": 17184.05
//     },
//     {
//       "LastTradeTime": 1679461200,
//       "QuotationLot": 50,
//       "TradedQty": 266300,
//       "OpenInterest": 12137500,
//       "Open": 17184.05,
//       "High": 17188.75,
//       "Low": 17160,
//       "Close": 17165
//     },
//     {
//       "LastTradeTime": 1679459400,
//       "QuotationLot": 50,
//       "TradedQty": 472250,
//       "OpenInterest": 12135050,
//       "Open": 17191.3,
//       "High": 17203.7,
//       "Low": 17167,
//       "Close": 17184.85
//     },
//     {
//       "LastTradeTime": 1679457600,
//       "QuotationLot": 50,
//       "TradedQty": 977650,
//       "OpenInterest": 12145200,
//       "Open": 17205.9,
//       "High": 17215.1,
//       "Low": 17175,
//       "Close": 17194.7
//     },
//     {
//       "LastTradeTime": 1679455800,
//       "QuotationLot": 50,
//       "TradedQty": 863050,
//       "OpenInterest": 12306000,
//       "Open": 17211,
//       "High": 17238,
//       "Low": 17196.6,
//       "Close": 17205
//     },
//     {
//       "LastTradeTime": 1679392800,
//       "QuotationLot": 50,
//       "TradedQty": 3100,
//       "OpenInterest": 12618350,
//       "Open": 17169.1,
//       "High": 17169.1,
//       "Low": 17169.1,
//       "Close": 17169.1
//     },
//     {
//       "LastTradeTime": 1679391000,
//       "QuotationLot": 50,
//       "TradedQty": 756450,
//       "OpenInterest": 12618350,
//       "Open": 17171.65,
//       "High": 17174.85,
//       "Low": 17148.15,
//       "Close": 17167.1
//     },
//     {
//       "LastTradeTime": 1679389200,
//       "QuotationLot": 50,
//       "TradedQty": 419700,
//       "OpenInterest": 12707200,
//       "Open": 17153,
//       "High": 17183.65,
//       "Low": 17147.1,
//       "Close": 17172
//     },
//     {
//       "LastTradeTime": 1679387400,
//       "QuotationLot": 50,
//       "TradedQty": 475200,
//       "OpenInterest": 12726700,
//       "Open": 17164.35,
//       "High": 17170,
//       "Low": 17132.75,
//       "Close": 17155
//     },
//     {
//       "LastTradeTime": 1679385600,
//       "QuotationLot": 50,
//       "TradedQty": 384400,
//       "OpenInterest": 12685500,
//       "Open": 17124,
//       "High": 17164.6,
//       "Low": 17114.05,
//       "Close": 17162.6
//     },
//     {
//       "LastTradeTime": 1679383800,
//       "QuotationLot": 50,
//       "TradedQty": 653550,
//       "OpenInterest": 12702000,
//       "Open": 17131.7,
//       "High": 17158.9,
//       "Low": 17122.5,
//       "Close": 17122.5
//     },
//     {
//       "LastTradeTime": 1679382000,
//       "QuotationLot": 50,
//       "TradedQty": 459600,
//       "OpenInterest": 12644450,
//       "Open": 17096,
//       "High": 17133.35,
//       "Low": 17082.55,
//       "Close": 17132.15
//     },
//     {
//       "LastTradeTime": 1679380200,
//       "QuotationLot": 50,
//       "TradedQty": 286000,
//       "OpenInterest": 12596800,
//       "Open": 17069,
//       "High": 17097,
//       "Low": 17062,
//       "Close": 17095.5
//     },
//     {
//       "LastTradeTime": 1679378400,
//       "QuotationLot": 50,
//       "TradedQty": 360950,
//       "OpenInterest": 12514850,
//       "Open": 17102.85,
//       "High": 17112.15,
//       "Low": 17061,
//       "Close": 17067.15
//     },
//     {
//       "LastTradeTime": 1679376600,
//       "QuotationLot": 50,
//       "TradedQty": 311200,
//       "OpenInterest": 12434400,
//       "Open": 17097.7,
//       "High": 17117.95,
//       "Low": 17081.05,
//       "Close": 17102.85
//     },
//     {
//       "LastTradeTime": 1679374800,
//       "QuotationLot": 50,
//       "TradedQty": 239950,
//       "OpenInterest": 12365650,
//       "Open": 17115.9,
//       "High": 17117.75,
//       "Low": 17092.5,
//       "Close": 17097.7
//     },
//     {
//       "LastTradeTime": 1679373000,
//       "QuotationLot": 50,
//       "TradedQty": 575900,
//       "OpenInterest": 12304600,
//       "Open": 17080.35,
//       "High": 17123.85,
//       "Low": 17069,
//       "Close": 17115.9
//     },
//     {
//       "LastTradeTime": 1679371200,
//       "QuotationLot": 50,
//       "TradedQty": 844200,
//       "OpenInterest": 12204300,
//       "Open": 17125.95,
//       "High": 17129.8,
//       "Low": 17052.25,
//       "Close": 17078
//     },
//     {
//       "LastTradeTime": 1679369400,
//       "QuotationLot": 50,
//       "TradedQty": 1132500,
//       "OpenInterest": 12133400,
//       "Open": 17090,
//       "High": 17125.4,
//       "Low": 17065.05,
//       "Close": 17125.4
//     },
//     {
//       "LastTradeTime": 1679306400,
//       "QuotationLot": 50,
//       "TradedQty": 100,
//       "OpenInterest": 13044200,
//       "Open": 17037.05,
//       "High": 17037.05,
//       "Low": 17037.05,
//       "Close": 17037.05
//     },
//     {
//       "LastTradeTime": 1679304600,
//       "QuotationLot": 50,
//       "TradedQty": 1462400,
//       "OpenInterest": 13044200,
//       "Open": 16984.55,
//       "High": 17047.85,
//       "Low": 16980,
//       "Close": 17037.05
//     },
//     {
//       "LastTradeTime": 1679302800,
//       "QuotationLot": 50,
//       "TradedQty": 1102900,
//       "OpenInterest": 13131800,
//       "Open": 16968,
//       "High": 16994.85,
//       "Low": 16956.55,
//       "Close": 16984.45
//     },
//     {
//       "LastTradeTime": 1679301000,
//       "QuotationLot": 50,
//       "TradedQty": 931450,
//       "OpenInterest": 13247050,
//       "Open": 16893.95,
//       "High": 16970,
//       "Low": 16888.65,
//       "Close": 16965.1
//     },
//     {
//       "LastTradeTime": 1679299200,
//       "QuotationLot": 50,
//       "TradedQty": 577450,
//       "OpenInterest": 13264450,
//       "Open": 16918,
//       "High": 16942.45,
//       "Low": 16880,
//       "Close": 16894.7
//     },
//     {
//       "LastTradeTime": 1679297400,
//       "QuotationLot": 50,
//       "TradedQty": 481750,
//       "OpenInterest": 13190700,
//       "Open": 16884.95,
//       "High": 16919,
//       "Low": 16866,
//       "Close": 16915
//     },
//     {
//       "LastTradeTime": 1679295600,
//       "QuotationLot": 50,
//       "TradedQty": 652500,
//       "OpenInterest": 13110350,
//       "Open": 16895,
//       "High": 16928,
//       "Low": 16872.5,
//       "Close": 16882.7
//     },
//     {
//       "LastTradeTime": 1679293800,
//       "QuotationLot": 50,
//       "TradedQty": 703200,
//       "OpenInterest": 13051600,
//       "Open": 16912.1,
//       "High": 16933.75,
//       "Low": 16892.25,
//       "Close": 16895
//     },
//     {
//       "LastTradeTime": 1679292000,
//       "QuotationLot": 50,
//       "TradedQty": 490850,
//       "OpenInterest": 12920050,
//       "Open": 16965.2,
//       "High": 16969,
//       "Low": 16912.55,
//       "Close": 16912.55
//     },
//     {
//       "LastTradeTime": 1679290200,
//       "QuotationLot": 50,
//       "TradedQty": 599050,
//       "OpenInterest": 12951550,
//       "Open": 16990.65,
//       "High": 17002.9,
//       "Low": 16955.7,
//       "Close": 16965.2
//     },
//     {
//       "LastTradeTime": 1679288400,
//       "QuotationLot": 50,
//       "TradedQty": 680250,
//       "OpenInterest": 13110700,
//       "Open": 16941.4,
//       "High": 16993.95,
//       "Low": 16921.55,
//       "Close": 16991.3
//     },
//     {
//       "LastTradeTime": 1679286600,
//       "QuotationLot": 50,
//       "TradedQty": 1053000,
//       "OpenInterest": 12979350,
//       "Open": 16957.1,
//       "High": 16976,
//       "Low": 16925.85,
//       "Close": 16941.4
//     },
//     {
//       "LastTradeTime": 1679284800,
//       "QuotationLot": 50,
//       "TradedQty": 1175100,
//       "OpenInterest": 12730150,
//       "Open": 17005,
//       "High": 17016.5,
//       "Low": 16955.55,
//       "Close": 16959
//     },
//     {
//       "LastTradeTime": 1679283000,
//       "QuotationLot": 50,
//       "TradedQty": 1751400,
//       "OpenInterest": 12463200,
//       "Open": 17099.8,
//       "High": 17109.8,
//       "Low": 16985,
//       "Close": 17003.75
//     },
//     {
//       "LastTradeTime": 1679047200,
//       "QuotationLot": 50,
//       "TradedQty": 0,
//       "OpenInterest": 12123150,
//       "Open": 17189,
//       "High": 17189,
//       "Low": 17189,
//       "Close": 17189
//     },
//     {
//       "LastTradeTime": 1679045400,
//       "QuotationLot": 50,
//       "TradedQty": 2418650,
//       "OpenInterest": 12123150,
//       "Open": 17175.75,
//       "High": 17208.75,
//       "Low": 17147.35,
//       "Close": 17189
//     },
//     {
//       "LastTradeTime": 1679043600,
//       "QuotationLot": 50,
//       "TradedQty": 931350,
//       "OpenInterest": 12222600,
//       "Open": 17090.7,
//       "High": 17181.5,
//       "Low": 17090.55,
//       "Close": 17174.45
//     },
//     {
//       "LastTradeTime": 1679041800,
//       "QuotationLot": 50,
//       "TradedQty": 740800,
//       "OpenInterest": 12209400,
//       "Open": 17149.95,
//       "High": 17163,
//       "Low": 17074,
//       "Close": 17090.15
//     },
//     {
//       "LastTradeTime": 1679040000,
//       "QuotationLot": 50,
//       "TradedQty": 1132050,
//       "OpenInterest": 12219250,
//       "Open": 17066.75,
//       "High": 17166.55,
//       "Low": 17063.6,
//       "Close": 17149.95
//     },
//     {
//       "LastTradeTime": 1679038200,
//       "QuotationLot": 50,
//       "TradedQty": 352650,
//       "OpenInterest": 12365900,
//       "Open": 17053,
//       "High": 17078,
//       "Low": 17022,
//       "Close": 17066.95
//     },
//     {
//       "LastTradeTime": 1679036400,
//       "QuotationLot": 50,
//       "TradedQty": 407700,
//       "OpenInterest": 12356000,
//       "Open": 17046,
//       "High": 17082.95,
//       "Low": 17032.15,
//       "Close": 17053.3
//     },
//     {
//       "LastTradeTime": 1679034600,
//       "QuotationLot": 50,
//       "TradedQty": 790800,
//       "OpenInterest": 12403500,
//       "Open": 17104,
//       "High": 17120,
//       "Low": 17020.05,
//       "Close": 17046.95
//     },
//     {
//       "LastTradeTime": 1679032800,
//       "QuotationLot": 50,
//       "TradedQty": 797000,
//       "OpenInterest": 12422850,
//       "Open": 17087.75,
//       "High": 17106.95,
//       "Low": 17048.3,
//       "Close": 17102.4
//     },
//     {
//       "LastTradeTime": 1679031000,
//       "QuotationLot": 50,
//       "TradedQty": 548100,
//       "OpenInterest": 12460950,
//       "Open": 17122,
//       "High": 17133.45,
//       "Low": 17078,
//       "Close": 17087.8
//     },
//     {
//       "LastTradeTime": 1679029200,
//       "QuotationLot": 50,
//       "TradedQty": 1076850,
//       "OpenInterest": 12401050,
//       "Open": 17129.8,
//       "High": 17160.65,
//       "Low": 17104.3,
//       "Close": 17122
//     },
//     {
//       "LastTradeTime": 1679027400,
//       "QuotationLot": 50,
//       "TradedQty": 480450,
//       "OpenInterest": 12282100,
//       "Open": 17105.95,
//       "High": 17160,
//       "Low": 17101.5,
//       "Close": 17129.8
//     },
//     {
//       "LastTradeTime": 1679025600,
//       "QuotationLot": 50,
//       "TradedQty": 780350,
//       "OpenInterest": 12205500,
//       "Open": 17168,
//       "High": 17172.6,
//       "Low": 17108.3,
//       "Close": 17108.3
//     },
//     {
//       "LastTradeTime": 1679023800,
//       "QuotationLot": 50,
//       "TradedQty": 1575900,
//       "OpenInterest": 12126300,
//       "Open": 17165,
//       "High": 17203.25,
//       "Low": 17141.9,
//       "Close": 17163
//     },
//     {
//       "LastTradeTime": 1678960800,
//       "QuotationLot": 50,
//       "TradedQty": 250,
//       "OpenInterest": 12883800,
//       "Open": 17070.35,
//       "High": 17070.35,
//       "Low": 17070.35,
//       "Close": 17070.35
//     },
//     {
//       "LastTradeTime": 1678959000,
//       "QuotationLot": 50,
//       "TradedQty": 1074200,
//       "OpenInterest": 12883800,
//       "Open": 17045.25,
//       "High": 17075.45,
//       "Low": 17012.25,
//       "Close": 17070.35
//     },
//     {
//       "LastTradeTime": 1678957200,
//       "QuotationLot": 50,
//       "TradedQty": 1075800,
//       "OpenInterest": 12810250,
//       "Open": 17118.3,
//       "High": 17123,
//       "Low": 17030,
//       "Close": 17044.95
//     },
//     {
//       "LastTradeTime": 1678955400,
//       "QuotationLot": 50,
//       "TradedQty": 1090750,
//       "OpenInterest": 12769850,
//       "Open": 17019.3,
//       "High": 17130,
//       "Low": 17019.3,
//       "Close": 17120
//     },
//     {
//       "LastTradeTime": 1678953600,
//       "QuotationLot": 50,
//       "TradedQty": 751900,
//       "OpenInterest": 12856650,
//       "Open": 17036.8,
//       "High": 17070.05,
//       "Low": 17000.1,
//       "Close": 17020.85
//     },
//     {
//       "LastTradeTime": 1678951800,
//       "QuotationLot": 50,
//       "TradedQty": 610400,
//       "OpenInterest": 12835000,
//       "Open": 17013.55,
//       "High": 17050,
//       "Low": 17005,
//       "Close": 17037.5
//     },
//     {
//       "LastTradeTime": 1678950000,
//       "QuotationLot": 50,
//       "TradedQty": 377250,
//       "OpenInterest": 12803050,
//       "Open": 16991.65,
//       "High": 17019.8,
//       "Low": 16975.15,
//       "Close": 17014.7
//     },
//     {
//       "LastTradeTime": 1678948200,
//       "QuotationLot": 50,
//       "TradedQty": 619450,
//       "OpenInterest": 12737500,
//       "Open": 17030,
//       "High": 17043.65,
//       "Low": 16977.3,
//       "Close": 16990.15
//     },
//     {
//       "LastTradeTime": 1678946400,
//       "QuotationLot": 50,
//       "TradedQty": 660900,
//       "OpenInterest": 12708100,
//       "Open": 17086.05,
//       "High": 17090,
//       "Low": 17021.2,
//       "Close": 17030
//     },
//     {
//       "LastTradeTime": 1678944600,
//       "QuotationLot": 50,
//       "TradedQty": 737400,
//       "OpenInterest": 12736200,
//       "Open": 17080.95,
//       "High": 17115,
//       "Low": 17064.55,
//       "Close": 17083.4
//     },
//     {
//       "LastTradeTime": 1678942800,
//       "QuotationLot": 50,
//       "TradedQty": 1073550,
//       "OpenInterest": 12756200,
//       "Open": 17010.4,
//       "High": 17097.65,
//       "Low": 16992.05,
//       "Close": 17080
//     },
//     {
//       "LastTradeTime": 1678941000,
//       "QuotationLot": 50,
//       "TradedQty": 1102300,
//       "OpenInterest": 12841150,
//       "Open": 16952,
//       "High": 17030,
//       "Low": 16922.3,
//       "Close": 17011.35
//     },
//     {
//       "LastTradeTime": 1678939200,
//       "QuotationLot": 50,
//       "TradedQty": 1269900,
//       "OpenInterest": 12760800,
//       "Open": 16977.2,
//       "High": 16983.45,
//       "Low": 16918.5,
//       "Close": 16953.65
//     },
//     {
//       "LastTradeTime": 1678937400,
//       "QuotationLot": 50,
//       "TradedQty": 1093050,
//       "OpenInterest": 12562100,
//       "Open": 17019.9,
//       "High": 17039.25,
//       "Low": 16970.1,
//       "Close": 16979.8
//     },
//     {
//       "LastTradeTime": 1678874400,
//       "QuotationLot": 50,
//       "TradedQty": 0,
//       "OpenInterest": 12872650,
//       "Open": 17027.55,
//       "High": 17027.55,
//       "Low": 17027.55,
//       "Close": 17027.55
//     },
//     {
//       "LastTradeTime": 1678872600,
//       "QuotationLot": 50,
//       "TradedQty": 1508850,
//       "OpenInterest": 12872650,
//       "Open": 17078.35,
//       "High": 17085,
//       "Low": 17010.9,
//       "Close": 17027.55
//     },
//     {
//       "LastTradeTime": 1678870800,
//       "QuotationLot": 50,
//       "TradedQty": 687450,
//       "OpenInterest": 12771100,
//       "Open": 17097.75,
//       "High": 17118,
//       "Low": 17061.1,
//       "Close": 17078.75
//     },
//     {
//       "LastTradeTime": 1678869000,
//       "QuotationLot": 50,
//       "TradedQty": 379800,
//       "OpenInterest": 12806550,
//       "Open": 17096.15,
//       "High": 17129.6,
//       "Low": 17094,
//       "Close": 17095.25
//     },
//     {
//       "LastTradeTime": 1678867200,
//       "QuotationLot": 50,
//       "TradedQty": 549300,
//       "OpenInterest": 12714600,
//       "Open": 17122,
//       "High": 17149.85,
//       "Low": 17091.65,
//       "Close": 17097.45
//     },
//     {
//       "LastTradeTime": 1678865400,
//       "QuotationLot": 50,
//       "TradedQty": 518600,
//       "OpenInterest": 12610350,
//       "Open": 17131.45,
//       "High": 17141.1,
//       "Low": 17105,
//       "Close": 17123.55
//     },
//     {
//       "LastTradeTime": 1678863600,
//       "QuotationLot": 50,
//       "TradedQty": 481300,
//       "OpenInterest": 12543300,
//       "Open": 17159.35,
//       "High": 17176.6,
//       "Low": 17131.5,
//       "Close": 17132.85
//     },
//     {
//       "LastTradeTime": 1678861800,
//       "QuotationLot": 50,
//       "TradedQty": 371150,
//       "OpenInterest": 12515900,
//       "Open": 17190.95,
//       "High": 17191.05,
//       "Low": 17151.1,
//       "Close": 17159.75
//     },
//     {
//       "LastTradeTime": 1678860000,
//       "QuotationLot": 50,
//       "TradedQty": 419000,
//       "OpenInterest": 12444900,
//       "Open": 17209.25,
//       "High": 17223.9,
//       "Low": 17188,
//       "Close": 17190.95
//     },
//     {
//       "LastTradeTime": 1678858200,
//       "QuotationLot": 50,
//       "TradedQty": 1250600,
//       "OpenInterest": 12389250,
//       "Open": 17169.9,
//       "High": 17209.8,
//       "Low": 17150.6,
//       "Close": 17207
//     },
//     {
//       "LastTradeTime": 1678856400,
//       "QuotationLot": 50,
//       "TradedQty": 477950,
//       "OpenInterest": 12354750,
//       "Open": 17210,
//       "High": 17213,
//       "Low": 17161.3,
//       "Close": 17169.9
//     },
//     {
//       "LastTradeTime": 1678854600,
//       "QuotationLot": 50,
//       "TradedQty": 435150,
//       "OpenInterest": 12264800,
//       "Open": 17197.1,
//       "High": 17225.8,
//       "Low": 17185,
//       "Close": 17210
//     },
//     {
//       "LastTradeTime": 1678852800,
//       "QuotationLot": 50,
//       "TradedQty": 817000,
//       "OpenInterest": 12177800,
//       "Open": 17243.15,
//       "High": 17251.2,
//       "Low": 17180.5,
//       "Close": 17198.95
//     },
//     {
//       "LastTradeTime": 1678851000,
//       "QuotationLot": 50,
//       "TradedQty": 1341600,
//       "OpenInterest": 12142150,
//       "Open": 17224.95,
//       "High": 17263.4,
//       "Low": 17203,
//       "Close": 17242.95
//     },
//     {
//       "LastTradeTime": 1678788000,
//       "QuotationLot": 50,
//       "TradedQty": 1200,
//       "OpenInterest": 12869800,
//       "Open": 17140,
//       "High": 17140,
//       "Low": 17140,
//       "Close": 17140
//     },
//     {
//       "LastTradeTime": 1678786200,
//       "QuotationLot": 50,
//       "TradedQty": 1300800,
//       "OpenInterest": 12869800,
//       "Open": 17133.8,
//       "High": 17149.55,
//       "Low": 17091,
//       "Close": 17144
//     },
//     {
//       "LastTradeTime": 1678784400,
//       "QuotationLot": 50,
//       "TradedQty": 774100,
//       "OpenInterest": 12788400,
//       "Open": 17154.45,
//       "High": 17154.45,
//       "Low": 17102.75,
//       "Close": 17133.85
//     },
//     {
//       "LastTradeTime": 1678782600,
//       "QuotationLot": 50,
//       "TradedQty": 834150,
//       "OpenInterest": 12678100,
//       "Open": 17103.6,
//       "High": 17162,
//       "Low": 17071.1,
//       "Close": 17154.7
//     },
//     {
//       "LastTradeTime": 1678780800,
//       "QuotationLot": 50,
//       "TradedQty": 670700,
//       "OpenInterest": 12571850,
//       "Open": 17120.05,
//       "High": 17144.7,
//       "Low": 17076,
//       "Close": 17104
//     },
//     {
//       "LastTradeTime": 1678779000,
//       "QuotationLot": 50,
//       "TradedQty": 1123450,
//       "OpenInterest": 12521150,
//       "Open": 17121.55,
//       "High": 17137.95,
//       "Low": 17079.8,
//       "Close": 17120.7
//     },
//     {
//       "LastTradeTime": 1678777200,
//       "QuotationLot": 50,
//       "TradedQty": 1626450,
//       "OpenInterest": 12577950,
//       "Open": 17222.7,
//       "High": 17265.15,
//       "Low": 17113.3,
//       "Close": 17125.5
//     },
//     {
//       "LastTradeTime": 1678775400,
//       "QuotationLot": 50,
//       "TradedQty": 1637650,
//       "OpenInterest": 12726600,
//       "Open": 17115.8,
//       "High": 17231.45,
//       "Low": 17105.4,
//       "Close": 17222.15
//     },
//     {
//       "LastTradeTime": 1678773600,
//       "QuotationLot": 50,
//       "TradedQty": 644400,
//       "OpenInterest": 12372400,
//       "Open": 17128.5,
//       "High": 17153.6,
//       "Low": 17105.55,
//       "Close": 17115.85
//     },
//     {
//       "LastTradeTime": 1678771800,
//       "QuotationLot": 50,
//       "TradedQty": 574500,
//       "OpenInterest": 12165650,
//       "Open": 17138.55,
//       "High": 17139.2,
//       "Low": 17105,
//       "Close": 17125.8
//     },
//     {
//       "LastTradeTime": 1678770000,
//       "QuotationLot": 50,
//       "TradedQty": 611650,
//       "OpenInterest": 12051550,
//       "Open": 17148.3,
//       "High": 17188,
//       "Low": 17127,
//       "Close": 17139.5
//     },
//     {
//       "LastTradeTime": 1678768200,
//       "QuotationLot": 50,
//       "TradedQty": 939000,
//       "OpenInterest": 12054350,
//       "Open": 17242.8,
//       "High": 17247.55,
//       "Low": 17130,
//       "Close": 17147.6
//     },
//     {
//       "LastTradeTime": 1678766400,
//       "QuotationLot": 50,
//       "TradedQty": 1300250,
//       "OpenInterest": 11814500,
//       "Open": 17238.95,
//       "High": 17278,
//       "Low": 17196.95,
//       "Close": 17243.8
//     },
//     {
//       "LastTradeTime": 1678764600,
//       "QuotationLot": 50,
//       "TradedQty": 1274350,
//       "OpenInterest": 11623300,
//       "Open": 17190,
//       "High": 17249,
//       "Low": 17160.05,
//       "Close": 17237.95
//     },
//     {
//       "LastTradeTime": 1678701600,
//       "QuotationLot": 50,
//       "TradedQty": 0,
//       "OpenInterest": 12184850,
//       "Open": 17220,
//       "High": 17220,
//       "Low": 17220,
//       "Close": 17220
//     },
//     {
//       "LastTradeTime": 1678699800,
//       "QuotationLot": 50,
//       "TradedQty": 1806100,
//       "OpenInterest": 12184850,
//       "Open": 17190.85,
//       "High": 17241.05,
//       "Low": 17159.05,
//       "Close": 17220
//     },
//     {
//       "LastTradeTime": 1678698000,
//       "QuotationLot": 50,
//       "TradedQty": 1285100,
//       "OpenInterest": 12624750,
//       "Open": 17220.05,
//       "High": 17225,
//       "Low": 17162.65,
//       "Close": 17190
//     },
//     {
//       "LastTradeTime": 1678696200,
//       "QuotationLot": 50,
//       "TradedQty": 1892850,
//       "OpenInterest": 12699950,
//       "Open": 17266.9,
//       "High": 17285,
//       "Low": 17202.45,
//       "Close": 17220.3
//     },
//     {
//       "LastTradeTime": 1678694400,
//       "QuotationLot": 50,
//       "TradedQty": 983750,
//       "OpenInterest": 12562600,
//       "Open": 17315.45,
//       "High": 17320,
//       "Low": 17260.6,
//       "Close": 17266.95
//     },
//     {
//       "LastTradeTime": 1678692600,
//       "QuotationLot": 50,
//       "TradedQty": 537200,
//       "OpenInterest": 12385300,
//       "Open": 17307,
//       "High": 17346.7,
//       "Low": 17306,
//       "Close": 17315.45
//     },
//     {
//       "LastTradeTime": 1678690800,
//       "QuotationLot": 50,
//       "TradedQty": 1489800,
//       "OpenInterest": 12134100,
//       "Open": 17384,
//       "High": 17384.4,
//       "Low": 17304.55,
//       "Close": 17307
//     },
//     {
//       "LastTradeTime": 1678689000,
//       "QuotationLot": 50,
//       "TradedQty": 672200,
//       "OpenInterest": 11918050,
//       "Open": 17405.45,
//       "High": 17409,
//       "Low": 17370.2,
//       "Close": 17381.35
//     },
//     {
//       "LastTradeTime": 1678687200,
//       "QuotationLot": 50,
//       "TradedQty": 640800,
//       "OpenInterest": 11732900,
//       "Open": 17428.7,
//       "High": 17432.15,
//       "Low": 17380.1,
//       "Close": 17404.75
//     },
//     {
//       "LastTradeTime": 1678685400,
//       "QuotationLot": 50,
//       "TradedQty": 669450,
//       "OpenInterest": 11713450,
//       "Open": 17474,
//       "High": 17474,
//       "Low": 17420,
//       "Close": 17428.7
//     },
//     {
//       "LastTradeTime": 1678683600,
//       "QuotationLot": 50,
//       "TradedQty": 440700,
//       "OpenInterest": 11701900,
//       "Open": 17474,
//       "High": 17492.95,
//       "Low": 17455.1,
//       "Close": 17474
//     },
//     {
//       "LastTradeTime": 1678681800,
//       "QuotationLot": 50,
//       "TradedQty": 347400,
//       "OpenInterest": 11658350,
//       "Open": 17493.05,
//       "High": 17518,
//       "Low": 17473.6,
//       "Close": 17473.6
//     },
//     {
//       "LastTradeTime": 1678680000,
//       "QuotationLot": 50,
//       "TradedQty": 1291450,
//       "OpenInterest": 11661650,
//       "Open": 17544.2,
//       "High": 17573.95,
//       "Low": 17471,
//       "Close": 17493.05
//     },
//     {
//       "LastTradeTime": 1678678200,
//       "QuotationLot": 50,
//       "TradedQty": 1587550,
//       "OpenInterest": 11499550,
//       "Open": 17460,
//       "High": 17568.5,
//       "Low": 17438.4,
//       "Close": 17544.15
//     },
//     {
//       "LastTradeTime": 1678442400,
//       "QuotationLot": 50,
//       "TradedQty": 100,
//       "OpenInterest": 11785100,
//       "Open": 17449.5,
//       "High": 17449.5,
//       "Low": 17449.5,
//       "Close": 17449.5
//     },
//     {
//       "LastTradeTime": 1678440600,
//       "QuotationLot": 50,
//       "TradedQty": 1185250,
//       "OpenInterest": 11785100,
//       "Open": 17422.3,
//       "High": 17467.65,
//       "Low": 17422.3,
//       "Close": 17453.95
//     },
//     {
//       "LastTradeTime": 1678438800,
//       "QuotationLot": 50,
//       "TradedQty": 513050,
//       "OpenInterest": 11800000,
//       "Open": 17416.85,
//       "High": 17434.5,
//       "Low": 17406,
//       "Close": 17422
//     },
//     {
//       "LastTradeTime": 1678437000,
//       "QuotationLot": 50,
//       "TradedQty": 295450,
//       "OpenInterest": 11769250,
//       "Open": 17436,
//       "High": 17448.95,
//       "Low": 17412.15,
//       "Close": 17416
//     },
//     {
//       "LastTradeTime": 1678435200,
//       "QuotationLot": 50,
//       "TradedQty": 477300,
//       "OpenInterest": 11769500,
//       "Open": 17444.05,
//       "High": 17447.9,
//       "Low": 17411.2,
//       "Close": 17436
//     },
//     {
//       "LastTradeTime": 1678433400,
//       "QuotationLot": 50,
//       "TradedQty": 417700,
//       "OpenInterest": 11731700,
//       "Open": 17456.95,
//       "High": 17476.7,
//       "Low": 17438,
//       "Close": 17443.4
//     },
//     {
//       "LastTradeTime": 1678431600,
//       "QuotationLot": 50,
//       "TradedQty": 297250,
//       "OpenInterest": 11676650,
//       "Open": 17419,
//       "High": 17458.45,
//       "Low": 17415,
//       "Close": 17458.45
//     },
//     {
//       "LastTradeTime": 1678429800,
//       "QuotationLot": 50,
//       "TradedQty": 414450,
//       "OpenInterest": 11645550,
//       "Open": 17452.1,
//       "High": 17457.65,
//       "Low": 17414.05,
//       "Close": 17419.05
//     },
//     {
//       "LastTradeTime": 1678428000,
//       "QuotationLot": 50,
//       "TradedQty": 297350,
//       "OpenInterest": 11631400,
//       "Open": 17470.1,
//       "High": 17475.5,
//       "Low": 17444.65,
//       "Close": 17452.5
//     },
//     {
//       "LastTradeTime": 1678426200,
//       "QuotationLot": 50,
//       "TradedQty": 558050,
//       "OpenInterest": 11633300,
//       "Open": 17451.55,
//       "High": 17480.45,
//       "Low": 17433.6,
//       "Close": 17470.35
//     },
//     {
//       "LastTradeTime": 1678424400,
//       "QuotationLot": 50,
//       "TradedQty": 402350,
//       "OpenInterest": 11772550,
//       "Open": 17444.95,
//       "High": 17464.8,
//       "Low": 17437,
//       "Close": 17452
//     },
//     {
//       "LastTradeTime": 1678422600,
//       "QuotationLot": 50,
//       "TradedQty": 1040750,
//       "OpenInterest": 11678250,
//       "Open": 17415.75,
//       "High": 17465,
//       "Low": 17410.25,
//       "Close": 17443.95
//     },
//     {
//       "LastTradeTime": 1678420800,
//       "QuotationLot": 50,
//       "TradedQty": 1356650,
//       "OpenInterest": 11551650,
//       "Open": 17439.95,
//       "High": 17439.95,
//       "Low": 17367,
//       "Close": 17416.65
//     },
//     {
//       "LastTradeTime": 1678419000,
//       "QuotationLot": 50,
//       "TradedQty": 1767700,
//       "OpenInterest": 11369100,
//       "Open": 17489.8,
//       "High": 17489.9,
//       "Low": 17421.05,
//       "Close": 17442.1
//     },
//     {
//       "LastTradeTime": 1678356000,
//       "QuotationLot": 50,
//       "TradedQty": 2750,
//       "OpenInterest": 11386900,
//       "Open": 17638.2,
//       "High": 17638.2,
//       "Low": 17638.2,
//       "Close": 17638.2
//     },
//     {
//       "LastTradeTime": 1678354200,
//       "QuotationLot": 50,
//       "TradedQty": 1352100,
//       "OpenInterest": 11386900,
//       "Open": 17660,
//       "High": 17668.4,
//       "Low": 17635,
//       "Close": 17639
//     },
//     {
//       "LastTradeTime": 1678352400,
//       "QuotationLot": 50,
//       "TradedQty": 664800,
//       "OpenInterest": 11217950,
//       "Open": 17668,
//       "High": 17670.45,
//       "Low": 17646.05,
//       "Close": 17661
//     },
//     {
//       "LastTradeTime": 1678350600,
//       "QuotationLot": 50,
//       "TradedQty": 383400,
//       "OpenInterest": 11045000,
//       "Open": 17659,
//       "High": 17678.95,
//       "Low": 17656,
//       "Close": 17668
//     },
//     {
//       "LastTradeTime": 1678348800,
//       "QuotationLot": 50,
//       "TradedQty": 578400,
//       "OpenInterest": 10934900,
//       "Open": 17702.1,
//       "High": 17702.25,
//       "Low": 17655.85,
//       "Close": 17659
//     },
//     {
//       "LastTradeTime": 1678347000,
//       "QuotationLot": 50,
//       "TradedQty": 253900,
//       "OpenInterest": 10914900,
//       "Open": 17706.15,
//       "High": 17710.05,
//       "Low": 17686,
//       "Close": 17702.1
//     },
//     {
//       "LastTradeTime": 1678345200,
//       "QuotationLot": 50,
//       "TradedQty": 584700,
//       "OpenInterest": 10875300,
//       "Open": 17706.85,
//       "High": 17708.75,
//       "Low": 17680.05,
//       "Close": 17706.15
//     },
//     {
//       "LastTradeTime": 1678343400,
//       "QuotationLot": 50,
//       "TradedQty": 459050,
//       "OpenInterest": 10779100,
//       "Open": 17743.65,
//       "High": 17744.75,
//       "Low": 17702.3,
//       "Close": 17706.65
//     },
//     {
//       "LastTradeTime": 1678341600,
//       "QuotationLot": 50,
//       "TradedQty": 246250,
//       "OpenInterest": 10733500,
//       "Open": 17764,
//       "High": 17770,
//       "Low": 17740.3,
//       "Close": 17743.65
//     },
//     {
//       "LastTradeTime": 1678339800,
//       "QuotationLot": 50,
//       "TradedQty": 384400,
//       "OpenInterest": 10757050,
//       "Open": 17733.8,
//       "High": 17768,
//       "Low": 17731.95,
//       "Close": 17764.95
//     },
//     {
//       "LastTradeTime": 1678338000,
//       "QuotationLot": 50,
//       "TradedQty": 243100,
//       "OpenInterest": 10805050,
//       "Open": 17733.4,
//       "High": 17734.65,
//       "Low": 17718.65,
//       "Close": 17732
//     },
//     {
//       "LastTradeTime": 1678336200,
//       "QuotationLot": 50,
//       "TradedQty": 772050,
//       "OpenInterest": 10769950,
//       "Open": 17726.2,
//       "High": 17734.75,
//       "Low": 17700,
//       "Close": 17733.4
//     },
//     {
//       "LastTradeTime": 1678334400,
//       "QuotationLot": 50,
//       "TradedQty": 848700,
//       "OpenInterest": 10527600,
//       "Open": 17772,
//       "High": 17772,
//       "Low": 17726.2,
//       "Close": 17728
//     },
//     {
//       "LastTradeTime": 1678332600,
//       "QuotationLot": 50,
//       "TradedQty": 724000,
//       "OpenInterest": 10280150,
//       "Open": 17789.95,
//       "High": 17818.9,
//       "Low": 17761,
//       "Close": 17772.3
//     },
//     {
//       "LastTradeTime": 1678269600,
//       "QuotationLot": 50,
//       "TradedQty": 150,
//       "OpenInterest": 10602900,
//       "Open": 17798.7,
//       "High": 17798.7,
//       "Low": 17798.7,
//       "Close": 17798.7
//     },
//     {
//       "LastTradeTime": 1678267800,
//       "QuotationLot": 50,
//       "TradedQty": 1298450,
//       "OpenInterest": 10602900,
//       "Open": 17763.3,
//       "High": 17805.75,
//       "Low": 17762.9,
//       "Close": 17795
//     },
//     {
//       "LastTradeTime": 1678266000,
//       "QuotationLot": 50,
//       "TradedQty": 369750,
//       "OpenInterest": 10505550,
//       "Open": 17769.95,
//       "High": 17778,
//       "Low": 17745.75,
//       "Close": 17763.15
//     },
//     {
//       "LastTradeTime": 1678264200,
//       "QuotationLot": 50,
//       "TradedQty": 483300,
//       "OpenInterest": 10503600,
//       "Open": 17758.05,
//       "High": 17774.8,
//       "Low": 17755.3,
//       "Close": 17768.85
//     },
//     {
//       "LastTradeTime": 1678262400,
//       "QuotationLot": 50,
//       "TradedQty": 267250,
//       "OpenInterest": 10436850,
//       "Open": 17732.05,
//       "High": 17758.75,
//       "Low": 17732,
//       "Close": 17757.3
//     },
//     {
//       "LastTradeTime": 1678260600,
//       "QuotationLot": 50,
//       "TradedQty": 244900,
//       "OpenInterest": 10402100,
//       "Open": 17726.45,
//       "High": 17744.95,
//       "Low": 17720.05,
//       "Close": 17732
//     },
//     {
//       "LastTradeTime": 1678258800,
//       "QuotationLot": 50,
//       "TradedQty": 260700,
//       "OpenInterest": 10375650,
//       "Open": 17709,
//       "High": 17729.95,
//       "Low": 17707.05,
//       "Close": 17726.45
//     },
//     {
//       "LastTradeTime": 1678257000,
//       "QuotationLot": 50,
//       "TradedQty": 259000,
//       "OpenInterest": 10304300,
//       "Open": 17702,
//       "High": 17717.5,
//       "Low": 17695.6,
//       "Close": 17706
//     },
//     {
//       "LastTradeTime": 1678255200,
//       "QuotationLot": 50,
//       "TradedQty": 360750,
//       "OpenInterest": 10268600,
//       "Open": 17734.5,
//       "High": 17746.6,
//       "Low": 17697.5,
//       "Close": 17702
//     },
//     {
//       "LastTradeTime": 1678253400,
//       "QuotationLot": 50,
//       "TradedQty": 364800,
//       "OpenInterest": 10279050,
//       "Open": 17750,
//       "High": 17750.25,
//       "Low": 17721.95,
//       "Close": 17733
//     },
//     {
//       "LastTradeTime": 1678251600,
//       "QuotationLot": 50,
//       "TradedQty": 242450,
//       "OpenInterest": 10295300,
//       "Open": 17748.1,
//       "High": 17763.45,
//       "Low": 17742.15,
//       "Close": 17750.05
//     },
//     {
//       "LastTradeTime": 1678249800,
//       "QuotationLot": 50,
//       "TradedQty": 605100,
//       "OpenInterest": 10293300,
//       "Open": 17738.8,
//       "High": 17766,
//       "Low": 17728.25,
//       "Close": 17750
//     },
//     {
//       "LastTradeTime": 1678248000,
//       "QuotationLot": 50,
//       "TradedQty": 1215200,
//       "OpenInterest": 10212900,
//       "Open": 17678.05,
//       "High": 17745,
//       "Low": 17661.15,
//       "Close": 17738.8
//     },
//     {
//       "LastTradeTime": 1678246200,
//       "QuotationLot": 50,
//       "TradedQty": 1290350,
//       "OpenInterest": 10049700,
//       "Open": 17715.1,
//       "High": 17719.8,
//       "Low": 17654,
//       "Close": 17678.05
//     },
//     {
//       "LastTradeTime": 1678096800,
//       "QuotationLot": 50,
//       "TradedQty": 50,
//       "OpenInterest": 10302000,
//       "Open": 17779,
//       "High": 17779,
//       "Low": 17779,
//       "Close": 17779
//     },
//     {
//       "LastTradeTime": 1678095000,
//       "QuotationLot": 50,
//       "TradedQty": 727100,
//       "OpenInterest": 10302000,
//       "Open": 17777.05,
//       "High": 17785,
//       "Low": 17761.05,
//       "Close": 17776.2
//     },
//     {
//       "LastTradeTime": 1678093200,
//       "QuotationLot": 50,
//       "TradedQty": 391000,
//       "OpenInterest": 10272150,
//       "Open": 17803,
//       "High": 17804.8,
//       "Low": 17763,
//       "Close": 17777.2
//     },
//     {
//       "LastTradeTime": 1678091400,
//       "QuotationLot": 50,
//       "TradedQty": 360050,
//       "OpenInterest": 10302000,
//       "Open": 17792.2,
//       "High": 17811,
//       "Low": 17773.55,
//       "Close": 17804.25
//     },
//     {
//       "LastTradeTime": 1678089600,
//       "QuotationLot": 50,
//       "TradedQty": 561650,
//       "OpenInterest": 10276700,
//       "Open": 17817.05,
//       "High": 17817.05,
//       "Low": 17776.6,
//       "Close": 17791.85
//     },
//     {
//       "LastTradeTime": 1678087800,
//       "QuotationLot": 50,
//       "TradedQty": 190400,
//       "OpenInterest": 10364800,
//       "Open": 17818,
//       "High": 17836.1,
//       "Low": 17811.1,
//       "Close": 17817
//     },
//     {
//       "LastTradeTime": 1678086000,
//       "QuotationLot": 50,
//       "TradedQty": 423450,
//       "OpenInterest": 10348600,
//       "Open": 17824.05,
//       "High": 17833.5,
//       "Low": 17801.05,
//       "Close": 17817.35
//     },
//     {
//       "LastTradeTime": 1678084200,
//       "QuotationLot": 50,
//       "TradedQty": 354350,
//       "OpenInterest": 10626300,
//       "Open": 17844,
//       "High": 17845.05,
//       "Low": 17820.2,
//       "Close": 17824
//     },
//     {
//       "LastTradeTime": 1678082400,
//       "QuotationLot": 50,
//       "TradedQty": 322500,
//       "OpenInterest": 10521650,
//       "Open": 17822.2,
//       "High": 17846.85,
//       "Low": 17821.7,
//       "Close": 17842
//     },
//     {
//       "LastTradeTime": 1678080600,
//       "QuotationLot": 50,
//       "TradedQty": 495050,
//       "OpenInterest": 10438300,
//       "Open": 17841.1,
//       "High": 17849.85,
//       "Low": 17811,
//       "Close": 17823
//     },
//     {
//       "LastTradeTime": 1678078800,
//       "QuotationLot": 50,
//       "TradedQty": 354850,
//       "OpenInterest": 10529700,
//       "Open": 17843,
//       "High": 17863.9,
//       "Low": 17840,
//       "Close": 17841.1
//     },
//     {
//       "LastTradeTime": 1678077000,
//       "QuotationLot": 50,
//       "TradedQty": 754250,
//       "OpenInterest": 10503900,
//       "Open": 17830.75,
//       "High": 17853.85,
//       "Low": 17820.5,
//       "Close": 17841.7
//     },
//     {
//       "LastTradeTime": 1678075200,
//       "QuotationLot": 50,
//       "TradedQty": 691650,
//       "OpenInterest": 10468300,
//       "Open": 17819.35,
//       "High": 17840,
//       "Low": 17806.25,
//       "Close": 17830.65
//     },
//     {
//       "LastTradeTime": 1678073400,
//       "QuotationLot": 50,
//       "TradedQty": 1269550,
//       "OpenInterest": 10528400,
//       "Open": 17730,
//       "High": 17825,
//       "Low": 17724,
//       "Close": 17818.8
//     },
//     {
//       "LastTradeTime": 1677837600,
//       "QuotationLot": 50,
//       "TradedQty": 650,
//       "OpenInterest": 11374600,
//       "Open": 17661.45,
//       "High": 17661.45,
//       "Low": 17661.45,
//       "Close": 17661.45
//     },
//     {
//       "LastTradeTime": 1677835800,
//       "QuotationLot": 50,
//       "TradedQty": 1475650,
//       "OpenInterest": 11374600,
//       "Open": 17693.1,
//       "High": 17693.25,
//       "Low": 17660,
//       "Close": 17661.4
//     },
//     {
//       "LastTradeTime": 1677834000,
//       "QuotationLot": 50,
//       "TradedQty": 2121550,
//       "OpenInterest": 12074400,
//       "Open": 17698.4,
//       "High": 17725.05,
//       "Low": 17685.1,
//       "Close": 17696.45
//     },
//     {
//       "LastTradeTime": 1677832200,
//       "QuotationLot": 50,
//       "TradedQty": 634950,
//       "OpenInterest": 11492750,
//       "Open": 17665.55,
//       "High": 17703,
//       "Low": 17665,
//       "Close": 17697.85
//     },
//     {
//       "LastTradeTime": 1677830400,
//       "QuotationLot": 50,
//       "TradedQty": 623450,
//       "OpenInterest": 11459600,
//       "Open": 17639,
//       "High": 17675.95,
//       "Low": 17638.55,
//       "Close": 17665.55
//     },
//     {
//       "LastTradeTime": 1677828600,
//       "QuotationLot": 50,
//       "TradedQty": 240000,
//       "OpenInterest": 11403950,
//       "Open": 17627.6,
//       "High": 17645.9,
//       "Low": 17624,
//       "Close": 17639
//     },
//     {
//       "LastTradeTime": 1677826800,
//       "QuotationLot": 50,
//       "TradedQty": 346900,
//       "OpenInterest": 11395050,
//       "Open": 17632.3,
//       "High": 17634.4,
//       "Low": 17607,
//       "Close": 17629
//     },
//     {
//       "LastTradeTime": 1677825000,
//       "QuotationLot": 50,
//       "TradedQty": 228400,
//       "OpenInterest": 11364450,
//       "Open": 17640,
//       "High": 17648.5,
//       "Low": 17629.1,
//       "Close": 17629.6
//     },
//     {
//       "LastTradeTime": 1677823200,
//       "QuotationLot": 50,
//       "TradedQty": 349750,
//       "OpenInterest": 11372950,
//       "Open": 17635.25,
//       "High": 17649,
//       "Low": 17633,
//       "Close": 17640.45
//     },
//     {
//       "LastTradeTime": 1677821400,
//       "QuotationLot": 50,
//       "TradedQty": 438750,
//       "OpenInterest": 11434650,
//       "Open": 17618.45,
//       "High": 17640,
//       "Low": 17606.6,
//       "Close": 17635.25
//     },
//     {
//       "LastTradeTime": 1677819600,
//       "QuotationLot": 50,
//       "TradedQty": 643550,
//       "OpenInterest": 11509150,
//       "Open": 17601.85,
//       "High": 17627.8,
//       "Low": 17595.25,
//       "Close": 17618.3
//     },
//     {
//       "LastTradeTime": 1677817800,
//       "QuotationLot": 50,
//       "TradedQty": 985450,
//       "OpenInterest": 11514800,
//       "Open": 17561,
//       "High": 17609,
//       "Low": 17554,
//       "Close": 17600.05
//     },
//     {
//       "LastTradeTime": 1677816000,
//       "QuotationLot": 50,
//       "TradedQty": 1346250,
//       "OpenInterest": 11455250,
//       "Open": 17537.35,
//       "High": 17569.45,
//       "Low": 17531.15,
//       "Close": 17559.7
//     },
//     {
//       "LastTradeTime": 1677814200,
//       "QuotationLot": 50,
//       "TradedQty": 1582800,
//       "OpenInterest": 11615650,
//       "Open": 17490.2,
//       "High": 17548,
//       "Low": 17475,
//       "Close": 17538.4
//     },
//     {
//       "LastTradeTime": 1677751200,
//       "QuotationLot": 50,
//       "TradedQty": 300,
//       "OpenInterest": 12304150,
//       "Open": 17388,
//       "High": 17388,
//       "Low": 17388,
//       "Close": 17388
//     },
//     {
//       "LastTradeTime": 1677749400,
//       "QuotationLot": 50,
//       "TradedQty": 882100,
//       "OpenInterest": 12304150,
//       "Open": 17419,
//       "High": 17424.25,
//       "Low": 17385,
//       "Close": 17389.95
//     },
//     {
//       "LastTradeTime": 1677747600,
//       "QuotationLot": 50,
//       "TradedQty": 1589200,
//       "OpenInterest": 12487750,
//       "Open": 17420,
//       "High": 17426.7,
//       "Low": 17389.95,
//       "Close": 17415.9
//     },
//     {
//       "LastTradeTime": 1677745800,
//       "QuotationLot": 50,
//       "TradedQty": 879550,
//       "OpenInterest": 12397000,
//       "Open": 17394.05,
//       "High": 17427,
//       "Low": 17380,
//       "Close": 17419.3
//     },
//     {
//       "LastTradeTime": 1677744000,
//       "QuotationLot": 50,
//       "TradedQty": 910300,
//       "OpenInterest": 12378750,
//       "Open": 17428.5,
//       "High": 17429.2,
//       "Low": 17382.3,
//       "Close": 17394.05
//     },
//     {
//       "LastTradeTime": 1677742200,
//       "QuotationLot": 50,
//       "TradedQty": 504800,
//       "OpenInterest": 12224700,
//       "Open": 17448.7,
//       "High": 17457.65,
//       "Low": 17425.25,
//       "Close": 17429
//     },
//     {
//       "LastTradeTime": 1677740400,
//       "QuotationLot": 50,
//       "TradedQty": 218100,
//       "OpenInterest": 12223950,
//       "Open": 17456,
//       "High": 17463.6,
//       "Low": 17448,
//       "Close": 17448.7
//     },
//     {
//       "LastTradeTime": 1677738600,
//       "QuotationLot": 50,
//       "TradedQty": 835400,
//       "OpenInterest": 12213200,
//       "Open": 17462.6,
//       "High": 17480,
//       "Low": 17444.1,
//       "Close": 17456
//     },
//     {
//       "LastTradeTime": 1677736800,
//       "QuotationLot": 50,
//       "TradedQty": 150050,
//       "OpenInterest": 11918550,
//       "Open": 17450.6,
//       "High": 17463,
//       "Low": 17447.6,
//       "Close": 17460.55
//     },
//     {
//       "LastTradeTime": 1677735000,
//       "QuotationLot": 50,
//       "TradedQty": 192650,
//       "OpenInterest": 11897800,
//       "Open": 17444.1,
//       "High": 17456,
//       "Low": 17437.85,
//       "Close": 17450.6
//     },
//     {
//       "LastTradeTime": 1677733200,
//       "QuotationLot": 50,
//       "TradedQty": 406750,
//       "OpenInterest": 11871100,
//       "Open": 17446,
//       "High": 17462.4,
//       "Low": 17436,
//       "Close": 17443.7
//     },
//     {
//       "LastTradeTime": 1677731400,
//       "QuotationLot": 50,
//       "TradedQty": 517700,
//       "OpenInterest": 11975650,
//       "Open": 17426,
//       "High": 17448,
//       "Low": 17418.55,
//       "Close": 17446.1
//     },
//     {
//       "LastTradeTime": 1677729600,
//       "QuotationLot": 50,
//       "TradedQty": 1097650,
//       "OpenInterest": 11897000,
//       "Open": 17450,
//       "High": 17469.15,
//       "Low": 17425.05,
//       "Close": 17426
//     },
//     {
//       "LastTradeTime": 1677727800,
//       "QuotationLot": 50,
//       "TradedQty": 1111950,
//       "OpenInterest": 11650150,
//       "Open": 17495,
//       "High": 17518,
//       "Low": 17447.5,
//       "Close": 17449.15
//     },
//     {
//       "LastTradeTime": 1677664800,
//       "QuotationLot": 50,
//       "TradedQty": 250,
//       "OpenInterest": 11899300,
//       "Open": 17538.95,
//       "High": 17538.95,
//       "Low": 17538.95,
//       "Close": 17538.95
//     },
//     {
//       "LastTradeTime": 1677663000,
//       "QuotationLot": 50,
//       "TradedQty": 990800,
//       "OpenInterest": 11899300,
//       "Open": 17537.55,
//       "High": 17546.25,
//       "Low": 17523.1,
//       "Close": 17537.2
//     },
//     {
//       "LastTradeTime": 1677661200,
//       "QuotationLot": 50,
//       "TradedQty": 618850,
//       "OpenInterest": 12166950,
//       "Open": 17532,
//       "High": 17550,
//       "Low": 17531.6,
//       "Close": 17537
//     },
//     {
//       "LastTradeTime": 1677659400,
//       "QuotationLot": 50,
//       "TradedQty": 358300,
//       "OpenInterest": 12133700,
//       "Open": 17506.25,
//       "High": 17533.35,
//       "Low": 17505,
//       "Close": 17530.5
//     },
//     {
//       "LastTradeTime": 1677657600,
//       "QuotationLot": 50,
//       "TradedQty": 460500,
//       "OpenInterest": 12104300,
//       "Open": 17501,
//       "High": 17526.75,
//       "Low": 17486.9,
//       "Close": 17506.35
//     },
//     {
//       "LastTradeTime": 1677655800,
//       "QuotationLot": 50,
//       "TradedQty": 159200,
//       "OpenInterest": 12058000,
//       "Open": 17503.2,
//       "High": 17506.45,
//       "Low": 17485.05,
//       "Close": 17501.05
//     },
//     {
//       "LastTradeTime": 1677654000,
//       "QuotationLot": 50,
//       "TradedQty": 173700,
//       "OpenInterest": 12047450,
//       "Open": 17495.95,
//       "High": 17510,
//       "Low": 17485,
//       "Close": 17503.2
//     },
//     {
//       "LastTradeTime": 1677652200,
//       "QuotationLot": 50,
//       "TradedQty": 316150,
//       "OpenInterest": 12015950,
//       "Open": 17503.55,
//       "High": 17509.8,
//       "Low": 17474.35,
//       "Close": 17495.95
//     },
//     {
//       "LastTradeTime": 1677650400,
//       "QuotationLot": 50,
//       "TradedQty": 317000,
//       "OpenInterest": 12018200,
//       "Open": 17506.05,
//       "High": 17520.85,
//       "Low": 17498.45,
//       "Close": 17503.55
//     },
//     {
//       "LastTradeTime": 1677648600,
//       "QuotationLot": 50,
//       "TradedQty": 409650,
//       "OpenInterest": 11969600,
//       "Open": 17496.4,
//       "High": 17511.9,
//       "Low": 17488.15,
//       "Close": 17506.05
//     },
//     {
//       "LastTradeTime": 1677646800,
//       "QuotationLot": 50,
//       "TradedQty": 428650,
//       "OpenInterest": 11913200,
//       "Open": 17496.6,
//       "High": 17510,
//       "Low": 17486.2,
//       "Close": 17496.4
//     },
//     {
//       "LastTradeTime": 1677645000,
//       "QuotationLot": 50,
//       "TradedQty": 400550,
//       "OpenInterest": 11822150,
//       "Open": 17471.95,
//       "High": 17500.05,
//       "Low": 17471.95,
//       "Close": 17496.6
//     },
//     {
//       "LastTradeTime": 1677643200,
//       "QuotationLot": 50,
//       "TradedQty": 946650,
//       "OpenInterest": 11823900,
//       "Open": 17451.4,
//       "High": 17503.9,
//       "Low": 17445,
//       "Close": 17473
//     },
//     {
//       "LastTradeTime": 1677641400,
//       "QuotationLot": 50,
//       "TradedQty": 927300,
//       "OpenInterest": 11754600,
//       "Open": 17433.05,
//       "High": 17487.65,
//       "Low": 17417.35,
//       "Close": 17450.5
//     },
//     {
//       "LastTradeTime": 1677578400,
//       "QuotationLot": 50,
//       "TradedQty": 50,
//       "OpenInterest": 12080850,
//       "Open": 17406.05,
//       "High": 17406.05,
//       "Low": 17406.05,
//       "Close": 17406.05
//     },
//     {
//       "LastTradeTime": 1677576600,
//       "QuotationLot": 50,
//       "TradedQty": 1265050,
//       "OpenInterest": 12080850,
//       "Open": 17404.85,
//       "High": 17424.95,
//       "Low": 17380,
//       "Close": 17412
//     },
//     {
//       "LastTradeTime": 1677574800,
//       "QuotationLot": 50,
//       "TradedQty": 1218650,
//       "OpenInterest": 12131550,
//       "Open": 17388.85,
//       "High": 17406.45,
//       "Low": 17354.75,
//       "Close": 17401.35
//     },
//     {
//       "LastTradeTime": 1677573000,
//       "QuotationLot": 50,
//       "TradedQty": 1303850,
//       "OpenInterest": 12115650,
//       "Open": 17407.65,
//       "High": 17409.9,
//       "Low": 17345,
//       "Close": 17388.85
//     },
//     {
//       "LastTradeTime": 1677571200,
//       "QuotationLot": 50,
//       "TradedQty": 515400,
//       "OpenInterest": 11899750,
//       "Open": 17424.1,
//       "High": 17443.45,
//       "Low": 17405.6,
//       "Close": 17407.3
//     },
//     {
//       "LastTradeTime": 1677569400,
//       "QuotationLot": 50,
//       "TradedQty": 353950,
//       "OpenInterest": 11812100,
//       "Open": 17451.3,
//       "High": 17459.5,
//       "Low": 17422,
//       "Close": 17424.65
//     },
//     {
//       "LastTradeTime": 1677567600,
//       "QuotationLot": 50,
//       "TradedQty": 913050,
//       "OpenInterest": 11609100,
//       "Open": 17482,
//       "High": 17487.9,
//       "Low": 17429.85,
//       "Close": 17451.95
//     },
//     {
//       "LastTradeTime": 1677565800,
//       "QuotationLot": 50,
//       "TradedQty": 310950,
//       "OpenInterest": 11603300,
//       "Open": 17465.45,
//       "High": 17492.05,
//       "Low": 17458.05,
//       "Close": 17482
//     },
//     {
//       "LastTradeTime": 1677564000,
//       "QuotationLot": 50,
//       "TradedQty": 398400,
//       "OpenInterest": 11557150,
//       "Open": 17448.7,
//       "High": 17473.2,
//       "Low": 17432,
//       "Close": 17465.45
//     },
//     {
//       "LastTradeTime": 1677562200,
//       "QuotationLot": 50,
//       "TradedQty": 280850,
//       "OpenInterest": 11487750,
//       "Open": 17458,
//       "High": 17466.8,
//       "Low": 17445.1,
//       "Close": 17448.7
//     },
//     {
//       "LastTradeTime": 1677560400,
//       "QuotationLot": 50,
//       "TradedQty": 599100,
//       "OpenInterest": 11464350,
//       "Open": 17499,
//       "High": 17504.4,
//       "Low": 17432,
//       "Close": 17459.25
//     },
//     {
//       "LastTradeTime": 1677558600,
//       "QuotationLot": 50,
//       "TradedQty": 534650,
//       "OpenInterest": 11402300,
//       "Open": 17497,
//       "High": 17501.25,
//       "Low": 17457.5,
//       "Close": 17500
//     },
//     {
//       "LastTradeTime": 1677556800,
//       "QuotationLot": 50,
//       "TradedQty": 693950,
//       "OpenInterest": 11330650,
//       "Open": 17500.15,
//       "High": 17534,
//       "Low": 17482.85,
//       "Close": 17496
//     },
//     {
//       "LastTradeTime": 1677555000,
//       "QuotationLot": 50,
//       "TradedQty": 722250,
//       "OpenInterest": 11253500,
//       "Open": 17493.05,
//       "High": 17524.7,
//       "Low": 17468,
//       "Close": 17498.05
//     },
//     {
//       "LastTradeTime": 1677492000,
//       "QuotationLot": 50,
//       "TradedQty": 100,
//       "OpenInterest": 11624550,
//       "Open": 17509,
//       "High": 17509,
//       "Low": 17509,
//       "Close": 17509
//     },
//     {
//       "LastTradeTime": 1677490200,
//       "QuotationLot": 50,
//       "TradedQty": 1221800,
//       "OpenInterest": 11624550,
//       "Open": 17482,
//       "High": 17512.5,
//       "Low": 17465.45,
//       "Close": 17510.05
//     },
//     {
//       "LastTradeTime": 1677488400,
//       "QuotationLot": 50,
//       "TradedQty": 401550,
//       "OpenInterest": 11660500,
//       "Open": 17451,
//       "High": 17481.2,
//       "Low": 17437.4,
//       "Close": 17478.85
//     },
//     {
//       "LastTradeTime": 1677486600,
//       "QuotationLot": 50,
//       "TradedQty": 733700,
//       "OpenInterest": 11701450,
//       "Open": 17452.25,
//       "High": 17475.85,
//       "Low": 17437.35,
//       "Close": 17450.4
//     },
//     {
//       "LastTradeTime": 1677484800,
//       "QuotationLot": 50,
//       "TradedQty": 299950,
//       "OpenInterest": 11600200,
//       "Open": 17416.85,
//       "High": 17457.5,
//       "Low": 17416.85,
//       "Close": 17454
//     },
//     {
//       "LastTradeTime": 1677483000,
//       "QuotationLot": 50,
//       "TradedQty": 310800,
//       "OpenInterest": 11599200,
//       "Open": 17427,
//       "High": 17434.9,
//       "Low": 17392.2,
//       "Close": 17416.85
//     },
//     {
//       "LastTradeTime": 1677481200,
//       "QuotationLot": 50,
//       "TradedQty": 188450,
//       "OpenInterest": 11588650,
//       "Open": 17426.05,
//       "High": 17443.45,
//       "Low": 17418,
//       "Close": 17428.9
//     },
//     {
//       "LastTradeTime": 1677479400,
//       "QuotationLot": 50,
//       "TradedQty": 601150,
//       "OpenInterest": 11584400,
//       "Open": 17460,
//       "High": 17461.6,
//       "Low": 17414.2,
//       "Close": 17426.05
//     },
//     {
//       "LastTradeTime": 1677477600,
//       "QuotationLot": 50,
//       "TradedQty": 544250,
//       "OpenInterest": 11413550,
//       "Open": 17440.35,
//       "High": 17489.95,
//       "Low": 17432.9,
//       "Close": 17460
//     },
//     {
//       "LastTradeTime": 1677475800,
//       "QuotationLot": 50,
//       "TradedQty": 585800,
//       "OpenInterest": 11441600,
//       "Open": 17427.45,
//       "High": 17475,
//       "Low": 17420.9,
//       "Close": 17441.8
//     },
//     {
//       "LastTradeTime": 1677474000,
//       "QuotationLot": 50,
//       "TradedQty": 491500,
//       "OpenInterest": 11426750,
//       "Open": 17420.4,
//       "High": 17427.4,
//       "Low": 17396.8,
//       "Close": 17425.4
//     },
//     {
//       "LastTradeTime": 1677472200,
//       "QuotationLot": 50,
//       "TradedQty": 886450,
//       "OpenInterest": 11303100,
//       "Open": 17435.6,
//       "High": 17446.9,
//       "Low": 17401.3,
//       "Close": 17420.4
//     },
//     {
//       "LastTradeTime": 1677470400,
//       "QuotationLot": 50,
//       "TradedQty": 1258250,
//       "OpenInterest": 11057250,
//       "Open": 17541.25,
//       "High": 17554.75,
//       "Low": 17433.4,
//       "Close": 17439.65
//     },
//     {
//       "LastTradeTime": 1677468600,
//       "QuotationLot": 50,
//       "TradedQty": 1141000,
//       "OpenInterest": 10805950,
//       "Open": 17505,
//       "High": 17538,
//       "Low": 17458,
//       "Close": 17537
//     },
//     {
//       "LastTradeTime": 1677232800,
//       "QuotationLot": 50,
//       "TradedQty": 650,
//       "OpenInterest": 10748400,
//       "Open": 17560,
//       "High": 17560,
//       "Low": 17560,
//       "Close": 17560
//     },
//     {
//       "LastTradeTime": 1677231000,
//       "QuotationLot": 50,
//       "TradedQty": 736000,
//       "OpenInterest": 10748400,
//       "Open": 17528,
//       "High": 17575,
//       "Low": 17528,
//       "Close": 17562
//     },
//     {
//       "LastTradeTime": 1677229200,
//       "QuotationLot": 50,
//       "TradedQty": 329750,
//       "OpenInterest": 10776200,
//       "Open": 17534.7,
//       "High": 17562,
//       "Low": 17522,
//       "Close": 17528.8
//     },
//     {
//       "LastTradeTime": 1677227400,
//       "QuotationLot": 50,
//       "TradedQty": 493200,
//       "OpenInterest": 10798200,
//       "Open": 17575,
//       "High": 17581.8,
//       "Low": 17510,
//       "Close": 17532.6
//     },
//     {
//       "LastTradeTime": 1677225600,
//       "QuotationLot": 50,
//       "TradedQty": 517250,
//       "OpenInterest": 10799700,
//       "Open": 17532.55,
//       "High": 17584.6,
//       "Low": 17530.05,
//       "Close": 17576.5
//     },
//     {
//       "LastTradeTime": 1677223800,
//       "QuotationLot": 50,
//       "TradedQty": 600050,
//       "OpenInterest": 10816750,
//       "Open": 17525,
//       "High": 17551.25,
//       "Low": 17513,
//       "Close": 17532.55
//     },
//     {
//       "LastTradeTime": 1677222000,
//       "QuotationLot": 50,
//       "TradedQty": 562500,
//       "OpenInterest": 10821700,
//       "Open": 17559,
//       "High": 17566.9,
//       "Low": 17520,
//       "Close": 17525.95
//     },
//     {
//       "LastTradeTime": 1677220200,
//       "QuotationLot": 50,
//       "TradedQty": 528900,
//       "OpenInterest": 10784850,
//       "Open": 17590.1,
//       "High": 17602.95,
//       "Low": 17546.4,
//       "Close": 17556.1
//     },
//     {
//       "LastTradeTime": 1677218400,
//       "QuotationLot": 50,
//       "TradedQty": 392750,
//       "OpenInterest": 10699400,
//       "Open": 17612.65,
//       "High": 17628.95,
//       "Low": 17575,
//       "Close": 17590.1
//     },
//     {
//       "LastTradeTime": 1677216600,
//       "QuotationLot": 50,
//       "TradedQty": 347500,
//       "OpenInterest": 10638700,
//       "Open": 17606,
//       "High": 17626.55,
//       "Low": 17594,
//       "Close": 17612.65
//     },
//     {
//       "LastTradeTime": 1677214800,
//       "QuotationLot": 50,
//       "TradedQty": 596800,
//       "OpenInterest": 10589850,
//       "Open": 17622.3,
//       "High": 17651.4,
//       "Low": 17601.9,
//       "Close": 17607.05
//     },
//     {
//       "LastTradeTime": 1677213000,
//       "QuotationLot": 50,
//       "TradedQty": 400150,
//       "OpenInterest": 10641600,
//       "Open": 17636.15,
//       "High": 17661,
//       "Low": 17624,
//       "Close": 17625
//     },
//     {
//       "LastTradeTime": 1677211200,
//       "QuotationLot": 50,
//       "TradedQty": 845000,
//       "OpenInterest": 10570450,
//       "Open": 17657,
//       "High": 17668,
//       "Low": 17604.05,
//       "Close": 17636.25
//     },
//     {
//       "LastTradeTime": 1677209400,
//       "QuotationLot": 50,
//       "TradedQty": 940300,
//       "OpenInterest": 10437700,
//       "Open": 17637.9,
//       "High": 17700,
//       "Low": 17600,
//       "Close": 17658.35
//     },
//     {
//       "LastTradeTime": 1677144600,
//       "QuotationLot": 50,
//       "TradedQty": 822400,
//       "OpenInterest": 6245900,
//       "Open": 17562,
//       "High": 17568.2,
//       "Low": 17493.4,
//       "Close": 17511.9
//     },
//     {
//       "LastTradeTime": 1677142800,
//       "QuotationLot": 50,
//       "TradedQty": 416350,
//       "OpenInterest": 6479900,
//       "Open": 17562.85,
//       "High": 17568,
//       "Low": 17537.15,
//       "Close": 17559.05
//     },
//     {
//       "LastTradeTime": 1677141000,
//       "QuotationLot": 50,
//       "TradedQty": 387450,
//       "OpenInterest": 6566200,
//       "Open": 17577.85,
//       "High": 17588.9,
//       "Low": 17547.6,
//       "Close": 17558
//     },
//     {
//       "LastTradeTime": 1677139200,
//       "QuotationLot": 50,
//       "TradedQty": 483250,
//       "OpenInterest": 6589250,
//       "Open": 17555.05,
//       "High": 17598.65,
//       "Low": 17540.75,
//       "Close": 17576.35
//     },
//     {
//       "LastTradeTime": 1677137400,
//       "QuotationLot": 50,
//       "TradedQty": 536400,
//       "OpenInterest": 6586050,
//       "Open": 17549.1,
//       "High": 17588,
//       "Low": 17544.55,
//       "Close": 17555.05
//     },
//     {
//       "LastTradeTime": 1677135600,
//       "QuotationLot": 50,
//       "TradedQty": 670200,
//       "OpenInterest": 6390250,
//       "Open": 17552,
//       "High": 17564.8,
//       "Low": 17525.05,
//       "Close": 17550
//     },
//     {
//       "LastTradeTime": 1677133800,
//       "QuotationLot": 50,
//       "TradedQty": 465350,
//       "OpenInterest": 6381050,
//       "Open": 17577.8,
//       "High": 17584.95,
//       "Low": 17542.85,
//       "Close": 17552.05
//     },
//     {
//       "LastTradeTime": 1677132000,
//       "QuotationLot": 50,
//       "TradedQty": 691300,
//       "OpenInterest": 6744700,
//       "Open": 17593.6,
//       "High": 17596.55,
//       "Low": 17572.75,
//       "Close": 17577.8
//     },
//     {
//       "LastTradeTime": 1677130200,
//       "QuotationLot": 50,
//       "TradedQty": 492900,
//       "OpenInterest": 6426550,
//       "Open": 17554.05,
//       "High": 17597.6,
//       "Low": 17546.6,
//       "Close": 17591.25
//     },
//     {
//       "LastTradeTime": 1677128400,
//       "QuotationLot": 50,
//       "TradedQty": 668600,
//       "OpenInterest": 6284450,
//       "Open": 17618,
//       "High": 17628.7,
//       "Low": 17553.6,
//       "Close": 17555.45
//     },
//     {
//       "LastTradeTime": 1677126600,
//       "QuotationLot": 50,
//       "TradedQty": 1232750,
//       "OpenInterest": 6132700,
//       "Open": 17567.2,
//       "High": 17618.8,
//       "Low": 17564.05,
//       "Close": 17616.7
//     },
//     {
//       "LastTradeTime": 1677124800,
//       "QuotationLot": 50,
//       "TradedQty": 1168500,
//       "OpenInterest": 5975900,
//       "Open": 17511.5,
//       "High": 17614,
//       "Low": 17461.15,
//       "Close": 17565.3
//     },
//     {
//       "LastTradeTime": 1677123000,
//       "QuotationLot": 50,
//       "TradedQty": 400200,
//       "OpenInterest": 5861650,
//       "Open": 17575,
//       "High": 17593.4,
//       "Low": 17510.5,
//       "Close": 17512.5
//     },
//     {
//       "LastTradeTime": 1677060000,
//       "QuotationLot": 50,
//       "TradedQty": 300,
//       "OpenInterest": 7354650,
//       "Open": 17566,
//       "High": 17566,
//       "Low": 17566,
//       "Close": 17566
//     },
//     {
//       "LastTradeTime": 1677058200,
//       "QuotationLot": 50,
//       "TradedQty": 819800,
//       "OpenInterest": 7354650,
//       "Open": 17587.45,
//       "High": 17598.2,
//       "Low": 17550.05,
//       "Close": 17570
//     },
//     {
//       "LastTradeTime": 1677056400,
//       "QuotationLot": 50,
//       "TradedQty": 556250,
//       "OpenInterest": 7520800,
//       "Open": 17584.75,
//       "High": 17603.3,
//       "Low": 17573.1,
//       "Close": 17588.9
//     },
//     {
//       "LastTradeTime": 1677054600,
//       "QuotationLot": 50,
//       "TradedQty": 571650,
//       "OpenInterest": 7549050,
//       "Open": 17567.05,
//       "High": 17584.15,
//       "Low": 17532.55,
//       "Close": 17584.15
//     },
//     {
//       "LastTradeTime": 1677052800,
//       "QuotationLot": 50,
//       "TradedQty": 650300,
//       "OpenInterest": 7611000,
//       "Open": 17590.7,
//       "High": 17598.65,
//       "Low": 17557.15,
//       "Close": 17567.05
//     },
//     {
//       "LastTradeTime": 1677051000,
//       "QuotationLot": 50,
//       "TradedQty": 421950,
//       "OpenInterest": 7637150,
//       "Open": 17625.7,
//       "High": 17646.5,
//       "Low": 17586.5,
//       "Close": 17591
//     },
//     {
//       "LastTradeTime": 1677049200,
//       "QuotationLot": 50,
//       "TradedQty": 389100,
//       "OpenInterest": 7612300,
//       "Open": 17642.15,
//       "High": 17643.2,
//       "Low": 17616.75,
//       "Close": 17627.9
//     },
//     {
//       "LastTradeTime": 1677047400,
//       "QuotationLot": 50,
//       "TradedQty": 306250,
//       "OpenInterest": 7586200,
//       "Open": 17651.05,
//       "High": 17662.95,
//       "Low": 17636.35,
//       "Close": 17640
//     },
//     {
//       "LastTradeTime": 1677045600,
//       "QuotationLot": 50,
//       "TradedQty": 509950,
//       "OpenInterest": 7612000,
//       "Open": 17678,
//       "High": 17679.95,
//       "Low": 17642.5,
//       "Close": 17651.1
//     },
//     {
//       "LastTradeTime": 1677043800,
//       "QuotationLot": 50,
//       "TradedQty": 439200,
//       "OpenInterest": 7508850,
//       "Open": 17674.15,
//       "High": 17687.2,
//       "Low": 17662.2,
//       "Close": 17678
//     },
//     {
//       "LastTradeTime": 1677042000,
//       "QuotationLot": 50,
//       "TradedQty": 474800,
//       "OpenInterest": 7364150,
//       "Open": 17676.65,
//       "High": 17685.45,
//       "Low": 17660,
//       "Close": 17672.15
//     },
//     {
//       "LastTradeTime": 1677040200,
//       "QuotationLot": 50,
//       "TradedQty": 801000,
//       "OpenInterest": 7231450,
//       "Open": 17685,
//       "High": 17699.8,
//       "Low": 17666.2,
//       "Close": 17675.15
//     },
//     {
//       "LastTradeTime": 1677038400,
//       "QuotationLot": 50,
//       "TradedQty": 958150,
//       "OpenInterest": 7027450,
//       "Open": 17750.75,
//       "High": 17758.55,
//       "Low": 17677.7,
//       "Close": 17684.4
//     },
//     {
//       "LastTradeTime": 1677036600,
//       "QuotationLot": 50,
//       "TradedQty": 671850,
//       "OpenInterest": 6977150,
//       "Open": 17790,
//       "High": 17794.95,
//       "Low": 17736,
//       "Close": 17750.2
//     },
//     {
//       "LastTradeTime": 1676973600,
//       "QuotationLot": 50,
//       "TradedQty": 50,
//       "OpenInterest": 8838300,
//       "Open": 17851,
//       "High": 17851,
//       "Low": 17851,
//       "Close": 17851
//     },
//     {
//       "LastTradeTime": 1676971800,
//       "QuotationLot": 50,
//       "TradedQty": 710500,
//       "OpenInterest": 8838300,
//       "Open": 17826.9,
//       "High": 17857.95,
//       "Low": 17823.05,
//       "Close": 17851
//     },
//     {
//       "LastTradeTime": 1676970000,
//       "QuotationLot": 50,
//       "TradedQty": 860900,
//       "OpenInterest": 8875300,
//       "Open": 17824.1,
//       "High": 17864.3,
//       "Low": 17801,
//       "Close": 17822.05
//     },
//     {
//       "LastTradeTime": 1676968200,
//       "QuotationLot": 50,
//       "TradedQty": 635550,
//       "OpenInterest": 8736100,
//       "Open": 17883.25,
//       "High": 17895.95,
//       "Low": 17821.4,
//       "Close": 17824.25
//     },
//     {
//       "LastTradeTime": 1676966400,
//       "QuotationLot": 50,
//       "TradedQty": 421950,
//       "OpenInterest": 8570150,
//       "Open": 17863.05,
//       "High": 17893,
//       "Low": 17856.85,
//       "Close": 17881.4
//     },
//     {
//       "LastTradeTime": 1676964600,
//       "QuotationLot": 50,
//       "TradedQty": 323150,
//       "OpenInterest": 8521500,
//       "Open": 17844.35,
//       "High": 17868.55,
//       "Low": 17840,
//       "Close": 17862
//     },
//     {
//       "LastTradeTime": 1676962800,
//       "QuotationLot": 50,
//       "TradedQty": 838450,
//       "OpenInterest": 8552250,
//       "Open": 17836.7,
//       "High": 17851.95,
//       "Low": 17823.4,
//       "Close": 17846.45
//     },
//     {
//       "LastTradeTime": 1676961000,
//       "QuotationLot": 50,
//       "TradedQty": 608300,
//       "OpenInterest": 8367600,
//       "Open": 17894,
//       "High": 17897.85,
//       "Low": 17835,
//       "Close": 17837.9
//     },
//     {
//       "LastTradeTime": 1676959200,
//       "QuotationLot": 50,
//       "TradedQty": 450050,
//       "OpenInterest": 8327550,
//       "Open": 17912.8,
//       "High": 17916.4,
//       "Low": 17873,
//       "Close": 17894
//     },
//     {
//       "LastTradeTime": 1676957400,
//       "QuotationLot": 50,
//       "TradedQty": 319750,
//       "OpenInterest": 8289050,
//       "Open": 17904.95,
//       "High": 17925,
//       "Low": 17897.45,
//       "Close": 17912.8
//     },
//     {
//       "LastTradeTime": 1676955600,
//       "QuotationLot": 50,
//       "TradedQty": 419900,
//       "OpenInterest": 8257300,
//       "Open": 17924,
//       "High": 17932,
//       "Low": 17895.05,
//       "Close": 17904.95
//     },
//     {
//       "LastTradeTime": 1676953800,
//       "QuotationLot": 50,
//       "TradedQty": 846900,
//       "OpenInterest": 8254900,
//       "Open": 17865.9,
//       "High": 17931.2,
//       "Low": 17863.3,
//       "Close": 17924
//     },
//     {
//       "LastTradeTime": 1676952000,
//       "QuotationLot": 50,
//       "TradedQty": 535800,
//       "OpenInterest": 8461750,
//       "Open": 17892,
//       "High": 17904.95,
//       "Low": 17842.75,
//       "Close": 17865.9
//     },
//     {
//       "LastTradeTime": 1676950200,
//       "QuotationLot": 50,
//       "TradedQty": 501000,
//       "OpenInterest": 8439050,
//       "Open": 17883.6,
//       "High": 17896.95,
//       "Low": 17865.1,
//       "Close": 17890
//     },
//     {
//       "LastTradeTime": 1676887200,
//       "QuotationLot": 50,
//       "TradedQty": 200,
//       "OpenInterest": 9713650,
//       "Open": 17867,
//       "High": 17867,
//       "Low": 17867,
//       "Close": 17867
//     },
//     {
//       "LastTradeTime": 1676885400,
//       "QuotationLot": 50,
//       "TradedQty": 652650,
//       "OpenInterest": 9713650,
//       "Open": 17873,
//       "High": 17883.9,
//       "Low": 17842.55,
//       "Close": 17865.65
//     },
//     {
//       "LastTradeTime": 1676883600,
//       "QuotationLot": 50,
//       "TradedQty": 588500,
//       "OpenInterest": 9755500,
//       "Open": 17844.95,
//       "High": 17875.2,
//       "Low": 17840,
//       "Close": 17873
//     },
//     {
//       "LastTradeTime": 1676881800,
//       "QuotationLot": 50,
//       "TradedQty": 704700,
//       "OpenInterest": 9692150,
//       "Open": 17867.9,
//       "High": 17876.8,
//       "Low": 17835.6,
//       "Close": 17844.95
//     },
//     {
//       "LastTradeTime": 1676880000,
//       "QuotationLot": 50,
//       "TradedQty": 716100,
//       "OpenInterest": 9509600,
//       "Open": 17882.5,
//       "High": 17892,
//       "Low": 17857.8,
//       "Close": 17870
//     },
//     {
//       "LastTradeTime": 1676878200,
//       "QuotationLot": 50,
//       "TradedQty": 545450,
//       "OpenInterest": 9317000,
//       "Open": 17905.65,
//       "High": 17926.55,
//       "Low": 17875.65,
//       "Close": 17882.4
//     },
//     {
//       "LastTradeTime": 1676876400,
//       "QuotationLot": 50,
//       "TradedQty": 470250,
//       "OpenInterest": 9300000,
//       "Open": 17933.45,
//       "High": 17933.45,
//       "Low": 17895.1,
//       "Close": 17905.45
//     },
//     {
//       "LastTradeTime": 1676874600,
//       "QuotationLot": 50,
//       "TradedQty": 337650,
//       "OpenInterest": 9300000,
//       "Open": 17938,
//       "High": 17947.95,
//       "Low": 17920,
//       "Close": 17931.15
//     },
//     {
//       "LastTradeTime": 1676872800,
//       "QuotationLot": 50,
//       "TradedQty": 332950,
//       "OpenInterest": 9254150,
//       "Open": 17944.35,
//       "High": 17958,
//       "Low": 17933.85,
//       "Close": 17938.05
//     },
//     {
//       "LastTradeTime": 1676871000,
//       "QuotationLot": 50,
//       "TradedQty": 233300,
//       "OpenInterest": 9217850,
//       "Open": 17969.1,
//       "High": 17982.7,
//       "Low": 17940.6,
//       "Close": 17942
//     },
//     {
//       "LastTradeTime": 1676869200,
//       "QuotationLot": 50,
//       "TradedQty": 211000,
//       "OpenInterest": 9234000,
//       "Open": 17962.6,
//       "High": 17979.8,
//       "Low": 17955,
//       "Close": 17969.1
//     },
//     {
//       "LastTradeTime": 1676867400,
//       "QuotationLot": 50,
//       "TradedQty": 529100,
//       "OpenInterest": 9261800,
//       "Open": 18003.05,
//       "High": 18014.7,
//       "Low": 17952,
//       "Close": 17962.6
//     },
//     {
//       "LastTradeTime": 1676865600,
//       "QuotationLot": 50,
//       "TradedQty": 933350,
//       "OpenInterest": 9301350,
//       "Open": 17937.55,
//       "High": 18009,
//       "Low": 17907.4,
//       "Close": 18001
//     },
//     {
//       "LastTradeTime": 1676863800,
//       "QuotationLot": 50,
//       "TradedQty": 723200,
//       "OpenInterest": 9297450,
//       "Open": 17965.75,
//       "High": 17982.8,
//       "Low": 17924,
//       "Close": 17936.65
//     },
//     {
//       "LastTradeTime": 1676628000,
//       "QuotationLot": 50,
//       "TradedQty": 700,
//       "OpenInterest": 9649850,
//       "Open": 17954.1,
//       "High": 17954.1,
//       "Low": 17954.1,
//       "Close": 17954.1
//     },
//     {
//       "LastTradeTime": 1676626200,
//       "QuotationLot": 50,
//       "TradedQty": 833850,
//       "OpenInterest": 9649850,
//       "Open": 17932.65,
//       "High": 17960,
//       "Low": 17932.65,
//       "Close": 17955
//     },
//     {
//       "LastTradeTime": 1676624400,
//       "QuotationLot": 50,
//       "TradedQty": 428400,
//       "OpenInterest": 9671400,
//       "Open": 17945,
//       "High": 17947,
//       "Low": 17903,
//       "Close": 17933
//     },
//     {
//       "LastTradeTime": 1676622600,
//       "QuotationLot": 50,
//       "TradedQty": 693050,
//       "OpenInterest": 9681350,
//       "Open": 17909,
//       "High": 17947.85,
//       "Low": 17894.55,
//       "Close": 17945
//     },
//     {
//       "LastTradeTime": 1676620800,
//       "QuotationLot": 50,
//       "TradedQty": 835050,
//       "OpenInterest": 9504450,
//       "Open": 17943.65,
//       "High": 17943.65,
//       "Low": 17893.55,
//       "Close": 17908.9
//     },
//     {
//       "LastTradeTime": 1676619000,
//       "QuotationLot": 50,
//       "TradedQty": 557250,
//       "OpenInterest": 9452050,
//       "Open": 17947,
//       "High": 17955,
//       "Low": 17931.45,
//       "Close": 17943.65
//     },
//     {
//       "LastTradeTime": 1676617200,
//       "QuotationLot": 50,
//       "TradedQty": 649850,
//       "OpenInterest": 9381250,
//       "Open": 17976,
//       "High": 17982.8,
//       "Low": 17945.2,
//       "Close": 17947.95
//     },
//     {
//       "LastTradeTime": 1676615400,
//       "QuotationLot": 50,
//       "TradedQty": 403600,
//       "OpenInterest": 9409700,
//       "Open": 18000,
//       "High": 18010.9,
//       "Low": 17970.4,
//       "Close": 17976
//     },
//     {
//       "LastTradeTime": 1676613600,
//       "QuotationLot": 50,
//       "TradedQty": 186950,
//       "OpenInterest": 9444150,
//       "Open": 17994.9,
//       "High": 18009.95,
//       "Low": 17987.9,
//       "Close": 18000
//     },
//     {
//       "LastTradeTime": 1676611800,
//       "QuotationLot": 50,
//       "TradedQty": 198650,
//       "OpenInterest": 9482150,
//       "Open": 17995.25,
//       "High": 18013.3,
//       "Low": 17986.5,
//       "Close": 17995
//     },
//     {
//       "LastTradeTime": 1676610000,
//       "QuotationLot": 50,
//       "TradedQty": 139800,
//       "OpenInterest": 9498500,
//       "Open": 18019.9,
//       "High": 18022,
//       "Low": 17995.05,
//       "Close": 17995.95
//     },
//     {
//       "LastTradeTime": 1676608200,
//       "QuotationLot": 50,
//       "TradedQty": 430750,
//       "OpenInterest": 9490400,
//       "Open": 18029,
//       "High": 18034.7,
//       "Low": 17980.55,
//       "Close": 18018.65
//     },
//     {
//       "LastTradeTime": 1676606400,
//       "QuotationLot": 50,
//       "TradedQty": 1002350,
//       "OpenInterest": 9475950,
//       "Open": 17999.75,
//       "High": 18045,
//       "Low": 17990.95,
//       "Close": 18029
//     },
//     {
//       "LastTradeTime": 1676604600,
//       "QuotationLot": 50,
//       "TradedQty": 942200,
//       "OpenInterest": 9397800,
//       "Open": 17986.2,
//       "High": 18005.85,
//       "Low": 17955.4,
//       "Close": 17996.8
//     },
//     {
//       "LastTradeTime": 1676541600,
//       "QuotationLot": 50,
//       "TradedQty": 200,
//       "OpenInterest": 9470900,
//       "Open": 18057.35,
//       "High": 18057.35,
//       "Low": 18057.35,
//       "Close": 18057.35
//     },
//     {
//       "LastTradeTime": 1676539800,
//       "QuotationLot": 50,
//       "TradedQty": 919350,
//       "OpenInterest": 9470900,
//       "Open": 18097,
//       "High": 18097.95,
//       "Low": 18047.8,
//       "Close": 18054.4
//     },
//     {
//       "LastTradeTime": 1676538000,
//       "QuotationLot": 50,
//       "TradedQty": 376000,
//       "OpenInterest": 9362250,
//       "Open": 18064.1,
//       "High": 18099.3,
//       "Low": 18059.35,
//       "Close": 18094.2
//     },
//     {
//       "LastTradeTime": 1676536200,
//       "QuotationLot": 50,
//       "TradedQty": 542400,
//       "OpenInterest": 9336150,
//       "Open": 18102,
//       "High": 18109.8,
//       "Low": 18053.2,
//       "Close": 18064.25
//     },
//     {
//       "LastTradeTime": 1676534400,
//       "QuotationLot": 50,
//       "TradedQty": 392150,
//       "OpenInterest": 9346600,
//       "Open": 18120,
//       "High": 18125.5,
//       "Low": 18091,
//       "Close": 18102
//     },
//     {
//       "LastTradeTime": 1676532600,
//       "QuotationLot": 50,
//       "TradedQty": 438700,
//       "OpenInterest": 9374350,
//       "Open": 18079.85,
//       "High": 18124.1,
//       "Low": 18078.5,
//       "Close": 18120
//     },
//     {
//       "LastTradeTime": 1676530800,
//       "QuotationLot": 50,
//       "TradedQty": 553200,
//       "OpenInterest": 9399700,
//       "Open": 18106.6,
//       "High": 18108.35,
//       "Low": 18071,
//       "Close": 18080.55
//     },
//     {
//       "LastTradeTime": 1676529000,
//       "QuotationLot": 50,
//       "TradedQty": 183350,
//       "OpenInterest": 9422500,
//       "Open": 18114.05,
//       "High": 18120.8,
//       "Low": 18100.6,
//       "Close": 18106.6
//     },
//     {
//       "LastTradeTime": 1676527200,
//       "QuotationLot": 50,
//       "TradedQty": 246800,
//       "OpenInterest": 9420000,
//       "Open": 18126.9,
//       "High": 18134.1,
//       "Low": 18103.7,
//       "Close": 18115.1
//     },
//     {
//       "LastTradeTime": 1676525400,
//       "QuotationLot": 50,
//       "TradedQty": 142900,
//       "OpenInterest": 9418250,
//       "Open": 18137.55,
//       "High": 18142,
//       "Low": 18125.05,
//       "Close": 18126.9
//     },
//     {
//       "LastTradeTime": 1676523600,
//       "QuotationLot": 50,
//       "TradedQty": 308100,
//       "OpenInterest": 9409100,
//       "Open": 18114.2,
//       "High": 18143,
//       "Low": 18104,
//       "Close": 18136.05
//     },
//     {
//       "LastTradeTime": 1676521800,
//       "QuotationLot": 50,
//       "TradedQty": 366000,
//       "OpenInterest": 9468250,
//       "Open": 18138.65,
//       "High": 18146,
//       "Low": 18111.2,
//       "Close": 18115.55
//     },
//     {
//       "LastTradeTime": 1676520000,
//       "QuotationLot": 50,
//       "TradedQty": 678850,
//       "OpenInterest": 9447950,
//       "Open": 18134.05,
//       "High": 18150,
//       "Low": 18124.7,
//       "Close": 18138.65
//     },
//     {
//       "LastTradeTime": 1676518200,
//       "QuotationLot": 50,
//       "TradedQty": 973150,
//       "OpenInterest": 9496300,
//       "Open": 18090,
//       "High": 18139.95,
//       "Low": 18075.2,
//       "Close": 18134.05
//     },
//     {
//       "LastTradeTime": 1676455200,
//       "QuotationLot": 50,
//       "TradedQty": 150,
//       "OpenInterest": 9622850,
//       "Open": 18040,
//       "High": 18040,
//       "Low": 18040,
//       "Close": 18040
//     },
//     {
//       "LastTradeTime": 1676453400,
//       "QuotationLot": 50,
//       "TradedQty": 1380750,
//       "OpenInterest": 9622850,
//       "Open": 17997.1,
//       "High": 18049,
//       "Low": 17997.1,
//       "Close": 18040
//     },
//     {
//       "LastTradeTime": 1676451600,
//       "QuotationLot": 50,
//       "TradedQty": 602650,
//       "OpenInterest": 9628950,
//       "Open": 17965.3,
//       "High": 18003.95,
//       "Low": 17960.85,
//       "Close": 17996.45
//     },
//     {
//       "LastTradeTime": 1676449800,
//       "QuotationLot": 50,
//       "TradedQty": 235450,
//       "OpenInterest": 9614450,
//       "Open": 17951.1,
//       "High": 17977.1,
//       "Low": 17951.1,
//       "Close": 17965.7
//     },
//     {
//       "LastTradeTime": 1676448000,
//       "QuotationLot": 50,
//       "TradedQty": 208800,
//       "OpenInterest": 9597900,
//       "Open": 17953,
//       "High": 17957.15,
//       "Low": 17932.65,
//       "Close": 17951.95
//     },
//     {
//       "LastTradeTime": 1676446200,
//       "QuotationLot": 50,
//       "TradedQty": 164900,
//       "OpenInterest": 9592100,
//       "Open": 17968.5,
//       "High": 17971.7,
//       "Low": 17943.25,
//       "Close": 17953
//     },
//     {
//       "LastTradeTime": 1676444400,
//       "QuotationLot": 50,
//       "TradedQty": 214900,
//       "OpenInterest": 9604250,
//       "Open": 17940.65,
//       "High": 17968.5,
//       "Low": 17940.65,
//       "Close": 17968.5
//     },
//     {
//       "LastTradeTime": 1676442600,
//       "QuotationLot": 50,
//       "TradedQty": 311400,
//       "OpenInterest": 9573650,
//       "Open": 17962.15,
//       "High": 17963.45,
//       "Low": 17930.5,
//       "Close": 17940.65
//     },
//     {
//       "LastTradeTime": 1676440800,
//       "QuotationLot": 50,
//       "TradedQty": 291600,
//       "OpenInterest": 9630500,
//       "Open": 17959.1,
//       "High": 17975,
//       "Low": 17952.65,
//       "Close": 17960.05
//     },
//     {
//       "LastTradeTime": 1676439000,
//       "QuotationLot": 50,
//       "TradedQty": 469600,
//       "OpenInterest": 9676500,
//       "Open": 17940.2,
//       "High": 17983,
//       "Low": 17940.2,
//       "Close": 17959
//     },
//     {
//       "LastTradeTime": 1676437200,
//       "QuotationLot": 50,
//       "TradedQty": 194600,
//       "OpenInterest": 9632800,
//       "Open": 17935.45,
//       "High": 17957,
//       "Low": 17935.45,
//       "Close": 17940.2
//     },
//     {
//       "LastTradeTime": 1676435400,
//       "QuotationLot": 50,
//       "TradedQty": 685900,
//       "OpenInterest": 9632200,
//       "Open": 17910.75,
//       "High": 17960,
//       "Low": 17910.75,
//       "Close": 17935.45
//     },
//     {
//       "LastTradeTime": 1676433600,
//       "QuotationLot": 50,
//       "TradedQty": 843100,
//       "OpenInterest": 9751150,
//       "Open": 17886.1,
//       "High": 17914.05,
//       "Low": 17872.35,
//       "Close": 17910.75
//     },
//     {
//       "LastTradeTime": 1676431800,
//       "QuotationLot": 50,
//       "TradedQty": 917900,
//       "OpenInterest": 9653300,
//       "Open": 17899.8,
//       "High": 17917.05,
//       "Low": 17882,
//       "Close": 17885.1
//     },
//     {
//       "LastTradeTime": 1676368800,
//       "QuotationLot": 50,
//       "TradedQty": 1850,
//       "OpenInterest": 10239150,
//       "Open": 17942,
//       "High": 17942,
//       "Low": 17942,
//       "Close": 17942
//     },
//     {
//       "LastTradeTime": 1676367000,
//       "QuotationLot": 50,
//       "TradedQty": 800850,
//       "OpenInterest": 10239150,
//       "Open": 17964,
//       "High": 17964,
//       "Low": 17939.65,
//       "Close": 17945.7
//     },
//     {
//       "LastTradeTime": 1676365200,
//       "QuotationLot": 50,
//       "TradedQty": 342000,
//       "OpenInterest": 10370700,
//       "Open": 17955.1,
//       "High": 17967.2,
//       "Low": 17950,
//       "Close": 17963
//     },
//     {
//       "LastTradeTime": 1676363400,
//       "QuotationLot": 50,
//       "TradedQty": 413600,
//       "OpenInterest": 10371850,
//       "Open": 17954.8,
//       "High": 17969.9,
//       "Low": 17946.15,
//       "Close": 17956
//     },
//     {
//       "LastTradeTime": 1676361600,
//       "QuotationLot": 50,
//       "TradedQty": 465000,
//       "OpenInterest": 10320850,
//       "Open": 17938.15,
//       "High": 17956,
//       "Low": 17922,
//       "Close": 17954.4
//     },
//     {
//       "LastTradeTime": 1676359800,
//       "QuotationLot": 50,
//       "TradedQty": 428950,
//       "OpenInterest": 10844300,
//       "Open": 17930.1,
//       "High": 17945,
//       "Low": 17930.1,
//       "Close": 17937.6
//     },
//     {
//       "LastTradeTime": 1676358000,
//       "QuotationLot": 50,
//       "TradedQty": 606050,
//       "OpenInterest": 10714000,
//       "Open": 17918.35,
//       "High": 17948,
//       "Low": 17916.25,
//       "Close": 17930.1
//     },
//     {
//       "LastTradeTime": 1676356200,
//       "QuotationLot": 50,
//       "TradedQty": 947850,
//       "OpenInterest": 10616350,
//       "Open": 17893.85,
//       "High": 17931.1,
//       "Low": 17887.6,
//       "Close": 17918.95
//     },
//     {
//       "LastTradeTime": 1676354400,
//       "QuotationLot": 50,
//       "TradedQty": 568350,
//       "OpenInterest": 10529700,
//       "Open": 17866.1,
//       "High": 17895,
//       "Low": 17865.1,
//       "Close": 17893.75
//     },
//     {
//       "LastTradeTime": 1676352600,
//       "QuotationLot": 50,
//       "TradedQty": 434050,
//       "OpenInterest": 10568850,
//       "Open": 17856.45,
//       "High": 17883.75,
//       "Low": 17851.1,
//       "Close": 17866.55
//     },
//     {
//       "LastTradeTime": 1676350800,
//       "QuotationLot": 50,
//       "TradedQty": 229750,
//       "OpenInterest": 10627150,
//       "Open": 17862.8,
//       "High": 17869.75,
//       "Low": 17848.5,
//       "Close": 17856.45
//     },
//     {
//       "LastTradeTime": 1676349000,
//       "QuotationLot": 50,
//       "TradedQty": 449750,
//       "OpenInterest": 10668500,
//       "Open": 17853.95,
//       "High": 17869.95,
//       "Low": 17841.1,
//       "Close": 17863.2
//     },
//     {
//       "LastTradeTime": 1676347200,
//       "QuotationLot": 50,
//       "TradedQty": 918450,
//       "OpenInterest": 10664450,
//       "Open": 17839.3,
//       "High": 17878,
//       "Low": 17818,
//       "Close": 17852.5
//     },
//     {
//       "LastTradeTime": 1676345400,
//       "QuotationLot": 50,
//       "TradedQty": 603050,
//       "OpenInterest": 10693450,
//       "Open": 17830,
//       "High": 17849.65,
//       "Low": 17812.85,
//       "Close": 17838
//     },
//     {
//       "LastTradeTime": 1676282400,
//       "QuotationLot": 50,
//       "TradedQty": 150,
//       "OpenInterest": 10861500,
//       "Open": 17799.05,
//       "High": 17799.05,
//       "Low": 17799.05,
//       "Close": 17799.05
//     },
//     {
//       "LastTradeTime": 1676280600,
//       "QuotationLot": 50,
//       "TradedQty": 564950,
//       "OpenInterest": 10861500,
//       "Open": 17819.75,
//       "High": 17823,
//       "Low": 17795,
//       "Close": 17800
//     },
//     {
//       "LastTradeTime": 1676278800,
//       "QuotationLot": 50,
//       "TradedQty": 393850,
//       "OpenInterest": 11022300,
//       "Open": 17802,
//       "High": 17825,
//       "Low": 17800,
//       "Close": 17821.6
//     },
//     {
//       "LastTradeTime": 1676277000,
//       "QuotationLot": 50,
//       "TradedQty": 223200,
//       "OpenInterest": 11153800,
//       "Open": 17793.3,
//       "High": 17809.65,
//       "Low": 17783.8,
//       "Close": 17802
//     },
//     {
//       "LastTradeTime": 1676275200,
//       "QuotationLot": 50,
//       "TradedQty": 159450,
//       "OpenInterest": 11190350,
//       "Open": 17800.7,
//       "High": 17805.35,
//       "Low": 17781.9,
//       "Close": 17794
//     },
//     {
//       "LastTradeTime": 1676273400,
//       "QuotationLot": 50,
//       "TradedQty": 270550,
//       "OpenInterest": 11231700,
//       "Open": 17784,
//       "High": 17802,
//       "Low": 17776,
//       "Close": 17799.9
//     },
//     {
//       "LastTradeTime": 1676271600,
//       "QuotationLot": 50,
//       "TradedQty": 273900,
//       "OpenInterest": 11306200,
//       "Open": 17763,
//       "High": 17789.65,
//       "Low": 17758,
//       "Close": 17784.45
//     },
//     {
//       "LastTradeTime": 1676269800,
//       "QuotationLot": 50,
//       "TradedQty": 656700,
//       "OpenInterest": 11315150,
//       "Open": 17801,
//       "High": 17803.6,
//       "Low": 17745,
//       "Close": 17763
//     },
//     {
//       "LastTradeTime": 1676268000,
//       "QuotationLot": 50,
//       "TradedQty": 349050,
//       "OpenInterest": 11070750,
//       "Open": 17795.6,
//       "High": 17805,
//       "Low": 17779.1,
//       "Close": 17803.1
//     },
//     {
//       "LastTradeTime": 1676266200,
//       "QuotationLot": 50,
//       "TradedQty": 346400,
//       "OpenInterest": 10985500,
//       "Open": 17800,
//       "High": 17820.45,
//       "Low": 17795.6,
//       "Close": 17795.8
//     },
//     {
//       "LastTradeTime": 1676264400,
//       "QuotationLot": 50,
//       "TradedQty": 489000,
//       "OpenInterest": 11028850,
//       "Open": 17772.5,
//       "High": 17808.85,
//       "Low": 17770.1,
//       "Close": 17800
//     },
//     {
//       "LastTradeTime": 1676262600,
//       "QuotationLot": 50,
//       "TradedQty": 1221050,
//       "OpenInterest": 11052750,
//       "Open": 17790.1,
//       "High": 17802.75,
//       "Low": 17753.8,
//       "Close": 17772.15
//     },
//     {
//       "LastTradeTime": 1676260800,
//       "QuotationLot": 50,
//       "TradedQty": 923800,
//       "OpenInterest": 10524650,
//       "Open": 17858.05,
//       "High": 17858.05,
//       "Low": 17791.1,
//       "Close": 17792
//     },
//     {
//       "LastTradeTime": 1676259000,
//       "QuotationLot": 50,
//       "TradedQty": 573100,
//       "OpenInterest": 10285450,
//       "Open": 17852.05,
//       "High": 17900.5,
//       "Low": 17851.7,
//       "Close": 17859.25
//     },
//     {
//       "LastTradeTime": 1676023200,
//       "QuotationLot": 50,
//       "TradedQty": 600,
//       "OpenInterest": 10410400,
//       "Open": 17870,
//       "High": 17870,
//       "Low": 17870,
//       "Close": 17870
//     },
//     {
//       "LastTradeTime": 1676021400,
//       "QuotationLot": 50,
//       "TradedQty": 643250,
//       "OpenInterest": 10410400,
//       "Open": 17861.05,
//       "High": 17888,
//       "Low": 17858.25,
//       "Close": 17870
//     },
//     {
//       "LastTradeTime": 1676019600,
//       "QuotationLot": 50,
//       "TradedQty": 401800,
//       "OpenInterest": 10478950,
//       "Open": 17879.65,
//       "High": 17883.8,
//       "Low": 17849.3,
//       "Close": 17861.8
//     },
//     {
//       "LastTradeTime": 1676017800,
//       "QuotationLot": 50,
//       "TradedQty": 275500,
//       "OpenInterest": 10460950,
//       "Open": 17872.5,
//       "High": 17884.05,
//       "Low": 17871.45,
//       "Close": 17880.85
//     },
//     {
//       "LastTradeTime": 1676016000,
//       "QuotationLot": 50,
//       "TradedQty": 238850,
//       "OpenInterest": 10490850,
//       "Open": 17856.6,
//       "High": 17878.95,
//       "Low": 17847,
//       "Close": 17874
//     },
//     {
//       "LastTradeTime": 1676014200,
//       "QuotationLot": 50,
//       "TradedQty": 230000,
//       "OpenInterest": 10516400,
//       "Open": 17857.5,
//       "High": 17863,
//       "Low": 17844.7,
//       "Close": 17857
//     },
//     {
//       "LastTradeTime": 1676012400,
//       "QuotationLot": 50,
//       "TradedQty": 150400,
//       "OpenInterest": 10529500,
//       "Open": 17863.4,
//       "High": 17872.75,
//       "Low": 17854.15,
//       "Close": 17856
//     },
//     {
//       "LastTradeTime": 1676010600,
//       "QuotationLot": 50,
//       "TradedQty": 358650,
//       "OpenInterest": 10547400,
//       "Open": 17875,
//       "High": 17885.95,
//       "Low": 17845,
//       "Close": 17863.4
//     },
//     {
//       "LastTradeTime": 1676008800,
//       "QuotationLot": 50,
//       "TradedQty": 707800,
//       "OpenInterest": 10562000,
//       "Open": 17882.1,
//       "High": 17888.85,
//       "Low": 17864.55,
//       "Close": 17872
//     },
//     {
//       "LastTradeTime": 1676007000,
//       "QuotationLot": 50,
//       "TradedQty": 316950,
//       "OpenInterest": 10295700,
//       "Open": 17876.15,
//       "High": 17899.9,
//       "Low": 17876.15,
//       "Close": 17882.1
//     },
//     {
//       "LastTradeTime": 1676005200,
//       "QuotationLot": 50,
//       "TradedQty": 304800,
//       "OpenInterest": 10318950,
//       "Open": 17849.3,
//       "High": 17886,
//       "Low": 17841.25,
//       "Close": 17876.15
//     },
//     {
//       "LastTradeTime": 1676003400,
//       "QuotationLot": 50,
//       "TradedQty": 454850,
//       "OpenInterest": 10352750,
//       "Open": 17848.6,
//       "High": 17874,
//       "Low": 17836.9,
//       "Close": 17850.4
//     },
//     {
//       "LastTradeTime": 1676001600,
//       "QuotationLot": 50,
//       "TradedQty": 1499350,
//       "OpenInterest": 10225550,
//       "Open": 17874.9,
//       "High": 17878.75,
//       "Low": 17818.9,
//       "Close": 17851.3
//     },
//     {
//       "LastTradeTime": 1675999800,
//       "QuotationLot": 50,
//       "TradedQty": 1080500,
//       "OpenInterest": 10088400,
//       "Open": 17851,
//       "High": 17889,
//       "Low": 17799,
//       "Close": 17877.75
//     },
//     {
//       "LastTradeTime": 1675936800,
//       "QuotationLot": 50,
//       "TradedQty": 400,
//       "OpenInterest": 10159550,
//       "Open": 17959.1,
//       "High": 17959.1,
//       "Low": 17959.1,
//       "Close": 17959.1
//     },
//     {
//       "LastTradeTime": 1675935000,
//       "QuotationLot": 50,
//       "TradedQty": 823800,
//       "OpenInterest": 10159550,
//       "Open": 17940.1,
//       "High": 17960,
//       "Low": 17926.1,
//       "Close": 17958.55
//     },
//     {
//       "LastTradeTime": 1675933200,
//       "QuotationLot": 50,
//       "TradedQty": 293600,
//       "OpenInterest": 10159050,
//       "Open": 17940.1,
//       "High": 17958,
//       "Low": 17931.3,
//       "Close": 17940.9
//     },
//     {
//       "LastTradeTime": 1675931400,
//       "QuotationLot": 50,
//       "TradedQty": 614950,
//       "OpenInterest": 10295600,
//       "Open": 17947.2,
//       "High": 17974.95,
//       "Low": 17930.7,
//       "Close": 17941
//     },
//     {
//       "LastTradeTime": 1675929600,
//       "QuotationLot": 50,
//       "TradedQty": 702950,
//       "OpenInterest": 10220050,
//       "Open": 17884.95,
//       "High": 17953.8,
//       "Low": 17883,
//       "Close": 17947.95
//     },
//     {
//       "LastTradeTime": 1675927800,
//       "QuotationLot": 50,
//       "TradedQty": 180200,
//       "OpenInterest": 10169850,
//       "Open": 17884.35,
//       "High": 17892,
//       "Low": 17870,
//       "Close": 17884.95
//     },
//     {
//       "LastTradeTime": 1675926000,
//       "QuotationLot": 50,
//       "TradedQty": 263950,
//       "OpenInterest": 10178250,
//       "Open": 17881.1,
//       "High": 17892.95,
//       "Low": 17867.45,
//       "Close": 17884.35
//     },
//     {
//       "LastTradeTime": 1675924200,
//       "QuotationLot": 50,
//       "TradedQty": 318950,
//       "OpenInterest": 10179100,
//       "Open": 17907.2,
//       "High": 17909.85,
//       "Low": 17880.25,
//       "Close": 17882
//     },
//     {
//       "LastTradeTime": 1675922400,
//       "QuotationLot": 50,
//       "TradedQty": 218250,
//       "OpenInterest": 10210250,
//       "Open": 17931.75,
//       "High": 17934.65,
//       "Low": 17900.1,
//       "Close": 17909.05
//     },
//     {
//       "LastTradeTime": 1675920600,
//       "QuotationLot": 50,
//       "TradedQty": 271500,
//       "OpenInterest": 10189450,
//       "Open": 17911.9,
//       "High": 17935,
//       "Low": 17902.05,
//       "Close": 17931.15
//     },
//     {
//       "LastTradeTime": 1675918800,
//       "QuotationLot": 50,
//       "TradedQty": 458350,
//       "OpenInterest": 10162500,
//       "Open": 17908.1,
//       "High": 17928,
//       "Low": 17892,
//       "Close": 17908.95
//     },
//     {
//       "LastTradeTime": 1675917000,
//       "QuotationLot": 50,
//       "TradedQty": 652600,
//       "OpenInterest": 10175250,
//       "Open": 17884,
//       "High": 17924,
//       "Low": 17876.45,
//       "Close": 17909.85
//     },
//     {
//       "LastTradeTime": 1675915200,
//       "QuotationLot": 50,
//       "TradedQty": 995250,
//       "OpenInterest": 10103000,
//       "Open": 17853,
//       "High": 17885.8,
//       "Low": 17820.9,
//       "Close": 17882.6
//     },
//     {
//       "LastTradeTime": 1675913400,
//       "QuotationLot": 50,
//       "TradedQty": 663800,
//       "OpenInterest": 10072650,
//       "Open": 17900.05,
//       "High": 17913.25,
//       "Low": 17850,
//       "Close": 17854.6
//     },
//     {
//       "LastTradeTime": 1675850400,
//       "QuotationLot": 50,
//       "TradedQty": 1000,
//       "OpenInterest": 10508100,
//       "Open": 17908.65,
//       "High": 17908.65,
//       "Low": 17908.65,
//       "Close": 17908.65
//     },
//     {
//       "LastTradeTime": 1675848600,
//       "QuotationLot": 50,
//       "TradedQty": 1040100,
//       "OpenInterest": 10508100,
//       "Open": 17927.05,
//       "High": 17939.35,
//       "Low": 17900,
//       "Close": 17908.5
//     },
//     {
//       "LastTradeTime": 1675846800,
//       "QuotationLot": 50,
//       "TradedQty": 354350,
//       "OpenInterest": 10661850,
//       "Open": 17924.2,
//       "High": 17938,
//       "Low": 17917,
//       "Close": 17927.85
//     },
//     {
//       "LastTradeTime": 1675845000,
//       "QuotationLot": 50,
//       "TradedQty": 395250,
//       "OpenInterest": 10663650,
//       "Open": 17916,
//       "High": 17933.5,
//       "Low": 17906,
//       "Close": 17924.2
//     },
//     {
//       "LastTradeTime": 1675843200,
//       "QuotationLot": 50,
//       "TradedQty": 512950,
//       "OpenInterest": 10584800,
//       "Open": 17923.55,
//       "High": 17935.25,
//       "Low": 17884.75,
//       "Close": 17916
//     },
//     {
//       "LastTradeTime": 1675841400,
//       "QuotationLot": 50,
//       "TradedQty": 347050,
//       "OpenInterest": 10607050,
//       "Open": 17894.5,
//       "High": 17925,
//       "Low": 17893.3,
//       "Close": 17923.55
//     },
//     {
//       "LastTradeTime": 1675839600,
//       "QuotationLot": 50,
//       "TradedQty": 224900,
//       "OpenInterest": 10577300,
//       "Open": 17882.1,
//       "High": 17899.95,
//       "Low": 17875,
//       "Close": 17894.4
//     },
//     {
//       "LastTradeTime": 1675837800,
//       "QuotationLot": 50,
//       "TradedQty": 417250,
//       "OpenInterest": 10555700,
//       "Open": 17928,
//       "High": 17930.55,
//       "Low": 17875,
//       "Close": 17884
//     },
//     {
//       "LastTradeTime": 1675836000,
//       "QuotationLot": 50,
//       "TradedQty": 625400,
//       "OpenInterest": 10606000,
//       "Open": 17887.2,
//       "High": 17931.95,
//       "Low": 17880.65,
//       "Close": 17925.65
//     },
//     {
//       "LastTradeTime": 1675834200,
//       "QuotationLot": 50,
//       "TradedQty": 314700,
//       "OpenInterest": 10494700,
//       "Open": 17869.45,
//       "High": 17899,
//       "Low": 17865,
//       "Close": 17887.75
//     },
//     {
//       "LastTradeTime": 1675832400,
//       "QuotationLot": 50,
//       "TradedQty": 555450,
//       "OpenInterest": 10477350,
//       "Open": 17899,
//       "High": 17899.9,
//       "Low": 17841.65,
//       "Close": 17867.2
//     },
//     {
//       "LastTradeTime": 1675830600,
//       "QuotationLot": 50,
//       "TradedQty": 1308600,
//       "OpenInterest": 10754700,
//       "Open": 17894.25,
//       "High": 17927.65,
//       "Low": 17865,
//       "Close": 17898
//     },
//     {
//       "LastTradeTime": 1675828800,
//       "QuotationLot": 50,
//       "TradedQty": 1236600,
//       "OpenInterest": 10558150,
//       "Open": 17850,
//       "High": 17899.95,
//       "Low": 17850,
//       "Close": 17894.9
//     },
//     {
//       "LastTradeTime": 1675827000,
//       "QuotationLot": 50,
//       "TradedQty": 788150,
//       "OpenInterest": 10441100,
//       "Open": 17802.05,
//       "High": 17854.8,
//       "Low": 17786.05,
//       "Close": 17850.45
//     },
//     {
//       "LastTradeTime": 1675764000,
//       "QuotationLot": 50,
//       "TradedQty": 1400,
//       "OpenInterest": 10790150,
//       "Open": 17780.75,
//       "High": 17780.75,
//       "Low": 17780.75,
//       "Close": 17780.75
//     },
//     {
//       "LastTradeTime": 1675762200,
//       "QuotationLot": 50,
//       "TradedQty": 1121500,
//       "OpenInterest": 10790150,
//       "Open": 17816.55,
//       "High": 17824.9,
//       "Low": 17765.2,
//       "Close": 17780.75
//     },
//     {
//       "LastTradeTime": 1675760400,
//       "QuotationLot": 50,
//       "TradedQty": 528150,
//       "OpenInterest": 10713450,
//       "Open": 17768.35,
//       "High": 17829.95,
//       "Low": 17767.85,
//       "Close": 17820
//     },
//     {
//       "LastTradeTime": 1675758600,
//       "QuotationLot": 50,
//       "TradedQty": 512350,
//       "OpenInterest": 10779600,
//       "Open": 17756.6,
//       "High": 17799,
//       "Low": 17755,
//       "Close": 17769.4
//     },
//     {
//       "LastTradeTime": 1675756800,
//       "QuotationLot": 50,
//       "TradedQty": 526650,
//       "OpenInterest": 10702950,
//       "Open": 17746,
//       "High": 17782.35,
//       "Low": 17746,
//       "Close": 17756.9
//     },
//     {
//       "LastTradeTime": 1675755000,
//       "QuotationLot": 50,
//       "TradedQty": 580350,
//       "OpenInterest": 10724050,
//       "Open": 17723.25,
//       "High": 17749,
//       "Low": 17703,
//       "Close": 17745
//     },
//     {
//       "LastTradeTime": 1675753200,
//       "QuotationLot": 50,
//       "TradedQty": 717850,
//       "OpenInterest": 10569050,
//       "Open": 17765.3,
//       "High": 17765.3,
//       "Low": 17715,
//       "Close": 17724.2
//     },
//     {
//       "LastTradeTime": 1675751400,
//       "QuotationLot": 50,
//       "TradedQty": 1015450,
//       "OpenInterest": 10535750,
//       "Open": 17784.2,
//       "High": 17797.25,
//       "Low": 17750,
//       "Close": 17768.2
//     },
//     {
//       "LastTradeTime": 1675749600,
//       "QuotationLot": 50,
//       "TradedQty": 422950,
//       "OpenInterest": 10632950,
//       "Open": 17806.3,
//       "High": 17807.65,
//       "Low": 17777.35,
//       "Close": 17784.45
//     },
//     {
//       "LastTradeTime": 1675747800,
//       "QuotationLot": 50,
//       "TradedQty": 153500,
//       "OpenInterest": 10581750,
//       "Open": 17814.7,
//       "High": 17830,
//       "Low": 17804,
//       "Close": 17806.3
//     },
//     {
//       "LastTradeTime": 1675746000,
//       "QuotationLot": 50,
//       "TradedQty": 575050,
//       "OpenInterest": 10563100,
//       "Open": 17817,
//       "High": 17845.6,
//       "Low": 17803.5,
//       "Close": 17814.7
//     },
//     {
//       "LastTradeTime": 1675744200,
//       "QuotationLot": 50,
//       "TradedQty": 288200,
//       "OpenInterest": 10453350,
//       "Open": 17802,
//       "High": 17819.9,
//       "Low": 17791.1,
//       "Close": 17817.85
//     },
//     {
//       "LastTradeTime": 1675742400,
//       "QuotationLot": 50,
//       "TradedQty": 800850,
//       "OpenInterest": 10424600,
//       "Open": 17845.3,
//       "High": 17861.75,
//       "Low": 17785,
//       "Close": 17802.8
//     },
//     {
//       "LastTradeTime": 1675740600,
//       "QuotationLot": 50,
//       "TradedQty": 717250,
//       "OpenInterest": 10384550,
//       "Open": 17840,
//       "High": 17864.8,
//       "Low": 17807.75,
//       "Close": 17841.55
//     },
//     {
//       "LastTradeTime": 1675677600,
//       "QuotationLot": 50,
//       "TradedQty": 100,
//       "OpenInterest": 10662150,
//       "Open": 17795,
//       "High": 17795,
//       "Low": 17795,
//       "Close": 17795
//     },
//     {
//       "LastTradeTime": 1675675800,
//       "QuotationLot": 50,
//       "TradedQty": 896250,
//       "OpenInterest": 10662150,
//       "Open": 17803.85,
//       "High": 17827.75,
//       "Low": 17791.75,
//       "Close": 17794.3
//     },
//     {
//       "LastTradeTime": 1675674000,
//       "QuotationLot": 50,
//       "TradedQty": 339900,
//       "OpenInterest": 10724350,
//       "Open": 17803.6,
//       "High": 17815,
//       "Low": 17784,
//       "Close": 17804
//     },
//     {
//       "LastTradeTime": 1675672200,
//       "QuotationLot": 50,
//       "TradedQty": 354100,
//       "OpenInterest": 10692450,
//       "Open": 17821.1,
//       "High": 17835,
//       "Low": 17795.95,
//       "Close": 17806.2
//     },
//     {
//       "LastTradeTime": 1675670400,
//       "QuotationLot": 50,
//       "TradedQty": 666200,
//       "OpenInterest": 10692250,
//       "Open": 17798.15,
//       "High": 17829.55,
//       "Low": 17785.9,
//       "Close": 17821.1
//     },
//     {
//       "LastTradeTime": 1675668600,
//       "QuotationLot": 50,
//       "TradedQty": 203750,
//       "OpenInterest": 10638600,
//       "Open": 17795,
//       "High": 17808.45,
//       "Low": 17771.05,
//       "Close": 17798.15
//     },
//     {
//       "LastTradeTime": 1675666800,
//       "QuotationLot": 50,
//       "TradedQty": 203900,
//       "OpenInterest": 10633650,
//       "Open": 17774.4,
//       "High": 17797,
//       "Low": 17770.05,
//       "Close": 17795
//     },
//     {
//       "LastTradeTime": 1675665000,
//       "QuotationLot": 50,
//       "TradedQty": 465700,
//       "OpenInterest": 10631000,
//       "Open": 17800.75,
//       "High": 17810,
//       "Low": 17766.6,
//       "Close": 17773
//     },
//     {
//       "LastTradeTime": 1675663200,
//       "QuotationLot": 50,
//       "TradedQty": 291350,
//       "OpenInterest": 10677300,
//       "Open": 17790.4,
//       "High": 17801.8,
//       "Low": 17765.4,
//       "Close": 17800
//     },
//     {
//       "LastTradeTime": 1675661400,
//       "QuotationLot": 50,
//       "TradedQty": 346400,
//       "OpenInterest": 10675350,
//       "Open": 17768.3,
//       "High": 17799.3,
//       "Low": 17757.9,
//       "Close": 17790.25
//     },
//     {
//       "LastTradeTime": 1675659600,
//       "QuotationLot": 50,
//       "TradedQty": 621250,
//       "OpenInterest": 10638150,
//       "Open": 17762,
//       "High": 17784.95,
//       "Low": 17744.3,
//       "Close": 17767.1
//     },
//     {
//       "LastTradeTime": 1675657800,
//       "QuotationLot": 50,
//       "TradedQty": 511050,
//       "OpenInterest": 10477900,
//       "Open": 17816.45,
//       "High": 17833.9,
//       "Low": 17761,
//       "Close": 17762.3
//     },
//     {
//       "LastTradeTime": 1675656000,
//       "QuotationLot": 50,
//       "TradedQty": 1309350,
//       "OpenInterest": 10394700,
//       "Open": 17792.65,
//       "High": 17851,
//       "Low": 17755.55,
//       "Close": 17818.8
//     },
//     {
//       "LastTradeTime": 1675654200,
//       "QuotationLot": 50,
//       "TradedQty": 986100,
//       "OpenInterest": 10246000,
//       "Open": 17840,
//       "High": 17867.5,
//       "Low": 17795.55,
//       "Close": 17796.8
//     },
//     {
//       "LastTradeTime": 1675418400,
//       "QuotationLot": 50,
//       "TradedQty": 0,
//       "OpenInterest": 10433400,
//       "Open": 17877,
//       "High": 17877,
//       "Low": 17877,
//       "Close": 17877
//     },
//     {
//       "LastTradeTime": 1675416600,
//       "QuotationLot": 50,
//       "TradedQty": 1445500,
//       "OpenInterest": 10433400,
//       "Open": 17896.6,
//       "High": 17927,
//       "Low": 17866.95,
//       "Close": 17877
//     },
//     {
//       "LastTradeTime": 1675414800,
//       "QuotationLot": 50,
//       "TradedQty": 1207900,
//       "OpenInterest": 10469850,
//       "Open": 17854,
//       "High": 17900,
//       "Low": 17852.65,
//       "Close": 17893.3
//     },
//     {
//       "LastTradeTime": 1675413000,
//       "QuotationLot": 50,
//       "TradedQty": 1079000,
//       "OpenInterest": 10563000,
//       "Open": 17797,
//       "High": 17858.8,
//       "Low": 17790.1,
//       "Close": 17850.05
//     },
//     {
//       "LastTradeTime": 1675411200,
//       "QuotationLot": 50,
//       "TradedQty": 754550,
//       "OpenInterest": 10532000,
//       "Open": 17754.05,
//       "High": 17809.5,
//       "Low": 17739,
//       "Close": 17797.95
//     },
//     {
//       "LastTradeTime": 1675409400,
//       "QuotationLot": 50,
//       "TradedQty": 300650,
//       "OpenInterest": 10622200,
//       "Open": 17739,
//       "High": 17773,
//       "Low": 17737,
//       "Close": 17754.3
//     },
//     {
//       "LastTradeTime": 1675407600,
//       "QuotationLot": 50,
//       "TradedQty": 602150,
//       "OpenInterest": 10655150,
//       "Open": 17748,
//       "High": 17793.7,
//       "Low": 17730,
//       "Close": 17741.9
//     },
//     {
//       "LastTradeTime": 1675405800,
//       "QuotationLot": 50,
//       "TradedQty": 493950,
//       "OpenInterest": 10651050,
//       "Open": 17715,
//       "High": 17769.25,
//       "Low": 17700.35,
//       "Close": 17747.1
//     },
//     {
//       "LastTradeTime": 1675404000,
//       "QuotationLot": 50,
//       "TradedQty": 594450,
//       "OpenInterest": 10617750,
//       "Open": 17661.8,
//       "High": 17740.95,
//       "Low": 17644,
//       "Close": 17714.8
//     },
//     {
//       "LastTradeTime": 1675402200,
//       "QuotationLot": 50,
//       "TradedQty": 334550,
//       "OpenInterest": 10621900,
//       "Open": 17695.6,
//       "High": 17709.3,
//       "Low": 17651.15,
//       "Close": 17662.5
//     },
//     {
//       "LastTradeTime": 1675400400,
//       "QuotationLot": 50,
//       "TradedQty": 922900,
//       "OpenInterest": 10580050,
//       "Open": 17690,
//       "High": 17716.65,
//       "Low": 17635.65,
//       "Close": 17696.55
//     },
//     {
//       "LastTradeTime": 1675398600,
//       "QuotationLot": 50,
//       "TradedQty": 674500,
//       "OpenInterest": 10522250,
//       "Open": 17742.55,
//       "High": 17752.65,
//       "Low": 17662.5,
//       "Close": 17691.1
//     },
//     {
//       "LastTradeTime": 1675396800,
//       "QuotationLot": 50,
//       "TradedQty": 786500,
//       "OpenInterest": 10506800,
//       "Open": 17748,
//       "High": 17756.45,
//       "Low": 17697,
//       "Close": 17742
//     },
//     {
//       "LastTradeTime": 1675395000,
//       "QuotationLot": 50,
//       "TradedQty": 1248900,
//       "OpenInterest": 10538200,
//       "Open": 17758,
//       "High": 17783,
//       "Low": 17711,
//       "Close": 17746.9
//     },
//     {
//       "LastTradeTime": 1675332000,
//       "QuotationLot": 50,
//       "TradedQty": 2200,
//       "OpenInterest": 11122700,
//       "Open": 17667.7,
//       "High": 17667.7,
//       "Low": 17667.7,
//       "Close": 17667.7
//     },
//     {
//       "LastTradeTime": 1675330200,
//       "QuotationLot": 50,
//       "TradedQty": 1217200,
//       "OpenInterest": 11122700,
//       "Open": 17680,
//       "High": 17708.35,
//       "Low": 17645.1,
//       "Close": 17678.95
//     },
//     {
//       "LastTradeTime": 1675328400,
//       "QuotationLot": 50,
//       "TradedQty": 681850,
//       "OpenInterest": 11238500,
//       "Open": 17685,
//       "High": 17706.8,
//       "Low": 17649.25,
//       "Close": 17676.45
//     },
//     {
//       "LastTradeTime": 1675326600,
//       "QuotationLot": 50,
//       "TradedQty": 692250,
//       "OpenInterest": 11102350,
//       "Open": 17616.35,
//       "High": 17699.95,
//       "Low": 17593.05,
//       "Close": 17685
//     },
//     {
//       "LastTradeTime": 1675324800,
//       "QuotationLot": 50,
//       "TradedQty": 692000,
//       "OpenInterest": 11103950,
//       "Open": 17628.1,
//       "High": 17640,
//       "Low": 17576.85,
//       "Close": 17613.7
//     },
//     {
//       "LastTradeTime": 1675323000,
//       "QuotationLot": 50,
//       "TradedQty": 302550,
//       "OpenInterest": 10981550,
//       "Open": 17660.2,
//       "High": 17674,
//       "Low": 17613.1,
//       "Close": 17631.4
//     },
//     {
//       "LastTradeTime": 1675321200,
//       "QuotationLot": 50,
//       "TradedQty": 471350,
//       "OpenInterest": 11030600,
//       "Open": 17653,
//       "High": 17668.5,
//       "Low": 17628.1,
//       "Close": 17660.95
//     },
//     {
//       "LastTradeTime": 1675319400,
//       "QuotationLot": 50,
//       "TradedQty": 539300,
//       "OpenInterest": 11007600,
//       "Open": 17713.4,
//       "High": 17739.95,
//       "Low": 17650.1,
//       "Close": 17655.95
//     },
//     {
//       "LastTradeTime": 1675317600,
//       "QuotationLot": 50,
//       "TradedQty": 550750,
//       "OpenInterest": 10961600,
//       "Open": 17689.95,
//       "High": 17729.05,
//       "Low": 17653.15,
//       "Close": 17714.1
//     },
//     {
//       "LastTradeTime": 1675315800,
//       "QuotationLot": 50,
//       "TradedQty": 527750,
//       "OpenInterest": 10954800,
//       "Open": 17657.9,
//       "High": 17715.55,
//       "Low": 17642.1,
//       "Close": 17689.95
//     },
//     {
//       "LastTradeTime": 1675314000,
//       "QuotationLot": 50,
//       "TradedQty": 518700,
//       "OpenInterest": 10908300,
//       "Open": 17607,
//       "High": 17688,
//       "Low": 17596.45,
//       "Close": 17657.9
//     },
//     {
//       "LastTradeTime": 1675312200,
//       "QuotationLot": 50,
//       "TradedQty": 771150,
//       "OpenInterest": 10840700,
//       "Open": 17641.05,
//       "High": 17702.05,
//       "Low": 17598.05,
//       "Close": 17611
//     },
//     {
//       "LastTradeTime": 1675310400,
//       "QuotationLot": 50,
//       "TradedQty": 1835200,
//       "OpenInterest": 10776550,
//       "Open": 17637.8,
//       "High": 17736,
//       "Low": 17603.3,
//       "Close": 17641.05
//     },
//     {
//       "LastTradeTime": 1675308600,
//       "QuotationLot": 50,
//       "TradedQty": 1971400,
//       "OpenInterest": 10785150,
//       "Open": 17597.85,
//       "High": 17658,
//       "Low": 17522.9,
//       "Close": 17639.8
//     },
//     {
//       "LastTradeTime": 1675245600,
//       "QuotationLot": 50,
//       "TradedQty": 400,
//       "OpenInterest": 10929200,
//       "Open": 17665,
//       "High": 17665,
//       "Low": 17665,
//       "Close": 17665
//     },
//     {
//       "LastTradeTime": 1675243800,
//       "QuotationLot": 50,
//       "TradedQty": 2630300,
//       "OpenInterest": 10929200,
//       "Open": 17551.4,
//       "High": 17742.35,
//       "Low": 17549.25,
//       "Close": 17664.95
//     },
//     {
//       "LastTradeTime": 1675242000,
//       "QuotationLot": 50,
//       "TradedQty": 3267550,
//       "OpenInterest": 11044350,
//       "Open": 17696.8,
//       "High": 17724.9,
//       "Low": 17472.35,
//       "Close": 17550.95
//     },
//     {
//       "LastTradeTime": 1675240200,
//       "QuotationLot": 50,
//       "TradedQty": 1846200,
//       "OpenInterest": 10757250,
//       "Open": 17758.2,
//       "High": 17825,
//       "Low": 17675,
//       "Close": 17699
//     },
//     {
//       "LastTradeTime": 1675238400,
//       "QuotationLot": 50,
//       "TradedQty": 2159050,
//       "OpenInterest": 10585150,
//       "Open": 17903,
//       "High": 17932.75,
//       "Low": 17758.15,
//       "Close": 17758.15
//     },
//     {
//       "LastTradeTime": 1675236600,
//       "QuotationLot": 50,
//       "TradedQty": 1637100,
//       "OpenInterest": 10469800,
//       "Open": 18060.35,
//       "High": 18063.3,
//       "Low": 17894,
//       "Close": 17902.75
//     },
//     {
//       "LastTradeTime": 1675234800,
//       "QuotationLot": 50,
//       "TradedQty": 2657600,
//       "OpenInterest": 10695600,
//       "Open": 17962.65,
//       "High": 18063.95,
//       "Low": 17962.65,
//       "Close": 18061.65
//     },
//     {
//       "LastTradeTime": 1675233000,
//       "QuotationLot": 50,
//       "TradedQty": 1659750,
//       "OpenInterest": 10408600,
//       "Open": 17901.2,
//       "High": 17984.8,
//       "Low": 17832.1,
//       "Close": 17962.65
//     },
//     {
//       "LastTradeTime": 1675231200,
//       "QuotationLot": 50,
//       "TradedQty": 514800,
//       "OpenInterest": 10336850,
//       "Open": 17886.25,
//       "High": 17915,
//       "Low": 17880,
//       "Close": 17902.1
//     },
//     {
//       "LastTradeTime": 1675229400,
//       "QuotationLot": 50,
//       "TradedQty": 1280750,
//       "OpenInterest": 10333700,
//       "Open": 17911.95,
//       "High": 17945,
//       "Low": 17827.5,
//       "Close": 17882.55
//     },
//     {
//       "LastTradeTime": 1675227600,
//       "QuotationLot": 50,
//       "TradedQty": 619200,
//       "OpenInterest": 10229100,
//       "Open": 17912.1,
//       "High": 17925,
//       "Low": 17888.1,
//       "Close": 17910.1
//     },
//     {
//       "LastTradeTime": 1675225800,
//       "QuotationLot": 50,
//       "TradedQty": 749850,
//       "OpenInterest": 10224150,
//       "Open": 17858.7,
//       "High": 17918.5,
//       "Low": 17850,
//       "Close": 17913
//     },
//     {
//       "LastTradeTime": 1675224000,
//       "QuotationLot": 50,
//       "TradedQty": 934600,
//       "OpenInterest": 10283550,
//       "Open": 17874.75,
//       "High": 17885.95,
//       "Low": 17823.15,
//       "Close": 17861.9
//     },
//     {
//       "LastTradeTime": 1675222200,
//       "QuotationLot": 50,
//       "TradedQty": 1168550,
//       "OpenInterest": 10387950,
//       "Open": 17925,
//       "High": 17925,
//       "Low": 17826.25,
//       "Close": 17876.05
//     },
//     {
//       "LastTradeTime": 1675159200,
//       "QuotationLot": 50,
//       "TradedQty": 2700,
//       "OpenInterest": 10930450,
//       "Open": 17795,
//       "High": 17795,
//       "Low": 17795,
//       "Close": 17795
//     },
//     {
//       "LastTradeTime": 1675157400,
//       "QuotationLot": 50,
//       "TradedQty": 1824500,
//       "OpenInterest": 10930450,
//       "Open": 17790.4,
//       "High": 17836.3,
//       "Low": 17746.25,
//       "Close": 17796.6
//     },
//     {
//       "LastTradeTime": 1675155600,
//       "QuotationLot": 50,
//       "TradedQty": 582450,
//       "OpenInterest": 10902400,
//       "Open": 17747.2,
//       "High": 17803.1,
//       "Low": 17729,
//       "Close": 17790.3
//     },
//     {
//       "LastTradeTime": 1675153800,
//       "QuotationLot": 50,
//       "TradedQty": 652450,
//       "OpenInterest": 10947800,
//       "Open": 17774.8,
//       "High": 17774.8,
//       "Low": 17712.75,
//       "Close": 17743.7
//     },
//     {
//       "LastTradeTime": 1675152000,
//       "QuotationLot": 50,
//       "TradedQty": 776250,
//       "OpenInterest": 10862100,
//       "Open": 17780.2,
//       "High": 17814,
//       "Low": 17748.8,
//       "Close": 17774
//     },
//     {
//       "LastTradeTime": 1675150200,
//       "QuotationLot": 50,
//       "TradedQty": 815950,
//       "OpenInterest": 10842500,
//       "Open": 17730,
//       "High": 17799,
//       "Low": 17725.8,
//       "Close": 17780.2
//     },
//     {
//       "LastTradeTime": 1675148400,
//       "QuotationLot": 50,
//       "TradedQty": 398600,
//       "OpenInterest": 10939500,
//       "Open": 17743.4,
//       "High": 17764.85,
//       "Low": 17726.35,
//       "Close": 17730
//     },
//     {
//       "LastTradeTime": 1675146600,
//       "QuotationLot": 50,
//       "TradedQty": 530100,
//       "OpenInterest": 10964150,
//       "Open": 17751.95,
//       "High": 17762,
//       "Low": 17700.2,
//       "Close": 17741.2
//     },
//     {
//       "LastTradeTime": 1675144800,
//       "QuotationLot": 50,
//       "TradedQty": 614050,
//       "OpenInterest": 10936600,
//       "Open": 17716.75,
//       "High": 17759.05,
//       "Low": 17705.05,
//       "Close": 17750.85
//     },
//     {
//       "LastTradeTime": 1675143000,
//       "QuotationLot": 50,
//       "TradedQty": 581650,
//       "OpenInterest": 11342250,
//       "Open": 17701,
//       "High": 17724.8,
//       "Low": 17660,
//       "Close": 17716.75
//     },
//     {
//       "LastTradeTime": 1675141200,
//       "QuotationLot": 50,
//       "TradedQty": 632200,
//       "OpenInterest": 11240150,
//       "Open": 17721.6,
//       "High": 17739,
//       "Low": 17680,
//       "Close": 17702.25
//     },
//     {
//       "LastTradeTime": 1675139400,
//       "QuotationLot": 50,
//       "TradedQty": 970900,
//       "OpenInterest": 11164950,
//       "Open": 17670.8,
//       "High": 17725.95,
//       "Low": 17636.25,
//       "Close": 17720
//     },
//     {
//       "LastTradeTime": 1675137600,
//       "QuotationLot": 50,
//       "TradedQty": 992400,
//       "OpenInterest": 10917900,
//       "Open": 17717.45,
//       "High": 17728.8,
//       "Low": 17662,
//       "Close": 17673.25
//     },
//     {
//       "LastTradeTime": 1675135800,
//       "QuotationLot": 50,
//       "TradedQty": 1219600,
//       "OpenInterest": 10560550,
//       "Open": 17785,
//       "High": 17802.05,
//       "Low": 17693.1,
//       "Close": 17720
//     },
//     {
//       "LastTradeTime": 1675072800,
//       "QuotationLot": 50,
//       "TradedQty": 350,
//       "OpenInterest": 11054600,
//       "Open": 17742.85,
//       "High": 17742.85,
//       "Low": 17742.85,
//       "Close": 17742.85
//     },
//     {
//       "LastTradeTime": 1675071000,
//       "QuotationLot": 50,
//       "TradedQty": 1960900,
//       "OpenInterest": 11054600,
//       "Open": 17676.75,
//       "High": 17777.6,
//       "Low": 17676.75,
//       "Close": 17742.5
//     },
//     {
//       "LastTradeTime": 1675069200,
//       "QuotationLot": 50,
//       "TradedQty": 615150,
//       "OpenInterest": 11306650,
//       "Open": 17650.85,
//       "High": 17704,
//       "Low": 17637,
//       "Close": 17675.05
//     },
//     {
//       "LastTradeTime": 1675067400,
//       "QuotationLot": 50,
//       "TradedQty": 1099650,
//       "OpenInterest": 11319550,
//       "Open": 17560,
//       "High": 17683.55,
//       "Low": 17556.35,
//       "Close": 17652.55
//     },
//     {
//       "LastTradeTime": 1675065600,
//       "QuotationLot": 50,
//       "TradedQty": 846400,
//       "OpenInterest": 11347850,
//       "Open": 17625.55,
//       "High": 17625.55,
//       "Low": 17522.25,
//       "Close": 17561.15
//     },
//     {
//       "LastTradeTime": 1675063800,
//       "QuotationLot": 50,
//       "TradedQty": 576450,
//       "OpenInterest": 11554300,
//       "Open": 17622,
//       "High": 17638,
//       "Low": 17580.5,
//       "Close": 17628
//     },
//     {
//       "LastTradeTime": 1675062000,
//       "QuotationLot": 50,
//       "TradedQty": 485200,
//       "OpenInterest": 11460100,
//       "Open": 17684.85,
//       "High": 17684.85,
//       "Low": 17618.7,
//       "Close": 17622.7
//     },
//     {
//       "LastTradeTime": 1675060200,
//       "QuotationLot": 50,
//       "TradedQty": 438300,
//       "OpenInterest": 11391000,
//       "Open": 17739,
//       "High": 17752.45,
//       "Low": 17678.45,
//       "Close": 17684.9
//     },
//     {
//       "LastTradeTime": 1675058400,
//       "QuotationLot": 50,
//       "TradedQty": 377950,
//       "OpenInterest": 11395850,
//       "Open": 17666.55,
//       "High": 17738.5,
//       "Low": 17653,
//       "Close": 17738.5
//     },
//     {
//       "LastTradeTime": 1675056600,
//       "QuotationLot": 50,
//       "TradedQty": 365500,
//       "OpenInterest": 11363550,
//       "Open": 17670.1,
//       "High": 17704,
//       "Low": 17652,
//       "Close": 17665.25
//     },
//     {
//       "LastTradeTime": 1675054800,
//       "QuotationLot": 50,
//       "TradedQty": 564000,
//       "OpenInterest": 11369800,
//       "Open": 17710,
//       "High": 17718.95,
//       "Low": 17656.45,
//       "Close": 17670.1
//     },
//     {
//       "LastTradeTime": 1675053000,
//       "QuotationLot": 50,
//       "TradedQty": 804650,
//       "OpenInterest": 11264300,
//       "Open": 17742.65,
//       "High": 17769.5,
//       "Low": 17687.8,
//       "Close": 17710.3
//     },
//     {
//       "LastTradeTime": 1675051200,
//       "QuotationLot": 50,
//       "TradedQty": 1738500,
//       "OpenInterest": 11090250,
//       "Open": 17791.9,
//       "High": 17829,
//       "Low": 17710.85,
//       "Close": 17744.65
//     },
//     {
//       "LastTradeTime": 1675049400,
//       "QuotationLot": 50,
//       "TradedQty": 2521700,
//       "OpenInterest": 11193200,
//       "Open": 17639.95,
//       "High": 17793,
//       "Low": 17542.2,
//       "Close": 17788.95
//     },
//     {
//       "LastTradeTime": 1674813600,
//       "QuotationLot": 50,
//       "TradedQty": 250,
//       "OpenInterest": 11654050,
//       "Open": 17694.95,
//       "High": 17694.95,
//       "Low": 17694.95,
//       "Close": 17694.95
//     },
//     {
//       "LastTradeTime": 1674811800,
//       "QuotationLot": 50,
//       "TradedQty": 1741900,
//       "OpenInterest": 11654050,
//       "Open": 17629.5,
//       "High": 17714.7,
//       "Low": 17629.5,
//       "Close": 17694.95
//     },
//     {
//       "LastTradeTime": 1674810000,
//       "QuotationLot": 50,
//       "TradedQty": 586350,
//       "OpenInterest": 11545500,
//       "Open": 17604.95,
//       "High": 17647,
//       "Low": 17595.9,
//       "Close": 17626.65
//     },
//     {
//       "LastTradeTime": 1674808200,
//       "QuotationLot": 50,
//       "TradedQty": 653900,
//       "OpenInterest": 11531400,
//       "Open": 17630,
//       "High": 17653.45,
//       "Low": 17576.8,
//       "Close": 17603.1
//     },
//     {
//       "LastTradeTime": 1674806400,
//       "QuotationLot": 50,
//       "TradedQty": 928350,
//       "OpenInterest": 11706400,
//       "Open": 17653.8,
//       "High": 17665.25,
//       "Low": 17597.95,
//       "Close": 17631.75
//     },
//     {
//       "LastTradeTime": 1674804600,
//       "QuotationLot": 50,
//       "TradedQty": 663800,
//       "OpenInterest": 11514200,
//       "Open": 17659.4,
//       "High": 17709.9,
//       "Low": 17642.6,
//       "Close": 17653.8
//     },
//     {
//       "LastTradeTime": 1674802800,
//       "QuotationLot": 50,
//       "TradedQty": 1230850,
//       "OpenInterest": 11457250,
//       "Open": 17699.15,
//       "High": 17699.15,
//       "Low": 17622.35,
//       "Close": 17658
//     },
//     {
//       "LastTradeTime": 1674801000,
//       "QuotationLot": 50,
//       "TradedQty": 725150,
//       "OpenInterest": 11157500,
//       "Open": 17763.85,
//       "High": 17767.7,
//       "Low": 17688,
//       "Close": 17701.05
//     },
//     {
//       "LastTradeTime": 1674799200,
//       "QuotationLot": 50,
//       "TradedQty": 745150,
//       "OpenInterest": 10983650,
//       "Open": 17772,
//       "High": 17786.25,
//       "Low": 17730,
//       "Close": 17765.15
//     },
//     {
//       "LastTradeTime": 1674797400,
//       "QuotationLot": 50,
//       "TradedQty": 497500,
//       "OpenInterest": 10829450,
//       "Open": 17805.65,
//       "High": 17808.85,
//       "Low": 17770,
//       "Close": 17771.75
//     },
//     {
//       "LastTradeTime": 1674795600,
//       "QuotationLot": 50,
//       "TradedQty": 2029100,
//       "OpenInterest": 10695100,
//       "Open": 17818.95,
//       "High": 17899.4,
//       "Low": 17789.05,
//       "Close": 17805.9
//     },
//     {
//       "LastTradeTime": 1674793800,
//       "QuotationLot": 50,
//       "TradedQty": 1193400,
//       "OpenInterest": 10533750,
//       "Open": 17860,
//       "High": 17872.75,
//       "Low": 17775.65,
//       "Close": 17819.55
//     },
//     {
//       "LastTradeTime": 1674792000,
//       "QuotationLot": 50,
//       "TradedQty": 1294150,
//       "OpenInterest": 10350050,
//       "Open": 17847.45,
//       "High": 17930.4,
//       "Low": 17827.05,
//       "Close": 17862
//     },
//     {
//       "LastTradeTime": 1674790200,
//       "QuotationLot": 50,
//       "TradedQty": 1360300,
//       "OpenInterest": 10160200,
//       "Open": 17988,
//       "High": 17995,
//       "Low": 17846,
//       "Close": 17846
//     },
//     {
//       "LastTradeTime": 1674640800,
//       "QuotationLot": 50,
//       "TradedQty": 350,
//       "OpenInterest": 4841850,
//       "Open": 17890.8,
//       "High": 17890.8,
//       "Low": 17890.8,
//       "Close": 17890.8
//     },
//     {
//       "LastTradeTime": 1674639000,
//       "QuotationLot": 50,
//       "TradedQty": 1014950,
//       "OpenInterest": 4841850,
//       "Open": 17907.2,
//       "High": 17915,
//       "Low": 17871,
//       "Close": 17891.05
//     },
//     {
//       "LastTradeTime": 1674637200,
//       "QuotationLot": 50,
//       "TradedQty": 706150,
//       "OpenInterest": 5417500,
//       "Open": 17929,
//       "High": 17931.9,
//       "Low": 17883.65,
//       "Close": 17907.2
//     },
//     {
//       "LastTradeTime": 1674635400,
//       "QuotationLot": 50,
//       "TradedQty": 450500,
//       "OpenInterest": 5872000,
//       "Open": 17917.9,
//       "High": 17951.9,
//       "Low": 17914.85,
//       "Close": 17928
//     },
//     {
//       "LastTradeTime": 1674633600,
//       "QuotationLot": 50,
//       "TradedQty": 640100,
//       "OpenInterest": 5910250,
//       "Open": 17906.65,
//       "High": 17936,
//       "Low": 17893.45,
//       "Close": 17918.45
//     },
//     {
//       "LastTradeTime": 1674631800,
//       "QuotationLot": 50,
//       "TradedQty": 417750,
//       "OpenInterest": 5886650,
//       "Open": 17930.35,
//       "High": 17936.95,
//       "Low": 17898.6,
//       "Close": 17906
//     },
//     {
//       "LastTradeTime": 1674630000,
//       "QuotationLot": 50,
//       "TradedQty": 537050,
//       "OpenInterest": 5954850,
//       "Open": 17907.15,
//       "High": 17940,
//       "Low": 17880,
//       "Close": 17930.7
//     },
//     {
//       "LastTradeTime": 1674628200,
//       "QuotationLot": 50,
//       "TradedQty": 515900,
//       "OpenInterest": 6504700,
//       "Open": 17898.4,
//       "High": 17920,
//       "Low": 17887.05,
//       "Close": 17906.6
//     },
//     {
//       "LastTradeTime": 1674626400,
//       "QuotationLot": 50,
//       "TradedQty": 680700,
//       "OpenInterest": 6513750,
//       "Open": 17865.2,
//       "High": 17910.05,
//       "Low": 17845.3,
//       "Close": 17897.55
//     },
//     {
//       "LastTradeTime": 1674624600,
//       "QuotationLot": 50,
//       "TradedQty": 967500,
//       "OpenInterest": 6457200,
//       "Open": 17916.9,
//       "High": 17946,
//       "Low": 17852.4,
//       "Close": 17865.2
//     },
//     {
//       "LastTradeTime": 1674622800,
//       "QuotationLot": 50,
//       "TradedQty": 773250,
//       "OpenInterest": 6571600,
//       "Open": 17948.35,
//       "High": 17955,
//       "Low": 17914.85,
//       "Close": 17917.3
//     },
//     {
//       "LastTradeTime": 1674621000,
//       "QuotationLot": 50,
//       "TradedQty": 1124250,
//       "OpenInterest": 6586950,
//       "Open": 18003.3,
//       "High": 18008,
//       "Low": 17940,
//       "Close": 17948
//     },
//     {
//       "LastTradeTime": 1674619200,
//       "QuotationLot": 50,
//       "TradedQty": 948950,
//       "OpenInterest": 6482450,
//       "Open": 18053.9,
//       "High": 18060,
//       "Low": 17990.3,
//       "Close": 18001.8
//     },
//     {
//       "LastTradeTime": 1674617400,
//       "QuotationLot": 50,
//       "TradedQty": 509550,
//       "OpenInterest": 6699350,
//       "Open": 18109.8,
//       "High": 18109.85,
//       "Low": 18046.15,
//       "Close": 18055.05
//     },
//     {
//       "LastTradeTime": 1674554400,
//       "QuotationLot": 50,
//       "TradedQty": 150,
//       "OpenInterest": 9437650,
//       "Open": 18118.9,
//       "High": 18118.9,
//       "Low": 18118.9,
//       "Close": 18118.9
//     },
//     {
//       "LastTradeTime": 1674552600,
//       "QuotationLot": 50,
//       "TradedQty": 762900,
//       "OpenInterest": 9437650,
//       "Open": 18129.55,
//       "High": 18142.95,
//       "Low": 18117.1,
//       "Close": 18117.95
//     },
//     {
//       "LastTradeTime": 1674550800,
//       "QuotationLot": 50,
//       "TradedQty": 368700,
//       "OpenInterest": 9506100,
//       "Open": 18112.6,
//       "High": 18139.5,
//       "Low": 18108.9,
//       "Close": 18132.3
//     },
//     {
//       "LastTradeTime": 1674549000,
//       "QuotationLot": 50,
//       "TradedQty": 589350,
//       "OpenInterest": 9500050,
//       "Open": 18119,
//       "High": 18132.05,
//       "Low": 18103.95,
//       "Close": 18112.6
//     },
//     {
//       "LastTradeTime": 1674547200,
//       "QuotationLot": 50,
//       "TradedQty": 686800,
//       "OpenInterest": 9378900,
//       "Open": 18142.25,
//       "High": 18147,
//       "Low": 18100.05,
//       "Close": 18119
//     },
//     {
//       "LastTradeTime": 1674545400,
//       "QuotationLot": 50,
//       "TradedQty": 354650,
//       "OpenInterest": 9357550,
//       "Open": 18163.05,
//       "High": 18164.1,
//       "Low": 18140.6,
//       "Close": 18142.25
//     },
//     {
//       "LastTradeTime": 1674543600,
//       "QuotationLot": 50,
//       "TradedQty": 446400,
//       "OpenInterest": 9215650,
//       "Open": 18142.65,
//       "High": 18166.45,
//       "Low": 18133,
//       "Close": 18163.35
//     },
//     {
//       "LastTradeTime": 1674541800,
//       "QuotationLot": 50,
//       "TradedQty": 470050,
//       "OpenInterest": 9075400,
//       "Open": 18157.25,
//       "High": 18161.55,
//       "Low": 18136.55,
//       "Close": 18143.15
//     },
//     {
//       "LastTradeTime": 1674540000,
//       "QuotationLot": 50,
//       "TradedQty": 310300,
//       "OpenInterest": 9012200,
//       "Open": 18174.15,
//       "High": 18177.85,
//       "Low": 18153.2,
//       "Close": 18158.2
//     },
//     {
//       "LastTradeTime": 1674538200,
//       "QuotationLot": 50,
//       "TradedQty": 346600,
//       "OpenInterest": 9022100,
//       "Open": 18188.75,
//       "High": 18194.15,
//       "Low": 18158.15,
//       "Close": 18174.15
//     },
//     {
//       "LastTradeTime": 1674536400,
//       "QuotationLot": 50,
//       "TradedQty": 338050,
//       "OpenInterest": 8973750,
//       "Open": 18167.7,
//       "High": 18194.9,
//       "Low": 18162.5,
//       "Close": 18188
//     },
//     {
//       "LastTradeTime": 1674534600,
//       "QuotationLot": 50,
//       "TradedQty": 455350,
//       "OpenInterest": 8923950,
//       "Open": 18184.4,
//       "High": 18186.4,
//       "Low": 18156.05,
//       "Close": 18170
//     },
//     {
//       "LastTradeTime": 1674532800,
//       "QuotationLot": 50,
//       "TradedQty": 691200,
//       "OpenInterest": 8954450,
//       "Open": 18195.9,
//       "High": 18218.45,
//       "Low": 18165,
//       "Close": 18184.4
//     },
//     {
//       "LastTradeTime": 1674531000,
//       "QuotationLot": 50,
//       "TradedQty": 520900,
//       "OpenInterest": 8935600,
//       "Open": 18210,
//       "High": 18210.05,
//       "Low": 18176.15,
//       "Close": 18193
//     },
//     {
//       "LastTradeTime": 1674468000,
//       "QuotationLot": 50,
//       "TradedQty": 0,
//       "OpenInterest": 10918400,
//       "Open": 18150.8,
//       "High": 18150.8,
//       "Low": 18150.8,
//       "Close": 18150.8
//     },
//     {
//       "LastTradeTime": 1674466200,
//       "QuotationLot": 50,
//       "TradedQty": 762850,
//       "OpenInterest": 10918400,
//       "Open": 18146.9,
//       "High": 18158.7,
//       "Low": 18127.3,
//       "Close": 18150.8
//     },
//     {
//       "LastTradeTime": 1674464400,
//       "QuotationLot": 50,
//       "TradedQty": 507150,
//       "OpenInterest": 11099800,
//       "Open": 18156.6,
//       "High": 18164,
//       "Low": 18139.15,
//       "Close": 18143.85
//     },
//     {
//       "LastTradeTime": 1674462600,
//       "QuotationLot": 50,
//       "TradedQty": 424500,
//       "OpenInterest": 10997900,
//       "Open": 18148,
//       "High": 18173.05,
//       "Low": 18136.55,
//       "Close": 18156.45
//     },
//     {
//       "LastTradeTime": 1674460800,
//       "QuotationLot": 50,
//       "TradedQty": 614450,
//       "OpenInterest": 10964550,
//       "Open": 18140,
//       "High": 18163.5,
//       "Low": 18132,
//       "Close": 18148
//     },
//     {
//       "LastTradeTime": 1674459000,
//       "QuotationLot": 50,
//       "TradedQty": 338100,
//       "OpenInterest": 10690300,
//       "Open": 18123.8,
//       "High": 18140.15,
//       "Low": 18112.5,
//       "Close": 18138.85
//     },
//     {
//       "LastTradeTime": 1674457200,
//       "QuotationLot": 50,
//       "TradedQty": 383350,
//       "OpenInterest": 10634250,
//       "Open": 18147.6,
//       "High": 18147.6,
//       "Low": 18117.4,
//       "Close": 18127
//     },
//     {
//       "LastTradeTime": 1674455400,
//       "QuotationLot": 50,
//       "TradedQty": 450000,
//       "OpenInterest": 10647300,
//       "Open": 18158.25,
//       "High": 18164.45,
//       "Low": 18137.7,
//       "Close": 18147.95
//     },
//     {
//       "LastTradeTime": 1674453600,
//       "QuotationLot": 50,
//       "TradedQty": 212800,
//       "OpenInterest": 10519750,
//       "Open": 18167,
//       "High": 18179,
//       "Low": 18154.5,
//       "Close": 18160
//     },
//     {
//       "LastTradeTime": 1674451800,
//       "QuotationLot": 50,
//       "TradedQty": 408250,
//       "OpenInterest": 10510800,
//       "Open": 18182.45,
//       "High": 18185,
//       "Low": 18162,
//       "Close": 18168.4
//     },
//     {
//       "LastTradeTime": 1674450000,
//       "QuotationLot": 50,
//       "TradedQty": 294400,
//       "OpenInterest": 10386450,
//       "Open": 18181.15,
//       "High": 18187,
//       "Low": 18164.7,
//       "Close": 18182.45
//     },
//     {
//       "LastTradeTime": 1674448200,
//       "QuotationLot": 50,
//       "TradedQty": 478950,
//       "OpenInterest": 10431300,
//       "Open": 18186.15,
//       "High": 18193.95,
//       "Low": 18173.3,
//       "Close": 18184.4
//     },
//     {
//       "LastTradeTime": 1674446400,
//       "QuotationLot": 50,
//       "TradedQty": 1086400,
//       "OpenInterest": 10550100,
//       "Open": 18124.45,
//       "High": 18189.9,
//       "Low": 18124.45,
//       "Close": 18186.15
//     },
//     {
//       "LastTradeTime": 1674444600,
//       "QuotationLot": 50,
//       "TradedQty": 672400,
//       "OpenInterest": 10417250,
//       "Open": 18120,
//       "High": 18137,
//       "Low": 18090.95,
//       "Close": 18123.65
//     },
//     {
//       "LastTradeTime": 1674208800,
//       "QuotationLot": 50,
//       "TradedQty": 0,
//       "OpenInterest": 10835900,
//       "Open": 18055.95,
//       "High": 18055.95,
//       "Low": 18055.95,
//       "Close": 18055.95
//     },
//     {
//       "LastTradeTime": 1674207000,
//       "QuotationLot": 50,
//       "TradedQty": 820200,
//       "OpenInterest": 10835900,
//       "Open": 18076,
//       "High": 18077.65,
//       "Low": 18042.75,
//       "Close": 18055.95
//     },
//     {
//       "LastTradeTime": 1674205200,
//       "QuotationLot": 50,
//       "TradedQty": 792100,
//       "OpenInterest": 10768400,
//       "Open": 18077.6,
//       "High": 18081,
//       "Low": 18036,
//       "Close": 18072.7
//     },
//     {
//       "LastTradeTime": 1674203400,
//       "QuotationLot": 50,
//       "TradedQty": 645750,
//       "OpenInterest": 10847250,
//       "Open": 18083.9,
//       "High": 18091.95,
//       "Low": 18061.45,
//       "Close": 18077.6
//     },
//     {
//       "LastTradeTime": 1674201600,
//       "QuotationLot": 50,
//       "TradedQty": 470900,
//       "OpenInterest": 10835300,
//       "Open": 18126,
//       "High": 18128.9,
//       "Low": 18082.7,
//       "Close": 18086
//     },
//     {
//       "LastTradeTime": 1674199800,
//       "QuotationLot": 50,
//       "TradedQty": 285500,
//       "OpenInterest": 10811500,
//       "Open": 18122.3,
//       "High": 18141.9,
//       "Low": 18117,
//       "Close": 18126
//     },
//     {
//       "LastTradeTime": 1674198000,
//       "QuotationLot": 50,
//       "TradedQty": 273550,
//       "OpenInterest": 10785950,
//       "Open": 18129.5,
//       "High": 18134,
//       "Low": 18103.55,
//       "Close": 18122.35
//     },
//     {
//       "LastTradeTime": 1674196200,
//       "QuotationLot": 50,
//       "TradedQty": 245450,
//       "OpenInterest": 10852350,
//       "Open": 18107,
//       "High": 18133.8,
//       "Low": 18105,
//       "Close": 18129.5
//     },
//     {
//       "LastTradeTime": 1674194400,
//       "QuotationLot": 50,
//       "TradedQty": 299350,
//       "OpenInterest": 10875700,
//       "Open": 18138.8,
//       "High": 18144.4,
//       "Low": 18105.25,
//       "Close": 18106.2
//     },
//     {
//       "LastTradeTime": 1674192600,
//       "QuotationLot": 50,
//       "TradedQty": 425250,
//       "OpenInterest": 10886000,
//       "Open": 18145,
//       "High": 18149.75,
//       "Low": 18121.15,
//       "Close": 18138.05
//     },
//     {
//       "LastTradeTime": 1674190800,
//       "QuotationLot": 50,
//       "TradedQty": 569100,
//       "OpenInterest": 10911550,
//       "Open": 18150.55,
//       "High": 18170.8,
//       "Low": 18142.4,
//       "Close": 18144.7
//     },
//     {
//       "LastTradeTime": 1674189000,
//       "QuotationLot": 50,
//       "TradedQty": 783050,
//       "OpenInterest": 10830400,
//       "Open": 18098.65,
//       "High": 18156.6,
//       "Low": 18098.65,
//       "Close": 18150.5
//     },
//     {
//       "LastTradeTime": 1674187200,
//       "QuotationLot": 50,
//       "TradedQty": 645900,
//       "OpenInterest": 10752950,
//       "Open": 18104.8,
//       "High": 18124,
//       "Low": 18084.2,
//       "Close": 18098.6
//     },
//     {
//       "LastTradeTime": 1674185400,
//       "QuotationLot": 50,
//       "TradedQty": 631200,
//       "OpenInterest": 10684650,
//       "Open": 18150,
//       "High": 18150,
//       "Low": 18091,
//       "Close": 18102.35
//     },
//     {
//       "LastTradeTime": 1674122400,
//       "QuotationLot": 50,
//       "TradedQty": 550,
//       "OpenInterest": 10935600,
//       "Open": 18105.6,
//       "High": 18105.6,
//       "Low": 18105.6,
//       "Close": 18105.6
//     },
//     {
//       "LastTradeTime": 1674120600,
//       "QuotationLot": 50,
//       "TradedQty": 1054550,
//       "OpenInterest": 10935600,
//       "Open": 18113.7,
//       "High": 18133.9,
//       "Low": 18099.4,
//       "Close": 18104
//     },
//     {
//       "LastTradeTime": 1674118800,
//       "QuotationLot": 50,
//       "TradedQty": 351200,
//       "OpenInterest": 11065300,
//       "Open": 18106.75,
//       "High": 18127,
//       "Low": 18097.65,
//       "Close": 18113.45
//     },
//     {
//       "LastTradeTime": 1674117000,
//       "QuotationLot": 50,
//       "TradedQty": 503200,
//       "OpenInterest": 11052400,
//       "Open": 18138.75,
//       "High": 18161.95,
//       "Low": 18101.6,
//       "Close": 18107.3
//     },
//     {
//       "LastTradeTime": 1674115200,
//       "QuotationLot": 50,
//       "TradedQty": 221500,
//       "OpenInterest": 11138750,
//       "Open": 18140.55,
//       "High": 18155,
//       "Low": 18133.2,
//       "Close": 18138.75
//     },
//     {
//       "LastTradeTime": 1674113400,
//       "QuotationLot": 50,
//       "TradedQty": 202950,
//       "OpenInterest": 11180100,
//       "Open": 18129,
//       "High": 18149.2,
//       "Low": 18119.45,
//       "Close": 18140.55
//     },
//     {
//       "LastTradeTime": 1674111600,
//       "QuotationLot": 50,
//       "TradedQty": 347350,
//       "OpenInterest": 11187600,
//       "Open": 18148.05,
//       "High": 18158.5,
//       "Low": 18117.2,
//       "Close": 18130.25
//     },
//     {
//       "LastTradeTime": 1674109800,
//       "QuotationLot": 50,
//       "TradedQty": 302750,
//       "OpenInterest": 11232850,
//       "Open": 18145,
//       "High": 18157.95,
//       "Low": 18137.15,
//       "Close": 18148.05
//     },
//     {
//       "LastTradeTime": 1674108000,
//       "QuotationLot": 50,
//       "TradedQty": 554800,
//       "OpenInterest": 11255150,
//       "Open": 18142.7,
//       "High": 18169.75,
//       "Low": 18132.85,
//       "Close": 18145
//     },
//     {
//       "LastTradeTime": 1674106200,
//       "QuotationLot": 50,
//       "TradedQty": 566550,
//       "OpenInterest": 11177100,
//       "Open": 18147.45,
//       "High": 18177.75,
//       "Low": 18129.5,
//       "Close": 18142.7
//     },
//     {
//       "LastTradeTime": 1674104400,
//       "QuotationLot": 50,
//       "TradedQty": 396800,
//       "OpenInterest": 11244850,
//       "Open": 18117,
//       "High": 18148.7,
//       "Low": 18111,
//       "Close": 18146.95
//     },
//     {
//       "LastTradeTime": 1674102600,
//       "QuotationLot": 50,
//       "TradedQty": 692800,
//       "OpenInterest": 11194650,
//       "Open": 18117.25,
//       "High": 18123.7,
//       "Low": 18081,
//       "Close": 18115.4
//     },
//     {
//       "LastTradeTime": 1674100800,
//       "QuotationLot": 50,
//       "TradedQty": 878650,
//       "OpenInterest": 11228100,
//       "Open": 18113.5,
//       "High": 18154.2,
//       "Low": 18107,
//       "Close": 18118
//     },
//     {
//       "LastTradeTime": 1674099000,
//       "QuotationLot": 50,
//       "TradedQty": 833100,
//       "OpenInterest": 11287500,
//       "Open": 18151,
//       "High": 18174.75,
//       "Low": 18111.25,
//       "Close": 18111.25
//     },
//     {
//       "LastTradeTime": 1674036000,
//       "QuotationLot": 50,
//       "TradedQty": 700,
//       "OpenInterest": 11542600,
//       "Open": 18204.1,
//       "High": 18204.1,
//       "Low": 18204.1,
//       "Close": 18204.1
//     },
//     {
//       "LastTradeTime": 1674034200,
//       "QuotationLot": 50,
//       "TradedQty": 817850,
//       "OpenInterest": 11542600,
//       "Open": 18217.9,
//       "High": 18218.25,
//       "Low": 18182.45,
//       "Close": 18204.1
//     },
//     {
//       "LastTradeTime": 1674032400,
//       "QuotationLot": 50,
//       "TradedQty": 416500,
//       "OpenInterest": 11605250,
//       "Open": 18202.6,
//       "High": 18223.65,
//       "Low": 18199.85,
//       "Close": 18216.85
//     },
//     {
//       "LastTradeTime": 1674030600,
//       "QuotationLot": 50,
//       "TradedQty": 465600,
//       "OpenInterest": 11545100,
//       "Open": 18198.2,
//       "High": 18207.9,
//       "Low": 18172.1,
//       "Close": 18202.45
//     },
//     {
//       "LastTradeTime": 1674028800,
//       "QuotationLot": 50,
//       "TradedQty": 492950,
//       "OpenInterest": 11634800,
//       "Open": 18192.45,
//       "High": 18224.6,
//       "Low": 18190.25,
//       "Close": 18200.7
//     },
//     {
//       "LastTradeTime": 1674027000,
//       "QuotationLot": 50,
//       "TradedQty": 259650,
//       "OpenInterest": 11517200,
//       "Open": 18185,
//       "High": 18200,
//       "Low": 18179.3,
//       "Close": 18192.45
//     },
//     {
//       "LastTradeTime": 1674025200,
//       "QuotationLot": 50,
//       "TradedQty": 330550,
//       "OpenInterest": 11822550,
//       "Open": 18206.6,
//       "High": 18211.85,
//       "Low": 18184.6,
//       "Close": 18186.1
//     },
//     {
//       "LastTradeTime": 1674023400,
//       "QuotationLot": 50,
//       "TradedQty": 264300,
//       "OpenInterest": 11757250,
//       "Open": 18199.9,
//       "High": 18213.8,
//       "Low": 18194.55,
//       "Close": 18208
//     },
//     {
//       "LastTradeTime": 1674021600,
//       "QuotationLot": 50,
//       "TradedQty": 589700,
//       "OpenInterest": 11720350,
//       "Open": 18187.7,
//       "High": 18211.5,
//       "Low": 18183.95,
//       "Close": 18199.9
//     },
//     {
//       "LastTradeTime": 1674019800,
//       "QuotationLot": 50,
//       "TradedQty": 645250,
//       "OpenInterest": 11632150,
//       "Open": 18154.85,
//       "High": 18196.5,
//       "Low": 18146.15,
//       "Close": 18187.7
//     },
//     {
//       "LastTradeTime": 1674018000,
//       "QuotationLot": 50,
//       "TradedQty": 305900,
//       "OpenInterest": 11570350,
//       "Open": 18142.6,
//       "High": 18163.35,
//       "Low": 18137.7,
//       "Close": 18154.5
//     },
//     {
//       "LastTradeTime": 1674016200,
//       "QuotationLot": 50,
//       "TradedQty": 536550,
//       "OpenInterest": 11561000,
//       "Open": 18143.7,
//       "High": 18159.95,
//       "Low": 18138,
//       "Close": 18142.6
//     },
//     {
//       "LastTradeTime": 1674014400,
//       "QuotationLot": 50,
//       "TradedQty": 837550,
//       "OpenInterest": 11569600,
//       "Open": 18105.65,
//       "High": 18147.85,
//       "Low": 18088.55,
//       "Close": 18143.7
//     },
//     {
//       "LastTradeTime": 1674012600,
//       "QuotationLot": 50,
//       "TradedQty": 983450,
//       "OpenInterest": 11537600,
//       "Open": 18112,
//       "High": 18130,
//       "Low": 18071.1,
//       "Close": 18105.3
//     },
//     {
//       "LastTradeTime": 1673949600,
//       "QuotationLot": 50,
//       "TradedQty": 950,
//       "OpenInterest": 11898100,
//       "Open": 18092.5,
//       "High": 18092.5,
//       "Low": 18092.5,
//       "Close": 18092.5
//     },
//     {
//       "LastTradeTime": 1673947800,
//       "QuotationLot": 50,
//       "TradedQty": 1587950,
//       "OpenInterest": 11898100,
//       "Open": 18045.95,
//       "High": 18103.9,
//       "Low": 18045.95,
//       "Close": 18091.3
//     },
//     {
//       "LastTradeTime": 1673946000,
//       "QuotationLot": 50,
//       "TradedQty": 431100,
//       "OpenInterest": 11758800,
//       "Open": 18030,
//       "High": 18057.35,
//       "Low": 18025.1,
//       "Close": 18044.9
//     },
//     {
//       "LastTradeTime": 1673944200,
//       "QuotationLot": 50,
//       "TradedQty": 352300,
//       "OpenInterest": 11746950,
//       "Open": 18027,
//       "High": 18049,
//       "Low": 18009.1,
//       "Close": 18030
//     },
//     {
//       "LastTradeTime": 1673942400,
//       "QuotationLot": 50,
//       "TradedQty": 513550,
//       "OpenInterest": 11677700,
//       "Open": 17982.6,
//       "High": 18046.8,
//       "Low": 17982.6,
//       "Close": 18027.3
//     },
//     {
//       "LastTradeTime": 1673940600,
//       "QuotationLot": 50,
//       "TradedQty": 491750,
//       "OpenInterest": 11661100,
//       "Open": 18005.85,
//       "High": 18016.6,
//       "Low": 17973,
//       "Close": 17981.95
//     },
//     {
//       "LastTradeTime": 1673938800,
//       "QuotationLot": 50,
//       "TradedQty": 490750,
//       "OpenInterest": 11680600,
//       "Open": 18030.45,
//       "High": 18036,
//       "Low": 18002,
//       "Close": 18005
//     },
//     {
//       "LastTradeTime": 1673937000,
//       "QuotationLot": 50,
//       "TradedQty": 268300,
//       "OpenInterest": 11755700,
//       "Open": 18057.5,
//       "High": 18060,
//       "Low": 18025.75,
//       "Close": 18030.45
//     },
//     {
//       "LastTradeTime": 1673935200,
//       "QuotationLot": 50,
//       "TradedQty": 346000,
//       "OpenInterest": 11784900,
//       "Open": 18035,
//       "High": 18066.5,
//       "Low": 18030.55,
//       "Close": 18057.3
//     },
//     {
//       "LastTradeTime": 1673933400,
//       "QuotationLot": 50,
//       "TradedQty": 285200,
//       "OpenInterest": 11766800,
//       "Open": 18030.45,
//       "High": 18040,
//       "Low": 18014.35,
//       "Close": 18035
//     },
//     {
//       "LastTradeTime": 1673931600,
//       "QuotationLot": 50,
//       "TradedQty": 599900,
//       "OpenInterest": 11741350,
//       "Open": 18061,
//       "High": 18077.7,
//       "Low": 18021.15,
//       "Close": 18034
//     },
//     {
//       "LastTradeTime": 1673929800,
//       "QuotationLot": 50,
//       "TradedQty": 840400,
//       "OpenInterest": 11757050,
//       "Open": 18058.1,
//       "High": 18072.9,
//       "Low": 18043.35,
//       "Close": 18060
//     },
//     {
//       "LastTradeTime": 1673928000,
//       "QuotationLot": 50,
//       "TradedQty": 1449850,
//       "OpenInterest": 11721350,
//       "Open": 17991,
//       "High": 18059.4,
//       "Low": 17987.65,
//       "Close": 18057
//     },
//     {
//       "LastTradeTime": 1673926200,
//       "QuotationLot": 50,
//       "TradedQty": 805600,
//       "OpenInterest": 11724250,
//       "Open": 17916.25,
//       "High": 18000,
//       "Low": 17916.25,
//       "Close": 17990
//     },
//     {
//       "LastTradeTime": 1673863200,
//       "QuotationLot": 50,
//       "TradedQty": 450,
//       "OpenInterest": 12011550,
//       "Open": 17941.5,
//       "High": 17941.5,
//       "Low": 17941.5,
//       "Close": 17941.5
//     },
//     {
//       "LastTradeTime": 1673861400,
//       "QuotationLot": 50,
//       "TradedQty": 881800,
//       "OpenInterest": 12011550,
//       "Open": 17930,
//       "High": 17954.7,
//       "Low": 17921.65,
//       "Close": 17942.6
//     },
//     {
//       "LastTradeTime": 1673859600,
//       "QuotationLot": 50,
//       "TradedQty": 404500,
//       "OpenInterest": 12199500,
//       "Open": 17908.8,
//       "High": 17937.3,
//       "Low": 17900.1,
//       "Close": 17924.5
//     },
//     {
//       "LastTradeTime": 1673857800,
//       "QuotationLot": 50,
//       "TradedQty": 705200,
//       "OpenInterest": 12126900,
//       "Open": 17903.45,
//       "High": 17924.05,
//       "Low": 17886.95,
//       "Close": 17909
//     },
//     {
//       "LastTradeTime": 1673856000,
//       "QuotationLot": 50,
//       "TradedQty": 736600,
//       "OpenInterest": 11989350,
//       "Open": 17972,
//       "High": 17990,
//       "Low": 17901.5,
//       "Close": 17904.9
//     },
//     {
//       "LastTradeTime": 1673854200,
//       "QuotationLot": 50,
//       "TradedQty": 507000,
//       "OpenInterest": 11934800,
//       "Open": 17941.9,
//       "High": 17982.7,
//       "Low": 17931,
//       "Close": 17971.6
//     },
//     {
//       "LastTradeTime": 1673852400,
//       "QuotationLot": 50,
//       "TradedQty": 428650,
//       "OpenInterest": 11963500,
//       "Open": 17950.4,
//       "High": 17960,
//       "Low": 17927.15,
//       "Close": 17941.9
//     },
//     {
//       "LastTradeTime": 1673850600,
//       "QuotationLot": 50,
//       "TradedQty": 525400,
//       "OpenInterest": 11919150,
//       "Open": 17970.95,
//       "High": 17973.9,
//       "Low": 17936.1,
//       "Close": 17948.15
//     },
//     {
//       "LastTradeTime": 1673848800,
//       "QuotationLot": 50,
//       "TradedQty": 325050,
//       "OpenInterest": 11889500,
//       "Open": 17990,
//       "High": 17990.85,
//       "Low": 17962.6,
//       "Close": 17970.2
//     },
//     {
//       "LastTradeTime": 1673847000,
//       "QuotationLot": 50,
//       "TradedQty": 649250,
//       "OpenInterest": 11890100,
//       "Open": 18021.6,
//       "High": 18023,
//       "Low": 17960,
//       "Close": 17990
//     },
//     {
//       "LastTradeTime": 1673845200,
//       "QuotationLot": 50,
//       "TradedQty": 177300,
//       "OpenInterest": 11914600,
//       "Open": 18013,
//       "High": 18024.85,
//       "Low": 18001,
//       "Close": 18021.15
//     },
//     {
//       "LastTradeTime": 1673843400,
//       "QuotationLot": 50,
//       "TradedQty": 376150,
//       "OpenInterest": 11947050,
//       "Open": 18021.25,
//       "High": 18033.9,
//       "Low": 17995,
//       "Close": 18013
//     },
//     {
//       "LastTradeTime": 1673841600,
//       "QuotationLot": 50,
//       "TradedQty": 1125450,
//       "OpenInterest": 11952000,
//       "Open": 18043.15,
//       "High": 18044.9,
//       "Low": 17982.1,
//       "Close": 18020.6
//     },
//     {
//       "LastTradeTime": 1673839800,
//       "QuotationLot": 50,
//       "TradedQty": 952500,
//       "OpenInterest": 11827700,
//       "Open": 18051.1,
//       "High": 18097,
//       "Low": 18031.1,
//       "Close": 18046.7
//     },
//     {
//       "LastTradeTime": 1673602200,
//       "QuotationLot": 50,
//       "TradedQty": 1275650,
//       "OpenInterest": 12274650,
//       "Open": 18036.6,
//       "High": 18051.8,
//       "Low": 18001.1,
//       "Close": 18022
//     },
//     {
//       "LastTradeTime": 1673600400,
//       "QuotationLot": 50,
//       "TradedQty": 590100,
//       "OpenInterest": 12329750,
//       "Open": 18053.6,
//       "High": 18060,
//       "Low": 18023.6,
//       "Close": 18039.7
//     },
//     {
//       "LastTradeTime": 1673598600,
//       "QuotationLot": 50,
//       "TradedQty": 551400,
//       "OpenInterest": 12265450,
//       "Open": 18065,
//       "High": 18088.15,
//       "Low": 18045,
//       "Close": 18056.55
//     },
//     {
//       "LastTradeTime": 1673596800,
//       "QuotationLot": 50,
//       "TradedQty": 769200,
//       "OpenInterest": 12189200,
//       "Open": 18049.45,
//       "High": 18079.95,
//       "Low": 18027,
//       "Close": 18066.35
//     },
//     {
//       "LastTradeTime": 1673595000,
//       "QuotationLot": 50,
//       "TradedQty": 1242950,
//       "OpenInterest": 12127700,
//       "Open": 18017.25,
//       "High": 18063,
//       "Low": 18013.75,
//       "Close": 18049.15
//     },
//     {
//       "LastTradeTime": 1673593200,
//       "QuotationLot": 50,
//       "TradedQty": 1300650,
//       "OpenInterest": 12127000,
//       "Open": 17971.75,
//       "High": 18024,
//       "Low": 17958.3,
//       "Close": 18016
//     },
//     {
//       "LastTradeTime": 1673591400,
//       "QuotationLot": 50,
//       "TradedQty": 1151750,
//       "OpenInterest": 12161900,
//       "Open": 17900,
//       "High": 17984.35,
//       "Low": 17894.2,
//       "Close": 17971.85
//     },
//     {
//       "LastTradeTime": 1673589600,
//       "QuotationLot": 50,
//       "TradedQty": 358650,
//       "OpenInterest": 12200600,
//       "Open": 17884.5,
//       "High": 17912.25,
//       "Low": 17875.8,
//       "Close": 17900
//     },
//     {
//       "LastTradeTime": 1673587800,
//       "QuotationLot": 50,
//       "TradedQty": 322850,
//       "OpenInterest": 12181000,
//       "Open": 17879.85,
//       "High": 17903.3,
//       "Low": 17872.05,
//       "Close": 17884.5
//     },
//     {
//       "LastTradeTime": 1673586000,
//       "QuotationLot": 50,
//       "TradedQty": 384350,
//       "OpenInterest": 12120000,
//       "Open": 17864.2,
//       "High": 17908.9,
//       "Low": 17856.2,
//       "Close": 17879.85
//     },
//     {
//       "LastTradeTime": 1673584200,
//       "QuotationLot": 50,
//       "TradedQty": 447750,
//       "OpenInterest": 12185900,
//       "Open": 17845,
//       "High": 17884.95,
//       "Low": 17835.55,
//       "Close": 17864.2
//     },
//     {
//       "LastTradeTime": 1673582400,
//       "QuotationLot": 50,
//       "TradedQty": 893200,
//       "OpenInterest": 12134700,
//       "Open": 17866.75,
//       "High": 17910,
//       "Low": 17840,
//       "Close": 17846.95
//     },
//     {
//       "LastTradeTime": 1673580600,
//       "QuotationLot": 50,
//       "TradedQty": 916300,
//       "OpenInterest": 11958250,
//       "Open": 17940,
//       "High": 17940,
//       "Low": 17857,
//       "Close": 17867.45
//     },
//     {
//       "LastTradeTime": 1673517600,
//       "QuotationLot": 50,
//       "TradedQty": 0,
//       "OpenInterest": 11833750,
//       "Open": 17924.5,
//       "High": 17924.5,
//       "Low": 17924.5,
//       "Close": 17924.5
//     },
//     {
//       "LastTradeTime": 1673515800,
//       "QuotationLot": 50,
//       "TradedQty": 1061500,
//       "OpenInterest": 11833750,
//       "Open": 17892.55,
//       "High": 17928.1,
//       "Low": 17891.15,
//       "Close": 17924.5
//     },
//     {
//       "LastTradeTime": 1673514000,
//       "QuotationLot": 50,
//       "TradedQty": 562200,
//       "OpenInterest": 12037050,
//       "Open": 17903.45,
//       "High": 17923.4,
//       "Low": 17881.55,
//       "Close": 17897.7
//     },
//     {
//       "LastTradeTime": 1673512200,
//       "QuotationLot": 50,
//       "TradedQty": 1119100,
//       "OpenInterest": 12093000,
//       "Open": 17875.3,
//       "High": 17928.8,
//       "Low": 17872.55,
//       "Close": 17903.8
//     },
//     {
//       "LastTradeTime": 1673510400,
//       "QuotationLot": 50,
//       "TradedQty": 852250,
//       "OpenInterest": 12097650,
//       "Open": 17856.55,
//       "High": 17877.9,
//       "Low": 17820.05,
//       "Close": 17875.65
//     },
//     {
//       "LastTradeTime": 1673508600,
//       "QuotationLot": 50,
//       "TradedQty": 391750,
//       "OpenInterest": 11985700,
//       "Open": 17904,
//       "High": 17917.3,
//       "Low": 17853.2,
//       "Close": 17857
//     },
//     {
//       "LastTradeTime": 1673506800,
//       "QuotationLot": 50,
//       "TradedQty": 361150,
//       "OpenInterest": 11986000,
//       "Open": 17888.35,
//       "High": 17920,
//       "Low": 17873.05,
//       "Close": 17904
//     },
//     {
//       "LastTradeTime": 1673505000,
//       "QuotationLot": 50,
//       "TradedQty": 390600,
//       "OpenInterest": 12032550,
//       "Open": 17845.2,
//       "High": 17899,
//       "Low": 17843.2,
//       "Close": 17888.35
//     },
//     {
//       "LastTradeTime": 1673503200,
//       "QuotationLot": 50,
//       "TradedQty": 373200,
//       "OpenInterest": 12028600,
//       "Open": 17865,
//       "High": 17889.9,
//       "Low": 17840,
//       "Close": 17845
//     },
//     {
//       "LastTradeTime": 1673501400,
//       "QuotationLot": 50,
//       "TradedQty": 514800,
//       "OpenInterest": 11945650,
//       "Open": 17889.85,
//       "High": 17899.9,
//       "Low": 17855.7,
//       "Close": 17867.15
//     },
//     {
//       "LastTradeTime": 1673499600,
//       "QuotationLot": 50,
//       "TradedQty": 607300,
//       "OpenInterest": 11855350,
//       "Open": 17895.55,
//       "High": 17904,
//       "Low": 17873.3,
//       "Close": 17888.65
//     },
//     {
//       "LastTradeTime": 1673497800,
//       "QuotationLot": 50,
//       "TradedQty": 900000,
//       "OpenInterest": 11711650,
//       "Open": 17954.5,
//       "High": 17964.3,
//       "Low": 17887.45,
//       "Close": 17894.5
//     },
//     {
//       "LastTradeTime": 1673496000,
//       "QuotationLot": 50,
//       "TradedQty": 964100,
//       "OpenInterest": 11589800,
//       "Open": 17974.85,
//       "High": 18019.95,
//       "Low": 17941.25,
//       "Close": 17955.65
//     },
//     {
//       "LastTradeTime": 1673494200,
//       "QuotationLot": 50,
//       "TradedQty": 674200,
//       "OpenInterest": 11563550,
//       "Open": 17982.5,
//       "High": 18010,
//       "Low": 17966.3,
//       "Close": 17974.85
//     },
//     {
//       "LastTradeTime": 1673431200,
//       "QuotationLot": 50,
//       "TradedQty": 1750,
//       "OpenInterest": 11598750,
//       "Open": 17960,
//       "High": 17960,
//       "Low": 17960,
//       "Close": 17960
//     },
//     {
//       "LastTradeTime": 1673429400,
//       "QuotationLot": 50,
//       "TradedQty": 863600,
//       "OpenInterest": 11598750,
//       "Open": 18007.2,
//       "High": 18007.9,
//       "Low": 17949,
//       "Close": 17958.7
//     },
//     {
//       "LastTradeTime": 1673427600,
//       "QuotationLot": 50,
//       "TradedQty": 650800,
//       "OpenInterest": 11641450,
//       "Open": 17963.25,
//       "High": 18018,
//       "Low": 17956,
//       "Close": 18007.9
//     },
//     {
//       "LastTradeTime": 1673425800,
//       "QuotationLot": 50,
//       "TradedQty": 541300,
//       "OpenInterest": 11893450,
//       "Open": 17960.2,
//       "High": 17978.25,
//       "Low": 17930.1,
//       "Close": 17964.65
//     },
//     {
//       "LastTradeTime": 1673424000,
//       "QuotationLot": 50,
//       "TradedQty": 335900,
//       "OpenInterest": 11839500,
//       "Open": 17989,
//       "High": 18005.3,
//       "Low": 17956.55,
//       "Close": 17960.55
//     },
//     {
//       "LastTradeTime": 1673422200,
//       "QuotationLot": 50,
//       "TradedQty": 241300,
//       "OpenInterest": 11867700,
//       "Open": 17971.4,
//       "High": 17997.5,
//       "Low": 17961.35,
//       "Close": 17989
//     },
//     {
//       "LastTradeTime": 1673420400,
//       "QuotationLot": 50,
//       "TradedQty": 294250,
//       "OpenInterest": 11850100,
//       "Open": 17988.2,
//       "High": 17989.95,
//       "Low": 17950.7,
//       "Close": 17971.4
//     },
//     {
//       "LastTradeTime": 1673418600,
//       "QuotationLot": 50,
//       "TradedQty": 299250,
//       "OpenInterest": 11890150,
//       "Open": 17990.2,
//       "High": 18009.9,
//       "Low": 17968.2,
//       "Close": 17988.2
//     },
//     {
//       "LastTradeTime": 1673416800,
//       "QuotationLot": 50,
//       "TradedQty": 394550,
//       "OpenInterest": 11894150,
//       "Open": 17979.85,
//       "High": 18004.6,
//       "Low": 17944.65,
//       "Close": 17987.85
//     },
//     {
//       "LastTradeTime": 1673415000,
//       "QuotationLot": 50,
//       "TradedQty": 422650,
//       "OpenInterest": 11906500,
//       "Open": 17977.4,
//       "High": 17992,
//       "Low": 17949.5,
//       "Close": 17979.85
//     },
//     {
//       "LastTradeTime": 1673413200,
//       "QuotationLot": 50,
//       "TradedQty": 899250,
//       "OpenInterest": 11889250,
//       "Open": 18055.55,
//       "High": 18065,
//       "Low": 17957.1,
//       "Close": 17977.05
//     },
//     {
//       "LastTradeTime": 1673411400,
//       "QuotationLot": 50,
//       "TradedQty": 1082600,
//       "OpenInterest": 11950850,
//       "Open": 17963.75,
//       "High": 18056.2,
//       "Low": 17963.75,
//       "Close": 18052.6
//     },
//     {
//       "LastTradeTime": 1673409600,
//       "QuotationLot": 50,
//       "TradedQty": 1339150,
//       "OpenInterest": 11932200,
//       "Open": 17914.5,
//       "High": 18020.55,
//       "Low": 17892.1,
//       "Close": 17964.5
//     },
//     {
//       "LastTradeTime": 1673407800,
//       "QuotationLot": 50,
//       "TradedQty": 838300,
//       "OpenInterest": 11883250,
//       "Open": 18000,
//       "High": 18001,
//       "Low": 17890.45,
//       "Close": 17913
//     },
//     {
//       "LastTradeTime": 1673344800,
//       "QuotationLot": 50,
//       "TradedQty": 2050,
//       "OpenInterest": 12126250,
//       "Open": 17988.45,
//       "High": 17988.45,
//       "Low": 17988.45,
//       "Close": 17988.45
//     },
//     {
//       "LastTradeTime": 1673343000,
//       "QuotationLot": 50,
//       "TradedQty": 1149900,
//       "OpenInterest": 12126250,
//       "Open": 17968.9,
//       "High": 18000,
//       "Low": 17953.75,
//       "Close": 17995
//     },
//     {
//       "LastTradeTime": 1673341200,
//       "QuotationLot": 50,
//       "TradedQty": 671350,
//       "OpenInterest": 12262650,
//       "Open": 17951.05,
//       "High": 17977.95,
//       "Low": 17925.15,
//       "Close": 17963.85
//     },
//     {
//       "LastTradeTime": 1673339400,
//       "QuotationLot": 50,
//       "TradedQty": 453750,
//       "OpenInterest": 12147200,
//       "Open": 17983.2,
//       "High": 17994.4,
//       "Low": 17945,
//       "Close": 17948
//     },
//     {
//       "LastTradeTime": 1673337600,
//       "QuotationLot": 50,
//       "TradedQty": 627950,
//       "OpenInterest": 12151500,
//       "Open": 17975,
//       "High": 17993,
//       "Low": 17930,
//       "Close": 17982.5
//     },
//     {
//       "LastTradeTime": 1673335800,
//       "QuotationLot": 50,
//       "TradedQty": 558350,
//       "OpenInterest": 12049450,
//       "Open": 17952.55,
//       "High": 17984.8,
//       "Low": 17952.55,
//       "Close": 17971.4
//     },
//     {
//       "LastTradeTime": 1673334000,
//       "QuotationLot": 50,
//       "TradedQty": 930000,
//       "OpenInterest": 11910900,
//       "Open": 18037.65,
//       "High": 18048,
//       "Low": 17950,
//       "Close": 17950
//     },
//     {
//       "LastTradeTime": 1673332200,
//       "QuotationLot": 50,
//       "TradedQty": 358650,
//       "OpenInterest": 11789350,
//       "Open": 18009,
//       "High": 18039.4,
//       "Low": 18005,
//       "Close": 18039.25
//     },
//     {
//       "LastTradeTime": 1673330400,
//       "QuotationLot": 50,
//       "TradedQty": 500800,
//       "OpenInterest": 11797550,
//       "Open": 18005.15,
//       "High": 18016.5,
//       "Low": 17988.55,
//       "Close": 18010.3
//     },
//     {
//       "LastTradeTime": 1673328600,
//       "QuotationLot": 50,
//       "TradedQty": 481350,
//       "OpenInterest": 11704650,
//       "Open": 18039.9,
//       "High": 18044.7,
//       "Low": 18003.1,
//       "Close": 18007.3
//     },
//     {
//       "LastTradeTime": 1673326800,
//       "QuotationLot": 50,
//       "TradedQty": 740900,
//       "OpenInterest": 11634950,
//       "Open": 18060.15,
//       "High": 18060.15,
//       "Low": 18015.35,
//       "Close": 18039.3
//     },
//     {
//       "LastTradeTime": 1673325000,
//       "QuotationLot": 50,
//       "TradedQty": 617200,
//       "OpenInterest": 11556400,
//       "Open": 18045.45,
//       "High": 18079.9,
//       "Low": 18025.1,
//       "Close": 18060.05
//     },
//     {
//       "LastTradeTime": 1673323200,
//       "QuotationLot": 50,
//       "TradedQty": 1245450,
//       "OpenInterest": 11508700,
//       "Open": 18097.35,
//       "High": 18104.55,
//       "Low": 18037.65,
//       "Close": 18044.7
//     },
//     {
//       "LastTradeTime": 1673321400,
//       "QuotationLot": 50,
//       "TradedQty": 748950,
//       "OpenInterest": 11365750,
//       "Open": 18173.2,
//       "High": 18178,
//       "Low": 18095,
//       "Close": 18098
//     },
//     {
//       "LastTradeTime": 1673258400,
//       "QuotationLot": 50,
//       "TradedQty": 650,
//       "OpenInterest": 11808800,
//       "Open": 18161.8,
//       "High": 18161.8,
//       "Low": 18161.8,
//       "Close": 18161.8
//     },
//     {
//       "LastTradeTime": 1673256600,
//       "QuotationLot": 50,
//       "TradedQty": 1093350,
//       "OpenInterest": 11808800,
//       "Open": 18149.5,
//       "High": 18190,
//       "Low": 18149.5,
//       "Close": 18158.45
//     },
//     {
//       "LastTradeTime": 1673254800,
//       "QuotationLot": 50,
//       "TradedQty": 489850,
//       "OpenInterest": 11800050,
//       "Open": 18153,
//       "High": 18173.45,
//       "Low": 18109.3,
//       "Close": 18153.1
//     },
//     {
//       "LastTradeTime": 1673253000,
//       "QuotationLot": 50,
//       "TradedQty": 584200,
//       "OpenInterest": 11843700,
//       "Open": 18130.85,
//       "High": 18162.75,
//       "Low": 18108,
//       "Close": 18154.4
//     },
//     {
//       "LastTradeTime": 1673251200,
//       "QuotationLot": 50,
//       "TradedQty": 1084700,
//       "OpenInterest": 11826600,
//       "Open": 18145,
//       "High": 18154,
//       "Low": 18079.7,
//       "Close": 18130
//     },
//     {
//       "LastTradeTime": 1673249400,
//       "QuotationLot": 50,
//       "TradedQty": 485000,
//       "OpenInterest": 11881950,
//       "Open": 18174.85,
//       "High": 18178.6,
//       "Low": 18145,
//       "Close": 18145
//     },
//     {
//       "LastTradeTime": 1673247600,
//       "QuotationLot": 50,
//       "TradedQty": 345250,
//       "OpenInterest": 11868850,
//       "Open": 18183.55,
//       "High": 18194.2,
//       "Low": 18167.85,
//       "Close": 18175
//     },
//     {
//       "LastTradeTime": 1673245800,
//       "QuotationLot": 50,
//       "TradedQty": 419050,
//       "OpenInterest": 11898750,
//       "Open": 18213.75,
//       "High": 18219.75,
//       "Low": 18182,
//       "Close": 18183.15
//     },
//     {
//       "LastTradeTime": 1673244000,
//       "QuotationLot": 50,
//       "TradedQty": 497850,
//       "OpenInterest": 11958950,
//       "Open": 18212.45,
//       "High": 18228,
//       "Low": 18208.9,
//       "Close": 18213.75
//     },
//     {
//       "LastTradeTime": 1673242200,
//       "QuotationLot": 50,
//       "TradedQty": 570750,
//       "OpenInterest": 11899100,
//       "Open": 18181.9,
//       "High": 18216.1,
//       "Low": 18175,
//       "Close": 18212.05
//     },
//     {
//       "LastTradeTime": 1673240400,
//       "QuotationLot": 50,
//       "TradedQty": 550750,
//       "OpenInterest": 11867100,
//       "Open": 18177.75,
//       "High": 18194,
//       "Low": 18167,
//       "Close": 18181.9
//     },
//     {
//       "LastTradeTime": 1673238600,
//       "QuotationLot": 50,
//       "TradedQty": 1292550,
//       "OpenInterest": 11753850,
//       "Open": 18141.55,
//       "High": 18190,
//       "Low": 18139.05,
//       "Close": 18177.45
//     },
//     {
//       "LastTradeTime": 1673236800,
//       "QuotationLot": 50,
//       "TradedQty": 1727450,
//       "OpenInterest": 11563400,
//       "Open": 18085,
//       "High": 18143.9,
//       "Low": 18081.1,
//       "Close": 18140.15
//     },
//     {
//       "LastTradeTime": 1673235000,
//       "QuotationLot": 50,
//       "TradedQty": 1496000,
//       "OpenInterest": 11400100,
//       "Open": 18028,
//       "High": 18080,
//       "Low": 18018.9,
//       "Close": 18079.65
//     },
//     {
//       "LastTradeTime": 1672999200,
//       "QuotationLot": 50,
//       "TradedQty": 300,
//       "OpenInterest": 12476250,
//       "Open": 17949.05,
//       "High": 17949.05,
//       "Low": 17949.05,
//       "Close": 17949.05
//     },
//     {
//       "LastTradeTime": 1672997400,
//       "QuotationLot": 50,
//       "TradedQty": 1389550,
//       "OpenInterest": 12476250,
//       "Open": 17941.8,
//       "High": 17965,
//       "Low": 17913.3,
//       "Close": 17949
//     },
//     {
//       "LastTradeTime": 1672995600,
//       "QuotationLot": 50,
//       "TradedQty": 614300,
//       "OpenInterest": 12562750,
//       "Open": 17926.2,
//       "High": 17948,
//       "Low": 17892.15,
//       "Close": 17941.95
//     },
//     {
//       "LastTradeTime": 1672993800,
//       "QuotationLot": 50,
//       "TradedQty": 677000,
//       "OpenInterest": 12545200,
//       "Open": 17925.85,
//       "High": 17939.6,
//       "Low": 17876.5,
//       "Close": 17926.25
//     },
//     {
//       "LastTradeTime": 1672992000,
//       "QuotationLot": 50,
//       "TradedQty": 931400,
//       "OpenInterest": 12436150,
//       "Open": 17879.35,
//       "High": 17935,
//       "Low": 17872.05,
//       "Close": 17923.9
//     },
//     {
//       "LastTradeTime": 1672990200,
//       "QuotationLot": 50,
//       "TradedQty": 865450,
//       "OpenInterest": 12073450,
//       "Open": 17923.05,
//       "High": 17930.8,
//       "Low": 17875.65,
//       "Close": 17878.85
//     },
//     {
//       "LastTradeTime": 1672988400,
//       "QuotationLot": 50,
//       "TradedQty": 1089300,
//       "OpenInterest": 11986600,
//       "Open": 17976.3,
//       "High": 17995,
//       "Low": 17922,
//       "Close": 17923
//     },
//     {
//       "LastTradeTime": 1672986600,
//       "QuotationLot": 50,
//       "TradedQty": 376500,
//       "OpenInterest": 11839300,
//       "Open": 18016.1,
//       "High": 18025.15,
//       "Low": 17977.15,
//       "Close": 17977.15
//     },
//     {
//       "LastTradeTime": 1672984800,
//       "QuotationLot": 50,
//       "TradedQty": 488300,
//       "OpenInterest": 11777000,
//       "Open": 17979.7,
//       "High": 18028.75,
//       "Low": 17978,
//       "Close": 18017.9
//     },
//     {
//       "LastTradeTime": 1672983000,
//       "QuotationLot": 50,
//       "TradedQty": 587400,
//       "OpenInterest": 11636850,
//       "Open": 18010.55,
//       "High": 18010.55,
//       "Low": 17975.3,
//       "Close": 17980.05
//     },
//     {
//       "LastTradeTime": 1672981200,
//       "QuotationLot": 50,
//       "TradedQty": 514600,
//       "OpenInterest": 11543950,
//       "Open": 18031,
//       "High": 18034.4,
//       "Low": 18005,
//       "Close": 18010.55
//     },
//     {
//       "LastTradeTime": 1672979400,
//       "QuotationLot": 50,
//       "TradedQty": 588100,
//       "OpenInterest": 11471300,
//       "Open": 18047.5,
//       "High": 18059.8,
//       "Low": 18021.1,
//       "Close": 18029.4
//     },
//     {
//       "LastTradeTime": 1672977600,
//       "QuotationLot": 50,
//       "TradedQty": 1125500,
//       "OpenInterest": 11391050,
//       "Open": 18075.3,
//       "High": 18132,
//       "Low": 18047.5,
//       "Close": 18049
//     },
//     {
//       "LastTradeTime": 1672975800,
//       "QuotationLot": 50,
//       "TradedQty": 1194750,
//       "OpenInterest": 11285750,
//       "Open": 18073.6,
//       "High": 18115.95,
//       "Low": 18052.8,
//       "Close": 18075.55
//     },
//     {
//       "LastTradeTime": 1672912800,
//       "QuotationLot": 50,
//       "TradedQty": 300,
//       "OpenInterest": 11638900,
//       "Open": 18070.05,
//       "High": 18070.05,
//       "Low": 18070.05,
//       "Close": 18070.05
//     },
//     {
//       "LastTradeTime": 1672911000,
//       "QuotationLot": 50,
//       "TradedQty": 1174250,
//       "OpenInterest": 11638900,
//       "Open": 18041.5,
//       "High": 18082,
//       "Low": 18041.5,
//       "Close": 18070
//     },
//     {
//       "LastTradeTime": 1672909200,
//       "QuotationLot": 50,
//       "TradedQty": 832200,
//       "OpenInterest": 11724800,
//       "Open": 18037,
//       "High": 18057.8,
//       "Low": 18019.9,
//       "Close": 18042.85
//     },
//     {
//       "LastTradeTime": 1672907400,
//       "QuotationLot": 50,
//       "TradedQty": 594200,
//       "OpenInterest": 11846000,
//       "Open": 18017.2,
//       "High": 18039.5,
//       "Low": 17985.35,
//       "Close": 18037.2
//     },
//     {
//       "LastTradeTime": 1672905600,
//       "QuotationLot": 50,
//       "TradedQty": 604900,
//       "OpenInterest": 11776500,
//       "Open": 17977.15,
//       "High": 18019.7,
//       "Low": 17970.15,
//       "Close": 18017.2
//     },
//     {
//       "LastTradeTime": 1672903800,
//       "QuotationLot": 50,
//       "TradedQty": 844300,
//       "OpenInterest": 11576300,
//       "Open": 18016,
//       "High": 18043.45,
//       "Low": 17964.4,
//       "Close": 17979.3
//     },
//     {
//       "LastTradeTime": 1672902000,
//       "QuotationLot": 50,
//       "TradedQty": 504500,
//       "OpenInterest": 11449700,
//       "Open": 18030.05,
//       "High": 18043.55,
//       "Low": 18008,
//       "Close": 18016.05
//     },
//     {
//       "LastTradeTime": 1672900200,
//       "QuotationLot": 50,
//       "TradedQty": 442050,
//       "OpenInterest": 11340650,
//       "Open": 18059,
//       "High": 18063.95,
//       "Low": 18030.05,
//       "Close": 18030.05
//     },
//     {
//       "LastTradeTime": 1672898400,
//       "QuotationLot": 50,
//       "TradedQty": 796600,
//       "OpenInterest": 11259900,
//       "Open": 18087.2,
//       "High": 18094.8,
//       "Low": 18046.7,
//       "Close": 18059
//     },
//     {
//       "LastTradeTime": 1672896600,
//       "QuotationLot": 50,
//       "TradedQty": 469550,
//       "OpenInterest": 11152550,
//       "Open": 18101,
//       "High": 18119.4,
//       "Low": 18084,
//       "Close": 18087.2
//     },
//     {
//       "LastTradeTime": 1672894800,
//       "QuotationLot": 50,
//       "TradedQty": 433550,
//       "OpenInterest": 11019400,
//       "Open": 18143.85,
//       "High": 18148,
//       "Low": 18090,
//       "Close": 18101
//     },
//     {
//       "LastTradeTime": 1672893000,
//       "QuotationLot": 50,
//       "TradedQty": 866600,
//       "OpenInterest": 10989300,
//       "Open": 18111.5,
//       "High": 18164.35,
//       "Low": 18082.2,
//       "Close": 18142
//     },
//     {
//       "LastTradeTime": 1672891200,
//       "QuotationLot": 50,
//       "TradedQty": 2121650,
//       "OpenInterest": 10882150,
//       "Open": 18143.6,
//       "High": 18190,
//       "Low": 18098.5,
//       "Close": 18112
//     },
//     {
//       "LastTradeTime": 1672889400,
//       "QuotationLot": 50,
//       "TradedQty": 1072500,
//       "OpenInterest": 11029650,
//       "Open": 18155,
//       "High": 18155,
//       "Low": 18092,
//       "Close": 18142.9
//     },
//     {
//       "LastTradeTime": 1672826400,
//       "QuotationLot": 50,
//       "TradedQty": 0,
//       "OpenInterest": 11885350,
//       "Open": 18102.95,
//       "High": 18102.95,
//       "Low": 18102.95,
//       "Close": 18102.95
//     },
//     {
//       "LastTradeTime": 1672824600,
//       "QuotationLot": 50,
//       "TradedQty": 888200,
//       "OpenInterest": 11885350,
//       "Open": 18113.7,
//       "High": 18127.25,
//       "Low": 18088.85,
//       "Close": 18102.95
//     },
//     {
//       "LastTradeTime": 1672822800,
//       "QuotationLot": 50,
//       "TradedQty": 758950,
//       "OpenInterest": 11833600,
//       "Open": 18132.8,
//       "High": 18147.65,
//       "Low": 18083.2,
//       "Close": 18111.25
//     },
//     {
//       "LastTradeTime": 1672821000,
//       "QuotationLot": 50,
//       "TradedQty": 757400,
//       "OpenInterest": 11813550,
//       "Open": 18171.1,
//       "High": 18192.75,
//       "Low": 18128,
//       "Close": 18134.15
//     },
//     {
//       "LastTradeTime": 1672819200,
//       "QuotationLot": 50,
//       "TradedQty": 838950,
//       "OpenInterest": 11835400,
//       "Open": 18130.05,
//       "High": 18187,
//       "Low": 18127.95,
//       "Close": 18171.3
//     },
//     {
//       "LastTradeTime": 1672817400,
//       "QuotationLot": 50,
//       "TradedQty": 343700,
//       "OpenInterest": 12029550,
//       "Open": 18107,
//       "High": 18139,
//       "Low": 18106.2,
//       "Close": 18130.75
//     },
//     {
//       "LastTradeTime": 1672815600,
//       "QuotationLot": 50,
//       "TradedQty": 558150,
//       "OpenInterest": 11991600,
//       "Open": 18104.5,
//       "High": 18129.4,
//       "Low": 18094.8,
//       "Close": 18107.45
//     },
//     {
//       "LastTradeTime": 1672813800,
//       "QuotationLot": 50,
//       "TradedQty": 839100,
//       "OpenInterest": 11883200,
//       "Open": 18128.8,
//       "High": 18131.4,
//       "Low": 18087.4,
//       "Close": 18105.95
//     },
//     {
//       "LastTradeTime": 1672812000,
//       "QuotationLot": 50,
//       "TradedQty": 625700,
//       "OpenInterest": 12006750,
//       "Open": 18159.3,
//       "High": 18161.55,
//       "Low": 18119.05,
//       "Close": 18127.05
//     },
//     {
//       "LastTradeTime": 1672810200,
//       "QuotationLot": 50,
//       "TradedQty": 881300,
//       "OpenInterest": 11936700,
//       "Open": 18193.7,
//       "High": 18194.8,
//       "Low": 18140,
//       "Close": 18159.3
//     },
//     {
//       "LastTradeTime": 1672808400,
//       "QuotationLot": 50,
//       "TradedQty": 445700,
//       "OpenInterest": 11810300,
//       "Open": 18206.05,
//       "High": 18216.25,
//       "Low": 18180.2,
//       "Close": 18193.2
//     },
//     {
//       "LastTradeTime": 1672806600,
//       "QuotationLot": 50,
//       "TradedQty": 1151250,
//       "OpenInterest": 11777900,
//       "Open": 18185,
//       "High": 18211.05,
//       "Low": 18166.3,
//       "Close": 18205
//     },
//     {
//       "LastTradeTime": 1672804800,
//       "QuotationLot": 50,
//       "TradedQty": 1748050,
//       "OpenInterest": 11503200,
//       "Open": 18291.85,
//       "High": 18303.3,
//       "Low": 18185,
//       "Close": 18185
//     },
//     {
//       "LastTradeTime": 1672803000,
//       "QuotationLot": 50,
//       "TradedQty": 751750,
//       "OpenInterest": 11186450,
//       "Open": 18299,
//       "High": 18299,
//       "Low": 18261.5,
//       "Close": 18292.5
//     },
//     {
//       "LastTradeTime": 1672740000,
//       "QuotationLot": 50,
//       "TradedQty": 300,
//       "OpenInterest": 11388300,
//       "Open": 18315,
//       "High": 18315,
//       "Low": 18315,
//       "Close": 18315
//     },
//     {
//       "LastTradeTime": 1672738200,
//       "QuotationLot": 50,
//       "TradedQty": 763000,
//       "OpenInterest": 11388300,
//       "Open": 18316.35,
//       "High": 18331.65,
//       "Low": 18295.5,
//       "Close": 18315
//     },
//     {
//       "LastTradeTime": 1672736400,
//       "QuotationLot": 50,
//       "TradedQty": 738900,
//       "OpenInterest": 11506250,
//       "Open": 18304.7,
//       "High": 18333.9,
//       "Low": 18300,
//       "Close": 18314.1
//     },
//     {
//       "LastTradeTime": 1672734600,
//       "QuotationLot": 50,
//       "TradedQty": 395650,
//       "OpenInterest": 11422750,
//       "Open": 18292.15,
//       "High": 18308,
//       "Low": 18275,
//       "Close": 18303.5
//     },
//     {
//       "LastTradeTime": 1672732800,
//       "QuotationLot": 50,
//       "TradedQty": 408100,
//       "OpenInterest": 11462250,
//       "Open": 18263.8,
//       "High": 18294.75,
//       "Low": 18260.4,
//       "Close": 18290.3
//     },
//     {
//       "LastTradeTime": 1672731000,
//       "QuotationLot": 50,
//       "TradedQty": 209600,
//       "OpenInterest": 11447550,
//       "Open": 18242.15,
//       "High": 18264.9,
//       "Low": 18236.15,
//       "Close": 18263
//     },
//     {
//       "LastTradeTime": 1672729200,
//       "QuotationLot": 50,
//       "TradedQty": 318850,
//       "OpenInterest": 11423950,
//       "Open": 18237.85,
//       "High": 18254.1,
//       "Low": 18230,
//       "Close": 18244
//     },
//     {
//       "LastTradeTime": 1672727400,
//       "QuotationLot": 50,
//       "TradedQty": 665950,
//       "OpenInterest": 11352900,
//       "Open": 18287,
//       "High": 18291.1,
//       "Low": 18222.85,
//       "Close": 18237.9
//     },
//     {
//       "LastTradeTime": 1672725600,
//       "QuotationLot": 50,
//       "TradedQty": 230900,
//       "OpenInterest": 11345400,
//       "Open": 18301.65,
//       "High": 18307.1,
//       "Low": 18279.9,
//       "Close": 18288
//     },
//     {
//       "LastTradeTime": 1672723800,
//       "QuotationLot": 50,
//       "TradedQty": 284350,
//       "OpenInterest": 11364550,
//       "Open": 18292.6,
//       "High": 18312.7,
//       "Low": 18290.35,
//       "Close": 18301.65
//     },
//     {
//       "LastTradeTime": 1672722000,
//       "QuotationLot": 50,
//       "TradedQty": 242500,
//       "OpenInterest": 11413700,
//       "Open": 18283.3,
//       "High": 18308.2,
//       "Low": 18283,
//       "Close": 18292.6
//     },
//     {
//       "LastTradeTime": 1672720200,
//       "QuotationLot": 50,
//       "TradedQty": 586800,
//       "OpenInterest": 11413050,
//       "Open": 18273,
//       "High": 18304,
//       "Low": 18263,
//       "Close": 18283
//     },
//     {
//       "LastTradeTime": 1672718400,
//       "QuotationLot": 50,
//       "TradedQty": 723700,
//       "OpenInterest": 11360850,
//       "Open": 18222,
//       "High": 18273.8,
//       "Low": 18222,
//       "Close": 18273
//     },
//     {
//       "LastTradeTime": 1672716600,
//       "QuotationLot": 50,
//       "TradedQty": 1227600,
//       "OpenInterest": 11245200,
//       "Open": 18234.9,
//       "High": 18249.9,
//       "Low": 18210.05,
//       "Close": 18222
//     },
//     {
//       "LastTradeTime": 1672653600,
//       "QuotationLot": 50,
//       "TradedQty": 0,
//       "OpenInterest": 10959550,
//       "Open": 18278.7,
//       "High": 18278.7,
//       "Low": 18278.7,
//       "Close": 18278.7
//     },
//     {
//       "LastTradeTime": 1672651800,
//       "QuotationLot": 50,
//       "TradedQty": 697500,
//       "OpenInterest": 10959550,
//       "Open": 18260.6,
//       "High": 18287.6,
//       "Low": 18250.25,
//       "Close": 18278.7
//     },
//     {
//       "LastTradeTime": 1672650000,
//       "QuotationLot": 50,
//       "TradedQty": 645050,
//       "OpenInterest": 10970600,
//       "Open": 18219.55,
//       "High": 18294.4,
//       "Low": 18213.1,
//       "Close": 18260.05
//     },
//     {
//       "LastTradeTime": 1672648200,
//       "QuotationLot": 50,
//       "TradedQty": 748700,
//       "OpenInterest": 10996300,
//       "Open": 18244.3,
//       "High": 18252,
//       "Low": 18188.95,
//       "Close": 18219.85
//     },
//     {
//       "LastTradeTime": 1672646400,
//       "QuotationLot": 50,
//       "TradedQty": 161250,
//       "OpenInterest": 10961500,
//       "Open": 18255.95,
//       "High": 18263,
//       "Low": 18240.55,
//       "Close": 18244.05
//     },
//     {
//       "LastTradeTime": 1672644600,
//       "QuotationLot": 50,
//       "TradedQty": 192650,
//       "OpenInterest": 10977300,
//       "Open": 18236.8,
//       "High": 18267.25,
//       "Low": 18236.45,
//       "Close": 18255.95
//     },
//     {
//       "LastTradeTime": 1672642800,
//       "QuotationLot": 50,
//       "TradedQty": 214850,
//       "OpenInterest": 10946900,
//       "Open": 18243,
//       "High": 18259,
//       "Low": 18230.6,
//       "Close": 18236.25
//     },
//     {
//       "LastTradeTime": 1672641000,
//       "QuotationLot": 50,
//       "TradedQty": 174000,
//       "OpenInterest": 10921150,
//       "Open": 18251.3,
//       "High": 18270,
//       "Low": 18234.65,
//       "Close": 18240
//     },
//     {
//       "LastTradeTime": 1672639200,
//       "QuotationLot": 50,
//       "TradedQty": 165600,
//       "OpenInterest": 10925400,
//       "Open": 18257.6,
//       "High": 18269.85,
//       "Low": 18245.6,
//       "Close": 18250.4
//     },
//     {
//       "LastTradeTime": 1672637400,
//       "QuotationLot": 50,
//       "TradedQty": 367150,
//       "OpenInterest": 10926100,
//       "Open": 18258.65,
//       "High": 18275.45,
//       "Low": 18249.1,
//       "Close": 18257.6
//     },
//     {
//       "LastTradeTime": 1672635600,
//       "QuotationLot": 50,
//       "TradedQty": 400400,
//       "OpenInterest": 10904300,
//       "Open": 18230,
//       "High": 18265,
//       "Low": 18230,
//       "Close": 18258.75
//     },
//     {
//       "LastTradeTime": 1672633800,
//       "QuotationLot": 50,
//       "TradedQty": 305450,
//       "OpenInterest": 10908350,
//       "Open": 18232.75,
//       "High": 18249.9,
//       "Low": 18225,
//       "Close": 18230.6
//     },
//     {
//       "LastTradeTime": 1672632000,
//       "QuotationLot": 50,
//       "TradedQty": 751900,
//       "OpenInterest": 10846950,
//       "Open": 18177.7,
//       "High": 18248,
//       "Low": 18164.7,
//       "Close": 18235
//     },
//     {
//       "LastTradeTime": 1672630200,
//       "QuotationLot": 50,
//       "TradedQty": 651950,
//       "OpenInterest": 10745850,
//       "Open": 18209,
//       "High": 18224.85,
//       "Low": 18167,
//       "Close": 18179.35
//     },
//     {
//       "LastTradeTime": 1672394400,
//       "QuotationLot": 50,
//       "TradedQty": 50,
//       "OpenInterest": 10988250,
//       "Open": 18219.5,
//       "High": 18219.5,
//       "Low": 18219.5,
//       "Close": 18219.5
//     },
//     {
//       "LastTradeTime": 1672392600,
//       "QuotationLot": 50,
//       "TradedQty": 1638450,
//       "OpenInterest": 10988250,
//       "Open": 18267,
//       "High": 18275.95,
//       "Low": 18172.35,
//       "Close": 18219.95
//     },
//     {
//       "LastTradeTime": 1672390800,
//       "QuotationLot": 50,
//       "TradedQty": 501300,
//       "OpenInterest": 10991100,
//       "Open": 18242.55,
//       "High": 18292.2,
//       "Low": 18233.3,
//       "Close": 18275.15
//     },
//     {
//       "LastTradeTime": 1672389000,
//       "QuotationLot": 50,
//       "TradedQty": 647400,
//       "OpenInterest": 10950850,
//       "Open": 18246.25,
//       "High": 18287,
//       "Low": 18242.05,
//       "Close": 18245
//     },
//     {
//       "LastTradeTime": 1672387200,
//       "QuotationLot": 50,
//       "TradedQty": 582650,
//       "OpenInterest": 10858350,
//       "Open": 18298.55,
//       "High": 18299.95,
//       "Low": 18240.1,
//       "Close": 18246.05
//     },
//     {
//       "LastTradeTime": 1672385400,
//       "QuotationLot": 50,
//       "TradedQty": 531050,
//       "OpenInterest": 10836700,
//       "Open": 18297.75,
//       "High": 18304.6,
//       "Low": 18261,
//       "Close": 18299.15
//     },
//     {
//       "LastTradeTime": 1672383600,
//       "QuotationLot": 50,
//       "TradedQty": 463200,
//       "OpenInterest": 10792250,
//       "Open": 18279,
//       "High": 18321.35,
//       "Low": 18278.6,
//       "Close": 18298.25
//     },
//     {
//       "LastTradeTime": 1672381800,
//       "QuotationLot": 50,
//       "TradedQty": 444150,
//       "OpenInterest": 10697550,
//       "Open": 18279.9,
//       "High": 18303.65,
//       "Low": 18271,
//       "Close": 18280.55
//     },
//     {
//       "LastTradeTime": 1672380000,
//       "QuotationLot": 50,
//       "TradedQty": 437350,
//       "OpenInterest": 10705850,
//       "Open": 18310.1,
//       "High": 18317.7,
//       "Low": 18274.35,
//       "Close": 18277.65
//     },
//     {
//       "LastTradeTime": 1672378200,
//       "QuotationLot": 50,
//       "TradedQty": 421450,
//       "OpenInterest": 10704950,
//       "Open": 18324.95,
//       "High": 18331.8,
//       "Low": 18300,
//       "Close": 18311
//     },
//     {
//       "LastTradeTime": 1672376400,
//       "QuotationLot": 50,
//       "TradedQty": 308450,
//       "OpenInterest": 10692000,
//       "Open": 18336.6,
//       "High": 18350.2,
//       "Low": 18320,
//       "Close": 18324.9
//     },
//     {
//       "LastTradeTime": 1672374600,
//       "QuotationLot": 50,
//       "TradedQty": 465800,
//       "OpenInterest": 10691800,
//       "Open": 18347,
//       "High": 18350,
//       "Low": 18317.15,
//       "Close": 18336.8
//     },
//     {
//       "LastTradeTime": 1672372800,
//       "QuotationLot": 50,
//       "TradedQty": 806900,
//       "OpenInterest": 10569550,
//       "Open": 18352.05,
//       "High": 18374,
//       "Low": 18313.5,
//       "Close": 18349.35
//     },
//     {
//       "LastTradeTime": 1672371000,
//       "QuotationLot": 50,
//       "TradedQty": 759650,
//       "OpenInterest": 10515850,
//       "Open": 18338,
//       "High": 18358.8,
//       "Low": 18309.35,
//       "Close": 18352
//     },
//     {
//       "LastTradeTime": 1672308000,
//       "QuotationLot": 50,
//       "TradedQty": 0,
//       "OpenInterest": 4034650,
//       "Open": 18192,
//       "High": 18192,
//       "Low": 18192,
//       "Close": 18192
//     },
//     {
//       "LastTradeTime": 1672306200,
//       "QuotationLot": 50,
//       "TradedQty": 768150,
//       "OpenInterest": 4034650,
//       "Open": 18142.9,
//       "High": 18198,
//       "Low": 18142.9,
//       "Close": 18192
//     },
//     {
//       "LastTradeTime": 1672304400,
//       "QuotationLot": 50,
//       "TradedQty": 760250,
//       "OpenInterest": 4300650,
//       "Open": 18070.35,
//       "High": 18159.2,
//       "Low": 18070.35,
//       "Close": 18144.2
//     },
//     {
//       "LastTradeTime": 1672302600,
//       "QuotationLot": 50,
//       "TradedQty": 650550,
//       "OpenInterest": 4507050,
//       "Open": 18095.9,
//       "High": 18102.9,
//       "Low": 18073.55,
//       "Close": 18073.55
//     },
//     {
//       "LastTradeTime": 1672300800,
//       "QuotationLot": 50,
//       "TradedQty": 521950,
//       "OpenInterest": 4527150,
//       "Open": 18043.5,
//       "High": 18097,
//       "Low": 18039.25,
//       "Close": 18095.9
//     },
//     {
//       "LastTradeTime": 1672299000,
//       "QuotationLot": 50,
//       "TradedQty": 347500,
//       "OpenInterest": 4818150,
//       "Open": 18021.95,
//       "High": 18058.75,
//       "Low": 18020.3,
//       "Close": 18043.25
//     },
//     {
//       "LastTradeTime": 1672297200,
//       "QuotationLot": 50,
//       "TradedQty": 279250,
//       "OpenInterest": 4871950,
//       "Open": 18017.6,
//       "High": 18029.55,
//       "Low": 18008.2,
//       "Close": 18020.35
//     },
//     {
//       "LastTradeTime": 1672295400,
//       "QuotationLot": 50,
//       "TradedQty": 415600,
//       "OpenInterest": 4852500,
//       "Open": 18032,
//       "High": 18038.85,
//       "Low": 18015.35,
//       "Close": 18019
//     },
//     {
//       "LastTradeTime": 1672293600,
//       "QuotationLot": 50,
//       "TradedQty": 741650,
//       "OpenInterest": 4952950,
//       "Open": 18015.5,
//       "High": 18059.15,
//       "Low": 17999,
//       "Close": 18032.35
//     },
//     {
//       "LastTradeTime": 1672291800,
//       "QuotationLot": 50,
//       "TradedQty": 278700,
//       "OpenInterest": 4786150,
//       "Open": 18007.1,
//       "High": 18020,
//       "Low": 18004.9,
//       "Close": 18015.5
//     },
//     {
//       "LastTradeTime": 1672290000,
//       "QuotationLot": 50,
//       "TradedQty": 297300,
//       "OpenInterest": 4709600,
//       "Open": 18004,
//       "High": 18021.6,
//       "Low": 18001,
//       "Close": 18007.1
//     },
//     {
//       "LastTradeTime": 1672288200,
//       "QuotationLot": 50,
//       "TradedQty": 531450,
//       "OpenInterest": 4621850,
//       "Open": 18014,
//       "High": 18017.05,
//       "Low": 17985,
//       "Close": 18005
//     },
//     {
//       "LastTradeTime": 1672286400,
//       "QuotationLot": 50,
//       "TradedQty": 778200,
//       "OpenInterest": 4537650,
//       "Open": 18052.9,
//       "High": 18054.8,
//       "Low": 18000.2,
//       "Close": 18014.25
//     },
//     {
//       "LastTradeTime": 1672284600,
//       "QuotationLot": 50,
//       "TradedQty": 568550,
//       "OpenInterest": 4417650,
//       "Open": 18122,
//       "High": 18122,
//       "Low": 18014,
//       "Close": 18054.8
//     },
//     {
//       "LastTradeTime": 1672221600,
//       "QuotationLot": 50,
//       "TradedQty": 150,
//       "OpenInterest": 6835600,
//       "Open": 18113.65,
//       "High": 18113.65,
//       "Low": 18113.65,
//       "Close": 18113.65
//     },
//     {
//       "LastTradeTime": 1672219800,
//       "QuotationLot": 50,
//       "TradedQty": 797650,
//       "OpenInterest": 6835600,
//       "Open": 18113.95,
//       "High": 18148.9,
//       "Low": 18102.65,
//       "Close": 18113.65
//     },
//     {
//       "LastTradeTime": 1672218000,
//       "QuotationLot": 50,
//       "TradedQty": 749400,
//       "OpenInterest": 6749400,
//       "Open": 18163.45,
//       "High": 18168,
//       "Low": 18097,
//       "Close": 18115
//     },
//     {
//       "LastTradeTime": 1672216200,
//       "QuotationLot": 50,
//       "TradedQty": 571250,
//       "OpenInterest": 6629750,
//       "Open": 18163,
//       "High": 18178.4,
//       "Low": 18146.1,
//       "Close": 18163.8
//     },
//     {
//       "LastTradeTime": 1672214400,
//       "QuotationLot": 50,
//       "TradedQty": 476650,
//       "OpenInterest": 6485450,
//       "Open": 18124.95,
//       "High": 18175.5,
//       "Low": 18124.95,
//       "Close": 18163
//     },
//     {
//       "LastTradeTime": 1672212600,
//       "QuotationLot": 50,
//       "TradedQty": 515400,
//       "OpenInterest": 6400050,
//       "Open": 18142.55,
//       "High": 18151,
//       "Low": 18116.75,
//       "Close": 18124.95
//     },
//     {
//       "LastTradeTime": 1672210800,
//       "QuotationLot": 50,
//       "TradedQty": 307500,
//       "OpenInterest": 6441250,
//       "Open": 18130.35,
//       "High": 18154.05,
//       "Low": 18126,
//       "Close": 18140.15
//     },
//     {
//       "LastTradeTime": 1672209000,
//       "QuotationLot": 50,
//       "TradedQty": 339700,
//       "OpenInterest": 6435250,
//       "Open": 18147,
//       "High": 18164,
//       "Low": 18125.85,
//       "Close": 18128.7
//     },
//     {
//       "LastTradeTime": 1672207200,
//       "QuotationLot": 50,
//       "TradedQty": 334750,
//       "OpenInterest": 6408800,
//       "Open": 18132.8,
//       "High": 18156.2,
//       "Low": 18116.35,
//       "Close": 18147
//     },
//     {
//       "LastTradeTime": 1672205400,
//       "QuotationLot": 50,
//       "TradedQty": 379950,
//       "OpenInterest": 6382450,
//       "Open": 18130.9,
//       "High": 18147,
//       "Low": 18117.6,
//       "Close": 18132.8
//     },
//     {
//       "LastTradeTime": 1672203600,
//       "QuotationLot": 50,
//       "TradedQty": 293800,
//       "OpenInterest": 6369950,
//       "Open": 18103,
//       "High": 18132.05,
//       "Low": 18092.4,
//       "Close": 18130.9
//     },
//     {
//       "LastTradeTime": 1672201800,
//       "QuotationLot": 50,
//       "TradedQty": 630650,
//       "OpenInterest": 6413550,
//       "Open": 18134,
//       "High": 18148.8,
//       "Low": 18090.1,
//       "Close": 18104
//     },
//     {
//       "LastTradeTime": 1672200000,
//       "QuotationLot": 50,
//       "TradedQty": 561050,
//       "OpenInterest": 6398150,
//       "Open": 18083.15,
//       "High": 18141.5,
//       "Low": 18080,
//       "Close": 18134
//     },
//     {
//       "LastTradeTime": 1672198200,
//       "QuotationLot": 50,
//       "TradedQty": 589100,
//       "OpenInterest": 6332050,
//       "Open": 18097.75,
//       "High": 18124.2,
//       "Low": 18073.85,
//       "Close": 18083
//     },
//     {
//       "LastTradeTime": 1672135200,
//       "QuotationLot": 50,
//       "TradedQty": 350,
//       "OpenInterest": 7806350,
//       "Open": 18144.15,
//       "High": 18144.15,
//       "Low": 18144.15,
//       "Close": 18144.15
//     },
//     {
//       "LastTradeTime": 1672133400,
//       "QuotationLot": 50,
//       "TradedQty": 899200,
//       "OpenInterest": 7806350,
//       "Open": 18130.75,
//       "High": 18152.05,
//       "Low": 18109.8,
//       "Close": 18145.9
//     },
//     {
//       "LastTradeTime": 1672131600,
//       "QuotationLot": 50,
//       "TradedQty": 622550,
//       "OpenInterest": 7816400,
//       "Open": 18096.5,
//       "High": 18148,
//       "Low": 18081.75,
//       "Close": 18131
//     },
//     {
//       "LastTradeTime": 1672129800,
//       "QuotationLot": 50,
//       "TradedQty": 731000,
//       "OpenInterest": 7834150,
//       "Open": 18117.55,
//       "High": 18138.3,
//       "Low": 18081.35,
//       "Close": 18096.5
//     },
//     {
//       "LastTradeTime": 1672128000,
//       "QuotationLot": 50,
//       "TradedQty": 750750,
//       "OpenInterest": 7730850,
//       "Open": 18071,
//       "High": 18130,
//       "Low": 18065,
//       "Close": 18115
//     },
//     {
//       "LastTradeTime": 1672126200,
//       "QuotationLot": 50,
//       "TradedQty": 401850,
//       "OpenInterest": 7620200,
//       "Open": 18032.05,
//       "High": 18084.2,
//       "Low": 18026.15,
//       "Close": 18072.65
//     },
//     {
//       "LastTradeTime": 1672124400,
//       "QuotationLot": 50,
//       "TradedQty": 319750,
//       "OpenInterest": 7663400,
//       "Open": 18053.75,
//       "High": 18061.1,
//       "Low": 18017.05,
//       "Close": 18034.7
//     },
//     {
//       "LastTradeTime": 1672122600,
//       "QuotationLot": 50,
//       "TradedQty": 304200,
//       "OpenInterest": 7684600,
//       "Open": 18060,
//       "High": 18080.95,
//       "Low": 18046.8,
//       "Close": 18052.45
//     },
//     {
//       "LastTradeTime": 1672120800,
//       "QuotationLot": 50,
//       "TradedQty": 295000,
//       "OpenInterest": 7676350,
//       "Open": 18046.95,
//       "High": 18070.85,
//       "Low": 18027.6,
//       "Close": 18060
//     },
//     {
//       "LastTradeTime": 1672119000,
//       "QuotationLot": 50,
//       "TradedQty": 537150,
//       "OpenInterest": 7662650,
//       "Open": 18055,
//       "High": 18072,
//       "Low": 18031.15,
//       "Close": 18047.3
//     },
//     {
//       "LastTradeTime": 1672117200,
//       "QuotationLot": 50,
//       "TradedQty": 343350,
//       "OpenInterest": 7739800,
//       "Open": 18043.35,
//       "High": 18063.5,
//       "Low": 18023.45,
//       "Close": 18055.8
//     },
//     {
//       "LastTradeTime": 1672115400,
//       "QuotationLot": 50,
//       "TradedQty": 437350,
//       "OpenInterest": 7764750,
//       "Open": 18011.75,
//       "High": 18043,
//       "Low": 17980.95,
//       "Close": 18042
//     },
//     {
//       "LastTradeTime": 1672113600,
//       "QuotationLot": 50,
//       "TradedQty": 1432050,
//       "OpenInterest": 7814350,
//       "Open": 18075.05,
//       "High": 18075.05,
//       "Low": 17969,
//       "Close": 18010
//     },
//     {
//       "LastTradeTime": 1672111800,
//       "QuotationLot": 50,
//       "TradedQty": 1107950,
//       "OpenInterest": 7822650,
//       "Open": 18082.2,
//       "High": 18143.45,
//       "Low": 18059.8,
//       "Close": 18077.15
//     },
//     {
//       "LastTradeTime": 1672048800,
//       "QuotationLot": 50,
//       "TradedQty": 300,
//       "OpenInterest": 8953400,
//       "Open": 18018.1,
//       "High": 18018.1,
//       "Low": 18018.1,
//       "Close": 18018.1
//     },
//     {
//       "LastTradeTime": 1672047000,
//       "QuotationLot": 50,
//       "TradedQty": 1451450,
//       "OpenInterest": 8953400,
//       "Open": 18100.15,
//       "High": 18105.5,
//       "Low": 17995.9,
//       "Close": 18018.55
//     },
//     {
//       "LastTradeTime": 1672045200,
//       "QuotationLot": 50,
//       "TradedQty": 1003350,
//       "OpenInterest": 9251150,
//       "Open": 18041.65,
//       "High": 18106,
//       "Low": 18040.5,
//       "Close": 18102.9
//     },
//     {
//       "LastTradeTime": 1672043400,
//       "QuotationLot": 50,
//       "TradedQty": 330900,
//       "OpenInterest": 9387300,
//       "Open": 18011.3,
//       "High": 18047,
//       "Low": 18008.85,
//       "Close": 18042
//     },
//     {
//       "LastTradeTime": 1672041600,
//       "QuotationLot": 50,
//       "TradedQty": 592150,
//       "OpenInterest": 9473850,
//       "Open": 18002.25,
//       "High": 18044,
//       "Low": 18000.55,
//       "Close": 18010
//     },
//     {
//       "LastTradeTime": 1672039800,
//       "QuotationLot": 50,
//       "TradedQty": 352950,
//       "OpenInterest": 9463950,
//       "Open": 18000,
//       "High": 18021.65,
//       "Low": 17988,
//       "Close": 18001.25
//     },
//     {
//       "LastTradeTime": 1672038000,
//       "QuotationLot": 50,
//       "TradedQty": 284150,
//       "OpenInterest": 9487650,
//       "Open": 17996.05,
//       "High": 18008.25,
//       "Low": 17982,
//       "Close": 18000
//     },
//     {
//       "LastTradeTime": 1672036200,
//       "QuotationLot": 50,
//       "TradedQty": 310050,
//       "OpenInterest": 9529300,
//       "Open": 18013,
//       "High": 18026.95,
//       "Low": 17995.8,
//       "Close": 17996.55
//     },
//     {
//       "LastTradeTime": 1672034400,
//       "QuotationLot": 50,
//       "TradedQty": 496650,
//       "OpenInterest": 9583950,
//       "Open": 17995.45,
//       "High": 18028,
//       "Low": 17993.1,
//       "Close": 18013
//     },
//     {
//       "LastTradeTime": 1672032600,
//       "QuotationLot": 50,
//       "TradedQty": 420200,
//       "OpenInterest": 9670450,
//       "Open": 17995.8,
//       "High": 18006.6,
//       "Low": 17975.75,
//       "Close": 17995.45
//     },
//     {
//       "LastTradeTime": 1672030800,
//       "QuotationLot": 50,
//       "TradedQty": 327100,
//       "OpenInterest": 9652950,
//       "Open": 17969.4,
//       "High": 17998.75,
//       "Low": 17959.05,
//       "Close": 17994.7
//     },
//     {
//       "LastTradeTime": 1672029000,
//       "QuotationLot": 50,
//       "TradedQty": 639300,
//       "OpenInterest": 9639900,
//       "Open": 17969.6,
//       "High": 17976.45,
//       "Low": 17938,
//       "Close": 17972.05
//     },
//     {
//       "LastTradeTime": 1672027200,
//       "QuotationLot": 50,
//       "TradedQty": 1153950,
//       "OpenInterest": 9765400,
//       "Open": 17937,
//       "High": 17994.9,
//       "Low": 17914.05,
//       "Close": 17966.75
//     },
//     {
//       "LastTradeTime": 1672025400,
//       "QuotationLot": 50,
//       "TradedQty": 1140850,
//       "OpenInterest": 9892400,
//       "Open": 17890.05,
//       "High": 17942,
//       "Low": 17835.55,
//       "Close": 17935.65
//     },
//     {
//       "LastTradeTime": 1671789600,
//       "QuotationLot": 50,
//       "TradedQty": 750,
//       "OpenInterest": 10965100,
//       "Open": 17880.1,
//       "High": 17880.1,
//       "Low": 17880.1,
//       "Close": 17880.1
//     },
//     {
//       "LastTradeTime": 1671787800,
//       "QuotationLot": 50,
//       "TradedQty": 1745800,
//       "OpenInterest": 10965100,
//       "Open": 17875.15,
//       "High": 17890,
//       "Low": 17831.2,
//       "Close": 17882.85
//     },
//     {
//       "LastTradeTime": 1671786000,
//       "QuotationLot": 50,
//       "TradedQty": 683200,
//       "OpenInterest": 11115650,
//       "Open": 17928.15,
//       "High": 17940,
//       "Low": 17870.2,
//       "Close": 17875
//     },
//     {
//       "LastTradeTime": 1671784200,
//       "QuotationLot": 50,
//       "TradedQty": 839150,
//       "OpenInterest": 11128600,
//       "Open": 17919.5,
//       "High": 17928.15,
//       "Low": 17884,
//       "Close": 17926.6
//     },
//     {
//       "LastTradeTime": 1671782400,
//       "QuotationLot": 50,
//       "TradedQty": 604550,
//       "OpenInterest": 11121400,
//       "Open": 17953,
//       "High": 17961,
//       "Low": 17905.05,
//       "Close": 17916.55
//     },
//     {
//       "LastTradeTime": 1671780600,
//       "QuotationLot": 50,
//       "TradedQty": 439950,
//       "OpenInterest": 11114700,
//       "Open": 17953.5,
//       "High": 17982.2,
//       "Low": 17940,
//       "Close": 17953
//     },
//     {
//       "LastTradeTime": 1671778800,
//       "QuotationLot": 50,
//       "TradedQty": 492950,
//       "OpenInterest": 11093950,
//       "Open": 17979.55,
//       "High": 17989,
//       "Low": 17940,
//       "Close": 17953.5
//     },
//     {
//       "LastTradeTime": 1671777000,
//       "QuotationLot": 50,
//       "TradedQty": 1477900,
//       "OpenInterest": 11002900,
//       "Open": 17932.75,
//       "High": 17993.55,
//       "Low": 17930.45,
//       "Close": 17979.55
//     },
//     {
//       "LastTradeTime": 1671775200,
//       "QuotationLot": 50,
//       "TradedQty": 994450,
//       "OpenInterest": 11014650,
//       "Open": 17972.75,
//       "High": 17979.2,
//       "Low": 17921.1,
//       "Close": 17934.05
//     },
//     {
//       "LastTradeTime": 1671773400,
//       "QuotationLot": 50,
//       "TradedQty": 425100,
//       "OpenInterest": 10869900,
//       "Open": 18015.95,
//       "High": 18028,
//       "Low": 17973.05,
//       "Close": 17973.3
//     },
//     {
//       "LastTradeTime": 1671771600,
//       "QuotationLot": 50,
//       "TradedQty": 598100,
//       "OpenInterest": 10905300,
//       "Open": 17990.6,
//       "High": 18018.6,
//       "Low": 17985.15,
//       "Close": 18015.9
//     },
//     {
//       "LastTradeTime": 1671769800,
//       "QuotationLot": 50,
//       "TradedQty": 1237850,
//       "OpenInterest": 10693850,
//       "Open": 18046,
//       "High": 18054,
//       "Low": 17982,
//       "Close": 17991.5
//     },
//     {
//       "LastTradeTime": 1671768000,
//       "QuotationLot": 50,
//       "TradedQty": 1112400,
//       "OpenInterest": 10402450,
//       "Open": 18046.8,
//       "High": 18115,
//       "Low": 18044,
//       "Close": 18047.9
//     },
//     {
//       "LastTradeTime": 1671766200,
//       "QuotationLot": 50,
//       "TradedQty": 1398300,
//       "OpenInterest": 10233200,
//       "Open": 18055.05,
//       "High": 18112,
//       "Low": 18035.55,
//       "Close": 18048.85
//     },
//     {
//       "LastTradeTime": 1671703200,
//       "QuotationLot": 50,
//       "TradedQty": 100,
//       "OpenInterest": 10281950,
//       "Open": 18159.3,
//       "High": 18159.3,
//       "Low": 18159.3,
//       "Close": 18159.3
//     },
//     {
//       "LastTradeTime": 1671701400,
//       "QuotationLot": 50,
//       "TradedQty": 1171300,
//       "OpenInterest": 10281950,
//       "Open": 18155,
//       "High": 18199.8,
//       "Low": 18141.8,
//       "Close": 18159.3
//     },
//     {
//       "LastTradeTime": 1671699600,
//       "QuotationLot": 50,
//       "TradedQty": 596000,
//       "OpenInterest": 10390000,
//       "Open": 18195,
//       "High": 18215,
//       "Low": 18141,
//       "Close": 18155.2
//     },
//     {
//       "LastTradeTime": 1671697800,
//       "QuotationLot": 50,
//       "TradedQty": 577400,
//       "OpenInterest": 10392500,
//       "Open": 18194,
//       "High": 18237.4,
//       "Low": 18182,
//       "Close": 18195
//     },
//     {
//       "LastTradeTime": 1671696000,
//       "QuotationLot": 50,
//       "TradedQty": 725600,
//       "OpenInterest": 10502000,
//       "Open": 18156.2,
//       "High": 18230,
//       "Low": 18153.95,
//       "Close": 18194
//     },
//     {
//       "LastTradeTime": 1671694200,
//       "QuotationLot": 50,
//       "TradedQty": 886300,
//       "OpenInterest": 10615450,
//       "Open": 18124.75,
//       "High": 18192.8,
//       "Low": 18118.25,
//       "Close": 18157.85
//     },
//     {
//       "LastTradeTime": 1671692400,
//       "QuotationLot": 50,
//       "TradedQty": 450600,
//       "OpenInterest": 10620900,
//       "Open": 18148,
//       "High": 18165.95,
//       "Low": 18112,
//       "Close": 18126
//     },
//     {
//       "LastTradeTime": 1671690600,
//       "QuotationLot": 50,
//       "TradedQty": 1221800,
//       "OpenInterest": 10752350,
//       "Open": 18139.15,
//       "High": 18175.45,
//       "Low": 18123,
//       "Close": 18148
//     },
//     {
//       "LastTradeTime": 1671688800,
//       "QuotationLot": 50,
//       "TradedQty": 659650,
//       "OpenInterest": 10586050,
//       "Open": 18173.2,
//       "High": 18178.9,
//       "Low": 18126.65,
//       "Close": 18140.5
//     },
//     {
//       "LastTradeTime": 1671687000,
//       "QuotationLot": 50,
//       "TradedQty": 629750,
//       "OpenInterest": 10493350,
//       "Open": 18171.15,
//       "High": 18215,
//       "Low": 18161.75,
//       "Close": 18171.7
//     },
//     {
//       "LastTradeTime": 1671685200,
//       "QuotationLot": 50,
//       "TradedQty": 799150,
//       "OpenInterest": 10388150,
//       "Open": 18212.15,
//       "High": 18221.45,
//       "Low": 18166,
//       "Close": 18170.35
//     },
//     {
//       "LastTradeTime": 1671683400,
//       "QuotationLot": 50,
//       "TradedQty": 1138650,
//       "OpenInterest": 10269900,
//       "Open": 18297.3,
//       "High": 18304.5,
//       "Low": 18193.35,
//       "Close": 18211.1
//     },
//     {
//       "LastTradeTime": 1671681600,
//       "QuotationLot": 50,
//       "TradedQty": 1297800,
//       "OpenInterest": 10173550,
//       "Open": 18260,
//       "High": 18323.95,
//       "Low": 18235,
//       "Close": 18294.9
//     },
//     {
//       "LastTradeTime": 1671679800,
//       "QuotationLot": 50,
//       "TradedQty": 1007450,
//       "OpenInterest": 10247150,
//       "Open": 18327,
//       "High": 18356.9,
//       "Low": 18257,
//       "Close": 18263.65
//     },
//     {
//       "LastTradeTime": 1671616800,
//       "QuotationLot": 50,
//       "TradedQty": 1900,
//       "OpenInterest": 10627700,
//       "Open": 18277.9,
//       "High": 18277.9,
//       "Low": 18277.9,
//       "Close": 18277.9
//     },
//     {
//       "LastTradeTime": 1671615000,
//       "QuotationLot": 50,
//       "TradedQty": 1640600,
//       "OpenInterest": 10627700,
//       "Open": 18289.3,
//       "High": 18314.8,
//       "Low": 18245.5,
//       "Close": 18279.45
//     },
//     {
//       "LastTradeTime": 1671613200,
//       "QuotationLot": 50,
//       "TradedQty": 1211550,
//       "OpenInterest": 10289250,
//       "Open": 18305.25,
//       "High": 18352.95,
//       "Low": 18267.85,
//       "Close": 18286.9
//     },
//     {
//       "LastTradeTime": 1671611400,
//       "QuotationLot": 50,
//       "TradedQty": 1493750,
//       "OpenInterest": 10375750,
//       "Open": 18254.85,
//       "High": 18310,
//       "Low": 18232,
//       "Close": 18307.4
//     },
//     {
//       "LastTradeTime": 1671609600,
//       "QuotationLot": 50,
//       "TradedQty": 1279700,
//       "OpenInterest": 10297050,
//       "Open": 18325,
//       "High": 18347.55,
//       "Low": 18223,
//       "Close": 18249.95
//     },
//     {
//       "LastTradeTime": 1671607800,
//       "QuotationLot": 50,
//       "TradedQty": 606500,
//       "OpenInterest": 10319400,
//       "Open": 18320.5,
//       "High": 18363.95,
//       "Low": 18311.25,
//       "Close": 18325.9
//     },
//     {
//       "LastTradeTime": 1671606000,
//       "QuotationLot": 50,
//       "TradedQty": 638300,
//       "OpenInterest": 10312000,
//       "Open": 18358.55,
//       "High": 18359.2,
//       "Low": 18318,
//       "Close": 18320.55
//     },
//     {
//       "LastTradeTime": 1671604200,
//       "QuotationLot": 50,
//       "TradedQty": 937200,
//       "OpenInterest": 10186100,
//       "Open": 18427.45,
//       "High": 18427.45,
//       "Low": 18341.3,
//       "Close": 18358.55
//     },
//     {
//       "LastTradeTime": 1671602400,
//       "QuotationLot": 50,
//       "TradedQty": 321950,
//       "OpenInterest": 10119950,
//       "Open": 18421.25,
//       "High": 18448.45,
//       "Low": 18413,
//       "Close": 18427.45
//     },
//     {
//       "LastTradeTime": 1671600600,
//       "QuotationLot": 50,
//       "TradedQty": 317550,
//       "OpenInterest": 10137200,
//       "Open": 18401.15,
//       "High": 18433.6,
//       "Low": 18393,
//       "Close": 18421.25
//     },
//     {
//       "LastTradeTime": 1671598800,
//       "QuotationLot": 50,
//       "TradedQty": 538350,
//       "OpenInterest": 10131000,
//       "Open": 18399.85,
//       "High": 18419.65,
//       "Low": 18380.2,
//       "Close": 18402
//     },
//     {
//       "LastTradeTime": 1671597000,
//       "QuotationLot": 50,
//       "TradedQty": 761500,
//       "OpenInterest": 10131500,
//       "Open": 18418.8,
//       "High": 18450,
//       "Low": 18395.65,
//       "Close": 18400.5
//     },
//     {
//       "LastTradeTime": 1671595200,
//       "QuotationLot": 50,
//       "TradedQty": 1211250,
//       "OpenInterest": 10034300,
//       "Open": 18500,
//       "High": 18505,
//       "Low": 18411.2,
//       "Close": 18421
//     },
//     {
//       "LastTradeTime": 1671593400,
//       "QuotationLot": 50,
//       "TradedQty": 830550,
//       "OpenInterest": 10046150,
//       "Open": 18470.1,
//       "High": 18514.9,
//       "Low": 18465.1,
//       "Close": 18497.65
//     },
//     {
//       "LastTradeTime": 1671530400,
//       "QuotationLot": 50,
//       "TradedQty": 200,
//       "OpenInterest": 10448250,
//       "Open": 18425,
//       "High": 18425,
//       "Low": 18425,
//       "Close": 18425
//     },
//     {
//       "LastTradeTime": 1671528600,
//       "QuotationLot": 50,
//       "TradedQty": 1399750,
//       "OpenInterest": 10448250,
//       "Open": 18390,
//       "High": 18449,
//       "Low": 18390,
//       "Close": 18428.2
//     },
//     {
//       "LastTradeTime": 1671526800,
//       "QuotationLot": 50,
//       "TradedQty": 752650,
//       "OpenInterest": 10360200,
//       "Open": 18382.25,
//       "High": 18398.05,
//       "Low": 18355,
//       "Close": 18391.35
//     },
//     {
//       "LastTradeTime": 1671525000,
//       "QuotationLot": 50,
//       "TradedQty": 1002400,
//       "OpenInterest": 10425700,
//       "Open": 18316.05,
//       "High": 18382.7,
//       "Low": 18311.4,
//       "Close": 18382.25
//     },
//     {
//       "LastTradeTime": 1671523200,
//       "QuotationLot": 50,
//       "TradedQty": 385400,
//       "OpenInterest": 10669700,
//       "Open": 18300,
//       "High": 18323,
//       "Low": 18282.15,
//       "Close": 18316.05
//     },
//     {
//       "LastTradeTime": 1671521400,
//       "QuotationLot": 50,
//       "TradedQty": 354750,
//       "OpenInterest": 10690050,
//       "Open": 18303.4,
//       "High": 18333,
//       "Low": 18286,
//       "Close": 18300
//     },
//     {
//       "LastTradeTime": 1671519600,
//       "QuotationLot": 50,
//       "TradedQty": 479550,
//       "OpenInterest": 10697950,
//       "Open": 18303.6,
//       "High": 18325.5,
//       "Low": 18293.05,
//       "Close": 18305.25
//     },
//     {
//       "LastTradeTime": 1671517800,
//       "QuotationLot": 50,
//       "TradedQty": 746850,
//       "OpenInterest": 10773300,
//       "Open": 18252,
//       "High": 18315.1,
//       "Low": 18252,
//       "Close": 18306.35
//     },
//     {
//       "LastTradeTime": 1671516000,
//       "QuotationLot": 50,
//       "TradedQty": 353800,
//       "OpenInterest": 11012100,
//       "Open": 18261,
//       "High": 18262.9,
//       "Low": 18237,
//       "Close": 18252
//     },
//     {
//       "LastTradeTime": 1671514200,
//       "QuotationLot": 50,
//       "TradedQty": 561950,
//       "OpenInterest": 10966150,
//       "Open": 18259,
//       "High": 18269.75,
//       "Low": 18231.9,
//       "Close": 18261
//     },
//     {
//       "LastTradeTime": 1671512400,
//       "QuotationLot": 50,
//       "TradedQty": 359950,
//       "OpenInterest": 10900250,
//       "Open": 18262,
//       "High": 18278,
//       "Low": 18255.25,
//       "Close": 18259.75
//     },
//     {
//       "LastTradeTime": 1671510600,
//       "QuotationLot": 50,
//       "TradedQty": 688450,
//       "OpenInterest": 10772000,
//       "Open": 18250,
//       "High": 18288.5,
//       "Low": 18243.85,
//       "Close": 18261.35
//     },
//     {
//       "LastTradeTime": 1671508800,
//       "QuotationLot": 50,
//       "TradedQty": 2001100,
//       "OpenInterest": 10553900,
//       "Open": 18341.9,
//       "High": 18341.9,
//       "Low": 18249.1,
//       "Close": 18251.05
//     },
//     {
//       "LastTradeTime": 1671507000,
//       "QuotationLot": 50,
//       "TradedQty": 1625750,
//       "OpenInterest": 10133550,
//       "Open": 18420,
//       "High": 18440,
//       "Low": 18340,
//       "Close": 18342.05
//     },
//     {
//       "LastTradeTime": 1671444000,
//       "QuotationLot": 50,
//       "TradedQty": 700,
//       "OpenInterest": 10332900,
//       "Open": 18499,
//       "High": 18499,
//       "Low": 18499,
//       "Close": 18499
//     },
//     {
//       "LastTradeTime": 1671442200,
//       "QuotationLot": 50,
//       "TradedQty": 978750,
//       "OpenInterest": 10332900,
//       "Open": 18506.95,
//       "High": 18519,
//       "Low": 18487.8,
//       "Close": 18499
//     },
//     {
//       "LastTradeTime": 1671440400,
//       "QuotationLot": 50,
//       "TradedQty": 940500,
//       "OpenInterest": 10419500,
//       "Open": 18451.6,
//       "High": 18510,
//       "Low": 18446.8,
//       "Close": 18505.65
//     },
//     {
//       "LastTradeTime": 1671438600,
//       "QuotationLot": 50,
//       "TradedQty": 259100,
//       "OpenInterest": 10544800,
//       "Open": 18457.95,
//       "High": 18464,
//       "Low": 18435,
//       "Close": 18451.6
//     },
//     {
//       "LastTradeTime": 1671436800,
//       "QuotationLot": 50,
//       "TradedQty": 322050,
//       "OpenInterest": 10525250,
//       "Open": 18431.55,
//       "High": 18464.95,
//       "Low": 18428.3,
//       "Close": 18457.35
//     },
//     {
//       "LastTradeTime": 1671435000,
//       "QuotationLot": 50,
//       "TradedQty": 382700,
//       "OpenInterest": 10518150,
//       "Open": 18422.55,
//       "High": 18435,
//       "Low": 18402,
//       "Close": 18428.55
//     },
//     {
//       "LastTradeTime": 1671433200,
//       "QuotationLot": 50,
//       "TradedQty": 338400,
//       "OpenInterest": 10481300,
//       "Open": 18465,
//       "High": 18466.9,
//       "Low": 18418,
//       "Close": 18422.55
//     },
//     {
//       "LastTradeTime": 1671431400,
//       "QuotationLot": 50,
//       "TradedQty": 511450,
//       "OpenInterest": 10555250,
//       "Open": 18443.8,
//       "High": 18468,
//       "Low": 18430.1,
//       "Close": 18466.25
//     },
//     {
//       "LastTradeTime": 1671429600,
//       "QuotationLot": 50,
//       "TradedQty": 518200,
//       "OpenInterest": 10548400,
//       "Open": 18415.5,
//       "High": 18449.9,
//       "Low": 18413.6,
//       "Close": 18443
//     },
//     {
//       "LastTradeTime": 1671427800,
//       "QuotationLot": 50,
//       "TradedQty": 222750,
//       "OpenInterest": 10482050,
//       "Open": 18392,
//       "High": 18422.4,
//       "Low": 18387.3,
//       "Close": 18415.5
//     },
//     {
//       "LastTradeTime": 1671426000,
//       "QuotationLot": 50,
//       "TradedQty": 368400,
//       "OpenInterest": 10474250,
//       "Open": 18417.2,
//       "High": 18430.9,
//       "Low": 18392,
//       "Close": 18392
//     },
//     {
//       "LastTradeTime": 1671424200,
//       "QuotationLot": 50,
//       "TradedQty": 729500,
//       "OpenInterest": 10410700,
//       "Open": 18381.4,
//       "High": 18429,
//       "Low": 18381.4,
//       "Close": 18417.1
//     },
//     {
//       "LastTradeTime": 1671422400,
//       "QuotationLot": 50,
//       "TradedQty": 856150,
//       "OpenInterest": 10438250,
//       "Open": 18345,
//       "High": 18392.4,
//       "Low": 18333,
//       "Close": 18384
//     },
//     {
//       "LastTradeTime": 1671420600,
//       "QuotationLot": 50,
//       "TradedQty": 846100,
//       "OpenInterest": 10431450,
//       "Open": 18340,
//       "High": 18375,
//       "Low": 18308.6,
//       "Close": 18345
//     },
//     {
//       "LastTradeTime": 1671184800,
//       "QuotationLot": 50,
//       "TradedQty": 1150,
//       "OpenInterest": 11000750,
//       "Open": 18330,
//       "High": 18330,
//       "Low": 18330,
//       "Close": 18330
//     },
//     {
//       "LastTradeTime": 1671183000,
//       "QuotationLot": 50,
//       "TradedQty": 1388700,
//       "OpenInterest": 11000750,
//       "Open": 18337.95,
//       "High": 18376,
//       "Low": 18313.2,
//       "Close": 18329.9
//     },
//     {
//       "LastTradeTime": 1671181200,
//       "QuotationLot": 50,
//       "TradedQty": 775550,
//       "OpenInterest": 10971300,
//       "Open": 18347,
//       "High": 18367.9,
//       "Low": 18324.05,
//       "Close": 18340
//     },
//     {
//       "LastTradeTime": 1671179400,
//       "QuotationLot": 50,
//       "TradedQty": 788950,
//       "OpenInterest": 10883700,
//       "Open": 18377,
//       "High": 18409.8,
//       "Low": 18343,
//       "Close": 18347
//     },
//     {
//       "LastTradeTime": 1671177600,
//       "QuotationLot": 50,
//       "TradedQty": 548600,
//       "OpenInterest": 10809000,
//       "Open": 18429.1,
//       "High": 18450.75,
//       "Low": 18373.4,
//       "Close": 18378
//     },
//     {
//       "LastTradeTime": 1671175800,
//       "QuotationLot": 50,
//       "TradedQty": 523400,
//       "OpenInterest": 10774100,
//       "Open": 18447,
//       "High": 18480,
//       "Low": 18424.75,
//       "Close": 18426.25
//     },
//     {
//       "LastTradeTime": 1671174000,
//       "QuotationLot": 50,
//       "TradedQty": 826700,
//       "OpenInterest": 10730450,
//       "Open": 18447.65,
//       "High": 18486.3,
//       "Low": 18423.75,
//       "Close": 18447.85
//     },
//     {
//       "LastTradeTime": 1671172200,
//       "QuotationLot": 50,
//       "TradedQty": 731050,
//       "OpenInterest": 10801650,
//       "Open": 18372.3,
//       "High": 18447.6,
//       "Low": 18359.55,
//       "Close": 18447.55
//     },
//     {
//       "LastTradeTime": 1671170400,
//       "QuotationLot": 50,
//       "TradedQty": 381950,
//       "OpenInterest": 10811200,
//       "Open": 18390.9,
//       "High": 18403,
//       "Low": 18365.75,
//       "Close": 18372.3
//     },
//     {
//       "LastTradeTime": 1671168600,
//       "QuotationLot": 50,
//       "TradedQty": 888800,
//       "OpenInterest": 10809450,
//       "Open": 18345.6,
//       "High": 18395,
//       "Low": 18327,
//       "Close": 18390.9
//     },
//     {
//       "LastTradeTime": 1671166800,
//       "QuotationLot": 50,
//       "TradedQty": 910500,
//       "OpenInterest": 10955350,
//       "Open": 18382.55,
//       "High": 18400,
//       "Low": 18332.2,
//       "Close": 18346.3
//     },
//     {
//       "LastTradeTime": 1671165000,
//       "QuotationLot": 50,
//       "TradedQty": 719900,
//       "OpenInterest": 10935800,
//       "Open": 18436.9,
//       "High": 18448,
//       "Low": 18375.7,
//       "Close": 18380
//     },
//     {
//       "LastTradeTime": 1671163200,
//       "QuotationLot": 50,
//       "TradedQty": 1091950,
//       "OpenInterest": 10908650,
//       "Open": 18451.45,
//       "High": 18488.85,
//       "Low": 18416,
//       "Close": 18436.15
//     },
//     {
//       "LastTradeTime": 1671161400,
//       "QuotationLot": 50,
//       "TradedQty": 1191550,
//       "OpenInterest": 10891400,
//       "Open": 18367,
//       "High": 18474.35,
//       "Low": 18367,
//       "Close": 18450.7
//     },
//     {
//       "LastTradeTime": 1671098400,
//       "QuotationLot": 50,
//       "TradedQty": 550,
//       "OpenInterest": 11488150,
//       "Open": 18445.5,
//       "High": 18445.5,
//       "Low": 18445.5,
//       "Close": 18445.5
//     },
//     {
//       "LastTradeTime": 1671096600,
//       "QuotationLot": 50,
//       "TradedQty": 1705200,
//       "OpenInterest": 11488150,
//       "Open": 18492.5,
//       "High": 18508.45,
//       "Low": 18437.55,
//       "Close": 18447.3
//     },
//     {
//       "LastTradeTime": 1671094800,
//       "QuotationLot": 50,
//       "TradedQty": 1620850,
//       "OpenInterest": 11296600,
//       "Open": 18552.75,
//       "High": 18552.75,
//       "Low": 18452.7,
//       "Close": 18489.6
//     },
//     {
//       "LastTradeTime": 1671093000,
//       "QuotationLot": 50,
//       "TradedQty": 447450,
//       "OpenInterest": 10976100,
//       "Open": 18564.95,
//       "High": 18587.85,
//       "Low": 18551,
//       "Close": 18551.15
//     },
//     {
//       "LastTradeTime": 1671091200,
//       "QuotationLot": 50,
//       "TradedQty": 475500,
//       "OpenInterest": 11000800,
//       "Open": 18581,
//       "High": 18592.9,
//       "Low": 18552,
//       "Close": 18563.8
//     },
//     {
//       "LastTradeTime": 1671089400,
//       "QuotationLot": 50,
//       "TradedQty": 405950,
//       "OpenInterest": 10872900,
//       "Open": 18590,
//       "High": 18605,
//       "Low": 18572.5,
//       "Close": 18579.1
//     },
//     {
//       "LastTradeTime": 1671087600,
//       "QuotationLot": 50,
//       "TradedQty": 593850,
//       "OpenInterest": 10789200,
//       "Open": 18614.95,
//       "High": 18614.95,
//       "Low": 18581,
//       "Close": 18590
//     },
//     {
//       "LastTradeTime": 1671085800,
//       "QuotationLot": 50,
//       "TradedQty": 642200,
//       "OpenInterest": 10763100,
//       "Open": 18631.4,
//       "High": 18635.3,
//       "Low": 18610,
//       "Close": 18615.25
//     },
//     {
//       "LastTradeTime": 1671084000,
//       "QuotationLot": 50,
//       "TradedQty": 448600,
//       "OpenInterest": 10575050,
//       "Open": 18648.8,
//       "High": 18658.65,
//       "Low": 18629.15,
//       "Close": 18631.8
//     },
//     {
//       "LastTradeTime": 1671082200,
//       "QuotationLot": 50,
//       "TradedQty": 239850,
//       "OpenInterest": 10460350,
//       "Open": 18646.2,
//       "High": 18656,
//       "Low": 18643.05,
//       "Close": 18648.8
//     },
//     {
//       "LastTradeTime": 1671080400,
//       "QuotationLot": 50,
//       "TradedQty": 177700,
//       "OpenInterest": 10464550,
//       "Open": 18657.05,
//       "High": 18658.8,
//       "Low": 18644.6,
//       "Close": 18646.2
//     },
//     {
//       "LastTradeTime": 1671078600,
//       "QuotationLot": 50,
//       "TradedQty": 655300,
//       "OpenInterest": 10474750,
//       "Open": 18646.5,
//       "High": 18662.4,
//       "Low": 18625,
//       "Close": 18658
//     },
//     {
//       "LastTradeTime": 1671076800,
//       "QuotationLot": 50,
//       "TradedQty": 1155750,
//       "OpenInterest": 10498200,
//       "Open": 18685.1,
//       "High": 18687.4,
//       "Low": 18640,
//       "Close": 18645.1
//     },
//     {
//       "LastTradeTime": 1671075000,
//       "QuotationLot": 50,
//       "TradedQty": 742050,
//       "OpenInterest": 10570050,
//       "Open": 18705.6,
//       "High": 18742.4,
//       "Low": 18684,
//       "Close": 18686.2
//     },
//     {
//       "LastTradeTime": 1671012000,
//       "QuotationLot": 50,
//       "TradedQty": 250,
//       "OpenInterest": 10751300,
//       "Open": 18738.4,
//       "High": 18738.4,
//       "Low": 18738.4,
//       "Close": 18738.4
//     },
//     {
//       "LastTradeTime": 1671010200,
//       "QuotationLot": 50,
//       "TradedQty": 896600,
//       "OpenInterest": 10751300,
//       "Open": 18769.85,
//       "High": 18777.75,
//       "Low": 18731.55,
//       "Close": 18738.7
//     },
//     {
//       "LastTradeTime": 1671008400,
//       "QuotationLot": 50,
//       "TradedQty": 278300,
//       "OpenInterest": 10755500,
//       "Open": 18740.05,
//       "High": 18770,
//       "Low": 18730.15,
//       "Close": 18769.85
//     },
//     {
//       "LastTradeTime": 1671006600,
//       "QuotationLot": 50,
//       "TradedQty": 352900,
//       "OpenInterest": 10746000,
//       "Open": 18736.3,
//       "High": 18754.4,
//       "Low": 18720.05,
//       "Close": 18740.05
//     },
//     {
//       "LastTradeTime": 1671004800,
//       "QuotationLot": 50,
//       "TradedQty": 497100,
//       "OpenInterest": 10781500,
//       "Open": 18766,
//       "High": 18773.5,
//       "Low": 18731.4,
//       "Close": 18738
//     },
//     {
//       "LastTradeTime": 1671003000,
//       "QuotationLot": 50,
//       "TradedQty": 269300,
//       "OpenInterest": 10868500,
//       "Open": 18765.7,
//       "High": 18775.4,
//       "Low": 18761.9,
//       "Close": 18765.05
//     },
//     {
//       "LastTradeTime": 1671001200,
//       "QuotationLot": 50,
//       "TradedQty": 248800,
//       "OpenInterest": 10935300,
//       "Open": 18781.5,
//       "High": 18783,
//       "Low": 18765.9,
//       "Close": 18765.95
//     },
//     {
//       "LastTradeTime": 1670999400,
//       "QuotationLot": 50,
//       "TradedQty": 120650,
//       "OpenInterest": 11018250,
//       "Open": 18790.75,
//       "High": 18797.7,
//       "Low": 18780.25,
//       "Close": 18781.5
//     },
//     {
//       "LastTradeTime": 1670997600,
//       "QuotationLot": 50,
//       "TradedQty": 200500,
//       "OpenInterest": 11030500,
//       "Open": 18794,
//       "High": 18799,
//       "Low": 18784.9,
//       "Close": 18790.2
//     },
//     {
//       "LastTradeTime": 1670995800,
//       "QuotationLot": 50,
//       "TradedQty": 211100,
//       "OpenInterest": 10976700,
//       "Open": 18774,
//       "High": 18797.35,
//       "Low": 18770.75,
//       "Close": 18793.2
//     },
//     {
//       "LastTradeTime": 1670994000,
//       "QuotationLot": 50,
//       "TradedQty": 168750,
//       "OpenInterest": 10964000,
//       "Open": 18775.75,
//       "High": 18784.4,
//       "Low": 18770.4,
//       "Close": 18774
//     },
//     {
//       "LastTradeTime": 1670992200,
//       "QuotationLot": 50,
//       "TradedQty": 488500,
//       "OpenInterest": 10963000,
//       "Open": 18779.25,
//       "High": 18779.25,
//       "Low": 18762.05,
//       "Close": 18775.75
//     },
//     {
//       "LastTradeTime": 1670990400,
//       "QuotationLot": 50,
//       "TradedQty": 919550,
//       "OpenInterest": 10965800,
//       "Open": 18787.25,
//       "High": 18807.55,
//       "Low": 18776.55,
//       "Close": 18779.15
//     },
//     {
//       "LastTradeTime": 1670988600,
//       "QuotationLot": 50,
//       "TradedQty": 1355750,
//       "OpenInterest": 10750000,
//       "Open": 18775.55,
//       "High": 18796,
//       "Low": 18750,
//       "Close": 18785.75
//     },
//     {
//       "LastTradeTime": 1670925600,
//       "QuotationLot": 50,
//       "TradedQty": 1200,
//       "OpenInterest": 10698700,
//       "Open": 18711.5,
//       "High": 18711.5,
//       "Low": 18711.5,
//       "Close": 18711.5
//     },
//     {
//       "LastTradeTime": 1670923800,
//       "QuotationLot": 50,
//       "TradedQty": 1171450,
//       "OpenInterest": 10698700,
//       "Open": 18689.3,
//       "High": 18717.95,
//       "Low": 18687.75,
//       "Close": 18711
//     },
//     {
//       "LastTradeTime": 1670922000,
//       "QuotationLot": 50,
//       "TradedQty": 289850,
//       "OpenInterest": 10620150,
//       "Open": 18677.85,
//       "High": 18697.55,
//       "Low": 18670.1,
//       "Close": 18689.8
//     },
//     {
//       "LastTradeTime": 1670920200,
//       "QuotationLot": 50,
//       "TradedQty": 355100,
//       "OpenInterest": 10629100,
//       "Open": 18695.1,
//       "High": 18698,
//       "Low": 18657.1,
//       "Close": 18677.9
//     },
//     {
//       "LastTradeTime": 1670918400,
//       "QuotationLot": 50,
//       "TradedQty": 243550,
//       "OpenInterest": 10629400,
//       "Open": 18700,
//       "High": 18705,
//       "Low": 18680.1,
//       "Close": 18695.1
//     },
//     {
//       "LastTradeTime": 1670916600,
//       "QuotationLot": 50,
//       "TradedQty": 315400,
//       "OpenInterest": 10619750,
//       "Open": 18693.25,
//       "High": 18714.5,
//       "Low": 18693,
//       "Close": 18700
//     },
//     {
//       "LastTradeTime": 1670914800,
//       "QuotationLot": 50,
//       "TradedQty": 406600,
//       "OpenInterest": 10616750,
//       "Open": 18676.4,
//       "High": 18700.9,
//       "Low": 18672.05,
//       "Close": 18693.25
//     },
//     {
//       "LastTradeTime": 1670913000,
//       "QuotationLot": 50,
//       "TradedQty": 353200,
//       "OpenInterest": 10636600,
//       "Open": 18682,
//       "High": 18689,
//       "Low": 18675.25,
//       "Close": 18675.65
//     },
//     {
//       "LastTradeTime": 1670911200,
//       "QuotationLot": 50,
//       "TradedQty": 525250,
//       "OpenInterest": 10668050,
//       "Open": 18672.9,
//       "High": 18690,
//       "Low": 18670,
//       "Close": 18682
//     },
//     {
//       "LastTradeTime": 1670909400,
//       "QuotationLot": 50,
//       "TradedQty": 899400,
//       "OpenInterest": 10713900,
//       "Open": 18634,
//       "High": 18680,
//       "Low": 18630.05,
//       "Close": 18672.8
//     },
//     {
//       "LastTradeTime": 1670907600,
//       "QuotationLot": 50,
//       "TradedQty": 193550,
//       "OpenInterest": 10695200,
//       "Open": 18624.4,
//       "High": 18637.65,
//       "Low": 18607,
//       "Close": 18633.95
//     },
//     {
//       "LastTradeTime": 1670905800,
//       "QuotationLot": 50,
//       "TradedQty": 244900,
//       "OpenInterest": 10704700,
//       "Open": 18593.55,
//       "High": 18624.4,
//       "Low": 18591.05,
//       "Close": 18624.4
//     },
//     {
//       "LastTradeTime": 1670904000,
//       "QuotationLot": 50,
//       "TradedQty": 648350,
//       "OpenInterest": 10706900,
//       "Open": 18629.3,
//       "High": 18637.15,
//       "Low": 18575.6,
//       "Close": 18594.8
//     },
//     {
//       "LastTradeTime": 1670902200,
//       "QuotationLot": 50,
//       "TradedQty": 597000,
//       "OpenInterest": 10702300,
//       "Open": 18630,
//       "High": 18649,
//       "Low": 18606.1,
//       "Close": 18632
//     },
//     {
//       "LastTradeTime": 1670839200,
//       "QuotationLot": 50,
//       "TradedQty": 0,
//       "OpenInterest": 11000150,
//       "Open": 18605.5,
//       "High": 18605.5,
//       "Low": 18605.5,
//       "Close": 18605.5
//     },
//     {
//       "LastTradeTime": 1670837400,
//       "QuotationLot": 50,
//       "TradedQty": 907650,
//       "OpenInterest": 11000150,
//       "Open": 18566.3,
//       "High": 18621.75,
//       "Low": 18566.3,
//       "Close": 18605.5
//     },
//     {
//       "LastTradeTime": 1670835600,
//       "QuotationLot": 50,
//       "TradedQty": 236150,
//       "OpenInterest": 10994950,
//       "Open": 18551.25,
//       "High": 18583,
//       "Low": 18542.25,
//       "Close": 18567.7
//     },
//     {
//       "LastTradeTime": 1670833800,
//       "QuotationLot": 50,
//       "TradedQty": 321500,
//       "OpenInterest": 10983000,
//       "Open": 18563.9,
//       "High": 18576,
//       "Low": 18535.55,
//       "Close": 18555
//     },
//     {
//       "LastTradeTime": 1670832000,
//       "QuotationLot": 50,
//       "TradedQty": 420200,
//       "OpenInterest": 10997250,
//       "Open": 18558.7,
//       "High": 18569.9,
//       "Low": 18545.9,
//       "Close": 18562.45
//     },
//     {
//       "LastTradeTime": 1670830200,
//       "QuotationLot": 50,
//       "TradedQty": 301250,
//       "OpenInterest": 11025400,
//       "Open": 18602.15,
//       "High": 18612.9,
//       "Low": 18557.7,
//       "Close": 18558.7
//     },
//     {
//       "LastTradeTime": 1670828400,
//       "QuotationLot": 50,
//       "TradedQty": 177950,
//       "OpenInterest": 11013200,
//       "Open": 18616,
//       "High": 18619.95,
//       "Low": 18592,
//       "Close": 18602.15
//     },
//     {
//       "LastTradeTime": 1670826600,
//       "QuotationLot": 50,
//       "TradedQty": 213000,
//       "OpenInterest": 11005150,
//       "Open": 18605.7,
//       "High": 18621,
//       "Low": 18596.05,
//       "Close": 18615.25
//     },
//     {
//       "LastTradeTime": 1670824800,
//       "QuotationLot": 50,
//       "TradedQty": 218950,
//       "OpenInterest": 11044400,
//       "Open": 18616,
//       "High": 18621.95,
//       "Low": 18590.2,
//       "Close": 18605.7
//     },
//     {
//       "LastTradeTime": 1670823000,
//       "QuotationLot": 50,
//       "TradedQty": 315600,
//       "OpenInterest": 11042600,
//       "Open": 18614.5,
//       "High": 18630.15,
//       "Low": 18600.1,
//       "Close": 18617
//     },
//     {
//       "LastTradeTime": 1670821200,
//       "QuotationLot": 50,
//       "TradedQty": 454300,
//       "OpenInterest": 11042800,
//       "Open": 18619,
//       "High": 18638.65,
//       "Low": 18609,
//       "Close": 18614.75
//     },
//     {
//       "LastTradeTime": 1670819400,
//       "QuotationLot": 50,
//       "TradedQty": 788300,
//       "OpenInterest": 11046950,
//       "Open": 18576.75,
//       "High": 18624,
//       "Low": 18574.35,
//       "Close": 18618
//     },
//     {
//       "LastTradeTime": 1670817600,
//       "QuotationLot": 50,
//       "TradedQty": 1674950,
//       "OpenInterest": 11063250,
//       "Open": 18463.1,
//       "High": 18606.65,
//       "Low": 18463.05,
//       "Close": 18575.65
//     },
//     {
//       "LastTradeTime": 1670815800,
//       "QuotationLot": 50,
//       "TradedQty": 1048200,
//       "OpenInterest": 11167850,
//       "Open": 18520,
//       "High": 18531.9,
//       "Low": 18456.15,
//       "Close": 18464.1
//     },
//     {
//       "LastTradeTime": 1670580000,
//       "QuotationLot": 50,
//       "TradedQty": 450,
//       "OpenInterest": 11624250,
//       "Open": 18571.9,
//       "High": 18571.9,
//       "Low": 18571.9,
//       "Close": 18571.9
//     },
//     {
//       "LastTradeTime": 1670578200,
//       "QuotationLot": 50,
//       "TradedQty": 1187600,
//       "OpenInterest": 11624250,
//       "Open": 18566.3,
//       "High": 18600,
//       "Low": 18565.2,
//       "Close": 18572.75
//     },
//     {
//       "LastTradeTime": 1670576400,
//       "QuotationLot": 50,
//       "TradedQty": 517850,
//       "OpenInterest": 11797750,
//       "Open": 18542,
//       "High": 18569.5,
//       "Low": 18527,
//       "Close": 18564.05
//     },
//     {
//       "LastTradeTime": 1670574600,
//       "QuotationLot": 50,
//       "TradedQty": 874100,
//       "OpenInterest": 11798450,
//       "Open": 18578.7,
//       "High": 18589.9,
//       "Low": 18515,
//       "Close": 18542
//     },
//     {
//       "LastTradeTime": 1670572800,
//       "QuotationLot": 50,
//       "TradedQty": 370700,
//       "OpenInterest": 11728150,
//       "Open": 18595.35,
//       "High": 18604,
//       "Low": 18563.15,
//       "Close": 18580.65
//     },
//     {
//       "LastTradeTime": 1670571000,
//       "QuotationLot": 50,
//       "TradedQty": 422800,
//       "OpenInterest": 11667950,
//       "Open": 18585.25,
//       "High": 18599.8,
//       "Low": 18578.5,
//       "Close": 18595.55
//     },
//     {
//       "LastTradeTime": 1670569200,
//       "QuotationLot": 50,
//       "TradedQty": 1494450,
//       "OpenInterest": 11647600,
//       "Open": 18669,
//       "High": 18672.05,
//       "Low": 18555,
//       "Close": 18587.7
//     },
//     {
//       "LastTradeTime": 1670567400,
//       "QuotationLot": 50,
//       "TradedQty": 196100,
//       "OpenInterest": 11569450,
//       "Open": 18670.7,
//       "High": 18685.75,
//       "Low": 18663.65,
//       "Close": 18669
//     },
//     {
//       "LastTradeTime": 1670565600,
//       "QuotationLot": 50,
//       "TradedQty": 209400,
//       "OpenInterest": 11536400,
//       "Open": 18668.7,
//       "High": 18682,
//       "Low": 18663,
//       "Close": 18670.15
//     },
//     {
//       "LastTradeTime": 1670563800,
//       "QuotationLot": 50,
//       "TradedQty": 521350,
//       "OpenInterest": 11467550,
//       "Open": 18671,
//       "High": 18682.55,
//       "Low": 18654,
//       "Close": 18668.7
//     },
//     {
//       "LastTradeTime": 1670562000,
//       "QuotationLot": 50,
//       "TradedQty": 632750,
//       "OpenInterest": 11345150,
//       "Open": 18688.35,
//       "High": 18689,
//       "Low": 18661.6,
//       "Close": 18671
//     },
//     {
//       "LastTradeTime": 1670560200,
//       "QuotationLot": 50,
//       "TradedQty": 622550,
//       "OpenInterest": 11200100,
//       "Open": 18739.9,
//       "High": 18747.65,
//       "Low": 18684.9,
//       "Close": 18688.45
//     },
//     {
//       "LastTradeTime": 1670558400,
//       "QuotationLot": 50,
//       "TradedQty": 532850,
//       "OpenInterest": 11067250,
//       "Open": 18745.2,
//       "High": 18753.45,
//       "Low": 18717,
//       "Close": 18739.9
//     },
//     {
//       "LastTradeTime": 1670556600,
//       "QuotationLot": 50,
//       "TradedQty": 769300,
//       "OpenInterest": 10932650,
//       "Open": 18760,
//       "High": 18776.95,
//       "Low": 18742.55,
//       "Close": 18745.8
//     },
//     {
//       "LastTradeTime": 1670493600,
//       "QuotationLot": 50,
//       "TradedQty": 350,
//       "OpenInterest": 11054150,
//       "Open": 18724.95,
//       "High": 18724.95,
//       "Low": 18724.95,
//       "Close": 18724.95
//     },
//     {
//       "LastTradeTime": 1670491800,
//       "QuotationLot": 50,
//       "TradedQty": 1247800,
//       "OpenInterest": 11054150,
//       "Open": 18700,
//       "High": 18730,
//       "Low": 18693.35,
//       "Close": 18724.15
//     },
//     {
//       "LastTradeTime": 1670490000,
//       "QuotationLot": 50,
//       "TradedQty": 260800,
//       "OpenInterest": 11138200,
//       "Open": 18706.1,
//       "High": 18714.7,
//       "Low": 18685.55,
//       "Close": 18698.95
//     },
//     {
//       "LastTradeTime": 1670488200,
//       "QuotationLot": 50,
//       "TradedQty": 376750,
//       "OpenInterest": 11132000,
//       "Open": 18695,
//       "High": 18722,
//       "Low": 18684.4,
//       "Close": 18706.95
//     },
//     {
//       "LastTradeTime": 1670486400,
//       "QuotationLot": 50,
//       "TradedQty": 266400,
//       "OpenInterest": 11103350,
//       "Open": 18691,
//       "High": 18706.95,
//       "Low": 18675,
//       "Close": 18694.85
//     },
//     {
//       "LastTradeTime": 1670484600,
//       "QuotationLot": 50,
//       "TradedQty": 189450,
//       "OpenInterest": 11129100,
//       "Open": 18675.95,
//       "High": 18697.5,
//       "Low": 18673.2,
//       "Close": 18690.85
//     },
//     {
//       "LastTradeTime": 1670482800,
//       "QuotationLot": 50,
//       "TradedQty": 273900,
//       "OpenInterest": 11127900,
//       "Open": 18682.1,
//       "High": 18684.95,
//       "Low": 18651.5,
//       "Close": 18675
//     },
//     {
//       "LastTradeTime": 1670481000,
//       "QuotationLot": 50,
//       "TradedQty": 175550,
//       "OpenInterest": 11073500,
//       "Open": 18678.3,
//       "High": 18698.6,
//       "Low": 18668.3,
//       "Close": 18682.1
//     },
//     {
//       "LastTradeTime": 1670479200,
//       "QuotationLot": 50,
//       "TradedQty": 236700,
//       "OpenInterest": 11055900,
//       "Open": 18689.9,
//       "High": 18694.75,
//       "Low": 18672,
//       "Close": 18679.5
//     },
//     {
//       "LastTradeTime": 1670477400,
//       "QuotationLot": 50,
//       "TradedQty": 222100,
//       "OpenInterest": 11032450,
//       "Open": 18685.3,
//       "High": 18697.45,
//       "Low": 18680,
//       "Close": 18689.9
//     },
//     {
//       "LastTradeTime": 1670475600,
//       "QuotationLot": 50,
//       "TradedQty": 419250,
//       "OpenInterest": 10981800,
//       "Open": 18710,
//       "High": 18715,
//       "Low": 18671.2,
//       "Close": 18685.3
//     },
//     {
//       "LastTradeTime": 1670473800,
//       "QuotationLot": 50,
//       "TradedQty": 836500,
//       "OpenInterest": 11016650,
//       "Open": 18722.05,
//       "High": 18740.9,
//       "Low": 18707.7,
//       "Close": 18710
//     },
//     {
//       "LastTradeTime": 1670472000,
//       "QuotationLot": 50,
//       "TradedQty": 828250,
//       "OpenInterest": 11094700,
//       "Open": 18672.4,
//       "High": 18724,
//       "Low": 18660.1,
//       "Close": 18723
//     },
//     {
//       "LastTradeTime": 1670470200,
//       "QuotationLot": 50,
//       "TradedQty": 574500,
//       "OpenInterest": 11168850,
//       "Open": 18675,
//       "High": 18700,
//       "Low": 18637.3,
//       "Close": 18672
//     },
//     {
//       "LastTradeTime": 1670407200,
//       "QuotationLot": 50,
//       "TradedQty": 150,
//       "OpenInterest": 11752900,
//       "Open": 18673.7,
//       "High": 18673.7,
//       "Low": 18673.7,
//       "Close": 18673.7
//     },
//     {
//       "LastTradeTime": 1670405400,
//       "QuotationLot": 50,
//       "TradedQty": 1306500,
//       "OpenInterest": 11752900,
//       "Open": 18720,
//       "High": 18720,
//       "Low": 18650.4,
//       "Close": 18673.85
//     },
//     {
//       "LastTradeTime": 1670403600,
//       "QuotationLot": 50,
//       "TradedQty": 454900,
//       "OpenInterest": 11690250,
//       "Open": 18696.8,
//       "High": 18726.85,
//       "Low": 18691.35,
//       "Close": 18718.05
//     },
//     {
//       "LastTradeTime": 1670401800,
//       "QuotationLot": 50,
//       "TradedQty": 221100,
//       "OpenInterest": 11705250,
//       "Open": 18688.5,
//       "High": 18699,
//       "Low": 18666.95,
//       "Close": 18696.65
//     },
//     {
//       "LastTradeTime": 1670400000,
//       "QuotationLot": 50,
//       "TradedQty": 284750,
//       "OpenInterest": 11680800,
//       "Open": 18700.55,
//       "High": 18711,
//       "Low": 18674.55,
//       "Close": 18688.5
//     },
//     {
//       "LastTradeTime": 1670398200,
//       "QuotationLot": 50,
//       "TradedQty": 247000,
//       "OpenInterest": 11648450,
//       "Open": 18695.1,
//       "High": 18708.9,
//       "Low": 18690,
//       "Close": 18700.55
//     },
//     {
//       "LastTradeTime": 1670396400,
//       "QuotationLot": 50,
//       "TradedQty": 260400,
//       "OpenInterest": 11602250,
//       "Open": 18686.4,
//       "High": 18700.4,
//       "Low": 18668.8,
//       "Close": 18695.1
//     },
//     {
//       "LastTradeTime": 1670394600,
//       "QuotationLot": 50,
//       "TradedQty": 226600,
//       "OpenInterest": 11536250,
//       "Open": 18689.5,
//       "High": 18705,
//       "Low": 18684.4,
//       "Close": 18686.4
//     },
//     {
//       "LastTradeTime": 1670392800,
//       "QuotationLot": 50,
//       "TradedQty": 352450,
//       "OpenInterest": 11524250,
//       "Open": 18686.95,
//       "High": 18699.9,
//       "Low": 18670.15,
//       "Close": 18689.05
//     },
//     {
//       "LastTradeTime": 1670391000,
//       "QuotationLot": 50,
//       "TradedQty": 594700,
//       "OpenInterest": 11514500,
//       "Open": 18676.4,
//       "High": 18690.85,
//       "Low": 18662.1,
//       "Close": 18686.95
//     },
//     {
//       "LastTradeTime": 1670389200,
//       "QuotationLot": 50,
//       "TradedQty": 1038850,
//       "OpenInterest": 11392650,
//       "Open": 18762,
//       "High": 18769,
//       "Low": 18663,
//       "Close": 18678.1
//     },
//     {
//       "LastTradeTime": 1670387400,
//       "QuotationLot": 50,
//       "TradedQty": 515200,
//       "OpenInterest": 11295650,
//       "Open": 18752,
//       "High": 18774.65,
//       "Low": 18740,
//       "Close": 18760
//     },
//     {
//       "LastTradeTime": 1670385600,
//       "QuotationLot": 50,
//       "TradedQty": 587150,
//       "OpenInterest": 11224450,
//       "Open": 18722,
//       "High": 18759.3,
//       "Low": 18713.35,
//       "Close": 18752
//     },
//     {
//       "LastTradeTime": 1670383800,
//       "QuotationLot": 50,
//       "TradedQty": 514850,
//       "OpenInterest": 11082300,
//       "Open": 18680.15,
//       "High": 18760,
//       "Low": 18680.15,
//       "Close": 18721.4
//     },
//     {
//       "LastTradeTime": 1670320800,
//       "QuotationLot": 50,
//       "TradedQty": 400,
//       "OpenInterest": 11630650,
//       "Open": 18770.5,
//       "High": 18770.5,
//       "Low": 18770.5,
//       "Close": 18770.5
//     },
//     {
//       "LastTradeTime": 1670319000,
//       "QuotationLot": 50,
//       "TradedQty": 1034000,
//       "OpenInterest": 11630650,
//       "Open": 18745,
//       "High": 18790,
//       "Low": 18741,
//       "Close": 18770.5
//     },
//     {
//       "LastTradeTime": 1670317200,
//       "QuotationLot": 50,
//       "TradedQty": 263350,
//       "OpenInterest": 11817150,
//       "Open": 18744.95,
//       "High": 18755.3,
//       "Low": 18738,
//       "Close": 18742.9
//     },
//     {
//       "LastTradeTime": 1670315400,
//       "QuotationLot": 50,
//       "TradedQty": 366700,
//       "OpenInterest": 11845400,
//       "Open": 18731.8,
//       "High": 18756,
//       "Low": 18716.7,
//       "Close": 18744.95
//     },
//     {
//       "LastTradeTime": 1670313600,
//       "QuotationLot": 50,
//       "TradedQty": 574500,
//       "OpenInterest": 11873950,
//       "Open": 18733.7,
//       "High": 18775,
//       "Low": 18725.85,
//       "Close": 18731
//     },
//     {
//       "LastTradeTime": 1670311800,
//       "QuotationLot": 50,
//       "TradedQty": 219150,
//       "OpenInterest": 12010550,
//       "Open": 18712,
//       "High": 18741.25,
//       "Low": 18710.5,
//       "Close": 18733.05
//     },
//     {
//       "LastTradeTime": 1670310000,
//       "QuotationLot": 50,
//       "TradedQty": 247150,
//       "OpenInterest": 12016900,
//       "Open": 18730,
//       "High": 18734.9,
//       "Low": 18705,
//       "Close": 18712
//     },
//     {
//       "LastTradeTime": 1670308200,
//       "QuotationLot": 50,
//       "TradedQty": 212450,
//       "OpenInterest": 11979350,
//       "Open": 18717.1,
//       "High": 18739.4,
//       "Low": 18712.15,
//       "Close": 18730
//     },
//     {
//       "LastTradeTime": 1670306400,
//       "QuotationLot": 50,
//       "TradedQty": 241000,
//       "OpenInterest": 11917850,
//       "Open": 18721.5,
//       "High": 18739,
//       "Low": 18708,
//       "Close": 18716.85
//     },
//     {
//       "LastTradeTime": 1670304600,
//       "QuotationLot": 50,
//       "TradedQty": 431700,
//       "OpenInterest": 11876350,
//       "Open": 18745.95,
//       "High": 18747,
//       "Low": 18712.85,
//       "Close": 18721.5
//     },
//     {
//       "LastTradeTime": 1670302800,
//       "QuotationLot": 50,
//       "TradedQty": 321000,
//       "OpenInterest": 11821050,
//       "Open": 18740.65,
//       "High": 18763.6,
//       "Low": 18736.3,
//       "Close": 18745.6
//     },
//     {
//       "LastTradeTime": 1670301000,
//       "QuotationLot": 50,
//       "TradedQty": 317700,
//       "OpenInterest": 11871150,
//       "Open": 18743.85,
//       "High": 18749.6,
//       "Low": 18722.1,
//       "Close": 18740.65
//     },
//     {
//       "LastTradeTime": 1670299200,
//       "QuotationLot": 50,
//       "TradedQty": 928650,
//       "OpenInterest": 11768800,
//       "Open": 18722.35,
//       "High": 18755.5,
//       "Low": 18695,
//       "Close": 18743.5
//     },
//     {
//       "LastTradeTime": 1670297400,
//       "QuotationLot": 50,
//       "TradedQty": 1567350,
//       "OpenInterest": 11619250,
//       "Open": 18731.3,
//       "High": 18765.15,
//       "Low": 18682.4,
//       "Close": 18724
//     },
//     {
//       "LastTradeTime": 1670234400,
//       "QuotationLot": 50,
//       "TradedQty": 50,
//       "OpenInterest": 11628200,
//       "Open": 18821.25,
//       "High": 18821.25,
//       "Low": 18821.25,
//       "Close": 18821.25
//     },
//     {
//       "LastTradeTime": 1670232600,
//       "QuotationLot": 50,
//       "TradedQty": 941200,
//       "OpenInterest": 11628200,
//       "Open": 18788.55,
//       "High": 18842.8,
//       "Low": 18781.45,
//       "Close": 18815
//     },
//     {
//       "LastTradeTime": 1670230800,
//       "QuotationLot": 50,
//       "TradedQty": 310400,
//       "OpenInterest": 11638600,
//       "Open": 18802,
//       "High": 18807.65,
//       "Low": 18763.8,
//       "Close": 18788.55
//     },
//     {
//       "LastTradeTime": 1670229000,
//       "QuotationLot": 50,
//       "TradedQty": 463900,
//       "OpenInterest": 11658150,
//       "Open": 18762.5,
//       "High": 18802.6,
//       "Low": 18741.9,
//       "Close": 18800.7
//     },
//     {
//       "LastTradeTime": 1670227200,
//       "QuotationLot": 50,
//       "TradedQty": 511850,
//       "OpenInterest": 11710800,
//       "Open": 18788.4,
//       "High": 18793.15,
//       "Low": 18756,
//       "Close": 18760.6
//     },
//     {
//       "LastTradeTime": 1670225400,
//       "QuotationLot": 50,
//       "TradedQty": 284250,
//       "OpenInterest": 11773100,
//       "Open": 18813.9,
//       "High": 18821,
//       "Low": 18784,
//       "Close": 18790.45
//     },
//     {
//       "LastTradeTime": 1670223600,
//       "QuotationLot": 50,
//       "TradedQty": 503800,
//       "OpenInterest": 11754300,
//       "Open": 18846.9,
//       "High": 18856.4,
//       "Low": 18810,
//       "Close": 18813.9
//     },
//     {
//       "LastTradeTime": 1670221800,
//       "QuotationLot": 50,
//       "TradedQty": 898300,
//       "OpenInterest": 11564800,
//       "Open": 18777.6,
//       "High": 18853.1,
//       "Low": 18774.05,
//       "Close": 18846.2
//     },
//     {
//       "LastTradeTime": 1670220000,
//       "QuotationLot": 50,
//       "TradedQty": 275250,
//       "OpenInterest": 11495150,
//       "Open": 18770.55,
//       "High": 18784,
//       "Low": 18765,
//       "Close": 18778.6
//     },
//     {
//       "LastTradeTime": 1670218200,
//       "QuotationLot": 50,
//       "TradedQty": 291050,
//       "OpenInterest": 11507550,
//       "Open": 18752,
//       "High": 18774.95,
//       "Low": 18748,
//       "Close": 18770.55
//     },
//     {
//       "LastTradeTime": 1670216400,
//       "QuotationLot": 50,
//       "TradedQty": 313250,
//       "OpenInterest": 11561050,
//       "Open": 18743,
//       "High": 18752.7,
//       "Low": 18736.4,
//       "Close": 18750.6
//     },
//     {
//       "LastTradeTime": 1670214600,
//       "QuotationLot": 50,
//       "TradedQty": 722100,
//       "OpenInterest": 11565550,
//       "Open": 18729.15,
//       "High": 18744.6,
//       "Low": 18710.45,
//       "Close": 18743.6
//     },
//     {
//       "LastTradeTime": 1670212800,
//       "QuotationLot": 50,
//       "TradedQty": 935050,
//       "OpenInterest": 11519800,
//       "Open": 18786,
//       "High": 18799.95,
//       "Low": 18726.4,
//       "Close": 18726.4
//     },
//     {
//       "LastTradeTime": 1670211000,
//       "QuotationLot": 50,
//       "TradedQty": 543750,
//       "OpenInterest": 11444700,
//       "Open": 18798.9,
//       "High": 18839.8,
//       "Low": 18785.5,
//       "Close": 18786
//     },
//     {
//       "LastTradeTime": 1669975200,
//       "QuotationLot": 50,
//       "TradedQty": 500,
//       "OpenInterest": 11857450,
//       "Open": 18815,
//       "High": 18815,
//       "Low": 18815,
//       "Close": 18815
//     },
//     {
//       "LastTradeTime": 1669973400,
//       "QuotationLot": 50,
//       "TradedQty": 952750,
//       "OpenInterest": 11857450,
//       "Open": 18814.5,
//       "High": 18825,
//       "Low": 18790.55,
//       "Close": 18817.4
//     },
//     {
//       "LastTradeTime": 1669971600,
//       "QuotationLot": 50,
//       "TradedQty": 529900,
//       "OpenInterest": 11865600,
//       "Open": 18826.15,
//       "High": 18829,
//       "Low": 18792.05,
//       "Close": 18814.65
//     },
//     {
//       "LastTradeTime": 1669969800,
//       "QuotationLot": 50,
//       "TradedQty": 403350,
//       "OpenInterest": 11777250,
//       "Open": 18813.2,
//       "High": 18829.3,
//       "Low": 18794.8,
//       "Close": 18825.9
//     },
//     {
//       "LastTradeTime": 1669968000,
//       "QuotationLot": 50,
//       "TradedQty": 446050,
//       "OpenInterest": 11768100,
//       "Open": 18773.7,
//       "High": 18826.75,
//       "Low": 18768.15,
//       "Close": 18810
//     },
//     {
//       "LastTradeTime": 1669966200,
//       "QuotationLot": 50,
//       "TradedQty": 445700,
//       "OpenInterest": 12264900,
//       "Open": 18795.65,
//       "High": 18804,
//       "Low": 18772.9,
//       "Close": 18773.7
//     },
//     {
//       "LastTradeTime": 1669964400,
//       "QuotationLot": 50,
//       "TradedQty": 367150,
//       "OpenInterest": 12249850,
//       "Open": 18773.45,
//       "High": 18796.95,
//       "Low": 18770,
//       "Close": 18795.65
//     },
//     {
//       "LastTradeTime": 1669962600,
//       "QuotationLot": 50,
//       "TradedQty": 402950,
//       "OpenInterest": 12216650,
//       "Open": 18771.75,
//       "High": 18781.6,
//       "Low": 18760.65,
//       "Close": 18773.35
//     },
//     {
//       "LastTradeTime": 1669960800,
//       "QuotationLot": 50,
//       "TradedQty": 989250,
//       "OpenInterest": 12231850,
//       "Open": 18809.5,
//       "High": 18809.5,
//       "Low": 18760.05,
//       "Close": 18771
//     },
//     {
//       "LastTradeTime": 1669959000,
//       "QuotationLot": 50,
//       "TradedQty": 493000,
//       "OpenInterest": 12161350,
//       "Open": 18828,
//       "High": 18841.4,
//       "Low": 18803,
//       "Close": 18809.05
//     },
//     {
//       "LastTradeTime": 1669957200,
//       "QuotationLot": 50,
//       "TradedQty": 375550,
//       "OpenInterest": 12113800,
//       "Open": 18826.5,
//       "High": 18836.75,
//       "Low": 18817.8,
//       "Close": 18826.45
//     },
//     {
//       "LastTradeTime": 1669955400,
//       "QuotationLot": 50,
//       "TradedQty": 604950,
//       "OpenInterest": 12075650,
//       "Open": 18845.55,
//       "High": 18856.55,
//       "Low": 18813.65,
//       "Close": 18825.65
//     },
//     {
//       "LastTradeTime": 1669953600,
//       "QuotationLot": 50,
//       "TradedQty": 1086900,
//       "OpenInterest": 12085050,
//       "Open": 18862,
//       "High": 18879.75,
//       "Low": 18833.55,
//       "Close": 18848
//     },
//     {
//       "LastTradeTime": 1669951800,
//       "QuotationLot": 50,
//       "TradedQty": 1017900,
//       "OpenInterest": 12295250,
//       "Open": 18948.95,
//       "High": 18948.95,
//       "Low": 18859.7,
//       "Close": 18863
//     }
//   ]

//   const placeHolderData = [
//     {
//       time: "2018-12-19",
//       open: 141.77,
//       high: 170.39,
//       low: 120.25,
//       close: 145.72
//     },
//     {
//       time: "2018-12-20",
//       open: 145.72,
//       high: 147.99,
//       low: 100.11,
//       close: 108.19
//     }
//     // Replace with your data
//   ];

//   const convertedData = response.map((item) => {
//     const date = new Date(item.LastTradeTime * 1000);
//     const year = date.getFullYear();
//     let month = date.getMonth() + 1;
//     let day = date.getDate();
//     let hours = date.getHours();
//     let minutes = date.getMinutes();

//     // Format the hours and minutes parts to two digits
//     hours = hours < 10 ? "0" + hours : hours;
//     minutes = minutes < 10 ? "0" + minutes : minutes;

//     // Format the date parts to two digits
//     month = month < 10 ? "0" + month : month;
//     day = day < 10 ? "0" + day : day;

//     return {
//       time: item.LastTradeTime + 19800,
//       open: item.Open,
//       high: item.High,
//       low: item.Low,
//       close: item.Close
//     };
//   });

//   console.log(convertedData.reverse());

//   useEffect(() => {
//     const chart = createChart(chartContainerRef.current, {
//       width: 500,
//       height: 300
//     });
//     const candlestickSeries = chart.addCandlestickSeries();

//     candlestickSeries.setData(convertedData);
//     const timeScale = chart.timeScale();
//     timeScale.applyOptions({
//       crosshair: {
//         vertLine: {
//           labelVisible: true,
//           labelBackgroundColor: "#4C525E"
//         }
//       },
//       timeVisible: true
//     });

//     // Format the crosshair's time label to include both date and time

//     return () => {
//       chart.remove();
//     };
//   }, []);

//   return <div ref={chartContainerRef} />;
// };

// export default CandlestickChart;
// import { useEffect, useRef } from 'react';
// import { createChart } from 'lightweight-charts';

// const CandlestickChart = ({ historicalData, liveData }) => {
//   const chartContainerRef = useRef();

//   useEffect(() => {
//     if (!chartContainerRef.current) return;

//     const chart = createChart(chartContainerRef.current, { width: 500, height: 300 });
//     const candleSeries = chart.addCandlestickSeries();
  
//     // Set initial data
//     candleSeries.setData(historicalData);
//     const timeScale = chart.timeScale();
//     timeScale.applyOptions({
//       crosshair: {
//         vertLine: {
//           labelVisible: true,
//           labelBackgroundColor: "#4C525E"
//         }
//       },
//       timeVisible: true
//     });

//     return () => {
//       // Cleanup chart on component unmount
//       chart.remove();
//     };
//   }, [historicalData]);

//   useEffect(() => {
//     if (!chartContainerRef.current || !liveData) return;
  
//     const chart = createChart(chartContainerRef.current);
//     const candleSeries = chart.addCandlestickSeries();
  
//     // Update chart with live data
//     liveData.forEach(data => {
//       if (data.instrument_token === 256265) {
//         const ohlcData = {
//           time: Math.floor(Date.now() / 1000),
//           open: data.ohlc.open,
//           high: data.ohlc.high,
//           low: data.ohlc.low,
//           close: data.ohlc.close,
//         };
  
//         // Update the chart with the new data
//         candleSeries.update(ohlcData);
//       }
//     });
//     const timeScale = chart.timeScale();
//     timeScale.applyOptions({
//       crosshair: {
//         vertLine: {
//           labelVisible: true,
//           labelBackgroundColor: "#4C525E"
//         }
//       },
//       timeVisible: true
//     });
//   }, [liveData]);

//   return <div ref={chartContainerRef} />;
// };

// export default CandlestickChart;
// import { useEffect, useRef } from 'react';
// import { createChart } from 'lightweight-charts';

// const CandlestickChart = ({ historicalData, liveData }) => {
//   const chartContainerRef = useRef();
//   const chartRef = useRef();
//   const candleSeriesRef = useRef();

//   useEffect(() => {
//     if (!chartContainerRef.current) return;

//     chartRef.current = createChart(chartContainerRef.current, { width: 1300, height: 620 });
//     candleSeriesRef.current = chartRef.current.addCandlestickSeries();
  
//     // Set initial data
//     candleSeriesRef.current.setData(historicalData);
//     const timeScale = chartRef.current.timeScale();
//         timeScale.applyOptions({
//           crosshair: {
//             vertLine: {
//               labelVisible: true,
//               labelBackgroundColor: "#4C525E"
//             }
//           },
//           timeVisible: true
//         });


//     return () => {
//       // Cleanup chart on component unmount
//       chartRef.current.remove();
//     };
//   }, []);

//   useEffect(() => {
//     if (!candleSeriesRef.current || !historicalData) return;
  
//     // Update chart with historical data
//     candleSeriesRef.current.setData(historicalData);
//   }, [historicalData]);

//   useEffect(() => {
//     if (!candleSeriesRef.current || !liveData) return;
  
//     // Update chart with live data
// //     liveData.forEach(data => {
// //       if (data.instrument_token === 256265) {
// //         const ohlcData = {
// //           time: Math.floor(Date.now() / 1000),
// //           open: data.ohlc.open,
// //           high: data.ohlc.high,
// //           low: data.ohlc.low,
// //           close: data.ohlc.close,
// //         };
  
// //         // Update the chart with the new data
// //     }
// // });
//     candleSeriesRef.current.update(liveData);
//   }, [liveData]);

//   return <div style={{padding:'20px', display:'flex',margin:'auto 0', justifyContent:'center'}} ref={chartContainerRef} />;
// };

// export default CandlestickChart;
import { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';

const CandlestickChart = ({ historicalData, liveData, minuteTimeframe }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const candleSeriesRef = useRef();
//   console.log('rendering chart');
//   console.log('historicalData', historicalData?.[0]?.time);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, { width: 1350, height: 550 });
    candleSeriesRef.current = chartRef.current.addCandlestickSeries();
  
    // Set initial data
    if (historicalData) {
      candleSeriesRef.current.setData(historicalData);
    }
    const timeScale = chartRef.current.timeScale();
    timeScale.applyOptions({
      crosshair: {
        vertLine: {
          labelVisible: true,
          labelBackgroundColor: "#4C525E"
        }
      },
      timeVisible: true
    });

    return () => {
      // Cleanup chart on component unmount
      chartRef.current.remove();
    };
  }, []);

  useEffect(() => {
    if (!candleSeriesRef.current || !historicalData) return;
  
    // Update chart with historical data
    candleSeriesRef.current.setData(historicalData);
  }, [historicalData]);

  useEffect(() => {
    if (!candleSeriesRef.current || !liveData || !historicalData) return;

    // Merge live data with the last historical data
    const lastCandle = historicalData[historicalData.length -1];
    const newCandle = liveData;
    console.log('newCandle',newCandle);
    console.log('firstCandle', historicalData[0])
    console.log('lastCandle',typeof lastCandle?.time, lastCandle?.time, minuteTimeframe);

    if (newCandle) {
      const updatedLastCandle = {
        ...lastCandle,
        time: lastCandle?.time + minuteTimeframe*60,
        close: newCandle?.close,
        high: Math.max(lastCandle?.high, newCandle?.high),
        low: Math.min(lastCandle?.low, newCandle?.low),
      };
      console.log('updatedLastCandle',updatedLastCandle);
      // Create a new data array with the updated last candle
      const newData = [
          ...historicalData.slice(0,historicalData.length-1),
          updatedLastCandle,    
        ];
      console.log('newData',newData);
      console.log('historicalData', historicalData);  

      // Update chart with the merged data
      candleSeriesRef.current.setData(newData);
    }
  }, [liveData]);

  return <div style={{display:'flex',margin:'auto 0', justifyContent:'center', border:'1px solid black'}} ref={chartContainerRef} />;
};

export default CandlestickChart;

