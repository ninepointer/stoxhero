import React, {useState, useContext, useEffect} from "react"
import {useNavigate} from 'react-router-dom';
import background from '../../assets/images/finowledge.png'
import logo from '../../assets/images/logo1.jpeg'
import ReactGA from "react-ga";
// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDAvatar from "../../components/MDAvatar";
import { userContext } from "../../AuthContext";
import UpComing from "./upcoming";
import MyOlympiad from './myOlympiad'
import { Button, Tooltip } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import Coins from '../../assets/images/coin.png'
import EditProfile from './component/editProfile';
import axios from 'axios';
import { apiUrl } from "../../constants/constants";

function Cover() {
  // const [scrollPosition, setScrollPosition] = useState(0);
  const getDetails = useContext(userContext)
  const user = getDetails.userDetails;
  const navigate = useNavigate();
  const [update, setUpdate] = useState(false);

  useEffect(()=>{
    if(user?.schoolDetails?.grade == null){
      navigate('/finowledge')
    }
  },[])

  useEffect(()=>{
    ReactGA.pageview(window.location.pathname)
  })

  async function logout(){
    await axios.get(`${apiUrl}logout`, {
      withCredentials: true,
    });
    navigate("/finowledge");
    getDetails.setUserDetail('');
    window.webengage.user.logout();
  }
  
  return (
    <>
      <MDBox mt={-1} display='flex' justifyContent='center' flexDirection='column' alignContent='center' alignItems='center' style={{ minHeight:'auto', width: 'auto', minWidth:'100vW', overflow: 'visible'}}>      
        <Grid
          container
          mt={0}
          xs={12}
          md={12}
          lg={12}
          display='flex'
          justifyContent='center'
          alignItems='center'
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            backgroundImage: `url(${background})`,
            backgroundSize: 'cover', // Make the background image responsive
            backgroundPosition: 'center center',
            height: '100vh',
            flexDirection: 'column',
            textAlign: 'center',
            padding: '10px',
            position: 'fixed',
            top: 0,
            left: 0,
            // filter: backdropFilter,
            // backgroundColor: backgroundColor,
            overflow: 'visible'
          }}
        >
        </Grid>

        <Grid
          mt={10}
          container
          xs={10}
          md={9}
          lg={9}
          display='flex'
          justifyContent='center'
          alignItems='center'
          style={{ zIndex: 0, overflow: 'visible' }}
        >
          <Grid
            mb={2}
            item
            xs={12}
            md={12}
            lg={12}
            display='flex'
            justifyContent='center'
            flexDirection='column'
            alignItems='center'
            alignContent='center'
            style={{ backgroundColor: 'white', borderRadius: 10, position: 'relative' }}
          >
            {/* <Grid
              mt={2}
              display='flex'
              justifyContent='center'
              alignItems='center'
              style={{ overflow: 'visible' }}
            >
              <MDTypography fontFamily='Work Sans , sans-serif'>My Profile</MDTypography>
            </Grid> */}
            <Grid
            mt={2}
              display='flex'
              justifyContent='center'
              alignItems='center'
              style={{ overflow: 'visible' }}
            >
              <MDAvatar src={getDetails?.userDetails?.schoolDetails?.profilePhoto || logo} size='md' alt='something here' />
            </Grid>
            <Grid
              display='flex'
              justifyContent='center'
              alignItems='center'
              style={{ overflow: 'visible' }}
            >
              <MDTypography variant='body2' style={{ fontFamily: 'Work Sans , sans-serif' }}>
                Hello, {user?.student_name || 'Your Name'}
              </MDTypography>
            </Grid>
            <Grid
              display='flex'
              justifyContent='center'
              alignItems='center'
              style={{ overflow: 'visible' }}
            >
              <MDTypography variant='caption' style={{ fontFamily: 'Work Sans , sans-serif' }}>
                Class: {user?.schoolDetails?.grade || 'Your Grade'}
              </MDTypography>
            </Grid>
            <Grid
              mb={2}
              display='flex'
              justifyContent='center'
              alignItems='center'
              style={{ overflow: 'visible' }}
            >
              <MDTypography variant='caption' style={{ fontFamily: 'Work Sans , sans-serif' }}>
                {`${user?.schoolDetails?.school?.school_name || 'School'}, ${user?.schoolDetails?.city?.name || 'City'}`}
              </MDTypography>
            </Grid>
            {/* New Grid for buttons */}
              <Grid
              container
              direction='row'
              justifyContent='flex-start'
              alignItems='center'
              alignContent='center'
              style={{ position: 'absolute', top: 10, left: 10 }}>
              
                <Grid container display='flex' justifyContent='flex-start' alignItems='center'>
                  <Grid item display='flex' justifyContent='center' alignItems='center'>
                    <img src={Coins} width='20px' style={{marginRight: "5px", cursor: "pointer", color: 'grey'}}/>
                  </Grid>
                  <Tooltip title='Coins Earned'>
                  <Grid item display='flex' justifyContent='center' alignItems='center'>
                    <MDTypography fontFamily='Work Sans , sans-serif' variant='h6' fontWeight={400} style={{cursor:'pointer'}}>0</MDTypography>
                  </Grid>
                  </Tooltip>
                </Grid>
             
            </Grid>
            <Grid
              container
              direction='row'
              justifyContent='flex-end'
              alignItems='center'
              style={{ position: 'absolute', top: 10, right: 10 }}>

              <Tooltip title='Edit Profile'>
                <EditProfile user={getDetails?.userDetails} update={update} setUpdate={setUpdate} />
              </Tooltip>
              <Tooltip title='Sign Out'>
                <LogoutIcon style={{ marginRight: "5px", cursor: "pointer", color: 'grey' }} onClick={logout} />
              </Tooltip>
            </Grid>
          
          </Grid>
        </Grid>



        <Grid container xs={10} md={9} lg={9} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{zIndex:0, overflow: 'visible' }}>
        <Grid p={.5} mb={2} item xs={12} md={12} lg={12} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{backgroundColor:'#D5F47E', borderRadius:10}}>
            <MDTypography variant='h6' style={{fontFamily: 'Work Sans , sans-serif'}}>My Olympiad(s)</MDTypography>
        </Grid>
        </Grid>

        <MyOlympiad update={update} />



        <UpComing setUpdate={setUpdate} update={update}/>
      </MDBox>
    </>
      
  );
}

export default Cover;