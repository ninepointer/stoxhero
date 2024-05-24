import React from 'react'
import { Grid, TextField } from '@mui/material';
import MDTypography from '../../../../components/MDTypography';


export default function FutureTime({futureInvestmentTime, setFutureInvestmentTime, isMobile}){

    return(
        <>
            <Grid item xs={12} md={12} lg={6} mb={2} display='flex' alignContent={'left'} justifyContent={'flex-start'} gap={1}>
              <MDTypography style={{ fontSize: 15, fontWeight: 600 }}>
                Investment Time(in years):
              </MDTypography>

              <TextField
                id="outlined-required"
                name="futureInvestmentTime"
                fullWidth
                type="number"
                sx={{ width: isMobile ? '100px' : '150px' }}
                InputProps={{
                  style: { height: '25px' }, // Adjust the height value here
                }}
                value={futureInvestmentTime}
                onChange={(e) => {
                  setFutureInvestmentTime(Math.abs(e.target.value));
                }}
              />
            </Grid>
        </>
    )
}