import { Grid } from '@mui/material';
import React from 'react';
import MDBox from '../../components/MDBox';
import MDButton from '../../components/MDButton';
import MDTypography from '../../components/MDTypography';
import CreateCollege from "./createCollege";
import {useState, useEffect} from 'react';

const College = () => {

  const [isLoading,setIsLoading] = useState(false);
  const [createCollegeForm,setCreateCollegeForm] = useState(false);
  const [isObjectNew,setIsObjectNew] =useState(false);  
  return (
    <MDBox style={{marginTop:"10px", height: "80vh", backgroundColor:"#344666", borderRadius:"12px"}}>
        {!createCollegeForm ? 
        <>
        <MDBox>
            <MDButton
               variant="contained" 
               size="small" 
               color="success" 
               sx={{marginLeft:1.5}}
               onClick={()=>{setCreateCollegeForm(true);setIsObjectNew(true)}}
               >
                Create College
            </MDButton>
        </MDBox>
        <Grid mt={2} p={1} container style={{border:'1px solid white', borderRadius:5}}>
              <Grid item xs={12} md={2} lg={4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={13} fontWeight="bold">College</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={13} fontWeight="bold">Zone</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={13} fontWeight="bold">Action</MDTypography>
              </Grid>
            </Grid>
    </> : 
    <>
        <CreateCollege setCreateCollegeForm={setCreateCollegeForm}/>
    </>}
    </MDBox>
  )
}

export default College