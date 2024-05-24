// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import { io } from 'socket.io-client';
import { useEffect, useContext} from "react";
import ReactGA from "react-ga"


import Header from "./Header";
import { userContext } from "../../AuthContext";
import { socketContext } from "../../socketContext";

function Tables() {
  console.log("rendering in userPosition: infinity")
  let baseUrl1 = process.env.NODE_ENV === "production" ? "/" : "http://localhost:9000/"
  const getDetails = useContext(userContext);


  // let socket;
  // try {
  //   socket = io.connect(`${baseUrl1}`)
  // } catch (err) {
  //   throw new Error(err);
  // }
  const socket = useContext(socketContext);


  console.log("getDetails.userDetails", getDetails.userDetails)
  useEffect(() => {
    // socket.on("connect", () => {
      socket.emit('userId', getDetails.userDetails._id)
      socket.emit("user-ticks", getDetails.userDetails._id)
    // })
    ReactGA.pageview(window.location.pathname)
  }, []);
  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <Header socket={socket}/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
