// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import ContestTradingView from "./data/tradingWindow";
import { io } from 'socket.io-client';
import { useEffect, useContext, useState} from "react";
import { userContext } from "../../AuthContext";

function Tables() {

  let baseUrl1 = process.env.NODE_ENV === "production" ? "/" : "http://localhost:9000/"
  const getDetails = useContext(userContext);
  const [isLoading, setIsLoading] = useState(true);


  let socket;
  try {
    socket = io.connect(`${baseUrl1}`)
    console.log("socket 1st", socket.id)

  } catch (err) {
    throw new Error(err);
  }


  // useEffect(() => {
  //   // Wait for the socket prop to be available
  //   if (socket.id) {
  //     // Perform any actions that require the socket prop
  //     console.log("Socket ID:", socket.id);

  //     // Set loading state to false
      
  //   }
  // }, [socket.id]);

  useEffect(() => {
    socket.on("connect", () => {
      
      console.log("socket connected", socket.id)
      socket.emit('userId', getDetails.userDetails._id)
      socket.emit("user-ticks", getDetails.userDetails._id);
      // socket.emit("company-ticks", true)
      // setIsLoading(false);
    })
  }, []);

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <ContestTradingView socket={socket}/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
