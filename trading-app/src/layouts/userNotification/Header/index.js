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
import Empty from '../../../assets/images/void.png'
import DefaultProfilePic from "../../../assets/images/default-profile.png";
// import WithdrawalModal from './withdrawalModal';
import { userContext } from '../../../AuthContext';
import { InfinityTraderRole } from "../../../variables"
import { apiUrl } from '../../../constants/constants';
// import AddMoney from './addMoneyPopup';

export default function Wallet() {
  let name = 'Rodrigo'  
  const [photo, setPhoto] = useState(DefaultProfilePic)
  const [notifications, setNotifications] = useState([]);
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
      const slicedData = notifications?.slice(startIndex, startIndex + perPage);
      setData(slicedData);
    }, [currentPage])
  
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
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

    let call1 = axios.get(`${baseUrl}api/v1/notifications/me/recent`, {
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
        setNotifications(api1Response?.data?.data);
        const startIndex = (currentPage - 1) * perPage;
        const slicedData = api1Response?.data?.data?.slice(startIndex, startIndex + perPage);
        setData(slicedData);
        // setPhoto(api1Response?.data?.data?.userId?.profilePhoto?.url)
        // console.log(api1Response?.data?.data?.userId?.profilePhoto?.url)

      })
      .catch((error) => {
        console.error(error);
      });

  }, [open]);



  return (
    <>
      <MDBox bgColor="dark" color="light" mt={2} mb={1} p={2} borderRadius={10} minHeight='100vh'>
        <Grid container xs={12} md={6} lg={12}>

          <Grid item xs={12} md={12} lg={12} mb={1}>
            <MDBox mb={2}>
              <MDTypography color="light" fontSize={18} display="flex" justifyContent="center">Notifications</MDTypography>
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
                            {moment.utc(elem?.notificationTime).utcOffset('+05:30').format('DD-MMM HH:mm:ss')}
                          </MDTypography>
                          <MDTypography style={{ alignContent: 'center' }} ml={1} color="light" fontSize={10} fontWeight="bold">{elem?.description}</MDTypography>
                        </MDBox>
                      </Grid>
                    </Grid>
                  </MDBox>
                );
              })}
               {data?.length>0 &&
                <MDBox mt={1} display="flex" justifyContent="space-between" alignItems='center' width='100%'>
                    <MDButton variant='outlined' color='warning' disabled={currentPage === 1 ? true : false} size="small" onClick={handlePrevPage}>Back</MDButton>
                    <MDTypography color="light" fontSize={15} fontWeight='bold'>Total Data: {notifications.length} | Page {currentPage} of {Math.ceil(notifications.length/perPage)}</MDTypography>
                    <MDButton variant='outlined' color='warning' disabled={Math.ceil(notifications.length/perPage) === currentPage ? true : false} size="small" onClick={handleNextPage}>Next</MDButton>
                </MDBox>
               }
              </>)
              :
              <MDBox style={{ border: '1px solid white', borderRadius: 5, padding: 4, minHeight:'40vH' }} >
                <Grid container mt={4} xs={12} md={6} lg={12} display="flex" justifyContent="center" alignItems='center'>
                  <Grid item xs={6} md={6} lg={12} display="flex" justifyContent="center" alignItems='center'>
                    <MDAvatar src={Empty} name={name} size="xxl" width={300} height={300} style={{borderRadius:'50%'}}  />
                  </Grid>
                  <MDTypography mt={3} color="light" display="flex" fontSize={16} justifyContent="center">No notifications yet</MDTypography>
                  {/* <MDTypography mt={3} color="light" display="flex" justifyContent="center" fontSize={15}>{getDetails?.userDetails?.role?.roleName === InfinityTraderRole ? `Invite your friends to the app to earn cash & bonus.` : `Participate in Battles and invite your friends to the app to earn cash & bonus.`}</MDTypography> */}
                  {/* <MDBox mt={3} display="flex" justifyContent="center" flexDirection="column" alignContent="center" alignItems="center">
                    <Link to='/battlestreet'><MDButton variant="outlined" color="warning" size="small" style={{ marginBottom: 15, marginLeft: 100, marginRight: 100 }}>Check Upcoming Battles</MDButton></Link>
                    <Link to='/Referrals'><MDButton variant="outlined" color="warning" size="small" style={{ marginBottom: 30, marginLeft: 100, marginRight: 100 }}>Invite A Friend</MDButton></Link>
                  </MDBox> */}
                </Grid>
              </MDBox>
            }




          </Grid>

        </Grid>
      </MDBox>
    </>
  );
}