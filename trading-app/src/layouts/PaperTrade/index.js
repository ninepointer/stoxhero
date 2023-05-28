import React, { useEffect, useState, useRef,useContext, useMemo, useReducer, useCallback } from "react";
import { io } from "socket.io-client";
// @mui material components
import { Chart } from 'chart.js/auto';
// Chart.register(...registerables);
import Grid from "@mui/material/Grid";
import MDBox from "../../components/MDBox";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import InstrumentDetails from "../tradingCommonComponent/InstrumentDetails";
import OverallGrid from "../tradingCommonComponent/OverallP&L/OverallGrid";
import MarginGrid from "../tradingCommonComponent/MarginDetails/MarginGrid";
import TradableInstrument from "../tradingCommonComponent/TradableInstrument/TradableInstrument";
import StockIndex from "../tradingCommonComponent/StockIndex/StockIndex";
import { userContext } from "../../AuthContext";
import { CircularProgress } from "@mui/material";





function UserPosition() {
  console.log("rendering: UserPosition");
  // const [reRender, setReRender] = useState(true);
  const getDetails = useContext(userContext);
  const [isGetStartedClicked, setIsGetStartedClicked] = useState(false);
  
  let baseUrl1 = process.env.NODE_ENV === "production" ? "/" : "http://localhost:9000/"
  const[isLoading,setIsLoading] = useState(true);


  let socket;
  try {
    socket = io.connect(`${baseUrl1}`)
  } catch (err) {
    throw new Error(err);
  }


  useEffect(() => {
    socket.on("connect", () => {
      socket.emit('userId', getDetails.userDetails._id)
      socket.emit("user-ticks", getDetails.userDetails._id)
      setTimeout(()=>{
        setIsLoading(false)
      },500)
    })
  }, []);

  const memoizedStockIndex = useMemo(() => {
    return <StockIndex socket={socket} />;
  }, [socket]);

  const handleSetIsGetStartedClicked = useCallback((value) => {
    setIsGetStartedClicked(value);
  }, []);

  // const memoizedSetReRender = useCallback((value) => {
  //   setReRender(value);
  // }, []);

  const memoizedTradableInstrument = useMemo(() => {
    return <TradableInstrument
      
      // reRender={reRender}
      // setReRender={memoizedSetReRender}
      isGetStartedClicked={isGetStartedClicked}
      setIsGetStartedClicked={handleSetIsGetStartedClicked}
      from={'paperTrade'}
    />;
  }, [ isGetStartedClicked, handleSetIsGetStartedClicked]);

  const memoizedInstrumentDetails = useMemo(() => {
    return <InstrumentDetails
      socket={socket}
      // reRender={reRender}
      // setReRender={setReRender}
      // setReRender={}
      // isGetStartedClicked={isGetStartedClicked}
      setIsGetStartedClicked={handleSetIsGetStartedClicked}
      from={"paperTrade"}
    />;
  }, [socket, handleSetIsGetStartedClicked]);

  const memoizedOverallPnl = useMemo(() => {
    return <OverallGrid
      
      // reRender={reRender}
      // setReRender={memoizedSetReRender}
      // setReRender={}
      // isGetStartedClicked={isGetStartedClicked}
      socket={socket}
      setIsGetStartedClicked={handleSetIsGetStartedClicked}
      from={"paperTrade"}
    />;
  }, [ handleSetIsGetStartedClicked, socket]);

 
  



  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={0} mt={1}>
        {isLoading ?  <MDBox display="flex" justifyContent="center" sx={{position:"absolute",top:{xs:"250px",md:"380px"},right:{xs:"150px",md:"350px",lg:"680px"}}}> <CircularProgress style={{height:"90px",width:"90px", color:"blue"}}/></MDBox>
        :
        <>
        

        {/* <StockIndex /> */}
        {/* <StockIndex socket={socket}/> */}
        {memoizedStockIndex}

        {/* <MemoizedTradableInstrument /> */}
        {/* <TradableInstrument socket={socket} reRender={reRender} setReRender={setReRender} isGetStartedClicked={isGetStartedClicked} setIsGetStartedClicked={setIsGetStartedClicked}/> */}
        {memoizedTradableInstrument}

        <MDBox mt={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              {memoizedInstrumentDetails}
              {/* <InstrumentDetails socket={socket} Render={{ reRender, setReRender }} setIsGetStartedClicked={setIsGetStartedClicked} /> */}
            </Grid>
          </Grid>
        </MDBox>

        <MDBox mt={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              {memoizedOverallPnl}
             {/* <OverallGrid socket={socket} Render={{ reRender, setReRender }} setIsGetStartedClicked={setIsGetStartedClicked}/> */}
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mt={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              <MarginGrid/>
            </Grid>
          </Grid>
        </MDBox>
        </>
}
      </MDBox>
    </DashboardLayout>
  );
}

export default UserPosition;





