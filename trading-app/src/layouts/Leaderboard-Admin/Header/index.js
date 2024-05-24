import React, {useState} from 'react';
import Box from '@mui/material/Box';
// import Tab from '@mui/material/Tab';
// import TabContext from '@mui/lab/TabContext';
// import TabList from '@mui/lab/TabList';
// import TabPanel from '@mui/lab/TabPanel';
// import { CircularProgress } from '@mui/material';
import MDBox from '../../../components/MDBox';
// import MDButton from '../../../components/MDButton';
import {Link, useNavigate} from 'react-router-dom'
// import UpcomingMarginX from '../data/upcomingMarginX';
// import CompletedMarginX from '../data/completedMarginx';
// import DraftMarginX from '../data/draftMarginX'
// import OngoingMarginX from '../data/ongoingMarginX';
// import CancelledMarginX from '../data/cancelledMarginx';
import List from '../data/lists';
import LeaderBoard from '../data/leaderboard';


export default function LabTabs() {
  const [value, setValue] = React.useState('1');
  const navigate = useNavigate();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  // Get the value of the "mobile" parameter
  const paramsValue = urlParams.get("value");

  const handleChange = (newValue) => {
    setValue(newValue);
    return navigate(
      `/leaderboard?value=${newValue}`
    );
  };

  return (
    <>
      {!paramsValue ?
        <MDBox bgColor="light" color="light" mt={2} borderRadius={10} minHeight='auto' spacing={2}>
        <List leaderboardFor={`Today's`} handleChange={handleChange} />
        <List leaderboardFor={`Weekly`} handleChange={handleChange} />
        <List leaderboardFor={`Monthly`} handleChange={handleChange} />
      </MDBox>
      :
      <></>}

      {paramsValue ?
        <MDBox bgColor="light" color="light" mt={2} borderRadius={10} minHeight='auto' spacing={2}>
        <LeaderBoard value={value} handleChange={handleChange}/>
      </MDBox>
      :
      <></>}
    </>
  );
}