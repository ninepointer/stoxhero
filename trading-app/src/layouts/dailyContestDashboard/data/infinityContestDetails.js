import { useState, useEffect, useContext } from "react"
import axios from "axios";
// @mui material components
import Card from "@mui/material/Card";
// import MenuItem from "@mui/material/MenuItem";
// import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
// import Footer from "../../../examples/Footer";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import { Grid } from "@mui/material";
import Switch from '@mui/material/Switch';

// Material Dashboard 2 React examples
import DataTable from "../../../examples/Tables/DataTable";

// Data
import data from "../data";
import { useLocation } from "react-router-dom";
import MismatchDetails from "../infinityContestComponent/mismatchReport";
import { socketContext } from "../../../socketContext";
import LiveOverallCompantPNL from "../infinityContestComponent/instrumentPosition";
import LiveTraderwiseCompantPNL from "../infinityContestComponent/traderwisePosition";
import MockTraderwiseCompantPNL from "../infinityContestComponent/traderWisePositionMock";
import SwitchWindow from "../infinityContestComponent/switchWindow";
// import instrumentdata from "../data/mismatch"
// import { TextField } from "@mui/material";

function TraderwiseTraderPNL() {
    const { columns, rows } = data();
    const label = { inputProps: { 'aria-label': 'Switch demo' } };
    const location = useLocation();
    let contestData = location?.state?.elem;
    console.log("location", location)
    const socket = useContext(socketContext);

    useEffect(() => {
      socket.emit("company-ticks", true)  
    }, []);

  return (
    <>

        <MDBox mt={1}>
        <Card>
          <MDBox display="flex" justifyContent="center" alignItems="center">
            <MDBox display='flex' justifyContent='center'>
              <MDTypography variant="h4" gutterBottom p={1}>
                {contestData?.contestName}
              </MDTypography>
            </MDBox>
          </MDBox>

          <MDBox>
            <MDBox style={{backgroundColor:'lightgreen'}} borderRadius={3} ml={1} mr={1}>
              <Grid container xs={12} md={12} lg={12}>
                  <Grid item xs={12} md={12} lg={2}>
                    <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} p={1}>
                      <MDTypography fontSize={11}>Payout%:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" >{contestData?.payoutPercentage}</MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={12} lg={2}>
                    <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} p={1}>
                      <MDTypography fontSize={11}>Entry Fee:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" >₹{contestData?.entryFee}</MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={12} lg={2}>
                    <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} p={1}>
                      <MDTypography fontSize={11}>Max Participant:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" >{contestData?.maxParticipants}</MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={12} lg={2}>
                    <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} p={1}>
                      <MDTypography fontSize={11}>Participant:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" >{contestData?.participants.length}</MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={12} lg={2}>
                    <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} p={1}>
                      <MDTypography fontSize={11}>Expected Collection:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" >₹{contestData?.maxParticipants * contestData?.entryFee}</MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={12} lg={2}>
                    <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} p={1}>
                      <MDTypography fontSize={11}>Collected Fee:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" >₹{contestData?.participants.length * contestData?.entryFee}</MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={12} lg={2}>
                    <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} p={1}>
                      <MDTypography fontSize={11}>Portfolio:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" >₹{contestData?.portfolio?.portfolioValue}</MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={12} lg={2}>
                    <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} p={1}>
                      <MDTypography fontSize={11}>Contest Type:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" >{contestData?.contestType}</MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={12} lg={2}>
                    <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} p={1}>
                      <MDTypography fontSize={11}>Contest For:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" >{contestData?.contestFor}</MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={12} lg={2}>
                    <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} p={1}>
                      <MDTypography fontSize={11}>NIFTY:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold"  >{(contestData?.isNifty === true ? 'Yes' : 'No')}</MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={12} lg={2}>
                    <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} p={1}>
                      <MDTypography fontSize={11}>BANKNIFTY:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" >{(contestData?.isBankNifty === true ? 'Yes' : 'No')}</MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={12} lg={2}>
                    <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} p={1}>
                      <MDTypography fontSize={11}>FINNIFTY:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" >{(contestData?.isFinNifty === true ? 'Yes' : 'No')}</MDTypography>
                    </MDBox>
                  </Grid>
              </Grid>
            </MDBox>
          </MDBox>


          <MismatchDetails socket={socket} id={contestData?._id}/>

          <LiveTraderwiseCompantPNL socket={socket} id={contestData?._id} />
          <MockTraderwiseCompantPNL socket={socket} id={contestData?._id} />
          <LiveOverallCompantPNL socket={socket} id={contestData?._id} />
          <SwitchWindow id={contestData?._id} />
        </Card>
        </MDBox>

    </>
  );
}
export default TraderwiseTraderPNL;
