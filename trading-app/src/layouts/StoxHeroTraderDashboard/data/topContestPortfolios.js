import React from "react";
import axios from "axios";
import { useEffect, useState, useContext, useRef, useReducer } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import MDButton from "../../../components/MDButton";
import MDAvatar from "../../../components/MDAvatar";
import stock from "../../../assets/images/analyticspnl.png";
import logo from "../../../assets/images/logo1.png";
import { useNavigate } from 'react-router-dom';
import { Link, useLocation } from "react-router-dom";

function Summary({topPerformer, startOfWeek, endOfWeek}) {
    const navigate = useNavigate();
    function TruncatedName(name) {
        const originalName = name;
        const convertedName = originalName
          .toLowerCase() // Convert the entire name to lowercase
          .split(' ') // Split the name into words
          .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
          .join(' '); // Join the words back together with a space
      
        // Trim the name to a maximum of 30 characters
        const truncatedName = convertedName.length > 30 ? convertedName.substring(0, 30) + '...' : convertedName;
      
        return truncatedName;
      }

      function formattedDate(date) {

        const formattedDate = new Date(date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
          });
      
        return formattedDate;
      }

  return (
    <MDBox bgColor="light" minHeight='auto'>
        <Grid container display='flex' justifyContent='center' alignItems='center'>
            <Grid item xs={12} md={12} lg={12}>
                <Grid container xs={12} md={12} lg={12} mt={.5} mb={.5} display='flex' alignItems='center'>
                    <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='flex-start'>
                        <MDTypography ml={1} fontSize={15} fontWeight="bold">TestZone Leaderboard of the Week [{formattedDate(startOfWeek)} - {formattedDate(endOfWeek)}]</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='flex-end'>
                        <MDButton variant='text' color='dark' size="small" onClick={()=>{navigate('/toptestzoneportfolios')}}>View All</MDButton>
                    </Grid>
                </Grid>
                    <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                        
                        {topPerformer?.map((e,index)=>{
                            return (
                            <Grid item xs={6} md={4} lg={2}>
                            <Card sx={{ minWidth: '100%' }}>
                            <CardContent>
                                <MDAvatar
                                    src={e?.profile_picture ? e?.profile_picture?.url : logo}
                                    alt={"Stock"}
                                    size="lg"
                                    // padding="10px"
                                    // sx={({ borders: { borderWidth }, palette: { white } }) => ({
                                    // border: `${borderWidth[2]} solid ${white.main}`,
                                    // cursor: "pointer",
                                    // position: "relative",
                                    // ml: -1,
                                   
                                    // "&:hover, &:focus": {
                                    //     zIndex: "10",
                                    // },
                                    // })}
                                    sx={{padding: "15px",
                                    cursor: "pointer",
                                        position: "relative",
                                        ml: -1,
                                        "&:hover, &:focus": {
                                            zIndex: "10",
                                        },
                                
                                }}
                                />
                                <MDTypography fontSize={15} fontWeight='bold'>
                                    #{index +1} {TruncatedName(e?.first_name)}
                                </MDTypography>

                                <MDTypography mt={1} fontSize={12}>
                                    Zones Played: {e?.contests}
                                </MDTypography>

                                <MDTypography mt={1} fontSize={12}>
                                    Zones Won: {e?.contestsWon}
                                </MDTypography>

                                <MDTypography mt={1} fontSize={12}>
                                    StrikeRate: {(e?.strikeRate).toFixed(0)}%
                                </MDTypography>

                                <MDTypography mt={1} mb={-3} fontSize={12}>
                                    Earnings: ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(e?.totalPayout)}
                                </MDTypography>

                            </CardContent>
                            <CardActions>
                                <MDButton 
                                    size="small"
                                    component = {Link}
                                    to={{
                                        pathname: `/testzoneprofile/${e?.userid}`,
                                      }}
                                    state={{data: e}}
                                >
                                    Zone Profile
                                </MDButton>
                            </CardActions>
                            </Card>
                            </Grid>
                            )
                        })}
                       
                    </Grid>
            </Grid>
        </Grid>
    </MDBox>
)
}

export default Summary;
