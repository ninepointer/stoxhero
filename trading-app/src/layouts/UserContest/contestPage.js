// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import React,{useState, memo} from 'react'
import ReactGA from "react-ga"


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
const  contestId  = location?.state?.contestId;
const  portfolioId  = location?.state?.portfolioId;
const isFromHistory = location?.state?.isFromHistory
const  isDummy  = location?.state?.isDummy;
const isFromUpcomming = location?.state?.isFromUpcomming;

console.log("inside useEffect", isFromUpcomming , contestId)



  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      {!isFromUpcomming ? 
      <ContestTradePage 
        contestId={contestId} 
        portfolioId={portfolioId}
        isFromHistory={isFromHistory}
        isDummy={isDummy}
      /> : <ContestDetails />}
      
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default memo(Tables);
