import React,{useState, useEffect, useContext} from 'react';
import axios from "axios";
import MDBox from '../../../components/MDBox';
// import MDButton from '../../../components/MDButton'
import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
import { CardActionArea, CardContent, CardMedia, Divider, FormControl, Grid, InputLabel, Select } from '@mui/material';
// import { userContext } from '../../../AuthContext';
import MDTypography from '../../../components/MDTypography';
// import { CircularProgress } from '@mui/material';
// import LifetimeAffiliateData from '../data/lifetimeAffiliateData'
// import LifetimeYouTubeAffiliateData from '../data/lifetimeYouTubeAffiliateData'
// import LifetimeStoxHeroAffiliateData from '../data/lifetimeStoxHeroAffiliateData'
// import LifetimeOfflineAffiliateData from '../data/lifetimeOfflineAffiliateData'
import { saveAs } from 'file-saver';
import moment from 'moment'
// import LeaderBoard from '../data/leaderboard';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import signupcount from 
import { apiUrl } from '../../../constants/constants';
import ReferredProduct from "../data/transactions"
import RaferralGrid from "../data/affiliateRaferrals"
import logo from '../../../assets/images/logo1.jpeg'

export default function Dashboard() {
  let [isLoading,setIsLoading] = useState([])
  const [affiliateOverview,setAffiliateOverview] = useState([]);
  const [affiliateRafferalSummery,setAffiliateRafferalSummery] = useState([]);
  const [affiliateReferrals,setAffiliateReferrals] = useState([]);
  const date = new Date();
  const lastMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const [startDate, setStartDate] = React.useState(dayjs(lastMonth));

  const [endDate,setEndDate] = useState(dayjs(date))
  // const [shaffiliateReferrals,setSHAffiliateReferrals] = useState([])
  // const [shaffiliateOverview,setSHAffiliateOverview] = useState([])
  // const [oiaffiliateReferrals,setOIAffiliateReferrals] = useState([])
  // const [oiaffiliateOverview,setOIAffiliateOverview] = useState([])
  // const [leaderboard, setLeaderboard] = useState([]);
  // const [downloadingTestZoneData,setDownloadingTestZoneRevenueData] = useState(false)
  // const [downloadingMarginXData,setDownloadingMarginXRevenueData] = useState(false)
  
  
  useEffect(() => {
    setIsLoading(true)
    let call1 = axios.get((`${apiUrl}affiliate/mysummery?startDate=${startDate}&endDate=${endDate}`), {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
    })
    let call2 = axios.get((`${apiUrl}affiliate/myaffiliaterafferals`), {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
    })

    Promise.all([call1, call2])
      .then(([api1Response, api2Response]) => {
        setAffiliateOverview(api1Response?.data?.data[0])
        setAffiliateRafferalSummery(api1Response?.data?.affiliateRafferalSummery[0])
        setAffiliateReferrals(api2Response?.data?.data?.affiliateReferrals)
        setIsLoading(false)
      })
      .catch((error) => {
        //   Handle errors here
        console.error(error);
      });

  }, [])



  async function handleShowDetails(start, end){
    let call1 = axios.get((`${apiUrl}affiliate/mysummery?startDate=${start}&endDate=${end}`), {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
    })


    Promise.all([call1])
      .then(([api1Response]) => {
        setAffiliateOverview(api1Response?.data?.data[0])
        setAffiliateRafferalSummery(api1Response?.data?.affiliateRafferalSummery[0])
        setIsLoading(false)
      })
      .catch((error) => {
        //   Handle errors here
        console.error(error);
      });
  }


  return (

    <MDBox mt={2} mb={1} borderRadius={10} minHeight='auto' display='flex' justifyContent='center' alignItems='center' flexDirection='column'>
      <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
        <Grid item xs={12} md={12} lg={12}>
          <MDTypography fontSize={15} fontWeight='bold'>User Affiliate Dashboard</MDTypography>
        </Grid>
        <Grid item xs={12} md={12} lg={12} mt={1} display='flex' justifyContent='center'>
          <Grid container spacing={2} xs={12} md={12} lg={12} display='flex' justifyContent='center'>

            <Grid item xs={12} md={6} xl={3} mt={-1} mb={1}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={async (e) => { setStartDate(prev => dayjs(e)); await handleShowDetails(dayjs(e), endDate); }}
                    sx={{ width: '100%' }}
                    // disabled={selectedTab?.isLifetime}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6} xl={3} mt={-1} mb={1}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={async (e) => {setEndDate(prev => dayjs(e)); await handleShowDetails(startDate, dayjs(e)) }}
                    // disabled={selectedTab?.isLifetime}
                    sx={{ width: '100%' }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={12} lg={12} mt={2} display='flex' justifyContent='center'>
          <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center'>

            <Grid item xs={12} md={12} lg={2.4} sx={{ minWidth: 120 }}>
              <Card sx={{ maxWidth: 345, alignContent: 'center', alignItems: 'center' }}>
                <CardMedia
                  component="img"
                  alt="signup"
                  height="20"
                  image={logo}
                />
                <CardContent>
                  <MDTypography variant="h6" fontSize={15} gutterBottom style={{ textAlign: 'center' }}>
                    Product Transaction
                  </MDTypography>
                  <MDTypography variant="body2" color="text.secondary" gutterBottom style={{ textAlign: 'center' }}>
                    {(affiliateOverview?.summery && affiliateOverview?.summery[0]?.totalProductCount) || 0}
                  </MDTypography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={12} lg={2.4} sx={{ minWidth: 120 }}>
              <Card sx={{ maxWidth: 345, alignContent: 'center', alignItems: 'center' }}>
                <CardMedia
                  component="img"
                  alt="signup"
                  height="20"
                  image={logo}
                />
                <CardContent>
                  <MDTypography variant="h6" fontSize={15} gutterBottom style={{ textAlign: 'center' }}>
                    Earning (Product)
                  </MDTypography>
                  <MDTypography variant="body2" color="text.secondary" gutterBottom style={{ textAlign: 'center' }}>
                  { "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(affiliateOverview?.summery ? (affiliateOverview?.summery[0]?.totalProductCPayout || 0) : 0))}
                  </MDTypography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={12} lg={2.4} sx={{ minWidth: 120 }}>
              <Card sx={{ maxWidth: 345, alignContent: 'center', alignItems: 'center' }}>
                <CardMedia
                  component="img"
                  alt="signup"
                  height="20"
                  image={logo}
                />
                <CardContent>
                  <MDTypography variant="h6" fontSize={15} gutterBottom style={{ textAlign: 'center' }}>
                    Total SignUp
                  </MDTypography>
                  <MDTypography variant="body2" color="text.secondary" gutterBottom style={{ textAlign: 'center' }}>
                    {affiliateRafferalSummery?.affiliateRefferalCount || 0}
                  </MDTypography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={12} lg={2.4} sx={{ minWidth: 120 }}>
              <Card sx={{ maxWidth: 345, alignContent: 'center', alignItems: 'center' }}>
                <CardMedia
                  component="img"
                  alt="signup"
                  height="20"
                  image={logo}
                />
                <CardContent>
                  <MDTypography variant="h6" fontSize={15} gutterBottom style={{ textAlign: 'center' }}>
                    Earning (SignUp)
                  </MDTypography>
                  <MDTypography variant="body2" color="text.secondary" gutterBottom style={{ textAlign: 'center' }}>
                  { "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(affiliateRafferalSummery?.affiliateRefferalPayout || 0))}

                  </MDTypography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={12} lg={2.4} sx={{ minWidth: 120 }}>
              <Card sx={{ maxWidth: 345, alignContent: 'center', alignItems: 'center' }}>
                <CardMedia
                  component="img"
                  alt="signup"
                  height="20"
                  image={logo}
                />
                <CardContent>
                  <MDTypography variant="h6" fontSize={15} gutterBottom style={{ textAlign: 'center' }}>
                    Total Earning
                  </MDTypography>
                  <MDTypography variant="body2" color="text.secondary" gutterBottom style={{ textAlign: 'center' }}>
                  { "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format((affiliateOverview?.summery?.[0]?.totalProductCPayout ?? 0) +(affiliateRafferalSummery?.affiliateRefferalPayout ?? 0)))}

                  </MDTypography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={12} lg={12} sx={{ minWidth: 120 }}>
          <RaferralGrid affiliateReferrals={affiliateReferrals} />
        </Grid>

        <Grid item xs={12} md={12} lg={12} sx={{ minWidth: 120 }}>
          <ReferredProduct transactions={affiliateOverview?.transaction} />
        </Grid>
      </Grid>
    </MDBox>
  );
}