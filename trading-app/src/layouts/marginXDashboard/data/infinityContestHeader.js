// Material Dashboard 2 React example components
import React, {useContext, useEffect} from 'react';
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import Footer from "../../../examples/Footer";

import InfinityContestDetails from "../data/infinityContestDetails";
import { io } from "socket.io-client";
import { socketContext } from '../../../socketContext';

function Tables() {
  const socket = useContext(socketContext);

  let baseUrl1 = process.env.NODE_ENV === "production" ? "/" : "http://localhost:9000/"

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <InfinityContestDetails socket={socket}/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
