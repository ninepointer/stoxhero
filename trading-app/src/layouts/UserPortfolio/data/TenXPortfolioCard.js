import React, {useState, useEffect} from 'react'
import Grid from "@mui/material/Grid";
import axios from "axios";
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDAvatar from "../../../components/MDAvatar";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import money from "../../../assets/images/money.png"
// import link from "../../../assets/images/link.png"

const MyPortfolioCard = ({subscriptionId}) => {
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
    const [isLoading,setIsLoading] = useState(false)
    const [tenXMarginDetails, setTenXMarginDetail] = useState([]);
    useEffect(()=>{
        setIsLoading(true)
          axios.get(`${baseUrl}api/v1/tenX/${subscriptionId?._id}/trade/marginDetail`,{
            withCredentials: true,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            }}
            ).then((res)=>{
              console.log(res.data.data)
              setTenXMarginDetail(res.data.data);
            })
    
      }, [])

    return (
<>
           <MDBox style={{minWidth:'100%'}}>
            {/* <Grid container> */}
                      
            <Grid key={subscriptionId?._id} item xs={12} md={6} lg={12} style={{minWidth:'100%'}}>
            <MDBox padding={0} style={{borderRadius:4}}>
            <MDButton variant="contained" color={"light"} size="small" >
                <Grid container>
                    <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                        <MDBox>
                        <MDTypography fontSize={20} display="flex" justifyContent="left" style={{color:"black",backgroundColor:"whitesmoke",borderRadius:3,paddingLeft:4,paddingRight:4,fontWeight:'bold'}}>{subscriptionId?.portfolio?.portfolioName}</MDTypography>
                        </MDBox>
                    </Grid>
                    
                    <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}} display="flex" alignContent="center" alignItems="center">
                        <MDAvatar src={money} size="xl" display="flex" justifyContent="left"/>
                        <MDBox ml={2} display="flex" flexDirection="column">
                        <MDTypography fontSize={15} display="flex" justifyContent="left" style={{color:"black"}}>Portfolio Value</MDTypography>
                        <MDTypography fontSize={15} display="flex" justifyContent="left" style={{color:"black"}}>₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(subscriptionId?.portfolio.portfolioValue)}</MDTypography>
                        </MDBox>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                        <MDBox display="flex" flexDirection="column">
                        <MDTypography fontSize={12} display="flex" justifyContent="left" style={{color:"black"}}>Opening Balance</MDTypography>
                        <MDTypography fontSize={12} display="flex" justifyContent="left" style={{color:"black"}}>₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(tenXMarginDetails?.openingBalance ? tenXMarginDetails?.openingBalance : subscriptionId?.portfolio.portfolioValue))}</MDTypography>
                        </MDBox>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6} display="flex" justifyContent="right" alignContent="center" alignItems="center">
                        <MDBox display="flex" flexDirection="column">
                        <MDTypography fontSize={12} display="flex" justifyContent="right" style={{color:"black"}}>Available Margin</MDTypography>
                        <MDTypography fontSize={12} display="flex" justifyContent="right" style={{color:"black"}}>
                        ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(tenXMarginDetails?.npnl ? subscriptionId?.portfolio.portfolioValue + tenXMarginDetails?.npnl : subscriptionId?.portfolio.portfolioValue)}
                        </MDTypography>
                        </MDBox>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                        <MDTypography fontSize={9} style={{color:"black"}}>Portfolio Type <span style={{fontSize:11,fontWeight:700}}>{subscriptionId?.portfolio.portfolioType}</span></MDTypography>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                        <MDTypography fontSize={9} style={{color:"black"}}>Portfolio Account <span style={{fontSize:11,fontWeight:700}}>{subscriptionId?.portfolio.portfolioAccount}</span></MDTypography>
                    </Grid>

                </Grid>
            </MDButton>
            </MDBox>
            </Grid>
            {/* </Grid> */}
          </MDBox>
        </>
)}



export default MyPortfolioCard;