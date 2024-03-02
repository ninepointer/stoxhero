// Material Dashboard 2 React example components
import ReactGA from "react-ga"
import React, { useEffect, useContext, useState} from "react";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import Header from "./Header";
import { userContext } from "../../AuthContext";

function Tables() {
  const getDetails = useContext(userContext);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/";
  useEffect(() => {
    // window.webengage.track('tutorials_tab_clicked', {
    //   user: getDetails?.userDetails?._id,
    // });
    ReactGA.pageview(window.location.pathname)
    // capturePageView()
  }, []);
  let page = 'VideoTutorial'
  let pageLink = window.location.pathname
  // async function capturePageView(){
  //       await fetch(`${baseUrl}api/v1/pageview/${page}${pageLink}`, {
  //       method: "POST",
  //       credentials:"include",
  //       headers: {
  //           "content-type" : "application/json",
  //           "Access-Control-Allow-Credentials": true
  //       },
  //   });
  // }

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