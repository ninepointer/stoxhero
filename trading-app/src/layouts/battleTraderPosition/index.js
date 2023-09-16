
import React from "react";
// import axios from "axios";
import { useEffect, useContext } from "react";
import { io } from "socket.io-client";
// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import Header from "./Header";
import { socketContext } from "../../socketContext";


function TraderPosition() {
  const socket = useContext(socketContext);

    useEffect(()=>{
      socket.emit("company-ticks", true)
    }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Header />
      <Footer />
    </DashboardLayout>
  );
}

export default TraderPosition;

// todo ---> mismatch