import {useState, useEffect, useContext} from 'react';
import axios from "axios";
import MDBox from '../../../components/MDBox';
import Grid from "@mui/material/Grid";
import { userContext } from '../../../AuthContext';
import MDTypography from '../../../components/MDTypography';
import { Paper } from '@mui/material';

//icons
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

//data



export default function Dashboard() {
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
  let [dailyActiveUsersPlatform,setDailyActiveUsersPlatform] = useState([])
  let [monthlyActiveUsersPlatform,setMonthlyActiveUsersPlatform] = useState([])
  let [dailyActiveUsers,setDailyActiveUsers] = useState([])
  let [monthlyActiveUsers,setMonthlyActiveUsers] = useState([])
  let [weeklyActiveUsers,setWeeklyActiveUsers] = useState([])
  const getDetails = useContext(userContext);
  const userId = getDetails.userDetails._id
  
  useEffect(()=>{
    let call1 = axios.get((`${baseUrl}api/v1/stoxherouserdashboard/dailyactiveusers`),{
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                  },
                })
    let call2 = axios.get((`${baseUrl}api/v1/stoxherouserdashboard/monthlyactiveusers`),{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
            },
        })
    let call3 = axios.get((`${baseUrl}api/v1/stoxherouserdashboard/weeklyactiveusers`),{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
            },
        })
    let call4 = axios.get((`${baseUrl}api/v1/stoxherouserdashboard/dailyactiveusersonplatform`),{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
            },
        })
    let call5 = axios.get((`${baseUrl}api/v1/stoxherouserdashboard/monthlyactiveusersonplatform`),{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
            },
        })
    Promise.all([call1, call2, call3, call4, call5])
    .then(([api1Response, api1Response1, api1Response2, api1Response3, api1Response4]) => {
      console.log("Daily Active Users: ",api1Response.data.data)
      console.log("Monthly Active Users: ",api1Response1.data.data)
      console.log("Weekly Active Users: ",api1Response2.data.data)
      console.log("Daily Active Users Platofrm: ",api1Response3.data)
      console.log("Monthly Active Users Platofrm: ",api1Response4.data)
      setDailyActiveUsers(api1Response.data.data)
      setMonthlyActiveUsers(api1Response1.data.data)
      setWeeklyActiveUsers(api1Response2.data.data)
      setDailyActiveUsersPlatform(api1Response3.data.data)
      setMonthlyActiveUsersPlatform(api1Response4.data.data)
    })
    .catch((error) => {
      // Handle errors here
      console.error(error);
    });
    
  },[])


  return (
   
          <Grid container spacing={.5} p={0.5} lg={12} display='flex' justifyContent='center' alignItems='center'>
                
                <Grid item xs={12} md={4} lg={2}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Unique Heroes(L/T)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                                10/20
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color='error' fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>10%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><ArrowDownwardIcon alignItems='center'/></span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from yesterday</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Contest Heroes(L/T)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                                15/30
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>10%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><ArrowUpwardIcon alignItems='center'/></span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from yesterday</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                TenX Heroes(L/T)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                                5/12
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>10%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><ArrowUpwardIcon alignItems='center'/></span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from yesterday</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Virtual Heroes(L/T)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                                20/34
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>10%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><ArrowUpwardIcon alignItems='center'/></span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from yesterday</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Internship Heroes(L/T)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                                15/16
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>10%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><ArrowUpwardIcon alignItems='center'/></span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from yesterday</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Referrals
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                                10
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color='error' fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>10%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><ArrowDownwardIcon alignItems='center'/></span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from yesterday</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Total Trades
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                                10,000
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color='error' fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>10%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><ArrowDownwardIcon alignItems='center'/></span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from yesterday</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Contest Trades
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                                10,000
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color='error' fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>10%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><ArrowDownwardIcon alignItems='center'/></span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from yesterday</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                TenX Trades
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                                10,000
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color='error' fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>10%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><ArrowDownwardIcon alignItems='center'/></span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from yesterday</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Virtual Trades
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                                10,000
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color='error' fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>10%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><ArrowDownwardIcon alignItems='center'/></span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from yesterday</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Internship Trades
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                                10,000
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color='error' fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>10%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><ArrowDownwardIcon alignItems='center'/></span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from yesterday</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Referral Heros
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                                10
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color='error' fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>10%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><ArrowDownwardIcon alignItems='center'/></span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from yesterday</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={3}>
                    <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                        <MDTypography minWidth='65%' fontSize={13} fontWeight="bold">Total Open Lots</MDTypography>
                        <MDTypography minWidth='35%' fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>0</MDTypography>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={3}>
                    <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                        <MDTypography minWidth='65%' fontSize={13} fontWeight="bold">Contest Open Lots</MDTypography>
                        <MDTypography minWidth='35%' fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>0</MDTypography>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={3}>
                    <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                        <MDTypography minWidth='65%' fontSize={13} fontWeight="bold">TenX Open Lots</MDTypography>
                        <MDTypography minWidth='35%' fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>0</MDTypography>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={3}>
                    <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                        <MDTypography minWidth='65%' fontSize={13} fontWeight="bold">Virtual Open Lots</MDTypography>
                        <MDTypography minWidth='35%' fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>0</MDTypography>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={3}>
                    <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                        <MDTypography minWidth='65%' fontSize={13} fontWeight="bold">Total GP&L(C)</MDTypography>
                        <MDTypography minWidth='35%' fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>+₹10,000,00</MDTypography>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={3}>
                    <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                        <MDTypography minWidth='65%' fontSize={13} fontWeight="bold">Contest GP&L(C)</MDTypography>
                        <MDTypography minWidth='35%' fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>0</MDTypography>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={3}>
                    <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                        <MDTypography minWidth='65%' fontSize={13} fontWeight="bold">TenX GP&L(C)</MDTypography>
                        <MDTypography minWidth='35%' fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>0</MDTypography>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={3}>
                    <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                        <MDTypography minWidth='65%' fontSize={13} fontWeight="bold">Virtual GP&L(C)</MDTypography>
                        <MDTypography minWidth='35%' fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>0</MDTypography>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={3}>
                    <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                        <MDTypography minWidth='65%' fontSize={13} fontWeight="bold">Total NP&L(C)</MDTypography>
                        <MDTypography minWidth='35%' fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>NA</MDTypography>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={3}>
                    <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                        <MDTypography minWidth='65%' fontSize={13} fontWeight="bold">Contest NP&L(C)</MDTypography>
                        <MDTypography minWidth='35%' fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>0</MDTypography>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={3}>
                    <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                        <MDTypography minWidth='65%' fontSize={13} fontWeight="bold">TenX NP&L(C)</MDTypography>
                        <MDTypography minWidth='35%' fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>0</MDTypography>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={3}>
                    <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                        <MDTypography minWidth='65%' fontSize={13} fontWeight="bold">Virtual NP&L(C)</MDTypography>
                        <MDTypography minWidth='35%' fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>0</MDTypography>
                    </MDBox>
                </Grid>
          </Grid>
  );
}