
import React, { useState, useEffect } from 'react'
import {Grid, CircularProgress} from "@mui/material";
import axios from "axios";
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import { Link } from "react-router-dom";
import moment from 'moment';
import { apiUrl } from '../../../constants/constants';


const Active = () => {
  const [skip, setSkip] = useState(0);
  const limitSetting = 20;
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  async function fetchData() {
    const getData = await axios.get(`${apiUrl}userwallet/alltransaction?skip=${skip}&limit=${limitSetting}`, { withCredentials: true });
    setData(getData.data.data)
    setCount(getData.data.count)
    setTimeout(() => {
      setIsLoading(false)
    }, 100)
  }

  // console.log(data)

  useEffect(() => {
    fetchData();
  }, [])

  async function backHandler() {
    if (skip <= 0) {
      return;
    }
    setSkip(prev => prev - limitSetting);
    setData([]);
    setIsLoading(true)
    await fetchData();
  }

  async function nextHandler() {
    if (skip + limitSetting >= count) {
      return;
    }
    setSkip(prev => prev + limitSetting);
    setData([]);
    setIsLoading(true)
    await fetchData();
  }


  return (
    <>
    {
      isLoading ?
      <Grid item xs={12} md={12} lg={12} bgColor="dark" display='flex' justifyContent='center' alignItems='center'>
      <CircularProgress color='light' />
      </Grid>
      :
      <>
      {data.length > 0 ?
        <>
        <MDBox display='flex' justifyContent='center' alignItems='center'>
          <Grid container spacing={0.5} xs={12} md={12} lg={12} bgColor="dark" display='flex' justifyContent='center' alignItems='center'>
            <Grid key={1} item xs={12} md={12} lg={12} bgColor="dark" display='flex' justifyContent='center' alignItems='center'>
              <MDBox style={{ borderRadius: 4, minWidth: '100%' }} display='flex' justifyContent='center' alignItems='center'>
                <MDButton
                  variant="contained"
                  size="small"
                  color="error"
                  style={{ minWidth: '100%' }}
                >
                  <Grid container xs={12} md={12} lg={12} display="flex" justifyContent="center" alignItems='center'>

                    <Grid item xs={12} md={3} lg={2} display="flex" justifyContent="center" alignItems='center'>
                      <MDTypography variant="body3">Name</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={3} lg={1.5} display="flex" justifyContent="center" alignItems='center'>
                      <MDTypography variant="body3">Mobile</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={3} lg={2} display="flex" justifyContent="center" alignItems='center'>
                      <MDTypography variant="body3">Email</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={3} lg={2.5} display="flex" justifyContent="center" alignItems='center'>
                      <MDTypography variant="body3">Title</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={3} lg={1} display="flex" justifyContent="center" alignItems='center'>
                      <MDTypography variant="body3">Amount</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={3} lg={1} display="flex" justifyContent="center" alignItems='center'>
                      <MDTypography variant="body3">Type</MDTypography>
                    </Grid>
                    {/* <Grid item xs={12} md={3} lg={2} display="flex" justifyContent="center" alignItems='center'>
                      <MDTypography variant="body3">description</MDTypography>
                    </Grid> */}
                    <Grid item xs={12} md={3} lg={2} display="flex" justifyContent="center" alignItems='center'>
                      <MDTypography variant="body3">Date</MDTypography>
                    </Grid>

                  </Grid>
                </MDButton>
              </MDBox>
            </Grid>
            {data.length > 0 && data?.map((e, index) => {
              return (

                <Grid key={e._id} item xs={12} md={12} lg={12} bgColor="dark" display='flex' justifyContent='center' alignItems='center'>
                  <MDBox style={{ borderRadius: 4, minWidth: '100%' }}>
                    <MDButton
                      variant="contained"
                      size="small"
                      component={Link}
                      color={'light'}
                      style={{ minWidth: '100%' }}
                    >
                      <Grid container xs={12} md={12} lg={12} display="flex" justifyContent="center" alignItems='center'>
                    
                        <Grid item xs={12} md={3} lg={2} display="flex" justifyContent="center" alignItems='center'>
                          <MDTypography fontSize={11} >{`${e?.first_name} ${e?.last_name}`}</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={3} lg={1.5} display="flex" justifyContent="center" alignItems='center'>
                          <MDTypography fontSize={11}>{e?.mobile}</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={3} lg={2} display="flex" justifyContent="center" alignItems='center' >
                          <MDTypography fontSize={11}>{e?.email}</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={3} lg={2.5} display="flex" justifyContent="center" alignItems='center' >
                          <MDTypography fontSize={11}>{e?.title}</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={3} lg={1} display="flex" justifyContent="center" alignItems='center' >
                          <MDTypography fontSize={11}>{e?.amount}</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={3} lg={1} display="flex" justifyContent="center" alignItems='center' >
                          <MDTypography fontSize={11}>{e?.type}</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={3} lg={2} display="flex" justifyContent="center" alignItems='center' >
                          <MDTypography fontSize={11}>{moment(e?.date).format('DD-MM-YY hh:mm a')}</MDTypography>
                        </Grid>
                      </Grid>
                    </MDButton>
                  </MDBox>
                </Grid>

              )
            })}
          </Grid>

          
        </MDBox>
        <Grid item xs={12} md={12} lg={12} bgColor="dark" display='flex' justifyContent='center' alignItems='center'>
            {!isLoading && count !== 0 &&
              <MDBox mt={1} display="flex" justifyContent="space-between" alignItems='center' width='100%'>
                <MDButton variant='outlined' color='light' disabled={(skip + limitSetting) / limitSetting === 1 ? true : false} size="small" onClick={backHandler}>Back</MDButton>
                <MDTypography color="light" fontSize={15} fontWeight='bold'>Total Transactions: {!count ? 0 : count} | Page {(skip + limitSetting) / limitSetting} of {!count ? 1 : Math.ceil(count / limitSetting)}</MDTypography>
                <MDButton variant='outlined' color='light' disabled={Math.ceil(count / limitSetting) === (skip + limitSetting) / limitSetting ? true : !count ? true : false} size="small" onClick={nextHandler}>Next</MDButton>
              </MDBox>
            }
          </Grid>
        </>

        :
        <Grid container spacing={1} xs={12} md={6} lg={12}>
          <Grid item mt={2} xs={6} md={3} lg={12} display="flex" justifyContent="center">
            <MDTypography color="light">No Active School(s)</MDTypography>
          </Grid>
        </Grid>
      }

    </>
    }
    </>
  )
}



export default Active;