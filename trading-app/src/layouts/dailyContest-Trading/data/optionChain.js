import React, {useMemo, useState} from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { CircularProgress } from '@mui/material';
import MDBox from '../../../components/MDBox';
// import MDButton from '../../../components/MDButton';
// import {Link} from 'react-router-dom'
// import ActiveBatches from '../data/activeBatches';
// import CompletedBatches from '../data/completedBatches';
// import InactiveBatches from '../data/inactiveBatches'
// import CompanyLive from '../data/companyLive'
// import CompanyMock from '../data/companyMock'
// import TraderLive from "../data/traderLive";
import OptionChainTable from "./optionChainTable";
import MDButton from '../../../components/MDButton';
import {useLocation} from "react-router-dom";
import CircularJSON from 'circular-json';


export default function OptionChain({socket, setShowOption, showOption}) {
  // const [value, setValue] = React.useState('1');
  const [isLoading,setIsLoading] = useState(false);
console.log("socket 3rd", socket)
  const memoizedOptionChainTable = useMemo(() => {
    return <OptionChainTable
      socket={socket}
      setShowChain={setShowOption}
    />;
  }, [socket, setShowOption]);

  return (
    <MDBox bgColor="dark" color="light" mt={2} mb={1} p={2} borderRadius={10} minHeight='auto'>
      <TabContext value={'1'}>

        <TabPanel value="1">
          {isLoading ? 
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
           :
          // showOption ?
          memoizedOptionChainTable
          // :
          // <MDButton onClick={()=>{setShowOption(true)}}>Option Chain</MDButton>
          }
        </TabPanel>
      </TabContext>
    </MDBox>
  );
}