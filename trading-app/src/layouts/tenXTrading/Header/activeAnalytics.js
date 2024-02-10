import React from 'react';
import { Grid, Divider } from '@mui/material'
import MDTypography from '../../../components/MDTypography';

export default function ActiveAnalytics({ data }) {

    return (
        <>
            <Grid container style={{ border: '1px solid #344767', borderRadius: 5 }}>
                <Grid container p={1} >
                    <Grid item xs={12} md={2.4} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color="black" fontSize={9} fontWeight="bold">GROSS P&L</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2.4} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color="black" fontSize={9} fontWeight="bold">NET P&L</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2.4} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color="black" fontSize={9} fontWeight="bold">BROKERAGE</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2.4} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color="black" fontSize={9} fontWeight="bold">TRADING DAYS</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2.4} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color="black" fontSize={9} fontWeight="bold">TRADE</MDTypography>
                    </Grid>
                </Grid>
                <Grid container mt={1} p={1} style={{ borderTop: '1px solid #344767' }}>
                    <Grid item xs={12} md={2.4} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color={(data?.totalGpnl) >= 0 ? "success" : "error"} fontSize={10} fontWeight="bold">{(data?.totalGpnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(data?.totalGpnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-data?.totalGpnl))}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2.4} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color={(data?.totalNpnl) >= 0 ? "success" : "error"} fontSize={10} fontWeight="bold">{(data?.totalNpnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(data?.totalNpnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-data?.totalNpnl))}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2.4} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color="dark" fontSize={10} fontWeight="bold">{"₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(data?.totalBrokerage))}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2.4} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color="dark" fontSize={10} fontWeight="bold">{(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(data?.tradingDays))}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2.4} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color="dark" fontSize={10} fontWeight="bold">{(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(data?.totalTrades))}</MDTypography>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container mt={1} display="flex" justifyContent="center" gap={1} >
                <Grid item p={1} xs={12} md={5.8} lg={5.8} display="flex" justifyContent="center" alignContent="center" alignItems="center" style={{ border: '1px solid #344767', borderRadius: 5 }}>
                    <MDTypography color={(data?.totalProfit) >= 0 ? "success" : "error"} fontSize={10} fontWeight="bold"><span style={{color: '#344767'}}>Total Profit: </span>  {(data?.totalProfit) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(data?.totalProfit)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-data?.totalProfit))}</MDTypography>
                </Grid>

                <Grid item p={1} xs={12} md={5.8} lg={5.8} display="flex" justifyContent="center" alignContent="center" alignItems="center" style={{ border: '1px solid #344767', borderRadius: 5 }}>
                    <MDTypography color={(data?.totalLoss) >= 0 ? "success" : "error"} fontSize={10} fontWeight="bold"><span style={{color: '#344767'}}>Total Loss: </span> {(data?.totalLoss) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(data?.totalLoss)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-data?.totalLoss))}</MDTypography>
                </Grid>
            </Grid>

            <Grid container mt={1} display="flex" justifyContent="center" gap={1} >
                <Grid item p={1} xs={12} md={5.8} lg={5.8} display="flex" justifyContent="center" alignContent="center" alignItems="center" style={{ border: '1px solid #344767', borderRadius: 5 }}>
                    <MDTypography color={(data?.maximumProfit) >= 0 ? "success" : "error"} fontSize={10} fontWeight="bold"><span style={{color: '#344767'}}>Maximum Profit: </span> {(data?.maximumProfit) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(data?.maximumProfit)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-data?.maximumProfit))}</MDTypography>
                </Grid>

                <Grid item p={1} xs={12} md={5.8} lg={5.8} display="flex" justifyContent="center" alignContent="center" alignItems="center" style={{ border: '1px solid #344767', borderRadius: 5 }}>
                    <MDTypography color={(data?.maximumLoss) >= 0 ? "success" : "error"} fontSize={10} fontWeight="bold"><span style={{color: '#344767'}}>Maximum Loss: </span> {(data?.maximumLoss) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(data?.maximumLoss)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-data?.maximumLoss))}</MDTypography>
                </Grid>
            </Grid>

            <Grid container mt={1} display="flex" justifyContent="center" gap={1} >
                <Grid item p={1} xs={12} md={5.8} lg={5.8} display="flex" justifyContent="center" alignContent="center" alignItems="center" style={{ border: '1px solid #344767', borderRadius: 5 }}>
                    <MDTypography color={(data?.minimumProfit) >= 0 ? "success" : "error"} fontSize={10} fontWeight="bold"><span style={{color: '#344767'}}>Minimum Profit: </span> {(data?.minimumProfit) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(data?.minimumProfit)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-data?.minimumProfit))}</MDTypography>
                </Grid>

                <Grid item p={1} xs={12} md={5.8} lg={5.8} display="flex" justifyContent="center" alignContent="center" alignItems="center" style={{ border: '1px solid #344767', borderRadius: 5 }}>
                    <MDTypography color={(data?.minimumLoss) >= 0 ? "success" : "error"} fontSize={10} fontWeight="bold"><span style={{color: '#344767'}}>Minimum Loss: </span> {(data?.minimumLoss) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(data?.minimumLoss)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-data?.minimumLoss))}</MDTypography>
                </Grid>
            </Grid>

            <Grid container mt={1} display="flex" justifyContent="center" gap={1} >
                <Grid item p={1} xs={12} md={5.8} lg={5.8} display="flex" justifyContent="center" alignContent="center" alignItems="center" style={{ border: '1px solid #344767', borderRadius: 5 }}>
                    <MDTypography color={(data?.avgProfit) >= 0 ? "success" : "error"} fontSize={10} fontWeight="bold"><span style={{color: '#344767'}}>Avg. Profit: </span> {(data?.avgProfit) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(data?.avgProfit)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-data?.avgProfit))}</MDTypography>
                </Grid>

                <Grid item p={1} xs={12} md={5.8} lg={5.8} display="flex" justifyContent="center" alignContent="center" alignItems="center" style={{ border: '1px solid #344767', borderRadius: 5 }}>
                    <MDTypography color={(data?.avgLoss) >= 0 ? "success" : "error"} fontSize={10} fontWeight="bold"><span style={{color: '#344767'}}>Avg. Loss: </span> {(data?.avgLoss) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(data?.avgLoss)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-data?.avgLoss))}</MDTypography>
                </Grid>
            </Grid>

            <Grid container mt={1} display="flex" justifyContent="center" gap={1} >
                <Grid item p={1} xs={12} md={5.8} lg={5.8} display="flex" justifyContent="center" alignContent="center" alignItems="center" style={{ border: '1px solid #344767', borderRadius: 5 }}>
                    <MDTypography fontSize={10} fontWeight="bold"><span style={{color: '#344767'}}>Profit Days: </span> {(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(data?.profitDays))}</MDTypography>
                </Grid>

                <Grid item p={1} xs={12} md={5.8} lg={5.8} display="flex" justifyContent="center" alignContent="center" alignItems="center" style={{ border: '1px solid #344767', borderRadius: 5 }}>
                    <MDTypography fontSize={10} fontWeight="bold"><span style={{color: '#344767'}}>Loss Days: </span> {(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(data?.lossDays))}</MDTypography>
                </Grid>
            </Grid>

        </>
    );
}