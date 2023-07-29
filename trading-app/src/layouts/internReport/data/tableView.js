import React from "react";
// import axios from "axios";
import {  useState } from "react";
// import { userContext } from '../../../AuthContext';
// import moment from 'moment';
import moment from 'moment';

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import {CircularProgress} from "@mui/material";
import { Grid } from "@mui/material";


export default function TableView({holiday, whichTab, dateWiseData, userData, batches, dates}) {
  const [isLoading,setIsLoading] = useState(false);

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
  

  console.log("batches", dates, userData, calculateWorkingDays(dates.startDate, dates.endDate))

  return (

    <MDBox bgColor="dark" color="light" mb={0} borderRadius={10} minWidth='100%' minHeight='auto'>
      {whichTab === "Daily P&L" ?
        <Grid container spacing={1}>
          <MDBox><MDButton color='light'>Download</MDButton></MDBox>
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
        <Grid container spacing={1}>
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

              const attendanceLimit = elem.attendancePercentage;
              const referralLimit = elem.referralCount;
              const payoutPercentage = elem.payoutPercentage;
              const reliefAttendanceLimit = attendanceLimit - attendanceLimit*5/100
              const reliefReferralLimit = referralLimit - referralLimit*10/100
          
              // const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][elem?.dayOfWeek-1];
              const referral = userData?.filter((subelem)=>{
                return subelem?._id?.toString() == elem?.userId?.toString();
              })

              const batchEndDate = moment(elem.batchEndDate);
              const currentDate = moment();
              const endDate = batchEndDate.isBefore(currentDate) ? batchEndDate.format("YYYY-MM-DD") : currentDate.format("YYYY-MM-DD");
              const attendance = (elem?.tradingDays*100/(calculateWorkingDays(elem.batchStartDate, endDate) - holiday));
              let refCount = referral[0]?.referrals?.length;
              elem.isPayout = false;
              console.log("working day", attendance, attendanceLimit, refCount, referralLimit, reliefAttendanceLimit)

              if (attendance >= attendanceLimit && refCount >= referralLimit && elem?.npnl > 0) {
                console.log("payout 1sr");
                elem.isPayout = true;
              }
          
              if(!(attendance >= attendanceLimit && refCount >= referralLimit) && (attendance >= attendanceLimit || refCount >= referralLimit) && elem?.npnl > 0){
                if(attendance < attendanceLimit && attendance >= reliefAttendanceLimit){
                  elem.isPayout = true;
                  console.log("payout relief");
                }
                if(refCount < referralLimit && refCount >= reliefReferralLimit){
                  elem.isPayout = true;
                  console.log("payout relief");
                }
              }


              return (
                <Grid container mt={1} p={1} style={{ border: '1px solid white', borderRadius: 5 }}>
                  <Grid item xs={12} md={2} lg={1.33} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={10} fontWeight="bold">{elem?.name}</MDTypography>
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
                    <MDTypography color="light" fontSize={10} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">{referral[0]?.referrals?.length}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={1.33}>
                    <MDTypography color="light" fontSize={10} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">₹{elem.isPayout ? (elem?.npnl*payoutPercentage/100).toFixed(0) : 0}</MDTypography> 
                  </Grid>
                  <Grid item xs={12} md={2} lg={1.33}>
                    <MDTypography color="light" fontSize={10} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">{(elem?.tradingDays*100/(calculateWorkingDays(elem.batchStartDate, endDate) - holiday)).toFixed(0)}%</MDTypography>
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
    </MDBox>

  );
}
