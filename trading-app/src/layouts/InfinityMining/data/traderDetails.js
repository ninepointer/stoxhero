import React from 'react';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';
import MDAvatar from '../../../components/MDAvatar';
import {Link} from 'react-router-dom'
import { Grid } from '@mui/material';
import Logo from '../../../assets/images/default-profile.png'
import moment from 'moment'
import InfinityMiningCSS from '../infinityMining.css'

//data
import LiveMockInfinityDailyData from '../data/liveMockInfinityDailyChart'

export default function TraderDetails({traderId, isLoading}) {
    console.log(traderId)
    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
      
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
      
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
      
        return age;
      };

  return (
     <> 
            {isLoading ?
            <MDBox style={{ filter: 'blur(2px)' }}>
                <Grid container xs={12} md={12} lg={12} p={1} display='flex' justifyContent='center' width='100%'>
                                
                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' width='100%'>
                    <MDAvatar
                    src={traderId?.profilePhoto?.url || Logo}
                    alt="Profile"
                    size="xl"
                    sx={({ borders: { borderWidth }, palette: { white } }) => ({
                        border: `${borderWidth[2]} solid ${white.main}`,
                        cursor: "pointer",
                        position: "relative",
                        ml: 0,

                        "&:hover, &:focus": {
                        zIndex: "10",
                        },
                    })}
                    />
                </Grid>

                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' flexDirection='column'>
                    <MDBox display='flex' justifyContent='center'><MDTypography fontSize={15} fontWeight='bold'>{traderId?.first_name + ' ' + traderId?.last_name}</MDTypography></MDBox>
                    <MDBox display='flex' justifyContent='center'><MDTypography fontSize={10} fontWeight='bold'>DOB: {moment.utc(traderId?.dob).utcOffset('+05:30').format("DD-MMM-YYYY")}</MDTypography></MDBox>
                    <MDBox display='flex' justifyContent='center'><MDTypography fontSize={10} fontWeight='bold'>Joining Date: {moment.utc(traderId?.joining_date).utcOffset('+05:30').format("DD-MMM-YYYY")}</MDTypography></MDBox>
                    <MDBox display='flex' justifyContent='center'><MDTypography fontSize={10} fontWeight='bold'>User Id: {traderId?.employeeid}</MDTypography></MDBox>
                    <MDBox display='flex' justifyContent='center'><MDTypography fontSize={10} fontWeight='bold'>Email: {traderId?.email}</MDTypography></MDBox>
                    <MDBox display='flex' justifyContent='center'><MDTypography fontSize={10} fontWeight='bold'>Batch: {traderId?.cohort}</MDTypography></MDBox>
                </Grid>

                <Grid item xs={12} md={12} lg={12} mt={1} display='flex' justifyContent='center' width='100%'>
                    
                    <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                        
                        <MDBox style={{border:'1px solid #e91e63', backgroundColor:'#e91e63'}} borderRadius={5} p={0.5} display='flex' justifyContent='center' width='100%'>
                        <Grid item xs={4} md={4} lg={12} display='flex' justifyContent='center'>
                            <MDTypography color='light' fontSize={13} fontWeight='bold'>Trader Details</MDTypography>
                        </Grid>
                        </MDBox>

                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13} fontWeight='bold'>Age</MDTypography>
                        </Grid>
                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13}>{(traderId?.dob || traderId?.dob === '') ? calculateAge(traderId?.dob + ' Years') : 'NA'}</MDTypography>
                        </Grid>
                        </MDBox>

                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13} fontWeight='bold'>Gender</MDTypography>
                        </Grid>
                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13}>{traderId?.gender ? traderId?.gender : 'NA'}</MDTypography>
                        </Grid>
                        </MDBox>
                        
                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13} fontWeight='bold'>Currently Working</MDTypography>
                        </Grid>
                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13}>{traderId?.currentlyWorking ? traderId?.currentlyWorking : 'NA'}</MDTypography>
                        </Grid>
                        </MDBox>

                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13} fontWeight='bold'>Non-Working Duration</MDTypography>
                        </Grid>
                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13}>{traderId?.nonWorkingDurationInMonths ? traderId?.nonWorkingDurationInMonths + ' Months' : 'NA'}</MDTypography>
                        </Grid>
                        </MDBox>

                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13} fontWeight='bold'>Previously Employeed</MDTypography>
                        </Grid>
                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13}>{traderId?.previouslyEmployeed ? traderId?.previouslyEmployeed : 'NA'}</MDTypography>
                        </Grid>
                        </MDBox>

                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13} fontWeight='bold'>Latest Salary(Monthly)</MDTypography>
                        </Grid>
                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13}>
                                {traderId?.latestSalaryPerMonth ? '₹' : ''}{traderId?.latestSalaryPerMonth ? new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format((traderId?.latestSalaryPerMonth)) : 'NA'}
                            </MDTypography>
                        </Grid>
                        </MDBox>

                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13} fontWeight='bold'>Latest Degree</MDTypography>
                        </Grid>
                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13}>{traderId?.degree ? traderId?.degree : 'NA'}</MDTypography>
                        </Grid>
                        </MDBox>

                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13} fontWeight='bold'>College Name</MDTypography>
                        </Grid>
                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13}>{traderId?.collegeName ? traderId?.collegeName : 'NA'}</MDTypography>
                        </Grid>
                        </MDBox>

                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13} fontWeight='bold'>Family Income(Monthly)</MDTypography>
                        </Grid>
                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13}>
                                {traderId?.familyIncomePerMonth ? '₹' : ''}{traderId?.familyIncomePerMonth ? new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format((traderId?.familyIncomePerMonth)) : 'NA'}
                            </MDTypography>
                        </Grid>
                        </MDBox>

                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13} fontWeight='bold'>Staying With</MDTypography>
                        </Grid>
                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13}>{traderId?.stayingWith ? traderId?.stayingWith : 'NA'}</MDTypography>
                        </Grid>
                        </MDBox>

                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13} fontWeight='bold'>Marital Status</MDTypography>
                        </Grid>
                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13}>{traderId?.maritalStatus ? traderId?.maritalStatus : 'NA'}</MDTypography>
                        </Grid>
                        </MDBox>

                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13} fontWeight='bold'>Current City</MDTypography>
                        </Grid>
                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13}>{traderId?.location ? traderId?.location : 'NA'}</MDTypography>
                        </Grid>
                        </MDBox>

                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13} fontWeight='bold'>Native City</MDTypography>
                        </Grid>
                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13}>{traderId?.city ? traderId?.city : 'NA'}</MDTypography>
                        </Grid>
                        </MDBox>
                        
                    </Grid>

                </Grid>

                </Grid>
            </MDBox>
            :
            <Grid container xs={12} md={12} lg={12} p={1} display='flex' justifyContent='center' width='100%'>
                            
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' width='100%'>
                                <MDAvatar
                                src={traderId?.profilePhoto?.url || Logo}
                                alt="Profile"
                                size="xl"
                                sx={({ borders: { borderWidth }, palette: { white } }) => ({
                                    border: `${borderWidth[2]} solid ${white.main}`,
                                    cursor: "pointer",
                                    position: "relative",
                                    ml: 0,

                                    "&:hover, &:focus": {
                                    zIndex: "10",
                                    },
                                })}
                                />
                            </Grid>

                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' flexDirection='column'>
                                <MDBox display='flex' justifyContent='center'><MDTypography fontSize={15} fontWeight='bold'>{traderId?.first_name + ' ' + traderId?.last_name}</MDTypography></MDBox>
                                <MDBox display='flex' justifyContent='center'><MDTypography fontSize={10} fontWeight='bold'>DOB: {moment.utc(traderId?.dob).utcOffset('+05:30').format("DD-MMM-YYYY")}</MDTypography></MDBox>
                                <MDBox display='flex' justifyContent='center'><MDTypography fontSize={10} fontWeight='bold'>Joining Date: {moment.utc(traderId?.joining_date).utcOffset('+05:30').format("DD-MMM-YYYY")}</MDTypography></MDBox>
                                <MDBox display='flex' justifyContent='center'><MDTypography fontSize={10} fontWeight='bold'>User Id: {traderId?.employeeid}</MDTypography></MDBox>
                                <MDBox display='flex' justifyContent='center'><MDTypography fontSize={10} fontWeight='bold'>Email: {traderId?.email}</MDTypography></MDBox>
                                <MDBox display='flex' justifyContent='center'><MDTypography fontSize={10} fontWeight='bold'>Batch: {traderId?.cohort}</MDTypography></MDBox>
                            </Grid>

                            <Grid item xs={12} md={12} lg={12} mt={1} display='flex' justifyContent='center' width='100%'>
                                
                                <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                                    
                                    <MDBox style={{border:'1px solid #e91e63', backgroundColor:'#e91e63'}} borderRadius={5} p={0.5} display='flex' justifyContent='center' width='100%'>
                                    <Grid item xs={4} md={4} lg={12} display='flex' justifyContent='center'>
                                        <MDTypography color='light' fontSize={13} fontWeight='bold'>Trader Details</MDTypography>
                                    </Grid>
                                    </MDBox>

                                    <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13} fontWeight='bold'>Age</MDTypography>
                                    </Grid>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13}>{(traderId?.dob || traderId?.dob === '') ? calculateAge(traderId?.dob + ' Years') : 'NA'}</MDTypography>
                                    </Grid>
                                    </MDBox>

                                    <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13} fontWeight='bold'>Gender</MDTypography>
                                    </Grid>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13}>{traderId?.gender ? traderId?.gender : 'NA'}</MDTypography>
                                    </Grid>
                                    </MDBox>
                                    
                                    <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13} fontWeight='bold'>Currently Working</MDTypography>
                                    </Grid>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13}>{traderId?.currentlyWorking ? traderId?.currentlyWorking : 'NA'}</MDTypography>
                                    </Grid>
                                    </MDBox>

                                    <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13} fontWeight='bold'>Non-Working Duration</MDTypography>
                                    </Grid>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13}>{traderId?.nonWorkingDurationInMonths ? traderId?.nonWorkingDurationInMonths + ' Months' : 'NA'}</MDTypography>
                                    </Grid>
                                    </MDBox>

                                    <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13} fontWeight='bold'>Previously Employeed</MDTypography>
                                    </Grid>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13}>{traderId?.previouslyEmployeed ? traderId?.previouslyEmployeed : 'NA'}</MDTypography>
                                    </Grid>
                                    </MDBox>

                                    <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13} fontWeight='bold'>Latest Salary(Monthly)</MDTypography>
                                    </Grid>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13}>
                                            {traderId?.latestSalaryPerMonth ? '₹' : ''}{traderId?.latestSalaryPerMonth ? new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format((traderId?.latestSalaryPerMonth)) : 'NA'}
                                        </MDTypography>
                                    </Grid>
                                    </MDBox>

                                    <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13} fontWeight='bold'>Latest Degree</MDTypography>
                                    </Grid>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13}>{traderId?.degree ? traderId?.degree : 'NA'}</MDTypography>
                                    </Grid>
                                    </MDBox>

                                    <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13} fontWeight='bold'>College Name</MDTypography>
                                    </Grid>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13}>{traderId?.collegeName ? traderId?.collegeName : 'NA'}</MDTypography>
                                    </Grid>
                                    </MDBox>

                                    <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13} fontWeight='bold'>Family Income(Monthly)</MDTypography>
                                    </Grid>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13}>
                                            {traderId?.familyIncomePerMonth ? '₹' : ''}{traderId?.familyIncomePerMonth ? new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format((traderId?.familyIncomePerMonth)) : 'NA'}
                                        </MDTypography>
                                    </Grid>
                                    </MDBox>

                                    <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13} fontWeight='bold'>Staying With</MDTypography>
                                    </Grid>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13}>{traderId?.stayingWith ? traderId?.stayingWith : 'NA'}</MDTypography>
                                    </Grid>
                                    </MDBox>

                                    <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13} fontWeight='bold'>Marital Status</MDTypography>
                                    </Grid>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13}>{traderId?.maritalStatus ? traderId?.maritalStatus : 'NA'}</MDTypography>
                                    </Grid>
                                    </MDBox>

                                    <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13} fontWeight='bold'>Current City</MDTypography>
                                    </Grid>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13}>{traderId?.location ? traderId?.location : 'NA'}</MDTypography>
                                    </Grid>
                                    </MDBox>

                                    <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13} fontWeight='bold'>Native City</MDTypography>
                                    </Grid>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13}>{traderId?.city ? traderId?.city : 'NA'}</MDTypography>
                                    </Grid>
                                    </MDBox>
                                    
                                </Grid>
                
                            </Grid>

            </Grid>}
    </>
  );
}