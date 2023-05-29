// Material Dashboard 2 React example components
import React, {useState, useEffect} from 'react';
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";

import Header from "./Header";
import { io } from "socket.io-client";

function Tables() {
  let baseUrl1 = process.env.NODE_ENV === "production" ? "/" : "http://localhost:9000/"
  let socket;
  try{
      socket = io.connect(`${baseUrl1}`)
  } catch(err){
      throw new Error(err);
  }

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("company-ticks", true)
    })

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
