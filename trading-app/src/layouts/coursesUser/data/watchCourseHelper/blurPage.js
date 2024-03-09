import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

const BlurPage = () => {
  const rootStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backdropFilter: 'blur(5px)',
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Adjust the opacity as needed
  };

  const messageStyle = {
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
  };

  return (
    <Grid container style={rootStyle}>
      <Grid item xs={12}>
        <Box sx={messageStyle}>
          You don't have enrolled in this course. Please buy it.
        </Box>
      </Grid>
    </Grid>
  );
};

export default BlurPage;
