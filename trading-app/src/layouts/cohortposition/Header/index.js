import { useState, useEffect } from "react";
import axios from "axios";


// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";

// Material Dashboard 2 React base styles
import breakpoints from "../../../assets/theme/base/breakpoints";

// Images
import backgroundImage from "../../../assets/images/trading.jpg";
import AlgoBoxMain from "../AlgoBoxMain";
import { MenuItem, TextField } from "@mui/material";
import MDTypography from "../../../components/MDTypography";



function BatchPositionHeader({ children }) {
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const [batchDetails, setBatchDetails] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState();

  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/infinityTrade/mock/cohortBatchToday`)
    .then((res)=>{
        setBatchDetails(res.data.data)
        // console.log(res.data);
    }).catch((err)=>{
        return new Error(err);
    })
  }, [])

  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);


  const handleSetTabValue = (event, newValue) => setTabValue(newValue);


  return (

    <MDBox position="relative" mb={5}>

      <MDBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="10rem"
        borderRadius="x1"
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.info.main, 0.6),
              rgba(gradients.info.state, 0.6)
            )}, url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />
      <Card
        sx={{
          position: "relative",
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >

        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={12} lg={12} sx={{ ml: "auto" }}>
          <MDBox sx={{display: 'flex', alignItems: 'center', marginLeft:'24px'}}>
        <MDTypography fontSize={15}>Select Batch</MDTypography>
        <TextField
                // id="outlined-basic"
                select
                label=""
                defaultValue={batchDetails[0]?.batchName??'Selected'}
                minHeight="4em"
                //helperText="Please select the body condition"
                variant="outlined"
                sx={{margin: 1, padding: 1, width: "200px"}}
                onChange={(e)=>{setSelectedBatch(e.target.value)}}
        >
          {batchDetails?.map((option) => (
                <MenuItem key={option?._id?.cohort} value={option?._id?.cohort} minHeight="4em">
                  {option?._id?.cohort}
                </MenuItem>
              ))}
        </TextField>          
      </MDBox>
            {/* <AppBar position="static">
              <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
                {batchDetails.map((elem)=>{
                  return (
                    <Tab
                    label= {`${elem._id.cohort}`}
                    icon={
                      <Icon fontSize="small" sx={{ mt: -0.25 }}>
                        <SupervisorAccountIcon/>
                      </Icon>
                    }
                  />
                  )
                })}


              </Tabs>
            </AppBar>
            {batchDetails.map((elem, index)=>{
              return (
                <TabPanel value={tabValue} index={index}> </TabPanel>
              )
            })} */}

<AlgoBoxMain batchName={selectedBatch}/>
          </Grid>
        </Grid>
      </Card>
    </MDBox>


  );
}

// Setting default props for the Header
BatchPositionHeader.defaultProps = {
  children: "",
};

// Typechecking props for the Header
BatchPositionHeader.propTypes = {
  children: PropTypes.node,
};

function TabPanel(props) {
  const { children, value, index } = props;
  return (
    <>
      {
        value === index &&
        <h1>{children}</h1>
      }
      {/* <TableOne/> */}
    </>

  )
}

export default BatchPositionHeader;
