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
import MyContestHistoryCard from "./data/MyContestHistoryCard";
import HistoryHeader from "./Header/HistoryHeader";

function Tables() {
  // const { columns, rows } = authorsTableData();
  // const { columns: pColumns, rows: pRows } = projectsTableData();
//   const [contestId,setContestId] = useState();
const location = useLocation();
const  fromMyContest  = location?.state?.fromMyContest;
const  contestId  = location?.state?.contestId;
const  portfolioId  = location?.state?.portfolioId;
const isFromHistory = location?.state?.isFromHistory
const  isDummy  = location?.state?.isDummy;
const isFromUpcomming = location?.state?.isFromUpcomming;




  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
       <HistoryHeader />
        <MyContestHistoryCard />
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default memo(Tables);
