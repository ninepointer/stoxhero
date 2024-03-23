import React from "react";
import ReactGA from "react-ga";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { userContext } from "../../AuthContext";
import MDBox from "../../components/MDBox";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Header from "./components/Header";

function Overview() {
  // const [userDetail,setuserDetail] = useState([]);
  const getDetails = useContext(userContext);
  let baseUrl =
    process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/";

  useEffect(() => {
    window.webengage.track("profile_clicked", {
      user: getDetails?.userDetails?._id,
    });
    ReactGA.pageview(window.location.pathname);
    capturePageView();
  }, []);
  let page = "Profile";
  let pageLink = window.location.pathname;
  async function capturePageView() {
    await fetch(`${baseUrl}api/v1/pageview/${page}${pageLink}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
    });
  }
  //  useEffect(()=>{
  //        axios.get(`${baseUrl}api/v1/readparticularuserdetails/${getDetails.userDetails.email}`)
  //       .then((res)=>{
  //           console.log(res.data);
  //           setuserDetail(res.data)
  //       }).catch((err)=>{
  //           //window.alert("Server Down");
  //           return new Error(err);
  //       })
  //   },[getDetails])

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header />
    </DashboardLayout>
  );
}

export default Overview;
