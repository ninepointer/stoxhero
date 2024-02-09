import React, {useState, useEffect} from 'react';
import axios from "axios"
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import {Grid, CircularProgress, Divider} from '@mui/material';
import MDTypography from '../../../components/MDTypography';
import { Link } from "react-router-dom";
// import CachedIcon from '@mui/icons-material/Cached';

//data
import BattleChart from '../data/battleChart'
import BattleUsers from '../data/battleUsers'
import PnlOverviewMock from '../data/pnlOverviewMock';

export default function LabTabs({socket}) {
  const [isLoading,setIsLoading] = useState(false);
  const [battleUsers, setBattleUsers] = useState();
  const [completedBattle,setCompletedBattle] = useState();
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/battletrade/payoutchart`, {withCredentials: true})
    .then((res) => {
        console.log("Inside Payout chart data");
        setCompletedBattle(res.data.data);
        console.log("Completed Contest Res:",res.data.data)
    }).catch((err) => {
        setIsLoading(false)
        return new Error(err);
    })
  }, [])

  useEffect(()=>{
    let call1 = axios.get((`${baseUrl}api/v1/battles/battleuser`),{
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                  },
                })
    Promise.all([call1])
    .then(([api1Response]) => {
      setBattleUsers(api1Response.data.data)
    })
    .catch((error) => {
      // Handle errors here
      console.error(error);
    });
    
  },[])


  return (
    <MDBox bgColor="dark" mt={2} mb={1} p={2} borderRadius={10} display='flex' flexDirection='column' justifyContent='center' alignItems='center' minHeight='auto' maxWidth='100%'>
        <MDBox display='flex' justifyContent='left'>
            <MDTypography ml={1} mb={1} color='light' fontSize={18} fontWeight='bold'>Battle Dashboard</MDTypography>
        </MDBox>

        <PnlOverviewMock socket={socket} />

        <Grid container spacing={1} xs={12} md={12} lg={12} mt={0.5} mb={0.5} display='flex' justifyContent='center' alignItems='center'>

        <Grid item xs={12} md={6} lg={3}>

            <MDButton
                variant="contained"
                color={"info"}
                size="small"
                component={Link}
                to={{
                    pathname: `/battledashboard/battles`,
                }}
            >
                        <Grid container xs={12} md={12} lg={12}>

                                <Grid item xs={12} md={12} lg={12} mt={1} display="flex" justifyContent="left">
                                    <MDTypography fontSize={15} style={{ color: "white", paddingLeft: 4, paddingRight: 4, fontWeight: 'bold' }}>Battles</MDTypography>
                                </Grid>

                                <Grid item xs={12} md={12} lg={12} mb={2} style={{ fontWeight: 1000 }} display="flex" alignContent="center" alignItems="center">
                                    <MDBox display="flex" flexDirection="column">
                                        <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{ color: "white", paddingLeft: 4, paddingRight: 4 }}>Create battles here!</MDTypography>
                                    </MDBox>
                                </Grid>

                                <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                                    <MDTypography fontSize={9} style={{ color: "white" }}>Active Battles: <span style={{ fontSize: 11, fontWeight: 700 }}>10</span></MDTypography>
                                </Grid>

                                <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                                    <MDTypography fontSize={9} style={{ color: "white" }}>Completed Battles: <span style={{ fontSize: 11, fontWeight: 700 }}>10</span></MDTypography>
                                </Grid>

                            </Grid>
            </MDButton>

            </Grid>
            
            <Grid item xs={12} md={6} lg={3}>

                <MDButton
                    variant="contained"
                    color={"success"}
                    size="small"
                    component={Link}
                    to={{
                        pathname: `/battledashboard/battleposition`,
                    }}
                >
                    <Grid container xs={12} md={12} lg={12}>

                        <Grid item xs={12} md={12} lg={12} mt={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={15} style={{ color: "white", paddingLeft: 4, paddingRight: 4, fontWeight: 'bold' }}>Battle Position(Trader)</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={12} lg={12} mb={2} style={{ fontWeight: 1000 }} display="flex" alignContent="center" alignItems="center">
                            <MDBox display="flex" flexDirection="column">
                                <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{ color: "white", paddingLeft: 4, paddingRight: 4 }}>Check all trader's battle position here!</MDTypography>
                            </MDBox>
                        </Grid>

                        <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={9} style={{ color: "white" }}>Active Battles: <span style={{ fontSize: 11, fontWeight: 700 }}>10</span></MDTypography>
                        </Grid>

                        <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                            <MDTypography fontSize={9} style={{ color: "white" }}>Completed Battles: <span style={{ fontSize: 11, fontWeight: 700 }}>10</span></MDTypography>
                        </Grid>

                    </Grid>
                </MDButton>

            </Grid>

            <Grid item xs={12} md={6} lg={3}>

                <MDButton
                    variant="contained"
                    color={"secondary"}
                    size="small"
                    component={Link}
                    to={{
                        pathname: `/battledashboard/battlereport`,
                    }}
                >
                    <Grid container xs={12} md={12} lg={12}>

                        <Grid item xs={12} md={12} lg={12} mt={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={15} style={{ color: "white", paddingLeft: 4, paddingRight: 4, fontWeight: 'bold' }}>Battle Report</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={12} lg={12} mb={2} style={{ fontWeight: 1000 }} display="flex" alignContent="center" alignItems="center">
                            <MDBox display="flex" flexDirection="column">
                                <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{ color: "white", paddingLeft: 4, paddingRight: 4 }}>Check all battle reports here!</MDTypography>
                            </MDBox>
                        </Grid>

                        <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={9} style={{ color: "white" }}>Total Free Battles: <span style={{ fontSize: 11, fontWeight: 700 }}>10</span></MDTypography>
                        </Grid>

                        <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                            <MDTypography fontSize={9} style={{ color: "white" }}>Total Paid Battles: <span style={{ fontSize: 11, fontWeight: 700 }}>5</span></MDTypography>
                        </Grid>

                    </Grid>
                </MDButton>

            </Grid>

            <Grid item xs={12} md={6} lg={3}>

                <MDButton
                    variant="contained"
                    color={"primary"}
                    size="small"
                    component={Link}
                    to={{
                        pathname: `/battledashboard/battletemplate`,
                    }}
                >
                    <Grid container xs={12} md={12} lg={12}>

                        <Grid item xs={12} md={12} lg={12} mt={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={15} style={{ color: "white", paddingLeft: 4, paddingRight: 4, fontWeight: 'bold' }}>Battle Templates</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={12} lg={12} mb={2} style={{ fontWeight: 1000 }} display="flex" alignContent="center" alignItems="center">
                            <MDBox display="flex" flexDirection="column">
                                <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{ color: "white", paddingLeft: 4, paddingRight: 4 }}>Create Battle Templates here!</MDTypography>
                            </MDBox>
                        </Grid>

                        <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={9} style={{ color: "white" }}>Total Free Battles: <span style={{ fontSize: 11, fontWeight: 700 }}>10</span></MDTypography>
                        </Grid>

                        <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                            <MDTypography fontSize={9} style={{ color: "white" }}>Total Paid Battles: <span style={{ fontSize: 11, fontWeight: 700 }}>5</span></MDTypography>
                        </Grid>

                    </Grid>
                </MDButton>

            </Grid>

        </Grid>

        <Grid style={{backgroundColor:'white',borderRadius:5}} container xs={12} md={12} lg={12} mt={1}>
            <Grid item xs={12} md={12} lg={12}>
                <MDBox p={1}>
                    { completedBattle && <BattleChart completedBattle={completedBattle}/>}
                </MDBox>
            </Grid>
        </Grid>

        <Grid style={{backgroundColor:'white',borderRadius:5}} container xs={12} md={12} lg={12} mt={1}>
            <Grid item xs={12} md={12} lg={12}>
                <MDBox p={0.5}>
                    { battleUsers && <BattleUsers battleUsers={battleUsers}/>}
                </MDBox>
            </Grid>
        </Grid>

    </MDBox>
  );
}