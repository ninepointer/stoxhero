import { useEffect, useContext, useState} from "react";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
// import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
// import AppBar from "@mui/material/AppBar";
// import Tabs from "@mui/material/Tabs";
// import Tab from "@mui/material/Tab";
// import PersonIcon from '@mui/icons-material/Person';


// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";

// Material Dashboard 2 React base styles
import breakpoints from "../../../assets/theme/base/breakpoints";

// Images

// import ContestTradingView from "../data/tradingWindow";
import NewLeaderboard from "../data/newLeaderboard";

import { userContext } from "../../../AuthContext";
// import ReactGA from "react-ga"
import { useLocation } from "react-router-dom";
// import { socketContext } from "../../../socketContext";
// import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { CircularProgress } from '@mui/material';
import MDButton from '../../../components/MDButton';
import NewTradingWindow from '../data/newTradingWindow';



function TradingHeader({socket, data}) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");

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


  const getDetails = useContext(userContext);
  const location = useLocation();
//   const socket = useContext(socketContext);

//   useEffect(() => {

//     socket.emit('userId', getDetails.userDetails._id)
//     socket.emit("user-ticks", getDetails.userDetails._id);
//     socket.emit("battleLeaderboard", {id: location?.state?.data, employeeId: getDetails.userDetails?.employeeid, userId: getDetails.userDetails?._id});

//     ReactGA.pageview(window.location.pathname)
//   }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [clicked, setClicked] = useState('trading')

  const handleClick = (e) => {
    console.log(e)
    setClicked(e)
  };


  return (
   
    <>
      <MDBox bgColor="light" color="light" display='flex' justifyContent='center' flexDirection='column' mb={1} borderRadius={10} minHeight='auto' width='100%'>


          <MDBox mb={1} mt={1} p={0.5} minWidth='100%' bgColor='light' minHeight='auto' borderRadius={7}>

              <Grid container spacing={1} xs={12} md={12} lg={12} minWidth='100%' display='flex' justifyContent='space-around'>
                  <Grid item xs={12} md={4} lg={3} display='flex' justifyContent='center'>
                      <MDButton bgColor='dark' color={clicked == "trading" ? "info" : "secondary"} size='small' style={{ minWidth: '100%' }}
                          onClick={() => { handleClick("trading") }}
                      >
                          <MDBox display='flex' justifyContent='center' alignItems='center'>
                              <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                  {/* <RemoveRedEyeIcon /> */}
                              </MDBox>
                              <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                  My Positions
                              </MDBox>
                          </MDBox>
                      </MDButton>
                  </Grid>
                  <Grid item xs={12} md={4} lg={3} display='flex' justifyContent='center'>
                      <MDButton bgColor='dark' color={clicked == "leaderboard" ? "info" : "secondary"} size='small' style={{ minWidth: '100%' }}
                          onClick={() => { handleClick("leaderboard") }}
                      >
                          <MDBox display='flex' justifyContent='center' alignItems='center'>
                              <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                  {/* <RemoveRedEyeIcon /> */}
                              </MDBox>
                              <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                  LeaderBoard
                              </MDBox>
                          </MDBox>
                      </MDButton>
                  </Grid>

              </Grid>
          </MDBox>


      </MDBox>
   
   {isLoading ?
       <MDBox mt={10} mb={10} display="flex" justifyContent="center" alignItems="center">
           <CircularProgress color='light' />
       </MDBox>
       :
       <>
           <MDBox>
               {clicked === "trading" ?
                   <>
                     <NewTradingWindow socket={socket} data={data} setClicked={setClicked}/>
                       {/* <ContestTradingView socket={socket} data={location.state} setClicked={setClicked} /> */}
                   </>
                   :
                   clicked === "leaderboard" ?
                       <>
                           <NewLeaderboard socket={socket} name={data?.name} id={data?.data} data ={data} setClicked={setClicked} />
                       </>
                       :
                       <>
                       </>
               }   
           </MDBox>
       </>
   }
   </>
    
  );
}

// Setting default props for the Header
TradingHeader.defaultProps = {
  children: "",
};

// Typechecking props for the Header
TradingHeader.propTypes = {
  children: PropTypes.node,
};


export default TradingHeader;
