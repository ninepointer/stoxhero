import { React, useState, useEffect, useContext } from "react";
import { userContext } from '../../../AuthContext';
import { useNavigate, useLocation } from "react-router-dom";
import ShareIcon from '@mui/icons-material/Share';
import ReactGA from "react-ga"
import Modal from 'react-modal';
import leaderboardbackground from '../../../assets/images/leaderboardbackground.png'

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDAvatar from "../../../components/MDAvatar";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import { Grid } from '@mui/material';
import axios from "axios"; 


import TenXB from '../../../assets/images/TenXB.png'
import TenXI from '../../../assets/images/TenXI.png'
import TenXA from '../../../assets/images/TenXA.png'
import TenXS from '../../../assets/images/TenXS.png'
import TenXG from '../../../assets/images/TenXG.png'
import TenXD from '../../../assets/images/TenXD.png'
import checklist from '../../../assets/images/checklist.png'
import ActiveDialogue from "../Header/activeDialogueBox";
import DialogueKnowMore from "../Header/dialogueBoxKnowMore";

function Header({ subscription, checkPayment, setCheckPayment, amount, name, id, walletCash, allowRenewal}) {
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [timeDifference, setTimeDifference] = useState([]);
    const getDetails = useContext(userContext);
    const navigate = useNavigate();
    const [userCount,setUserCount] = useState(0);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    let TenXIcon = TenXB

    useEffect(() => {
        ReactGA.pageview(window.location.pathname)
    }, []);

    if(subscription?.plan_name === 'TenX - Beginner Plan')
    {
        TenXIcon = TenXB
    }
    if(subscription?.plan_name === 'TenX - Intermediate Plan')
    {
        TenXIcon = TenXI
    }
    if(subscription?.plan_name === 'TenX - Advance Plan')
    {
        TenXIcon = TenXA
    }
    if(subscription?.plan_name === 'TenX - Silver Plan')
    {
        TenXIcon = TenXS
    }
    if(subscription?.plan_name === 'TenX - Gold Plan')
    {
        TenXIcon = TenXG
    }
    if(subscription?.plan_name === 'TenX - Diamond Plan')
    {
        TenXIcon = TenXD
    }

    const openYouTubeVideo = () => {
        // Replace 'VIDEO_URL' with the actual URL of the YouTube video
        console.log("Inside Open Youtube Video Function")
        const videoUrl = 'https://www.youtube.com/watch?v=a3_bmjv5tXQ';
        window.open(videoUrl, '_blank');
      };
    
    useEffect(()=>{
  
        let call2 = axios.get(`${baseUrl}api/v1/tenX/subscribercount/${subscription?._id}`, {
          withCredentials:true
        })            
        Promise.all([call2])
        .then(([api2Response]) => {
          // Process the responses here
          setUserCount(api2Response?.data?.data[0]?.count);
        })
        .catch((error) => {
          // Handle errors here
          console.error(error);
        });
    
    
      },[subscription])


    return (

      <MDBox
        style={{
        backgroundImage: `url(${leaderboardbackground})`, // Replace 'your-image-url.jpg' with the URL of your image
        backgroundSize: 'cover', // Adjust the size to cover the entire box
        backgroundRepeat: 'no-repeat', // Prevent the image from repeating
        backgroundPosition: 'center', // Center the image
        height: '60vH', 
        minWidth: '100%', 
        borderRadius: 5,
        }}
      >
      <Grid container spacing={0.5} xs={12} md={12} lg={12} display='flex' justifyContent='center'>
            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
            <MDBox>
                    <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                        <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                            <MDBox display='flex' justifyContent='center' flexDirection='column'>
                            <MDBox display='flex' justifyContent='center'><MDTypography fontSize={30} fontWeight='bold' color='light' style={{alignText:'center'}}>TenX Leaderboard</MDTypography></MDBox>
                            <MDBox display='flex' justifyContent='center'><MDTypography fontSize={20} color='light' style={{alignText:'center'}}>Coming Soon!</MDTypography></MDBox>
                            </MDBox>
                        </Grid>
                    </Grid>   
                </MDBox>
            </Grid>
      </Grid>
      </MDBox>
    );
}

export default Header;