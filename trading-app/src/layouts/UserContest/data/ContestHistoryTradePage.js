import React,{useState, useEffect, memo, useMemo, useCallback, useRef} from 'react'
import { io } from "socket.io-client";
import MDBox from '../../../components/MDBox'
import Grid from '@mui/material/Grid'
import MDTypography from '../../../components/MDTypography'
// import MDButton from '../../../components/MDButton'
// import Logo from '../../../assets/images/logo1.jpeg'
import { Divider } from '@mui/material'
// import { HiUserGroup } from 'react-icons/hi';
// import { Link } from 'react-router-dom';
// import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Portfolios from './Portfolios'
import MYPNLData from './PnL/MyPNLData'
import InstrumentsData from './Instruments/Instruments'
import TradersRanking from './TradersRanking'
import DummyInstrument from "./dummy/dummyInstrument"
import DummyPnl from "./dummy/dummyPnl"
import DummyRank from "./DemoTradersRanking";
import AvTimerIcon from '@mui/icons-material/AvTimer';
import Timer from '../timer';
import LastTrade from './contestTrade/LastTrade'
import MDButton from '../../../components/MDButton';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import Button from '@mui/material/Button'
import UsedPortfolio from './PnL/UsedPortfolio';



function ContestHistoryTradeView () {
    const [contest,setContest] = useState();
    const location = useLocation();
    const  contestId  = location?.state?.contestId;
    const  portfolioId  = location?.state?.portfolioId;
    const isFromHistory = location?.state?.isFromHistory
    const minEntry = location?.state?.minEntry
    const entry = location?.state?.entry
    const  isDummy  = location?.state?.isDummy;
    const isContestCancelled = location?.state?.isContestCancelled;
    const redirect = useRef(true);
    const nevigate = useNavigate();

    const [render, setReRender] = useState(true);
    let style = {
      textAlign: "center", 
      fontSize: ".75rem", 
      color: "#003366", 
      backgroundColor: "#CCCCCC", 
      borderRadius: "5px", 
      padding: "5px",  
      fontWeight: "600",
      display: "flex", 
      alignItems: "center"
    }

    console.log("Location in tradePage: ",location)
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    let baseUrl1 = process.env.NODE_ENV === "production" ? "/" : "http://localhost:9000/"

  //   let socket;
  //   try {
  //     socket = io.connect(`${baseUrl1}`)
  //   } catch (err) {
  //     throw new Error(err);
  //   }
  
  // // console.log("in event running", socket.id, contestId)
  //   useEffect(() => {

  //     console.log("in event 1")
  //     socket.on("connect", () => {
  //       console.log("in event 2")
  //       // socket.emit('userId', contestId)

  //       // socket.emit('contest', contestId)
  //       socket.emit("contest", true)
  //     })
  //   }, []);


  //   useEffect(() => {
  //     return () => {
  //         socket.close();
  //     }
  //   }, [])

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


    const memoizedTradersRankingForHistory = useMemo(() => {
      return <TradersRanking contestId={contestId} isFromHistory={isFromHistory} reward={contest?.rewards}/>;
    }, [contestId, contest?.rewards]);
  
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
    <MDBox key={contest?._id} width="100%" bgColor="dark" color="light" p={2}>
        <Grid container spacing={2}>
        {/* display="flex" justifyContent="flexEnd" display="flex" justifyContent="center"*/}
        <Grid item xs={12} md={6} lg={6.5} mb={2}>
                <MDBox color="light" >
                  <MDBox display="flex" alignItems= "center" gap={"130px"} mb={1} >
                    <Button mb={2} color="light" style={{border: "1px solid white", borderRadius: "7px"}} onClick={()=>{nevigate('/battleground/history')}}>< FastRewindIcon/></Button>
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



        </Grid>
    </MDBox>
  )

}
export default memo(ContestHistoryTradeView);