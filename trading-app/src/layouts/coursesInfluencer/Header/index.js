



























import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { CircularProgress } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import { Link } from 'react-router-dom'
import AwaitingApproval from '../data/awaitingApproval';
import PendingAdminApproval from '../data/pendingAdminApproval';
import Published from '../data/published';
import Unpublished from '../data/unpublished';
import Completed from '../data/completed';


export default function LabTabs() {
  const [value, setValue] = React.useState('1');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event, newValue) => {
    setIsLoading(true)
    setValue(newValue);
    setTimeout(() => {
      setIsLoading(false)
    }, 500);
  };

  return (
    <MDBox color="light" mt={2} mb={1} p={2} borderRadius={10} minHeight='auto'>

      <TabContext value={value}>
        <MDBox sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Awaiting Approval" value="1" />
            <Tab label="Pending Admin Approval" value="2" />
            <Tab label="Published" value="3" />
            <Tab label="Unpublished" value="4" />
            <Tab label="Completed" value="5" />
          </TabList>
        </MDBox>
        <TabPanel value="1">
          {isLoading ?

            <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
              <CircularProgress color="info" />
            </MDBox>
            :
            <MDBox style={{ minWidth: '100%' }}>
              <AwaitingApproval />
            </MDBox>
          }
        </TabPanel>
        <TabPanel value="2">
          {isLoading ?

            <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
              <CircularProgress color="info" />
            </MDBox>
            :
            <MDBox style={{ minWidth: '100%' }}>
              <PendingAdminApproval />
            </MDBox>
          }
        </TabPanel>
        <TabPanel value="3">
          {isLoading ?

            <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
              <CircularProgress color="info" />
            </MDBox>
            :
            <MDBox style={{ minWidth: '100%' }}>
              <Published />
            </MDBox>
          }
        </TabPanel>
        <TabPanel value="4">
          {isLoading ?

            <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
              <CircularProgress color="info" />
            </MDBox>
            :
            <MDBox style={{ minWidth: '100%' }}>
              <Unpublished />
            </MDBox>
          }
        </TabPanel>

        <TabPanel value="5">
          {isLoading ?

            <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
              <CircularProgress color="info" />
            </MDBox>
            :
            <MDBox style={{ minWidth: '100%' }}>
              <Completed />
            </MDBox>
          }
        </TabPanel>

      </TabContext>
    </MDBox>
  );
}