import {useState, useContext, useEffect} from "react"
import axios from "axios";
// import { userContext } from "../../../../AuthContext";

// @mui material components
import Card from "@mui/material/Card";
import { Grid } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
// import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import moment from 'moment';
import {CircularProgress} from "@mui/material";
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
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
  const [api,setApi] = useState('successful')
  const [data, setData] = useState([]);
  const [clicked, setClicked] = useState('successful')
  
  useEffect(()=>{
      setIsLoading(true)
      axios.get(`${baseUrl}api/v1/payment/${api}?skip=${skip}&limit=${limitSetting}`, {withCredentials: true})
      .then((res)=>{
          setData(res.data.data);
          setCount(res.data.count);
          setTimeout(()=>{
            setIsLoading(false)
          },500) 
      }).catch((err)=>{
          //window.alert("Server Down");
          setTimeout(()=>{
            setIsLoading(false)
          },500) 
          return new Error(err);
      })
  },[render,clicked])

  function backHandler(){
    if(skip <= 0){
        return;
    }
    setSkip(prev => prev-limitSetting);
    setData([]);
    setIsLoading(true)
    axios.get(`${baseUrl}api/v1/payment/${api}?skip=${skip-limitSetting}&limit=${limitSetting}`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": false
        },
    })
    .then((res) => {
        // console.log("Orders:",res.data)
        setData(res.data.data)
        setCount(res.data.count)
        setTimeout(()=>{
            setIsLoading(false)
          },500)
    }).catch((err) => {
        setIsLoading(false)
        return new Error(err);
    })
  }

  function nextHandler(){
    if(skip+limitSetting >= count){
      // console.log("inside skip",count,skip+limitSetting)  
      return;
    }
    // console.log("inside next handler")
    setSkip(prev => prev+limitSetting);
    setData([]);
    setIsLoading(true)
    axios.get(`${baseUrl}api/v1/payment/${api}?skip=${skip+limitSetting}&limit=${limitSetting}`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": false
        },
    })
    .then((res) => {
        // console.log("orders",res.data)
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

    // console.log(formattedDate);

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
    let amountstring = elem?.amount > 0 ? "+₹" + (elem?.amount).toLocaleString() : "-₹" + (-(elem.amount)).toLocaleString()
    let color = elem?.amount > 0 ? "success" : "error"
    let paymentOn = changeDateFormat(elem?.paymentTime);
    let createdOn = changeDateFormat(elem?.createdOn);
    obj = (
      <Bill
            name={`${elem?.paymentBy?.first_name} ${elem?.paymentBy?.last_name}`}
            email={elem?.paymentBy?.email}
            vat={elem?.transactionId}
            creditedOn={paymentOn}
            amount={amountstring}
            createdOn={createdOn}
            color={color}
            totalCredit=''
            mobile={elem?.paymentBy?.mobile}
            paymentStatus={elem?.paymentStatus}
            paymentMode={elem?.gatewayResponse?.data?.paymentInstrument?.type}
            utr={elem?.gatewayResponse?.data?.paymentInstrument?.utr}
          />
      );
  rows.push(obj);
  })

  console.log(rows)

  const handleClick = (e) => {
    console.log(e)
    setApi(e)
    setClicked(e)
  };


  return (
    <Card id="delete-account">
      <MDBox pt={1} px={2}>
        <MDTypography variant="h6" fontWeight="medium">
          Credit History
        </MDTypography>
      </MDBox>
      {/* <MDBox pt={1} pb={2} px={2}>
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
      </MDBox> */}    
      <MDBox mt={0} mb={1} p={1} minWidth='100%' bgColor='dark' minHeight='auto' display='flex' justifyContent='center' borderRadius={7}>
          
      <Grid container spacing={1} xs={12} md={12} lg={12} minWidth='100%'>
          <Grid item xs={12} md={4} lg={4} display='flex' justifyContent='center'>
              <MDButton bgColor='dark' color={clicked == "successful" ? "warning" : "secondary"} size='small' style={{minWidth:'100%'}}
                  onClick={()=>{handleClick("successful")}}
              >
                  <MDBox display='flex' justifyContent='center' alignItems='center'>
                      <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                          <RemoveRedEyeIcon/>
                      </MDBox>
                      <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                          Successful
                      </MDBox>
                  </MDBox>
              </MDButton>
          </Grid>
          <Grid item xs={12} md={4} lg={4} display='flex' justifyContent='center'>
              <MDButton bgColor='dark' color={clicked == "initiated" ? "warning" : "secondary"} size='small' style={{minWidth:'100%'}}
                  onClick={()=>{handleClick("initiated")}}
              >
                  <MDBox display='flex' justifyContent='center' alignItems='center'>
                      <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                          <RemoveRedEyeIcon/>
                      </MDBox>
                      <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                          Initiated
                      </MDBox>
                  </MDBox>
              </MDButton>
          </Grid>
          <Grid item xs={12} md={4} lg={4} display='flex' justifyContent='center'>
              <MDButton bgColor='dark' color={clicked == "failed" ? "warning" : "secondary"} size='small' style={{minWidth:'100%'}}
                  onClick={()=>{handleClick("failed")}}
              >
                  <MDBox display='flex' justifyContent='center' alignItems='center'>
                      <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                          <RemoveRedEyeIcon/>
                      </MDBox>
                      <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                          Failed
                      </MDBox>
                  </MDBox>
              </MDButton>
          </Grid>
      </Grid>
      </MDBox>

      {isLoading ?
      <MDBox mt={10} mb={10} display="flex" justifyContent="center" alignItems="center">
      <CircularProgress color='light' />
      </MDBox>
      :
      <>
      <MDBox>
      <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
          <Grid item xs={12} md={6} lg={12} display='flex' justifyContent='center'>
              {clicked === "successful" ?
              <>
                  {isLoading ? 
                  <MDBox>
                    <CircularProgress/>
                  </MDBox>
                  :
                  <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0} width='95%'>
                  {rows}
                  {!isLoading && count !== 0 &&
                      <MDBox mt={1} display="flex" justifyContent="space-between" alignItems='center' width='100%'>
                          <MDButton variant='outlined' color='light' disabled={(skip+limitSetting)/limitSetting === 1 ? true : false} size="small" onClick={backHandler}>Back</MDButton>
                          <MDTypography color="dark" fontSize={15} fontWeight='bold'>Total Transaction: {!count ? 0 : count} | Page {(skip+limitSetting)/limitSetting} of {!count ? 1 : Math.ceil(count/limitSetting)}</MDTypography>
                          <MDButton variant='outlined' color='light' disabled={Math.ceil(count/limitSetting) === (skip+limitSetting)/limitSetting ? true : !count ? true : false} size="small" onClick={nextHandler}>Next</MDButton>
                      </MDBox>
                      }
                  </MDBox>}
              </>
              :
              clicked === "initiated" ?
              <>
                 <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0} width='95%'>
                  {rows}
                  {!isLoading && count !== 0 &&
                      <MDBox mt={1} display="flex" justifyContent="space-between" alignItems='center' width='100%'>
                          <MDButton variant='outlined' color='light' disabled={(skip+limitSetting)/limitSetting === 1 ? true : false} size="small" onClick={backHandler}>Back</MDButton>
                          <MDTypography color="dark" fontSize={15} fontWeight='bold'>Total Transaction: {!count ? 0 : count} | Page {(skip+limitSetting)/limitSetting} of {!count ? 1 : Math.ceil(count/limitSetting)}</MDTypography>
                          <MDButton variant='outlined' color='light' disabled={Math.ceil(count/limitSetting) === (skip+limitSetting)/limitSetting ? true : !count ? true : false} size="small" onClick={nextHandler}>Next</MDButton>
                      </MDBox>
                      }
                  </MDBox>
              </>
              :
              clicked === "failed" ?
              <>
                  <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0} width='95%'>
                  {rows}
                  {!isLoading && count !== 0 &&
                      <MDBox mt={1} display="flex" justifyContent="space-between" alignItems='center' width='100%'>
                          <MDButton variant='outlined' color='light' disabled={(skip+limitSetting)/limitSetting === 1 ? true : false} size="small" onClick={backHandler}>Back</MDButton>
                          <MDTypography color="dark" fontSize={15} fontWeight='bold'>Total Transaction: {!count ? 0 : count} | Page {(skip+limitSetting)/limitSetting} of {!count ? 1 : Math.ceil(count/limitSetting)}</MDTypography>
                          <MDButton variant='outlined' color='light' disabled={Math.ceil(count/limitSetting) === (skip+limitSetting)/limitSetting ? true : !count ? true : false} size="small" onClick={nextHandler}>Next</MDButton>
                      </MDBox>
                      }
                  </MDBox>
              </>
              :
              <>
                  {/* <PastBattles/> */}
              </>
              }
          </Grid>
      </Grid>
      </MDBox>
      </>
      }

      
    </Card>
  );
}

export default BillingInformation;
