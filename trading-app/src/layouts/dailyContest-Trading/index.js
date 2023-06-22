// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import { io } from 'socket.io-client';
import { useEffect, useContext} from "react";


import Header from "./Header";
import { userContext } from "../../AuthContext";

function Tables() {
  console.log("rendering in userPosition: infinity")
  let baseUrl1 = process.env.NODE_ENV === "production" ? "/" : "http://localhost:9000/"
  const getDetails = useContext(userContext);


  let socket;
  try {
    socket = io.connect(`${baseUrl1}`)
  } catch (err) {
    throw new Error(err);
  }

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit('userId', getDetails.userDetails._id)
      socket.emit("user-ticks", getDetails.userDetails._id);
      socket.emit("company-ticks", true)
    })
  }, []);
  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <Header  contestId={"64915f71a276d74a55f5d1a3"}/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
