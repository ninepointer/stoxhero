// Material Dashboard 2 React example components
import React, {useContext, useEffect} from 'react';
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import ReactGA from "react-ga"

import Header from "./Header";
import { io } from "socket.io-client";
import { socketContext } from '../../socketContext';

function Tables() {
  const socket = useContext(socketContext);


  useEffect(() => {
    // socket.on("connect", () => {
      socket.emit("company-ticks", true)
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
