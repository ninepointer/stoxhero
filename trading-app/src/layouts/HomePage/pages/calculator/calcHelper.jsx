import React, {useState} from 'react'
import MDTypography from '../../../../components/MDTypography';
import { Grid, TextField, useMediaQuery } from '@mui/material';
import CalculatorCard from './calcCard';
import theme from "../../utils/theme/index";


export default function CalculatorHelper({ assets, liabilities, assetSum, setAssetSum, liabilitiesSum, setLiabilitiesSum, timePeriod }) {
  const [futureInvestmentTime, setFutureInvestmentTime] = useState(1);
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

    return (
      <>
        <Grid container xs={12} md={12} lg={12} mt={10} p={isMobile ? 2 : 5}>
          <Grid item xs={12} md={12} lg={12} mb={isMobile ? 2 : 5}>
            <MDTypography style={{ fontSize: isMobile ? 25 : 35, fontWeight: 800 }}>
              <span style={{ borderBottom: '4px solid green' }}>Net</span> Worth Calculator
            </MDTypography>
          </Grid>


          {(timePeriod === 'future') ?
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
                  setFutureInvestmentTime(e.target.value);
                }}
              />
            </Grid>
            :
            <></>}

          <CalculatorCard
            assets={assets}
            liabilities={liabilities}
            assetSum={assetSum}
            setAssetSum={setAssetSum}
            liabilitiesSum={liabilitiesSum}
            setLiabilitiesSum={setLiabilitiesSum}
            futureInvestmentTime={futureInvestmentTime}
            isMobile={isMobile}
          />
        </Grid>
      </>
    );
}