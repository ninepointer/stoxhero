import React, { useContext, useEffect, useState } from 'react';
import axios from "axios";
import { CircularProgress, Grid, Divider } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import MDAvatar from '../../../components/MDAvatar';
import MDButton from '../../../components/MDButton'
import { Link } from 'react-router-dom'
import moment from 'moment';


import wallet from '../../../assets/images/wallet.png'
import bonus from '../../../assets/images/bonus.png'
import rupee from '../../../assets/images/rupee.png'
// import referral from '../../../assets/images/referralt.png'
import battle from '../../../assets/images/battlet.png'
import CashFlow from '../../../assets/images/transaction.png'
import DefaultProfilePic from "../../../assets/images/default-profile.png";
import WithdrawalModal from './withdrawalModal';
import { userContext } from '../../../AuthContext';
import { InfinityTraderRole } from "../../../variables"
import { apiUrl } from '../../../constants/constants';
import AddMoney from './addMoneyPopup';

export default function Wallet() {
  let name = 'Prateek Pawan'
  const [photo, setPhoto] = useState(DefaultProfilePic)
  const [myWallet, setMyWallet] = useState([]);
  const [mywithdrawals, setMyWithdrawals] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const[data,setData] = useState([]);
  const [currentPageWd, setCurrentPageWd] = useState(1);
  const[dataWd,setDataWd] = useState([]);
  const perPage =10;
  const perPageWd = 3;
  useEffect(()=>{
      const startIndex = (currentPage - 1) * perPage;
      const slicedData = myWallet?.transactions?.slice(startIndex, startIndex + perPage);
      setData(slicedData);
    }, [currentPage])
  useEffect(()=>{
      const startIndex = (currentPageWd - 1) * perPageWd;
      const slicedData = mywithdrawals?.slice(startIndex, startIndex + perPageWd);
      setDataWd(slicedData);
    }, [currentPageWd])
  
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
  const handleNextPageWd = () => {
    setCurrentPageWd((prevPage) => prevPage + 1);
  };

  const handlePrevPageWd = () => {
    if (currentPageWd > 1) {
      setCurrentPageWd((prevPage) => prevPage - 1);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const getDetails = useContext(userContext)

  useEffect(() => {

    let call1 = axios.get(`${baseUrl}api/v1/userwallet/my`, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
    })

    Promise.all([call1])
      .then(([api1Response]) => {
        // console.log(api1Response?.data?.data);
        setMyWallet(api1Response?.data?.data);
        const startIndex = (currentPage - 1) * perPage;
        const slicedData = api1Response.data.data?.transactions?.slice(startIndex, startIndex + perPage);
        setData(slicedData);
        setPhoto(api1Response?.data?.data?.userId?.profilePhoto?.url)
        // console.log(api1Response?.data?.data?.userId?.profilePhoto?.url)

      })
      .catch((error) => {
        console.error(error);
      });

  }, [open]);

  useEffect(() => {
    axios.get(`${apiUrl}withdrawals/mywithdrawals`, { withCredentials: true }).then((res) => {
      // console.log(res.data.data);
      setMyWithdrawals(res.data.data.filter((item) => item.withdrawalStatus == 'Processed'));
      const startIndex = (currentPage - 1) * perPage;
      const slicedData = res.data.data.filter((item) => item.withdrawalStatus == 'Processed').slice(startIndex, startIndex + perPageWd);
      setDataWd(slicedData);
    })
  }, [open]);


  const cashTransactions = myWallet?.transactions?.filter((transaction) => {
    return transaction.transactionType === "Cash";
  });
  // console.log(myWallet?.transactions);

  const totalCashAmount = cashTransactions?.reduce((total, transaction) => {
    return total + transaction?.amount;
  }, 0);

  // console.log("Total cash amount: ", totalCashAmount);

  const bonusTransactions = myWallet?.transactions?.filter((transaction) => {
    return transaction?.transactionType === "Bonus";
  });

  const totalBonusAmount = bonusTransactions?.reduce((total, transaction) => {
    return total + transaction?.amount;
  }, 0);


  return (
    <>
      <MDBox bgColor="dark" color="light" mt={2} mb={1} p={2} borderRadius={10} minHeight='100vh'>
        <Grid container xs={12} md={6} lg={12}>

          <Grid item xs={12} md={12} lg={6} mb={1}>
            <MDBox mb={2}>
              <MDTypography color="light" fontSize={15} display="flex" justifyContent="center">Transactions</MDTypography>
            </MDBox>
            {data?.length > 0 ?
            (<>
              {data.map((elem) => {
                // console.log("elem", elem)
                return (
                  <MDBox mb={1} style={{ border: '1px solid white', borderRadius: 5, padding: 4 }}>
                    <Grid container xs={12} md={6} lg={12} spacing={1} display="flex" justifyContent="center" alignItems="center" alignContent="center">
                      <Grid item xs={8} md={6} lg={8} display="flex" alignItems="center">
                        <MDAvatar src={battle} name={name} size="sm" />
                        <MDBox display="flex" flexDirection="column">
                          <MDTypography style={{ alignContent: 'center' }} ml={1} color="light" fontSize={15} fontWeight="bold">{elem?.title}</MDTypography>
                          <MDTypography style={{ alignContent: 'center' }} ml={1} color="light" fontSize={10} fontWeight="bold">
                            {moment.utc(elem?.transactionDate).utcOffset('+05:30').format('DD-MMM HH:mm:ss')}
                          </MDTypography>
                          <MDTypography style={{ alignContent: 'center' }} ml={1} color="light" fontSize={10} fontWeight="bold">{elem?.description}</MDTypography>
                        </MDBox>
                      </Grid>
                      <Grid item xs={6} md={6} lg={4} display="flex" justifyContent="flex-end">
                        <MDTypography color="light" fontSize={15} fontWeight="bold">{elem.amount > 0 ? '₹' + elem?.amount : '-₹' + -elem.amount}</MDTypography>
                      </Grid>
                    </Grid>
                  </MDBox>
                );
              })}
               {data?.length>0 &&
                <MDBox mt={1} display="flex" justifyContent="space-between" alignItems='center' width='100%'>
                    <MDButton variant='outlined' color='warning' disabled={currentPage === 1 ? true : false} size="small" onClick={handlePrevPage}>Back</MDButton>
                    <MDTypography color="light" fontSize={15} fontWeight='bold'>Total Data: {myWallet?.transactions.length} | Page {currentPage} of {Math.ceil(myWallet?.transactions.length/perPage)}</MDTypography>
                    <MDButton variant='outlined' color='warning' disabled={Math.ceil(myWallet?.transactions.length/perPage) === currentPage ? true : false} size="small" onClick={handleNextPage}>Next</MDButton>
                </MDBox>
               }
              </>)
              :
              <MDBox style={{ border: '1px solid white', borderRadius: 5, padding: 4 }} >
                <Grid container mt={2} xs={12} md={6} lg={12} display="flex" justifyContent="center">
                  <Grid item xs={6} md={6} lg={12} display="flex" justifyContent="center">
                    <MDAvatar src={CashFlow} name={name} size="xl" />
                  </Grid>
                  <MDTypography mt={3} color="light" display="flex" justifyContent="center">No Transactions Yet!</MDTypography>
                  <MDTypography mt={3} color="light" display="flex" justifyContent="center" fontSize={15}>{getDetails?.userDetails?.role?.roleName === InfinityTraderRole ? `Invite your friends to the app to earn cash & bonus.` : `Participate in Battles and invite your friends to the app to earn cash & bonus.`}</MDTypography>
                  <MDBox mt={3} display="flex" justifyContent="center" flexDirection="column" alignContent="center" alignItems="center">
                    <Link to='/battlestreet'><MDButton variant="outlined" color="warning" size="small" style={{ marginBottom: 15, marginLeft: 100, marginRight: 100 }}>Check Upcoming Battles</MDButton></Link>
                    <Link to='/Referrals'><MDButton variant="outlined" color="warning" size="small" style={{ marginBottom: 30, marginLeft: 100, marginRight: 100 }}>Invite A Friend</MDButton></Link>
                  </MDBox>
                </Grid>
              </MDBox>
            }




          </Grid>

          <Grid item xs={0} md={0.5} lg={0.5}>
            <Divider orientation="vertical" style={{ backgroundColor: 'white', height: '96vh' }} hidden={{ mdDown: true }} />
          </Grid>


          <Grid item xs={12} md={6} lg={5.5}>
            <MDBox>
              <MDTypography color="light" fontSize={15} display="flex" justifyContent="center">Complete Your KYC for withdrawals.</MDTypography>
            </MDBox>
            <Grid container mt={1} spacing={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <Grid item xs={12} md={6} lg={12} display="flex" justifyContent="center">
                <MDAvatar src={photo} name={name} size="xl" />
              </Grid>

              <Grid item xs={12} md={6} lg={12} mb={2} display="flex" justifyContent="center" alignItems="center">
                <MDTypography color="light">{myWallet?.userId?.first_name} {myWallet?.userId?.last_name}</MDTypography>
              </Grid>


              <Grid item xs={12} md={6} lg={12} style={{ border: '1px solid white', borderRadius: 5 }}>

                <Grid container spacing={1} mt={0.5} display="flex" justifyContent="space-between" alignItems="center" alignContent="center">
                  <Grid item xs={3} md={6} lg={3} ml={1} display="flex" justifyContent="left" alignItems="center">
                    <MDAvatar src={wallet} name={name} size="sm" />
                    <MDTypography ml={1} color="light" fontSize={15} fontWeight="bold">Deposit</MDTypography>
                  </Grid>
                  <Grid item xs={3} md={6} lg={3} display="flex" justifyContent="center" alignItems="center"><MDTypography color="light" fontSize={15} fontWeight="bold">₹0</MDTypography></Grid>
                  <Grid item xs={3} md={6} lg={3} display="flex" justifyContent="center" alignItems="center" mr={1}>
                    <AddMoney />
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6} lg={12} mr={1} style={{ maxWidth: '100vw' }}>
                  <Divider variant="middle" style={{ backgroundColor: '#fff' }} />
                </Grid>

                <Grid container spacing={1} display="flex" justifyContent="space-between" alignItems="center">
                  <Grid item xs={3} md={6} lg={3} ml={1} display="flex" justifyContent="left" alignItems="center">
                    <MDAvatar src={rupee} name={name} size="sm" />
                    <MDTypography ml={1} color="light" fontSize={15} fontWeight="bold">Cash</MDTypography>
                  </Grid>
                  <Grid item xs={3} md={6} lg={3} display="flex" justifyContent="center" alignItems="center"><MDTypography color="light" fontSize={15} fontWeight="bold">₹{totalCashAmount ? totalCashAmount?.toFixed(2) : 0}</MDTypography></Grid>
                  <Grid item xs={3} md={6} lg={3} display="flex" justifyContent="center" alignItems="center" mr={1}><MDButton size="small" style={{ width: '95%' }} onClick={() => { handleOpen() }}>Withdraw</MDButton></Grid>
                </Grid>

                <Grid item xs={12} md={6} lg={12} mr={1} style={{ maxWidth: '100vw' }}>
                  <Divider variant="middle" style={{ backgroundColor: '#fff' }} />
                </Grid>

                <Grid container spacing={1} mb={1.5} display="flex" justifyContent="space-between" alignItems="center">
                  <Grid item xs={3} md={6} lg={3} ml={1} display="flex" justifyContent="left" alignItems="center">
                    <MDAvatar src={bonus} name={name} size="sm" />
                    <MDTypography ml={1} color="light" fontSize={15} fontWeight="bold">Bonus</MDTypography>
                  </Grid>
                  <Grid item xs={3} md={6} lg={3} display="flex" justifyContent="center" alignItems="center"><MDTypography color="light" fontSize={15} fontWeight="bold">₹{totalBonusAmount ? totalBonusAmount?.toFixed(2) : 0}</MDTypography></Grid>
                  <Grid item xs={3} md={6} lg={3} display="flex" justifyContent="center" alignItems="center" mr={1}><MDButton size="small" style={{ width: '95%' }}>Redeem</MDButton></Grid>
                </Grid>

              </Grid>

              {dataWd.length > 0 && <Grid item xs={12} md={6} lg={12} style={{ marginTop: '12px', display: 'flex', justifyContent: 'center' }}>
                <MDTypography color='light' fontSize={18}>Successful Withdrawals</MDTypography>
              </Grid>}
              {dataWd.length > 0 && dataWd.map((elem) => {
                return (
                  <Grid item xs={12} md={6} lg={12} style={{ border: '1px solid white', borderRadius: 5, marginBottom: '12px' }}>
                    <MDTypography color='light' fontSize={15}>Amount:₹{elem.amount}</MDTypography>
                    <MDTypography color='light' fontSize={15}>Transfer Date:{new Date(elem?.withdrawalSettlementDate).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })} {(new Date(elem?.withdrawalSettlementDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true, timeStyle: 'medium' }).toUpperCase())}</MDTypography>
                    <MDTypography color='light' fontSize={15}>Status:{elem.withdrawalStatus}</MDTypography>
                    <MDTypography color='light' fontSize={15}>WalletTransactionId:{elem.walletTransactionId}</MDTypography>
                    <MDTypography color='light' fontSize={15}>Transfer TransactionId:{elem.settlementTransactionId}</MDTypography>
                    <MDTypography color='light' fontSize={15}>Transferred via:{elem.settlementMethod}</MDTypography>
                  </Grid>
                )
              })}
              {dataWd?.length>0 &&
                <MDBox mt={1} display="flex" justifyContent="space-between" alignItems='center' width='100%'>
                    <MDButton variant='outlined' color='warning' disabled={currentPageWd === 1 ? true : false} size="small" onClick={handlePrevPageWd}>Back</MDButton>
                    <MDTypography color="light" fontSize={15} fontWeight='bold'>Total Data: {mywithdrawals.length} | Page {currentPageWd} of {Math.ceil(mywithdrawals.length/perPageWd)}</MDTypography>
                    <MDButton variant='outlined' color='warning' disabled={Math.ceil(mywithdrawals.length/perPageWd) === currentPageWd ? true : false} size="small" onClick={handleNextPageWd}>Next</MDButton>
                </MDBox>
               }

            </Grid>
          </Grid>
          <WithdrawalModal open={open} handleClose={handleClose} walletBalance={totalCashAmount ?? 0} />
        </Grid>
      </MDBox>
    </>
  );
}