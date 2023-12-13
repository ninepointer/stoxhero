import React, {useState, useEffect} from 'react'
import axios from "axios";
import { CircularProgress, Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
// import MDAvatar from '../../../components/MDAvatar';
// import todaysignup from '../../../assets/images/todaysignup.png'
// import netpnlicon from '../../../assets/images/netpnlicon.png'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import MDButton from '../../../components/MDButton';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import { withStyles } from '@mui/styles';
import MenuItem from '@mui/material/MenuItem';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {apiUrl} from '../../../constants/constants';
import DownloadIcon from '@mui/icons-material/Download';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { Tooltip } from '@mui/material';
import moment from 'moment';
// import Users from './users';

export default function FilteredUsers({setFilteredUsers}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState({
    affiliate: {
      id: "",
      name: ""
    }
  });
  // const [referralProgramme, setReferralProgramme] = React.useState([]);
  const [affiliate, setAffiliate] = React.useState([]);
  const date = new Date();
  const lastMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  lastMonth.setDate(date.getDate());
  const [startDate,setStartDate] = React.useState(dayjs(lastMonth));
  const [endDate,setEndDate] = React.useState(dayjs(date));
  // const [filteredUsers, setFilteredUsers] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const[data,setData] = useState([]);
  // const [selectedUser, setSelectedUser] = useState({
  //   id:'',
  //   name:'',
  //   mobile:''
  // });

  const perPage = 10;
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  const CustomTextField = withStyles({
    root: {
      '& .MuiInputBase-input': {
        color: '#000000', // Replace 'red' with your desired text color
        textAlign: 'center',
        height:'48px'
      },
      '& .MuiInput-underline:before': {
        borderBottomColor: '#000000', // Replace 'red' with your desired text color
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: '#000000', // Replace 'red' with your desired text color
      },
    },
  })(TextField);

  const CustomTextField2 = withStyles({
    root: {
      '& .MuiInputBase-input': {
        color: '#000000', // Replace 'red' with your desired text color
        textAlign: 'center',
        height:'40px'
      },
      '& .MuiInput-underline:before': {
        borderBottomColor: '#000000', // Replace 'red' with your desired text color
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: '#000000', // Replace 'red' with your desired text color
      },
    },
  })(TextField);

  useEffect(() => {

    setIsLoading(true);
    let call1 = axios.get(`${baseUrl}api/v1/affiliate`, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
    })

    Promise.all([call1])
      .then(([api1Response]) => {
        setAffiliate(api1Response.data.data)
        setIsLoading(false);
      })
      .catch((error) => {
        // Handle errors here
        console.error(error);
      });

  }, [])

  // useEffect(()=>{
  //   const startIndex = (currentPage - 1) * perPage;
  //   const slicedData = filteredUsers.slice(startIndex, startIndex + perPage);
  //   setData(slicedData);
  // }, [currentPage])

  // const handleNextPage = () => {
  //   setCurrentPage((prevPage) => prevPage + 1);
  // };

  // const handlePrevPage = () => {
  //   if (currentPage > 1) {
  //     setCurrentPage((prevPage) => prevPage - 1);
  //   }
  // };
  function handleReset(){
    setSelectedTab({
      affiliate: {
        id: "",
        name: ""
      }
    });
    // setSelectedUser({});
    setStartDate(dayjs(lastMonth));
    setEndDate(dayjs(date));
    setFilteredUsers([]);
    // setData([]);
  }
  async function handleShowDetails(){
    try{
      const res = await axios.get(`${apiUrl}affiliate/leaderboard?programme=${selectedTab?.affiliate?.id}&startDate=${startDate}&endDate=${endDate} `, {withCredentials:true});
      if(res.status == 200){
        setFilteredUsers(res.data.data);
        // const startIndex = (currentPage - 1) * perPage;
        // const slicedData = res.data.data.slice(startIndex, startIndex + perPage);
        // setData(slicedData);
        setIsLoading(false);
      }else{
        //handle error
      }
    }catch(e){
      console.log(e);
      //handle error
    }
  }

  const handleAffiliateChange = (e) =>{
    const affiliateId = e.target.value;
    const selectedAffiliate = affiliate.filter(elem=>elem?._id == affiliateId);
    console.log('selected', selectedAffiliate[0], affiliateId);
    setSelectedTab((prev)=>{
      return {
      ...prev,
      affiliate: {
        id:selectedAffiliate[0]?._id,
        name:selectedAffiliate[0]?.affiliateType
      },
    }});
    console.log('selected tab',selectedTab);

  }

  // const handleCampaignChange = (e) =>{
  //   const campaignId = e.target.value;

  //   const selectedCampaign = campaign.filter(elem=>elem?._id == campaignId);
  //   setSelectedTab((prev) => {
  //     return {
  //     ...prev,
  //     campaign: {
  //       id:selectedCampaign[0]?._id,
  //       name:selectedCampaign[0]?.campaignName
  //     },
  //   }})

  // }

  // function 

  // setselectedSubscription(referralProgramme.filter((item) => item._id == (e.target.value))[0])

  return (
    <>
    {isLoading ?
        <MDBox display="flex" justifyContent="center" alignItems="center" mt={10} mb={10}>
          <CircularProgress fontSize='xxl' color="light" />
        </MDBox>

      :
        <>
        <Grid mt={3} container>
          <Grid item xs={12} md={6} lg={12}>
            <MDBox bgColor="light" borderRadius={5}>

              <MDBox display="flex" justifyContent="space-around" alignContent="center" alignItems="center">
                <Grid container spacing={0} p={0} display="flex" justifyContent="space-evenly" alignContent="center" alignItems="center">


                  <Grid item xs={12} md={6} lg={12} mt={1} mb={1} p={0} display="flex" justifyContent="center" alignContent="center" alignItems="center">

                    <MDBox alignItem='center'>
                      <MDTypography display="flex" justifyContent="center" alignContent="center" alignItems="center" color="dark" fontSize={15} fontWeight="bold">Select Filters</MDTypography>

                      <Grid container spacing={0} p={0} lg={12} display="flex" alignContent="center" alignItems="center" justifyContent='space-between'>

                        <Grid item xs={12} md={6} lg={3} mb={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                          <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DemoContainer components={['DatePicker']}>
                                <DatePicker
                                  label="Start Date"
                                  value={startDate}
                                  onChange={(e) => { setStartDate(prev => dayjs(e)) }}
                                  sx={{ width: '100%' }}
                                />
                              </DemoContainer>
                            </LocalizationProvider>
                          </MDBox>
                        </Grid>

                        <Grid item xs={12} md={6} lg={3} mb={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                          <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={4}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DemoContainer components={['DatePicker']}>
                                <DatePicker
                                  label="End Date"
                                  // disabled={true}
                                  // defaultValue={dayjs(date)}
                                  value={endDate}
                                  onChange={(e) => { setEndDate(prev => dayjs(e)) }}
                                  // value={dayjs(date)}
                                  // onChange={(e) => {setFormStatePD(prevState => ({
                                  //   ...prevState,
                                  //   dateField: dayjs(e)
                                  // }))}}
                                  sx={{ width: '100%', marginLeft: "30px" }}
                                />
                              </DemoContainer>
                            </LocalizationProvider>
                          </MDBox>
                        </Grid>

                        <Grid item xs={12} md={6} lg={3} mb={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <CustomTextField
                          select
                          label="Affiliate Type"
                          value={selectedTab?.affiliate?.id}
                          minHeight="6em"
                          placeholder="Affiliate Type"
                          variant="outlined"
                          sx={{ width: "200px"}}
                          onChange={(e) => {handleAffiliateChange(e)}}
                          InputLabelProps={{
                            style: { color: '#000000' },
                          }}
                          SelectProps={{
                            MenuProps: {
                              PaperProps: {
                                style: { width: '400px' }, // Replace '200px' with your desired width
                              },
                            },
                          }}
                        >
                          {affiliate?.map((option) => (
                            <MenuItem key={option?._id} value={option?._id} minHeight="4em" width='300px'>
                              {option?.affiliateType}
                            </MenuItem>
                          ))}
                        </CustomTextField>
                        </Grid>


                      </Grid>
                    </MDBox>
                  </Grid>


                </Grid>
              </MDBox>

            </MDBox>
          </Grid>
        </Grid>
        {/* {data?.length>0 &&  */}
        <>
        {/* <MDBox display="flex" justifyContent="space-between" alignItems="left" width='100%' mt={1}>
        <MDBox width="100%" display="flex" justifyContent="space-between" alignItems="center" sx={{ backgroundColor: "#ffffff", borderRadius: "5px" }}>
        <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
          </MDTypography>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
            Filtered Users({filteredUsers?.length})
          </MDTypography>
        </MDBox>
      </MDBox> */}
      <Grid mt={2} p={1} container style={{border:'1px solid white', borderRadius:5}}>
          <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="left" alignContent="center" alignItems="center">
          <MDTypography color="light" fontSize={13} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">Full Name</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={2.8} display="flex" justifyContent="left" alignContent="center" alignItems="center">
          <MDTypography color="light" fontSize={13} fontWeight="bold">Email Id</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
          <MDTypography color="light" fontSize={13} fontWeight="bold">Mobile No.</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
          <MDTypography color="light" fontSize={13} fontWeight="bold">Referred By/Campaign</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
          <MDTypography color="light" fontSize={13} fontWeight="bold">SignUp Method</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={1.8} display="flex" justifyContent="center" alignContent="center" alignItems="center">
          <MDTypography color="light" fontSize={13} fontWeight="bold">Joining Date</MDTypography>
          </Grid>
      </Grid></>
      {/* } */}

      {/* {data?.map((elem)=>{
            
              return (
              <>  
              <Grid mt={1} p={1} container style={{border:'1px solid white', borderRadius:5}}>
                  <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                      <MDTypography color="light" fontSize={13} display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem?.first_name} {elem?.last_name}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={2.8} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                      <MDTypography color="light" fontSize={13}>{elem?.email}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color="light" fontSize={13}>{elem?.mobile}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color="light" fontSize={13}>{elem?.referredBy ? (elem?.referredBy?.first_name + ' ' + elem?.referredBy?.last_name) : elem?.campaign?.campaignName}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color="light" fontSize={13}>{elem?.creationProcess}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={1.8} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color='light' fontSize={13}>{new Date(elem?.joining_date).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })} {(new Date(elem?.joining_date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata',hour12: true, timeStyle: 'medium' }).toUpperCase())}</MDTypography>
                  </Grid>
              </Grid>
              </>
              )
            })} */}

            {/* {!isLoading && data?.length>0 &&
          <MDBox mt={1} display="flex" justifyContent="space-between" alignItems='center' width='100%'>
              <MDButton variant='outlined' color='warning' disabled={currentPage === 1 ? true : false} size="small" onClick={handlePrevPage}>Back</MDButton>
              <MDTypography color="light" fontSize={15} fontWeight='bold'>Total Data: {filteredUsers.length} | Page {currentPage} of {Math.ceil(filteredUsers.length/perPage)}</MDTypography>
              <MDButton variant='outlined' color='warning' disabled={Math.ceil(filteredUsers.length/perPage) === currentPage ? true : false} size="small" onClick={handleNextPage}>Next</MDButton>
          </MDBox>
          } */}
        </>
      
    }
  </>
  );
}