// import React, { Component } from 'react';
// import Slider from 'react-slick';
// import CarouselImage from '../../../assets/images/carousel.png'

// class Carousel extends Component {
//   render() {
//     const settings = {
//       dots: true,
//       infinite: true,
//       speed: 500,
//       slidesToShow: 3,
//       slidesToScroll: 1,
//       autoplay: true,
//       autoplaySpeed: 2000,
//       responsive: [
//         {
//           breakpoint: 1024,
//           settings: {
//             slidesToShow: 2,
//             slidesToScroll: 1,
//             infinite: true,
//             dots: true,
//           },
//         },
//         {
//           breakpoint: 768,
//           settings: {
//             slidesToShow: 1,
//             slidesToScroll: 1,
//           },
//         },
//       ],
//     };

//     return (
//       <Slider {...settings}>
//         <div>
//           <img width={600} height={400} src={CarouselImage} alt="" />
//         </div>
//         <div>
//           <img width={600} height={400} src={CarouselImage} alt="" />
//         </div>
//         <div>
//           <img width={600} height={400} src={CarouselImage} alt="" />
//         </div>
//         <div>
//           <img width={600} height={400} src={CarouselImage} alt="" />
//         </div>
//         <div>
//           <img width={600} height={400} src={CarouselImage} alt="" />
//         </div>
//         <div>
//           <img width={600} height={400} src={CarouselImage} alt="" />
//         </div>
//       </Slider>
//     );
//   }
// }

// export default Carousel;

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import Slider from "react-slick";
import CarouselImage from '../../../assets/images/carousel.png'
// import CarouselImage1 from '../../../assets/images/abs1.png'
import CarouselImage1 from '../../../assets/images/monday.png'
import CarouselImage2 from '../../../assets/images/thursday.png'
import CarouselImage3 from '../../../assets/images/friday.png'
import CarouselImage4 from '../../../assets/images/tuesday.png'
import { Grid } from "@mui/material";
import MDButton from "../../../components/MDButton";
import MDBox from "../../../components/MDBox";

export default function SimpleSlider() {
    var settings = {
      dots: true,
      infinite: true,
      speed: 1000,
      slidesToShow: 3,
      slidesToScroll: 1,
      // backgroundColor:"black",
      autoplay: true,
      autoplaySpeed: 2500, // This value is in milliseconds
      arrows: false
    };
    return (
      <Grid container xs={12} md={6} lg={12}>
      <Slider {...settings} style={{maxWidth:'100%',marginRight:2}}>
      
        <MDBox padding={1.5} style={{borderRadius:4}} border="none">
          <button
            variant="contained" color="dark" size="small"
            style={{border:'none',borderRadius:'50%'}}
            onClick={() => {
              // handle button click
            }}
          >
            <Grid item xs={12} md={6} lg={12}>
              <img style={{ width: "100%", height: '100%'}} src={CarouselImage1} />
            </Grid>
          </button>
        </MDBox>

        <MDBox padding={1.5} style={{borderRadius:4}} border="none">
          <button
            variant="contained" color="dark" size="small"
            style={{border:'none'}}
            onClick={() => {
              // handle button click
            }}
          >
            <Grid item xs={12} md={6} lg={12}>
              <img style={{ width: "100%", height: '100%'}} src={CarouselImage2} />
            </Grid>
          </button>
        </MDBox>

        <MDBox padding={1.5} style={{borderRadius:4}} border="none">
          <button
            variant="contained" color="dark" size="small"
            style={{border:'none'}}
            onClick={() => {
              // handle button click
            }}
          >
            <Grid item xs={12} md={6} lg={12}>
              <img style={{ width: "100%", height: '100%', objectFit: 'cover', objectPosition: 'center'}} src={CarouselImage3} />
            </Grid>
          </button>
        </MDBox>

        <MDBox padding={1.5} style={{borderRadius:4, display: 'flex'}} >
          <button
            variant="contained" color="dark" size="small"
            style={{border:'none'}}
            onClick={() => {
              // handle button click
            }}
          >
            <Grid item xs={12} md={6} lg={12}>
              <img style={{ width: "100%", height: '100%', objectFit: 'cover', objectPosition: 'center'}} src={CarouselImage4} />
            </Grid>
          </button>
        </MDBox>
      
      </Slider>
      </Grid>
    );
  }
// export default SimpleSlider;

