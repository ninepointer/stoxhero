import React,{useState, useEffect, memo, useMemo, useRef} from 'react'
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

import MYPNLData from '../data/PnL/MyPNLData'
import InstrumentsData from '../data/Instruments/Instruments'
import TradersRanking from '../data/TradersRanking'
import DummyInstrument from "../data/dummy/dummyInstrument"
import DummyPnl from "../data/dummy/dummyPnl"
import DummyRank from "./DemoTradersRanking";
import AvTimerIcon from '@mui/icons-material/AvTimer';
import Timer from '../timer';
import LastTrade from '../data/contestTrade/LastTrade'
import FastRewindIcon from '@mui/icons-material/FastRewind';
import Button from '@mui/material/Button'
import UsedPortfolio from './PnL/UsedPortfolio';
import Margin from './marginDetails/margin';



function ContestTradeView () {
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

    let socket;
    try {
      socket = io.connect(`${baseUrl1}`)
    } catch (err) {
      throw new Error(err);
    }
  
  // console.log("in event running", socket.id, contestId)
    useEffect(() => {

      console.log("in event 1")
      socket.on("connect", () => {
        console.log("in event 2")
        // socket.emit('userId', contestId)

        // socket.emit('contest', contestId)
        socket.emit("contest", true)
      })
    }, []);


    useEffect(() => {
      return () => {
          socket.close();
      }
    }, [])

    React.useEffect(()=>{
      
      axios.get(`${baseUrl}api/v1/contest/${contestId}`)
      .then((res)=>{
              setContest(res?.data?.data);
              console.log(res?.data?.data)
      }).catch((err)=>{
          return new Error(err);
      })

    },[])

    const memoizedMargin = useMemo(() => {
      return <Margin portfolioId={portfolioId} />;
    }, [portfolioId]);

    const memoizedTradersRanking = useMemo(() => {
      return <TradersRanking contestId={contestId} reward={contest?.rewards}/>;
    }, [contestId, contest?.rewards]);
  
    const memoizedLastTrade = useMemo(() => {
      return <LastTrade
        contestId={contestId}
        Render={{render, setReRender}}
      />;
    }, [render, contestId]);
  
    const memoizedInstrumentDetails = useMemo(() => {
      return <InstrumentsData
        socket={socket}
        contestId={contestId}
        portfolioId={portfolioId}
        isFromHistory={isFromHistory}
        Render={{render, setReRender}}
        
      />;
    }, [socket, render, contestId, portfolioId, isFromHistory]);
  
    const memoizedOverallPnl = useMemo(() => {
      return <MYPNLData
        socket={socket}
        contestId={contestId}
        portfolioId={portfolioId}
        isFromHistory={isFromHistory}
        Render={{render, setReRender}}
      />;
    }, [socket, render, contestId, portfolioId, isFromHistory]);


    return (
    <MDBox key={contest?._id} width="100%" bgColor="dark" color="light" p={2}>
        <Grid container spacing={2}>
        {/* display="flex" justifyContent="flexEnd" display="flex" justifyContent="center"*/}
        <Grid item xs={12} md={6} lg={6.5} mb={2}>
                <MDBox color="light" >
                  <MDBox display="flex" alignItems="center" mb={1} justifyContent="space-between">
                    <Button mb={2} color="light" style={{border: "1px solid white", borderRadius: "7px"}} onClick={()=>{nevigate('/battleground')}}>< FastRewindIcon/></Button>
                    <MDTypography mt={1.5} color="light"  style={{fontWeight:700, filter: isDummy && 'blur(2px)'}}>
                        {contest?.contestName}
                    </MDTypography>
                    <MDTypography mt={1.5} color="light"  style={{fontWeight:600, fontSize: "10px", filter: isDummy && 'blur(2px)'}}>
                        Contest On: {contest?.contestOn}
                    </MDTypography>
                  </MDBox>

                  {!isContestCancelled ?
                    isDummy && !isFromHistory ?
                      <Grid item mb={1} mt={2} style={{color:"white",fontSize:20}} display="flex" justifyContent="center" alignItems="center" alignContent="center">
                        <span style={{fontSize: ".90rem", fontWeight: "600", textAlign: "center", marginRight: "8px"}}>
                          Contest is Starts in:
                        </span> 
                        <div style={style} >
                          <AvTimerIcon/>
                          <Timer 
                            targetDate={contest?.contestStartDate} 
                            text="Contest Started"
                            contestId={contestId}
                            portfolioId={portfolioId}
                            isDummy={isDummy}
                            contestName={contest?.contestName}
                            redirect={redirect.current}
                            minEntry={minEntry}
                            entry={entry}
                          />
                        </div>
                      </Grid>
                      :
                      !isFromHistory &&
                      <Grid item mb={1} mt={2} style={{color:"white",fontSize:20}} display="flex" justifyContent="center" alignItems="center" alignContent="center">
                      <span style={{fontSize: ".90rem", fontWeight: "600", textAlign: "center", marginRight: "8px"}}>
                        Contest Ends in:
                      </span> 
                      <div style={style} >
                        <AvTimerIcon/>
                        <Timer 
                          targetDate={contest?.contestEndDate} 
                          text="Contest Ends"
                          contestId={contestId}
                          portfolioId={portfolioId}
                          isDummy={isDummy}
                          contestName={contest?.contestName}
                          redirect={redirect.current}
                          minEntry={minEntry}
                          entry={entry}
                        />
                      </div>
                      </Grid>

                      :

                      <Grid item mb={1} mt={2} style={{color:"white",fontSize:20}} display="flex" justifyContent="center" alignItems="center" alignContent="center">
                        <span style={{fontSize: ".90rem", fontWeight: "600", textAlign: "center", marginRight: "8px"}}>
                        Contest is canceled due to minimum participant quota was not fulfilled.
                        </span> 
                      </Grid>
                  }
                    
                    {!isDummy ?
                    <>
                    {memoizedMargin}
                    {memoizedInstrumentDetails}
                    {memoizedOverallPnl}
                    
                    {memoizedLastTrade}
                    </>
                    :
                    <>
                    <DummyInstrument />
                    <DummyPnl />

                    </>
                    }

                </MDBox>
            </Grid>

            <Grid item xs={0} md={0} lg={0.5}>
                <Divider orientation="vertical" style={{backgroundColor: 'white', height: '100%'}} />
            </Grid>
            {isDummy ?
            <DummyRank />
            :
            memoizedTradersRanking
            
            }


        </Grid>
    </MDBox>
  )

}
export default memo(ContestTradeView);