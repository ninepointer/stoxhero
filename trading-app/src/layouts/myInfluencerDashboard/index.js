// Material Dashboard 2 React example components
import React, {useState, Suspense, useEffect, lazy} from "react"
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
// import Footer from "../../examples/Footer";
// import Header from "./Header";
import ReactGA from "react-ga"
import { CircularProgress } from "@mui/material";

const Header = lazy(() => import('./Header'));
const Footer = lazy(() => import('../../examples/Footer'));
const DashboardNavbar = lazy(() => import('../../examples/Navbars/DashboardNavbar'));


function Tables() {

  useEffect(()=>{
    ReactGA.pageview(window.location.pathname)
  },[]);

  return (
    <>
      <DashboardLayout>
        <Suspense fallback={<CircularProgress color='info' />}>
          <DashboardNavbar />
        </Suspense>

        <Suspense fallback={<CircularProgress color='info' />}>
          <Header />
        </Suspense>

        <Suspense fallback={<CircularProgress color='info' />}>
          <Footer />
        </Suspense>
      </DashboardLayout>
    </>
  );
}

export default Tables;
