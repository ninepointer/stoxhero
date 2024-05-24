// Material Dashboard 2 React example components
import React, {useState, useContext, useEffect} from "react"
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import ContestProfileHeader from "./Header/ContestProfileHeader";
import ReactGA from "react-ga"
function Tables() {

  useEffect(()=>{
    ReactGA.pageview(window.location.pathname)
  },[]);

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
        <ContestProfileHeader/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
