import React, { useState, useEffect } from 'react';
import MDBox from '../../../components/MDBox';
import { Grid } from '@mui/material';
import MDTypography from '../../../components/MDTypography';

function SignupCounter({ initialCount }) {
  const [signups, setSignups] = useState(0);

  useEffect(() => {
    const duration = 2000; // Adjust the duration of the animation
    const steps = 100; // Number of animation steps

    const stepValue = initialCount / steps;
    let step = 0;

    const interval = setInterval(() => {
      if (step < steps) {
        setSignups((prevCount) => prevCount + stepValue);
        step++;
      } else {
        setSignups(initialCount);
        clearInterval(interval);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [initialCount]);

  return (
    <MDBox display='flex' justifyContent='center'>
      <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
        <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
          <MDTypography fontSize={25} fontWeight='bold' style={{color:'#65BA0D'}}>{Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(signups)}</MDTypography>
        </Grid>
        <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
          <MDTypography fontSize={15} fontWeight='bold' style={{fontFamily:'Lucida Sans', color:'#315c45'}}>College TestZones</MDTypography>
        </Grid>
      </Grid>
    </MDBox>
  );
}

export default SignupCounter;
