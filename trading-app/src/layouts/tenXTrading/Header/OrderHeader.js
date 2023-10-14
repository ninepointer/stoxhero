import { useEffect, useState} from "react";
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";

// Material Dashboard 2 React base styles
import breakpoints from "../../../assets/theme/base/breakpoints";

// Images

// import NewLeaderboard from "../data/newLeaderboard";
// import { userContext } from "../../../AuthContext";
// import { useLocation } from "react-router-dom";
import { CircularProgress } from '@mui/material';
import MDButton from '../../../components/MDButton';
// import NeworderWindow from '../data/neworderWindow';
import Orders from "./Order/Order";
import PendingOrders from "./Order/PendingOrder";



function OrderHeader({subscriptionId}) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [clicked, setClicked] = useState('order')

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

//   useEffect(()=>{
//     handleClick()
//   }, [clicked])

  const [isLoading, setIsLoading] = useState(false);

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
                      <MDButton bgColor='dark' color={clicked == "order" ? "info" : "secondary"} size='small' style={{ minWidth: '100%' }}
                          onClick={() => { handleClick("order") }}
                      >
                          <MDBox display='flex' justifyContent='center' alignItems='center'>
                              <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                  {/* <RemoveRedEyeIcon /> */}
                              </MDBox>
                              <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                  Orders
                              </MDBox>
                          </MDBox>
                      </MDButton>
                  </Grid>
                  <Grid item xs={12} md={4} lg={3} display='flex' justifyContent='center'>
                      <MDButton bgColor='dark' color={clicked == "pendingOrder" ? "info" : "secondary"} size='small' style={{ minWidth: '100%' }}
                          onClick={() => { handleClick("pendingOrder") }}
                      >
                          <MDBox display='flex' justifyContent='center' alignItems='center'>
                              <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                  {/* <RemoveRedEyeIcon /> */}
                              </MDBox>
                              <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                  Pending Orders
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
               {clicked === "order" ?
                   <>
                     <Orders subscriptionId={subscriptionId}/>
                   </>
                   :
                   clicked === "pendingOrder" ?
                       <>
                           <PendingOrders subscriptionId={subscriptionId} />
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
OrderHeader.defaultProps = {
  children: "",
};

// Typechecking props for the Header
OrderHeader.propTypes = {
  children: PropTypes.node,
};


export default OrderHeader;
