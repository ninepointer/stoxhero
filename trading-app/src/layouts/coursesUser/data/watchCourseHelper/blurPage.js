import React from 'react';
import Grid from '@mui/material/Grid';
import {Box, Typography} from '@mui/material';

const EnrollPage = () => {
  const rootStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: 'rgba(255, 0, 255, 0.5)', // Adjust the opacity as needed
    position: 'relative',
    zIndex: 1,
  };

  const backdropStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backdropFilter: 'blur(5px)',
  };

  const messageStyle = {
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    zIndex: 3,
  };

  return (
    <Grid
    container
    xs={12}
    sm={12}
    md={12}
    lg={12}
    xl={12}
    mt={25}
    display='flex'
    justifyContent='center'
    position= 'absolute'
    alignItems='center'
>
    <Grid item xs={12} sx={{ zIndex: 4 }}>
        <Typography variant="h6" align="center" color='#000000'>
            You don't have enrolled in this course. Please buy it.
        </Typography>
    </Grid>
</Grid>
  );
};

export default EnrollPage;
