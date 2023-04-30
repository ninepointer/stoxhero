import React, {useEffect, useState, useCallback, useMemo, useContext} from 'react';
// import axios from "axios";
import {  Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
// import MDAvatar from '../../../components/MDAvatar';
// import MDButton from '../../../components/MDButton'
// import {Link} from 'react-router-dom'
// import niftyicon from '../../../assets/images/nifty50icon.png'
// import bankniftyicon from '../../../assets/images/bankniftyicon.png'
// import upicon from '../../../assets/images/arrow.png'
// import downicon from '../../../assets/images/down.png'
// import marginicon from '../../../assets/images/marginicon.png'
// import netpnlicon from '../../../assets/images/netpnlicon.png'


// import TradableInstrument from '../../tradingCommonComponent/TradableInstrument/TradableInstrument';
// import WatchList from '../data/WatchList';
// import BuySell from '../data/BuySell'
// import MyPosition from '../data/MyPosition'
// import Orders from '../data/orders'
// import WatchList from "../../tradingCommonComponent/InstrumentDetails/index"
import { userContext } from '../../../AuthContext';
// import { io } from 'socket.io-client';
// import StockIndex from '../../tradingCommonComponent/StockIndex/StockIndex';
// import OverallPnl from '../../tradingCommonComponent/OverallP&L/OverallGrid'
import AppliedBatch from '../data/appliedBatch';
import UpcomingBatch from '../data/upcomingBatch';

export default function StoxHeroRegistration() {

  const [render, setReRender] = useState(true);
  const getDetails = useContext(userContext);
  const [isGetStartedClicked, setIsGetStartedClicked] = useState(false);



  return (
    <>

    <MDBox bgColor="dark" color="light" mt={2} mb={1} p={2} borderRadius={10}>

      <Grid container >
        <Grid item xs={12} md={6} lg={12} mb={2}>
          <MDTypography mb={2} color="light" fontWeight="bold" style={{textDecoration: "underline"}}>Upcoming Batch</MDTypography>
          <UpcomingBatch Render={{render, setReRender}}/>
        </Grid>

        <Grid item xs={12} md={6} lg={12}>
          <MDTypography mb={2} color="light" fontWeight="bold" style={{textDecoration: "underline"}}>Applied Batch</MDTypography>
          <AppliedBatch Render={{render, setReRender}}/>
        </Grid>
      </Grid>

    </MDBox>
    </>
  );
}