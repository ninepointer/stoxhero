import React from "react";
import axios from "axios";
import { useEffect, useState, useContext, useRef, useReducer } from "react";
import { useLocation } from "react-router-dom";
import Grid from "@mui/material/Grid";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import MDButton from "../../../components/MDButton";
import MDAvatar from "../../../components/MDAvatar";
import logo from "../../../assets/images/logo1.png";
import { useNavigate } from 'react-router-dom';

function Summary({contestProfile, dataLength}) {
    
    const navigate = useNavigate();
    function TruncatedName(name) {
        const originalName = name;
        const convertedName = originalName
          ?.toLowerCase() // Convert the entire name to lowercase
          ?.split(' ') // Split the name into words
          ?.map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
          ?.join(' '); // Join the words back together with a space
      
        // Trim the name to a maximum of 30 characters
        const truncatedName = convertedName?.length > 30 ? convertedName?.substring(0, 30) + '...' : convertedName;
      
        return truncatedName;
      }

      function formattedDate(date) {

        const formattedDate = new Date(date)?.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: '2-digit'
          });
      
        return formattedDate;
      }

      let contestPlayed = dataLength;
      let contestsWon = contestProfile?.filter(contest => contest?.finalPayout > 0);
      let earnings = contestsWon.reduce((total, acc) => {
        return total + acc.finalPayout;
        }, 0)
      let strikeRate = ((contestsWon?.length/contestPlayed)*100)?.toFixed(0)

  return (
    <MDBox bgColor="light" minHeight='auto'>
        <Grid container display='flex' justifyContent='center' alignItems='center'>
            <Grid item xs={12} md={12} lg={12}>
                <Grid container xs={12} md={12} lg={12} display='flex' alignItems='center'>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                        <MDAvatar
                            src={contestProfile[0]?.profile_picture ? contestProfile[0]?.profile_picture?.url : logo}
                            alt={"Stock"}
                            size="lg"
                            sx={({ borders: { borderWidth }, palette: { white } }) => ({
                            border: `${borderWidth[2]} solid ${white.main}`,
                            cursor: "pointer",
                            position: "relative",
                            ml: 0,
                            "&:hover, &:focus": {
                                zIndex: "10",
                            },
                            })}
                        />
                    </Grid>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                        <MDTypography ml={1} fontSize={15} fontWeight="bold">{TruncatedName(contestProfile[0]?.first_name)} {TruncatedName(contestProfile[0]?.last_name)}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                        <MDTypography ml={1} fontSize={15} fontWeight="bold">@{contestProfile[0]?.userid}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                        <MDTypography ml={1} fontSize={15} fontWeight="bold">Member Since : {formattedDate(contestProfile[0]?.joining_date)}</MDTypography>
                    </Grid>

                </Grid>

                <Grid container mt={1} spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                        <Grid item xs={12} md={12} lg={12}>
                        <Card style={{backgroundColor:'#65BA0D',color:'white'}} sx={{backgroundColor:'primary', minWidth: '100%', padding:1 }}>
                
                            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                            
                            <Grid item xs={12} md={12} lg={3} display='flex' justifyContent='center'>
                            <MDTypography color='light' fontSize={15} fontWeight='bold'>
                                Zones Played 
                            </MDTypography>
                            </Grid>

                            <Grid item xs={12} md={12} lg={3} display='flex' justifyContent='center'>
                            <MDTypography color='light' fontSize={15} fontWeight='bold'>
                                Zones Won 
                            </MDTypography>
                            </Grid>

                            <Grid item xs={12} md={12} lg={3} display='flex' justifyContent='center'>
                            <MDTypography color='light' fontSize={15} fontWeight='bold'>
                                Earnings 
                            </MDTypography>
                            </Grid>

                            <Grid item xs={12} md={12} lg={3} display='flex' justifyContent='center'>
                            <MDTypography color='light' fontSize={15} fontWeight='bold'>
                                StrikeRate 
                            </MDTypography>
                            </Grid>

                            </Grid>

                            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                            
                            <Grid item xs={12} md={12} lg={3} display='flex' justifyContent='center'>
                            <MDTypography color='light' mt={1} fontSize={12} fontWeight='bold'>
                                {contestPlayed}
                            </MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={3} display='flex' justifyContent='center'>
                            <MDTypography color='light' mt={1} fontSize={12} fontWeight='bold'>
                                {contestsWon?.length}
                            </MDTypography>
                            </Grid>
                        
                            <Grid item xs={12} md={12} lg={3} display='flex' justifyContent='center'>
                            <MDTypography color='light' mt={1} fontSize={12} fontWeight='bold'>
                                ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(earnings)}
                            </MDTypography>
                            </Grid>

                            <Grid item xs={12} md={12} lg={3} display='flex' justifyContent='center'>
                            <MDTypography color='light' mt={1} fontSize={12} fontWeight='bold'>
                                {strikeRate}%
                            </MDTypography>
                            </Grid>
                            </Grid>

                        </Card>
                        </Grid>
                </Grid>

                <Grid container mt={0.5} spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                    <Grid item xs={12} md={12} lg={12}>
                        <Card style={{backgroundColor:'#315c45',color:'white'}} sx={{backgroundColor:'primary', minWidth: '100%', padding:1 }}>
                            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                            
                                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                                <MDTypography color='light' fontSize={15} fontWeight='bold'>
                                {contestProfile[0]?.first_name} {contestProfile[0]?.last_name}'s Recent TestZone Performance 
                                </MDTypography>
                                </Grid>

                            </Grid>
                        </Card>
                    </Grid>
                </Grid>

                <Grid container mt={0.5} spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                    
                    {contestProfile?.map((e,index)=>{
                        return (
                        <Grid item xs={12} md={12} lg={12}>
                        <Card sx={{ minWidth: '100%' }}>
                        <CardContent>
                            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='flex-start'>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start'>
                            <MDTypography style={{color:'#315c45'}} fontSize={15} fontWeight='bold'>
                                #{dataLength - index} {(e?.contestName)}
                            </MDTypography>
                            </Grid>
                            </Grid>

                            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                            <Grid item xs={12} md={12} lg={2.4} display='flex' justifyContent='center'>
                            <MDTypography mt={1} fontSize={12}>
                                Rank: #{e?.rank}
                            </MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={2.4} display='flex' justifyContent='center'>
                            <MDTypography mt={1} fontSize={12}>
                                Date: {formattedDate(e?.contestStartTime)}
                            </MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={2.4} display='flex' justifyContent='center'>
                            <MDTypography mt={1} fontSize={12}>
                                Earnings: ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(e?.finalPayout)}
                            </MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={2.4} display='flex' justifyContent='center'>
                            <MDTypography mt={1} fontSize={12}>
                                Entry Fee: ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(e?.entryFee)}
                            </MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={2.4} display='flex' justifyContent='center'>
                            <MDTypography mt={1} fontSize={12}>
                                Type: {e?.contestFor}
                            </MDTypography>
                            </Grid>
                            </Grid>

                        </CardContent>
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
