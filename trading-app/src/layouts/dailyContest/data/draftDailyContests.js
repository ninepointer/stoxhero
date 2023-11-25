
import React, { useState, useEffect } from 'react'
import Grid from "@mui/material/Grid";
import axios from "axios";
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDAvatar from "../../../components/MDAvatar";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import money from "../../../assets/images/money.png"
import { Link, useLocation } from "react-router-dom";
import moment from 'moment';


const CompletedContest = ({ type }) => {
  const [registeredUsersCount, setRegisteredUsersCount] = useState(0);
  const [completedContests, setCompletedContests] = useState([]);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

  useEffect(() => {
    let call1 = axios.get(`${baseUrl}api/v1/dailycontest/draft`, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
    })
    Promise.all([call1])
      .then(([api1Response]) => {
        // Process the responses here
        setCompletedContests(api1Response.data.data)
      })
      .catch((error) => {
        // Handle errors here
        console.error(error);
      });
  }, [])

  return (
    <>
      {completedContests.length > 0 ?

        <MDBox>
          <Grid container spacing={2} bgColor="dark">
            {completedContests?.map((e) => {

              return (

                <Grid key={e._id} item xs={12} md={12} lg={12} bgColor="dark">
                  <MDBox padding={0} style={{ borderRadius: 4 }}>
                    <MDButton
                      variant="contained"
                      color={"light"}
                      size="small"
                      component={Link}
                      style={{ minWidth: '100%' }}
                      to={{
                        pathname: `/dailycontestdetails`,
                      }}
                      state={{ data: e }}
                    >
                      <Grid container>

                        <Grid item xs={12} md={6} lg={12} mt={1} mb={1} display="flex" justifyContent="left" >
                          <MDTypography fontSize={15} style={{ color: "black", paddingRight: 4, fontWeight: 'bold' }}>TestZone Name: {e?.contestName}</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={12} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                          <Grid item xs={12} md={6} lg={2.4} mb={1} display="flex" justifyContent="center">
                            <MDTypography fontSize={9} style={{ color: "black" }}>No. of Registrations: <span style={{ fontSize: 11, fontWeight: 700 }}>{e?.participants?.length}</span></MDTypography>
                          </Grid>

                          <Grid item xs={12} md={6} lg={2.4} mb={1} display="flex" justifyContent="center">
                            <MDTypography fontSize={9} style={{ color: "black" }}>No. of Interesting User: <span style={{ fontSize: 11, fontWeight: 700 }}>{e?.interestedUsers?.length}</span></MDTypography>
                          </Grid>

                          <Grid item xs={12} md={6} lg={2.4} mb={1} display="flex" justifyContent="center">
                            <MDTypography fontSize={9} style={{ color: "black" }}>Status: <span style={{ fontSize: 11, fontWeight: 700 }}>{e?.contestStatus ? e?.contestStatus : 'Status not available'}</span></MDTypography>
                          </Grid>

                          <Grid item xs={12} md={6} lg={2.4} mb={1} display="flex" justifyContent="center">
                            <MDTypography fontSize={9} style={{ color: "black" }}>Start Date: <span style={{ fontSize: 11, fontWeight: 700 }}>{moment.utc(e?.contestStartTime).utcOffset('+05:30').format('DD-MMM-YY')}</span></MDTypography>
                          </Grid>

                          <Grid item xs={12} md={6} lg={2.4} mb={1} display="flex" justifyContent="center">
                            <MDTypography fontSize={9} style={{ color: "black" }}>End Date: <span style={{ fontSize: 11, fontWeight: 700 }}>{moment.utc(e?.contestEndTime).utcOffset('+05:30').format('DD-MMM-YY')}</span></MDTypography>
                          </Grid>

                        </Grid>

                        <Grid item xs={12} md={6} lg={12} display={"flex"} justifyContent={"center"} alignItems={"center"} textAlign={"center"}>

                          <Grid item xs={12} md={6} lg={2} mb={1} display="flex" justifyContent="center">
                            <MDTypography fontSize={9} style={{ color: "black" }}>Portfolio: <span style={{ fontSize: 11, fontWeight: 700 }}>{e?.portfolio?.portfolioValue}</span></MDTypography>
                          </Grid>

                          <Grid item xs={12} md={6} lg={2} mb={1} display="flex" justifyContent="center">
                            <MDTypography fontSize={9} style={{ color: "black" }}>Entry Fee: <span style={{ fontSize: 11, fontWeight: 700 }}>{e?.entryFee}</span></MDTypography>
                          </Grid>

                          <Grid item xs={12} md={6} lg={2} mb={1} display="flex" justifyContent="center">
                            <MDTypography fontSize={9} style={{ color: "black" }}>Payout %: <span style={{ fontSize: 11, fontWeight: 700 }}>{e?.payoutPercentage}</span></MDTypography>
                          </Grid>

                          <Grid item xs={12} md={6} lg={2} mb={1} display="flex" justifyContent="center">
                            <MDTypography fontSize={9} style={{ color: "black" }}>Spot Left: <span style={{ fontSize: 11, fontWeight: 700 }}>{e?.maxParticipants - e?.participants?.length}</span></MDTypography>
                          </Grid>

                          <Grid item xs={12} md={6} lg={2} mb={1} display="flex" justifyContent="center">
                            <MDTypography fontSize={9} style={{ color: "black" }}>TestZone Type: <span style={{ fontSize: 11, fontWeight: 700 }}>{e?.entryFee === 0 ? "Free" : 'Paid'}</span></MDTypography>
                          </Grid>

                          <Grid item xs={12} md={6} lg={2} mb={1} display="flex" justifyContent="center">
                            <MDTypography fontSize={9} style={{ color: "black" }}>TestZone For: <span style={{ fontSize: 11, fontWeight: 700 }}>{e?.contestFor}</span></MDTypography>
                          </Grid>

                        </Grid>

                      </Grid>                      
                      </MDButton>
                  </MDBox>
                </Grid>

              )
            })}
          </Grid>
        </MDBox>
        :
        <Grid container spacing={1} xs={12} md={6} lg={12}>
          <Grid item mt={2} xs={6} md={3} lg={12} display="flex" justifyContent="center">
            <MDTypography color="light">No Draft TestZone(s)</MDTypography>
          </Grid>
        </Grid>
      }

    </>
  )
}



export default CompletedContest;