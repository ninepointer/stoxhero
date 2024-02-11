
import React, { useState, useEffect } from 'react'
import Grid from "@mui/material/Grid";
import axios from "axios";
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
// import MDAvatar from "../../../components/MDAvatar";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
// import money from "../../../assets/images/money.png"
import { Link} from "react-router-dom";
import moment from 'moment';


const CompletedContest = () => {
  let [skip, setSkip] = useState(0);
  const limitSetting = 10;
  const [count, setCount] = useState(0);
  const [isLoading,setIsLoading] = useState(false);
  const [active, setActive] = useState([]);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

  useEffect(() => {
    let call1 = axios.get(`${baseUrl}api/v1/notificationgroup/active?skip=${skip}&limit=${limitSetting}`, {
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
        setActive(api1Response?.data?.data)
        setCount(api1Response?.data?.count)
        setTimeout(()=>{
          setIsLoading(false)
        },100)
      })
      .catch((error) => {
        // Handle errors here
        console.error(error);
      });
  }, [])

  function backHandler(){
    if(skip <= 0){
        return;
    }
    setSkip(prev => prev-limitSetting);
    setActive([]);
    setIsLoading(true)
    axios.get(`${baseUrl}api/v1/notificationgroup/active?skip=${skip-limitSetting}&limit=${limitSetting}`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
    })
    .then((res) => {
        setActive(res.data.data)
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
    setSkip(prev => prev+limitSetting);
    setActive([]);
    setIsLoading(true)
    axios.get(`${baseUrl}api/v1/notificationgroup/active?skip=${skip+limitSetting}&limit=${limitSetting}`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
    })
    .then((res) => {
        setActive(res.data.data)
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
    {active?.length > 0 ?
      
        <MDBox>
          <Grid container spacing={2} bgColor="dark">
            {active?.map((e)=>{
              let contestColor = (e?.featured === true && e?.entryFee != 0) ? 'success' : (e?.featured === true && e?.entryFee === 0) ? 'warning' : (e?.featured === false && e?.entryFee != 0) ? 'text' : 'light';
              console.log(contestColor,e?.featured,e?.entryFee, e?.featured === true && e?.entryFee != 0,e?.featured === true && e?.entryFee === 0 )
                  return (
                    
                    <Grid key={e._id} item xs={12} md={12} lg={12} bgColor="dark">
                    <MDBox padding={0} style={{borderRadius:4}}>
                    <MDButton 
                      variant="contained" 
                      color={contestColor} 
                      size="small" 
                      component = {Link}
                      style={{minWidth:'100%'}}
                      to={{
                          pathname: `/notificationdetails`,
                        }}
                      state={{data: e}}
                    >
                          <Grid container>
                            <Grid item xs={12} md={6} lg={12} mt={1} mb={1} display="flex" justifyContent="left" >
                              <MDTypography fontSize={15} style={{ color: "black", paddingRight: 4, fontWeight: 'bold' }}>Name: {e?.notificationGroupName}</MDTypography>
                            </Grid>

                            <Grid item xs={12} md={6} lg={12} mt={1} mb={1} display="flex" justifyContent="left" >
                              <MDTypography fontSize={15} style={{ color: "black", paddingRight: 4, fontWeight: 'bold' }}>Criteria: {e?.criteria}</MDTypography>
                            </Grid>

                            <Grid item xs={12} md={6} lg={12} mt={1} mb={1} display="flex" justifyContent="left" >
                              <MDTypography fontSize={15} style={{ color: "black", paddingRight: 4, fontWeight: 'bold' }}>Users: {e?.users?.length}</MDTypography>
                            </Grid>
                          </Grid>
                    </MDButton>
                    </MDBox>
                    </Grid>
                    
                  )
            })}
          </Grid>
          {!isLoading && count !== 0 &&
          <MDBox mt={1} display="flex" justifyContent="space-between" alignItems='center' width='100%'>
            <MDButton variant='outlined' color='warning' disabled={(skip + limitSetting) / limitSetting === 1 ? true : false} size="small" onClick={backHandler}>Back</MDButton>
            <MDTypography color="light" fontSize={15} fontWeight='bold'>Total Notification Groups: {!count ? 0 : count} | Page {(skip + limitSetting) / limitSetting} of {!count ? 1 : Math.ceil(count / limitSetting)}</MDTypography>
            <MDButton variant='outlined' color='warning' disabled={Math.ceil(count / limitSetting) === (skip + limitSetting) / limitSetting ? true : !count ? true : false} size="small" onClick={nextHandler}>Next</MDButton>
          </MDBox>
          }
        </MDBox>
        :
       <Grid container spacing={1} xs={12} md={6} lg={12}>
        <Grid item mt={2} xs={6} md={3} lg={12} display="flex" justifyContent="center">
          <MDTypography color="light">No Active Notification Groups</MDTypography>
        </Grid>
       </Grid>
       } 

    </>
  )
}



export default CompletedContest;