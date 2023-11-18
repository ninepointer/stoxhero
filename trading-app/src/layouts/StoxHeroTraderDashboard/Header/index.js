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
import {CircularProgress} from "@mui/material";
import MDButton from '../../../components/MDButton';
import {useNavigate, useLocation} from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ContestCard from '../data/contestCard'
import MessagePopUp from '../../../MessagePopup';
import ReactGA from "react-ga"
import TopContestPortfolios from '../data/topContestPortfolios'
import TestZoneChampions from '../data/testZoneChampions'
import PracticeAndPrepare from '../data/practiceAndPrepare'


export default function Dashboard() {
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/";
  let [carouselData, setCarouselData] = useState([]);
  let [topPerformerData, setTopPerformerData] = useState([]);
  let [lastPaidContests, setLastPaidContests] = useState([]);
  let [lastContestDate, setLastContestDate] = useState([]);
  let [startOfWeek, setStartOfWeek] = useState([]);
  let [endOfWeek, setEndOfWeek] = useState([]);
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
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    ReactGA.pageview(window.location.pathname)
    capturePageView()
  }, []);
  let page = 'TraderDashboard'
  let pageLink = window.location.pathname
  async function capturePageView(){
        await fetch(`${baseUrl}api/v1/pageview/${page}${pageLink}`, {
        method: "POST",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
    });
  }

  async function captureCarouselClick(id){
    await fetch(`${baseUrl}api/v1/carousels/carouselclick/${id}`, {
    method: "PATCH",
    credentials:"include",
    headers: {
        "content-type" : "application/json",
        "Access-Control-Allow-Credentials": true
    },
});
}

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Adjust the number of slides to show
    slidesToScroll: 1,
    padding:1,
    responsive: [
      {
        breakpoint: 1024, // Adjust breakpoints as needed
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 900, // Adjust breakpoints as needed
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 600, // Adjust breakpoints as needed
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  }

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
    let call4 = axios.get(`${baseUrl}api/v1/dailycontest/weeklytopperformer`, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
    });
    let call5 = axios.get(`${baseUrl}api/v1/dailycontest/lastpaidcontestchampions`, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
    });
    Promise.all([call1, call2, call3, call4, call5])
      .then(([api1Response, api1Response1, api1Response2, api1Response3, api1Response4]) => {
        setCarouselData(api1Response.data.data);
        setTradingData(api1Response1.data.data);
        setPosts(api1Response2.data.data);
        setTopPerformerData(api1Response3?.data?.data);
        setStartOfWeek(api1Response3?.data?.startOfWeek);
        setEndOfWeek(api1Response3?.data?.endOfWeek);
        setLastPaidContests(api1Response4?.data?.data);
        setLastContestDate(api1Response4?.data?.date);
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
  
  useEffect(() => {
    if (location?.state && location?.state?.showPopup) {
      setModalVisible(true);
    }
  }, [location.state]);
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

  const handleButtonClick = (e) => {
    if (e?.clickable) {
      navigate(`/${e?.linkToCarousel}`);
      captureCarouselClick(e?._id);
    }
  }

  return (
    <MDBox bgColor="light" color="light" mt={2} mb={1} borderRadius={10} minHeight="auto" width='100%'>
      {carouselData?.length && 
      (<Slider {...settings}>
                {/* Your MDBox components go here */}
                  {carouselData?.map((e)=>{
                    return(
                    <div>
                    <MDButton 
                      style={{
                        width: '98%',
                        height: '180px',
                        padding: 0,
                        margin: 0,
                        borderRadius: 5,
                        position: 'relative', // Make the container relative for positioning the image
                      }}
                      onClick={() => handleButtonClick(e)}
                    >
                      <img
                        src={e?.carouselImage}
                        alt="Contest Image"
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: 5,
                          objectFit: 'cover', // Ensure the image covers the entire space without distortion
                        }}
                      />
                    </MDButton>
                  </div>
                    )
                  })}
        
          </Slider>)
      }
        <Grid container spacing={0.75} xs={12} md={12} lg={12} display='flex' justifyContent='space-between' alignItems='start' flexDirection='row'>
          <Grid item xs={12} md={12} lg={12} mt={1}>
            
              {!isLoading ? 
              
              <MDBox style={{ backgroundColor: "white", borderRadius: 5 }}>
                <TopContestPortfolios topPerformer={topPerformerData} startOfWeek={startOfWeek} endOfWeek={endOfWeek}/>
                </MDBox>
                :
                <MDBox mt={5} mb={5} display='flex' justifyContent='center' style={{borderRadius: 5 }}>
                  <CircularProgress color="info" />
                </MDBox>
              }
            
          </Grid>
        </Grid>

        <Grid container spacing={0.75} xs={12} md={12} lg={12} display='flex' justifyContent='space-between' alignItems='start' flexDirection='row'>
          <Grid item xs={12} md={12} lg={12} mt={1}>
            
              {!isLoading ? 
              
              <MDBox style={{ backgroundColor: "white", borderRadius: 5 }}>
                <PracticeAndPrepare/>
                </MDBox>
                :
                <MDBox mt={5} mb={5} display='flex' justifyContent='center' style={{borderRadius: 5 }}>
                  <CircularProgress color="info" />
                </MDBox>
              }
            
          </Grid>
        </Grid>

        <Grid container spacing={0.75} xs={12} md={12} lg={12} display='flex' justifyContent='space-between' alignItems='start' flexDirection='row'>
          <Grid item xs={12} md={12} lg={12} mt={1}>
            
              {!isLoading ? 
              
              <MDBox style={{ backgroundColor: "white", borderRadius: 5 }}>
                <TestZoneChampions lastPaidContests={lastPaidContests} lastContestDate={lastContestDate}/>
                </MDBox>
                :
                <MDBox mt={5} mb={5} display='flex' justifyContent='center' style={{borderRadius: 5 }}>
                  <CircularProgress color="info" />
                </MDBox>
              }
            
          </Grid>
        </Grid>
      
        <Grid container spacing={0.75} xs={12} md={12} lg={12} display='flex' justifyContent='space-between' alignItems='start' flexDirection='row'>

        <Grid item xs={12} md={12} lg={12} display='flex' justifyContent="center" alignItems="center">
        
        <Grid container xs={12} md={12} lg={12} mb={1} display="flex" justifyContent="center" alignItems="center">
          
          <Grid item xs={12} md={12} lg={12} mt={1}>
          {!isLoading ?
            <MDBox style={{ backgroundColor: "white", borderRadius: 5 }}>
              <Summary summary={summary}/>
            </MDBox>
          :
          <MDBox mt={5} mb={5} display='flex' justifyContent='center' style={{borderRadius: 5 }}>
            <CircularProgress color="info" />
          </MDBox>}
          </Grid>

          <Grid item xs={12} md={12} lg={12} mt={1}>
            <MDBox style={{ backgroundColor: "white", borderRadius: 5 }}>
              {stats && <Performance tradingData={stats} timeframe={timeframe} setTimeframe={setTimeframe} tradeType={tradeType} setTradeType={setTradeType}/>}
            </MDBox>
          </Grid>
        {modalVisible && <MessagePopUp/>}
        </Grid>

        </Grid>

        </Grid>

    </MDBox>
  );
}


