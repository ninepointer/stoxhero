import { React, useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { userContext } from '../../../AuthContext';
import moment from 'moment'

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";
import tradesicon from '../../../assets/images/tradesicon.png'

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";

// Material Dashboard 2 React base styles

// Images
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
// import {InfinityTraderRole, tenxTrader} from "../../../variables";



function Header() {
    const location = useLocation();
//   const [view,setView] = useState('today');
//   const [infinityView,setInfinityView] = useState('today');
  const [internshipView,setInternshipView] = useState('order');
//   const [buyFilter, setBuyFilter] = useState(false);
//   const [sellFilter, setSellFilter] = useState(false);
//   const [buyInfinityFilter, setBuyInfinityFilter] = useState(false);
//   const [sellInfinityFilter, setSellInfinityFilter] = useState(false);
  const [buyInternshipFilter, setBuyInternshipFilter] = useState(false);
  const [sellInternshipFilter, setSellInternshipFilter] = useState(false);
  const [completeFilter, setCompleteFilter] = useState(false);
  const [rejectedFilter, setRejectedFilter] = useState(false);
//   const [filterData, setFilteredData] = useState([]);
//   const [infinityFilterData, setInfinityFilteredData] = useState([]);
//   const [infinityCount, setInfinityCount] = useState(0);
//   const [infinityData, setInfinityData] = useState([]);
  const [internshipFilterData, setInternshipFilteredData] = useState([]);
  const [internshipCount, setInternshipCount] = useState(0);
  const [internshipData, setInternshipData] = useState([]);

  const [orders, setOrders] = useState([]);
  const [isLoading,setIsLoading] = useState(true)
//   let [skip, setSkip] = useState(0);
//   let [InfinitySkip, setInfinitySkip] = useState(0);
  let [internshipSkip, setInternshipSkip] = useState(0);
  const limitSetting = 5;
//   const [count, setCount] = useState(0);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

//   const [data, setData] = useState([]);
  const getDetails = useContext(userContext);
  // console.log("getDetails", getDetails)
//   let todayColor = (view === 'today' ? 'warning' : 'light')
//   let historyColor = (view === 'history' ? 'warning' : 'light')
//   let todayInfinityColor = (infinityView === 'today' ? 'warning' : 'light')
//   let historyInfinityColor = (infinityView === 'history' ? 'warning' : 'light')
  let todayInternshipColor = (internshipView === 'order' ? 'warning' : 'light')
//   let historyInternshipColor = (internshipView === 'history' ? 'warning' : 'light')
  
//   let url2 = 'my/historyorders'
//   let url = (view === 'today' ? url1 : url2)
//   let infinityUrl = infinityView === 'today' ? url1 : url2;
//   let internshipUrl = internshipView === 'today' ? url1 : url2;
//   let infinityBaseUrl = getDetails.userDetails.role.roleName == InfinityTraderRole ? "infinityTrade" : "tenX"
 let batchId = location?.state?.batchId;
 let url = `my/workshoporders/${batchId}`;
// console.log("location", location)
  function internshipBackHandler(){
    if(internshipSkip <= 0){
        return;
    }
    setInternshipSkip(prev => prev-limitSetting);
    setOrders([]);
    axios.get(`${baseUrl}api/v1/internship/${url}?skip=${internshipSkip-limitSetting}&limit=${limitSetting}`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
    })
    .then((res) => {
        console.log("Orders:",res.data)
        setInternshipData(res.data.data)
        setInternshipCount(res.data.count)
        setInternshipFilteredData(res.data.data)
        setIsLoading(false)
    }).catch((err) => {
        console.log(err)
        return new Error(err);
    })
  }

  function internshipNextHandler(){
    if(internshipSkip+limitSetting >= internshipCount){
      return;
    }
    setInternshipSkip(prev => prev+limitSetting);
    setOrders([]);
    axios.get(`${baseUrl}api/v1/internship/${url}?skip=${internshipSkip+limitSetting}&limit=${limitSetting}`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
    })
    .then((res) => {
        console.log("orders",res.data)
        setInternshipData(res.data.data)
        setInternshipCount(res.data.count)
        setInternshipFilteredData(res.data.data)
        setIsLoading(false)
    }).catch((err) => {
        console.log(err)
        return new Error(err);
    })
  }

  useEffect(()=>{
    // console.log('intern of',getDetails.userDetails);
    // if(getDetails.userDetails?.internshipBatch?.length>0){
    //   console.log('intern hai');
      axios.get(`${baseUrl}api/v1/internship/${url}?skip=${internshipSkip}&limit=${limitSetting}`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
      })
      .then((res) => {
          console.log("internship orders",res.data)
          setInternshipData(res.data.data)
          setInternshipCount(res.data.count)
          setInternshipFilteredData(res.data.data)
          setIsLoading(false)
      }).catch((err) => {
          console.log(err)
          return new Error(err);
      })
    // }
  },[url, internshipView]); 


  function handleInternshipClick(){
    console.log("HandleClick",rejectedFilter)
    setInternshipFilteredData(internshipData?.filter((item)=> {
       console.log(!buyInternshipFilter,!sellInternshipFilter)
       if(buyInternshipFilter && item.buyOrSell === 'BUY') {
        return true;
        }
       if(sellInternshipFilter && item.buyOrSell === 'SELL') {
        return true;
        }
      if(!sellInternshipFilter && !buyInternshipFilter) {
        return true;
        }
      else{
        return false;
      }    
    }))
  }


  useEffect(()=>{
    handleInternshipClick();
  },[buyInternshipFilter,sellInternshipFilter,rejectedFilter,completeFilter]);




  return (
    
    <MDBox bgColor="dark" color="light" mt={2} mb={1} p={2} borderRadius={10} minHeight='100vh'>


      {getDetails.userDetails?.internshipBatch?.length >0 && 
      <MDBox mt={2}>
        <Grid container>
            <Grid item xs={12} md={6} lg={12}>
                <MDBox border='1px solid white' bgColor='light' borderRadius={5} mb={2} p={0.5} display='flex' justifyContent='center' alignItems='center'>
                <MDTypography color="dark" fontSize={15} fontWeight='bold'>Workshop Trading Orders</MDTypography>
                </MDBox>

                <MDBox display="flex" justifyContent="space-between" mb={2}>
                <Grid container spacing={2} display="flex" justifyContent="space-between">
                <Grid item xs={12} md={6} lg={6} display="flex" justifyContent="space-between">
                <MDBox display="flex" justifyContent="space-between">
                    <MDButton color={todayInternshipColor} size="small" style={{marginRight:4}} onClick={()=>{setInternshipView('order');setInternshipSkip(0)}}>Order(s)</MDButton>
                    {/* <MDButton color={historyInternshipColor} size="small" style={{marginRight:4}} onClick={()=>{setInternshipView('history');setInternshipSkip(0)}}>All Order(s)</MDButton> */}
                </MDBox>
                </Grid>
                <Grid item xs={8} md={6} lg={6} display="flex" justifyContent="flex-end">
                <MDBox display="flex" justifyContent="flex-end" alignItems='center'>
                    <MDTypography style={{marginRight:10}} color="light" fontSize={15}>Filters:</MDTypography>
                    <MDButton color={buyInternshipFilter ? 'warning' : 'light'} variant="outlined" size="small" style={{marginRight:10}} onClick={(e)=>{setBuyInternshipFilter(!buyInternshipFilter)}}>Buy</MDButton>
                    <MDButton color={sellInternshipFilter ? 'warning' : 'light'} variant="outlined" size="small" style={{marginRight:10}} onClick={(e)=>{setSellInternshipFilter(!sellInternshipFilter)}}>Sell</MDButton>
                    {/* <MDButton color={completeFilter ? 'warning' : 'light'} variant="outlined" size="small" style={{marginRight:10}} onClick={(e)=>{setCompleteFilter(!completeFilter)}}>Complete</MDButton> */}
                    {/* <MDButton color={rejectedFilter ? 'warning' : 'light'} variant="outlined" size="small" style={{marginRight:10}} onClick={(e)=>{setRejectedFilter(!rejectedFilter)}}>Rejected</MDButton> */}
                </MDBox>
                </Grid>
                </Grid>
                </MDBox>

                {internshipFilterData.length === 0 ?
                <>
                <Grid item xs={12} md={6} lg={12}>
                <MDBox style={{minHeight:"20vh"}} border='1px solid white' borderRadius={5} display="flex" justifyContent="center" flexDirection="column" alignContent="center" alignItems="center">
                    <img src={tradesicon} width={50} height={50}/>
                    <MDTypography color="light" fontSize={15}>You do not have any Virtual trading orders!</MDTypography>
                </MDBox>
                </Grid>
                </>
                :
                <>
                
                <Grid mt={2} p={1} container style={{border:'1px solid white', borderRadius:5}}>
                <Grid item xs={12} md={2} lg={2}>
                    <MDTypography color="light" fontSize={13} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">Contract</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={13} fontWeight="bold">Quantity</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={13} fontWeight="bold">Price</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={13} fontWeight="bold">Amount</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={13} fontWeight="bold">Type</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={13} fontWeight="bold">Order Id</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={13} fontWeight="bold">Status</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={13} fontWeight="bold">TimeStamp</MDTypography>
                </Grid>
                </Grid>

                {internshipFilterData?.map((elem)=>{
                let buysellcolor = elem?.buyOrSell === 'BUY' ? 'success' : 'error'
                let statuscolor = elem?.status === 'COMPLETE' ? 'success' : 'error'
            
                return (
                <Grid mt={1} p={1} container style={{border:'1px solid white', borderRadius:5}}>
                    <Grid item xs={12} md={2} lg={2}>
                    <MDTypography color="light" fontSize={13} display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem?.symbol}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={13}>{elem?.Quantity}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={13}>₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(elem?.average_price))}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={13}>₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(elem?.amount))}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color={buysellcolor} fontSize={13} fontWeight="bold">{elem?.buyOrSell}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={13}>{elem?.order_id}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color={statuscolor} fontSize={13}>{elem?.status}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={13}>{moment.utc(elem?.trade_time).format('DD-MMM-YY HH:mm:ss')}</MDTypography>
                    </Grid>
                </Grid>
                )
                })}

                {internshipCount !== 0 &&
                <MDBox mt={1} display="flex" justifyContent="space-between" alignItems='center' width='100%'>
                    <MDButton variant='outlined' size="small" color="light" onClick={internshipBackHandler}>Back</MDButton>
                    <MDTypography color="light" fontSize={15} fontWeight='bold'>Total Order: {internshipCount} | Page {(internshipSkip+limitSetting)/limitSetting} of {Math.ceil(internshipCount/limitSetting)}</MDTypography>
                    <MDButton variant='outlined' size="small" color="light" onClick={internshipNextHandler}>Next</MDButton>
                </MDBox>
                }
                </>}

            </Grid>
            
        </Grid>
      </MDBox>}      
      
    
    </MDBox>
  );
}

// Setting default props for the Header
Header.defaultProps = {
  children: "",
};

// Typechecking props for the Header
Header.propTypes = {
  children: PropTypes.node,
};



export default Header;
