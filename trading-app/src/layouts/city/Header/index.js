import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { CircularProgress } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import {Link} from 'react-router-dom'
import Active from '../data/active';
import MDTypography from '../../../components/MDTypography';


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
    <MDBox bgColor="dark" color="light" mt={2} mb={1} p={2} borderRadius={10} minHeight='auto'>
    <MDBox mb={2} display="flex" justifyContent="space-between">
    <MDButton 
    variant="outlined" 
    color="warning" 
    size="small"
    component={Link}
    to='/tenxdashboard'
    >
        Back to Tenx Dashboard
    </MDButton>
    <MDButton 
    variant="outlined" 
    color="warning" 
    size="small"
    component={Link}
    to='/citydetails'
    >
        Create City
    </MDButton>
    </MDBox>
      
      {/* <MDTypography color="light" fontSize={16} mb={1}>Search city or state :</MDTypography> */}
      <Active/>
    </MDBox>
  );
}