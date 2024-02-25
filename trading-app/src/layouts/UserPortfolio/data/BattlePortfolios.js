import React, {useState, useEffect} from 'react'
import Grid from "@mui/material/Grid";
import axios from "axios";
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDAvatar from "../../../components/MDAvatar";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import money from "../../../assets/images/money.png"


const MyPortfolioCard = ({type}) => {
  
  const [myPortfolio,setMyPortfolio] = useState([]);
  const [portfolioPnl, setPortfolioPnl] = useState([]);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"


  useEffect(()=>{
  

    let call1 = axios.get(`${baseUrl}api/v1/portfolio/my`,{
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                  },
                })

    let call2 = axios.get(`${baseUrl}api/v1/portfolio/pnl`,{
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                  },
                })
    Promise.all([call1, call2])
    .then(([api1Response, api2Response]) => {
      // Process the responses here
      console.log(api1Response.data.data);
      console.log(api2Response.data);
      setMyPortfolio(api1Response.data.data)
      setPortfolioPnl(api2Response.data)
    
    })
    .catch((error) => {
      // Handle errors here
      console.error(error);
    });


  },[])



    
    return (
      <>
      {myPortfolio.length > 0 ?
          <MDBox>
            <Grid container spacing={2}>
              {myPortfolio?.map((e)=>{
                  let portfolio = portfolioPnl.filter((elem)=>{
                    return e?._id === elem?._id?.portfolioId
                  })

                  let netPnl = portfolio[0]?.amount - portfolio[0]?.brokerage;
                  // if(e?.portfolioType == type){
                    return (
                      
                      <Grid key={e._id} item xs={12} md={6} lg={6} >
                      <MDBox padding={0} style={{borderRadius:4}}>
                      <MDButton variant="contained" color={"light"} size="small" >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={20} style={{color:"black",backgroundColor:"whitesmoke",borderRadius:3,paddingLeft:4,paddingRight:4,fontWeight:'bold'}}>{e?.portfolioName}</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}} display="flex" alignContent="center" alignItems="center">
                                  <MDAvatar src={money} size="xl" display="flex" justifyContent="left"/>
                                  <MDBox ml={2} display="flex" flexDirection="column">
                                  <MDTypography fontSize={15} display="flex" justifyContent="left" style={{color:"black"}}>Portfolio Value</MDTypography>
                                  <MDTypography fontSize={15} display="flex" justifyContent="left" style={{color:"black"}}>₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(e?.portfolioValue)}</MDTypography>
                                  </MDBox>
                              </Grid>
      
                              <Grid item xs={12} md={6} lg={6} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                                  <MDBox display="flex" flexDirection="column">
                                  <MDTypography fontSize={12} display="flex" justifyContent="left" style={{color:"black"}}>Invested Amount</MDTypography>
                                  <MDTypography fontSize={12} display="flex" justifyContent="left" style={{color:"black"}}>NA</MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={6} display="flex" justifyContent="right" alignContent="center" alignItems="center">
                                  <MDBox display="flex" flexDirection="column">
                                  <MDTypography fontSize={12} display="flex" justifyContent="right" style={{color:"black"}}>Cash Balance</MDTypography>
                                  <MDTypography fontSize={12} display="flex" justifyContent="right" style={{color:"black"}}>
                                    ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(netPnl ? (e?.portfolioValue + netPnl).toFixed(0): e?.portfolioValue.toFixed(0))}
                                  </MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"black"}}>Portfolio Type <span style={{fontSize:11,fontWeight:700}}>{e?.portfolioType}</span></MDTypography>
                              </Grid>
      
                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                                  <MDTypography fontSize={9} style={{color:"black"}}>Portfolio Account <span style={{fontSize:11,fontWeight:700}}>{e.portfolioAccount}</span></MDTypography>
                              </Grid>
      
                          </Grid>
                      </MDButton>
                      </MDBox>
                      </Grid>
                      
                    )
                  // }
                // let color = (myPortfolio === e._id) ? "warning" : "light";
              })}
            </Grid>
          </MDBox>
          :
         <Grid container spacing={1} xs={12} md={6} lg={12}>
          <Grid item mt={2} xs={6} md={3} lg={12} display="flex" justifyContent="center">
            <MDTypography color="light">You do not have any portfolio to join the contest</MDTypography>
          </Grid>
         </Grid>
         } 

      </>
)}



export default MyPortfolioCard;