import { useState, useEffect } from "react"
import axios from "axios";
// @mui material components
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import Footer from "../../../examples/Footer";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import { Grid } from "@mui/material";
import Switch from '@mui/material/Switch';

// Material Dashboard 2 React examples
import DataTable from "../../../examples/Tables/DataTable";

// Data
import data from "../data";
import instrumentdata from "../data/mismatch"
import { TextField } from "@mui/material";

function TraderwiseTraderPNL() {
    const { columns, rows } = data();
    const label = { inputProps: { 'aria-label': 'Switch demo' } };


  return (
    <>

        <MDBox mt={1}>
        <Card>
          <MDBox display="flex" justifyContent="center" alignItems="center">
            <MDBox display='flex' justifyContent='center'>
              <MDTypography variant="h4" gutterBottom p={1}>
                Thursday Options Champions
              </MDTypography>
            </MDBox>
          </MDBox>

          <MDBox>
            <MDBox style={{backgroundColor:'lightgreen'}} borderRadius={3} ml={1} mr={1}>
              <Grid container xs={12} md={12} lg={12}>
                  <Grid item xs={12} md={12} lg={2}>
                    <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} p={1}>
                      <MDTypography fontSize={11}>Payout%:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" ></MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={12} lg={2}>
                    <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} p={1}>
                      <MDTypography fontSize={11}>Entry Fee:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" >₹</MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={12} lg={2}>
                    <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} p={1}>
                      <MDTypography fontSize={11}>Max Participant:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" ></MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={12} lg={2}>
                    <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} p={1}>
                      <MDTypography fontSize={11}>Participant:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" ></MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={12} lg={2}>
                    <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} p={1}>
                      <MDTypography fontSize={11}>Expected Collection:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" >₹</MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={12} lg={2}>
                    <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} p={1}>
                      <MDTypography fontSize={11}>Collected Fee:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" >₹</MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={12} lg={2}>
                    <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} p={1}>
                      <MDTypography fontSize={11}>Portfolio:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" >₹</MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={12} lg={2}>
                    <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} p={1}>
                      <MDTypography fontSize={11}>Contest Type:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" ></MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={12} lg={2}>
                    <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} p={1}>
                      <MDTypography fontSize={11}>Contest For:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" ></MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={12} lg={2}>
                    <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} p={1}>
                      <MDTypography fontSize={11}>NIFTY:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" >{(true === true ? 'Yes' : 'No')}</MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={12} lg={2}>
                    <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} p={1}>
                      <MDTypography fontSize={11}>BANKNIFTY:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" >{(true === true ? 'Yes' : 'No')}</MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={12} lg={2}>
                    <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} p={1}>
                      <MDTypography fontSize={11}>FINNIFTY:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" >{(true === true ? 'Yes' : 'No')}</MDTypography>
                    </MDBox>
                  </Grid>
              </Grid>
            </MDBox>
          </MDBox>

          <MDBox display='flex' justifyContent='center' flexDirection='column' m={1}>
            <MDBox bgColor='grey' p={1} borderRadius={3}>
                <MDTypography fontSize={15} color='light' fontWeight='bold'>Mismatch Report</MDTypography>
            </MDBox>
            <DataTable
              table={{ columns, rows }}
              showTotalEntries={false}
              isSorted={false}
              noEndBorder
            />
          </MDBox>

          <MDBox display='flex' justifyContent='center' flexDirection='column' m={1}>
            <MDBox bgColor='grey' p={1} borderRadius={3} display='flex' justifyContent='space-between' alignItems='center'>
                <MDBox><MDTypography fontSize={15} fontWeight='bold' color='light'>Traderwise P&L (Company Side)</MDTypography></MDBox>
                <MDBox display='flex' justifyContent='space-between' alignItems='center'>
                    <MDBox><MDTypography fontSize={15} fontWeight='bold' color='light'>Current Status: Mock</MDTypography></MDBox>
                    <MDBox><Switch {...label}/></MDBox>
                </MDBox>
            </MDBox>
            <DataTable
              table={{ columns, rows }}
              showTotalEntries={false}
              isSorted={false}
              noEndBorder
            />
          </MDBox>

          <MDBox display='flex' justifyContent='center' flexDirection='column' m={1}>
            <MDBox bgColor='lightgrey' p={1} borderRadius={3}>
                <MDTypography fontSize={15} fontWeight='bold'>Instruments Wise P&L (Company Side)</MDTypography>
            </MDBox>
            <DataTable
              table={{ columns, rows }}
              showTotalEntries={false}
              isSorted={false}
              noEndBorder
            />
          </MDBox>
        </Card>
        </MDBox>

    </>
  );
}
export default TraderwiseTraderPNL;
