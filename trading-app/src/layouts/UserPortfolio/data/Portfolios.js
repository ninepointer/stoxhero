import React, {useState, useEffect} from 'react'
import Grid from "@mui/material/Grid";
// import axios from "axios";
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDAvatar from "../../../components/MDAvatar";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import money from "../../../assets/images/money.png"
import tradesicon from '../../../assets/images/portfolioicon.png'
// import link from "../../../assets/images/link.png"


const MyPortfolioCard = ({virtualPortfolio, marginDetails}) => {
  
    return (
      <>
      {virtualPortfolio?.length > 0 ?
          <MDBox>
            <Grid container spacing={2}>
              {virtualPortfolio?.map((e)=>{
                  // let portfolio = portfolioPnl.filter((elem)=>{
                  //   return e?._id === elem?._id?.portfolioId
                  // })

                  // let netPnl = portfolio[0]?.amount - portfolio[0]?.brokerage;
                  if(e?.portfolioId){
                    return (
                      
                      <Grid key={e?.portfolioId?._id} item xs={12} md={6} lg={6} >
                      <MDBox padding={0} style={{borderRadius:4}}>
                      <MDButton variant="contained" color={"light"} size="small" >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDBox>
                                    <MDTypography fontSize={20} display="flex" justifyContent="left" style={{color:"black",backgroundColor:"whitesmoke",borderRadius:3,paddingLeft:4,paddingRight:4,fontWeight:'bold'}}>{e?.portfolioId?.portfolioName}</MDTypography>
                                  </MDBox>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}} display="flex" alignContent="center" alignItems="center">
                                  <MDAvatar src={money} size="xl" display="flex" justifyContent="left"/>
                                  <MDBox ml={2} display="flex" flexDirection="column">
                                  <MDTypography fontSize={15} display="flex" justifyContent="left" style={{color:"black"}}>Portfolio Value</MDTypography>
                                  <MDTypography fontSize={15} display="flex" justifyContent="left" style={{color:"black"}}>₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(e?.portfolioId?.portfolioValue)}</MDTypography>
                                  </MDBox>
                              </Grid>
      
                              <Grid item xs={12} md={6} lg={6} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                                  <MDBox display="flex" flexDirection="column">
                                  <MDTypography fontSize={12} display="flex" justifyContent="left" style={{color:"black"}}>Opening Balance</MDTypography>
                                  <MDTypography fontSize={12} display="flex" justifyContent="left" style={{color:"black"}}>₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(marginDetails?.openingBalance))}</MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={6} display="flex" justifyContent="right" alignContent="center" alignItems="center">
                                  <MDBox display="flex" flexDirection="column">
                                  <MDTypography fontSize={12} display="flex" justifyContent="right" style={{color:"black"}}>Available Margin</MDTypography>
                                  <MDTypography fontSize={12} display="flex" justifyContent="right" style={{color:"black"}}>
                                    ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(e?.portfolioId?.portfolioValue + marginDetails?.npnl)}
                                  </MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"black"}}>Portfolio Type <span style={{fontSize:11,fontWeight:700}}>{e?.portfolioId?.portfolioType}</span></MDTypography>
                              </Grid>
      
                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                                  <MDTypography fontSize={9} style={{color:"black"}}>Portfolio Account <span style={{fontSize:11,fontWeight:700}}>{e?.portfolioId?.portfolioAccount}</span></MDTypography>
                              </Grid>
      
                          </Grid>
                      </MDButton>
                      </MDBox>
                      </Grid>
                      
                    )
                  }
                // let color = (myPortfolio === e._id) ? "warning" : "light";
              })
              }
            </Grid>
          </MDBox>
          :
          <Grid item xs={12} md={6} lg={12}>
          <MDBox style={{minHeight:"20vh"}} border='1px solid white' borderRadius={5} display="flex" justifyContent="center" flexDirection="column" alignContent="center" alignItems="center">
            <img src={tradesicon} width={50} height={50}/>
            <MDTypography color="light" fontSize={15}>You do not have any active Virtual Trading Portfolio!</MDTypography>
          </MDBox>
          </Grid>
         } 

      </>
)}



export default MyPortfolioCard;