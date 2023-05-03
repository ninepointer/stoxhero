import React,{useState, memo, useMemo} from 'react'
import MDBox from '../../../components/MDBox'
import Grid from '@mui/material/Grid'
import MDTypography from '../../../components/MDTypography'
import { Divider } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import MYPNLData from './PnL/MyPNLData'
import TradersRanking from './TradersRanking'
import LastTrade from './contestTrade/LastTrade'
import FastRewindIcon from '@mui/icons-material/FastRewind';
import Button from '@mui/material/Button'
import UsedPortfolio from './PnL/UsedPortfolio';



function ContestHistoryTradeView () {
    const [contest,setContest] = useState();
    const location = useLocation();
    const  contestId  = location?.state?.contestId;
    const  portfolioId  = location?.state?.portfolioId;
    const isFromHistory = location?.state?.isFromHistory
    const  isDummy  = location?.state?.isDummy;
    const nevigate = useNavigate();

    const [render, setReRender] = useState(true);


    console.log("Location in tradePage: ",location)
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"


    React.useEffect(()=>{
      
      axios.get(`${baseUrl}api/v1/contest/${contestId}`)
      .then((res)=>{
              setContest(res?.data?.data);
              console.log(res?.data?.data)
      }).catch((err)=>{
          return new Error(err);
      })

    },[])

    const memoizedUsedPortfolio = useMemo(() => {
      return <UsedPortfolio portfolioId={portfolioId} />;
    }, [portfolioId]);

    // const memoizedPrizeDistribution = useMemo(() => {
    //   return <PrizeDistribution contest={contest} />;
    // }, [portfolioId]);


    const memoizedTradersRankingForHistory = useMemo(() => {
      return <TradersRanking contestId={contestId} isFromHistory={true} reward={contest?.rewards}  contest={contest}/>;
    }, [contestId, contest, contest?.rewards]);
  
    const memoizedLastTrade = useMemo(() => {
      return <LastTrade
        contestId={contestId}
        Render={{render, setReRender}}
      />;
    }, [render, contestId]);
  
  
    const memoizedOverallPnl = useMemo(() => {
      return <MYPNLData
        // socket={socket}
        contestId={contestId}
        portfolioId={portfolioId}
        isFromHistory={isFromHistory}
        Render={{render, setReRender}}
      />;
    }, [ render, contestId, portfolioId, isFromHistory]);


    return (
    <MDBox key={contest?._id} bgColor="dark" color="light" mt={2} mb={1} p={2} borderRadius={10}>
        <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={6.5} mb={2}>
                <MDBox color="light" >
                  <MDBox display="flex" alignItems= "center" gap={"130px"} mb={1} >
                    <Button mb={2} color="light" style={{border: "1px solid white", borderRadius: "7px"}} onClick={()=>{nevigate('/battlestreet/history')}}>< FastRewindIcon/></Button>
                    <MDTypography mt={1.5} color="light"  style={{fontWeight:700, filter: isDummy && 'blur(2px)'}}>
                        {contest?.contestName}
                    </MDTypography>
                  </MDBox>


                    {memoizedOverallPnl}
                    {memoizedUsedPortfolio}
                    {memoizedLastTrade}


                </MDBox>
            </Grid>

            <Grid item xs={0} md={0} lg={0.5}>
                <Divider orientation="vertical" style={{backgroundColor: 'white', height: '100%'}} />
            </Grid>

              {memoizedTradersRankingForHistory}
              {/* {memoizedPrizeDistribution} */}

        </Grid>
    </MDBox>
  )

}
export default memo(ContestHistoryTradeView);