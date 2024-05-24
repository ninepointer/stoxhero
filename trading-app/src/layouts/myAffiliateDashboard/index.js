// Material Dashboard 2 React example components
import React, {Suspense, lazy, useEffect} from "react"
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
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress color='info' /></div>}>
          <DashboardNavbar />
        </Suspense>

        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress color='info' /></div>}>
          <Header />
        </Suspense>

        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress color='info' /></div>}>
          <Footer />
        </Suspense>
      </DashboardLayout>
    </>
  );
}

export default Tables;
