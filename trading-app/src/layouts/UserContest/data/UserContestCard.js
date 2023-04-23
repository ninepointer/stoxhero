import React, {useState, useEffect, memo} from 'react'
import { Link } from 'react-router-dom';
import Grid from "@mui/material/Grid";
import axios from "axios";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import ContestIcon from "../../../assets/images/contest.png";
import { HiUserGroup } from 'react-icons/hi';
import Timer from '../timer'
import { Typography } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import ProgressBar from '../data/ProgressBar'
import { CircularProgress } from "@mui/material";
import Logo from "../../../assets/images/logo1.jpeg"

  

const ContestCard = () => {

  // const [progress, setProgress] = React.useState(10);
  const [contestData,setContestData] = useState([]);
  const [isLoading,setIsLoading] = useState(false);

  // const [objectId,setObjectId] = useState('')
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  let timerStyle = {
    textAlign: "center", 
    fontSize: ".75rem", 
    color: "#003366", 
    backgroundColor: "white", 
    borderRadius: "5px", 
    padding: "5px",  
    fontWeight: "600",
    display: "flex", 
    alignItems: "center"
  }


  useEffect(()=>{
  
    // promise.all[]
    let call1 = axios.get(`${baseUrl}api/v1/contest/active`)
    let call2 = axios.get(`${baseUrl}api/v1/contest/mycontests`,{
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                  },
                })
    Promise.all([call1, call2])
    .then(([api1Response, api2Response]) => {
      // Process the responses here
      console.log(api1Response.data.data);
      console.log(api2Response.data.data);
      let activeData = api1Response.data.data;
      let myData = api2Response.data.data;

      activeData = activeData.filter((elem1) => !myData.some((elem2) => elem1._id === elem2._id));

      console.log(activeData);
      setContestData(activeData);
      setIsLoading(true)
    
    })
    .catch((error) => {
      // Handle errors here
      console.error(error);
    });  
              
  },[])


      // console.log("Contest Data: ",contestData)

      function dateConvert(dateConvert){
        const dateString = dateConvert;
        const date = new Date(dateString);
        const options = { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric', 
          hour: 'numeric', 
          minute: 'numeric' 
        };
        
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
        
        // get day of month and add ordinal suffix
        const dayOfMonth = date.getDate();
        let suffix = "th";
        if (dayOfMonth === 1 || dayOfMonth === 21 || dayOfMonth === 31) {
          suffix = "st";
        } else if (dayOfMonth === 2 || dayOfMonth === 22) {
          suffix = "nd";
        } else if (dayOfMonth === 3 || dayOfMonth === 23) {
          suffix = "rd";
        }
        
        // combine date and time string with suffix
        const finalFormattedDate = `${dayOfMonth}${suffix} ${formattedDate?.split(" ")[0]}, ${date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`;
        
        // console.log(finalFormattedDate);
        
     

      return finalFormattedDate
    }
      
    

    return (
      <>
      {!isLoading ?    
      <>
      <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
      <CircularProgress color="info" />
      </MDBox>
      </>
      :
      <>
      <MDBox bgColor="light" minWidth="100%" minHeight='auto'>
      <Grid container spacing={2}>
      {contestData?.map((e)=>{

        return <>
        
            <Grid key={e._id} item xs={12} md={6} lg={3} >
            <MDBox bgColor='dark' padding={0} style={{borderRadius:4}}>
            <MDButton variant="contained" color="dark" size="small" 
            component={Link} 
            to={{
              pathname: `/battleground/${e.contestName}`,
            }}
            state= {{data:e._id, isDummy: true, isFromUpcomming: true}}
            >
                <Grid container>
                  <Grid mt={1} container spacing={1} display="flex" justifyContent="center" alignContent="center" alignItem="center">
                    <Grid item xs={12} md={6} lg={3} display="flex" justifyContent="center">
                        <img style={{borderRadius:'50%'}} src={Logo} width={50} height={50}/>
                    </Grid>
                    
                    <Grid item xs={12} md={6} lg={9} mb={2} mt={0.4} display="flex" justifyContent="center">
                        <MDBox display="flex" flexDirection="column" justifyContent="left" alignItems="left">
                        <Typography align='center' fontSize={15} style={{color:"whitesmoke",fontSize:15,fontWeight:700,borderRadius:3,paddingLeft:4,paddingRight:4}}>{e.contestName}</Typography>
                        <Typography align='center' fontSize={10} style={{color:"white"}}><span style={{fontSize:10,fontWeight:700,paddingLeft:4,paddingRight:4}}>{dateConvert(e?.contestStartDate)}</span></Typography>
                        </MDBox>
                    </Grid> 
                  </Grid>

                    <Grid item xs={12} md={6} lg={12} mb={1} display="flex" justifyContent="center">
                        <Typography fontSize={13} style={{fontWeight:700,borderRadius:3,paddingLeft:4,paddingRight:4}}>Contest On: {e.contestOn}</Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={6} lg={12} mb={1} display="flex" justifyContent="center">
                        <Typography fontSize={13} style={{color:"white",fontWeight:700}}>Reward Pool: {e?.entryFee?.currency} {e?.rewards?.reduce((total, reward) => total + reward?.reward, 0).toLocaleString()}</Typography>
                    </Grid>

                    <Grid item xs={12} md={6} lg={12} mb={1} style={{color:"white",fontSize:10}} display="flex" justifyContent="center" alignItems="center" alignContent="center">
                      <span style={timerStyle}>
                        <AvTimerIcon/><Timer targetDate={e.contestStartDate} text="Contest Started" />
                      </span>
                    </Grid>

                    <Grid item xs={12} md={6} lg={12} mb={1} display="flex" justifyContent="center">
                        <Typography fontSize={8} style={{color:"white"}}>Entry Fee: <span style={{fontSize:10,fontWeight:700}}>{e?.entryFee?.amount === 0 ? 'FREE' : e?.entryFee?.amount}</span></Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={6} lg={12} sx={{width:"100%"}}>
                      <ProgressBar progress={((e?.participants?.length)/(e?.maxParticipants)*100)}/>
                    </Grid>

                    <Grid item xs={12} md={12} lg={12} display="flex" mt={1} ml={1} mr={1} justifyContent="space-between" alignItems="center" alignContent="center">
                        <MDTypography color="white" fontSize={10} display="flex" justifyContent="center">
                            <HiUserGroup /><span style={{marginLeft:2,fontWeight:700}}>Seats Left: {e?.maxParticipants-e?.participants?.length}</span>
                        </MDTypography>
                        <MDTypography color="white" fontSize={10} display="flex" justifyContent="center">
                            <HiUserGroup /><span style={{marginLeft:2,fontWeight:700}}>Max Seat: {e?.maxParticipants}</span>
                        </MDTypography>
                    </Grid>

                </Grid>
                </MDButton>
            </MDBox>
            </Grid>
        
        </>
        })}
    </Grid>

      </MDBox>
      </>
      }
      </>
)}



export default memo(ContestCard);