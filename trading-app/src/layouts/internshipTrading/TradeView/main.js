// Material Dashboard 2 React example components
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import Footer from "../../../examples/Footer";
import { io } from 'socket.io-client';
import { useEffect, useContext, useState} from "react";
import {useLocation} from "react-router-dom";
import axios from 'axios';

// import Header from "./Header";
import { userContext } from "../../../AuthContext";
import InternshipTrading from "./tradePart";

function TradeViewTenX() {
  // console.log("rendering in userPosition: infinity");
  const location = useLocation();
  let [id,setId]  = useState(location?.state?.batchId);
  let baseUrl1 = process.env.NODE_ENV === "production" ? "/" : "http://localhost:9000/"
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const getDetails = useContext(userContext);
  // const location = useLocation();
  const batchArr = getDetails?.userDetails?.internshipBatch
  const BatchId = getDetails?.userDetails.internshipBatch[batchArr.length - 1]?._id||'123';
  // console.log("BatchId", getDetails?.userDetails.internshipBatch[batchArr.length - 1]?._id)
  useEffect(()=> {(async ()=>{
    const res = await axios.get(`${baseUrl}api/v1/internbatch/currentinternship`, {withCredentials:true});
    if(Object.keys(res.data.data).length !== 0){
      setId(res.data?.data?._id);
    }
  })()}, [])
  let socket;
  console.log('batch id', location?.state?.batchId, id );
  try {
    socket = io.connect(`${baseUrl1}`)
  } catch (err) {
    throw new Error(err);
  }

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit('userId', getDetails.userDetails._id)
      socket.emit("user-ticks", getDetails.userDetails._id)
    })
  }, []);
  // console.log("BatchId", BatchId)
  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <InternshipTrading socket={socket} BatchId={id}/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default TradeViewTenX;
