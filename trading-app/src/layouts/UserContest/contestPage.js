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
import ContestTradePage from './data/ContestTradePage'

function Tables() {
  // const { columns, rows } = authorsTableData();
  // const { columns: pColumns, rows: pRows } = projectsTableData();
//   const [contestId,setContestId] = useState();
const location = useLocation();
const  fromMyContest  = location?.state?.fromMyContest;



  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      {fromMyContest ? <ContestTradePage /> : <ContestDetails />}
      
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default memo(Tables);
