import { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import MDBox from '../../../components/MDBox';
import { Grid } from '@mui/material';

import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';

function Tables() {

    return (

        <MDBox >
            <Grid container spacing={0} p={1} display="flex" justifyContent="space-around" alignContent="center" alignItems="center">
            
            <Grid item xs={12} md={6} lg={3} mt={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="dark" fontSize={15} fontWeight="bold">Select Date Range</MDTypography>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
            <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center"  borderRadius={5}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    label="Start Date"
                    // disabled={true}
                    // value={dayjs(dateField)}
                    // onChange={(e) => {setFormStatePD(prevState => ({
                    //   ...prevState,
                    //   dateField: dayjs(e)
                    // }))}}
                    sx={{ width: '100%'}}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </MDBox>
            </Grid>
            

            <Grid item xs={12} md={6} lg={3}>
            <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    label="End Date"
                    // disabled={true}
                    // value={dayjs(dateField)}
                    // onChange={(e) => {setFormStatePD(prevState => ({
                    //   ...prevState,
                    //   dateField: dayjs(e)
                    // }))}}
                    sx={{ width: '100%' }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </MDBox>
            </Grid>

            <Grid item xs={12} md={6} lg={3} mt={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDButton variant="contained" color="info">Show Details</MDButton>
            </Grid>

            </Grid>
        </MDBox>
    )
}
    export default Tables;