import React, {useState, useEffect} from 'react'
import Grid from "@mui/material/Grid";
// import axios from "axios";
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDAvatar from "../../../components/MDAvatar";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import money from "../../../assets/images/money.png"
import TenXPortfolioCard from '../data/TenXPortfolioCard'
import tradesicon from '../../../assets/images/portfolioicon.png'
// import link from "../../../assets/images/link.png"


const MyPortfolioCard = ({tenXSubscriptions, marginDetails}) => {
  

    return (
      <>
      {tenXSubscriptions?.length > 0 ?
          <>
          <Grid container spacing={2}>
          {tenXSubscriptions?.map((e)=>{
            return ( 
            
              <Grid item xs={12} md={3} lg={6}>
                <TenXPortfolioCard subscriptionId={e?.subscriptionId}/>
              </Grid>
            )
          })}
          </Grid>
          
          </>
          :
          <Grid item xs={12} md={6} lg={12}>
          <MDBox style={{minHeight:"20vh"}} border='1px solid white' borderRadius={5} display="flex" justifyContent="center" flexDirection="column" alignContent="center" alignItems="center">
            <img src={tradesicon} width={50} height={50}/>
            <MDTypography color="light" fontSize={15}>You do not have any active TenX Portfolio!</MDTypography>
          </MDBox>
          </Grid>
         } 

      </>
)}



export default MyPortfolioCard;