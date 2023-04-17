// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import React,{useState, memo} from 'react'


// Data
// import authorsTableData from "./data/authorsTableData";
// import projectsTableData from "./data/projectsTableData";
import ContestDetails from "./data/ContestDetails";
import {useLocation} from 'react-router-dom';

function Tables() {
  // const { columns, rows } = authorsTableData();
  // const { columns: pColumns, rows: pRows } = projectsTableData();
//   const [contestId,setContestId] = useState();
const location = useLocation();
const  id  = location?.state?.data;

console.log("this is id", id)


  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <ContestDetails />
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default memo(Tables);
