import React, {useState, useEffect, useContext} from 'react';
import { CircularProgress } from '@mui/material';
import MDBox from '../../../components/MDBox';
import ReactGA from "react-ga"
import MDButton from '../../../components/MDButton';
import {Link} from 'react-router-dom'
import CollegeContestScoreboard from '../Header/collegeScoreboard'
import ContestScoreboard from '../Header/stoxheroContestScoreboard'
import { userContext } from '../../../AuthContext';

//data

export default function LabTabs() {
  // const [value, setValue] = React.useState('1');
  const [isLoading,setIsLoading] = useState(false);
  const getDetails = useContext(userContext)
  useEffect(() => {
    ReactGA.pageview(window.location.pathname);
    window.webengage.track('testzone_scoreboard_clicked', {
      user: getDetails?.userDetails?._id,
    })
  }, []);

  // const handleChange = (event, newValue) => {
  //   setIsLoading(true)
  //   setValue(newValue);
  //   setTimeout(() => {
  //     setIsLoading(false)
  //   }, 100);
  // };

  return (
    <MDBox bgColor="dark" color="light" mt={0.5} mb={1} p={0} borderRadius={10} minHeight='auto' minWidth='100%'>
     
          {isLoading ? 
          
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          : 
          <MDBox style={{minWidth:'100%'}}>
            <ContestScoreboard/>
          </MDBox>
        }
    </MDBox>
  );
}