// Material Dashboard 2 React example components
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import Footer from "../../../examples/Footer";
import { io } from 'socket.io-client';
import { useEffect, useContext} from "react";
import {useLocation} from "react-router-dom";

// import Header from "./Header";
import { userContext } from "../../../AuthContext";
import InternshipTrading from "./tradePart";

function TradeViewTenX() {
  console.log("rendering in userPosition: infinity")
  let baseUrl1 = process.env.NODE_ENV === "production" ? "/" : "http://localhost:9000/"
  const getDetails = useContext(userContext);
  const location = useLocation();
  const subscriptionId = getDetails?.internshipBatch||'123';
  console.log("subscriptionId", subscriptionId)

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
    })
  }, []);
  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <InternshipTrading socket={socket} subscriptionId={subscriptionId}/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default TradeViewTenX;
