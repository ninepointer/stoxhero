import React, { useState, useEffect } from 'react'
import MDBox from '../../../components/MDBox';
import { apiUrl } from '../../../constants/constants';
import axios from 'axios';
import WithDrawalCard from './withDrawalCard';
import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';
import { CircularProgress } from '@mui/material';

const Initiated = () => {
  const [data, setData] = useState([]);
  const [action, setAction] = useState(false);
  const [skip, setSkip] = useState(0);
  const limitSetting = 15;
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${apiUrl}withdrawals/initiated?skip=${skip}&limit=${limitSetting}`, { withCredentials: true });
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
              data.map((withdrawal) => <WithDrawalCard key={withdrawal._id}
                amount={withdrawal.amount} user={withdrawal?.user} withdrawalRequestDate={withdrawal.withdrawalRequestDate}
                walletTransactionId={withdrawal.walletTransactionId} withdrawalStatus={withdrawal.withdrawalStatus}
                withdrawalId={withdrawal?._id} action={action} setAction={setAction} userWallet={withdrawal?.userWallet}
                walletBalance={withdrawal?.walletBalance}
              />) : <MDBox sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <MDTypography>
                  No Initiated Withdrawals
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
            Total Withdraw: {!count ? 0 : count} | Page{" "}
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

export default Initiated