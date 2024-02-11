import { React, useState, useEffect, useContext } from "react";
import { userContext } from '../../../AuthContext';
import { useNavigate, useLocation, Link } from "react-router-dom";
import ShareIcon from '@mui/icons-material/Share';
import ReactGA from "react-ga"
import Modal from 'react-modal';
import leaderboardbackground from '../../../assets/images/leaderboardbackground.png'
import DefaultProfilePic from "../../../assets/images/logo1.jpeg";
import Rank1 from "../../../assets/images/r1.png";
import Rank2 from "../../../assets/images/r2.png";
import Rank3 from "../../../assets/images/r3.png";
import { CircularProgress } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDAvatar from "../../../components/MDAvatar";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import { Divider, Grid } from '@mui/material';
import axios from "axios"; 

function Header() {
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
    const navigate = useNavigate();
    const [isLoading,setIsLoading] = useState(true)
    const [contest,setContest] = useState([])
    const [contestLeaderboard,setContestLeaderboard] = useState([]);
    const [restContestLeaderboard,setRestContestLeaderboard] = useState([]);
    const location = useLocation();
    let id = location?.state?.data;

    useEffect(() => {
        ReactGA.pageview(window.location.pathname)
    }, []);

    useEffect(()=>{
        let call1 = axios.get(`${baseUrl}api/v1/dailycontest/contest/${id}`, {
          withCredentials:true
        })   
        let call2 = axios.get(`${baseUrl}api/v1/dailycontest/contestleaderboard/${id}`, {
          withCredentials:true
        })            
        Promise.all([call1,call2])
        .then(([api1Response,api2Response]) => {
          // Process the responses here
          setContest(api1Response?.data?.data)
          setContestLeaderboard(api2Response?.data?.data);
          setRestContestLeaderboard(api2Response?.data?.data.slice(3))
          setTimeout(()=>{
            setIsLoading(false)
          },500)
        })
        .catch((error) => {
          // Handle errors here
          console.error(error);
        });
      },[])

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

      function Badge(rank) {
        let badge = ''
        if(rank === 1)
        {
          badge = 'TestZones Hero'
        }
        if(rank === 2)
        {
          badge = 'TestZones Guru'
        } 
        if(rank === 3)
        {
          badge = 'TestZones Wizard'
        } 
        if(rank >= 4 && rank <= 6)
        {
          badge = 'TestZones Runners'
        } 
        if(rank >= 7 && rank <= 10)
        {
          badge = 'TestZones Rising Star'
        }
        if(rank >= 11 && rank <= 20)
        {
          badge = 'TestZones Mastero'
        }
        if(rank >= 21)
        {
          badge = 'No Badge'
        } 
         
        return badge;
      }


    return (
      <>
      {isLoading ?
        <MDBox mt={10} mb={10} display="flex" width="100%" justifyContent="center" alignItems="center">
            <CircularProgress color='info' />
        </MDBox>
      :
      <MDBox
        style={{
        backgroundImage: `url(${leaderboardbackground})`, // Replace 'your-image-url.jpg' with the URL of your image
        backgroundSize: 'cover', // Adjust the size to cover the entire box
        backgroundRepeat: 'no-repeat', // Prevent the image from repeating
        backgroundPosition: 'center', // Center the image
        height: 'auto', 
        width: '100%', 
        borderRadius: 5,
        }}
        mt={1}
        display='flex' justifyContent='center'
      >
      <Grid container spacing={0.5} xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
            <Grid item xs={12} md={12} lg={12} ml={1} mt={1} display='flex' justifyContent='flex-start' style={{width:'100%'}}>
              <MDButton 
                variant='outlined'
                color='warning'
                size='small'
                m={1}
                component={Link}
                to={{
                    pathname: `${contest?.contestFor === 'StoxHero' ? '/testzone' : '/collegetestzone'}`,
                }}
              >
                <MDTypography color='warning' fontWeight='bold' fontSize={10}>Back to TestZones</MDTypography>
              </MDButton>
            </Grid>
            <Grid item xs={12} md={12} lg={12} mb={1} display='flex' justifyContent='center' style={{width:'100%'}}>
              <MDTypography fontSize={25} color='light' fontWeight='bold'>StoxHero : {contest?.contestName} TestZone Leaderboard</MDTypography>
            </Grid>
            
            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
              <MDBox style={{width:'100%'}}>
                  <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                      
                      <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center' style={{width:'100%'}}>
                          <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                              <MDAvatar src={Rank1} alt="profile-image" size="xxl" />
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                              <MDTypography color='light' fontWeight='bold' fontSize={20}>{TruncatedName(contestLeaderboard[0]?.first_name + ' ' + contestLeaderboard[0]?.last_name)}</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                              <MDTypography color='light' fontWeight='bold' fontSize={15}>Badge: {Badge(contestLeaderboard[0]?.rank)}</MDTypography>
                            </Grid>
                            <MDTypography color='light' fontWeight='bold' fontSize={12}>
                                Earnings: ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(contestLeaderboard[0]?.payout)}
                            </MDTypography>
                          </Grid>
                      </Grid>

                      <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center' style={{width:'100%'}}>
                          <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                              <MDAvatar src={Rank2} alt="profile-image" size="xxl" />
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                              <MDTypography color='light' fontWeight='bold' fontSize={20}>{TruncatedName(contestLeaderboard[1]?.first_name + ' ' + contestLeaderboard[1]?.last_name)}</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                              <MDTypography color='light' fontWeight='bold' fontSize={15}>Badge: {Badge(contestLeaderboard[1]?.rank)}</MDTypography>
                            </Grid>
                            <MDTypography color='light' fontWeight='bold' fontSize={12}>
                                Earnings: ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(contestLeaderboard[1]?.payout)}
                              </MDTypography>
                          </Grid>
                      </Grid>

                      <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center' style={{width:'100%'}}>
                          <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                              <MDAvatar src={Rank3} alt="profile-image" size="xxl" />
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                              <MDTypography color='light' fontWeight='bold' fontSize={20}>{TruncatedName(contestLeaderboard[2]?.first_name + ' ' + contestLeaderboard[2]?.last_name)}</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                              <MDTypography color='light' fontWeight='bold' fontSize={15}>Badge: {Badge(contestLeaderboard[2]?.rank)}</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                              <MDTypography color='light' fontWeight='bold' fontSize={12}>
                                Earnings: ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(contestLeaderboard[2]?.payout)}
                              </MDTypography>
                            </Grid>
                          </Grid>
                      </Grid> 

                  </Grid>

                  <Divider style={{backgroundColor:'white'}} orientation="horizontal"/>
                  
                  <Grid container mt={1} mb={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                      <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
                          <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
                            <Grid item xs={12} md={12} lg={2} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
                              <MDTypography color='light' fontWeight='bold' fontSize={15}>Rank</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={2} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
                              <MDTypography color='light' fontWeight='bold' fontSize={15}>Photo</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
                              <MDTypography color='light' fontWeight='bold' fontSize={15}>Trader</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={2} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
                              <MDTypography color='light' fontWeight='bold' fontSize={15}>Badge</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={2} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
                              <MDTypography color='light' fontWeight='bold' fontSize={15}>Earnings</MDTypography>
                            </Grid>
                          </Grid>
                      </Grid>
                  </Grid> 

                  {restContestLeaderboard?.map((e, index)=>{
                    
                    return(
                    <>
                    <Divider style={{backgroundColor:'white'}} orientation="horizontal"/>
                    
                    <Grid container mt={1} mb={2} xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                        
                        <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
                            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
                              <Grid item xs={12} md={12} lg={2} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
                                <MDTypography color='light' fontSize={15}>{e?.rank}</MDTypography>
                              </Grid>
                              <Grid item xs={12} md={12} lg={2} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
                                <MDAvatar src={e?.profilePic ? e?.profilePic : DefaultProfilePic} alt="profile-image" size="xs" />
                              </Grid>
                              <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
                                <MDTypography color='light' fontSize={15}>{TruncatedName(e?.first_name + ' ' + e?.last_name)}</MDTypography>
                              </Grid>
                              <Grid item xs={12} md={12} lg={2} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
                                <MDTypography color='light' fontSize={15}>{Badge(e?.rank)}</MDTypography>
                              </Grid>
                              <Grid item xs={12} md={12} lg={2} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
                                <MDTypography color='light' fontSize={15}>
                                  ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(e?.payout)}
                                </MDTypography>
                              </Grid>
                            </Grid>
                        </Grid>
                    </Grid> 
                    </>
                    )
                 
                  })  
                  } 

                  <Grid container p={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', border:'0.25px solid lightgrey'}}>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                      <MDTypography color='light' fontWeight='bold' fontSize={12}>Badge Assignment</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                      <MDTypography color='light' fontSize={12}>TestZones Hero : Rank 1</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                      <MDTypography color='light' fontSize={12}>TestZones Guru : Rank 2</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                      <MDTypography color='light' fontSize={12}>TestZones Wizard : Rank 3</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                      <MDTypography color='light' fontSize={12}>TestZones Runners : Rank 4 to Rank 6</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                      <MDTypography color='light' fontSize={12}>TestZones Rising Stars : Rank 7 to Rank 10</MDTypography>
                    </Grid>
                  </Grid>

                  
              </MDBox>
              
            </Grid>
      </Grid>
      </MDBox>
      }
      </>
    );
}

export default Header;