import React,{useState, useEffect, memo, useMemo, useCallback, useRef, useContext} from 'react'
// import { io } from "socket.io-client";
import MDBox from '../../../../components/MDBox'
import Grid from '@mui/material/Grid'
import MDTypography from '../../../../components/MDTypography'
// import MDButton from '../../../components/MDButton'
// import Logo from '../../../assets/images/logo1.png'
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
import winnerCup from "../../../../assets/images/winnerImage.jpg"
import loose from "../../../../assets/images/lost.jpg"
import { CircularProgress } from "@mui/material";




function ContestResultPage () {
    const getDetails = useContext(userContext);
    // const [contest,setContest] = useState();
    const [myRank, setMyRankProps] = useState([]);
    const location = useLocation();
    const  contestId  = location?.state?.contestId;
    const contest = location?.state?.contest
    // const  isDummy  = location?.state?.isDummy;
    // const redirect = useRef(true);
    const nevigate = useNavigate();
    const [isLoading,setIsLoading] = useState(true)
    const isFromResult = true
    const  isDummy  = false

    let style = {
      textAlign: "center", 
      fontSize: ".99rem", 
      color: "#003366", 
      backgroundColor: "white", 
      borderRadius: "5px", 
      padding: "5px",  
      fontWeight: "600",
      display: "flex", 
      alignItems: "center"
    }

    console.log("Location in tradePage: ",location)
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

    React.useEffect(()=>{
      
      axios.get(`${baseUrl}api/v1/contest/${contestId}`)
      .then((res)=>{
              // setContest(res?.data?.data);
              console.log(res?.data?.data)
              setIsLoading(false)
      }).catch((err)=>{
          return new Error(err);
      })


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
      <>
      {isLoading ?
        <Grid mt={1} mb={1} display="flex" width="100%" justifyContent="center" alignItems="center">
            <CircularProgress color="light" />
        </Grid>

        :
      <MDBox key={contest?._id} width="100%" bgColor="dark" color="light" p={2}>
          <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={6.5} mb={2}>
                  <MDBox color="light" >
                    <MDBox display="flex" alignItems= "center" gap={"130px"} mb={1} >
                      <Button mb={2} color="light" style={{border: "1px solid white", borderRadius: "7px"}} onClick={()=>{nevigate('/battlestreet')}}>< FastRewindIcon/></Button>
                      <MDTypography mt={1.5} color="light"  style={{fontWeight:700, filter: isDummy && 'blur(2px)'}}>
                          {contest?.contestName}
                      </MDTypography>
                    </MDBox>

                    <MDTypography style={style} mt={1.5} color="light" display="flex" justifyContent="center">
                          Battle Ended
                    </MDTypography>

                    {/* <img style={{ marginTop: "10px",  maxWidth: '100%', height: 'auto', borderRadius: "5px" }} src={winnerCup} />

                    <MDTypography  mt={8}  style={{fontWeight:500}} color="light" display="flex" justifyContent="center">
                          {(myReward?.length && myReward[0]?.reward) && `Congratulation's ${getDetails?.userDetails?.name} you have won`}
                    </MDTypography>
                    <MDTypography  mt={3}  style={{fontWeight:700}} color="light" display="flex" justifyContent="center">
                          {(myReward?.length && myReward[0]?.reward) && `${myReward[0]?.reward} ${myReward[0]?.currency}`}
                    </MDTypography> */}

                    {(myReward?.length && myReward[0]?.reward) ?
                    <div style={{position: 'relative'}}>
                      <img style={{marginTop: '10px', maxWidth: '100%', height: 'auto', borderRadius: '5px', display: 'block'}} src={winnerCup} />
                      <div style={{position: 'absolute', top: '10%', left: '50%', transform: 'translate(-50%, -50%)', color: '#ffffff', textAlign: 'center', width: '100%', maxWidth: '600px'}}>
                        <MDTypography mt={5} style={{fontWeight: 700, fontSize: "15px"}} color="dark" display="flex" justifyContent="center">
                          {(myReward?.length && myReward[0]?.reward) && `Congratulations ${getDetails?.userDetails?.employeeid}`}
                        </MDTypography>
                        <MDTypography mt={2} style={{fontWeight: 600, fontSize: "13px"}} color="dark" display="flex" justifyContent="center">
                          {rank ? (myReward?.length && myReward[0]?.reward) && `Your rank is ${rank} and you have won` : "Please wait while your rank is loading"}
                        </MDTypography>
                        <MDTypography mt={2} style={{fontWeight: 700}} color="dark" display="flex" justifyContent="center">
                          {(myReward?.length && myReward[0]?.reward) && `${myReward[0]?.reward} ${myReward[0]?.currency}`}
                        </MDTypography>
                      </div>
                    </div>
                    :
                    <div style={{position: 'relative'}}>
                    <img style={{marginTop: '10px', maxWidth: '100%', height: 'auto', borderRadius: '5px', display: 'block'}} src={loose} />
                    <div style={{position: 'absolute', top: '10%', left: '50%', transform: 'translate(-50%, -50%)', color: '#ffffff', textAlign: 'center', width: '100%', maxWidth: '600px'}}>
                      <MDTypography mb={3.5} style={{fontWeight: 700, fontSize: "15px"}} color="dark" display="flex" justifyContent="center">
                        {rank ? `Hey ${getDetails?.userDetails?.employeeid}, Your rank is ${rank}` : "Please wait while your rank is loading"}
                      </MDTypography>
                      {/* <MDTypography style={{fontWeight: 600, fontSize: "13px"}} color="dark" display="flex" justifyContent="center">
                        {`Your rank is ${rank}`}
                      </MDTypography> */}

                    </div>
                    <MDTypography   style={{fontWeight:600}} color="light" display="flex" justifyContent="center">
                          Practice and learn more with stoxhero and earn.
                      </MDTypography>
                  </div>

                    }
                    

                  </MDBox>
              </Grid>

              <Grid item xs={0} md={0} lg={0.5}>
                  <Divider orientation="vertical" style={{backgroundColor: 'white', height: '100%'}} />
              </Grid>
              {memoizedTradersRankingForHistory}


          </Grid>
      </MDBox>
        }
        </>
  )

}
export default memo(ContestResultPage);

