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
import { CircularProgress } from "@mui/material";
import { Grid } from "@mui/material";
// import { apiUrl } from '../../../constants/constants';
import { AiOutlineEye } from "react-icons/ai";
import BatchAndCollegeWise from "./batchAndCollegeWise";
import DownloadIcon from '@mui/icons-material/Download';



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


  console.log("activeUser", activeUser)

  let csvDataFile = [[]]
  let csvData = [['DATE','WEEKDAY', 'GROSS P&L', 'TRANSACTION COST', 'NET P&L', '# OF TRADES']]

  if (whichTab === "Daily P&L" && dateWiseData) {
    // dates = Object.keys(dateWiseData)
    let csvpnlData = Object.values(dateWiseData)
    csvDataFile = csvpnlData?.map((elem) => {
      const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][elem?.dayOfWeek - 1];

      return [elem?._id?.date,
      moment.utc(new Date(elem?._id?.date)).utcOffset('+00:00').format('dddd'),
        weekday,
      elem?.gpnl,
      elem?.brokerage,
      elem?.npnl,
      elem?.noOfTrade]
    })
  }

  csvData = [[...csvData,...csvDataFile]]


  // let csvDataFile1 = [[]]
  // let csvData1 = [['TRADER NAME','GROSS P&L', 'TRANSACTION COST', 'NET P&L', '# OF TRADES', 'TRADING DAYS', '# OF REFERRAL', 'PAYOUT', 'ATTENDANCE']]

  // if (whichTab !== "Daily P&L" && dateWiseData) {
  //   // dates = Object.keys(activeUser)
  //   let csvpnlData = Object.values(dateWiseData)
  //   csvDataFile = csvpnlData?.map((elem) => {
  //     // const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][elem?.dayOfWeek - 1];

  //     return [elem?._id?.date,
  //     moment.utc(new Date(elem?._id?.date)).utcOffset('+00:00').format('dddd'),
  //       weekday,
  //     elem?.gpnl,
  //     elem?.brokerage,
  //     elem?.npnl,
  //     elem?.noOfTrade]
  //   })
  // }

  // csvData1 = [[...csvData1,...csvDataFile1]]

  const handleDownload = (csvData) => {
    // Create the CSV content
    // const csvContent = csvData.map(row => row.join(',')).join('\n');
    const csvContent = csvData?.map((row) => {
      return row?.map((row1) => row1.join(',')).join('\n');
    });
    // const csvContent = 'Date,Weekday,Gross P&L(S) Gross P&L(I) Net P&L(S) Net P&L(I) Net P&L Diff(S-I)\nValue 1,Value 2,Value 3\nValue 4, Value 5, Value 6';

    // Create a Blob object with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });

    // Save the file using FileSaver.js
    saveAs(blob, `${"report"}.csv`);
  }


  return (

    <MDBox bgColor="dark" color="light" mb={0} borderRadius={10} minWidth='100%' minHeight='auto'>
      {whichTab === "Daily P&L" ?
        <Grid container spacing={1}>
            <Grid item xs={12} md={2} lg={12} mb={1} style={{ backgroundColor: "white", borderRadius: 5 }} display="flex" justifyContent="space-between" alignContent="center" alignItems="center" pr={1}>
            <MDTypography ></MDTypography>
            <MDTypography color="dark" fontSize={13} fontWeight="bold">{`Date Wise P&L`}</MDTypography>
            <MDTypography  onClick={()=>{handleDownload(csvData)}}><DownloadIcon/> </MDTypography>
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
          <Grid item xs={12} md={2} lg={12} mb={1} style={{ backgroundColor: "white", borderRadius: 5 }} display="flex" justifyContent="center" alignContent="center" alignItems="center">

            {/* <MDTypography ></MDTypography> */}
            <MDTypography color="dark" fontSize={13} fontWeight="bold">{`Active User P&L`}</MDTypography>
            {/* <MDTypography  onClick={()=>{handleDownload(csvData1)}}><DownloadIcon/> </MDTypography> */}

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
              const attendance = (elem?.tradingDays * 100 / (calculateWorkingDays(elem.batchStartDate, endDate) - holiday));
              let refCount = referral[0]?.referrals?.length;
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

              console.log("working day", elem.isPayout, payoutPercentage)



              return (
                <Grid container mt={1} p={1} style={{ border: '1px solid white', borderRadius: 5 }}>
                  <Grid item xs={12} md={2} lg={1.33} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={10} fontWeight="bold">{elem?.name.length <= 16 ? elem?.name : elem?.name.slice(0, 13) + "..."}</MDTypography>
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
                    <MDTypography color="light" fontSize={10} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">₹{elem.isPayout ? Math.min((elem?.npnl * payoutPercentage / 100).toFixed(0), profitCap) : 0}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={1.33}>
                    <MDTypography color="light" fontSize={10} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">{(elem?.tradingDays * 100 / (calculateWorkingDays(elem.batchStartDate, endDate) - holiday)).toFixed(0)}%</MDTypography>
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
            <Grid item xs={12} md={2}  lg={12} mb={1} style={{backgroundColor: "white", borderRadius: 5}} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="dark" fontSize={13} fontWeight="bold">{`Active User Info(${activeUser.length})`}</MDTypography>
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
            <Grid item xs={12} md={2}  lg={12} mb={1} style={{backgroundColor: "white", borderRadius: 5}} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="dark" fontSize={13} fontWeight="bold">{`Inactive User Info(${inactiveUser.length})`}</MDTypography>
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
            <Grid item xs={12} md={2}  lg={12} mb={1} style={{backgroundColor: "white", borderRadius: 5}} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="dark" fontSize={13} fontWeight="bold">{`College Wise User Info(${collegeData.length})`}</MDTypography>
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
