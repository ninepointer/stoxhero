import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { userContext } from "../../../AuthContext";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import CarouselImage from '../../../assets/images/carousel.png'
// import CarouselImage1 from '../../../assets/images/abs1.png'
import CarouselImage1 from '../../../assets/images/leaderboard.png'
import CarouselImage2 from '../../../assets/images/abs2.png'
import CarouselImage3 from '../../../assets/images/abs3.png'
import CarouselImage4 from '../../../assets/images/abs4.png'
import { Grid } from "@mui/material";
import MDButton from "../../../components/MDButton";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDAvatar from "../../../components/MDAvatar";
import DefaultProfilePic from "../../../assets/images/default-profile.png";


export default function SimpleSlider() {
    const [userDetail,setuserDetail] = useState([]);
    const [profilePhoto,setProfilePhoto] = useState(DefaultProfilePic);
    const getDetails = useContext(userContext);

    return (
                <Grid item xs={12} md={6} lg={12} ml={1.5} mt={1.5} style={{height:255}}>
                    <MDBox bgColor="dark" borderRadius={6} p={2} display="flex"
                    style={{ 
                        backgroundImage: `url(${CarouselImage1})`,
                        backgroundSize: 'cover',
                        // backgroundPosition: 'center',
                        borderRadius: 10,
                        minHeight:'100%',
                      }}
                    >
                        <Grid container display="flex" justifyContent="center" alignItems="center" alignContent="center">
                            <Grid item mb={1} xs={12} md={12} lg={12} display="flex" justifyContent="center" alignItems="center">
                                <MDAvatar 
                                src={getDetails?.userDetails?.profilePhoto?.url ? getDetails?.userDetails?.profilePhoto?.url : profilePhoto} 
                                alt="profile-image" size="xl" shadow="sm" />
                            </Grid>
                            <Grid item mb={1} xs={12} md={12} lg={12} display="flex" justifyContent="center" alignItems="center">
                                <MDTypography fontSize={18} color="light">{getDetails?.userDetails?.employeeid}</MDTypography>
                            </Grid>
                            <Grid item mb={1} xs={12} md={12} lg={12} display="flex" justifyContent="center" alignItems="center">
                                <MDTypography fontSize={18} color="light">₹17,800.40</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display="flex" justifyContent="center" alignItems="center">
                                <MDTypography fontSize={12} color="success">+90.10(+0.51%)</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display="flex" justifyContent="center" alignItems="center">
                                <MDTypography fontSize={12} color="light">NIFTY 50</MDTypography>
                            </Grid>
                        </Grid>
                    </MDBox>
                </Grid>
    );
  }
// export default SimpleSlider;

