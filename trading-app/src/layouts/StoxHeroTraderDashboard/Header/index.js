import {useState, useEffect} from 'react';
import axios from "axios";
import MDBox from '../../../components/MDBox';
import Grid from "@mui/material/Grid";
import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';
import {Link} from 'react-router-dom'
import Carousel from '../data/carouselItems'
import Performance from '../data/performance'
import Summary from '../data/summary'
import OptionChain from '../data/optionChain';
import VirtualTrading from '../data/virtualTrading'
import ten1 from '../../../assets/images/abs1.png'
import ten2 from '../../../assets/images/abs2.png'
import ten3 from '../../../assets/images/abs3.png'
import ten4 from '../../../assets/images/abs4.png'



export default function Dashboard() {
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  let [carouselData,setCarouselData] = useState([])
  
  useEffect(()=>{
    let call1 = axios.get((`${baseUrl}api/v1/carousels/home`),{
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                  },
                })
    Promise.all([call1])
    .then(([api1Response]) => {
      // Process the responses here
      setCarouselData(api1Response.data.data)
    })
    .catch((error) => {
      // Handle errors here
      console.error(error);
    });
    
  },[])

  const CarouselImages = []

  carouselData.forEach((e) => {
    CarouselImages.push(
      {
        carouselImage:e?.carouselImage,
        clickable:e?.clickable,
        linkToCarousel:e?.linkToCarousel, 
        window:e?.window,
        visibility:e?.visibility
      });
  });

  console.log("Carousel Images:",CarouselImages)


  return (
   
    <MDBox bgColor="light" color="light" mt={2} mb={1} borderRadius={10} minHeight='auto'>
  
          <Grid container spacing={1} mb={2} lg={12} display='flex' justifyContent='center' alignItems='center'>
            <Grid item xs={12} md={6} lg={12}>
              <Carousel items={CarouselImages}/>
            </Grid>
          </Grid>
           
          <Grid container spacing={1} mt={1} lg={12} style={{ height: '100%' }}>
            <Grid item xs={12} md={6} lg={12} style={{ height: '100%' }}>
              <Summary style={{ height: '100%' }}/>
            </Grid>
            <Grid item xs={12} md={6} lg={12} style={{ height: '100%' }}>
              <Performance/>
            </Grid>
          </Grid>

    </MDBox>
  );
}