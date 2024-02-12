import React, {useState, useEffect} from 'react'
import Grid from "@mui/material/Grid";
import axios from "axios";
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import { Link } from "react-router-dom";
import moment from 'moment';


const UpcomingBattleTemplates = ({type}) => {
const [upcomingBattleTemplates,setUpcomingBattleTemplates] = useState([]);
let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
let [skip, setSkip] = useState(0);
const limitSetting = 10;
const [count, setCount] = useState(0);
const [isLoading,setIsLoading] = useState(false);

  useEffect(()=>{
    let call1 = axios.get(`${baseUrl}api/v1/battles/upcoming`,{
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                  },
                })
    Promise.all([call1])
    .then(([api1Response]) => {
      setUpcomingBattleTemplates(api1Response.data.data)
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
    setUpcomingBattleTemplates([]);
    setIsLoading(true)
    axios.get(`${baseUrl}api/v1/battles/upcoming/?skip=${skip-limitSetting}&limit=${limitSetting}`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
    })
    .then((res) => {
        setUpcomingBattleTemplates(res.data.data)
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
    setUpcomingBattleTemplates([]);
    setIsLoading(true)
    axios.get(`${baseUrl}api/v1/battles/upcoming/?skip=${skip+limitSetting}&limit=${limitSetting}`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
    })
    .then((res) => {
        console.log('report',res.data.data);
        setUpcomingBattleTemplates(res.data.data)
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
      {upcomingBattleTemplates.length > 0 ?
        
          <MDBox>
            <Grid container spacing={2} bgColor="dark">
              {upcomingBattleTemplates?.map((e, index)=>{
                  
                  let totalPayout =  (e?.participants.reduce((total, currentItem) => {
                    return total + currentItem.reward;
                  }, 0))
                  let actualgst = (((e?.battleTemplate?.entryFee)*(e?.participants?.length))*e?.battleTemplate?.gstPercentage)/100
                  let expectedgst = (((e?.battleTemplate?.entryFee)*(e?.battleTemplate?.minParticipants))*e?.battleTemplate?.gstPercentage)/100
                  let actualCollection = (e?.battleTemplate?.entryFee)*(e?.participants?.length)
                  let expectedCollection = (e?.battleTemplate?.entryFee)*(e?.battleTemplate?.minParticipants)
                  let actualPlatformCommission = ((actualCollection-actualgst)*e?.battleTemplate?.platformCommissionPercentage)/100
                  let expectedPlatformCommission = ((expectedCollection-expectedgst)*e?.battleTemplate?.platformCommissionPercentage)/100
                  let actualPrizePool = actualCollection-actualgst-actualPlatformCommission
                  let expectedPrizePool = expectedCollection-expectedgst-expectedPlatformCommission

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
                            pathname: `/battledashboard/battles/${e?.battleName}`,
                          }}
                        state={{data: e}}
                      >
                          <Grid container mb={1}>
                              
                              <Grid item xs={12} md={6} lg={3} mt={1} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={13} style={{color:"black",paddingRight:4,fontWeight:'bold'}}>Battle Name: {e?.battleName}</MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={3} mt={1} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={13} style={{color:"black",paddingRight:4,fontWeight:'bold'}}>Entry Fee: ₹{e?.battleTemplate?.entryFee}</MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={3} mt={1} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={13} style={{color:"black",paddingRight:4,fontWeight:'bold'}}>Portfolio: ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(e?.battleTemplate?.portfolioValue)}</MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={3} mt={1} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={13} style={{color:"black",paddingRight:4,fontWeight:'bold'}}>Participants(M): {e?.battleTemplate?.minParticipants}</MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={3} mt={1} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={13} style={{color:"black",paddingRight:4,fontWeight:'bold'}}>Live: {moment.utc(e?.battleLiveTime).utcOffset('+05:30').format('DD-MMM-YY hh:mm a')}</MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={3} mt={1} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={13} style={{color:"black",paddingRight:4,fontWeight:'bold'}}>Start: {moment.utc(e?.battleStartTime).utcOffset('+05:30').format('DD-MMM-YY hh:mm a')}</MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={3} mt={1} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={13} style={{color:"black",paddingRight:4,fontWeight:'bold'}}>End: {moment.utc(e?.battleEndTime).utcOffset('+05:30').format('DD-MMM-YY hh:mm a')}</MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={3} mt={1} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={13} style={{color:"black",paddingRight:4,fontWeight:'bold'}}>Participants(A): {e?.participants?.length}</MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={3} mt={1} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={13} style={{color:"black",paddingRight:4,fontWeight:'bold'}}>Collections(E): ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(expectedCollection)}</MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={3} mt={1} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={13} style={{color:"black",paddingRight:4,fontWeight:'bold'}}>GST(E): ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(expectedgst)}</MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={3} mt={1} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={13} style={{color:"black",paddingRight:4,fontWeight:'bold'}}>Platform Commission(E): ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(expectedPlatformCommission)}</MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={3} mt={1} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={13} style={{color:"black",paddingRight:4,fontWeight:'bold'}}>Prize Pool(E): 
                                  ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(expectedPrizePool)}
                                  </MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={3} mt={1} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={13} style={{color:"black",paddingRight:4,fontWeight:'bold'}}>Collections(A): ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(actualCollection)}</MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={3} mt={1} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={13} style={{color:"black",paddingRight:4,fontWeight:'bold'}}>GST(A): ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(actualgst)}</MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={3} mt={1} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={13} style={{color:"black",paddingRight:4,fontWeight:'bold'}}>Platform Commission(A): ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(actualPlatformCommission)}</MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={3} mt={1} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={13} style={{color:"black",paddingRight:4,fontWeight:'bold'}}>Prize Pool(A): 
                                  ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(actualPrizePool)}
                                  </MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={3} mt={1} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={13} style={{color:"black",paddingRight:4,fontWeight:'bold'}}>Total Payout: 
                                  ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalPayout)}
                                  </MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={3} mt={1} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={13} style={{color:"black",paddingRight:4,fontWeight:'bold'}}>Battle Status: {e?.status}</MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={3} mt={1} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={13} style={{color:"black",paddingRight:4,fontWeight:'bold'}}>Payout Status: {e?.payoutStatus}</MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={3} mt={1} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={13} style={{color:"black",paddingRight:4,fontWeight:'bold'}}>Battle Type: {e?.battleTemplate?.battleType}</MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={3} mt={1} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={13} style={{color:"black",paddingRight:4,fontWeight:'bold'}}>Template Type: {e?.battleTemplate?.battleTemplateType}</MDTypography>
                              </Grid>

                              <Grid item xs={12} md={6} lg={3} mt={1} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={13} style={{color:"black",paddingRight:4,fontWeight:'bold'}}>Winner Percentage: {e?.battleTemplate?.winnerPercentage}%</MDTypography>
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
                            <MDTypography color="light" fontSize={15} fontWeight='bold'>Total Battles: {!count ? 0 : count} | Page {(skip+limitSetting)/limitSetting} of {!count ? 1 : Math.ceil(count/limitSetting)}</MDTypography>
                            <MDButton variant='outlined' color='warning' disabled={Math.ceil(count/limitSetting) === (skip+limitSetting)/limitSetting ? true : !count ? true : false} size="small" onClick={nextHandler}>Next</MDButton>
                            </MDBox>
                            }
                </MDBox>
          :
         <Grid container spacing={1} xs={12} md={6} lg={12}>
          <Grid item mt={2} xs={6} md={3} lg={12} display="flex" justifyContent="center">
            <MDTypography color="light">No Upcoming Battle(s)</MDTypography>
          </Grid>
         </Grid>
         } 

      </>
)}



export default UpcomingBattleTemplates;