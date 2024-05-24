// Material Dashboard 2 React example components
import React, {useContext, useEffect} from 'react';
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";


// Data
// import authorsTableData from "./data/authorsTableData";
// import projectsTableData from "./data/projectsTableData";
import Header from "./Header";
import { io } from "socket.io-client";
import { socketContext } from '../../socketContext';

function Tables() {
  // const { columns, rows } = authorsTableData();
  // const { columns: pColumns, rows: pRows } = projectsTableData();
  let baseUrl1 = process.env.NODE_ENV === "production" ? "/" : "http://localhost:9000/"
  // let socket;
  // try{
  //     socket = io.connect(`${baseUrl1}`)
  // } catch(err){
  //     throw new Error(err);
  // }
  const socket = useContext(socketContext);


  useEffect(() => {
    // socket.on("connect", () => {
      socket.emit("company-ticks", true)
    // })

  }, []);

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <Header socket={socket}/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
