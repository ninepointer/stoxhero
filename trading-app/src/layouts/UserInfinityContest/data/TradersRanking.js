import React,{useState, useEffect, memo, useContext} from 'react'
import MDBox from '../../../components/MDBox'
import Grid from '@mui/material/Grid'
import MDTypography from '../../../components/MDTypography'
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { userContext } from '../../../AuthContext';
// import PrizeDistribution from './PrizeDistribution';

function TradersRanking({isFromResult, contest, contestId, isFromHistory, reward, setMyRankProps}){

  reward?.length === 0 && reward.push({currency: "INR"})
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
  const [rankData, setRankData] = useState([]);
  const [myRank, setMyRank] = useState({});
  const [setting, setSetting] = useState([]);
  const [isLoading,setIsLoading] = useState(true)
  const getDetails = useContext(userContext)
  const leaderBoardEndPoint = (isFromHistory || isFromResult) ? "historyLeaderboard" : "leaderboard"
  const myRankEndPoint = (isFromHistory || isFromResult) ? "historyMyrank" : "myrank"

  console.log(leaderBoardEndPoint, myRankEndPoint)
  const fetchData = async () => {
    // console.log("runnning every 2 sec")

      const api1Response = await axios.get(`${baseUrl}api/v1/contest/${contestId}/trades/${leaderBoardEndPoint}`, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
      })
      console.log("leaderboard", api1Response.data)
      // setTimeout(()=>{setIsLoading(false)},500)
      // setRankData(prevRanks => {
      //   const ranksMap = new Map(prevRanks.map(rank => [rank.name, rank]));
      //   (api1Response.data.data).forEach(rank => {
      //     ranksMap.set(rank.name, rank);
      //   });
      //   return Array.from(ranksMap.values());
      // });

      setRankData(prevRanks => {
        const ranksMap = new Map(prevRanks.map(rank => [rank.name, rank]));
        api1Response.data.data.forEach(rank => {
          ranksMap.set(rank.name, rank);
        });
        const sortedRanks = Array.from(ranksMap.values()).sort((a, b) => b.npnl - a.npnl);
        return sortedRanks;
      });

      const api2Response = await axios.get(`${baseUrl}api/v1/contest/${contestId}/trades/${myRankEndPoint}`, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
      })

      console.log("my rank", api2Response.data)
      if(api2Response.data.status == "success"){
        setMyRank(api2Response.data.data);
        if(isFromResult && Object.keys(api2Response.data.data).length !== 0){
          setMyRankProps(api2Response.data.data)
          setTimeout(()=>{setIsLoading(false)},500)
        }else{
          setTimeout(()=>{setIsLoading(false)},500)
        }
        
      } else if(!isFromResult){
        setTimeout(()=>{setIsLoading(false)},500)
      }
  };

  async function fetchSettingData(){
    const appsetting = await axios.get(`${baseUrl}api/v1/leaderboardSetting`, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
    })
    setSetting(appsetting.data);
  }

  useEffect(() => {
    fetchSettingData()
  }, []);

  useEffect(() => {
    console.log("timming", setting, setting[0]?.leaderBoardTimming*1000)
    if(isFromHistory || isFromResult){
      fetchData(); // run once on mount
    } else{
      const intervalId = setInterval(fetchData, setting[0]?.leaderBoardTimming*1000); // run every 10 seconds
      fetchData(); // run once on mount
      return () => clearInterval(intervalId);
    }

  }, [setting, leaderBoardEndPoint, myRankEndPoint]);


  const myReward = reward?.filter((elem)=>{
    return elem?.rankStart <= myRank?.rank && elem?.rankEnd >=  myRank?.rank;
  })

  const myProfitPercentage = myRank?.npnl*100/Number(myRank?.investedAmount);
  // console.log("myProfitPercentage", myRank, reward, reward[0].currency, myReward);
  // myRank?.npnl = 0;


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
                    
                    <Grid item xs={12} md={12} lg={2.4} display="flex" justifyContent="center">
                      <MDTypography fontSize={13} color="light" style={{fontWeight:700, fontSize: "10px"}}>Rank</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={12} lg={2.7} display="flex" justifyContent="center">
                      <MDTypography fontSize={13} color="light" style={{fontWeight:700, fontSize: "10px"}}>UserId</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={12} lg={2.7} display="flex" justifyContent="center">
                      <MDTypography fontSize={13} color="light" style={{fontWeight:700, fontSize: "10px"}}>Net P&L</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
                      <MDTypography fontSize={13} color="light" style={{fontWeight:700, fontSize: "10px"}}>Profit(%)</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
                      <MDTypography fontSize={13} color="light" style={{fontWeight:700, fontSize: "10px"}}>Reward</MDTypography>
                    </Grid>

                </Grid>

                <Grid container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
                    
                    <Grid item xs={12} md={12} lg={2.4} display="flex" justifyContent="center">
                      <MDTypography fontSize={10} color="light">{myRank?.rank ? myRank?.rank : "-"}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={12} lg={2.7} display="flex" justifyContent="center">
                      <MDTypography fontSize={10} color="light">{getDetails?.userDetails?.employeeid}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={12} lg={2.7} display="flex" justifyContent="center">
                      <MDTypography fontSize={10} color={myRank?.npnl >= 0 ? "success" : "error"}>
                          {myRank?.npnl ? (myRank?.npnl >= 0.00 ? "+₹" + (myRank?.npnl?.toFixed(2)): "-₹" + ((-myRank?.npnl).toFixed(2))) : "+₹" +0.00}
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
                      <MDTypography fontSize={10} color={myRank?.npnl >= 0 ? "success" : "error"}>
                          {myProfitPercentage ? (myProfitPercentage >= 0.00 ? "+" + (myProfitPercentage?.toFixed(2))+"%": "-" + ((-myProfitPercentage).toFixed(2))+"%") : "+0.00%"}
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
                      <MDTypography fontSize={10}  color="light">
                        {(myReward && myReward?.length && myReward[0]?.reward ? `${myReward[0]?.currency} ${myReward[0]?.reward}` : `${reward[0].currency} 0`)}
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

                  const profitPercentage = elem.npnl*100/elem.investedAmount;

                  return(
                    <Grid key={elem.name} container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
  
                      <Grid item xs={12} md={12} lg={2.4} display="flex" justifyContent="center">
                        <MDTypography fontSize={10} color="light">{index+1}</MDTypography>
                      </Grid>
                      <Grid item xs={12} md={12} lg={2.7} display="flex" justifyContent="center">
                        <MDTypography fontSize={10} color="light">{elem?.name}</MDTypography>
                      </Grid>
                      <Grid item xs={12} md={12} lg={2.7} display="flex" justifyContent="center">
                        <MDTypography fontSize={10} color={elem.npnl >= 0 ? "success" : "error"}>
                            {elem.npnl >= 0.00 ? "+₹" + (elem.npnl?.toFixed(2)): "-₹" + ((-elem.npnl).toFixed(2))}
                        </MDTypography>
                      </Grid>
                      <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
                        <MDTypography fontSize={10} color={elem.npnl >= 0 ? "success" : "error"}>
                            {profitPercentage >= 0.00 ?  "+"+(profitPercentage?.toFixed(2))+"%":  "-"+((-profitPercentage).toFixed(2))+"%"}
                        </MDTypography>
                      </Grid>
                      <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
                        <MDTypography fontSize={10} color="light">
                            {(rewards && rewards?.length && rewards[0]?.reward ?  `${rewards[0]?.currency} ${rewards[0]?.reward}` : `${reward[0].currency} 0`)}
                        </MDTypography>
                      </Grid>

                    </Grid>
                  )

                })}
                </>
                }

            </MDBox>
            {/* <MDBox  width="100%"> */}
              {/* <PrizeDistribution  contest={contest} /> */}
            {/* </MDBox> */}
        </Grid> 

    </>
);
}

export default memo(TradersRanking);