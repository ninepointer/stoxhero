// Material Dashboard 2 React example components
import React, {useContext, useEffect} from 'react';
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import ReactGA from "react-ga"

import Header from "./Header";

function Tables() {

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <Header />
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
