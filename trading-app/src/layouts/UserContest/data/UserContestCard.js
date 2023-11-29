import React, {useState, useEffect, memo} from 'react'
import { Link } from 'react-router-dom';
import Grid from "@mui/material/Grid";
import axios from "axios";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import {Tooltip} from '@mui/material';
import MDAvatar from "../../../components/MDAvatar";
import MDTypography from "../../../components/MDTypography";
import ContestIcon from "../../../assets/images/contest.png";
import { HiUserGroup } from 'react-icons/hi';
import Timer from '../timer'
import { Typography } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import ProgressBar from '../data/ProgressBar'
import { CircularProgress } from "@mui/material";
import Logo from "../../../assets/images/logo1.png"
import nifty from "../../../assets/images/nifty.png"
import banknifty from "../../../assets/images/banknifty.png"
import upcoming from "../../../assets/images/upcoming.png"

  

const ContestCard = () => {

  // const [progress, setProgress] = React.useState(10);
  const [contestData,setContestData] = useState([]);
  const [isLoading,setIsLoading] = useState(false);

  // const [objectId,setObjectId] = useState('')
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  let timerStyle = {
    textAlign: "center", 
    fontSize: ".75rem", 
    color: "white", 
    backgroundColor: "#344767", 
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
      {contestData.length > 0 ? 
      <MDBox minWidth="100%" minHeight='auto'> 
        <Grid container spacing={2}>
        {contestData?.map((e)=>{
        const totalRewardAmount = e?.rewards?.reduce((total, rewardStructure) => {
          const { rankStart, rankEnd, reward } = rewardStructure;
          const rankCount = rankEnd - rankStart + 1;
          return total + (reward * rankCount);
        }, 0);

          return <>
          
              <Grid key={e._id} item xs={12} md={6} lg={4} >
              <MDBox style={{borderRadius:4}}>
              <Tooltip title="Click me!">
              <MDButton variant="contained" color="light" size="small" 
              component={Link} 
              to={{
                pathname: `/battlestreet/${e.contestName}`,
              }}
              state= {{data:e._id, isDummy: true, isFromUpcomming: true}}
              >
                  
                  <Grid container>
                    <Grid  container spacing={1} display="flex" justifyContent="center" alignContent="center" alignItem="center">
                        <Grid item xs={12} md={6} lg={12} mb={1} display="flex" alignContent="center" alignItems="center">
                            <MDAvatar src={e?.contestOn === 'NIFTY 50' ? nifty : banknifty} size="xl" display="flex" justifyContent="left"/>
                            <MDBox ml={2} display="flex" flexDirection="column">
                            <MDTypography fontSize={20} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>{e?.contestName}</MDTypography>
                            <MDTypography fontSize={10} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Index: {e?.contestOn}</MDTypography>
                            <MDTypography fontSize={10} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Start Time: {dateConvert(e?.contestStartDate)}</MDTypography>
                            </MDBox>
                        </Grid>
                      
                    </Grid>
                      
                      <Grid item xs={12} md={6} lg={12} mb={1} display="flex" justifyContent="center">
                          <Typography fontSize={13} style={{color:"black",fontWeight:700}}>Reward: {e?.entryFee?.currency} {totalRewardAmount.toLocaleString()}</Typography>
                      </Grid>

                      <Grid item xs={12} md={6} lg={12} mb={1} style={{color:"black",fontSize:10}} display="flex" justifyContent="center" alignItems="center" alignContent="center">
                        <span style={timerStyle}>
                          <AvTimerIcon/><Timer targetDate={e?.contestStartDate} text="Battle Started" />
                        </span>
                      </Grid>

                      <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                          <Typography fontSize={8} style={{color:"black"}}>Prize: <span style={{fontSize:10,fontWeight:700}}>{e?.entryFee?.currency === 'INR' ? 'Cash' : 'Bonus'}</span></Typography>
                      </Grid>

                      <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                          <Typography fontSize={8} style={{color:"black"}}>Entry Fee: <span style={{fontSize:10,fontWeight:700}}>{e?.entryFee?.amount === 0 ? 'FREE' : e?.entryFee?.amount}</span></Typography>
                      </Grid>
                      
                      <Grid item xs={12} md={6} lg={12} sx={{width:"100%"}}>
                        <ProgressBar progress={((e?.participants?.length)/(e?.maxParticipants)*100)}/>
                      </Grid>

                      <Grid item xs={12} md={12} lg={12} display="flex" mt={1} mb={1} justifyContent="space-between" alignItems="center" alignContent="center">
                          <MDBox color="light" p={0.5} borderRadius={4} bgColor="success" fontSize={9} display="flex" justifyContent="center">
                              <HiUserGroup /><MDBox color="light" style={{marginLeft:2,fontWeight:700}}>Seats Left: {e?.maxParticipants-e?.participants?.length}</MDBox>
                          </MDBox>
                          <MDBox color="light" p={0.5} borderRadius={4} bgColor="success" fontSize={9} display="flex" justifyContent="center">
                              <HiUserGroup /><MDBox display="flex" color="light" bgColor="success" justifyContent="center" alignContent="center" alignItems="center" style={{marginLeft:2,fontWeight:700}}>Total Seats: {e?.maxParticipants}</MDBox>
                          </MDBox>
                      </Grid>

                  </Grid>

              </MDButton>
              </Tooltip>
              </MDBox>
              </Grid>
          
          </>
          })}
        </Grid>

      </MDBox>
      :
      <MDBox style={{border:'1px solid white', borderRadius:5, minHeight:'20vh'}}>
        <Grid container>
          <Grid item xs={12} md={6} lg={12}>
            <MDBox style={{minHeight:"20vh"}} display="flex" justifyContent="center" flexDirection="column" alignContent="center" alignItems="center">
            <img src={upcoming} width={50} height={50}/>
            <MDTypography color="light" fontSize={15}>Keep watching this space for upcoming battles!</MDTypography>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      }
      </>
      }
      </>
)}



export default memo(ContestCard);