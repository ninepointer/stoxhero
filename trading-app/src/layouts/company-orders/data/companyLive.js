import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
// import { userContext } from '../../../AuthContext';
import moment from 'moment';
//

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import {CircularProgress, MenuItem, TextField} from "@mui/material";
import { Grid } from "@mui/material";


export default function UserTodayTradeData() {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  let [skip, setSkip] = useState(0);
  const limitSetting = 10;
  const [count, setCount] = useState(0);
  const [isLoading,setIsLoading] = useState(false);
  const [selectTimeline, setSelectTimeline] = useState("Today");
  const [data, setData] = useState([]);
  // const getDetails = useContext(userContext);
  // console.log("getDetails", getDetails)
  let url = selectTimeline === "Today" ? "infinityTrade/live/companyorderstoday" : "infinityTrade/live/companyorders";
  
  useEffect(()=>{
      setIsLoading(true)
      console.log("Inside Use Effect")
      axios.get(`${baseUrl}api/v1/${url}?skip=${skip}&limit=${limitSetting}`)
      .then((res)=>{
          console.log(res.data)
          setData(res.data.data);
          setCount(res.data.count);
          setIsLoading(false)
      }).catch((err)=>{
          //window.alert("Server Down");
          setTimeout(()=>{
            setIsLoading(false)
          },500) 
          return new Error(err);
      })
  },[selectTimeline])

  function backHandler(){
    if(skip <= 0){
        return;
    }
    setSkip(prev => prev-limitSetting);
    setData([]);
    setIsLoading(true)
    axios.get(`${baseUrl}api/v1/${url}?skip=${skip-limitSetting}&limit=${limitSetting}`,{
        withCredentials: false,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": false
        },
    })
    .then((res) => {
        console.log("Orders:",res.data)
        setData(res.data.data)
        setCount(res.data.count)
        setTimeout(()=>{
            setIsLoading(false)
          },500)
    }).catch((err) => {
        console.log(err)
        setIsLoading(false)
        return new Error(err);
    })
  }

  function nextHandler(){
    if(skip+limitSetting >= count){
      console.log("inside skip",count,skip+limitSetting)  
      return;
    }
    console.log("inside next handler")
    setSkip(prev => prev+limitSetting);
    setData([]);
    setIsLoading(true)
    axios.get(`${baseUrl}api/v1/${url}?skip=${skip+limitSetting}&limit=${limitSetting}`,{
        withCredentials: false,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": false
        },
    })
    .then((res) => {
        console.log("orders",res.data)
        setData(res.data.data)
        setCount(res.data.count)
        setTimeout(()=>{
            setIsLoading(false)
          },500)
    }).catch((err) => {
        console.log(err)
        setIsLoading(false)
        return new Error(err);
    })
  }

  return (

    <MDBox bgColor="dark" color="light" mb={0} borderRadius={10} minWidth='100%' minHeight='auto'>
      <MDBox sx={{ display: 'flex', alignItems: 'center', marginBottom: "10px" }}>
        <MDTypography color="light" fontSize={15}>Select Timeline</MDTypography>
        <TextField
          select
          label=""
          color= "success"
          value={selectTimeline}
          minHeight="4em"
          // helperText="Please select subscription"
          InputProps={{
            style: { color: "light" } // Change the color value to the desired text color
          }}
          sx={{
            marginLeft: 1,
            padding: 1,
            width: "150px"
          }}
          variant="outlined"
          // sx={{ marginḶeft: 1, padding: 1, width: "150px", color: "success" }}
          onChange={(e) => { setSelectTimeline(e.target.value) }}
        >
          <MenuItem value={"Today"} minHeight="4em">
            {"Today"}
          </MenuItem>
          <MenuItem value={"History"} minHeight="4em">
            {"History"}
          </MenuItem>
        </TextField>
      </MDBox>
      <Grid container spacing={1}>
        <Grid container p={1} style={{border:'1px solid white', borderRadius:5}}>
              <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={13} fontWeight="bold">Name</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={2}>
                <MDTypography color="light" fontSize={13} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">Contract</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={13} fontWeight="bold">Quantity</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={13} fontWeight="bold">Price</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={13} fontWeight="bold">Amount</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={13} fontWeight="bold">Type</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={1.6} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={13} fontWeight="bold">Order Id</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={13} fontWeight="bold">Status</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={13} fontWeight="bold">TimeStamp</MDTypography>
              </Grid>
        </Grid>

        
            {!isLoading ?
             data?.map((elem)=>{
                // const fullName = elem?.trader?.first_name + ' ' + elem?.trader?.last_name
                const typecolor = elem?.buyOrSell === 'BUY' ? 'success' : 'error'
                return(
              
                    
                    <Grid container mt={1} p={1} style={{border:'1px solid white', borderRadius:5}}>
                        <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                            <MDTypography color="light" fontSize={10} fontWeight="bold">{elem?.createdBy}</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={2} lg={2}>
                            <MDTypography color="light" fontSize={10} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem?.symbol}</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                            <MDTypography color={typecolor} fontSize={10} fontWeight="bold">{elem?.Quantity}</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                            <MDTypography color="light" fontSize={10} fontWeight="bold">₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(elem?.average_price))}</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                            <MDTypography color="light" fontSize={10} fontWeight="bold">₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(elem?.amount))}</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                            <MDTypography color={typecolor} fontSize={10} fontWeight="bold">{elem?.buyOrSell}</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={2} lg={1.6} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                            <MDTypography color="light" fontSize={10} fontWeight="bold">{elem?.order_id}</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                            <MDTypography color="light" fontSize={10} fontWeight="bold">{elem?.status}</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={2} lg={1.2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                            <MDTypography color="light" fontSize={10} fontWeight="bold">{moment.utc(elem?.trade_time).utcOffset('+00:00').format('DD-MMM HH:mm:ss')}</MDTypography>
                        </Grid>
                    </Grid>
                    
                
                )
            })
            :
            <Grid container display="flex" justifyContent="center" alignContent='center' alignItems="center">
                <Grid item display="flex" justifyContent="center" alignContent='center' alignItems="center" lg={12}>
                <MDBox mt={5} mb={5}>
                    <CircularProgress color="info" />
                </MDBox>
                </Grid>
            </Grid>
            }
            {!isLoading && count !== 0 &&
            <MDBox mt={1} display="flex" justifyContent="space-between" alignItems='center' width='100%'>
              <MDButton variant='outlined' color='warning' disabled={(skip+limitSetting)/limitSetting === 1 ? true : false} size="small" onClick={backHandler}>Back</MDButton>
              <MDTypography color="light" fontSize={15} fontWeight='bold'>Total Order: {!count ? 0 : count} | Page {(skip+limitSetting)/limitSetting} of {!count ? 1 : Math.ceil(count/limitSetting)}</MDTypography>
              <MDButton variant='outlined' color='warning' disabled={Math.ceil(count/limitSetting) === (skip+limitSetting)/limitSetting ? true : !count ? true : false} size="small" onClick={nextHandler}>Next</MDButton>
            </MDBox>
            }

      </Grid>
    </MDBox>

  );
}
