import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
// import { userContext } from '../../../AuthContext';
// import moment from 'moment';
import moment from 'moment';
import { saveAs } from 'file-saver';

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import { CircularProgress, Tooltip } from "@mui/material";
import { Grid } from "@mui/material";
// import { apiUrl } from '../../../constants/constants';
import { AiOutlineEye } from "react-icons/ai";
import BatchAndCollegeWise from "./batchAndCollegeWise";
import DownloadIcon from '@mui/icons-material/Download';
import {dailyPnlCompany, traderWisePnl, collegeWiseInfo, activeTrader, inactiveTrader} from "./download";


export default function TableView({collegeData, holiday, whichTab, dateWiseData, userData, id, inactiveUser, activeUser }) {
  const [isLoading, setIsLoading] = useState(false);

  let pnlData;

  if(whichTab === "Daily P&L"){
    pnlData = dailyPnlCompany(dateWiseData);
  } else{
    pnlData = traderWisePnl(dateWiseData, holiday, userData);
  }

  let activeUserInfo = activeTrader(activeUser);
  let inactiveUserInfo = inactiveTrader(inactiveUser);
  let collegeWiseUserInfo = collegeWiseInfo(collegeData);


  const handleDownload = (csvData, nameVariable) => {
    // Create the CSV content
    const csvContent = csvData?.map((row) => {
      return row?.map((row1) => row1.join(',')).join('\n');
    });

    // Create a Blob object with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });

    // Save the file using FileSaver.js
    saveAs(blob, `${nameVariable}.csv`);
  }



  return (

    <MDBox bgColor="dark" color="light" mb={0} borderRadius={10} minWidth='100%' minHeight='auto'>
      {whichTab === "Daily P&L" ?
        <Grid container spacing={1}>

          <Grid container p={0.5} mb={1} style={{backgroundColor:'white' ,border: '1px solid white', borderRadius: 5 }}>
            <Grid item xs={12} md={2} lg={8} pl={1} display="flex" justifyContent="flex-start" alignContent="center" alignItems="center">
              <MDTypography color="dark" fontSize={12} fontWeight="bold">Date Wise - P&L</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={4} display="flex" justifyContent="flex-end" alignContent="center" alignItems="center">
              <Tooltip title="Download CSV"><MDButton variant='contained' onClick={()=>{handleDownload(pnlData, "dailyPnlIntern")}}><DownloadIcon/></MDButton></Tooltip>
            </Grid>
          </Grid>

          <Grid container p={1} style={{ border: '1px solid white', borderRadius: 5 }}>
            <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={9} fontWeight="bold">DATE</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={2}>
              <MDTypography color="light" fontSize={9} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">WEEKDAY</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={9} fontWeight="bold">GROSS P&L</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={9} fontWeight="bold">TRANSACTION COST</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={9} fontWeight="bold">NET P&L</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={9} fontWeight="bold"># OF TRADES</MDTypography>
            </Grid>
          </Grid>


          {!isLoading ?
            dateWiseData?.map((elem) => {

              const gpnlcolor = (elem?.gpnl) >= 0 ? "success" : "error"
              const npnlcolor = (elem?.npnl) >= 0 ? "success" : "error"
              const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][elem?.dayOfWeek - 1];

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
        <Grid container spacing={1} >

          <Grid container p={0.5} mb={1} style={{backgroundColor:'white' ,border: '1px solid white', borderRadius: 5 }}>
            <Grid item xs={12} md={2} lg={8} pl={1} display="flex" justifyContent="flex-start" alignContent="center" alignItems="center">
              <MDTypography color="dark" fontSize={12} fontWeight="bold">Active User - P&L</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={4} display="flex" justifyContent="flex-end" alignContent="center" alignItems="center">
              <Tooltip title="Download CSV"><MDButton variant='contained' onClick={()=>{handleDownload(pnlData, "traderPnlIntern")}}><DownloadIcon/></MDButton></Tooltip>
            </Grid>
          </Grid>

          <Grid container p={1} style={{ border: '1px solid white', borderRadius: 5 }}>
            <Grid item xs={12} md={2} lg={1.33} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={9} fontWeight="bold">TRADER NAME</MDTypography>
            </Grid>

            <Grid item xs={12} md={2} lg={1.33} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={9} fontWeight="bold">GROSS P&L</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={1.33} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={9} fontWeight="bold">TRANSACTION COST</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={1.33} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={9} fontWeight="bold">NET P&L</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={1.33} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={9} fontWeight="bold"># OF TRADES</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={1.33}>
              <MDTypography color="light" fontSize={9} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">TRADING DAYS</MDTypography>
            </Grid>

            <Grid item xs={12} md={2} lg={1.33} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={9} fontWeight="bold"># OF REFERRAL</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={1.33} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={9} fontWeight="bold">PAYOUT</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={1.33}>
              <MDTypography color="light" fontSize={9} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">ATTENDANCE</MDTypography>
            </Grid>
          </Grid>


          {!isLoading ?
            dateWiseData?.map((elem) => {

              const gpnlcolor = (elem?.gpnl) >= 0 ? "success" : "error";
              const npnlcolor = (elem?.npnl) >= 0 ? "success" : "error";

              return (
                <Grid container mt={1} p={1} style={{ border: '1px solid white', borderRadius: 5 }}>
                  <Grid item xs={12} md={2} lg={1.33} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={10} fontWeight="bold">{elem?.name?.length <= 16 ? elem?.name : elem?.name?.slice(0, 13) + "..."}</MDTypography>
                  </Grid>

                  <Grid item xs={12} md={2} lg={1.33} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color={gpnlcolor} fontSize={10} fontWeight="bold">₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(elem?.gpnl))}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={1.33} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={10} fontWeight="bold">₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(elem?.brokerage))}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={1.33} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color={npnlcolor} fontSize={10} fontWeight="bold">₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(elem?.npnl))}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={1.33} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color={"light"} fontSize={10} fontWeight="bold">{elem?.noOfTrade}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={1.33}>
                    <MDTypography color="light" fontSize={10} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem?.tradingDays}</MDTypography>
                  </Grid>

                  <Grid item xs={12} md={2} lg={1.33}>
                    <MDTypography color="light" fontSize={10} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem?.referralCount}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={1.33}>
                    <MDTypography color="light" fontSize={10} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">₹{elem?.payout}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={1.33}>
                    <MDTypography color="light" fontSize={10} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem?.attendancePercentage}%</MDTypography>
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
      }

      {(whichTab !== "Daily P&L") &&
        <>

          <Grid container spacing={1} mt={2}>

            <Grid container p={0.5} mb={1} style={{ backgroundColor: 'white', border: '1px solid white', borderRadius: 5 }}>
              <Grid item xs={12} md={2} lg={8} pl={1} display="flex" justifyContent="flex-start" alignContent="center" alignItems="center">
                <MDTypography color="dark" fontSize={12} fontWeight="bold">{`Active User Info(${activeUser?.length ? activeUser?.length : 0})`}</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={4} display="flex" justifyContent="flex-end" alignContent="center" alignItems="center">
                <Tooltip title="Download CSV"><MDButton variant='contained' onClick={() => { handleDownload(activeUserInfo, "activeUserInfo") }}><DownloadIcon /></MDButton></Tooltip>
              </Grid>
            </Grid>

            <Grid container p={1} style={{ border: '1px solid white', borderRadius: 5 }}>
              <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={9} fontWeight="bold">NAME</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={9} fontWeight="bold">EMAIL</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={9} fontWeight="bold">MOBILE</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={9} fontWeight="bold">TRADING DAYS</MDTypography>
              </Grid>
            </Grid>


            {!isLoading ?
              activeUser?.map((elem) => {
                return (
                  <Grid container mt={1} p={1} style={{ border: '1px solid white', borderRadius: 5 }}>
                    <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color="light" fontSize={10} fontWeight="bold">{elem?.name}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={3}>
                      <MDTypography color="light" fontSize={10} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem?.email}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={3}>
                      <MDTypography color="light" fontSize={10} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem?.mobile}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={3}>
                      <MDTypography color="light" fontSize={10} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem?.tradingDays}</MDTypography>
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

          <Grid container spacing={1} mt={2}>

            <Grid container p={0.5} mb={1} style={{ backgroundColor: 'white', border: '1px solid white', borderRadius: 5 }}>
              <Grid item xs={12} md={2} lg={8} pl={1} display="flex" justifyContent="flex-start" alignContent="center" alignItems="center">
                <MDTypography color="dark" fontSize={12} fontWeight="bold">{`Inactive User Info(${inactiveUser?.length ? inactiveUser?.length : 0})`}</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={4} display="flex" justifyContent="flex-end" alignContent="center" alignItems="center">
                <Tooltip title="Download CSV"><MDButton variant='contained' onClick={() => { handleDownload(inactiveUserInfo, "inactiveUserInfo") }}><DownloadIcon /></MDButton></Tooltip>
              </Grid>
            </Grid>

            <Grid container p={1} style={{ border: '1px solid white', borderRadius: 5 }}>
              <Grid item xs={12} md={2} lg={4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={9} fontWeight="bold">NAME</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={9} fontWeight="bold">EMAIL</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={9} fontWeight="bold">MOBILE</MDTypography>
              </Grid>
            </Grid>


            {!isLoading ?
              inactiveUser?.map((elem) => {
                return (
                  <Grid container mt={1} p={1} style={{ border: '1px solid white', borderRadius: 5 }}>
                    <Grid item xs={12} md={2} lg={4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color="light" fontSize={10} fontWeight="bold">{elem?.name}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={4}>
                      <MDTypography color="light" fontSize={10} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem?.email}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={4}>
                      <MDTypography color="light" fontSize={10} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem?.mobile}</MDTypography>
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

          <Grid container spacing={1} mt={2}>

            <Grid container p={0.5} mb={1} style={{ backgroundColor: 'white', border: '1px solid white', borderRadius: 5 }}>
              <Grid item xs={12} md={2} lg={8} pl={1} display="flex" justifyContent="flex-start" alignContent="center" alignItems="center">
                <MDTypography color="dark" fontSize={12} fontWeight="bold">{`College Wise User Info(${collegeData?.length ? collegeData?.length : 0})`}</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={4} display="flex" justifyContent="flex-end" alignContent="center" alignItems="center">
                <Tooltip title="Download CSV"><MDButton variant='contained' onClick={() => { handleDownload(collegeWiseUserInfo, "collegeWiseUserInfo") }}><DownloadIcon /></MDButton></Tooltip>
              </Grid>
            </Grid>

            <Grid container p={1} style={{ border: '1px solid white', borderRadius: 5 }}>
              <Grid item xs={12} md={2} lg={6} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={9} fontWeight="bold">COLLEGE NAME</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={1.5}>
                <MDTypography color="light" fontSize={9} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">TOTAL USER</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={9} fontWeight="bold">ACTIVE USER</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={9} fontWeight="bold">INACTIVE USER</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={9} fontWeight="bold">USER DETAILS</MDTypography>
              </Grid>
            </Grid>


            {!isLoading ?
              collegeData?.map((elem) => {
                return (
                  <Grid container mt={1} p={1} style={{ border: '1px solid white', borderRadius: 5 }}>
                    <Grid item xs={12} md={2} lg={6} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color="light" fontSize={10} fontWeight="bold">{elem?.collegeName}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={1.5}>
                      <MDTypography color="light" fontSize={10} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem?.totalUser}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={1.5}>
                      <MDTypography color="light" fontSize={10} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem?.activeUser}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={1.5}>
                      <MDTypography color="light" fontSize={10} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem?.inactiveUser}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        {/* <AiOutlineEye style={{cursor:"pointer"}}/> */}
                        <BatchAndCollegeWise id={id} college={elem.college} />
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
        </>
      }
    </MDBox>

  );
}
