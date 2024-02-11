
import React, { useState, useEffect } from 'react'
import Grid from "@mui/material/Grid";
import axios from "axios";
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDAvatar from "../../../components/MDAvatar";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import money from "../../../assets/images/money.png"
import { Link, useLocation } from "react-router-dom";
import moment from 'moment';
import { apiUrl } from '../../../constants/constants';
import SearchBox from './searchBox';



const Active = () => {
  let [skip, setSkip] = useState(0);
  const limitSetting = 10;
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  return (
    <>
    <SearchBox setData={setData} />
      {/* {data.length > 0 ? */}

        <MDBox display='flex' justifyContent='center' alignItems='center'>
          <Grid container spacing={0.5} xs={12} md={12} lg={12} bgColor="dark" display='flex' justifyContent='center' alignItems='center'>
            <Grid key={1} item xs={12} md={12} lg={12} bgColor="dark" display='flex' justifyContent='center' alignItems='center'>
            <MDBox style={{ borderRadius: 4, minWidth:'100%'}} display='flex' justifyContent='center' alignItems='center'>
            <MDButton
              variant="contained"
              size="small"
              color="success"
              style={{ minWidth: '100%' }}
            >
            <Grid container xs={12} md={12} lg={12} display="flex" justifyContent="center" alignItems='center'>

            <Grid item xs={12} md={3} lg={1} display="flex" justifyContent="center" alignItems='center' >
              <MDTypography variant="body3">#</MDTypography>
            </Grid>
            <Grid item xs={12} md={3} lg={2} display="flex" justifyContent="center" alignItems='center'>
              <MDTypography variant="body3">City</MDTypography>
            </Grid>
            <Grid item xs={12} md={3} lg={3} display="flex" justifyContent="center" alignItems='center'>
              <MDTypography variant="body3">State</MDTypography>
            </Grid>
            <Grid item xs={12} md={3} lg={2} display="flex" justifyContent="center" alignItems='center'>
              <MDTypography variant="body3">Tier</MDTypography>
            </Grid>
            <Grid item xs={12} md={3} lg={2} display="flex" justifyContent="center" alignItems='center'>
              <MDTypography variant="body3">Status</MDTypography>
            </Grid>
            <Grid item xs={12} md={3} lg={2} display="flex" justifyContent="center" alignItems='center'>
              <MDTypography variant="body3">City Code</MDTypography>
            </Grid>

            </Grid>
            </MDButton>
            </MDBox>
            </Grid>
            {data.length > 0 && data?.map((e,index) => {
              return (

                <Grid key={e._id} item xs={12} md={12} lg={12} bgColor="dark" display='flex' justifyContent='center' alignItems='center'>
                  <MDBox style={{ borderRadius: 4, minWidth:'100%' }}>
                    <MDButton
                      variant="contained"
                      size="small"
                      component={Link}
                      color={(index+2)%2 == 0 ? 'light' : 'warning'}
                      style={{ minWidth: '100%' }}
                      to={{
                        pathname: `/citydetails`,
                      }}
                      state={{ data: e }}
                    >
                      <Grid container xs={12} md={12} lg={12} display="flex" justifyContent="center" alignItems='center'>
                        <Grid item xs={12} md={3} lg={1}  display="flex" justifyContent="center" alignItems='center'>
                          <MDTypography variant="body3">{index+1}</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={3} lg={2} display="flex" justifyContent="center" alignItems='center'>
                          <MDTypography variant="body3">{e?.name}</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={3} lg={3} display="flex" justifyContent="center" alignItems='center'>
                          <MDTypography variant="body3">{e?.state}</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={3} lg={2} display="flex" justifyContent="center" alignItems='center' >
                          <MDTypography variant="body3">{e?.tier}</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={3} lg={2} display="flex" justifyContent="center" alignItems='center' >
                          <MDTypography variant="body3">{e?.status}</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={3} lg={2} display="flex" justifyContent="center" alignItems='center' >
                          <MDTypography variant="body3">{e?.code}</MDTypography>
                        </Grid>
                      </Grid>
                    </MDButton>
                  </MDBox>
                </Grid>

              )
            })}
          </Grid>
          {/* {!isLoading && count !== 0 &&
            <MDBox mt={1} display="flex" justifyContent="space-between" alignItems='center' width='100%'>
              <MDButton variant='outlined' color='warning' disabled={(skip + limitSetting) / limitSetting === 1 ? true : false} size="small" onClick={backHandler}>Back</MDButton>
              <MDTypography color="light" fontSize={15} fontWeight='bold'>Total TestZones: {!count ? 0 : count} | Page {(skip + limitSetting) / limitSetting} of {!count ? 1 : Math.ceil(count / limitSetting)}</MDTypography>
              <MDButton variant='outlined' color='warning' disabled={Math.ceil(count / limitSetting) === (skip + limitSetting) / limitSetting ? true : !count ? true : false} size="small" onClick={nextHandler}>Next</MDButton>
            </MDBox>
          } */}
        </MDBox>
      

    </>
  )
}



export default Active;