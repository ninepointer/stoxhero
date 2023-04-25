import React, {useState} from 'react';
import { CircularProgress, Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';
import MDAvatar from '../../../components/MDAvatar';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {Tooltip} from '@mui/material';
import stock from "../../../assets/images/pnl.png"
import PNLMetrics from '../data/PNLMetrics';
import MonthLineChart from '../data/MonthLineChart'
import DayLineChart from '../data/DayLineChart'

export default function LabTabs() {
  const [value, setValue] = React.useState('1');
  const [isLoading,setIsLoading] = useState(false);
  const [alignment, setAlignment] = React.useState('Paper Trading');
  const [textColor,setTextColor] = React.useState('info');

  // let color = (alignment === 'Paper Trading' ? 'linear-gradient(195deg, #49a3f1, #1A73E8)' : 'white')

  const handleChangeView = (event, newAlignment) => {
    console.log("New Alignment",newAlignment)
    setTextColor("info");
    setAlignment(newAlignment);
  };


  const handleChange = (event, newValue) => {
    setIsLoading(true)
    setValue(newValue);
    setTimeout(() => {
      setIsLoading(false)
    }, 500);
  };

  return (
   
    <MDBox bgColor="dark" color="light" mt={2} mb={1} p={2} borderRadius={10} minHeight='100vh'>
    
    <MDBox mb={2} style={{border:'1px solid white', borderRadius:5}} display="flex" justifyContent="space-between">
      <MDTypography color="light" fontSize={15} fontWeight="bold" p={1} alignItem="center">P&L Metrics</MDTypography>
      <ToggleButtonGroup
      color={textColor}
      style={{backgroundColor:"white",margin:3}}
      value={alignment}
      size='small'
      exclusive
      onChange={handleChangeView}
      aria-label="Platform"
      >
      <ToggleButton style={{paddingLeft:14,paddingRight:14,fontSize:10,fontWeight:700}} value="Paper Trading">Paper Trading</ToggleButton>
      <ToggleButton style={{paddingLeft:14,paddingRight:14,fontSize:10,fontWeight:700}} value="StoxHero Trading">StoxHero Trading</ToggleButton>
      </ToggleButtonGroup>
    </MDBox>
        <PNLMetrics/>
        
        <MDBox mt={2} bgColor="light" borderRadius={4}>
        <Grid container>
          <Grid item xs={12} md={6} lg={12} p={1} m={1} overflow='auto'>
            <DayLineChart/>
          </Grid>
        </Grid>
        </MDBox>

        <MDBox mt={2} bgColor="light" borderRadius={4}>
        <Grid container>
          <Grid item xs={12} md={6} lg={12} p={1} m={1} overflow='auto'>
            <MonthLineChart/>
          </Grid>
        </Grid>
        </MDBox>
    </MDBox>
  );
}