import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React, { Component } from "react";
import Slider from "react-slick";
import { Grid } from "@mui/material";
import { padding } from "@mui/system";
import { Button, CardActionArea, CardActions } from '@mui/material';
import { Link } from 'react-router-dom';
import MDBox from "../../../components/MDBox";

export default class Carousel extends Component {
  render() {
    const items = this.props.items;
    const settings = {
      dots: false,
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      speed: 5000,
      autoplaySpeed: 1,
      cssEase: "linear",
      variableWidth: true,
      centerPadding: '2px',
      arrows: true,
      responsive: [
        {
          breakpoint: 960 || 400, // Adjust this breakpoint as needed
          settings: {
            slidesToShow: 1, // Number of items to show on mobile
          },
        },
      ],
    };
    return (
      <MDBox style={{padding:"20px 30px 20px 30px",borderRadius:5,backgroundColor:"#2d2d2d"}}>
        <Slider {...settings}>
        {items?.map((elem)=>{
        return (
        <Grid container>
            <Grid item xs={12} md={4} lg={4} display='flex' justifyContent='center'>
              <Button style={{ visibility: "visible" }} disabled={!elem?.clickable} onClick={()=>{window.open(elem?.linkToCarousel,elem?.window === "In App" ? "" : "_blank")}}><img src={elem?.carouselImage} style={{padding:-5,marginLeft:"5px",marginRight:"5px",borderRadius:"5px", width:"200px", height:"200px"}}></img></Button>
            </Grid>
        </Grid>)
        })}
        </Slider>
      </MDBox>
    );
  }
}