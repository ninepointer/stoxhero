import React from 'react'
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { Divider } from '@mui/material';

const CouponMetrics = ({couponData}) => {
    return (
        <Card>
          <MDBox p ={2}>
            <MDTypography mb={2}>Coupon Metrics-{couponData?.code}</MDTypography>
            {couponData?.metrics?.tenXPurchases>0 && <Grid display ='flex' xl={12}>
                <Grid xl ={3}>
                    <MDTypography fontSize={16}>Number of TenX Purchases - {couponData?.metrics?.tenXPurchases}</MDTypography>
                </Grid>
                <Grid xl ={3}>
                    <MDTypography fontSize={16}>TenX Discount - ₹{couponData?.metrics?.tenXDiscount?.toFixed(2)}</MDTypography>
                </Grid>
                <Grid xl ={3}>
                    <MDTypography fontSize={16}>TenX Revenue - ₹{couponData?.metrics?.tenXRevenue?.toFixed(2)}</MDTypography>
                </Grid>
                { <Grid xl ={3}>
                    <MDTypography fontSize={16}>TenX Affiliate Amount - ₹{(Number(couponData?.metrics?.tenXRevenue?.toFixed(2)) + Number(couponData?.metrics?.tenXBonus?.toFixed(2)))* ((couponData?.affiliatePercentage??0)/100)}</MDTypography>
                </Grid>}
            </Grid>}
            {couponData?.metrics?.marginXPurchases>0 && <Grid display ='flex' xl={12}>
                <Grid xl ={3}>
                    <MDTypography fontSize={16}>Number of MarginX Purchases - {couponData?.metrics?.marginXPurchases}</MDTypography>
                </Grid>
                <Grid xl ={3}>
                    <MDTypography fontSize={16}>MarginX Discount - ₹{couponData?.metrics?.marginXDiscount?.toFixed(2)}</MDTypography>
                </Grid>
                <Grid xl ={3}>
                    <MDTypography fontSize={16}>MarginX Revenue - ₹{couponData?.metrics?.marginXRevenue?.toFixed(2)}</MDTypography>
                </Grid>
                { <Grid xl ={3}>
                    <MDTypography fontSize={16}>MarginX Affiliate Amount - ₹{(Number(couponData?.metrics?.marginXRevenue?.toFixed(2))+ Number(couponData?.metrics?.marginXBonus?.toFixed(2))) * ((couponData?.affiliatePercentage??0)/100)}</MDTypography>
                </Grid>}
            </Grid>}
            {couponData?.metrics?.contestPurchases>0 && <Grid display ='flex' xl={12}>
                <Grid xl ={3}>
                    <MDTypography fontSize={16}>Number of Contest Purchases - {couponData?.metrics?.contestPurchases}</MDTypography>
                </Grid>
                <Grid xl ={3}>
                    <MDTypography fontSize={16}>Contest Discount - ₹{couponData?.metrics?.contestDiscount?.toFixed(2)}</MDTypography>
                </Grid>
                <Grid xl ={3}>
                    <MDTypography fontSize={16}>Contest Revenue - ₹{couponData?.metrics?.contestRevenue?.toFixed(2)}</MDTypography>
                </Grid>
                {  <Grid xl ={3}>
                    <MDTypography fontSize={16}>Contest Affiliate Amount - ₹{(Number(couponData?.metrics?.contestRevenue?.toFixed(2)) + Number(couponData?.metrics?.contestBonus?.toFixed(2))) * ((couponData?.affiliatePercentage??0)/100)}</MDTypography>
                </Grid>}
            </Grid>}
            {couponData?.metrics?.totalPurchases>0 && <Grid display ='flex' xl={12}>
                <Divider></Divider>
                <Grid xl ={3}>
                    <MDTypography fontSize={16}>Number of Total Purchases - {couponData?.metrics?.totalPurchases}</MDTypography>
                </Grid>
                <Grid xl ={3}>
                    <MDTypography fontSize={16}>Total Discount - ₹{couponData?.metrics?.totalDiscount?.toFixed(2)}</MDTypography>
                </Grid>
                <Grid xl ={3}>
                    <MDTypography fontSize={16}>Total Revenue - ₹{couponData?.metrics?.totalRevenue?.toFixed(2)}</MDTypography>
                </Grid>
                { <Grid xl ={3}>
                    <MDTypography fontSize={16}>Total Affiliate Amount - ₹{(Number(couponData?.metrics?.totalRevenue?.toFixed(2))+Number(couponData?.metrics?.totalBonus?.toFixed(2))) * ((couponData?.affiliatePercentage??0)/100)}</MDTypography>
                </Grid>}
            </Grid>}
          </MDBox>
        </Card>
      );

}

export default CouponMetrics