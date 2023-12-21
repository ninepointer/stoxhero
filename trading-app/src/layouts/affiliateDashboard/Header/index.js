import {useState, useEffect, useContext} from 'react';
import axios from "axios";
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton'
import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
import { CardActionArea, Divider, Grid } from '@mui/material';
// import { userContext } from '../../../AuthContext';
import MDTypography from '../../../components/MDTypography';
import { CircularProgress } from '@mui/material';
import LifetimeAffiliateData from '../data/lifetimeAffiliateData'
import LifetimeYouTubeAffiliateData from '../data/lifetimeYouTubeAffiliateData'
import LifetimeStoxHeroAffiliateData from '../data/lifetimeStoxHeroAffiliateData'
import LifetimeOfflineAffiliateData from '../data/lifetimeOfflineAffiliateData'
import { saveAs } from 'file-saver';
import moment from 'moment'
import LeaderBoard from '../data/leaderboard';

export default function Dashboard() {
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  let [isLoading,setIsLoading] = useState([])
  const [affiliateOverview,setAffiliateOverview] = useState([])
  const [affiliateReferrals,setAffiliateReferrals] = useState([])
  const [ytaffiliateReferrals,setYTAffiliateReferrals] = useState([])
  const [ytaffiliateOverview,setYTAffiliateOverview] = useState([])
  const [shaffiliateReferrals,setSHAffiliateReferrals] = useState([])
  const [shaffiliateOverview,setSHAffiliateOverview] = useState([])
  const [oiaffiliateReferrals,setOIAffiliateReferrals] = useState([])
  const [oiaffiliateOverview,setOIAffiliateOverview] = useState([])
  const [leaderboard, setLeaderboard] = useState([]);
  const [downloadingTestZoneData,setDownloadingTestZoneRevenueData] = useState(false)
  const [downloadingMarginXData,setDownloadingMarginXRevenueData] = useState(false)
  
  
  useEffect(() => {
    setIsLoading(true)
    let call1 = axios.get((`${baseUrl}api/v1/affiliate/affiliateoverview`), {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
    })
    let call2 = axios.get((`${baseUrl}api/v1/affiliate/ytaffiliateoverview`), {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
    })
    let call3 = axios.get((`${baseUrl}api/v1/affiliate/shaffiliateoverview`), {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
    })
    let call4 = axios.get((`${baseUrl}api/v1/affiliate/oiaffiliateoverview`), {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
    })
    let call5 = axios.get((`${baseUrl}api/v1/affiliate/leaderboard`), {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
    })
    Promise.all([call1, call2, call3, call4, call5])
      .then(([api1Response, api2Response, api3Response, api4Response, api5Response]) => {
        setAffiliateOverview(api1Response?.data?.data[0])
        setAffiliateReferrals(api1Response?.data?.referrals)
        setYTAffiliateOverview(api2Response?.data?.data[0])
        setYTAffiliateReferrals(api2Response?.data?.referrals)
        setSHAffiliateOverview(api3Response?.data?.data[0])
        setSHAffiliateReferrals(api3Response?.data?.referrals)
        setOIAffiliateOverview(api4Response?.data?.data[0])
        setOIAffiliateReferrals(api4Response?.data?.referrals)
        setLeaderboard(api5Response?.data?.data)
        setIsLoading(false)
      })
      .catch((error) => {
        //   Handle errors here
        console.error(error);
      });

  }, [])

  function TruncatedName(name) {
    const originalName = name;
    const convertedName = originalName
      .toLowerCase() // Convert the entire name to lowercase
      .split(' ') // Split the name into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(' '); // Join the words back together with a space
  
    // Trim the name to a maximum of 30 characters
    const truncatedName = convertedName.length > 30 ? convertedName.substring(0, 30) + '...' : convertedName;
  
    return truncatedName;
  }

  const downloadTestZoneRevenueData = () => {
    setDownloadingTestZoneRevenueData(true)
    return new Promise((resolve, reject) => {
        axios
        .get(`${baseUrl}api/v1/revenue/downloadtestzonerevenuedata`, {
            withCredentials: true,
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
            },
        })
        .then((res) => {
            resolve(res.data.data); // Resolve the promise with the data
            setDownloadingTestZoneRevenueData(false)
        })
        .catch((err) => {
            console.log(err)
            reject(err); // Reject the promise with the error'
            setDownloadingTestZoneRevenueData(false)
        });
    });
  };

  const downloadMarginXRevenueData = () => {
    setDownloadingMarginXRevenueData(true)
    return new Promise((resolve, reject) => {
        axios
        .get(`${baseUrl}api/v1/revenue/downloadmarginxrevenuedata`, {
            withCredentials: true,
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
            },
        })
        .then((res) => {
            resolve(res.data.data); // Resolve the promise with the data
            setDownloadingMarginXRevenueData(false)
        })
        .catch((err) => {
            console.log(err)
            reject(err); // Reject the promise with the error'
            setDownloadingMarginXRevenueData(false)
        });
    });
  };

  const handleDownload = async (nameVariable) => {
    console.log("Name:",nameVariable)
    try {
      // Wait for downloadContestData() to complete and return data
      let data = [];
      let csvData = [];
      if(nameVariable === 'TestZone Revenue Data'){
        data = await downloadTestZoneRevenueData();
        csvData = downloadHelper(data)
      }
      if(nameVariable === 'MarginX Revenue Data'){
        data = await downloadMarginXRevenueData();
        csvData = downloadHelper(data)
      }
      // Create the CSV content
      const csvContent = csvData?.map((row) => {
        return row?.map((row1) => row1.join(',')).join('\n');
      });
  
      // Create a Blob object with the CSV content
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  
      // Save the file using FileSaver.js
      saveAs(blob, `${nameVariable}.csv`);
    } catch (error) {
      console.error('Error downloading revenue data:', error);
    }
  }

  function downloadHelper(data) {
    let csvDataFile = [[]]
    let csvDataDailyPnl = [["#","First Name", "Last Name", "Email", "Mobile", "Signup Method", "Joining Date", 
                            "Campaign Code", "Referrer Code", "Referral Code", "TestZone", 
                            "TestZone Date", "TestZone Portfolio", "Purchase Date", 
                            "TestZone Status", "Actual Price", "Buying Price", "Bonus Used", 
                            "Rank", "Payout", "TDS Amount", "Net P&L", "Gross P&L", "# of Trades"]]
    if (data) {
      // dates = Object.keys(data)
      let csvpnlData = Object.values(data)
      csvDataFile = csvpnlData?.map((elem, index) => {

        return [
          index+1,
          TruncatedName(elem?.first_name),
          TruncatedName(elem?.last_name),
          elem?.email,
          elem?.mobile,
          elem?.creationProcess,
          moment.utc(elem?.joiningDate).format('DD-MMM-YY'),
          elem?.campaignCode,
          elem?.referrerCode,
          elem?.myReferralCode,
          elem?.testzone,
          moment.utc(elem?.testzoneDate).format('DD-MMM-YY'),
          elem?.testzonePortfolio,
          moment.utc(elem?.purchaseDate).format('DD-MMM-YY HH:mm'),
          elem?.contestStatus,
          elem?.actualPrice?.toFixed(2),
          elem?.buyingPrice?.toFixed(2),
          elem?.bonusRedemption?.toFixed(2),
          elem?.rank,
          elem?.payout?.toFixed(0),
          elem?.tdsAmount?.toFixed(0),
          elem?.npnl?.toFixed(0),
          elem?.gpnl?.toFixed(0),
          elem?.trades,

        ]
      })
    }

    return [[...csvDataDailyPnl, ...csvDataFile]]
  }


  return (
   
    <MDBox mt={2} mb={1} borderRadius={10} minHeight='auto' display='flex' justifyContent='center' alignItems='center' flexDirection='column'>

        {!isLoading ? 
          <Grid container mb={1} spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'auto'}}>
              
              <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
              
                <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'auto'}}>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                      <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1, backgroundColor:'lightgrey' }} >
                      
                          <Grid container xs={12} md={12} lg={12}>
                            <Grid item p={1} xs={12} md={12} lg={8} display='flex' justifyContent='flex-start'>
                              <MDTypography variant="h6" style={{textAlign:'center'}}>Affiliate Program Overview</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='flex-end'>
                              <MDButton variant='text' color='success'>
                                Download Data
                              </MDButton>
                            </Grid>
                          </Grid>
                        
                      </Card>
                    </Grid>
                </Grid>
    
              </Grid>

              <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
              
                <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'auto'}}>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                            {affiliateOverview && <LifetimeAffiliateData affiliateOverview={affiliateOverview} affiliateReferrals={affiliateReferrals}/>}
                    </Grid>
    
                </Grid>
    
              </Grid>
    
          </Grid>
          :
          <Grid container mb={1} spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'380px'}}>
            <CircularProgress/>
          </Grid>
        }

        {!isLoading ? 
          <Grid container mb={1} spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'auto'}}>
              
              <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
              
                <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'auto'}}>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                      <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1, backgroundColor:'lightgrey' }} >
                      
                          <Grid container xs={12} md={12} lg={12}>
                            <Grid item p={1} xs={12} md={12} lg={8} display='flex' justifyContent='flex-start'>
                              <MDTypography variant="h6" style={{textAlign:'center'}}>YouTube Affiliates Overview</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='flex-end'>
                              <MDButton variant='text' color='success'>
                                Download Data
                              </MDButton>
                            </Grid>
                          </Grid>
                        
                      </Card>
                    </Grid>
                </Grid>
    
              </Grid>

              <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
              
                <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'auto'}}>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                        {ytaffiliateOverview ? 
                                <LifetimeYouTubeAffiliateData ytaffiliateOverview={ytaffiliateOverview} ytaffiliateReferrals={ytaffiliateReferrals}/>
                            :
                                
                                <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1 }} >
                                    <CardActionArea>
                                    <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{minHeight:'20vH', width:'100%'}}>
                                        <MDTypography>No Data</MDTypography> 
                                    </MDBox>
                                    </CardActionArea> 
                                </Card>
                                
                            }
                    </Grid>
    
                </Grid>
    
              </Grid>
    
          </Grid>
          :
          <Grid container mb={1} spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'380px'}}>
            <CircularProgress/>
          </Grid>
        }

        {!isLoading ? 
          <Grid container mb={1} spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'auto'}}>
              
              <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
              
                <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'auto'}}>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                      <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1, backgroundColor:'lightgrey' }} >
                      
                          <Grid container xs={12} md={12} lg={12}>
                            <Grid item p={1} xs={12} md={12} lg={8} display='flex' justifyContent='flex-start'>
                              <MDTypography variant="h6" style={{textAlign:'center'}}>StoxHero Affiliates Overview</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='flex-end'>
                              <MDButton variant='text' color='success'>
                                Download Data
                              </MDButton>
                            </Grid>
                          </Grid>
                        
                      </Card>
                    </Grid>
                </Grid>
    
              </Grid>

              <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
              
                <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'auto'}}>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                        {shaffiliateOverview ? 
                                <LifetimeStoxHeroAffiliateData shaffiliateOverview={shaffiliateOverview} shaffiliateReferrals={shaffiliateReferrals}/>
                            :
                                
                                <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1 }} >
                                    <CardActionArea>
                                    <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{minHeight:'20vH', width:'100%'}}>
                                        <MDTypography>No Data</MDTypography> 
                                    </MDBox>
                                    </CardActionArea> 
                                </Card>
                                
                        }
                    </Grid>
    
                </Grid>
    
              </Grid>
    
          </Grid>
          :
          <Grid container mb={1} spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'380px'}}>
            <CircularProgress/>
          </Grid>
        }

        {!isLoading ? 
          <Grid container mb={1} spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'auto'}}>
              
              <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
              
                <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'auto'}}>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                      <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1, backgroundColor:'lightgrey' }} >
                      
                          <Grid container xs={12} md={12} lg={12}>
                            <Grid item p={1} xs={12} md={12} lg={8} display='flex' justifyContent='flex-start'>
                              <MDTypography variant="h6" style={{textAlign:'center'}}>Offline Institute Affiliates Overview</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='flex-end'>
                              <MDButton variant='text' color='success'>
                                Download Data
                              </MDButton>
                            </Grid>
                          </Grid>
                        
                      </Card>
                    </Grid>
                </Grid>
    
              </Grid>

              <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
              
                <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'auto'}}>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                            {oiaffiliateOverview ? 
                                <LifetimeOfflineAffiliateData oiaffiliateOverview={oiaffiliateOverview} oiaffiliateReferrals={oiaffiliateReferrals}/>
                            :
                                
                                <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1 }} >
                                    <CardActionArea>
                                    <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{minHeight:'20vH', width:'100%'}}>
                                        <MDTypography>No Data</MDTypography> 
                                    </MDBox>
                                    </CardActionArea> 
                                </Card>
                                
                            }
                    </Grid>
    
                </Grid>
    
              </Grid>
    
          </Grid>
          :
          <Grid container mb={1} spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'380px'}}>
            <CircularProgress/>
          </Grid>
        }

      {!isLoading ?
        // <Grid container mb={1} spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{ minWidth: '100%', minHeight: 'auto' }}>
          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{ width: '100%', minHeight: 'auto' }}>
            <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{ minWidth: '100%', minHeight: 'auto' }}>
              <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                <LeaderBoard leaderboard={leaderboard} />
              </Grid>
            </Grid>
          </Grid>
        // </Grid>
        :
        <Grid container mb={1} spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{ minWidth: '100%', minHeight: '380px' }}>
          <CircularProgress />
        </Grid>
      }

    </MDBox>
  );
}