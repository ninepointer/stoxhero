import { React, useState, useEffect, useContext } from "react";
import axios from "axios";
import { userContext } from '../../../AuthContext';

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { render } from 'react-dom';

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";

// Material Dashboard 2 React base styles
import breakpoints from "../../../assets/theme/base/breakpoints";

// Images
import backgroundImage from "../../../assets/images/trading.jpg";
import UserTodayOrders from "../UserTodayOrders";
import UserHistoryOrders from "../UserHistoryOrders";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";



function Header({ children }) {
  const [view,setView] = useState('today');
  const [buyFilter, setBuyFilter] = useState(false);
  const [sellFilter, setSellFilter] = useState(false);
  const [completeFilter, setCompleteFilter] = useState(false);
  const [rejectedFilter, setRejectedFilter] = useState(false);
  const [filterData, setFilteredData] = useState([])
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  const [data, setData] = useState([]);
  const getDetails = useContext(userContext);
  console.log("getDetails", getDetails)
  let todayColor = (view === 'today' ? 'warning' : 'light')
  let historyColor = (view === 'history' ? 'warning' : 'light')
  let url1 = getDetails.userDetails.isAlgoTrader ? "gettodaysmocktradesparticularuser" : "gettodaysmocktradesparticulartrader"
  let url2 = getDetails.userDetails.isAlgoTrader ? "gethistorymocktradesparticularuser" : "gethistorymocktradesparticulartrader"
  let url = (view === 'today' ? url1 : url2)

  useEffect(()=>{

      axios.get(`${baseUrl}api/v1/${url}/${getDetails.userDetails.email}`)
      .then((res)=>{
          console.log(res?.data)
          setData(res?.data);
          setFilteredData(res?.data);
      }).catch((err)=>{
          //window.alert("Server Down");
          return new Error(err);
      })
  },[getDetails,view])
  // gettodaysmocktradesparticulartrader
  console.log(data);

  // function handleClick(e){
  //   console.log(e)
  //   let filtered = data;
  //   if(e === 'BUY' && !buyFilter)
  //   {
  //     console.log("inside buy filter",buyFilter)
  //     setFilteredData(filtered.filter((item) => item.buyOrSell === 'BUY'))
  //   }
  
  //   if(e === 'SELL' && !sellFilter)
  //   {setFilteredData(filtered.filter((item) => item.buyOrSell === 'SELL'))}
  
  //   if(e === 'COMPLETE' && !completeFilter)
  //   {setFilteredData(filtered.filter((item) => item.status === 'COMPLETE'))}
   
  //   if(e === 'REJECTED' && !rejectedFilter)
  //   {setFilteredData(filtered.filter((item) => item.status === 'REJECTED'))}
    
  //     setFilteredData(filtered)
    
  // }

  // function handleClick(e){
  //   let filtered = [];
  //   if((!buyFilter || !sellFilter)) {
  //     filtered = data.filter((item) => item.buyOrSell === buyFilter);
  //   } else if(e === 'SELL' && !sellFilter) {
  //     filtered = data.filter((item) => item.buyOrSell === 'SELL');
  //   } else if(e === 'COMPLETE' && !completeFilter) {
  //     filtered = data.filter((item) => item.status === 'COMPLETE');
  //   } else if(e === 'REJECTED' && !rejectedFilter) {
  //     filtered = data.filter((item) => item.status === 'REJECTED');
  //   } else {
  //     filtered = data;
  //   }
  //   setFilteredData(filtered);
  // }

  
  useEffect(()=>{
    handleClick();
  },[buyFilter,sellFilter,rejectedFilter,completeFilter])

  function handleClick(){
    console.log("HandleClick",rejectedFilter)
    setFilteredData(data?.filter((item)=> {
       console.log(!buyFilter,!sellFilter)
       if(buyFilter && item.buyOrSell === 'BUY') {
        return true;
        }
       if(sellFilter && item.buyOrSell === 'SELL') {
        return true;
        }
      if(!sellFilter && !buyFilter) {
        return true;
        }
      // if(rejectedFilter && item.status === 'REJECTED') {
      //   console.log("inside rejected")
      //   return true;
      //   }
      // if(completeFilter && item.status === 'COMPLETE') {
      //   console.log("inside complete")
      //   return true;
      //   }
      else{
        return false;
      }
      // if(!sellFilter && !buyFilter){
      //   return true;
      // }
      
    }))
  }

  console.log(filterData)
  return (
   
    // <MDBox position="relative" mb={5}>

    //   <MDBox
    //     display="flex"
    //     alignItems="center"
    //     position="relative"
    //     minHeight="10rem"
    //     borderRadius="x1"
    //     sx={{
    //       backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
    //         `${linearGradient(
    //           rgba(gradients.info.main, 0.6),
    //           rgba(gradients.info.state, 0.6)
    //         )}, url(${backgroundImage})`,
    //       backgroundSize: "cover",
    //       backgroundPosition: "50%",
    //       overflow: "hidden",
    //     }}
    //   />
    //   <Card
    //     sx={{
    //       position: "relative",
    //       mt: -8,
    //       mx: 3,
    //       py: 2,
    //       px: 2,
    //     }}
    //   >
      
    //     <Grid container spacing={6} alignItems="center">
    //       <Grid item xs={12} md={12} lg={12} sx={{ ml: "auto" }}>
    //         <AppBar position="static">
    //           {/* <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}> */}
    //           <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
    //             <Tab
    //               label="Today Orders"
    //               icon={
    //                 <Icon fontSize="small" sx={{ mt: -0.25}}>
    //                   home
    //                 </Icon>
    //               }
    //             />
    //             <Tab
    //               label="History Orders"
    //               icon={
    //                 <AddShoppingCartIcon fontSize="small" sx={{ mt: -0.25 }}/>
    //               }
    //             />
    //           </Tabs>
    //         </AppBar>
    //         <TabPanel value={tabValue} index={0}><UserTodayOrders/> </TabPanel>
    //         <TabPanel value={tabValue} index={1}><UserHistoryOrders/> </TabPanel>
    //         {/* <TabPaneltwo/> */}
    //       </Grid>
    //     </Grid>
    //     </Card>
    //     {/* {children} */}
     
    //  </MDBox>
    
    
    <MDBox bgColor="dark" color="light" mt={2} mb={1} p={2} borderRadius={10} minHeight='100vh'>
      <Grid container>
          <Grid item xs={12} md={6} lg={12}>
            <MDBox display="flex" justifyContent="space-between">
              <MDBox display="flex" alignItems="center" alignContent="center">
                <MDButton color={todayColor} style={{marginRight:4}} onClick={()=>{setView('today')}}>Today's Order(s)</MDButton>
                <MDButton color={historyColor} style={{marginRight:4}} onClick={()=>{setView('history')}}>History</MDButton>
              </MDBox>
              <MDBox display="flex" alignItems="center" alignContent="center">
                <MDTypography style={{marginRight:10}} color="light" fontSize={15}>Filters:</MDTypography>
                <MDButton color={buyFilter ? 'warning' : 'light'} variant="outlined" size="small" style={{marginRight:10}} onClick={(e)=>{setBuyFilter(!buyFilter)}}>Buy</MDButton>
                <MDButton color={sellFilter ? 'warning' : 'light'} variant="outlined" size="small" style={{marginRight:10}} onClick={(e)=>{setSellFilter(!sellFilter)}}>Sell</MDButton>
                {/* <MDButton color={completeFilter ? 'warning' : 'light'} variant="outlined" size="small" style={{marginRight:10}} onClick={(e)=>{setCompleteFilter(!completeFilter)}}>Complete</MDButton> */}
                {/* <MDButton color={rejectedFilter ? 'warning' : 'light'} variant="outlined" size="small" style={{marginRight:10}} onClick={(e)=>{setRejectedFilter(!rejectedFilter)}}>Rejected</MDButton> */}
              </MDBox>
            </MDBox>
            
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
                <MDTypography color="light" fontSize={13} fontWeight="bold">Time</MDTypography>
              </Grid>
            </Grid>

            {filterData?.map((elem)=>{
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
                  <MDTypography color="light" fontSize={13}>{elem?.trade_time}</MDTypography>
                </Grid>
            </Grid>
            )
            })}

          </Grid>
          
      </Grid>
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

function TabPanel(props){
  const{children,value,index}=props;
  return(
    <>
    {
      value === index &&
      <h1>{children}</h1>
    }
     {/* <TableOne/> */}
    </>
   
  )
}

export default Header;
