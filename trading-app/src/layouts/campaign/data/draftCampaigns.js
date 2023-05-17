
import React, {useState, useEffect} from 'react'
import Grid from "@mui/material/Grid";
import axios from "axios";
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDAvatar from "../../../components/MDAvatar";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import money from "../../../assets/images/money.png"
import { Link, useLocation } from "react-router-dom";


const DraftCampaigns = ({status}) => {
const [applicationCount, setApplicationCount] = useState(0);
const [activeCampaign,setActiveCampaign] = useState([]);
let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  useEffect(()=>{
    let call1 = axios.get(`${baseUrl}api/v1/campaign/${status}`,{
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
      console.log(api1Response.data.data);
      setActiveCampaign(api1Response.data.data)
    
    })
    .catch((error) => {
      // Handle errors here
      console.error(error);
    });
  },[])

    return (
      <>
      {activeCampaign.length > 0 ?
        
          <MDBox>
            <Grid container spacing={2} bgColor="dark">
              {activeCampaign?.map((e)=>{

                    return (
                      
                      <Grid key={e._id} item xs={12} md={12} lg={6} bgColor="dark">
                      <MDBox padding={0} style={{borderRadius:4}}>
                      <MDButton 
                        variant="contained" 
                        color={"light"} 
                        size="small" 
                        component = {Link}
                        to={{
                            pathname: `/campaigndetails`,
                          }}
                        state={{ data: e }}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={18} style={{color:"black",paddingLeft:4,paddingRight:4,fontWeight:'bold'}}>Campaign Name: {e?.campaignName}</MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"black",paddingLeft:4,paddingRight:4}}>Campaign For: <span style={{fontSize:11,fontWeight:700}}>{e?.campaignFor}</span></MDTypography>
                              </Grid>
      
                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                                  <MDTypography fontSize={9} style={{color:"black",paddingLeft:4,paddingRight:4}}>Campaign Code: <span style={{fontSize:11,fontWeight:700}}>{e?.campaignCode}</span></MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"black",paddingLeft:4,paddingRight:4}}>Campaign Cost: <span style={{fontSize:11,fontWeight:700}}>{e?.campaignCost ? e?.campaignCost : 'NA'}</span></MDTypography>
                              </Grid>
      
                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                                  <MDTypography fontSize={9} style={{color:"black",paddingLeft:4,paddingRight:4}}>CAC: <span style={{fontSize:11,fontWeight:700}}>{e?.users?.length ? "₹"+(e?.campaignCost/e?.users?.length).toFixed(2) : 'NA'}</span></MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"black", paddingLeft:4,paddingRight:4}}>Users Acquired: <span style={{fontSize:11,fontWeight:700}}>{e?.users?.length}</span></MDTypography>
                              </Grid>
      
                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                                  <MDTypography fontSize={9} style={{color:"black", paddingLeft:4,paddingRight:4}}>Status: <span style={{fontSize:11,fontWeight:700}}>{e?.status ? e?.status : 'Status not available'}</span></MDTypography>
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
            <MDTypography color="light">No active Campaign(s)</MDTypography>
          </Grid>
         </Grid>
         } 

      </>
)}



export default DraftCampaigns;