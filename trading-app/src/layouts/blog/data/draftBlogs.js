
import React, {useState, useEffect} from 'react'
import axios from "axios";
import {apiUrl} from "../../../constants/constants.js"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea, Divider, Grid } from '@mui/material';
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import { Link} from "react-router-dom";
import moment from 'moment'


const PublishedBlogs = ({status}) => {
const [publishedBlogs,setPublishedBlogs] = useState([]);
let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

  useEffect(()=>{
    let call1 = axios.get(`${apiUrl}blogs/draft`,{
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
      setPublishedBlogs(api1Response.data.data)
    
    })
    .catch((error) => {
      // Handle errors here
      console.error(error);
    });
  },[])

    return (
      <>
      {publishedBlogs.length > 0 ?
        
          <MDBox>
            <Grid container spacing={2} bgColor="dark" display="flex" justifyContent="flex-start" alignItems='center'>
            {publishedBlogs?.map((elem, index)=>{

            return (

              <Grid key={elem?._id} item xs={12} md={4} lg={4} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
              <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
              <Card sx={{ minWidth: '100%', cursor:'pointer' }} component={Link} to={{pathname:`/blogdetails`}} state={{ data: elem }} >

              <CardActionArea>
                <Grid item xs={12} md={4} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%', height: 'auto'}}>
                  {/* <CardMedia
                    component="img"
                    height="180"
                    style={{maxWidth:'100%'}}
                    image={elem?.thumbnailImage?.url}
                    alt="green iguana"
                  /> */}
                  <img src={elem?.thumbnailImage?.url} style={{maxWidth: '100%',height: 'auto', borderTopLeftRadius:10, borderTopRightRadius:10}}/>
                </Grid>
                <Grid item xs={12} md={4} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%', height: 'auto'}}>
                  <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                    <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%', minHeight:60}}>
                    <MDTypography variant="h5" fontFamily='Segoe UI' fontWeight={400} style={{textAlign:'center'}}>
                      {elem?.blogTitle}
                    </MDTypography>
                    </MDBox>
                    <Divider style={{width:'100%'}}/>
                    <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                    <MDTypography variant='caption' fontSize={11}>
                      {`${moment.utc(elem?.publishedOn).utcOffset('+05:30').format('DD MMM YY')} • ${elem?.readingTime || 1} min read • ${elem?.viewCount || 0} views • ${elem?.reader.length || 0} reader`}
                    </MDTypography>
                    </MDBox>
                  </CardContent>
                </Grid>
                </CardActionArea>
              </Card>
              </Grid>
              </Grid>   
            )
            })}
            </Grid>
          </MDBox>
          :
         <Grid container spacing={1} xs={12} md={6} lg={12}>
          <Grid item mt={2} xs={6} md={3} lg={12} display="flex" justifyContent="center">
            <MDTypography color="light">No Draft Blogs(s)</MDTypography>
          </Grid>
         </Grid>
         } 

      </>
)}



export default PublishedBlogs;