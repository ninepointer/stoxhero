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
  console.log("rendering in userPosition: infinity");
  const location = useLocation();
  const  id  = location?.state?.batchId;
  console.log('id is', id);
  let baseUrl1 = process.env.NODE_ENV === "production" ? "/" : "http://localhost:9000/"
  const getDetails = useContext(userContext);
  // const location = useLocation();
  const batchArr = getDetails?.userDetails?.internshipBatch
  const BatchId = getDetails?.userDetails.internshipBatch[batchArr.length - 1]?._id||'123';
  console.log("BatchId", getDetails?.userDetails.internshipBatch[batchArr.length - 1]?._id)

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
  console.log("BatchId", BatchId)
  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <InternshipTrading socket={socket} BatchId={id}/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default TradeViewTenX;
