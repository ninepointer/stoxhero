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

  function calculateWorkingDays(startDate, endDate) {
    const start = moment(startDate);
    const end = moment(endDate);

    // Increase the endDate by one day
    end.add(1, 'day');

    // Check if the start date is after the end date
    if (start.isAfter(end)) {
      return 0;
    }

    let workingDays = 0;
    let currentDate = start;

    // Iterate over each day between the start and end dates
    while (currentDate.isSameOrBefore(end)) {
      // Check if the current day is a weekday (Monday to Friday)
      if (currentDate.isoWeekday() <= 5) {
        workingDays++;
      }

      // Move to the next day
      currentDate = currentDate.add(1, 'day');
    }

    return workingDays;
  }


  // console.log("activeUser", activeUser)


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

  let traderWisePnlInfo = [];
  if(whichTab !== "Daily P&L"){
    dateWiseData?.map((elem)=>{
      const attendanceLimit = elem.attendancePercentage;
      const referralLimit = elem.referralCount;
      const payoutPercentage = elem.payoutPercentage;
      const reliefAttendanceLimit = attendanceLimit - attendanceLimit * 5 / 100
      const reliefReferralLimit = referralLimit - referralLimit * 10 / 100

      // const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][elem?.dayOfWeek-1];
      const referral = userData?.filter((subelem) => {
        return subelem?._id?.toString() == elem?.userId?.toString();
      })

      const batchEndDate = moment(elem.batchEndDate);
      const currentDate = moment();
      const endDate = batchEndDate.isBefore(currentDate) ? batchEndDate.format("YYYY-MM-DD") : currentDate.format("YYYY-MM-DD");
      const endDate1 = batchEndDate.isBefore(currentDate) ? batchEndDate.clone().set({ hour: 19, minute: 0, second: 0, millisecond: 0 }) : currentDate.clone().set({ hour: 19, minute: 0, second: 0, millisecond: 0 });
      const attendance = (elem?.tradingDays * 100 / (calculateWorkingDays(elem.batchStartDate, endDate) - holiday));
      let refCount = 0;
      for (let subelem of referral[0]?.referrals) {
        const joiningDate = moment(subelem?.referredUserId?.joining_date);
      
        console.log("joiningDate", moment(moment(elem.batchStartDate).format("YYYY-MM-DD")), joiningDate ,endDate, endDate1, moment(endDate).set({ hour: 19, minute: 0, second: 0, millisecond: 0 }).format("YYYY-MM-DD HH:mm:ss"))
        if (joiningDate.isSameOrAfter(moment(moment(elem.batchStartDate).format("YYYY-MM-DD"))) && joiningDate.isSameOrBefore(endDate1)) {
          // console.log("joiningDate if", batchEndDate, batchEndDate.format("YYYY-MM-DD"))
          refCount += 1;
          console.log("joiningDate if")
        }
      }
      // referral[0]?.referrals?.length;
      elem.isPayout = false;
      const profitCap = 15000;

      if (attendance >= attendanceLimit && refCount >= referralLimit && elem?.npnl > 0) {
        console.log("payout 1sr");
        elem.isPayout = true;
      }

      if (!(attendance >= attendanceLimit && refCount >= referralLimit) && (attendance >= attendanceLimit || refCount >= referralLimit) && elem?.npnl > 0) {
        if (attendance < attendanceLimit && attendance >= reliefAttendanceLimit) {
          elem.isPayout = true;
          console.log("payout relief");
        }
        if (refCount < referralLimit && refCount >= reliefReferralLimit) {
          elem.isPayout = true;
          console.log("payout relief");
        }
      }

      elem.referral = refCount;
      elem.payout = elem.isPayout ? Math.min((elem?.npnl * payoutPercentage / 100).toFixed(0), profitCap) : 0;
      elem.tradeDay = (elem?.tradingDays * 100 / (calculateWorkingDays(elem.batchStartDate, endDate) - holiday)).toFixed(0)
      elem.attendance = (elem?.tradingDays * 100 / (calculateWorkingDays(elem.batchStartDate, endDate) - holiday)).toFixed(0);
     traderWisePnlInfo.push(elem);


    })
  }

  traderWisePnlInfo.sort((a,b)=>{
    if(a.payout > b.payout){
      return -1;
    } else if(a.payout <= b.payout){
      if(a.npnl > b.npnl){
        return -1;
      } else if(a.npnl < b.npnl){
        return 1;
      } else{
        return 1;
      }
      
    } else{
      return 1;
    }
  })



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
          {/* <Grid item xs={12} md={2} lg={12} mb={1} style={{ backgroundColor: "white", borderRadius: 5 }} display="flex" justifyContent="space-between" alignContent="center" alignItems="center" pr={1}>
            <MDTypography ></MDTypography>
            <MDTypography color="dark" fontSize={13} fontWeight="bold">{`Active User P&L`}</MDTypography>
            <MDTypography  onClick={()=>{handleDownload(pnlData, "traderPnlIntern")}}><DownloadIcon/> </MDTypography>

          </Grid> */}

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
            traderWisePnlInfo?.map((elem) => {

              const gpnlcolor = (elem?.gpnl) >= 0 ? "success" : "error";
              const npnlcolor = (elem?.npnl) >= 0 ? "success" : "error";

              return (
                <Grid container mt={1} p={1} style={{ border: '1px solid white', borderRadius: 5 }}>
                  <Grid item xs={12} md={2} lg={1.33} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={10} fontWeight="bold">{elem?.name?.length <= 16 ? elem?.name : elem?.name.slice(0, 13) + "..."}</MDTypography>
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
                    <MDTypography color="light" fontSize={10} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem?.referral}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={1.33}>
                    <MDTypography color="light" fontSize={10} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">₹{elem?.payout}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={1.33}>
                    <MDTypography color="light" fontSize={10} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem?.attendance}%</MDTypography>
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
