import React from "react";
// import axios from "axios";
import { useState } from "react";
// import { userContext } from '../../../AuthContext';
import moment from 'moment';
import {Tooltip} from "@mui/material";
import _ from 'lodash';
//

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import {CircularProgress} from "@mui/material";
import { Grid } from "@mui/material";
import { saveAs } from 'file-saver';
import DownloadIcon from '@mui/icons-material/Download';



export default function TableView({liveUser, expiredUser, whichTab, dateWiseData}) {
  const [isLoading,setIsLoading] = useState(false);
  const [showDownloadButton, setShowDownloadButton] = useState(true);

  function properCase(str) {
    return str
      .toLowerCase()
      .replace(/^(.)|\s+(.)/g, c => c.toUpperCase());
  }

  const handleDownload = (csvData) => {
    const csvContent = csvData?.map((row) => {
      return row?.map((row1) => row1.join(',')).join('\n');
    });

    // Create a Blob object with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });

    // Save the file using FileSaver.js
    saveAs(blob, `subs.csv`);
  }

  let traders = []
  let csvDataFile = [[]]
  let csvData = [['Trader Name','Gross P&L', 'TNX Cost', 'Net P&L', '# of Trades', 'Trading Days', 'Plan Start Date', 'Plan End Date', 'Expected Payout']]

  if(liveUser){
  traders = Object.keys(liveUser)
  let csvpnlData = Object.values(liveUser)
  csvDataFile = csvpnlData?.map((elem)=>{
     
  return [elem?.name,
      elem?.grossPnl?.toFixed(0),
      elem?.brokerage?.toFixed(0),
      elem?.npnl?.toFixed(0),
      elem?.trades,
      elem?.tradingDays,
      moment.utc(new Date(elem?.startDate)).utcOffset('+00:00').format('DD-MMM-YYYY'),
      moment.utc(new Date(elem?.startDate)).utcOffset('+00:00').add(60, 'days').format('DD-MMM-YYYY'),
      // moment.utc(new Date(elem?.endDate)).utcOffset('+00:00').format('DD-MMM-YYYY'),
      elem?.payout?.toFixed(0)
      ]
  })
  }

  csvData = [[...csvData,...csvDataFile]]

  let traders1 = []
  let csvDataFile1 = [[]]
  let csvData1 = [['Trader Name','Gross P&L', 'TNX Cost', 'Net P&L', '# of Trades', 'Trading Days', 'Plan Start', 'End Date', 'Payout']]

  if(expiredUser){
  traders = Object.keys(expiredUser)
  let csvpnlData = Object.values(expiredUser)
  csvDataFile1 = csvpnlData?.map((elem)=>{
     
  return [elem?.name,
      elem?.grossPnl?.toFixed(0),
      elem?.brokerage?.toFixed(0),
      elem?.npnl?.toFixed(0),
      elem?.trades,
      elem?.tradingDays,
      moment.utc(new Date(elem?.startDate)).utcOffset('+00:00').format('DD-MMM-YYYY'),
      moment.utc(new Date(elem?.endDate)).utcOffset('+00:00').format('DD-MMM-YYYY'),
      // moment.utc(new Date(elem?.endDate)).utcOffset('+00:00').format('DD-MMM-YYYY'),
      elem?.payout?.toFixed(0)
      ]
  })
  }

  csvData1 = [[...csvData1,...csvDataFile1]]


  return (

    <MDBox bgColor="dark" color="light" mb={0} borderRadius={10} minWidth='100%' minHeight='auto'>
      {whichTab === "Daily P&L" ?
        <Grid container spacing={1}>
          <Grid container p={1} style={{ border: '1px solid white', borderRadius: 5 }}>
            
            <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={9} fontWeight="bold">Date</MDTypography>
            </Grid>

            <Grid item xs={12} md={2} lg={2}>
              <MDTypography color="light" fontSize={9} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">WEEKDAY</MDTypography>
            </Grid>

            <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={9} fontWeight="bold">Gross P&L</MDTypography>
            </Grid>

            <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={9} fontWeight="bold">TNX Cost</MDTypography>
            </Grid>

            <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={9} fontWeight="bold">Net P&L</MDTypography>
            </Grid>

            <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={9} fontWeight="bold"># Of Trades</MDTypography>
            </Grid>

          </Grid>


          {!isLoading ?
            dateWiseData?.map((elem) => {

              const gpnlcolor = (elem?.gpnl) >= 0 ? "success" : "error"
              const npnlcolor = (elem?.npnl) >= 0 ? "success" : "error"
              const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][elem?.dayOfWeek-1];
          
              return (
                <Grid container mt={1} p={1} style={{ border: '1px solid white', borderRadius: 5 }}>
                  <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={10} fontWeight="bold">{elem?._id?.date}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={2}>
                    <MDTypography color="light" fontSize={10} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">{weekday}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color={gpnlcolor} fontSize={10} fontWeight="bold">₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(elem?.gpnl))}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={10} fontWeight="bold">₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(elem?.brokerage))}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color={npnlcolor} fontSize={10} fontWeight="bold">₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(elem?.npnl))}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color={"light"} fontSize={10} fontWeight="bold">{elem?.noOfTrade}</MDTypography>
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
        <>
        <Grid container spacing={1}>
          
          <Grid container p={0.5} mb={1} style={{backgroundColor:'white' ,border: '1px solid white', borderRadius: 5 }}>
            <Grid item xs={12} md={2} lg={8} pl={1} display="flex" justifyContent="flex-start" alignContent="center" alignItems="center">
              <MDTypography color="dark" fontSize={12} fontWeight="bold">Live Subscription - Trader Wise - P&L</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={4} display="flex" justifyContent="flex-end" alignContent="center" alignItems="center">
              {showDownloadButton && <Tooltip title="Download CSV"><MDButton variant='contained' onClick={()=>{handleDownload(csvData)}}><DownloadIcon/></MDButton></Tooltip>}
            </Grid>
          </Grid>

          <Grid container p={1} style={{ border: '1px solid white', borderRadius: 5 }}>
            <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={12} fontWeight="bold">Trader Name</MDTypography>
            </Grid>

            <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={12} fontWeight="bold">Gross P&L</MDTypography>
            </Grid>

            <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={12} fontWeight="bold">TXN. Cost</MDTypography>
            </Grid>

            <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={12} fontWeight="bold">Net P&L</MDTypography>
            </Grid>

            <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={12} fontWeight="bold"># Of Trades</MDTypography>
            </Grid>

            <Grid item xs={12} md={2} lg={1}>
              <MDTypography color="light" fontSize={12} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">Trading Days</MDTypography>
            </Grid>

            <Grid item xs={12} md={2} lg={1.4}>
              <MDTypography color="light" fontSize={12} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">Plan Start</MDTypography>
            </Grid>

            <Grid item xs={12} md={2} lg={1.4}>
              <MDTypography color="light" fontSize={12} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">Plan End</MDTypography>
            </Grid>

            <Grid item xs={12} md={2} lg={1.2}>
              <MDTypography color="light" fontSize={12} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">Exp. Payout</MDTypography>
            </Grid>
          </Grid>

          {!isLoading ?
            <> 
              {
                liveUser?.map((elem) => {

                  const gpnlcolor = (elem?.grossPnl) >= 0 ? "success" : "error"
                  const npnlcolor = (elem?.npnl) >= 0 ? "success" : "error"

                  return (
                    <>
                    <Grid container mt={1} p={1} style={{ border: '1px solid white', borderRadius: 5 }}>
                      <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color="light" fontSize={12}>{elem?.name.length <= 25 ? properCase(elem?.name) : properCase(elem?.name.slice(0,25)+"...")}</MDTypography>
                      </Grid>

                      <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color={gpnlcolor} fontSize={12}>{elem?.grossPnl >= 0 ? '₹' : '-₹'}{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(elem?.grossPnl))}</MDTypography>
                      </Grid>
                      <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color="light" fontSize={12}>₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.brokerage)}</MDTypography>
                      </Grid>
                      <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color={npnlcolor} fontSize={12}>{elem?.npnl >= 0 ? '₹' : '-₹'}{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(elem?.npnl))}</MDTypography>
                      </Grid>
                      <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color={"light"} fontSize={12}>{elem?.trades ? elem?.trades : "-"}</MDTypography>
                      </Grid>
                      <Grid item xs={12} md={2} lg={1}>
                        <MDTypography color="light" fontSize={12} display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem?.tradingDays ? elem?.tradingDays : "-"}</MDTypography>
                      </Grid>

                      <Grid item xs={12} md={2} lg={1.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color={"light"} fontSize={12}>{moment.utc(elem?.startDate).format('DD-MMM-YYYY')}</MDTypography>
                      </Grid>
                      <Grid item xs={12} md={2} lg={1.4}>
                        <MDTypography color="light" fontSize={12} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        {moment.utc(elem?.startDate).add(60,'days').format('DD-MMM-YYYY')}
                        </MDTypography>
                      </Grid>
                      <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color={"light"} fontSize={12}>₹{elem?.payout > 0 ? new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(elem?.payout)) : 0}</MDTypography>
                      </Grid>
                    </Grid>
                    </>
                  )
                })
              }
            </>
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

        <Grid container spacing={1} mt={2}>
          
          <Grid container p={0.5} mb={1} style={{backgroundColor:'white' ,border: '1px solid white', borderRadius: 5 }}>
            <Grid item xs={12} md={2} lg={8} pl={1} display="flex" justifyContent="flex-start" alignContent="center" alignItems="center">
              <MDTypography color="dark" fontSize={12} fontWeight="bold">Expired Subscription - Trader Wise - P&L</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={4} display="flex" justifyContent="flex-end" alignContent="center" alignItems="center">
              {showDownloadButton && <Tooltip title="Download CSV"><MDButton variant='contained' onClick={()=>{handleDownload(csvData1)}}><DownloadIcon/></MDButton></Tooltip>}
            </Grid>
          </Grid>

          <Grid container p={1} style={{ border: '1px solid white', borderRadius: 5 }}>
            <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={12} fontWeight="bold">Trader Name</MDTypography>
            </Grid>

            <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={12} fontWeight="bold">Gross P&L</MDTypography>
            </Grid>

            <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={12} fontWeight="bold">TXN. Cost</MDTypography>
            </Grid>

            <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={12} fontWeight="bold">Net P&L</MDTypography>
            </Grid>

            <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={12} fontWeight="bold"># Of Trades</MDTypography>
            </Grid>

            <Grid item xs={12} md={2} lg={1}>
              <MDTypography color="light" fontSize={12} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">Trading Days</MDTypography>
            </Grid>

            <Grid item xs={12} md={2} lg={1.4}>
              <MDTypography color="light" fontSize={12} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">Plan Start Date</MDTypography>
            </Grid>

            <Grid item xs={12} md={2} lg={1.4}>
              <MDTypography color="light" fontSize={12} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">Plan End Date</MDTypography>
            </Grid>

            <Grid item xs={12} md={2} lg={1.2}>
              <MDTypography color="light" fontSize={12} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">Payout</MDTypography>
            </Grid>

          </Grid>

          {!isLoading ?
            <> 
              {
                expiredUser?.map((elem) => {

                  const gpnlcolor = (elem?.grossPnl) >= 0 ? "success" : "error"
                  const npnlcolor = (elem?.npnl) >= 0 ? "success" : "error"
                  return (

                    <Grid container mt={1} p={1} style={{ border: '1px solid white', borderRadius: 5 }}>
                      <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color="light" fontSize={12}>{elem?.name.length <= 25 ? properCase(elem?.name) : properCase(elem?.name.slice(0,25)+"...")}</MDTypography>
                      </Grid>

                      <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color={gpnlcolor} fontSize={12}>{elem?.grossPnl >= 0 ? '₹' : '-₹'}{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(elem?.grossPnl))}</MDTypography>
                      </Grid>

                      <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color="light" fontSize={12}>₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(elem?.brokerage))}</MDTypography>
                      </Grid>

                      <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color={npnlcolor} fontSize={12}>{elem?.npnl >= 0 ? '₹' : '-₹'}{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(elem?.npnl))}</MDTypography>
                      </Grid>

                      <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color={"light"} fontSize={12}>{elem?.trades ? elem?.trades : "-"}</MDTypography>
                      </Grid>

                      <Grid item xs={12} md={2} lg={1}>
                        <MDTypography color="light" fontSize={12} display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem?.tradingDays ? elem?.tradingDays : "-"}</MDTypography>
                      </Grid>

                      <Grid item xs={12} md={2} lg={1.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color={"light"} fontSize={12}>{moment.utc(elem?.startDate).format('DD-MMM-YYYY')}</MDTypography>
                      </Grid>

                      <Grid item xs={12} md={2} lg={1.4}>
                        <MDTypography color="light" fontSize={12} display="flex" justifyContent="center" alignContent="center" alignItems="center">{moment.utc(elem?.endDate).format('DD-MMM-YYYY')}</MDTypography>
                      </Grid>

                      <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color={"light"} fontSize={12}>₹{elem?.payout > 0 ? new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(elem?.payout)) : 0}</MDTypography>
                      </Grid>

                    </Grid>

                  )
                })
              }
            </>
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
        </>
      }
    </MDBox>

    

  );
}
