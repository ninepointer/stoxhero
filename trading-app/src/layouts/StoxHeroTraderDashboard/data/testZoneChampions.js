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
import logo from "../../../assets/images/logo1.jpeg";
import { useNavigate } from 'react-router-dom';
import { Link, useLocation } from "react-router-dom";
import { useMediaQuery, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      justifyContent: (props) =>
        props.lg ? 'flex-start' : props.md ? 'center' : 'center',
      // Add other styling properties as needed
    },
  }));

function Summary({lastPaidContests, lastContestDate}) {
    console.log(lastPaidContests)
    const navigate = useNavigate();
    function TruncatedName(name) {
        const originalName = name;
        const convertedName = originalName
          .toLowerCase() // Convert the entire name to lowercase
          .split(' ') // Split the name into words
          .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
          .join(' '); // Join the words back together with a space
      
        // Trim the name to a maximum of 30 characters
        const truncatedName = convertedName.length > 20 ? convertedName.substring(0, 20) + '...' : convertedName;
      
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
                <Grid container xs={12} md={12} lg={12} display='flex' alignItems='center'>
                    <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='flex-start'>
                        <MDTypography ml={1} mb={1} fontSize={15} fontWeight="bold">TestZone Champions [{formattedDate(lastContestDate)}]</MDTypography>
                    </Grid>
                    {/* <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='flex-end'>
                        <MDButton variant='text' color='dark' size="small" onClick={()=>{navigate('/toptestzoneportfolios')}}>View All</MDButton>
                    </Grid> */}
                </Grid>
                    <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                        
                        {lastPaidContests?.map((e, index)=>{
                            return (
                            <Grid item xs={12} md={6} lg={3}>
                            <Card style={{backgroundColor:'#65BA0D'}} sx={{ minWidth: '100%' }}>
                            <CardContent>
                            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                                <MDTypography color='light' fontSize={15} fontWeight='bold'>
                                    {e?.contestName}
                                </MDTypography>
                                </Grid>
                            </Grid>

                                {e?.topParticipants?.map((participant, index)=>{

                                    return(
                                        
                                    <Grid container xs={12} md={12} lg={12} mt={2} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                                        <Grid item xs={2} md={2} lg={2} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                                            <MDTypography color='light' mt={1} fontSize={12}>
                                                {participant?.rank}
                                            </MDTypography>
                                        </Grid>
                                        <Grid item xs={2} md={2} lg={2} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                                            <MDAvatar
                                                src={participant?.profilePhoto ? participant?.profilePhoto?.url : logo}
                                                alt={"Stock"}
                                                size="xs"
                                                sx={({ borders: { borderWidth }, palette: { white } }) => ({
                                                border: `${borderWidth[2]} solid ${white.main}`,
                                                cursor: "pointer",
                                                position: "relative",
                                                mt: 0.5,
                                                "&:hover, &:focus": {
                                                    zIndex: "10",
                                                },
                                                })}
                                            />
                                        </Grid>
                                        <Grid item xs={5} md={5} lg={5} display='flex' justifyContent={'center'} alignItems='center' alignContent='center'>
                                            <MDTypography color='light' mt={1} fontSize={12}>
                                                {TruncatedName(participant?.first_name)}
                                            </MDTypography>
                                        </Grid>
                                        <Grid item xs={3} md={3} lg={3} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                                            <MDTypography color='light' mt={1} fontSize={12}>
                                            ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(participant?.payout + participant?.tds)}
                                            </MDTypography>
                                        </Grid>
                                    </Grid>
                                    )
                                })}

                            </CardContent>
                            <CardActions>
                                <Grid container xs={12} md={12} lg={12} mt={-2} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                                        <MDButton 
                                            size="small"
                                            variant='text'
                                            // component = {Link}
                                            // to={{
                                            //     pathname: `/testzoneprofile/${e?.userid}`,
                                            // }}
                                            // state={{data: e}}
                                        >
                                            Full Leaderboard
                                        </MDButton>
                                    </Grid>
                                </Grid>
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
