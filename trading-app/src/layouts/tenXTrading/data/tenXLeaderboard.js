import { React, useState, useEffect, useContext } from "react";
import { userContext } from '../../../AuthContext';
import { useNavigate, useLocation } from "react-router-dom";
import ShareIcon from '@mui/icons-material/Share';
import ReactGA from "react-ga"
import Modal from 'react-modal';
import leaderboardbackground from '../../../assets/images/leaderboardbackground.png'
import DefaultProfilePic from "../../../assets/images/logo1.png";
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
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const navigate = useNavigate();
    const [isLoading,setIsLoading] = useState(true)
    const [tenXLeaderboard,setTenXLeaderboard] = useState([]);
    const [restTenXLeaderboard,setRestTenXLeaderboard] = useState([]);

    useEffect(() => {
        ReactGA.pageview(window.location.pathname)
    }, []);

    useEffect(()=>{
        let call2 = axios.get(`${baseUrl}api/v1/tenX/tenxleaderboard`, {
          withCredentials:true
        })            
        Promise.all([call2])
        .then(([api2Response]) => {
          // Process the responses here
          setTenXLeaderboard(api2Response?.data?.data);
          setRestTenXLeaderboard(api2Response?.data?.data.slice(3))
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

      function Badge(strikeRate) {
        let badge = '';
        const strikeRatePercetage = strikeRate*100;
        if(strikeRatePercetage >= 80)
        {
          badge = 'TenX Titan'
        }
        if(strikeRatePercetage >= 60 && strikeRatePercetage < 80)
        {
          badge = 'TenX Wizard'
        } 
        if(strikeRatePercetage >= 40 && strikeRatePercetage < 60)
        {
          badge = 'TenX Maestro'
        } 
        if(strikeRatePercetage >= 20 && strikeRatePercetage < 40)
        {
          badge = 'TenX Rising'
        } 
        if( strikeRatePercetage < 20)
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
        display='flex' justifyContent='center'
      >
      <Grid container spacing={0.5} xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
            <Grid item xs={12} md={12} lg={12} mb={1} mt={1} display='flex' justifyContent='center' style={{width:'100%'}}>
              <MDTypography fontSize={25} color='light' fontWeight='bold'>StoxHero : TenX Earnings Leaderboard</MDTypography>
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
                              <MDTypography color='light' fontWeight='bold' fontSize={20}>{TruncatedName(tenXLeaderboard[0]?.first_name + ' ' + tenXLeaderboard[0]?.last_name)}</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                              <MDTypography color='light' fontWeight='bold' fontSize={15}>Badge: {Badge(tenXLeaderboard[0]?.strikeRate)}</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                              <MDTypography color='light' fontWeight='bold' fontSize={12}>Subscriptions(Total): {tenXLeaderboard[0]?.subscriptions}</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                              <MDTypography color='light' fontWeight='bold' fontSize={12}>Subscriptions(Wins): {tenXLeaderboard[0]?.subscriptionsWithPayout}</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                              <MDTypography color='light' fontWeight='bold' fontSize={12}>Strike Rate: {((tenXLeaderboard[0]?.strikeRate)*100).toFixed(0)}%</MDTypography>
                            </Grid>
                            <MDTypography color='light' fontWeight='bold' fontSize={12}>
                                Earnings: ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tenXLeaderboard[0]?.earnings)}
                              </MDTypography>
                          </Grid>
                      </Grid>

                      <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center' style={{width:'100%'}}>
                          <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                              <MDAvatar src={Rank2} alt="profile-image" size="xxl" />
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                              <MDTypography color='light' fontWeight='bold' fontSize={20}>{TruncatedName(tenXLeaderboard[1]?.first_name + ' ' + tenXLeaderboard[1]?.last_name)}</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                              <MDTypography color='light' fontWeight='bold' fontSize={15}>Badge: {Badge(tenXLeaderboard[1]?.strikeRate)}</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                              <MDTypography color='light' fontWeight='bold' fontSize={12}>Subscriptions(Total): {tenXLeaderboard[1]?.subscriptions}</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                              <MDTypography color='light' fontWeight='bold' fontSize={12}>Subscriptions(Wins): {tenXLeaderboard[1]?.subscriptionsWithPayout}</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                              <MDTypography color='light' fontWeight='bold' fontSize={12}>Strike Rate: {((tenXLeaderboard[1]?.strikeRate)*100).toFixed(0)}%</MDTypography>
                            </Grid>
                            <MDTypography color='light' fontWeight='bold' fontSize={12}>
                                Earnings: ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tenXLeaderboard[1]?.earnings)}
                              </MDTypography>
                          </Grid>
                      </Grid>

                      <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center' style={{width:'100%'}}>
                          <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                              <MDAvatar src={Rank3} alt="profile-image" size="xxl" />
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                              <MDTypography color='light' fontWeight='bold' fontSize={20}>{TruncatedName(tenXLeaderboard[2]?.first_name + ' ' + tenXLeaderboard[2]?.last_name)}</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                              <MDTypography color='light' fontWeight='bold' fontSize={15}>Badge: {Badge(tenXLeaderboard[2]?.strikeRate)}</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                              <MDTypography color='light' fontWeight='bold' fontSize={12}>Subscriptions(Total): {tenXLeaderboard[2]?.subscriptions}</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                              <MDTypography color='light' fontWeight='bold' fontSize={12}>Subscriptions(Wins): {tenXLeaderboard[2]?.subscriptionsWithPayout}</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                              <MDTypography color='light' fontWeight='bold' fontSize={12}>Strike Rate: {((tenXLeaderboard[2]?.strikeRate)*100).toFixed(0)}%</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                              <MDTypography color='light' fontWeight='bold' fontSize={12}>
                                Earnings: ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tenXLeaderboard[2]?.earnings)}
                              </MDTypography>
                            </Grid>
                          </Grid>
                      </Grid> 

                  </Grid>

                  <Divider style={{backgroundColor:'white'}} orientation="horizontal"/>
                  
                  <Grid container mt={1} mb={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                      <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
                          <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
                            <Grid item xs={12} md={12} lg={1} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
                              <MDTypography color='light' fontWeight='bold' fontSize={15}>Rank</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={1} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
                              <MDTypography color='light' fontWeight='bold' fontSize={15}>Photo</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={2} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
                              <MDTypography color='light' fontWeight='bold' fontSize={15}>Trader</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={2} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
                              <MDTypography color='light' fontWeight='bold' fontSize={15}>Subs(Total/Win)</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={2} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
                              <MDTypography color='light' fontWeight='bold' fontSize={15}>Strike Rate</MDTypography>
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

                  {restTenXLeaderboard?.map((e, index)=>{
                    
                    return(
                    <>
                    <Divider style={{backgroundColor:'white'}} orientation="horizontal"/>
                    
                    <Grid container mt={1} mb={2} xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                        
                        <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
                            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
                              <Grid item xs={12} md={12} lg={1} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
                                <MDTypography color='light' fontSize={15}>{index+4}</MDTypography>
                              </Grid>
                              <Grid item xs={12} md={12} lg={1} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
                                <MDAvatar src={e?.profilePic ? e?.profilePic : DefaultProfilePic} alt="profile-image" size="xs" />
                              </Grid>
                              <Grid item xs={12} md={12} lg={2} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
                                <MDTypography color='light' fontSize={15}>{TruncatedName(e?.first_name + ' ' + e?.last_name)}</MDTypography>
                              </Grid>
                              <Grid item xs={12} md={12} lg={2} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
                                <MDTypography color='light' fontSize={15}>{e?.subscriptions}/{e?.subscriptionsWithPayout}</MDTypography>
                              </Grid>
                              <Grid item xs={12} md={12} lg={2} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
                                <MDTypography color='light' fontSize={15}>{((e?.strikeRate)*100).toFixed(0)}%</MDTypography>
                              </Grid>
                              <Grid item xs={12} md={12} lg={2} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
                                <MDTypography color='light' fontSize={15}>{Badge(e?.strikeRate)}</MDTypography>
                              </Grid>
                              <Grid item xs={12} md={12} lg={2} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
                                <MDTypography color='light' fontSize={15}>
                                  ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(e?.earnings)}
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
                      <MDTypography color='light' fontSize={12}>TenX Titan : Strike Rate is greater than 80%</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                      <MDTypography color='light' fontSize={12}>TenX Wizard : Strike Rate is in between 60% to 80%</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                      <MDTypography color='light' fontSize={12}>TenX Maestro : Strike Rate is in between 40% to 60%</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                      <MDTypography color='light' fontSize={12}>TenX Rising : Strike Rate is in between 20% to 40%</MDTypography>
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