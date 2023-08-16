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

function Tables() {

  let baseUrl1 = process.env.NODE_ENV === "production" ? "/" : "http://localhost:9000/"
  const getDetails = useContext(userContext);
  // const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const socket = useContext(socketContext);

  console.log("location", location);
  // let socket;
  // try {
  //   socket = io.connect(`${baseUrl1}`)
  //   console.log("socket 1st", socket.id)

  // } catch (err) {
  //   throw new Error(err);
  // }


  useEffect(() => {
    // socket.on("connect", () => {
    //   console.log("socket connected", socket.id)
    //   socket.emit('userId', getDetails.userDetails._id)
    //   socket.emit("user-ticks", getDetails.userDetails._id);
    //   socket.emit("dailyContestLeaderboard", {id: location?.state?.data, employeeId: getDetails.userDetails?.employeeid, userId: getDetails.userDetails?._id});
    // })
    socket.emit('userId', getDetails.userDetails._id)
    socket.emit("user-ticks", getDetails.userDetails._id);
    socket.emit("dailyContestLeaderboard", {id: location?.state?.data, employeeId: getDetails.userDetails?.employeeid, userId: getDetails.userDetails?._id});

    ReactGA.pageview(window.location.pathname)
  }, []);

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <ContestTradingView socket={socket} data={location.state}/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
