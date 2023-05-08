import React, {useState} from 'react';
import { CircularProgress, Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import tradesicon from '../../../assets/images/tradesicon.png'

export default function LabTabs() {
  const [value, setValue] = React.useState('1');
  const [isLoading,setIsLoading] = useState(false);

  return (
   
    <MDBox bgColor="dark" color="light" mt={2} mb={1} p={2} borderRadius={10}>
          
            <Grid item xs={12} md={6} lg={12}>
              <MDBox style={{minHeight:"80vh"}} border='1px solid white' borderRadius={5} display="flex" justifyContent="center" flexDirection="column" alignContent="center" alignItems="center">
                <img src={tradesicon} width={50} height={50}/>
                <MDTypography color="light" fontSize={15}>Keep watching this space to learn and earn with StoxHero!</MDTypography>
              </MDBox>
            </Grid>

    </MDBox>
  );
}