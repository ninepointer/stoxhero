// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import { Grid } from "@mui/material";
import MDBox from "../../components/MDBox";
import referralImage from '../../assets/images/referral.png';
import ReportsLineChart from "../../examples/Charts/BarCharts/ReportsBarChart";


// Data
import Carousel from "./data/Carousel";
import Indicies from "./components/IndicesComponent";
import Leaderboard from "./data/leaderboard"
import { display } from "@mui/system";
// import PnlPosition from "../../layouts/PaperTrade/OverallP&L/OverallGrid";
import PnlPosition from "./data/Pnl";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";


function Tables() {

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container>
        
        <Grid item xs={12} md={6} lg={12}>
          <Indicies/>
        </Grid>

        <Grid container display="flex" style={{height:'100%'}}>
        <Grid item xs={12} md={6} lg={9} mb={4}>
          <MDBox ml={0} mr={1} display="flex" justifyContent="space-between">
            <MDTypography variant="text" color="dark" fontSize={13}>Upcoming TestZones</MDTypography>
            <MDTypography fontSize={13}><button variant="text" color="dark" size="small" style={{border:"none"}}>View All</button></MDTypography>
          </MDBox>
          <Carousel/>
        </Grid>

        <Grid item xs={12} md={6} lg={3} mb={4} style={{height:'100%'}}>
          <MDBox ml={1.5} mr={1} display="flex" justifyContent="center">
            <MDTypography variant="text" color="dark" fontSize={13}><button variant="text" color="dark" size="small" style={{border:"none"}}>Leaderboard</button></MDTypography>
          </MDBox>
          <Leaderboard/>
        </Grid>
        </Grid>

        <Grid item xs={12} md={6} lg={12}>
          <PnlPosition />
        </Grid>

      </Grid>
      
      
      
      <Grid style={{display: 'flex'}} mt={4}>
          <MDBox style={{flex:2}}>
            <MDBox style={{position:'relative'}}>
              <img src ={referralImage} width='100%' />
              <MDBox style={{
                display:'flex', 
                justifyContent: 'space-between', 
                position: 'absolute',
                width: '100%', 
                bottom: 10,
                paddingLeft: 10,
                paddingRight:10, 
                backgroundColor: '#344666',
                color: 'white'
                }}>
                <span>Winnings</span>
                <span>₹150.00</span>
              </MDBox>
            </MDBox>
          </MDBox>
          <Grid style={{flex:3, height:'150px', marginTop:'24px', marginLeft: '12px'}}>
              <MDBox mb={3} style={{height: '100%'}}>
                <ReportsLineChart
                  color="success"
                  colorheight="14rem"
                  title="Gross p&l (in INR)"
                  // description={
                  //   <>
                  //     (<strong>+15%</strong>) increase than previous last 5 days.
                  //   </>
                  // }
                  // date="updated just now"
                  chart={
                    {
                      labels: [],
                      datasets: { label: "Gross P&L", data: [] },
                    }
                  }
                />
              </MDBox>
          </Grid>
      </Grid>
      {/* <Footer /> */}
    </DashboardLayout>
    </>
  );
}

export default Tables;
