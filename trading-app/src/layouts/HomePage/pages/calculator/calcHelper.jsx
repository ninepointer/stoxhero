import React, {useState} from 'react'
import MDTypography from '../../../../components/MDTypography';
import { Grid, TextField, useMediaQuery } from '@mui/material';
import CalculatorCard from './calcCard';
import theme from "../../utils/theme/index";
import FutureTime from './futureTimeperiod';
import PastTime from './pastTimeperiod';


export default function CalculatorHelper({ assets, liabilities, assetSum, setAssetSum, liabilitiesSum, setLiabilitiesSum, timePeriod }) {
  const now = new Date();
  const [futureInvestmentTime, setFutureInvestmentTime] = useState(1);
  const [pastStartTime, setPastStartTime] = useState(`${now?.getFullYear()}-${(now?.getMonth() + 1).toString().padStart(2, '0')}`);

  const [pastEndTime, setPastEndTime] = useState(`${now?.getFullYear() + 1}-${(now?.getMonth()+1)?.toString()?.padStart(2, '0')}`);
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

    return (
      <>
        <Grid container xs={12} md={12} lg={12} mt={10} p={isMobile ? 2 : 5}>
          <Grid item xs={12} md={12} lg={12} mb={isMobile ? 2 : 5}>
            <MDTypography style={{ fontSize: isMobile ? 25 : 35, fontWeight: 800 }}>
              <span style={{ borderBottom: '4px solid green' }}>Whats</span>  your Net Worth?
            </MDTypography>
          </Grid>


          {(timePeriod === 'future') ?
            <FutureTime futureInvestmentTime={futureInvestmentTime} setFutureInvestmentTime={setFutureInvestmentTime} isMobile={isMobile} />
            :
            <PastTime pastEndTime={pastEndTime} setPastEndTime={setPastEndTime} pastStartTime={pastStartTime} setPastStartTime={setPastStartTime} isMobile={isMobile} />}

          <CalculatorCard
            assets={assets}
            liabilities={liabilities}
            assetSum={assetSum}
            setAssetSum={setAssetSum}
            liabilitiesSum={liabilitiesSum}
            setLiabilitiesSum={setLiabilitiesSum}
            futureInvestmentTime={futureInvestmentTime}
            pastEndTime={pastEndTime}
            pastStartTime={pastStartTime}
            isMobile={isMobile}
          />
        </Grid>
      </>
    );
}