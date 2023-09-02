import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { userContext } from '../../../AuthContext';
import moment from 'moment';
import TableContainer from '@mui/material/TableContainer';

import Paper from '@mui/material/Paper';
import { RiStockFill } from "react-icons/ri";
import Card from "@mui/material/Card";
import { Typography } from "@mui/material";


// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
// import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
// import {CircularProgress} from "@mui/material";
// import { Grid } from "@mui/material";
import { apiUrl } from "../../../constants/constants";
// import { marginX } from "../../../variables";
import OrderHelper from "./orderHelper";


export default function Order({from}) {

//   let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
let styleTD = {
  textAlign: "center",
  fontSize: "11px",
  fontWeight: "900",
  color: "#7b809a",
  opacity: 0.7
}

let [skip, setSkip] = useState(0);
  const limitSetting = 10;
  const [count, setCount] = useState(0);
  const [isLoading,setIsLoading] = useState(false);

  const [data, setData] = useState([]);
  const getDetails = useContext(userContext);
  let url = "internbatch/todaysorders"
  
  useEffect(()=>{
      setIsLoading(true)
      console.log("Inside Use Effect")
      axios.get(`${apiUrl}internbatch/todaysorders?skip=${skip}&limit=${limitSetting}`, {withCredentials:true})
      .then((res)=>{
          console.log(res.data)
          setData(res.data.data);
          setCount(res.data.count);
          setIsLoading(false)
      }).catch((err)=>{
          //window.alert("Server Down");
          setTimeout(()=>{
            setIsLoading(false)
          },500) 
          return new Error(err);
      })
  },[])

  function backHandler(){
    if(skip <= 0){
        return;
    }
    setSkip(prev => prev-limitSetting);
    setData([]);
    setIsLoading(true)
    axios.get(`${apiUrl}internbatch/todaysorders?skip=${skip-limitSetting}&limit=${limitSetting}`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": false
        },
    })
    .then((res) => {
        console.log("Orders:",res.data)
        setData(res.data.data)
        setCount(res.data.count)
        setTimeout(()=>{
            setIsLoading(false)
          },500)
    }).catch((err) => {
        console.log(err)
        setIsLoading(false)
        return new Error(err);
    })
  }

  function nextHandler(){
    if(skip+limitSetting >= count){
      console.log("inside skip",count,skip+limitSetting)  
      return;
    }
    console.log("inside next handler")
    setSkip(prev => prev+limitSetting);
    setData([]);
    setIsLoading(true)
    axios.get(`${apiUrl}internbatch/todaysorders?skip=${skip+limitSetting}&limit=${limitSetting}`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": false
        },
    })
    .then((res) => {
        console.log("orders",res.data)
        setData(res.data.data)
        setCount(res.data.count)
        setTimeout(()=>{
            setIsLoading(false)
          },500)
    }).catch((err) => {
        console.log(err)
        setIsLoading(false)
        return new Error(err);
    })
  }


  const orderArr = [];
  data.map((elem)=>{
    // console.log("instrument date", elem)
    // const date = new Date(elem.contractDate);
    // const day = date.getDate(); // returns the day of the month (4 in this case)
    // const month = date.toLocaleString('default', { month: 'long' }); // returns the full month name (May in this case)
    // const formattedDate = `${day}${day % 10 == 1 && day != 11 ? 'st' : day % 10 == 2 && day != 12 ? 'nd' : day % 10 == 3 && day != 13 ? 'rd' : 'th'} ${month}`; // formats the date as "4th May"
    //console.log(formattedDate);

    let orderObj = {}

    orderObj.symbol = (
      <MDTypography variant="caption" color={"text"} fontWeight="medium">
        {elem?.symbol}
      </MDTypography>
    );
    orderObj.averagePrice = (
      <MDTypography variant="caption" color={"text"} fontWeight="medium">
        ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(elem?.average_price))}
      </MDTypography>
    );
    orderObj.quantity = (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {elem?.Quantity}
      </MDTypography>
    );
    orderObj.amount = (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(elem?.amount))}
      </MDTypography>
    );
    orderObj.buyOrSell = (
      <MDTypography component="a" href="#" variant="caption" color="dark" fontWeight="medium">
        {elem?.buyOrSell}
      </MDTypography>
    );

    orderObj.orderid = (
      <MDTypography component="a" href="#" variant="caption" color={"text"} fontWeight="medium">
        {elem?.order_id}
      </MDTypography>
    );

    orderObj.status = (
      <MDTypography component="a" href="#" variant="caption" color={"text"} fontWeight="medium">
        {elem?.status}
      </MDTypography>
    );

    orderObj.time = (
      <MDTypography component="a" href="#" variant="caption" color={"text"} fontWeight="medium">
        {moment.utc(elem?.trade_time).utcOffset('+00:00').format('DD-MMM HH:mm:ss')}
      </MDTypography>
    );



    orderArr.push(orderObj)
  })

  return (

    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pl={2} pr={2} pt={2} pb={2}>
        <MDBox display="flex">
          <MDTypography variant="h6" gutterBottom>
            My Orders
          </MDTypography>
          <MDBox display="flex" alignItems="center" lineHeight={0}>
          </MDBox>
        </MDBox>
      </MDBox>
      {orderArr?.length === 0 ? (
      <MDBox display="flex" flexDirection="column" mb={4} sx={{alignItems:"center"}}>
        <RiStockFill style={{fontSize: '30px'}}/>
        <Typography style={{fontSize: '20px',color:"grey"}}>Nothing here</Typography>
        <Typography mb={2} fontSize={15} color="grey">Please Take Trade.</Typography>
        {/* <MDButton variant="outlined" size="small" color="info" onClick={()=>{setIsGetStartedClicked(true)}}>Add Instrument</MDButton> */}
      </MDBox>)
      :
      (<MDBox>
        <TableContainer component={Paper}>
          <table style={{borderCollapse: "collapse", width: "100%", borderSpacing: "10px 5px"}}>
            <thead>
              <tr style={{borderBottom: "1px solid #D3D3D3"}}>
                <td style={styleTD}>SYMBOL</td>
                <td style={styleTD} >QUANTITY</td>
                <td style={styleTD} >AVG. PRICE</td>
                <td style={styleTD} >AMOUNT</td>
                <td style={styleTD} >TRANSACTION</td>
                <td style={styleTD} >ORDERID</td>
                <td style={styleTD} >STATUS</td>
                <td style={styleTD} >TIME</td>
              </tr>
            </thead>
            <tbody>

              {orderArr.map((elem, index)=>{
                return(
              <tr
              style={{borderBottom: "1px solid #D3D3D3"}} key={elem.instrumentToken.props.children}
              >
                  <OrderHelper 
                    symbol={elem.symbol.props.children}
                    averagePrice={elem.averagePrice.props.children}
                    amount={elem.amount.props.children}
                    quantity={elem.quantity.props.children}
                    buyOrSell={elem.buyOrSell.props.children}

                    orderid={elem.orderid.props.children}
                    status={elem.status.props.children}
                    time={elem.time.props.children}

                    from={from}
                  />
      
              </tr>

                )
              })}
            </tbody>
          </table>
        </TableContainer>

      </MDBox>
      )}
    </Card>

  );
}
