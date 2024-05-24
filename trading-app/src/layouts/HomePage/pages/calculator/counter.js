import React, { useState, useEffect } from 'react';
import MDBox from '../../../../components/MDBox';
import { Grid } from '@mui/material';
import MDTypography from '../../../../components/MDTypography';

function Counter({ initialCount, fontSize, color }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000; // Adjust the duration of the animation
    const steps = 100; // Number of animation steps

    const stepValue = initialCount / steps;
    let step = 0;

    const interval = setInterval(() => {
      if (step < steps) {
        setCount((prevCount) => prevCount + stepValue);
        step++;
      } else {
        setCount(initialCount);
        clearInterval(interval);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [initialCount]);

  return (
    <MDBox display='flex' justifyContent='center'>
      <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
        <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
          <MDTypography fontSize={fontSize}  fontWeight='bold' style={{color:color}}>₹{Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(count)}</MDTypography>
        </Grid>
      </Grid>
    </MDBox>
  );
}

export default Counter;
