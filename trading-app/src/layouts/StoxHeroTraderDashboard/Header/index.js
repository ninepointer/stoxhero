import {useState, useEffect, useContext} from 'react';
import { useRef, useCallback } from 'react';
import axios from "axios";
import MDBox from '../../../components/MDBox';
import Grid from "@mui/material/Grid";
import {Link} from 'react-router-dom'
import Carousel from '../data/carouselItems'
import Performance from '../data/performance'
import Summary from '../data/summary'
import { userContext } from '../../../AuthContext';
import UpcomingContest from '../data/ongoingContest'
import DailyChallenge from '../data/dailyChallenge'

export default function Dashboard() {
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/";
  let [carouselData, setCarouselData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tradingData, setTradingData] = useState();
  const getDetails = useContext(userContext);
  const userId = getDetails.userDetails._id;
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(true);
  const [stats, setStats] = useState();
  const [timeframe, setTimeframe] = useState('this month');
  const [tradeType, setTradeType] = useState('virtual');
  const [summary, setSummary] = useState();

  useEffect(() => {
    setIsLoading(true);
    let call1 = axios.get(`${baseUrl}api/v1/carousels/home`, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
    });
    let call2 = axios.get(`${baseUrl}api/v1/virtualtradingperformance/traderstats/${userId}`, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
    });
    let call3 = axios.get(`${baseUrl}api/v1/post/posts`, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
    });
    Promise.all([call1, call2, call3])
      .then(([api1Response, api1Response1, api1Response2]) => {
        setCarouselData(api1Response.data.data);
        console.log(api1Response1.data.data)
        setTradingData(api1Response1.data.data);
        setPosts(api1Response2.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, []);
  const getTraderStats = async() =>{
    let url=`${baseUrl}api/v1/userdashboard/stats?tradeType=${tradeType}&timeframe=${timeframe}`;
    switch(tradeType){
      case 'virtual':
        url = `${baseUrl}api/v1/userdashboard/stats?tradeType=${tradeType}&timeframe=${timeframe}`
        break;
      case 'tenX':
        url = `${baseUrl}api/v1/userdashboard/tenxstats?timeframe=${timeframe}`
        break;
      case 'contest':
        url =`${baseUrl}api/v1/userdashboard/conteststats?timeframe=${timeframe}`
        break;
      default:
        url = `${baseUrl}api/v1/userdashboard/stats?tradeType=${tradeType}&timeframe=${timeframe}`
    }

    try{
      const res = await axios.get(url, {withCredentials:true});
      setStats(res.data.data);
    }catch(e){
      console.log(e);
    }
  }
  const getTraderSummary = async() => {
    try{
    const res = await axios.get(`${baseUrl}api/v1/userdashboard/summary`, {withCredentials:true});
    setSummary(res.data.data);
  }catch(e){
    console.log(e);
  }
  }
  useEffect(()=>{
    getTraderSummary()
  },[])
  useEffect(()=>{
    getTraderStats();
  },[timeframe, tradeType])  
  const CarouselImages = [];

  carouselData.forEach((e) => {
    CarouselImages.push({
      carouselImage: e?.carouselImage,
      clickable: e?.clickable,
      linkToCarousel: e?.linkToCarousel,
      window: e?.window,
      visibility: e?.visibility,
    });
  });

  return (
    <MDBox bgColor="light" color="light" mt={2} mb={1} borderRadius={10} minHeight="auto" width='100%'>
      {CarouselImages?.length && (
        <Grid container spacing={1} mb={2} lg={12} display="flex" justifyContent="center" alignItems="center">
          <Grid item xs={12} md={6} lg={12}>
            <Carousel items={CarouselImages} />
          </Grid>
        </Grid>
      )}
      
        <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='space-between' alignItems='start' flexDirection='row'>
        
        <Grid item xs={12} md={12} lg={8} display='flex' justifyContent="center" alignItems="center">
        <Grid container xs={12} md={12} lg={12} mb={1} display="flex" justifyContent="center" alignItems="center">
          
        <Grid item xs={12} md={6} lg={12}>
            <MDBox style={{ backgroundColor: "white", borderRadius: 5 }}>
              <DailyChallenge summary={summary}/>
            </MDBox>
          </Grid>
          
          <Grid item xs={12} md={6} lg={12} mt={.5}>
            <MDBox style={{ backgroundColor: "white", borderRadius: 5 }}>
              <Summary summary={summary}/>
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={12} mt={0.5}>
            <MDBox style={{ backgroundColor: "white", borderRadius: 5 }}>
              {stats && <Performance tradingData={stats} timeframe={timeframe} setTimeframe={setTimeframe} tradeType={tradeType} setTradeType={setTradeType}/>}
            </MDBox>
          </Grid>

        </Grid>
        </Grid>

        <Grid item xs={12} md={12} lg={4} display='flex' justifyContent="center" alignItems="top">
        <Grid container xs={12} md={12} lg={12} mb={1} display="flex" justifyContent="center" alignItems="top">
          <Grid item xs={12} md={6} lg={12}>
            <MDBox style={{ backgroundColor: "white", borderRadius: 5 }}>
              <UpcomingContest/>
            </MDBox>
          </Grid>
        </Grid>
        </Grid>
        </Grid>

    </MDBox>
  );
}


