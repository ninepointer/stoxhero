// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import ContestTradingView from "./data/tradingWindow";
import { io } from 'socket.io-client';
import { useEffect, useContext, useState} from "react";
import { userContext } from "../../AuthContext";
import ReactGA from "react-ga"
import { useLocation } from "react-router-dom";
import { socketContext } from "../../socketContext";
import MuhurtContestTradingView from "./data/muhurtTradingWindow";

function Tables() {

  const getDetails = useContext(userContext);
  const location = useLocation();
  const socket = useContext(socketContext);

  useEffect(() => {

    socket.emit('userId', getDetails.userDetails._id)
    socket.emit("user-ticks", getDetails.userDetails._id);
    socket.emit("dailyContestLeaderboard", {id: location?.state?.data, employeeId: getDetails.userDetails?.employeeid, userId: getDetails.userDetails?._id});

    ReactGA.pageview(window.location.pathname)
  }, []);

  console.log("trading window", location.state, location.state.name.includes("muhurat"))
  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      {location.state.name.toLowerCase().includes("muhurat") ?
      <MuhurtContestTradingView socket={socket} data={location.state} />
      :
      <ContestTradingView socket={socket} data={location.state}/>}
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
