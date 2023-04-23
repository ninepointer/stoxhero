import React,{useState, useEffect, memo, useMemo, useCallback, useRef, useContext} from 'react'
// import { io } from "socket.io-client";
import MDBox from '../../../../components/MDBox'
import Grid from '@mui/material/Grid'
import MDTypography from '../../../../components/MDTypography'
// import MDButton from '../../../components/MDButton'
// import Logo from '../../../assets/images/logo1.jpeg'
import { Divider } from '@mui/material'
// import { HiUserGroup } from 'react-icons/hi';
// import { Link } from 'react-router-dom';
// import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";

// import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
// import Portfolios from '../data/Portfolios'
// import MYPNLData from '../data/PnL/MyPNLData'
// import InstrumentsData from '../data/Instruments/Instruments'
import TradersRanking from '../../data/TradersRanking'
// import DummyInstrument from "../data/dummy/dummyInstrument"
// import DummyPnl from "../data/dummy/dummyPnl"
// import DummyRank from "./DemoTradersRanking";
// import AvTimerIcon from '@mui/icons-material/AvTimer';
// import Timer from '../timer';
// import LastTrade from '../data/contestTrade/LastTrade'
// import MDButton from '../../../components/MDButton';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import Button from '@mui/material/Button'
// import UsedPortfolio from './PnL/UsedPortfolio';
import { userContext } from '../../../../AuthContext';



function ContestResultPage () {
    const getDetails = useContext(userContext);
    const [contest,setContest] = useState();
    const [myRank, setMyRankProps] = useState([]);
    const location = useLocation();
    const  contestId  = location?.state?.contestId;
    // const isFromHistory = location?.state?.isFromHistory
    // const  isDummy  = location?.state?.isDummy;
    // const redirect = useRef(true);
    const nevigate = useNavigate();
    const isFromResult = true
    const  isDummy  = false

    let style = {
      textAlign: "center", 
      fontSize: ".99rem", 
      color: "#003366", 
      backgroundColor: "#CCCCCC", 
      borderRadius: "5px", 
      padding: "5px",  
      fontWeight: "600",
      display: "flex", 
      alignItems: "center"
    }

    console.log("Location in tradePage: ",location)
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

    React.useEffect(()=>{
      
      axios.get(`${baseUrl}api/v1/contest/${contestId}`)
      .then((res)=>{
              setContest(res?.data?.data);
              console.log(res?.data?.data)
      }).catch((err)=>{
          return new Error(err);
      })

      // axios.get(`${baseUrl}api/v1/contest/${contestId}/trades/myrank`, {
      //   withCredentials: true,
      //   headers: {
      //     Accept: "application/json",
      //     "Content-Type": "application/json",
      //     "Access-Control-Allow-Credentials": true
      //   },
      // })
      // .then((res)=>{
      //   setMyRank(res?.data?.data);
      //   console.log(res)
      // }).catch((err)=>{
      //    return new Error(err);
      // })

    },[])

    const reward = contest?.rewards;
    // const rank =1;
    const rank = myRank?.rank;

    console.log("rewards", reward , myRank)

    const myReward = reward?.filter((elem)=>{
        return elem?.rankStart <= rank && elem?.rankEnd >= rank;
    })

    const memoizedTradersRankingForHistory = useMemo(() => {
      return <TradersRanking isFromResult={isFromResult} contestId={contestId} reward={contest?.rewards} setMyRankProps={setMyRankProps}/>;
    }, [contestId, contest?.rewards, setMyRankProps, isFromResult]);
  

    return (
    <MDBox key={contest?._id} width="100%" bgColor="dark" color="light" p={2}>
        <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={6.5} mb={2}>
                <MDBox color="light" >
                  <MDBox display="flex" alignItems= "center" gap={"130px"} mb={1} >
                    <Button mb={2} color="light" style={{border: "1px solid white", borderRadius: "7px"}} onClick={()=>{nevigate('/battleground')}}>< FastRewindIcon/></Button>
                    <MDTypography mt={1.5} color="light"  style={{fontWeight:700, filter: isDummy && 'blur(2px)'}}>
                        {contest?.contestName}
                    </MDTypography>
                  </MDBox>

                  <MDTypography style={style} mt={1.5} color="light" display="flex" justifyContent="center">
                        Contest Ended
                  </MDTypography>

                  <MDTypography  mt={8}  style={{fontWeight:500}} color="light" display="flex" justifyContent="center">
                        {(myReward?.length && myReward[0]?.reward) && `Congratulation's ${getDetails?.userDetails?.name} you have won`}
                  </MDTypography>
                  <MDTypography  mt={3}  style={{fontWeight:700}} color="light" display="flex" justifyContent="center">
                        {(myReward?.length && myReward[0]?.reward) && `${myReward[0]?.reward} ${myReward[0]?.currency}`}
                  </MDTypography>

                  <MDTypography  mt={4}  style={{fontWeight:600}} color="light" display="flex" justifyContent="center">
                        Practice and learn with stoxhero and earn more.
                  </MDTypography>
                  

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
export default memo(ContestResultPage);

