import React from 'react'
import { Grid, TextField } from '@mui/material';
import MDTypography from '../../../../components/MDTypography';

export default function PastTime({ pastStartTime, setPastStartTime, pastEndTime, setPastEndTime, isMobile }) {

  console.log(pastStartTime, pastEndTime)
  return (
    <>
      <Grid item xs={12} md={12} lg={6} mb={2} display='flex' alignContent={'left'} justifyContent={'flex-start'} gap={1}>
        <MDTypography style={{ fontSize: 15, fontWeight: 600 }}>
          Investment From
        </MDTypography>

        <TextField
          id="outlined-required"
          name="pastStartTime"
          fullWidth
          type="month"
          sx={{ width: isMobile ? '100px' : '150px' }}
          InputProps={{
            style: { height: '25px' }, // Adjust the height value here
          }}
          value={pastStartTime}
          onChange={(e) => {
            setPastStartTime(e.target.value);
          }}
        />

        <MDTypography style={{ fontSize: 15, fontWeight: 600 }}>
          To
        </MDTypography>

        <TextField
          id="outlined-required"
          name="pastEndTime"
          fullWidth
          type="month"
          sx={{ width: isMobile ? '100px' : '150px' }}
          InputProps={{
            style: { height: '25px' }, // Adjust the height value here
          }}
          value={pastEndTime}
          onChange={(e) => {
            setPastEndTime(e.target.value);
          }}
        />
      </Grid>
    </>
  )
}