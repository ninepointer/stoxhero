import React from "react";
// import axios from "axios";
import { useState } from "react";
// import { userContext } from '../../../AuthContext';
// import moment from 'moment';
//

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
// import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import {CircularProgress, Tooltip} from "@mui/material";
import { Grid } from "@mui/material";
import ScreenshotMonitorIcon from '@mui/icons-material/ScreenshotMonitor';
import html2canvas from 'html2canvas';
import MDButton from "../../../components/MDButton";
import DownloadIcon from '@mui/icons-material/Download';
import { saveAs } from 'file-saver';


export default function TableView({ dateWiseData}) {
  const [isLoading,setIsLoading] = useState(false);
  const [showDownloadButton, setShowDownloadButton] = useState(true);

  const captureScreenshot = (id, name) => {
    const screenshotElement = document.getElementById(id);
    setTimeout(() => {
      setShowDownloadButton(false)
      html2canvas(screenshotElement)
        .then((canvas) => {
          const link = document.createElement('a');
          link.download = `${name}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
          setShowDownloadButton(true)
        })
        .catch((error) => {
          console.error('Error capturing screenshot:', error);
          setShowDownloadButton(true)
        });
    }, 500)

  };

  const handleDownload = (csvData, nameVariable) => {
    // Create the CSV content
    // const csvContent = csvData.map(row => row.join(',')).join('\n');
    const csvContent = csvData?.map((row) => {
      return row?.map((row1) => row1.join(',')).join('\n');
    });
    // const csvContent = 'Date,Weekday,Gross P&L(S) Gross P&L(I) Net P&L(S) Net P&L(I) Net P&L Diff(S-I)\nValue 1,Value 2,Value 3\nValue 4, Value 5, Value 6';

    // Create a Blob object with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });

    // Save the file using FileSaver.js
    saveAs(blob, `${nameVariable}.csv`);
  }

  function downloadHelper(dateWiseData) {
    let csvDataFile = [[]]
    let csvDataDailyPnl = [["RANK", "TRADER NAME", "GROSS P&L", "TRANSACTION COST", "NET P&L", "# OF TRADES", "PAYOUT"]]
    if (dateWiseData) {
      // dates = Object.keys(data)
      let csvpnlData = Object.values(dateWiseData)
      csvDataFile = csvpnlData?.map((elem) => {

        return [elem?.rank,
        elem?.name,
        elem?.gpnl,
        elem?.brokerage,
        elem?.npnl,
        elem?.noOfTrade,
        elem?.payout]
      })
    }

    return [[...csvDataDailyPnl, ...csvDataFile]]
  }

  const pnlData = downloadHelper(dateWiseData)

  return (

    <MDBox id='screenshot-component2' bgColor="dark" color="light" mb={0} borderRadius={10} minWidth='100%' minHeight='auto'>
      <Grid container spacing={1}>


        <Grid container p={0.5} mb={1} style={{backgroundColor:'white' ,border: '1px solid white', borderRadius: 5 }}>
            <Grid item xs={12} md={2} lg={11} pl={1} display="flex" justifyContent="flex-start" alignContent="center" alignItems="center">
              <MDTypography color="dark" fontSize={12} fontWeight="bold">Trader Wise - P&L</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={0.5} display="flex" justifyContent="flex-end" alignContent="center" alignItems="center">
              <Tooltip title="Download CSV"><MDButton variant='contained' onClick={()=>{handleDownload(pnlData, "Trader-Wise-Battle")}}><DownloadIcon/></MDButton></Tooltip>
            </Grid>
            <Grid item xs={12} md={2} lg={0.5} display="flex" justifyContent="flex-end" alignContent="center" alignItems="center">
              <Tooltip title="Screenshot"><MDButton variant='contained' onClick={()=>{captureScreenshot('screenshot-component2', "Battle-Pnl")}}><ScreenshotMonitorIcon/></MDButton></Tooltip>
            </Grid>
        </Grid>

        <Grid container p={1} style={{ border: '1px solid white', borderRadius: 5 }}>

          <Grid item xs={12} md={2} lg={1.71} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={9} fontWeight="bold">RANK</MDTypography>
          </Grid>

          <Grid item xs={12} md={2} lg={1.71} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={9} fontWeight="bold">TRADER NAME</MDTypography>
          </Grid>

          <Grid item xs={12} md={2} lg={1.71} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={9} fontWeight="bold">GROSS P&L</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={1.71} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={9} fontWeight="bold">TRANSACTION COST</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={1.71} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={9} fontWeight="bold">NET P&L</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={1.71} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={9} fontWeight="bold"># OF TRADES</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={1.71}>
            <MDTypography color="light" fontSize={9} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">PAYOUT</MDTypography>
          </Grid>
        </Grid>


        {!isLoading ?
          dateWiseData?.map((elem) => {

            const gpnlcolor = (elem?.gpnl) >= 0 ? "success" : "error"
            const npnlcolor = (elem?.npnl) >= 0 ? "success" : "error"

            return (


              <Grid container mt={1} p={1} style={{ border: '1px solid white', borderRadius: 5 }}>

                <Grid item xs={12} md={2} lg={1.71} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color="light" fontSize={10} fontWeight="bold">{elem?.rank}</MDTypography>
                </Grid>

                <Grid item xs={12} md={2} lg={1.71} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color="light" fontSize={10} fontWeight="bold">{elem?.name}</MDTypography>
                </Grid>

                <Grid item xs={12} md={2} lg={1.71} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color={gpnlcolor} fontSize={10} fontWeight="bold">{(elem?.gpnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.gpnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-elem?.gpnl))}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={1.71} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color="light" fontSize={10} fontWeight="bold">₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(elem?.brokerage))}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={1.71} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color={npnlcolor} fontSize={10} fontWeight="bold">{(elem?.npnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.npnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-elem?.npnl))}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={1.71} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color={"light"} fontSize={10} fontWeight="bold">{elem?.noOfTrade}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={1.71}>
                  <MDTypography color="light" fontSize={10} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">{"+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(elem?.payout))}</MDTypography>
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
    </MDBox>

  );
}
