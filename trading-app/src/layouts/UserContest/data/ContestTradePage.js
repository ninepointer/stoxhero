import React,{useState, useEffect, memo, useMemo, useRef} from 'react'
import { io } from "socket.io-client";
import MDBox from '../../../components/MDBox'
import Grid from '@mui/material/Grid'
import MDTypography from '../../../components/MDTypography'
import MDButton from '../../../components/MDButton'
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
// import DummyInstrument from "../data/dummy/dummyInstrument"
// import DummyPnl from "../data/dummy/dummyPnl"
import DummyRank from "./DemoTradersRanking";
import AvTimerIcon from '@mui/icons-material/AvTimer';
import Timer from '../timer';
import LastTrade from '../data/contestTrade/LastTrade'
import FastRewindIcon from '@mui/icons-material/FastRewind';
import Button from '@mui/material/Button'
// import UsedPortfolio from './PnL/UsedPortfolio';
import Margin from './marginDetails/margin';
import cancelledImage from "../../../assets/images/cancelled.jpg"
import ContestRules from './ContestRules';
import PrizeDistribution from './PrizeDistribution';
import { CircularProgress } from "@mui/material";
import MDSnackbar from "../../../components/MDSnackbar";






function ContestTradeView () {
    const [contest,setContest] = useState({});
    const location = useLocation();
    const contestId = location?.state?.contestId;
    const portfolioId = location?.state?.portfolioId;
    const isFromHistory = location?.state?.isFromHistory
    const minEntry = location?.state?.minEntry
    const entry = location?.state?.entry
    const isDummy = location?.state?.isDummy
    const redirect = useRef(true);
    const navigate = useNavigate();
    const [isLoading,setIsLoading] = useState(true)

    // const [render, setReRender] = useState(true);
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


    // useEffect(() => {
    //   return () => {
    //       socket.close();
    //   }
    // }, [])

    React.useEffect(()=>{
      console.log("contest useEffect")
      axios.get(`${baseUrl}api/v1/contest/${contestId}`)
      .then((res)=>{
              setContest(res?.data?.data);
              console.log(res?.data?.data)
              setIsLoading(false)
      }).catch((err)=>{
          return new Error(err);
      })

    },[isDummy])

    const memoizedMargin = useMemo(() => {
      return <Margin portfolioId={portfolioId} contestId={contestId}/>;
    }, [portfolioId, contestId]);

    const memoizedTradersRanking = useMemo(() => {
      return <TradersRanking contestId={contestId} reward={contest?.rewards}/>;
    }, [contestId, contest?.rewards]);
  
    const memoizedLastTrade = useMemo(() => {
      return <LastTrade
        contestId={contestId}
        // Render={{render, setReRender}}
      />;
    }, [contestId]);
  
    const memoizedInstrumentDetails = useMemo(() => {
      return <InstrumentsData
        socket={socket}
        contestId={contestId}
        portfolioId={portfolioId}
        isFromHistory={isFromHistory}
        // Render={{render, setReRender}}
        
      />;
    }, [socket, contestId, portfolioId, isFromHistory]);
  
    const memoizedOverallPnl = useMemo(() => {
      return <MYPNLData
        socket={socket}
        contestId={contestId}
        portfolioId={portfolioId}
        isFromHistory={isFromHistory}
        // Render={{render, setReRender}}
      />;
    }, [socket, contestId, portfolioId, isFromHistory]);


    // console.log("contest", contest, Boolean(contest))
    function exitContest(){
      // axios.delete(`${baseUrl}api/v1/contest/${contestId}/exit`)
      axios.delete(`${baseUrl}api/v1/contest/${contestId}/exit`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
      })
      .then((res)=>{
        navigate("/battlestreet")
        openSuccessSB("Warning","You exited from this contest", "FAIL")

              // setContest(res?.data?.data);
              // console.log(res?.data?.data)
              // setIsLoading(false)
      }).catch((err)=>{
          return new Error(err);
      })
    }

    const [successSB, setSuccessSB] = useState(false);
    const [msgDetail, setMsgDetail] = useState({
      title: "",
      content: "",
      // successSB: false,
      color: "",
      icon: ""
    })
    const openSuccessSB = (title,content, message) => {
      msgDetail.title = title;
      msgDetail.content = content;
      // msgDetail.successSB = true;
      if(message == "SUCCESS"){
        msgDetail.color = 'success';
        msgDetail.icon = 'check'
      } else {
        msgDetail.color = 'warning';
        msgDetail.icon = 'warning'
      }
      console.log(msgDetail)
      setMsgDetail(msgDetail)
      // setTitle(title)
      // setContent(content)
      setSuccessSB(true);
    }
  
    const closeSuccessSB = () =>{
      // msgDetail.successSB = false
      setSuccessSB(false);
  
    }
  
    // const closeSuccessSB = () => msgDetail.successSB = false;
  
  
    const renderSuccessSB = (
    <MDSnackbar
        color={msgDetail.color}
        icon={msgDetail.icon}
        title={msgDetail.title}
        content={msgDetail.content}
        open={successSB}
        onClose={closeSuccessSB}
        close={closeSuccessSB}
        bgWhite="info"
    />
    );

    return (
      <>
      {isLoading ?
        <Grid mt={1} mb={1} display="flex" width="100%" justifyContent="center" alignItems="center">
            <CircularProgress color="light" />
        </Grid>

        :
    <MDBox width="100%" bgColor="dark" color="light" mt={2} mb={1} p={2} borderRadius={10}>
      {Object.keys(contest).length !== 0 ?
        <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={6.5} mb={2}>
                <MDBox color="light" >
                  <MDBox display="flex" alignItems="center" mb={1} justifyContent="space-between">
                    <Button mb={2} color="light" style={{border: "1px solid white", borderRadius: "7px"}} onClick={()=>{navigate('/battlestreet')}}>< FastRewindIcon/></Button>
                    <MDTypography mt={1.5} color="light"  style={{fontWeight:700, filter: isDummy && 'blur(2px)'}}>
                        {contest?.contestName}
                    </MDTypography>
                    <MDTypography mt={1.5} color="light"  style={{fontWeight:600, fontSize: "10px"}}>
                        Battle On: {contest?.contestOn}
                    </MDTypography>
                  </MDBox>

                  {isDummy && !isFromHistory && contest?.status == "Live" ?
                      <Grid item mb={1} mt={2} style={{color:"white",fontSize:20}} display="flex" justifyContent="center" alignItems="center" alignContent="center">
                        <span style={{fontSize: ".90rem", fontWeight: "600", textAlign: "center", marginRight: "8px"}}>
                          Battle Starts in:
                        </span> 
                        <div style={style} >
                          <AvTimerIcon/>
                          <Timer 
                            targetDate={contest?.contestStartDate} 
                            text="Battle Started"
                            contestId={contestId}
                            portfolioId={portfolioId}
                            isDummy={isDummy}
                            contestName={contest?.contestName}
                            redirect={redirect.current}
                            minEntry={minEntry}
                            entry={entry}
                            contest={contest}
                          />
                        </div>
                      </Grid>
                      :
                      !isFromHistory && contest?.status == "Live" ?
                      <Grid item mb={1} mt={2} style={{color:"white",fontSize:20}} display="flex" justifyContent="center" alignItems="center" alignContent="center">
                      <span style={{fontSize: ".90rem", fontWeight: "600", textAlign: "center", marginRight: "8px"}}>
                        Battle Ends in:
                      </span> 
                      <div style={style} >
                        <AvTimerIcon/>
                        <Timer 
                          targetDate={contest?.contestEndDate} 
                          text="Battle Ends"
                          contestId={contestId}
                          portfolioId={portfolioId}
                          isDummy={isDummy}
                          contestName={contest?.contestName}
                          redirect={redirect.current}
                          minEntry={minEntry}
                          entry={entry}
                          contest={contest}
                        />
                      </div>
                      </Grid>

                      :

                      <Grid item mb={1} mt={2} style={{color:"white",fontSize:20}} display="flex" justifyContent="center" alignItems="center" alignContent="center">
                      <span style={{fontSize: ".90rem", fontWeight: "600", textAlign: "center", marginRight: "8px"}}>
                        Battle is not Live yet
                      </span> 
                      {/* <div style={style} >
                        <AvTimerIcon/>
                        <Timer 
                          targetDate={contest?.contestEndDate} 
                          text="Battle Ends"
                          contestId={contestId}
                          portfolioId={portfolioId}
                          isDummy={isDummy}
                          contestName={contest?.contestName}
                          redirect={redirect.current}
                          minEntry={minEntry}
                          entry={entry}
                          contest={contest}
                        />
                      </div> */}
                      </Grid>


                  }
                    
                    {!isDummy && contest?.status == "Live" ?
                    <>
                    {memoizedMargin}
                    {memoizedInstrumentDetails}
                    {memoizedOverallPnl}
                    
                    {memoizedLastTrade}
                    </>
                    :
                    <>
                    {/* <DummyInstrument />
                    <DummyPnl /> */}
                     <Grid textAlign="center" item xs={12} md={6} lg={12} mb={2} mt={4}>
                      <PrizeDistribution contest={contest} isDummy={isDummy}/>
                      <ContestRules contest={contest} isDummy={isDummy}/>
                      <MDButton display="flex" alignItems="center" onClick={exitContest}>
                        Exit Battle
                      </MDButton>
                    </Grid>

                    </>
                    }

                </MDBox>
            </Grid>

            <Grid item xs={0} md={0} lg={0.5}>
                <Divider orientation="vertical" style={{backgroundColor: 'white', height: '100%'}} />
            </Grid>
            {isDummy ?
            <>
            {/* <Grid item xs={0} md={0} lg={5}> */}
              <DummyRank />

            {/* </Grid> */}
            </>
            :
            memoizedTradersRanking
            
            }


        </Grid>
        
        :

        <div style={{display: "flex", justifyContent: "space-between"}}>
        <img style={{marginTop: '10px', maxWidth: '50%', height: '30%', borderRadius: '5px', display: 'block'}} src={cancelledImage} />
        <div style={{color: '#ffffff', textAlign: 'center', width: '100%', maxWidth: '600px'}}>
          <MDTypography mt={5} style={{fontWeight: 700, fontSize: "15px"}} color="light">
              Battle was cancelled as minimum participant quota was not fulfilled.         
           </MDTypography>
          <MDTypography mt={2} style={{fontWeight: 600, fontSize: "13px"}} color="light">
            But don't worry you can participate in other battles          
          </MDTypography>
          <MDButton mt={2} onClick={()=>{navigate("/battlestreet")}} color="light">
            Join other battles
          </MDButton>
        </div>
      </div>
        
        }
        {renderSuccessSB}
    </MDBox>
      }
      </>
  )

}
export default memo(ContestTradeView);