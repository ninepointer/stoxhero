import React from 'react';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';
import MDAvatar from '../../../components/MDAvatar';
import {Link} from 'react-router-dom'
import { Grid } from '@mui/material';
import Logo from '../../../assets/images/default-profile.png'

//data
import LiveMockInfinityDailyData from '../data/liveMockInfinityDailyChart'

export default function InfinityData() {

  return (
    <>      
            <Grid container xs={12} md={12} lg={12} mt={1} mb={1} display='flex' justifyContent='center' alignItems='center'>
                <MDTypography fontSize={15} fontWeight='bold'>Date Wise Data for 21-Jan-2023 to 01-Mar-2023</MDTypography>
            </Grid>

            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
            
            <MDBox style={{border:'1px solid #e91e63', backgroundColor:'#e91e63'}} borderRadius={5} p={0.5} display='flex' justifyContent='center' width='100%'>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='light' fontSize={13} fontWeight='bold'>Date</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='light' fontSize={13} fontWeight='bold'>Gross P&L(S)</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='light' fontSize={13} fontWeight='bold'>Gross P&L(I)</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='light' fontSize={13} fontWeight='bold'>Net P&L(S)</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='light' fontSize={13} fontWeight='bold'>Net P&L(I)</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='light' fontSize={13} fontWeight='bold'>Net P&L Diff(S-I)</MDTypography>
                </Grid>
            </MDBox>
            
            <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>21-Jan-23</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>1,00,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>1,20,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>80,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>90,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>-10,000</MDTypography>
                </Grid>
            </MDBox>

            <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>22-Jan-23</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>1,00,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>1,20,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>80,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>90,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>-10,000</MDTypography>
                </Grid>
            </MDBox>

            <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>23-Jan-23</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>1,00,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>1,20,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>80,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>90,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>-10,000</MDTypography>
                </Grid>
            </MDBox>

            <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>24-Jan-23</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>1,00,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>1,20,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>80,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>90,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>-10,000</MDTypography>
                </Grid>
            </MDBox>

            <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>25-Jan-23</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>1,00,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>1,20,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>80,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>90,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>-10,000</MDTypography>
                </Grid>
            </MDBox>
            </Grid>
            
            {/* <MDBox mt={1} display="flex" justifyContent="space-between" alignItems='center' width='100%'>
              <MDButton variant='outlined' color='warning' size="small">Back</MDButton>
              <MDTypography color="dark" fontSize={15} fontWeight='bold'>Total Records: 100 | Page 1 of 20</MDTypography>
              <MDButton variant='outlined' color='warning' size="small">Next</MDButton>
            </MDBox> */}
            
    </>
  );
}