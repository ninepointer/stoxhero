import {useState, useEffect, useContext} from 'react';
import axios from "axios";
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea, Divider, Grid } from '@mui/material';
import { userContext } from '../../../AuthContext';
import MDTypography from '../../../components/MDTypography';
import { CircularProgress, LinearProgress, Paper } from '@mui/material';
import TestZoneRevenueChart from '../data/testZoneRevenueChart'
import TenXRevenueChart from '../data/tenXRevenueChart'
import MarginXRevenueChart from '../data/marginXRevenueChart'
import BattleRevenueChart from '../data/battleRevenueChart'
import TotalTestZoneRevenue from '../data/totalTestZoneRevenue'
import MarginXRevenue from '../data/totalMarginXRevenue'
import BattleRevenue from '../data/totalBattleRevenue'
import TenXRevenue from '../data/totalTenXRevenue'
import TotalRevenue from '../data/totalRevenue'
import { saveAs } from 'file-saver';
import moment from 'moment'

export default function Dashboard() {
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  let [isLoading,setIsLoading] = useState([])
  const [testZoneMonthlyRevenue,setTestZoneMonthlyRevenue] = useState([])
  const [totalTestZoneRevenue,setTotalTestZoneRevenue] = useState([])
  const [tenXMonthlyRevenue,setTenXMonthlyRevenue] = useState([])
  const [totalTenXRevenue,setTotalTenXRevenue] = useState([])
  const [marginXMonthlyRevenue,setMarginXMonthlyRevenue] = useState([])
  const [totalMarginXRevenue,setTotalMarginXRevenue] = useState([])
  const [battleMonthlyRevenue,setBattleMonthlyRevenue] = useState([])
  const [totalBattleRevenue,setTotalBattleRevenue] = useState([])
  const [overallRevenue,setOverallRevenue] = useState([])
  const [overallMonthlyRevenue,setOverallMonthlyRevenue] = useState([])
  const [downloadingTestZoneData,setDownloadingTestZoneRevenueData] = useState(false)
  const [downloadingMarginXData,setDownloadingMarginXRevenueData] = useState(false)
  
  
  useEffect(()=>{
    setIsLoading(true)
    let call1 = axios.get((`${baseUrl}api/v1/revenue/gettestzonerevenue`),{
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                  },
                })
    let call2 = axios.get((`${baseUrl}api/v1/revenue/overallrevenue`),{
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                  },
                })
    Promise.all([call1, call2])
    .then(([api1Response, api2Response]) => {
        setTestZoneMonthlyRevenue(api1Response.data.testZoneData)
        setTotalTestZoneRevenue(api1Response.data.totalTestZoneRevenue)
        setTenXMonthlyRevenue(api1Response.data.tenXData)
        setTotalTenXRevenue(api1Response.data.totalTenXRevenue)
        setMarginXMonthlyRevenue(api1Response.data.marginXData)
        setTotalMarginXRevenue(api1Response.data.totalMarginXRevenue)
        setBattleMonthlyRevenue(api1Response.data.battleData)
        setTotalBattleRevenue(api1Response.data.totalBattleRevenue);
        setOverallRevenue(api2Response?.data?.totalRevenueData);
        setOverallMonthlyRevenue(api2Response?.data?.totalMonthWiseData);
        setIsLoading(false)
    })
    .catch((error) => {
    //   Handle errors here
      console.error(error);
    });
    
  },[])

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
                              <MDTypography variant="h6" style={{textAlign:'center'}}>Overall Revenue Data</MDTypography>
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

              <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
              
                <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'auto'}}>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                            {overallRevenue && <TotalRevenue overallRevenue={overallRevenue}/>}
                    </Grid>
    
                </Grid>
    
              </Grid>
    
              <Grid item xs={12} md={12} lg={8} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
              
                <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                    
                    <Grid item spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
                      
                        <TestZoneRevenueChart testZoneMonthlyRevenue={overallMonthlyRevenue}/>
                        
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
                      
                      <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent="center" alignItems="center">
                        <Grid item p={1} xs={12} md={12} lg={8} display='flex' justifyContent='flex-start' alignContent="center" alignItems="center">
                          <MDTypography variant="h6" style={{textAlign:'center'}}>TestZone Revenue Data</MDTypography>
                        </Grid>
                        {!downloadingTestZoneData ? 
                         <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='flex-end' alignContent="center" alignItems="center">
                          <MDButton variant='text' color='success' onClick={() => { handleDownload(`TestZone Revenue Data`) }}>
                            Download Data
                          </MDButton>
                        </Grid>
                        :
                        <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='flex-end' alignContent="center" alignItems="center">
                          <MDTypography mr={5} fontSize={15} color='warning' fontWeight="bold">Downloading</MDTypography>
                        </Grid>
                        }
                      </Grid>
                    
                  </Card>
                  </Grid>
              </Grid>

            </Grid>

            <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
            
              <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'auto'}}>
                  <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                          {totalTestZoneRevenue && <TotalTestZoneRevenue totalTestZoneRevenue={totalTestZoneRevenue}/>}
                  </Grid>

              </Grid>

            </Grid>

            <Grid item xs={12} md={12} lg={8} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
            
              <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                  
                  <Grid item spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
                    
                      <TestZoneRevenueChart testZoneMonthlyRevenue={testZoneMonthlyRevenue}/>
                      
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
                          <MDTypography variant="h6" style={{textAlign:'center'}}>TenX Revenue Data</MDTypography>
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

            <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
            
              <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'auto'}}>
                  <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                          {totalTenXRevenue && <TenXRevenue totalTenXRevenue={totalTenXRevenue}/>}
                  </Grid>

              </Grid>

            </Grid>

            <Grid item xs={12} md={12} lg={8} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
            
              <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                  
                  <Grid item spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
                    
                      <TenXRevenueChart tenXMonthlyRevenue={tenXMonthlyRevenue}/>
                      
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
                      
                      <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent="center" alignItems="center">
                        <Grid item p={1} xs={12} md={12} lg={8} display='flex' justifyContent='flex-start' alignContent="center" alignItems="center">
                          <MDTypography variant="h6" style={{textAlign:'center'}}>MarginX Revenue Data</MDTypography>
                        </Grid>
                        {!downloadingMarginXData ? 
                         <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='flex-end' alignContent="center" alignItems="center">
                          <MDButton variant='text' color='success' onClick={() => { handleDownload(`MarginX Revenue Data`) }}>
                            Download Data
                          </MDButton>
                        </Grid>
                        :
                        <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='flex-end' alignContent="center" alignItems="center">
                          <MDTypography mr={5} fontSize={15} color='warning' fontWeight="bold">Downloading</MDTypography>
                        </Grid>
                        }
                      </Grid>
                    
                  </Card>
                  </Grid>
              </Grid>

            </Grid>
            <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
            
              <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'auto'}}>
                  <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                          {totalMarginXRevenue && <MarginXRevenue totalMarginXRevenue={totalMarginXRevenue}/>}
                  </Grid>

              </Grid>

            </Grid>

            <Grid item xs={12} md={12} lg={8} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
            
              <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                  
                  <Grid item spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
                    
                      <MarginXRevenueChart marginXMonthlyRevenue={marginXMonthlyRevenue}/>
                      
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
                          <MDTypography variant="h6" style={{textAlign:'center'}}>Battle Revenue Data</MDTypography>
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
            <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
            
              <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'auto'}}>
                  <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                          {totalBattleRevenue && <BattleRevenue totalBattleRevenue={totalBattleRevenue}/>}
                  </Grid>

              </Grid>

            </Grid>

            <Grid item xs={12} md={12} lg={8} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
            
              <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                  
                  <Grid item spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
                    
                      <BattleRevenueChart battleMonthlyRevenue={battleMonthlyRevenue}/>
                      
                  </Grid>
                  

              </Grid>

            </Grid>

          </Grid>
          :
          <Grid container mb={1} spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'380px'}}>
            <CircularProgress/>
          </Grid>
        }

    </MDBox>
  );
}