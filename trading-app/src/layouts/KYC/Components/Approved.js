import React, { useState, useEffect } from 'react'
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import { apiUrl } from '../../../constants/constants';
import axios from 'axios';
import KYCCard from './KYCCard';
import MDButton from '../../../components/MDButton';
import { CircularProgress } from '@mui/material';


const Approved = () => {

  const [data, setData] = useState([]);
  const [action, setAction] = useState(false);
  const [skip, setSkip] = useState(0);
  const limitSetting = 15;
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${apiUrl}KYC/rejected?skip=${skip}&limit=${limitSetting}`, { withCredentials: true });
      setData((prev) => res.data.data);
      setCount(res.data.results);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData()
  }, [action, skip])

  function backHandler() {
    if (skip <= 0) {
      return;
    }
    setSkip((prev) => prev - limitSetting);
    setData([]);
  }

  function nextHandler() {
    if (skip + limitSetting >= count) {
      return;
    }
    setSkip((prev) => prev + limitSetting);
    setData([]);
  }

  return (
    <>
      <MDBox sx={{ minHeight: '60vh' }}>
        {
          isLoading ?
            <MDBox sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
              <CircularProgress color='info' />
            </MDBox>
            :
            data.length > 0 ?
              data?.map((kyc) => <KYCCard key={kyc._id}
                user={kyc}
              />) : <MDBox sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <MDTypography>
                  No Approved KYCs
                </MDTypography>
              </MDBox>
        }
      </MDBox>

      {!isLoading && count !== 0 && (
        <MDBox
          mt={1}
          p={1}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <MDButton
            variant="outlined"
            color="dark"
            disabled={
              (skip + limitSetting) / limitSetting === 1
                ? true
                : false
            }
            size="small"
            onClick={backHandler}
          >
            Back
          </MDButton>
          <MDTypography
            color="dark"
            fontSize={15}
            fontWeight="bold"
          >
            Total KYC: {!count ? 0 : count} | Page{" "}
            {(skip + limitSetting) / limitSetting} of{" "}
            {!count ? 1 : Math.ceil(count / limitSetting)}
          </MDTypography>
          <MDButton
            variant="outlined"
            color="dark"
            disabled={
              Math.ceil(count / limitSetting) ===
                (skip + limitSetting) / limitSetting
                ? true
                : !count
                  ? true
                  : false
            }
            size="small"
            onClick={nextHandler}
          >
            Next
          </MDButton>
        </MDBox>
      )}
    </>
  )
}

export default Approved