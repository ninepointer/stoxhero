import React, {useState, useEffect} from 'react'
import Grid from "@mui/material/Grid";
import axios from "axios";
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import { Link } from "react-router-dom";


const DraftBattleTemplates = ({type}) => {
const [draftBattleTemplates,setDraftBattleTemplates] = useState([]);
let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
let [skip, setSkip] = useState(0);
const limitSetting = 10;
const [count, setCount] = useState(0);
const [isLoading,setIsLoading] = useState(false);

  useEffect(()=>{
    let call1 = axios.get(`${baseUrl}api/v1/battletemplates/draft`,{
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                  },
                })
    Promise.all([call1])
    .then(([api1Response]) => {
      setDraftBattleTemplates(api1Response.data.data)
      setCount(api1Response.data.count)
    })
    .catch((error) => {
      console.error(error);
    });
  },[])

  function backHandler(){
    if(skip <= 0){
        return;
    }
    setSkip(prev => prev-limitSetting);
    setDraftBattleTemplates([]);
    setIsLoading(true)
    axios.get(`${baseUrl}api/v1/battletemplates/draft/?skip=${skip-limitSetting}&limit=${limitSetting}`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
    })
    .then((res) => {
        setDraftBattleTemplates(res.data.data)
        setCount(res.data.count)
        setTimeout(()=>{
            setIsLoading(false)
          },500)
    }).catch((err) => {
        setIsLoading(false)
        return new Error(err);
    })
  }
  
  function nextHandler(){
    if(skip+limitSetting >= count){ 
      return;
    }
    console.log("inside next handler")
    setSkip(prev => prev+limitSetting);
    setDraftBattleTemplates([]);
    setIsLoading(true)
    axios.get(`${baseUrl}api/v1/battletemplates/draft/?skip=${skip+limitSetting}&limit=${limitSetting}`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
    })
    .then((res) => {
        console.log('report',res.data.data);
        setDraftBattleTemplates(res.data.data)
        setCount(res.data.count)
        setTimeout(()=>{
            setIsLoading(false)
          },500)
    }).catch((err) => {
        setIsLoading(false)
        return new Error(err);
    })
  }
  
    return (
      <>
      {draftBattleTemplates.length > 0 ?
        
          <MDBox>
            <Grid container spacing={2} bgColor="dark">
              {draftBattleTemplates?.map((e, index)=>{

                    return (
                      
                      <Grid key={e._id} item xs={12} md={12} lg={12} bgColor="dark">
                      <MDBox padding={0} style={{borderRadius:4}}>
                      <MDButton 
                        variant="contained" 
                        color={"light"} 
                        size="small" 
                        component = {Link}
                        style={{minWidth:'100%'}}
                        to={{
                            pathname: `/battledashboard/${e?.battleTemplateName}`,
                          }}
                        state={{data: e}}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={3} mt={1} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={15} style={{color:"black",paddingRight:4,fontWeight:'bold'}}>Template Name: {e?.battleTemplateName}</MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={3} mt={1} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={15} style={{color:"black",paddingRight:4,fontWeight:'bold'}}>Entry Fee: ₹{e?.entryFee}</MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={3} mt={1} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={15} style={{color:"black",paddingRight:4,fontWeight:'bold'}}>Portfolio: ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(e?.portfolioValue)}</MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={3} mt={1} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={15} style={{color:"black",paddingRight:4,fontWeight:'bold'}}>Min Participants: {e?.minParticipants}</MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={3} mt={1} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={12} style={{color:"black",paddingRight:4}}>Platform Commission: {e?.platformCommissionPercentage}%</MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={3} mt={1} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={12} style={{color:"black",paddingRight:4}}>GST: {e?.gstPercentage}%</MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={3} mt={1} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={12} style={{color:"black",paddingRight:4}}>Winner Percentage: {e?.winnerPercentage}%</MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={3} mt={1} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={12} style={{color:"black",paddingRight:4}}>Battle Type: {e?.battleType}</MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={3} mt={1} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={12} style={{color:"black",paddingRight:4}}>Template Type: {e?.battleTemplateType}</MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={3} mt={1} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={12} style={{color:"black",paddingRight:4}}>Status: {e?.status}</MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={3} mt={1} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={12} style={{color:"black",paddingRight:4}}># of top Rewards: {e?.rankingPayout?.length}</MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={3} mt={1} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={12} style={{color:"black",paddingRight:4}}># of Battles: NA</MDTypography>
                              </Grid>
      
                          </Grid>
                      </MDButton>
                      </MDBox>
                      </Grid>
                      
                    )
              })}
            </Grid>
                {!isLoading && count !== 0 &&
                            <MDBox m={2} display="flex" justifyContent="space-between" alignItems='center' width='100%'>
                            <MDButton variant='outlined' color='warning' disabled={(skip+limitSetting)/limitSetting === 1 ? true : false} size="small" onClick={backHandler}>Back</MDButton>
                            <MDTypography color="light" fontSize={15} fontWeight='bold'>Total Templates: {!count ? 0 : count} | Page {(skip+limitSetting)/limitSetting} of {!count ? 1 : Math.ceil(count/limitSetting)}</MDTypography>
                            <MDButton variant='outlined' color='warning' disabled={Math.ceil(count/limitSetting) === (skip+limitSetting)/limitSetting ? true : !count ? true : false} size="small" onClick={nextHandler}>Next</MDButton>
                            </MDBox>
                            }
                </MDBox>
          :
         <Grid container spacing={1} xs={12} md={6} lg={12}>
          <Grid item mt={2} xs={6} md={3} lg={12} display="flex" justifyContent="center">
            <MDTypography color="light">No Draft Battle Templates(s)</MDTypography>
          </Grid>
         </Grid>
         } 

      </>
)}



export default DraftBattleTemplates;