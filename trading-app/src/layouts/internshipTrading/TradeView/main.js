// Material Dashboard 2 React example components
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import Footer from "../../../examples/Footer";
import { io } from 'socket.io-client';
import { useEffect, useContext, useState} from "react";
import {useLocation} from "react-router-dom";
import axios from 'axios';
import ReactGA from "react-ga"

// import Header from "./Header";
import { userContext } from "../../../AuthContext";
import InternshipTrading from "./tradePart";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import { socketContext } from "../../../socketContext";

function TradeViewTenX() {
  // console.log("rendering in userPosition: infinity");
  const location = useLocation();
  let [id,setId]  = useState(location?.state?.batchId);
  let baseUrl1 = process.env.NODE_ENV === "production" ? "/" : "http://localhost:9000/"
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
  const getDetails = useContext(userContext);
  // const location = useLocation();
  const socket = useContext(socketContext);
  const batchArr = getDetails?.userDetails?.internshipBatch
  const BatchId = getDetails?.userDetails.internshipBatch[batchArr.length - 1]?._id||'123';
  // console.log("BatchId", getDetails?.userDetails.internshipBatch[batchArr.length - 1]?._id)
  useEffect(()=> {(async ()=>{

    if(!id){
      if(location?.pathname == "/workshop/trade"){
        const res = await axios.get(`${baseUrl}api/v1/internbatch/currentworkshop`, {withCredentials:true});
        if(Object.keys(res.data.data).length !== 0){
          setId(res.data?.data?._id);
        }
      } else{
        const res = await axios.get(`${baseUrl}api/v1/internbatch/currentinternship`, {withCredentials:true});
        if(Object.keys(res.data.data).length !== 0){
          setId(res.data?.data?._id);
        }
      }
    }

  })()
}, [])

  // let socket;
  // console.log('batch id', location );
  // try {
  //   socket = io.connect(`${baseUrl1}`)
  // } catch (err) {
  //   throw new Error(err);
  // }

  useEffect(() => {
    // socket.on("connect", () => {
    //   socket.emit('userId', getDetails.userDetails._id)
    //   socket.emit("user-ticks", getDetails.userDetails._id)
    // })
    socket.emit('userId', getDetails.userDetails._id)
    socket.emit("user-ticks", getDetails.userDetails._id)

    ReactGA.pageview(window.location.pathname)
  }, []);
  // console.log("BatchId", BatchId)
  return (
    <>
     <DashboardLayout>
      <DashboardNavbar />
      {id ?<InternshipTrading socket={socket} BatchId={id} />:<MDBox style={{
         minHeight: '80vh', display:'flex', alignItems:'center', justifyContent:'center', backgroundColor: '#344666',
         color:'white', borderRadius:'12px', marginTop:'12px'
        }}>
          <MDTypography color='white'>Your internship has ended. Continue using the app or enroll in other internships.</MDTypography>
        </MDBox>}
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default TradeViewTenX;
