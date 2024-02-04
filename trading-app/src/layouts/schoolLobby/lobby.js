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

function Cover() {
  const [scrollPosition, setScrollPosition] = useState(0);
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
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  const backgroundColor = scrollPosition > 10 ? 'rgba(0, 0, 0, 0.8)' : 'transparent'
  const backdropFilter = scrollPosition > 10 ? 'blur(5px)' : 'none'

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

       
        <Grid mt={10} container xs={10} md={9} lg={9} display='flex' justifyContent='center' alignItems='center' style={{zIndex:10, overflow: 'visible' }}>
          <Grid mb={2} item xs={12} md={12} lg={12} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{backgroundColor:'white', borderRadius:10}}>
            <MDBox mt={2} display='flex' justifyContent='center' alignItems='center' style={{overflow: 'visible'}}>
              <MDTypography>My Profile</MDTypography>
            </MDBox>
            <MDBox display='flex' justifyContent='center' alignItems='center' style={{overflow: 'visible'}}>
                <MDAvatar src={logo} size='md' alt="something here" />
            </MDBox>
            <MDBox display='flex' justifyContent='center' alignItems='center' style={{overflow: 'visible'}}>
              <MDTypography variant='body2' style={{fontFamily: 'Nunito'}}>{user?.full_name || "Your Name"}</MDTypography>
            </MDBox>
            <MDBox display='flex' justifyContent='center' alignItems='center' style={{overflow: 'visible'}}>
              <MDTypography variant='caption' style={{fontFamily: 'Nunito'}}>Class: {user?.schoolDetails?.grade || "Your Grade"}</MDTypography>
            </MDBox>
            <MDBox mb={2} display='flex' justifyContent='center' alignItems='center' style={{overflow: 'visible'}}>
              <MDTypography variant='caption' style={{fontFamily: 'Nunito'}}>{`${user?.schoolDetails?.school || "School"}, ${user?.schoolDetails?.city?.name || "City"}`}</MDTypography>
            </MDBox>
          </Grid>
        </Grid>

        <Grid container xs={10} md={9} lg={9} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{zIndex:10, overflow: 'visible' }}>
        <Grid p={.5} mb={2} item xs={12} md={12} lg={12} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{backgroundColor:'#D5F47E', borderRadius:10}}>
            <MDTypography variant='body2' style={{fontFamily: 'Work Sans , sans-serif'}}>My Olympiad(s)</MDTypography>
        </Grid>
        </Grid>

        <MyOlympiad update={update} />



        <UpComing setUpdate={setUpdate} update={update}/>
      </MDBox>
    </>
      
  );
}

export default Cover;
