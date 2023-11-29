import React, {useState, useEffect, useContext, memo} from 'react'
import { Link } from 'react-router-dom';
import Grid from "@mui/material/Grid";
import { CircularProgress } from "@mui/material";
import axios from "axios";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import { Typography } from '@mui/material';
import { userContext } from '../../../AuthContext';
import Logo from "../../../assets/images/logo1.png"
import StarIcon from '@mui/icons-material/Star';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
  

const MyContestHistoryCard = () => {

  // const [progress, setProgress] = React.useState(10);
  const [contestData,setContestData] = useState([]);
  const [isLoading,setIsLoading] = useState(false);

  const getDetails = useContext(userContext)

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  useEffect(()=>{
  
    axios.get(`${baseUrl}api/v1/contest/history`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      },
    })
    .then((res)=>{
              setContestData(res.data.data);
              setIsLoading(true)
              console.log(res.data.data)
      }).catch((err)=>{
        return new Error(err);
    })
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

        let participatedUser = e?.participants?.filter((elem)=>{
          return elem?.userId == getDetails?.userDetails?._id
        })

        const myReward = e?.rewards?.filter((elem)=>{
          return elem?.rankStart <= participatedUser[0]?.myRank?.rank && elem?.rankEnd >=  participatedUser[0]?.myRank?.rank;
        })

        return <>
        
            <Grid key={e._id} item xs={12} md={6} lg={3} >
            <MDBox bgColor='dark' padding={0} style={{borderRadius:4}}>
            <MDButton variant="contained" color="dark" size="small" 
            component={Link} 
            to={{
              pathname: `/battlestreet/history/${e.contestName}`,
            }}
            state= {{contestId: e?._id, portfolioId: participatedUser[0].portfolioId, isFromHistory: true}}

          // to={ selectedPortfolio && {
          //     pathname: `/arena/contest/${nextPagePath}`,
          //   }}
          //   state= { selectedPortfolio && {contestId: contestId, portfolioId: selectedPortfolio}}
          

            >
                <Grid container>
                  <Grid mt={1} container spacing={1} display="flex" justifyContent="center" alignContent="center" alignItem="center">
                      <Grid item xs={12} md={6} lg={3} display="flex" justifyContent="center">
                          <img style={{borderRadius:'50%'}} src={Logo} width={50} height={50}/>
                      </Grid>
                      
                      <Grid item xs={12} md={6} lg={9} mb={2} display="flex" justifyContent="center">
                          <MDBox display="flex" flexDirection="column" justifyContent="left" alignItems="left">
                          <Typography align='center' style={{color:"whitesmoke",fontSize:15,fontWeight:700,borderRadius:3,paddingLeft:4,paddingRight:4}}>{e.contestName}</Typography>
                          <Typography align='center' fontSize={8} style={{color:"white"}}><span style={{fontSize:10,fontWeight:700,paddingLeft:4,paddingRight:4}}>{dateConvert(e?.contestStartDate)}</span></Typography>
                          </MDBox>
                      </Grid> 
                    </Grid>
                    
                    <Grid item xs={12} md={6} lg={12} mb={1} display="flex" justifyContent="center">
                        <Typography fontSize={13} style={{fontWeight:700,borderRadius:3,paddingLeft:4,paddingRight:4}}>Battle On: {e.contestOn}</Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={6} lg={12} mb={1} display="flex" justifyContent="center">
                        <Typography fontSize={13} style={{color:"white",fontWeight:700}}>Reward Pool: {e?.entryFee?.currency} {e?.rewards?.reduce((total, reward) => total + reward?.reward, 0).toLocaleString()}</Typography>
                    </Grid>

                    <Grid item xs={12} md={6} lg={12} mb={1} display="flex" justifyContent="center">
                        <Typography fontSize={8} style={{color:"white"}}>Entry Fee: <span style={{fontSize:10,fontWeight:700}}>{e?.entryFee?.amount === 0  ? 'FREE' : e?.entryFee?.amount}</span></Typography>
                    </Grid>

                    <Grid item xs={12} md={12} lg={12} display="flex" mt={1} ml={1} mr={1} justifyContent="space-between" alignItems="center" alignContent="center">
                        <MDTypography color="white" fontSize={9} display="flex" justifyContent="center">
                            <StarIcon /><span style={{marginLeft:2,fontWeight:600}}>My Rank: {participatedUser[0]?.myRank?.rank ? participatedUser[0]?.myRank?.rank : "NA"}</span>
                        </MDTypography>
                        <MDTypography color="white" fontSize={9} display="flex" justifyContent="center">
                            <EmojiEventsIcon /><span style={{marginLeft:2,fontWeight:600}}>My Reward: {myReward.length && myReward[0]?.reward ? `${myReward[0]?.currency} ${myReward[0]?.reward}` : "NA"}</span>
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



export default memo(MyContestHistoryCard);