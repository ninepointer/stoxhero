import {useState, useEffect, useContext} from 'react';
import { useRef, useCallback } from 'react';
import axios from "axios";
import MDBox from '../../../components/MDBox';
import Grid from "@mui/material/Grid";
import { userContext } from '../../../AuthContext';
import {useNavigate, useLocation} from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ReactGA from "react-ga"
import TopPerformer from '../data/topPerformerCompleteList'
import {CircularProgress} from "@mui/material";


export default function Dashboard() {
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/";
  let [carouselData, setCarouselData] = useState([]);
  let [topPerformerData, setTopPerformerData] = useState([]);
  let [startOfWeek, setStartOfWeek] = useState([]);
  let [endOfWeek, setEndOfWeek] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tradingData, setTradingData] = useState();
  const getDetails = useContext(userContext);
  const userId = getDetails.userDetails._id;


  useEffect(() => {
    ReactGA.pageview(window.location.pathname)
    capturePageView()
  }, []);
  let page = 'TopPerformerFullList'
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


  useEffect(() => {
    setIsLoading(true);
    let call4 = axios.get(`${baseUrl}api/v1/dailycontest/weeklytopperformerfulllist`, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
    });
    Promise.all([call4])
      .then(([api1Response3]) => {
        setTopPerformerData(api1Response3?.data?.data);
        setStartOfWeek(api1Response3?.data?.startOfWeek);
        setEndOfWeek(api1Response3?.data?.endOfWeek);
        console.log(api1Response3?.data?.data,api1Response3?.data?.startOfWeek,api1Response3?.data?.endOfWeek)
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  return (
    <MDBox bgColor="light" color="light" mt={2} mb={1} borderRadius={10} minHeight="auto" width='100%'>
        
        <Grid container spacing={0.75} xs={12} md={12} lg={12} display='flex' justifyContent='space-between' alignItems='start' flexDirection='row'>
          <Grid item xs={12} md={12} lg={12} mt={1}>
            {!isLoading ? 
            <MDBox style={{ backgroundColor: "white", borderRadius: 5 }}>
              <TopPerformer topPerformer={topPerformerData} startOfWeek={startOfWeek} endOfWeek={endOfWeek}/>
            </MDBox>
            :
            <MDBox mt={5} mb={5} display='flex' justifyContent='center' style={{borderRadius: 5 }}>
              <CircularProgress color="info" />
            </MDBox>}
          </Grid>
        </Grid>

    </MDBox>
  );
}


