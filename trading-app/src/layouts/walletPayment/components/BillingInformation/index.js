import {useState, useContext, useEffect} from "react"
import axios from "axios";
// import { userContext } from "../../../../AuthContext";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
// import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import moment from 'moment';

// Billing page components
import Bill from "../Bill";
import MDButton from "../../../../components/MDButton";
// import Transaction from "../Transaction";
// import TransactionData from './data/transactionData';
// import { margin } from "@mui/system";

function BillingInformation({render}) {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  let [skip, setSkip] = useState(0);
  const limitSetting = 10;
  const [count, setCount] = useState(0);
  const [isLoading,setIsLoading] = useState(false);

  const [data, setData] = useState([]);
  
  useEffect(()=>{
      setIsLoading(true)
      axios.get(`${baseUrl}api/v1/payment?skip=${skip}&limit=${limitSetting}`)
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
  },[render])

  function backHandler(){
    if(skip <= 0){
        return;
    }
    setSkip(prev => prev-limitSetting);
    setData([]);
    setIsLoading(true)
    axios.get(`${baseUrl}api/v1/payment?skip=${skip-limitSetting}&limit=${limitSetting}`,{
        withCredentials: false,
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
    axios.get(`${baseUrl}api/v1/payment?skip=${skip+limitSetting}&limit=${limitSetting}`,{
        withCredentials: false,
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

  function changeDateFormat(givenDate) {

    const date = new Date(givenDate);

    // Convert the date to IST
    date.setHours(date.getHours());
    date.setMinutes(date.getMinutes());

    // Format the date as "dd Month yyyy | hh:mm AM/PM"
    const formattedDate = `${date.getDate()} ${getMonthName(date.getMonth())} ${date.getFullYear()} | ${formatTime(date.getHours(), date.getMinutes())}`;

    console.log(formattedDate);

    // Helper function to get the month name
    function getMonthName(month) {
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      return monthNames[month];
    }

    // Helper function to format time as "hh:mm AM/PM"
    function formatTime(hours, minutes) {
      const meridiem = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes.toString().padStart(2, "0");
      return `${formattedHours}:${formattedMinutes} ${meridiem}`;
    }

    return formattedDate;

  }
  let rows = [];

  data.map((elem)=>{
    let obj = {};
    let amountstring = elem.amount > 0 ? "+₹" + (elem.amount).toLocaleString() : "-₹" + (-(elem.amount)).toLocaleString()
    let color = elem.amount > 0 ? "success" : "error"
    let paymentOn = changeDateFormat(elem?.paymentTime);
    let createdOn = changeDateFormat(elem?.createdOn);
    obj = (
      <Bill
            name={`${elem.paymentBy?.first_name} ${elem.paymentBy?.last_name}`}
            email={elem.paymentBy?.email}
            vat={elem.transactionId}
            creditedOn={paymentOn}
            amount={amountstring}
            createdOn={createdOn}
            color={color}
            totalCredit=''
            mobile={elem.paymentBy?.mobile}
          />
      );
  rows.push(obj);
  })

  console.log(rows[1])


  return (
    <Card id="delete-account">
      <MDBox pt={3} px={2}>
        <MDTypography variant="h6" fontWeight="medium">
          Credit History
        </MDTypography>
      </MDBox>
      <MDBox pt={1} pb={2} px={2}>
        <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
        {rows}
        {!isLoading && count !== 0 &&
            <MDBox mt={1} display="flex" justifyContent="space-between" alignItems='center' width='100%'>
                <MDButton variant='outlined' color='dark' disabled={(skip+limitSetting)/limitSetting === 1 ? true : false} size="small" onClick={backHandler}>Back</MDButton>
                <MDTypography color="dark" fontSize={15} fontWeight='bold'>Total Transaction: {!count ? 0 : count} | Page {(skip+limitSetting)/limitSetting} of {!count ? 1 : Math.ceil(count/limitSetting)}</MDTypography>
                <MDButton variant='outlined' color='dark' disabled={Math.ceil(count/limitSetting) === (skip+limitSetting)/limitSetting ? true : !count ? true : false} size="small" onClick={nextHandler}>Next</MDButton>
            </MDBox>
            }
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default BillingInformation;
