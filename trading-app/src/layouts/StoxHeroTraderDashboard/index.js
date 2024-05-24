// Material Dashboard 2 React example components
import React, {useState, useContext, useEffect} from "react"
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import Header from "./Header";
import ReactGA from "react-ga"
import { userContext } from "../../AuthContext";
function Tables() {

  const getDetails = useContext(userContext);
  useEffect(()=>{
    window.webengage.track('dashboard_tab_clicked', {
      user: getDetails?.userDetails?._id
    })
    ReactGA.pageview(window.location.pathname)
  },[]);

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <Header/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
