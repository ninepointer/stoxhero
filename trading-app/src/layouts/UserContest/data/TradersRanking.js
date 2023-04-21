import React,{useState, useEffect, memo, useContext} from 'react'
import MDBox from '../../../components/MDBox'
import Grid from '@mui/material/Grid'
import MDTypography from '../../../components/MDTypography'
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { userContext } from '../../../AuthContext';

function TradersRanking({contestId, isFromHistory, reward}){

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const [rankData, setRankData] = useState([]);
  const [myRank, setMyRank] = useState({});
  const [isLoading,setIsLoading] = useState(true)
  const getDetails = useContext(userContext)
  const historyUrl = isFromHistory ? "historyLeaderboard" : "leaderboard"

  const fetchData = async () => {
    // console.log("runnning every 2 sec")

      const api1Response = await axios.get(`${baseUrl}api/v1/contest/${contestId}/trades/${historyUrl}`, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
      })
      console.log("leaderboard", api1Response.data.data)
      setRankData(api1Response.data.data);

      const api2Response = await axios.get(`${baseUrl}api/v1/contest/${contestId}/trades/myrank`, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
      })

    
      if(api2Response.data.status == "success"){
        setMyRank(api2Response.data.data);
      }
      
      setTimeout(()=>{setIsLoading(false)},500)
  };
  
  useEffect(() => {
    if(isFromHistory){
      // const intervalId = setInterval(fetchData, 1000);
      fetchData(); // run once on mount
      // clearInterval(intervalId);
    } else{
      const intervalId = setInterval(fetchData, 1000); // run every 10 seconds
      fetchData(); // run once on mount
      // socket.emit('hi')
      return () => clearInterval(intervalId);
    }

  }, []);


  const myReward = reward?.filter((elem)=>{
    return elem?.rankStart <= myRank?.rank && elem?.rankEnd >=  myRank?.rank;
  })

  console.log("rewards", myReward, reward)

return (
    <>
      
        <Grid item xs={12} md={6} lg={5} mb={2}>
            <MDBox color="light">

                <MDTypography mb={2} color="light" display="flex" justifyContent="center" style={{fontWeight:700}}>
                    LeaderBoard
                </MDTypography>
                
                {isLoading ?
                <Grid mt={12} mb={10} display="flex" width="100%" justifyContent="center" alignItems="center">
                  <CircularProgress color="light" />
                </Grid>
      
                :
                <>
                <Grid container>
                    <Grid item xs={12} md={12} lg={12}>
                      <MDTypography fontSize={13} color="light">My Rank</MDTypography>
                    </Grid>
                </Grid>

                <Grid container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
                    
                    <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                      <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>Rank</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                      <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>Name</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                      <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>P&L</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                      <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>Reward</MDTypography>
                    </Grid>

                </Grid>

                <Grid container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
                    
                    <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                      <MDTypography fontSize={13} color="light">{myRank?.rank ? myRank?.rank : "-"}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                      <MDTypography fontSize={13} color="light">{getDetails?.userDetails?.name}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                        <MDTypography fontSize={13} color={myRank?.npnl >= 0 ? "success" : "error"}>
                            {myRank?.npnl ? (myRank?.npnl >= 0.00 ? "+₹" + (myRank?.npnl?.toFixed(2)): "-₹" + ((-myRank?.npnl).toFixed(2))) : "-"}
                        </MDTypography>
                      </Grid>
                      <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                        <MDTypography fontSize={13}  color="light">
                          {myReward.length && myReward[0]?.reward ? `${myReward[0]?.reward} ${myReward[0]?.currency}` : "-"}
                        </MDTypography>
                      </Grid>

                </Grid>

                <Grid container mt={2}>
                    <Grid item xs={12} md={12} lg={12}>
                      <MDTypography fontSize={13} color="light">Top 10 Traders Rank</MDTypography>
                    </Grid>
                </Grid>

                {rankData.map((elem, index)=>{

                  const rewards = reward?.filter((elem)=>{
                    return elem?.rankStart <= (index+1) && elem?.rankEnd >= (index+1);
                  })

                  return(
                    <Grid key={elem.name} container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
  
                      <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                        <MDTypography fontSize={13} color="light">{index+1}</MDTypography>
                      </Grid>
                      <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                        <MDTypography fontSize={13} color="light">{elem?.name}</MDTypography>
                      </Grid>
                      <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                        <MDTypography fontSize={13} color={elem.npnl >= 0 ? "success" : "error"}>
                            {elem.npnl >= 0.00 ? "+₹" + (elem.npnl?.toFixed(2)): "-₹" + ((-elem.npnl).toFixed(2))}
                        </MDTypography>
                      </Grid>
                      <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                        <MDTypography fontSize={13} color="light">
                            {rewards[0]?.reward ?  `${rewards[0]?.reward} ${rewards[0]?.currency}` : "-"}
                        </MDTypography>
                      </Grid>

                    </Grid>
                  )

                })}
                </>
                }

            </MDBox>
        </Grid> 

    </>
);
}

export default memo(TradersRanking);