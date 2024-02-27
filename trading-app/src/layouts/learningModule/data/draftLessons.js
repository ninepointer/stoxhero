
import React, {useState, useEffect} from 'react'
import Grid from "@mui/material/Grid";
import axios from "axios";
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDAvatar from "../../../components/MDAvatar";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import money from "../../../assets/images/money.png"
import { Link} from "react-router-dom";
import moment from 'moment'


const PublishedBlogs = ({status}) => {
const [blogCount, setBlogCount] = useState(0);
const [publishedBlogs,setPublishedBlogs] = useState([]);
let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  useEffect(()=>{
    let call1 = axios.get(`${baseUrl}api/v1/blogs/draft`,{
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

  function truncateText(text, maxLength) {
    if (text && text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
  }

    return (
      <>
      {publishedBlogs.length > 0 ?
        
          <MDBox>
            <Grid container spacing={2} bgColor="dark" display="flex" justifyContent="flex-start" alignItems='center'>
              {publishedBlogs?.map((e, index)=>{

                    return (
                      
                      <Grid key={e._id} item xs={12} md={12} lg={4} bgColor="dark" display="flex" justifyContent="flex-start" alignItems='flex-start'>
                      <MDBox padding={0} style={{borderRadius:4, minHeight:380}} display="flex" justifyContent="left" alignItems='flex-start'>
                      <MDButton 
                        variant="contained" 
                        color={"light"} 
                        size="small" 
                        style={{minHeight:380, alignItems:'flex-start'}}
                        component = {Link}
                        to={{
                            pathname: `/blogdetails`,
                          }}
                        state={{ data: e }}
                      >
                          <Grid container xs={12} md={6} lg={12} display="flex" justifyContent="center" alignItems='flex-start'>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} mb={1} display="flex" justifyContent="flex-start" alignItems='flex-start'>
                                  <MDTypography fontSize={18} style={{color:"black",paddingLeft:4,paddingRight:4,fontWeight:'bold'}}>{index+1}. {e?.blogTitle}</MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={12} mb={1} display="flex" justifyContent="flex-start">
                                  <MDTypography fontSize={9} style={{color:"black",paddingLeft:4,paddingRight:4, textAlign: 'justify'}}><span style={{fontSize:11,fontWeight:300}}>{truncateText(e?.content, 900)}</span></MDTypography>
                              </Grid>
      
                              <Grid item xs={12} md={6} lg={5} mb={1} display="flex" justifyContent="flex-start">
                                  <MDTypography fontSize={9} style={{color:"black",paddingLeft:4,paddingRight:4}}>Author: <span style={{fontSize:9,fontWeight:400}}>{e?.author}</span></MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={7} mb={1} display="flex" justifyContent="flex-end">
                                  <MDTypography fontSize={9} style={{color:"black", paddingLeft:4,paddingRight:4}}>{e?.status} On: <span style={{fontSize:9,fontWeight:400}}>{moment.utc(e?.lastModifiedOn).utcOffset('+05:30').format("DD-MMM HH:mm a")}</span></MDTypography>
                              </Grid>
      
                          </Grid>
                      </MDButton>
                      </MDBox>
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