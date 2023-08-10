import React from "react";
// import axios from "axios";
import {  useState } from "react";
// import { userContext } from '../../../AuthContext';
// import moment from 'moment';
//

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
// import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import {CircularProgress} from "@mui/material";
import { Grid } from "@mui/material";


export default function TableView({whichTab, dateWiseData, cumulativeData}) {

  const [isLoading,setIsLoading] = useState(false);
  // let tradermatrix = [];
  // let createdBy = '';
  let pnlmatrixArr = []
  if(whichTab === "Trader Metrics"){

    //console.log(traderpnldata);

    //New code for hash map of traders

    let hash = new Map();

  for (let i = dateWiseData.length - 1; i >= 0; i--) {
    if (hash.has(dateWiseData[i]?._id?.createdBy)) {
      let obj = hash.get(dateWiseData[i]?._id?.createdBy);
      if (dateWiseData[i]?.gpnl >= 0) {
        obj.PositivePnl += dateWiseData[i]?.gpnl
      }
      else {
        obj.NegativePnl += dateWiseData[i]?.gpnl
      }
      if (dateWiseData[i]?.gpnl >= 0) {
        obj.GreenDays += 1
      }
      else {
        obj.RedDays += 1
      }
      obj.TradingDays += 1
      obj.Brokerage += dateWiseData[i]?.brokerage
      obj.LifetimeGPnl += dateWiseData[i]?.gpnl
      obj.LifetimeNPnl += Number(dateWiseData[i]?.npnl)
      //console.log("LTNPNL: "+obj.LifetimeNPnl,dateWiseData[i]?.npnl);
    } else {
      hash.set(dateWiseData[i]?._id?.createdBy, {
        createdBy: dateWiseData[i]?._id?.createdBy,
        PositivePnl: dateWiseData[i]?.gpnl >= 0 ? dateWiseData[i]?.gpnl : 0,
        NegativePnl: dateWiseData[i]?.gpnl >= 0 ? 0 : dateWiseData[i]?.gpnl,
        GreenDays: dateWiseData[i]?.gpnl >= 0 ? 1 : 0,
        RedDays: dateWiseData[i]?.gpnl >= 0 ? 0 : 1,
        Brokerage: dateWiseData[i]?.brokerage,
        TradingDays: 1,
        LifetimeGPnl: dateWiseData[i]?.gpnl,
        LifetimeNPnl: dateWiseData[i]?.npnl
      })
    }
  }

    //console.log(hash)
    
    // let pnlmatrixArr = []
    for (let value of hash.values()) {
      pnlmatrixArr.push(value);
    }
  }

  return (

    <MDBox bgColor="dark" color="light" mb={0} borderRadius={10} minWidth='100%' minHeight='auto'>
      {whichTab === "Company Daily P&L" ?
        <Grid container spacing={1}>
          <Grid container p={1} style={{ border: '1px solid white', borderRadius: 5 }}>
            <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={9} fontWeight="bold">DATE</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={1.2}>
              <MDTypography color="light" fontSize={9} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">WEEKDAY</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={9} fontWeight="bold">G. P&L</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={9} fontWeight="bold">TXN COST</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={9} fontWeight="bold">N. P&L</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={9} fontWeight="bold"># OF TRADES</MDTypography>
            </Grid>

            <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={9} fontWeight="bold">CUMM. G. P&L</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={9} fontWeight="bold">CUMM. TXN COST</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={9} fontWeight="bold">CUMM. N. P&L</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={9} fontWeight="bold">TOTAL TRADES</MDTypography>
            </Grid>
          </Grid>


          {!isLoading ?
            dateWiseData?.map((elem) => {

              let cummData = cumulativeData?.filter((subelem) => {
                return elem?.date === subelem?._id?.date;
              })
              console.log("cummData", cummData)
              const gpnlcolor = (elem?.gpnl) >= 0 ? "success" : "error"
              const npnlcolor = (elem?.npnl) >= 0 ? "success" : "error"
              const cummgpnlcolor = (cummData[0]?.totalGpnl) >= 0 ? "success" : "error"
              const cummnpnlcolor = (cummData[0]?.totalNpnl) >= 0 ? "success" : "error"

              const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][elem?.dayOfWeek - 1];

              return (
                <Grid container mt={1} p={1} style={{ border: '1px solid white', borderRadius: 5 }}>
                  <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={10} fontWeight="bold">{elem?.date}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={1.2}>
                    <MDTypography color="light" fontSize={10} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">{weekday}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color={gpnlcolor} fontSize={10} fontWeight="bold">{ (elem?.gpnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.gpnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-elem?.gpnl))}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={10} fontWeight="bold">₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(elem?.brokerage))}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color={npnlcolor} fontSize={10} fontWeight="bold">{ (elem?.npnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.npnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-elem?.npnl))}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color={"light"} fontSize={10} fontWeight="bold">{elem?.noOfTrade}</MDTypography>
                  </Grid>

                  <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color={cummgpnlcolor} fontSize={10} fontWeight="bold">{ cummData[0]?.totalGpnl ? (cummData[0]?.totalGpnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(cummData[0]?.totalGpnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-cummData[0]?.totalGpnl)) : "+₹0"}</MDTypography>
                    {/* <MDTypography color={gpnlcolor} fontSize={10} fontWeight="bold">₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(cummData[0]?.gpnl))}</MDTypography> */}
                  </Grid>
                  <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={10} fontWeight="bold">₹{cummData[0]?.totalBrokerage ? new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(cummData[0]?.totalBrokerage)) : "0"}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color={cummnpnlcolor} fontSize={10} fontWeight="bold">{ cummData[0]?.totalNpnl ? ((cummData[0]?.totalNpnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(cummData[0]?.totalNpnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-cummData[0]?.totalNpnl))) : "+₹0"}</MDTypography>

                    {/* <MDTypography color={npnlcolor} fontSize={10} fontWeight="bold">₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(cummData[0]?.npnl))}</MDTypography> */}
                  </Grid>
                  <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color={"light"} fontSize={10} fontWeight="bold">{cummData[0]?.totalTrade ? cummData[0]?.totalTrade : 0}</MDTypography>
                  </Grid>


                  {/* <Grid item xs={12} md={2} lg={1.09} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color={cummgpnlcolor} fontSize={8} fontWeight="bold">{ cummData[0]?.gpnl ? (cummData[0]?.gpnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(cummData[0]?.gpnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-cummData[0]?.gpnl)) : "+₹0"}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={1.09} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color="light" fontSize={8} fontWeight="bold">₹{cummData[0]?.brokerage ? new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(cummData[0]?.brokerage)) : "0"}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={1.09} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color={cummnpnlcolor} fontSize={8} fontWeight="bold">{ cummData[0]?.npnl ? (cummData[0]?.npnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(cummData[0]?.npnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-cummData[0]?.npnl)) : "+₹0"}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={1.09} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color={"light"} fontSize={8} fontWeight="bold">{cummData[0]?.noOfTrade ? cummData[0]?.noOfTrade : 0}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={1.36}>
                      <MDTypography color="light" fontSize={8} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">{cummData[0]?.tradingDays ? cummData[0]?.tradingDays : 0}</MDTypography>
                    </Grid> */}

                </Grid>


              )
            })
            :
            <Grid container display="flex" justifyContent="center" alignContent='center' alignItems="center">
              <Grid item display="flex" justifyContent="center" alignContent='center' alignItems="center" lg={12}>
                <MDBox mt={5} mb={5}>
                  <CircularProgress color="info" />
                </MDBox>
              </Grid>
            </Grid>
          }

        </Grid>
        :
        whichTab === "Trader Metrics" ?
          <Grid container spacing={1}>
            <Grid container p={1} style={{ border: '1px solid white', borderRadius: 5 }}>
              <Grid item xs={12} md={2} lg={.857} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={7} fontWeight="bold">TRADER NAME</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={.857} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={7} fontWeight="bold">G. P&L</MDTypography>
              </Grid>
              {/* <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={7} fontWeight="bold"></MDTypography>
              </Grid> */}
              <Grid item xs={12} md={2} lg={.857} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={7} fontWeight="bold">N. P&L</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={.857} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={7} fontWeight="bold">CUMM. G-P&L(+ DAYS)</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={.857}>
                <MDTypography color="light" fontSize={7} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">CUMM. G-P&L(- DAYS)</MDTypography>
              </Grid>

              <Grid item xs={12} md={2} lg={.857} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={7} fontWeight="bold">RATIO (RED/GREEN DAYS G-P&L)</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={.857} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={7} fontWeight="bold">PROBABLE AVG. G-P&L</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={.857} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={7} fontWeight="bold"># TRADING DAYS</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={.857} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={7} fontWeight="bold">% RED DAYS</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={.857}>
                <MDTypography color="light" fontSize={7} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">% GREEN DAYS</MDTypography>
              </Grid>

              <Grid item xs={12} md={2} lg={.857} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={7} fontWeight="bold"># RED DAYS</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={.857}>
                <MDTypography color="light" fontSize={7} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center"># GREEN DAYS</MDTypography>
              </Grid>

              <Grid item xs={12} md={2} lg={.857} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={7} fontWeight="bold">AVG. GREEN DAYS G-P&L</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={.857} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={7} fontWeight="bold">AVG. RED DAYS G-P&L</MDTypography>
              </Grid>
            </Grid>


            {!isLoading ?
              pnlmatrixArr?.map((elem) => {
                let ratio = 0;
                let averagereddaysgpnl = elem.RedDays != 0 ? elem.NegativePnl/elem.RedDays : 0
                let averagegreendaysgpnl = elem.GreenDays != 0 ? elem.PositivePnl/elem.GreenDays : 0
                // const averagereddaysgpnlcolor = averagereddaysgpnl >= 0 ? "success" : "error"
                // const averagegreendaysgpnlcolor = averagegreendaysgpnl >= 0 ? "success" : "error"
                const probableavgpnl = ((elem.RedDays/elem.TradingDays)*averagereddaysgpnl + (elem.GreenDays/elem.TradingDays)*averagegreendaysgpnl)
                // const probableavgpnlcolor = probableavgpnl >= 0 ? "success" : "error"
            
                if(elem.GreenDays == 0){
                  ratio = 0;
                }
                else{
                  ratio = Math.abs(elem.NegativePnl/elem.PositivePnl);
                }
                const gpnlcolor = (elem?.gpnl) >= 0 ? "success" : "error"
                const npnlcolor = (elem?.npnl) >= 0 ? "success" : "error"
                // const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][elem?.dayOfWeek-1];
                console.log("elem?.createdBy", elem?.createdBy)
                return (


                  <Grid container mt={1} p={1} style={{ border: '1px solid white', borderRadius: 5 }}>
                    <Grid item xs={12} md={2} lg={.857} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color="light" fontSize={8} fontWeight="bold">{elem?.createdBy}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={.857} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color={gpnlcolor} fontSize={8} fontWeight="bold">{ (elem?.LifetimeGPnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.LifetimeGPnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-elem?.LifetimeGPnl))}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={.857} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color="light" fontSize={8} fontWeight="bold">{ (elem?.LifetimeNPnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.LifetimeNPnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-elem?.LifetimeNPnl))}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={.857} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color={npnlcolor} fontSize={8} fontWeight="bold">{ (elem?.PositivePnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.PositivePnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-elem?.PositivePnl))}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={.857} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color={"light"} fontSize={8} fontWeight="bold"> { (elem?.NegativePnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.NegativePnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-elem?.NegativePnl))}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={.857}>
                      <MDTypography color="light" fontSize={8} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(ratio))}</MDTypography>
                    </Grid>

                    <Grid item xs={12} md={2} lg={.857} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color={gpnlcolor} fontSize={8} fontWeight="bold">{ (probableavgpnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(probableavgpnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-probableavgpnl))}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={.857} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color="light" fontSize={8} fontWeight="bold">₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(elem?.TradingDays))}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={.857} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color={npnlcolor} fontSize={8} fontWeight="bold">₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(((elem.RedDays/elem.TradingDays)*100)))}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={.857} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color={"light"} fontSize={8} fontWeight="bold"> {((elem.GreenDays/elem.TradingDays)*100).toFixed(0)}%</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={.857}>
                      <MDTypography color="light" fontSize={8} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem.RedDays}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={.857} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color={"light"} fontSize={8} fontWeight="bold"> {elem?.GreenDays}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={.857}>
                      <MDTypography color="light" fontSize={8} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(averagegreendaysgpnl))}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={.857}>
                      <MDTypography color="light" fontSize={8} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(averagereddaysgpnl))}</MDTypography>
                    </Grid>
                  </Grid>


                )
              })
              :
              <Grid container display="flex" justifyContent="center" alignContent='center' alignItems="center">
                <Grid item display="flex" justifyContent="center" alignContent='center' alignItems="center" lg={12}>
                  <MDBox mt={5} mb={5}>
                    <CircularProgress color="info" />
                  </MDBox>
                </Grid>
              </Grid>
            }

          </Grid>
          :
          <Grid container spacing={1}>
            <Grid container p={1} style={{ border: '1px solid white', borderRadius: 5 }}>
              <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={8} fontWeight="bold">TRADER NAME</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={1.09} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={8} fontWeight="bold">G. P&L</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={8} fontWeight="bold">TXN COST</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={1.09} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={8} fontWeight="bold">N. P&L</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={8} fontWeight="bold"># OF TRADES</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={1.09}>
                <MDTypography color="light" fontSize={8} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">TRADING DAYS</MDTypography>
              </Grid>

              <Grid item xs={12} md={2} lg={1.09} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={8} fontWeight="bold">CUMM. G. P&L</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={1.09} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={8} fontWeight="bold">CUMM. TXN COST</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={1.09} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={8} fontWeight="bold">CUMM. N. P&L</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={1.09} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={8} fontWeight="bold">TOTAL TRADES</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={1.36}>
                <MDTypography color="light" fontSize={8} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">CUMM. TRADE DAYS</MDTypography>
              </Grid>
            </Grid>


            {!isLoading ?
              dateWiseData?.map((elem) => {

                let cummData = cumulativeData?.filter((subelem) => {
                  return elem?.userId === subelem?.userId;
                })

                const cummgpnlcolor = (cummData[0]?.gpnl) >= 0 ? "success" : "error"
                const cummnpnlcolor = (cummData[0]?.npnl) >= 0 ? "success" : "error"  
                const gpnlcolor = (elem?.gpnl) >= 0 ? "success" : "error"
                const npnlcolor = (elem?.npnl) >= 0 ? "success" : "error"
                // const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][elem?.dayOfWeek-1];

                return (


                  <Grid container mt={1} p={1} style={{ border: '1px solid white', borderRadius: 5 }}>
                    <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color="light" fontSize={8} fontWeight="bold">{elem?.name?.length > 14 ? (elem?.name)?.slice(0, 14) + "..." : elem?.name}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={1.09} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color={gpnlcolor} fontSize={8} fontWeight="bold">{ (elem?.gpnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.gpnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-elem?.gpnl))}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color="light" fontSize={8} fontWeight="bold">₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(elem?.brokerage))}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={1.09} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color={npnlcolor} fontSize={8} fontWeight="bold">{ (elem?.npnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.npnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-elem?.npnl))}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color={"light"} fontSize={8} fontWeight="bold">{elem?.noOfTrade}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={1.09}>
                      <MDTypography color="light" fontSize={8} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem?.tradingDays}</MDTypography>
                    </Grid>

                    <Grid item xs={12} md={2} lg={1.09} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color={cummgpnlcolor} fontSize={8} fontWeight="bold">{ cummData[0]?.gpnl ? (cummData[0]?.gpnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(cummData[0]?.gpnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-cummData[0]?.gpnl)) : "+₹0"}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={1.09} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color="light" fontSize={8} fontWeight="bold">₹{cummData[0]?.brokerage ? new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(cummData[0]?.brokerage)) : "0"}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={1.09} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color={cummnpnlcolor} fontSize={8} fontWeight="bold">{ cummData[0]?.npnl ? (cummData[0]?.npnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(cummData[0]?.npnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-cummData[0]?.npnl)) : "+₹0"}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={1.09} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color={"light"} fontSize={8} fontWeight="bold">{cummData[0]?.noOfTrade ? cummData[0]?.noOfTrade : 0}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={1.36}>
                      <MDTypography color="light" fontSize={8} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">{cummData[0]?.tradingDays ? cummData[0]?.tradingDays : 0}</MDTypography>
                    </Grid>
                  </Grid>


                )
              })
              :
              <Grid container display="flex" justifyContent="center" alignContent='center' alignItems="center">
                <Grid item display="flex" justifyContent="center" alignContent='center' alignItems="center" lg={12}>
                  <MDBox mt={5} mb={5}>
                    <CircularProgress color="info" />
                  </MDBox>
                </Grid>
              </Grid>
            }
            {/* {!isLoading && count !== 0 &&
          <MDBox mt={1} display="flex" justifyContent="space-between" alignItems='center' width='100%'>
            <MDButton variant='outlined' color='warning' disabled={(skip+limitSetting)/limitSetting === 1 ? true : false} size="small" onClick={backHandler}>Back</MDButton>
            <MDTypography color="light" fontSize={15} fontWeight='bold'>Total Order: {!count ? 0 : count} | Page {(skip+limitSetting)/limitSetting} of {!count ? 1 : Math.ceil(count/limitSetting)}</MDTypography>
            <MDButton variant='outlined' color='warning' disabled={Math.ceil(count/limitSetting) === (skip+limitSetting)/limitSetting ? true : !count ? true : false} size="small" onClick={nextHandler}>Next</MDButton>
          </MDBox>
          } */}

          </Grid>
      }
    </MDBox>

  );
}
