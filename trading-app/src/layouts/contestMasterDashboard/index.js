// Material Dashboard 2 React example components
import React, {useContext, useEffect} from 'react';
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";

import Header from "./Header";
import { io } from "socket.io-client";
import { socketContext } from '../../socketContext';

function Tables() {
  const socket = useContext(socketContext);

  useEffect(() => {
    socket.emit("company-ticks", true)
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
