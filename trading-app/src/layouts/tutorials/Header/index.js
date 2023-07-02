import React, {useState} from 'react';
import YouTube from 'react-youtube';
import axios from "axios";
import { CircularProgress, Grid } from '@mui/material';
// import Box from '@mui/material/Box';
// import Tab from '@mui/material/Tab';
// import TabContext from '@mui/lab/TabContext';
// import TabList from '@mui/lab/TabList';
// import TabPanel from '@mui/lab/TabPanel';
// import { CircularProgress, Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';
import {Link} from 'react-router-dom'
import VideoTutorial from '../../../assets/images/VideoTutorial.jpg'



function YouTubeVideo() {
    // YouTube video options
    const [tutorialCategories,setTutorialCategories] = useState([])
    const [isLoading,setIsLoading] = useState(false)
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
    React.useEffect(()=>{
      setIsLoading(true)
      axios.get(`${baseUrl}api/v1/tutorialcategory/`)
      .then((res)=>{
        console.log(res?.data?.data)
        setTutorialCategories(res?.data?.data);
        setTimeout(()=>{
          setIsLoading(false)
        },500)
      //   setIsLoading(false).setTimeout(30000);
      }).catch((err)=>{
          return new Error(err)
      })    
  },[])

    const opts = {
      height: '301',
      width: '100%',
      modestbranding:1,
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 0,
      },
    };
  
    // YouTube video ID
    const videoId1 = '6wW8k-8zTXY';
    const videoId2 = 't0_i2YiCQB4';

      const buttonStyle = {
        // backgroundImage: `url(${VideoTutorial})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        minWidth: '100%',
        minHeight:'20vH'
        /* Add any other styles you want for the button */
      };
    
  
    return (
        <MDBox bgColor="dark" color="light" mt={2} mb={1} p={2} borderRadius={10} minHeight='auto'>
            {isLoading ? 
              <MDBox display='flex' justifyContent='center' m={10}>
                <CircularProgress color='info' size={80} />
              </MDBox>
            :
            
            <>
            <Grid container spacing={2}>
                {tutorialCategories?.map((elem)=>{
                  return(
                    <>
                    <Grid item xs={12} md={6} lg={3}>
                       <MDButton 
                          variant='contained' 
                          color='light'
                          // style={{minWidth:'100%'}}
                          style={buttonStyle}
                          component={Link}
                          to={{
                            pathname: `/tutorials/${elem?.categoryName}`,
                          }}
                          state={{data: elem}}
                        >
                          <MDBox>
                            <MDTypography color='dark' fontWeight='bold'>{elem?.categoryName}</MDTypography>
                          </MDBox>
                       </MDButton>
                    </Grid>
                    </>
                    
                  )
                })
                 
                }
            </Grid>
            </>
            }
        </MDBox>
    );
  }
  
  export default YouTubeVideo;
// export default function Videos() {

//   return (
   
//     <MDBox bgColor="dark" color="light" mt={2} mb={1} p={2} borderRadius={10} minHeight='100vh'>
        

//     </MDBox>
//   );
// }