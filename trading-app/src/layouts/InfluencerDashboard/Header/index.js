import React, {useState} from 'react';
import {Grid} from '@mui/material';
import { CircularProgress } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import {Link} from 'react-router-dom'
import ChooseOptions from '../data/chooseOptions'
import InfluencerCard from '../data/influencerCard'
//data

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
    <MDBox mt={2} mb={2} color="light" borderRadius={10} minHeight='auto' display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{minWidth:'100%'}}>
      <Grid color='light' spacing={2} container xs={12} md={12} lg={12} style={{minWidth:'100%'}} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
        <Grid color='light' item xs={12} md={12} lg={12} style={{minWidth:'100%'}} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
          <ChooseOptions />
        </Grid>
        <Grid color='light' display='flex' justifyContent='center' flexDirection='row' item xs={12} md={12} lg={12} style={{minWidth:'100%'}}>
          <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <Grid item xs={12} md={12} lg={3} display='flex' justifyContent='center' alignContent='center' alignItems='center'><InfluencerCard /></Grid>
            <Grid item xs={12} md={12} lg={3} display='flex' justifyContent='center' alignContent='center' alignItems='center'><InfluencerCard /></Grid>
            <Grid item xs={12} md={12} lg={3} display='flex' justifyContent='center' alignContent='center' alignItems='center'><InfluencerCard /></Grid>
            <Grid item xs={12} md={12} lg={3} display='flex' justifyContent='center' alignContent='center' alignItems='center'><InfluencerCard /></Grid>
          </Grid>
        </Grid>
      </Grid>
    </MDBox>
  );
}