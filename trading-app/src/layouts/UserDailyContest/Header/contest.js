import { React, useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { userContext } from '../../../AuthContext';
import moment from 'moment'

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";
import tradesicon from '../../../assets/images/tradesicon.png'

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";

// Material Dashboard 2 React base styles

// Images
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import {InfinityTraderRole, tenxTrader} from "../../../variables";
import ContestCup from '../../../assets/images/candlestick-chart.png'
import ContestCarousel from '../../../assets/images/target.png'
import Timer from '../timer'
import ProgressBar from "../progressBar";
import { HiUserGroup } from 'react-icons/hi';

import { Divider } from "@mui/material";



function Header({ e }) {
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [contest, setContest] = useState([]);
    useEffect(()=>{
  
        axios.get(`${baseUrl}api/v1/dailycontest/contests/upcoming`,{
          withCredentials: true,
          headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true
          },
        })
        .then((res)=>{
            setContest(res.data.data);
          }).catch((err)=>{
            return new Error(err);
        })
        },[])
    
        console.log("contest", contest)

        function changeDateFormat(givenDate) {

            const date = new Date(givenDate);

            // Convert the date to IST
            date.setHours(date.getHours());
            date.setMinutes(date.getMinutes());

            // Format the date as "dd Month yyyy | hh:mm AM/PM"
            const formattedDate = `${date.getDate()} ${getMonthName(date.getMonth())} ${date.getFullYear()} | ${formatTime(date.getHours(), date.getMinutes())}`;

            console.log(formattedDate);

            // Helper function to get the month name
            function getMonthName(month) {
                const monthNames = [
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ];
                return monthNames[month];
            }

            // Helper function to format time as "hh:mm AM/PM"
            function formatTime(hours, minutes) {
                const meridiem = hours >= 12 ? "PM" : "AM";
                const formattedHours = hours % 12 || 12;
                const formattedMinutes = minutes.toString().padStart(2, "0");
                return `${formattedHours}:${formattedMinutes} ${meridiem}`;
            }

            return formattedDate;

        }

    return (
        <>
            <MDBox>
                <Grid container spacing={2} xs={12} md={12} lg={12}>
                    {
                        contest.map((elem) => {
                            let contestOn = [];
                            if(elem.isNifty){
                                contestOn.push("Nifty")
                            }
                            if(elem.isBankNifty){
                                contestOn.push("Bank Nifty")
                            }
                            if(elem.isFinNifty){
                                contestOn.push("Fin Nifty")
                            }

                            contestOn.push(elem.contestExpiry);
                            return (
                                <Grid item xs={12} md={12} lg={6} borderRadius={3}>

                                    <MDButton variant="contained" color="light" size="small">
                                        <Grid container display='flex' justifyContent='space-between' alignItems='center'>

                                            <Grid item xs={3} md={3} lg={3} display='flex' justifyContent='flex-start' alignItems='center'>
                                                <img src={ContestCarousel} width='40px' height='40px' />
                                            </Grid>
                                            <Grid item xs={9} md={9} lg={9} display='flex' justifyContent='flex-end' alignItems='center'>
                                                <MDBox display='flex' justifyContent='flex-start' flexDirection='column'>
                                                    <MDBox display='flex' justifyContent='flex-start' flexDirection='column'>
                                                        <MDBox display='flex' justifyContent='flex-start'><MDTypography fontSize={15} fontWeight='bold' color='dark'>{elem.contestName}</MDTypography></MDBox>
                                                    </MDBox>
                                                    <MDBox display='flex' justifyContent='flex-start' flexDirection='row' alignItems='center'>
                                                        <MDBox mr={1} display='flex' justifyContent='flex-start'><MDTypography fontSize={10} color='dark'>{changeDateFormat(elem.contestStartTime)}</MDTypography></MDBox>
                                                        {
                                                            contestOn.map((elem, index)=>{
                                                                return(
                                                                    <MDBox key={elem}>
                                                                        <MDBox mr={1} display='flex' justifyContent='flex-start' alignItems='center'><MDTypography fontSize={10} style={{ backgroundColor: (contestOn?.length - 1 === index) ? "#4169E1" : '#fb8c00', padding: '1px 1px 0px 1px', border: (contestOn?.length - 1 === index) ? "1px solid #4169E1" : '1px solid #fb8c00', borderRadius: '2px', alignItems: 'center' }} fontWeight='bold' color='light'>{elem}</MDTypography></MDBox>
                                                                    </MDBox>
                                                                )
                                                            })
                                                        }
                                                    </MDBox>
                                                </MDBox>
                                            </Grid>

                                            <Grid item mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                                                <MDBox display='flex' justifyContent='flex-start' flexDirection='column'>
                                                    <MDBox display='flex' justifyContent='flex-start' flexDirection='column'>
                                                        <MDBox display='flex' justifyContent='center'><MDTypography fontSize={15} fontWeight='bold' color='success'>Reward</MDTypography></MDBox>
                                                        <MDBox display='flex' justifyContent='center'><MDTypography fontSize={15} fontWeight='bold' color='dark'>{elem.payoutPercentage}% of the net P&L</MDTypography></MDBox>
                                                    </MDBox>
                                                </MDBox>
                                            </Grid>

                                            <Grid item mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                                                <MDBox display='flex' justifyContent='flex-start' flexDirection='column'>
                                                    <MDBox display='flex' justifyContent='flex-start' flexDirection='column'>
                                                        <Timer date={elem.contestEndTime} />
                                                    </MDBox>
                                                </MDBox>
                                            </Grid>

                                            <Grid item mt={1} xs={12} md={12} lg={12} display="flex" justifyContent="space-between" alignItems="center" alignContent="center">
                                                <MDBox color="light" fontSize={10} display="flex" justifyContent="center" alignItems='center'>
                                                    <MDBox color="dark"><MDTypography fontSize={10} style={{ backgroundColor: 'grey', padding: '2px 2px 1px 2px', border: '1px solid grey', borderRadius: '2px', alignItems: 'center' }} fontWeight='bold' color='light'>ENTRY FEE : FREE</MDTypography></MDBox>
                                                </MDBox>
                                                {/* <MDBox color="light" fontSize={10} display="flex" justifyContent="center" alignItems='center'>
                                                    <HiUserGroup color='black' /><MDBox color="dark" style={{ marginLeft: 2, marginTop: 3, fontWeight: 700 }}>3 SEATS UP FOR GRAB</MDBox>
                                                </MDBox> */}
                                                <MDBox color="light" fontSize={10} display="flex" justifyContent="center" alignItems='center'>
                                                    <MDBox color="dark"><MDTypography fontSize={10} style={{ backgroundColor: 'grey', padding: '2px 2px 1px 2px', border: '1px solid grey', borderRadius: '2px', alignItems: 'center' }} fontWeight='bold' color='light'>PORTFOLIO: {elem?.portfolio?.portfolioValue}</MDTypography></MDBox>
                                                </MDBox>
                                            </Grid>

                                            <Grid item mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                                                <MDBox display='flex' justifyContent='center' sx={{ width: '100%' }}>
                                                    <ProgressBar progress={30} />
                                                </MDBox>
                                            </Grid>

                                            <Grid item xs={12} md={12} lg={12} display="flex" mt={1} mb={1} justifyContent="space-between" alignItems="center" alignContent="center">
                                                <MDBox color="light" fontSize={10} display="flex" justifyContent="center" alignItems='center'>
                                                    <HiUserGroup color='black' /><MDBox color="dark" style={{ marginLeft: 2, marginTop: 3, fontWeight: 700 }}>50 PEOPLE HAVE SOON INTEREST IN THIS CONTEST</MDBox>
                                                </MDBox>
                                                {/* <MDBox color="light" fontSize={10} display="flex" justifyContent="center" alignItems='center'>
                                    <HiUserGroup color='black'/><MDBox color="dark" style={{marginLeft:2,marginTop:3,fontWeight:700}}>3 SEATS UP FOR GRAB</MDBox>
                                </MDBox> */}
                                            </Grid>

                                            <Grid item mb={1} xs={12} md={12} lg={12} display='flex' justifyContent='space-between' alignItems='center'>
                                                <MDBox display='flex' justifyContent='space-between' flexDirection='row' width='100%'>
                                                    <MDBox display='flex' justifyContent='flex-start' width='50%'>
                                                        <MDButton
                                                            variant='outlined'
                                                            color='info'
                                                            size='small'
                                                        >
                                                            <MDTypography color='info' fontWeight='bold' fontSize={10}>INTERESTED?</MDTypography>
                                                        </MDButton>
                                                    </MDBox>
                                                    <MDBox display='flex' justifyContent='flex-end' width='50%'>
                                                        <MDButton
                                                            variant='outlined'
                                                            color='warning'
                                                            size='small'
                                                            component={Link}
                                                            to={{
                                                                pathname: `/contest/alphaavengers`,
                                                            }}
                                                        // state= {{data:e}}
                                                        >
                                                            <MDTypography color='warning' fontWeight='bold' fontSize={10}>START TRADING</MDTypography>
                                                        </MDButton>
                                                    </MDBox>
                                                </MDBox>
                                            </Grid>


                                        </Grid>
                                    </MDButton>

                                </Grid>
                            )
                        })
                    }
                </Grid>
            </MDBox>
        </>



    );
}

export default Header;





// <Grid item xs={12} md={12} lg={6} borderRadius={3}>

// <MDButton variant="contained" color="light" size="small">
// <Grid container display='flex' justifyContent='space-between' alignItems='center'>
    
//     <Grid item xs={3} md={3} lg={3} display='flex' justifyContent='flex-start' alignItems='center'>
//         <img src={ContestCarousel} width='40px' height='40px'/>
//     </Grid>
//     <Grid item xs={9} md={9} lg={9} display='flex' justifyContent='flex-end' alignItems='center'>
//         <MDBox display='flex' justifyContent='flex-start' flexDirection='column'>
//             <MDBox display='flex' justifyContent='flex-start' flexDirection='column'>
//                 <MDBox display='flex' justifyContent='flex-start'><MDTypography fontSize={15} fontWeight='bold' color='dark'>Alpha Avengers{e}</MDTypography></MDBox>
//             </MDBox>
//             <MDBox display='flex' justifyContent='flex-start' flexDirection='row' alignItems='center'>
//                 <MDBox mr={1} display='flex' justifyContent='flex-start'><MDTypography fontSize={10} color='dark'>23 Jul 2023 | 9:30 AM</MDTypography></MDBox>
//                 <MDBox mr={1} display='flex' justifyContent='flex-start' alignItems='center'><MDTypography fontSize={10} style={{backgroundColor:'#fb8c00', padding: '1px 1px 0px 1px',border:'1px solid #fb8c00', borderRadius:'2px', alignItems:'center'}} fontWeight='bold' color='light'>NIFTY</MDTypography></MDBox>
//                 <MDBox mr={1} display='flex' justifyContent='flex-start' alignItems='center'><MDTypography fontSize={10} style={{backgroundColor:'#fb8c00', padding: '1px 1px 0px 1px',border:'1px solid #fb8c00', borderRadius:'2px', alignItems:'center'}} fontWeight='bold' color='light'>DAILY</MDTypography></MDBox>
//             </MDBox>
//         </MDBox>
//     </Grid>

//     <Grid item mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
//         <MDBox display='flex' justifyContent='flex-start' flexDirection='column'>
//             <MDBox display='flex' justifyContent='flex-start' flexDirection='column'>
//                 <MDBox display='flex' justifyContent='center'><MDTypography fontSize={15} fontWeight='bold' color='success'>Reward</MDTypography></MDBox>
//                 <MDBox display='flex' justifyContent='center'><MDTypography fontSize={15} fontWeight='bold' color='dark'>1% of the net P&L</MDTypography></MDBox>
//             </MDBox>
//         </MDBox>
//     </Grid>

//     <Grid item mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
//         <MDBox display='flex' justifyContent='flex-start' flexDirection='column'>
//             <MDBox display='flex' justifyContent='flex-start' flexDirection='column'>
//                 <Timer/>
//             </MDBox>
//         </MDBox>
//     </Grid>

//     <Grid item mt={1} xs={12} md={12} lg={12} display="flex" justifyContent="space-between" alignItems="center" alignContent="center">
//         <MDBox color="light" fontSize={10} display="flex" justifyContent="center" alignItems='center'>
//             <MDBox color="dark"><MDTypography fontSize={10} style={{backgroundColor:'grey', padding: '2px 2px 1px 2px',border:'1px solid grey', borderRadius:'2px', alignItems:'center'}} fontWeight='bold' color='light'>ENTRY FEE : FREE</MDTypography></MDBox>
//         </MDBox>
//         <MDBox color="light" fontSize={10} display="flex" justifyContent="center" alignItems='center'>
//             <HiUserGroup color='black'/><MDBox color="dark" style={{marginLeft:2,marginTop:3,fontWeight:700}}>3 SEATS UP FOR GRAB</MDBox>
//         </MDBox>
//         <MDBox color="light" fontSize={10} display="flex" justifyContent="center" alignItems='center'>
//             <MDBox color="dark"><MDTypography fontSize={10} style={{backgroundColor:'grey', padding: '2px 2px 1px 2px',border:'1px solid grey', borderRadius:'2px', alignItems:'center'}} fontWeight='bold' color='light'>MARGIN: 1,000,000</MDTypography></MDBox>
//         </MDBox>
//     </Grid>

//     <Grid item mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
//         <MDBox display='flex' justifyContent='center' sx={{width:'100%'}}>    
//                 <ProgressBar progress={30}/>          
//         </MDBox>
//     </Grid>

//     <Grid item xs={12} md={12} lg={12} display="flex" mt={1} mb={1} justifyContent="space-between" alignItems="center" alignContent="center">
//         {/* <MDBox color="light" fontSize={10} display="flex" justifyContent="center" alignItems='center'>
//             <HiUserGroup color='black'/><MDBox color="dark" style={{marginLeft:2,marginTop:3,fontWeight:700}}>50 PEOPLE HAVE SOON INTEREST IN THIS CONTEST</MDBox>
//         </MDBox> */}
//         <MDBox color="light" fontSize={10} display="flex" justifyContent="center" alignItems='center'>
//             <HiUserGroup color='black'/><MDBox color="dark" style={{marginLeft:2,marginTop:3,fontWeight:700}}>3 SEATS UP FOR GRAB</MDBox>
//         </MDBox>
//     </Grid>

//     <Grid item mb={1} xs={12} md={12} lg={12} display='flex' justifyContent='space-between' alignItems='center'>
//         <MDBox display='flex' justifyContent='space-between' flexDirection='row' width='100%'>
//             <MDBox display='flex' justifyContent='flex-start' width='50%'>
//                 <MDButton variant='outlined' color='info' size='small'><MDTypography color='info' fontWeight='bold' fontSize={10}>INTERESTED?</MDTypography></MDButton>
//             </MDBox>
//             <MDBox display='flex' justifyContent='flex-end' width='50%'>
//                 <MDButton variant='outlined' color='warning' size='small'><MDTypography color='warning' fontWeight='bold' fontSize={10}>START TRADING</MDTypography></MDButton>
//             </MDBox>
//         </MDBox>
//     </Grid>
    

// </Grid>
// </MDButton>

// </Grid>