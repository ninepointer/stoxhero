
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
import { apiUrl } from '../../../constants/constants';


const Active = () => {
  let [skip, setSkip] = useState(0);
  const limitSetting = 10;
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  async function fetchData() {
    const getData = await axios.get(`${apiUrl}quiz/active`, { withCredentials: true });
    setData(getData.data.data)
    setCount(getData.data.count)
    setTimeout(() => {
      setIsLoading(false)
    }, 100)
  }

  useEffect(() => {
    fetchData();
  }, [])

  async function backHandler() {
    if (skip <= 0) {
      return;
    }
    setSkip(prev => prev - limitSetting);
    setData([]);
    setIsLoading(true)
    await fetchData();
  }

  async function nextHandler() {
    if (skip + limitSetting >= count) {
      return;
    }
    setSkip(prev => prev + limitSetting);
    setData([]);
    setIsLoading(true)
    await fetchData();
  }


  return (
    <>
      {data.length > 0 ?

        <MDBox>
          <Grid container spacing={2} bgColor="dark">
            {data?.map((e) => {
              return (

                <Grid key={e._id} item xs={12} md={12} lg={12} bgColor="dark">
                  <MDBox padding={0} style={{ borderRadius: 4 }}>
                    <MDButton
                      variant="contained"
                      // color={contestColor}
                      size="small"
                      component={Link}
                      style={{ minWidth: '100%' }}
                      to={{
                        pathname: `/quizdetails`,
                      }}
                      state={{ data: e }}
                    >
                      <Grid container>

                        <Grid item xs={12} md={6} lg={12} mt={1} mb={1} display="flex" justifyContent="left" >
                          <MDTypography fontSize={15} style={{ color: "black", paddingRight: 4, fontWeight: 'bold' }}>Name: {e?.title}</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={12} mt={1} mb={1} display="flex" justifyContent="left" >
                          <MDTypography fontSize={15} style={{ color: "black", paddingRight: 4, fontWeight: 'bold' }}>Grade: {e?.grade?.grade}</MDTypography>
                        </Grid>

                        {/* <Grid item xs={12} md={6} lg={12} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                <Grid item xs={12} md={6} lg={2} mb={1} display="flex" justifyContent="center">
                                  <MDTypography fontSize={9} style={{ color: "black" }}>Registrations: <span style={{ fontSize: 9, fontWeight: 700 }}>{e?.participants?.length}</span></MDTypography>
                                </Grid>

                                <Grid item xs={12} md={6} lg={2} mb={1} display="flex" justifyContent="center">
                                  <MDTypography fontSize={9} style={{ color: "black" }}>Interests: <span style={{ fontSize: 9, fontWeight: 700 }}>{e?.interestedUsers?.length}</span></MDTypography>
                                </Grid>

                                <Grid item xs={12} md={6} lg={2} mb={1} display="flex" justifyContent="center">
                                  <MDTypography fontSize={9} style={{ color: "black" }}>Start Date: <span style={{ fontSize: 9, fontWeight: 700 }}>{moment.utc(e?.contestStartTime).utcOffset('+05:30').format('DD-MMM hh:mm a')}</span></MDTypography>
                                </Grid>

                                <Grid item xs={12} md={6} lg={2} mb={1} display="flex" justifyContent="center">
                                  <MDTypography fontSize={9} style={{ color: "black" }}>End Date: <span style={{ fontSize: 9, fontWeight: 700 }}>{moment.utc(e?.contestEndTime).utcOffset('+05:30').format('DD-MMM hh:mm a')}</span></MDTypography>
                                </Grid>

                                <Grid item xs={12} md={6} lg={2} mb={1} display="flex" justifyContent="center">
                                  <MDTypography fontSize={9} style={{ color: "black" }}>Featured: <span style={{ fontSize: 9, fontWeight: 700 }}>{e?.featured === true ? 'TRUE' : 'FALSE'}</span></MDTypography>
                                </Grid>

                                <Grid item xs={12} md={6} lg={2} mb={1} display="flex" justifyContent="center">
                                  <MDTypography fontSize={9} style={{ color: "black" }}>Portfolio: <span style={{ fontSize: 9, fontWeight: 700 }}>₹{Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(e?.portfolio?.portfolioValue)}</span></MDTypography>
                                </Grid>

                                </Grid>

                                <Grid item xs={12} md={6} lg={12} display={"flex"} justifyContent={"center"} alignItems={"center"} textAlign={"center"}>

                                <Grid item xs={12} md={6} lg={2} mb={1} display="flex" justifyContent="center">
                                  <MDTypography fontSize={9} style={{ color: "black" }}>Entry Fee: <span style={{ fontSize: 9, fontWeight: 700 }}>₹{Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(e?.entryFee)}</span></MDTypography>
                                </Grid>

                                <Grid item xs={12} md={6} lg={2} mb={1} display="flex" justifyContent="center">
                                  <MDTypography fontSize={9} style={{ color: "black" }}>Payout %: <span style={{ fontSize: 9, fontWeight: 700 }}>{e?.payoutPercentage}%</span></MDTypography>
                                </Grid>

                                <Grid item xs={12} md={6} lg={2} mb={1} display="flex" justifyContent="center">
                                  <MDTypography fontSize={9} style={{ color: "black" }}>Total Spots: <span style={{ fontSize: 9, fontWeight: 700 }}>{e?.maxParticipants}</span></MDTypography>
                                </Grid>

                                <Grid item xs={12} md={6} lg={2} mb={1} display="flex" justifyContent="center">
                                  <MDTypography fontSize={9} style={{ color: "black" }}>Spot Left: <span style={{ fontSize: 9, fontWeight: 700 }}>{e?.maxParticipants - e?.participants?.length}</span></MDTypography>
                                </Grid>

                                <Grid item xs={12} md={6} lg={2} mb={1} display="flex" justifyContent="center">
                                  <MDTypography fontSize={9} style={{ color: "black" }}>TestZone Type: <span style={{ fontSize: 9, fontWeight: 700 }}>{e?.entryFee === 0 ? "Free" : 'Paid'}</span></MDTypography>
                                </Grid>

                                <Grid item xs={12} md={6} lg={2} mb={1} display="flex" justifyContent="center">
                                  <MDTypography fontSize={9} style={{ color: "black" }}>TestZone For: <span style={{ fontSize: 9, fontWeight: 700 }}>{e?.contestFor}</span></MDTypography>
                                </Grid>

                              </Grid> */}

                      </Grid>
                    </MDButton>
                  </MDBox>
                </Grid>

              )
            })}
          </Grid>
          {!isLoading && count !== 0 &&
            <MDBox mt={1} display="flex" justifyContent="space-between" alignItems='center' width='100%'>
              <MDButton variant='outlined' color='warning' disabled={(skip + limitSetting) / limitSetting === 1 ? true : false} size="small" onClick={backHandler}>Back</MDButton>
              <MDTypography color="light" fontSize={15} fontWeight='bold'>Total TestZones: {!count ? 0 : count} | Page {(skip + limitSetting) / limitSetting} of {!count ? 1 : Math.ceil(count / limitSetting)}</MDTypography>
              <MDButton variant='outlined' color='warning' disabled={Math.ceil(count / limitSetting) === (skip + limitSetting) / limitSetting ? true : !count ? true : false} size="small" onClick={nextHandler}>Next</MDButton>
            </MDBox>
          }
        </MDBox>
        :
        <Grid container spacing={1} xs={12} md={6} lg={12}>
          <Grid item mt={2} xs={6} md={3} lg={12} display="flex" justifyContent="center">
            <MDTypography color="light">No Active Quiz(s)</MDTypography>
          </Grid>
        </Grid>
      }

    </>
  )
}



export default Active;