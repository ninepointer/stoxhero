import React, {useEffect, useState} from 'react';
import YouTube from 'react-youtube';
import { Grid } from '@mui/material';
import MDSnackbar from "../../../components/MDSnackbar";
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';
import {Link} from 'react-router-dom'


function YouTubeVideo({updatedDocument, setUpdatedDocument}) {
    // YouTube video options
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    console.log("Updated Category Data: ",updatedDocument)

    async function onDelete(e,id){
      console.log(e, id)
      e.preventDefault()
      // const res = await fetch(`${baseUrl}api/v1/tutorialcategory/delete/${id}`, {
      //     method: "PATCH",
      //     credentials:"include",
      //     headers: {
      //         "content-type" : "application/json",
      //         "Access-Control-Allow-Credentials": true
      //     },
      //     body: JSON.stringify({
      //         isDeleted: true 
      //     })
      // });
  
      // const data = await res.json();
      // console.log(data);
      // if (data.status === 422 || data.error || !data) {
      //     openErrorSB("Error",data.error)
      // } else {
      //     openSuccessSB("Video Deleted", "Deleted Successfully")
      //     console.log("entry succesfull");
      // }
  }

  const [title,setTitle] = useState('')
  const [content,setContent] = useState('')

  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = (title,content) => {
      setTitle(title)
      setContent(content)
      setSuccessSB(true);
  }
const closeSuccessSB = () => setSuccessSB(false);
const renderSuccessSB = (
  <MDSnackbar
    color="success"
    icon="check"
    title={title}
    content={content}
    open={successSB}
    onClose={closeSuccessSB}
    close={closeSuccessSB}
    bgWhite="info"
  />
);

const [errorSB, setErrorSB] = useState(false);
const openErrorSB = (title,content) => {
  setTitle(title)
  setContent(content)
  setErrorSB(true);
}
const closeErrorSB = () => setErrorSB(false);

const renderErrorSB = (
  <MDSnackbar
    color="error"
    icon="warning"
    title={title}
    content={content}
    open={errorSB}
    onClose={closeErrorSB}
    close={closeErrorSB}
    bgWhite
  />
);

    const opts = {
      height: '301',
      width: '100%',
      modestbranding:1,
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 0,
      },
    };

    // useEffect(()=>{
    //   setVideos(tutorialCategory?.categoryVideos?.length)
    // })
  
    // YouTube video ID
    const videoId1 = '6wW8k-8zTXY';
    const videoId2 = 't0_i2YiCQB4';
  
    return (
        <MDBox bgColor="light" color="light" mt={2} mb={1} p={2} borderRadius={10} minHeight='100vh'>
            
            <Grid container spacing={2}>
              
                {updatedDocument?.categoryVideos?.map((elem)=>{
                 return(
                <>
                   <Grid item xs={12} md={6} lg={6}>
                        <MDBox display="flex" justifyContent='space-between' p={1}>
                        <MDTypography fontWeight='bold'>{elem?.title}</MDTypography>
                        <MDButton 
                          variant='contained' 
                          color='warning' 
                          size='small'
                        >
                          Edit
                        </MDButton>
                        <MDButton 
                          variant='contained' 
                          color='error' 
                          size='small'
                          onClick={(e)=>{onDelete(e,elem?._id)}}
                        >
                          Delete
                        </MDButton>
                        </MDBox>
                        <YouTube videoId={elem?.videoId} opts={opts} />
                    </Grid>
                </>)
                })}
                </Grid>
        </MDBox>
    );
  }
  
  export default YouTubeVideo;