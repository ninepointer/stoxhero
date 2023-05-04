import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { CircularProgress, Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import SummaryTiles from '../data/SummaryTiles'

export default function LabTabs() {
  const [value, setValue] = React.useState('1');
  const [isLoading,setIsLoading] = useState(false);

  const handleChange = (event, newValue) => {
    setIsLoading(true)
    setValue(newValue);
    setTimeout(() => {
      setIsLoading(false)
    }, 500);
  };

  return (
   
    <MDBox bgColor="dark" color="light" mt={2} mb={1} p={2} borderRadius={10} minHeight='100vh'>
          <SummaryTiles/> 
    </MDBox>
  );
}