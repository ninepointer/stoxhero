import React, {useEffect, useState} from 'react';
import YouTube from 'react-youtube';
import { CircularProgress, Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';
import {Link} from 'react-router-dom'
import { useNavigate, useLocation } from "react-router-dom";


function CategoryVideos() {
    const location = useLocation();
    const id = location?.state?.data;
    console.log(id)
    const [isLoading, setIsLoading] = useState(false);

    React.useEffect(()=>{
      setIsLoading(true);
      setTimeout(()=>{
        setIsLoading(false)
      },1000)
    },[])


    
    console.log("Updated Category Data: ",id)
    const opts = {
      height: '200',
      width: '100%',
      // modestbranding:1,
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 0,
      },
    };

  
    return (
        <MDBox bgColor="light" color="light" mt={2} mb={1} p={2} borderRadius={10} minHeight='100vh'>
            {isLoading ? 
            <MDBox display='flex' justifyContent='center' alignItems='center' m={10} style={{minHeight:'auto'}}>
              <CircularProgress color='info' size={80}/>
            </MDBox>
              :
              <>
              <Grid container spacing={3}>
                {id?.categoryVideos?.map((elem)=>{
                 return(
                <>
                   <Grid item xs={12} md={6} lg={4}>
                        <MDTypography fontSize={15} fontWeight='bold' display='flex' justifyContent='center' alignItems='center'>{elem?.title}</MDTypography>
                        <MDBox>
                          <YouTube videoId={elem?.videoId} opts={opts} />
                        </MDBox>
                    </Grid>
                </>)
                })}
                </Grid>
              </>
            }
            
        </MDBox>
    );
  }
  
  export default CategoryVideos;