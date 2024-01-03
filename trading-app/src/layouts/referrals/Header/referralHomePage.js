// Material Dashboard 2 React example components
import React, {useContext} from 'react'
import {useState, useEffect} from "react"
import axios from "axios";
import { userContext } from "../../../AuthContext";
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDTypography from "../../../components/MDTypography";
import DataTable from "../../../examples/Tables/DataTable";
// import InviteFriendModal from './InviteFriendModel'
// import { CircularProgress, Typography } from "@mui/material";
import MDSnackbar from "../../../components/MDSnackbar";
// import { FaUsers } from 'react-icons/fa';
// import QrCode2Icon from '@mui/icons-material/QrCode2';
import { IoLogoWhatsapp } from 'react-icons/io';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import QRCode from "react-qr-code";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ReferredProduct from "../data/referredProduct";

// Icons
import SendIcon from '@mui/icons-material/Send';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
// import ReferralHeader from "./Header";
//Images
import ReferralProgramImage from '../../../assets/images/referral-program.png'
import ReferralImage from '../../../assets/images/referral.png'
// import Invited from '../data/invitedData'
import {BiCopy} from 'react-icons/bi'
import { Link } from 'react-router-dom';
function ReferralHomePage() {
  const [invited,setInvited] = useState(false)
  const getDetails = useContext(userContext);
//   const {columns, rows} = Invited();
//   const [open, setOpen] = React.useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);
  const [activeReferralProgram,setActiveReferralProgram] = useState();
  const [affiliateSummery,setAffiliateSummery] = useState([]);
//   const [invitedCount,setInvitedCount] = useState([]);
  const [joinedData,setJoinedData] = useState([]);
  const [joinedCount,setJoinedCount] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [copied, setCopied] = useState(false);
  const[referralRanks, setReferralRanks] = useState([]);
  const[rank, setRank] = useState();
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const id = getDetails.userDetails._id
  const referralCode = getDetails.userDetails.myReferralCode

  
  useEffect(()=>{

    axios.get(`${baseUrl}api/v1/referrals/active`,{withCredentials:true})
    .then((res)=>{
    //    console.log('ye hai ref', res?.data?.data[0])
       setActiveReferralProgram(res?.data?.data[0]);
    }).catch((err)=>{
        return new Error(err);
    });
  },[invited]);

  const getEarnings = async()=>{
    const res = await axios.get(`${baseUrl}api/v1/earnings`, {withCredentials: true});
    // console.log('earnings data',res.data.data);
    setEarnings(res.data.data.earnings);
    setJoinedCount(res.data.data.joined);
  }

  const getMyReferrals = async()=>{
    const res = await axios.get(`${baseUrl}api/v1//myreferrals/${id}`, {withCredentials: true});
    // console.log('my referral data',res.data.data);
    setJoinedData(res.data.data);
  }

  useEffect(()=>{
    getEarnings();
    getMyReferrals();
  }, []);

  const fetchData = async()=>{
    const res = await axios.get(`${baseUrl}api/v1/referrals/leaderboard`, {withCredentials: true});
    // console.log('referral data',res.data.data);
    setReferralRanks(res.data.data);
    const rankRes = await axios.get(`${baseUrl}api/v1/referrals/myrank`, {withCredentials: true});
    if(rankRes.data.status == 'success'){
        setRank(rankRes.data.data);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(fetchData, 10000); // run every 10 seconds
    fetchData(); // run once on mount
    return () => clearInterval(intervalId);
  }, []);

const handleCopy = () => {
    window.webengage.track('referral_share_clicked', {
        user: getDetails?.userDetails?._id,
    });
    setCopied(true);
    openSuccessSB('success', 'Copied');
}
  const [title,setTitle] = useState('')
  const [content,setContent] = useState('')
//   const [time,setTime] = useState('')
 
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = (value,content) => {
        setTitle(value);
        setContent(content);
        setSuccessSB(true);
  }
  const closeSuccessSB = () => setSuccessSB(false);
  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title={title}
      content={content}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="success"
    />
  );    
  const copyText = `                    

  AB INDIA SIKHEGA OPTIONS TRADING AUR BANEGA ATMANIRBHAR

  Join me at StoxHero - Options Trading and Investment Platform 🤝                            

  👉 Get 10,00,000 virtual currency in your account to start option trading using my referral code

  👉 Join the community of ace traders and learn real-time options trading

  👉 Participate in TenX Trading and earn 10% real cash on the profit you will make on the platform

  📲 Visit https://www.stoxhero.com?referral=${referralCode}                          

  Use my below invitation code 👇 and get virtual currency of ₹10,00,000 in your wallet and start trading

  My Referral Code to join the StoxHero: ${referralCode}`

  let referralColumns = [
        { Header: "#", accessor: "serialno",align: "center" },
        { Header: "Full Name", accessor: "fullName",align: "center" },
        // { Header: "Mobile No.", accessor: "mobile", align: "center"},
        { Header: "Date of Joining", accessor: "doj", align: "center"},
        { Header: "# of Referrals", accessor: "referrals", align: "center"},
        { Header: "Earnings", accessor: "earnings", align: "center"},
  ];

  let referralRows = [];

  joinedData?.map((elem,index)=>{
    let joinedRowData = {}

    joinedRowData.serialno = (
        <MDTypography variant="Contained" color = 'dark' fontWeight="small">
            {index+1}
        </MDTypography>
    );
    joinedRowData.fullName = (
        <MDTypography variant="Contained" color = 'dark' fontWeight="small">
            {elem?.first_name} {elem?.last_name}
        </MDTypography>
    );
    // joinedRowData.mobile = (
    //     <MDTypography variant="Contained" color = 'dark' fontWeight="small">
    //         {elem?.mobile}
    //     </MDTypography>
    // );
    joinedRowData.doj = (
        <MDTypography variant="Contained" color = 'dark' fontWeight="small">
            {new Date(elem?.joining_date).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })} {(new Date(elem?.joining_date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata',hour12: true, timeStyle: 'medium' }).toUpperCase())}
        </MDTypography>
    );
    joinedRowData.referrals = (
        <MDTypography variant="Contained" color = 'dark' fontWeight="small">
            {elem?.referrals?.length}
        </MDTypography>
    );
    joinedRowData.earnings = (
        <MDTypography variant="Contained" color = 'dark' fontWeight="small">
            ₹{elem?.referrals.reduce((acc, referral) => { return acc + referral?.referralEarning;}, 0)}
        </MDTypography>
    );

    referralRows.push(joinedRowData);
  })

  let columns = [
    { Header: "Rank", accessor: "rank",align: "center" },
    { Header: "UserID", accessor: "user",align: "center" },
    { Header: "Name", accessor: "name",align: "center" },
    { Header: "# of Referrals", accessor: "referralCount",align: "center" },
    { Header: "Earnings", accessor: "earnings", align: "center"},
  ];
  let rows = [];
//   console.log('checking',referralRanks, getDetails.userDetails.employeeid);
  referralRanks?.map((elem, index)=>{
    let refData = {}
    if(rank && rank.rank == index+1){
        refData.rank =(
            <MDTypography variant="Contained" color = 'info' fontWeight="medium">
              {index+1}
            </MDTypography>
        );
        refData.user = (
            <MDTypography variant="Contained" color = 'info' fontWeight="medium">
              {elem.user} (you)
            </MDTypography>
          );
        refData.name = (
            <MDTypography variant="Contained" color = 'info' fontWeight="medium">
                {elem.first_name} {elem.last_name}
            </MDTypography>
          );
        refData.referralCount = (
            <MDTypography variant="Contained" color = 'info' fontWeight="medium">
                {elem.referralCount}
            </MDTypography>
          );
        refData.earnings = (
            <MDTypography variant="Contained" color='info' fontWeight="medium">
              ₹{elem.earnings}
            </MDTypography>
          );
          if(index == 0 && referralRanks[0]?.user != getDetails.userDetails.employeeid){
            refData.rank =(
                <MDTypography variant="Contained" fontWeight="medium">
                  {index+1}
                </MDTypography>
            );
            refData.user = (
                <MDTypography variant="Contained" fontWeight="medium">
                  {elem.user}
                </MDTypography>
              );
            refData.name = (
                <MDTypography variant="Contained" fontWeight="medium">
                    {elem.first_name} {elem.last_name}
                </MDTypography>
              );
            refData.referralCount = (
                <MDTypography variant="Contained" fontWeight="medium">
                    {elem.referralCount}
                </MDTypography>
                );
            refData.earnings = (
                <MDTypography variant="Contained" fontWeight="medium">
                  ₹{elem.earnings}
                </MDTypography>
              );
          }
    }else{
        refData.rank =(
            <MDTypography variant="Contained" fontWeight="medium">
              {index+1}
            </MDTypography>
        );
        refData.user = (
            <MDTypography variant="Contained" fontWeight="medium">
              {elem.user}
            </MDTypography>
          );
        refData.name = (
            <MDTypography variant="Contained" fontWeight="medium">
                {elem.first_name} {elem.last_name}
            </MDTypography>
          );
        refData.referralCount = (
            <MDTypography variant="Contained" fontWeight="medium">
                {elem.referralCount}
            </MDTypography>
            );
        refData.earnings = (
            <MDTypography variant="Contained" fontWeight="medium">
              ₹{elem.earnings}
            </MDTypography>
          );
    }
    rows.push(refData);  
  });
  if(rank && rank.rank>referralRanks.length){
    rows.push({
        rank:(
            <MDTypography variant="Contained" fontWeight="medium">
              {rank.rank}
            </MDTypography>
        ),
        name:(
            <MDTypography variant="Contained" fontWeight="medium">
              you
            </MDTypography>
          ),
        earnings: (
            <MDTypography variant="Contained" fontWeight="medium">
              {rank.earnings}
            </MDTypography>
          )  
    })
  }
  return (
    <>
        <MDBox width="100%" bgColor="dark" mt={2} mb={1} p={2} borderRadius={10} minHeight='100vh'>
            <MDBox>
                <Grid container spacing={4}>
                    
                    <Grid item xs={12} md={12} lg={8}>
                        <MDBox color="light" pt={2.25} pb={2.25} display="flex" justifyContent="center">
                            StoxHero Referral Program - {activeReferralProgram?.referralProgramName}
                        </MDBox>
                        <MDBox fontSize={15} display="flex" justifyContent="center">
                            <img alt="Referral Program" style={{ maxWidth: '100%', height: 'auto' }} src={ReferralImage}/>
                        </MDBox>
                    </Grid>

                    <Grid item xs={12} md={12} lg={4}>
                        <MDBox bgColor="light"  p={2} style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.6)' }}>
                            <Grid container>
                                <Grid item xs={12} md={12} mt={2} lg={12} marginTop={0.5} display="flex" textAlign="center" justifyContent="center">
                                    <MDTypography fontSize={13}>Get {activeReferralProgram?.currency} {activeReferralProgram?.rewardPerReferral} for every referral in your StoxHero wallet</MDTypography>
                                </Grid>
                                <Grid item xs={12} md={12} lg={12} mt={1.5}>
                                    <MDBox fontSize={13} display="flex" justifyContent="center">
                                        <img style={{ maxWidth: '100%', height: '120px' }} src={ReferralProgramImage}/>
                                    </MDBox>
                                </Grid>
                                <Grid item xs={12} md={12} lg={12} mt={1.5}>
                                    
                                    <MDBox display="flex" alignItems="center">
                                        <SendIcon fontSize="small" style={{ borderRadius: '50%',padding:3, border: '1px solid black' }}/>
                                        <MDTypography ml={0.5} fontSize={13}>Invite Your Friends</MDTypography>
                                    </MDBox>
                                    
                                </Grid>

                                <Grid item xs={12} md={12} lg={12} mt={1.5}>
                                    <MDBox display="flex" alignItems="start">
                                        <AccountBalanceWalletIcon fontSize="small" style={{ borderRadius: '50%',padding:3, border: '1px solid black' }}/>
                                        <MDTypography ml={0.5} fontSize={13}>Your friend gets 10 Lakhs Virtual Currency for Paper Trading(Virtual Trading)</MDTypography>
                                    </MDBox>
                                </Grid>
                                <Grid item xs={12} md={12} lg={12} mt={1.5}>
                                    <MDBox display="flex" alignItems="start">
                                        <AccountBalanceWalletIcon fontSize="small" style={{ borderRadius: '50%',padding:3, border: '1px solid black' }}/>
                                        <MDTypography ml={0.5} fontSize={13}>Your friend gets INR 100 in his StoxHero Wallet.</MDTypography>
                                    </MDBox>
                                </Grid>

                                <Grid item xs={12} md={12} lg={12} mt={1.5}>
                                    <MDBox display="flex" alignItems="center">
                                        <CurrencyRupeeIcon fontSize="small" style={{ borderRadius: '50%',padding:3, border: '1px solid black' }}/>
                                        <MDTypography ml={0.5} fontSize={13}>You get {activeReferralProgram?.currency} {activeReferralProgram?.rewardPerReferral} for each referral</MDTypography>
                                    </MDBox>
                                </Grid>

                                <Grid item xs={12} md={12} lg={12} mt={2} display="flex" justifyContent="start" style={{cursor:'pointer'}}>
                                        <Link to ='/terms'>
                                            <MDTypography fontSize={14}>
                                                Terms & Conditions
                                            </MDTypography>
                                        </Link>
                                        
                                </Grid>
                                <Grid item xs={12} md={12} lg={12} mt={2} display="flex" justifyContent="space-between">
                                    <MDBox display='flex' alignItems='center' style={{
                                        backgroundColor:'#c3c3c3', 
                                        padding: '10px',
                                        borderRadius: '10px'
                                    }}>
                                        <MDTypography paddingLeft = '15px'>{referralCode}</MDTypography>
                                        <MDButton variant='text' color='black' padding={0} margin={0} >
                                            <CopyToClipboard text = {copyText} onCopy={handleCopy}>
                                                <BiCopy/>
                                            </CopyToClipboard>
                                        </MDButton>
                                    </MDBox>
                                    <MDBox style={{display:"flex", alignItems: "center", justifyContent: "center", marginRight: '10px'}}>
                                        <a 
                                        href={`https://api.whatsapp.com/send?text=Hey,
                                        %0A%0A*AB INDIA SIKHEGA OPTIONS TRADING AUR BANEGA ATMANIRBHAR*
                                        %0A%0AJoin me at StoxHero - India's First Options Trading and Investment Platform 🤝 
                                        %0A%0A👉 Get 10,00,000 virtual currency in your account to start option trading using my referral code.
                                        %0A%0A👉 Join the community of ace traders and learn real-time options trading.
                                        %0A%0A👉 Participate in free options trading TestZones to sharpen your trading skills.
                                        %0A%0A📲 Visit https://www.stoxhero.com?referral=${referralCode}
                                        %0A%0AUse my below invitation code 👇 and get virtual currency of ₹10,00,000 in your wallet and start trading.
                                        %0A%0AMy Referral Code to join the StoxHero: *${getDetails.userDetails.myReferralCode}*`}
                                        target="_blank" onClick={
                                            () => {
                                                window.webengage.track('referral_whatsapp_share_clicked', {
                                                    user: getDetails?.userDetails?._id,
                                                });
                                            }
                                        }>
                                        <MDTypography variant="contained">
                                           <IoLogoWhatsapp color="green" lineHeight={1} size={40} />
                                        </MDTypography>
                                        </a>
                                    </MDBox>
                                </Grid>
                                {/* <Grid item xs={12} md={12} lg={12} mt={2} display="flex" justifyContent="center">
                                    <InviteFriendModal invited={invited} setInvited={setInvited} referralCode={referralCode} referralProgramId={activeReferralProgram?._id}/>
                                </Grid> */}
                            </Grid>
                        </MDBox>
                    </Grid>

                </Grid>
            </MDBox>

              <MDBox mt={3}>
                  <Grid container >
                      <Grid items xs={12} md={6} lg={4}>
                          <MDBox
                              style={{
                                  backgroundColor: "white",
                                  margin: 4, height: 100,
                                  borderRadius: 8,
                                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                  fontFamily: "Proxima Nova",
                                  display: "flex",
                                  justifyContent: "center"
                              }}
                          >
                              <MDBox style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40%" }}>
                                  {/* <QrCode2Icon color="success" fontSize="large" style={{width:"80%", height:"80%"}}/> */}
                                  <QRCode value={`https://stoxhero.com?referral=${referralCode}`} fgColor='green' style={{ padding: '20px' }} />
                              </MDBox>
                              <MDBox style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", width: "60%" }}>
                                  <MDTypography fontSize="13px" lineHeight={1}>My Referral Code</MDTypography>
                                  <MDTypography
                                      style={{ borderRadius: 8, backgroundColor: "lightgrey", padding: 6, margin: 6 }}
                                      fontSize="17px"
                                      lineHeight={1}
                                  >
                                      {getDetails?.userDetails?.myReferralCode}
                                  </MDTypography>
                                  <a
                                      href={`https://api.whatsapp.com/send?text=Hey,
                                %0A%0A*AB INDIA SIKHEGA OPTIONS TRADING AUR BANEGA ATMANIRBHAR*
                                %0A%0AJoin me at StoxHero - India's First Options Trading and Investment Platform 🤝 
                                %0A%0A👉 Get 10,00,000 virtual currency in your account to start option trading using my referral code.
                                %0A%0A👉 Join the community of ace traders and learn real-time options trading.
                                %0A%0A👉 Participate in free options trading contests to sharpen your trading skills.
                                %0A%0A📲 Visit https://www.stoxhero.com
                                %0A%0AUse my below invitation code 👇 and get virtual currency of ₹10,00,000 in your wallet and start trading.
                                %0A%0AMy Referral Code to join the StoxHero: *${getDetails.userDetails.myReferralCode}*`}
                                      target="_blank">
                                      {/* <MDTypography variant="contained" display="flex" justifyContent="center" style={{fontSize:"12px",lineHeight:1}}>
                                    Click to Share on &nbsp;<IoLogoWhatsapp color="green" lineHeight={1} />
                                </MDTypography> */}
                                  </a>
                              </MDBox>
                          </MDBox>
                      </Grid>

                      <Grid items xs={12} md={6} lg={4}>
                          <MDBox
                              style={{
                                  backgroundColor: "white",
                                  margin: 4, height: 100,
                                  borderRadius: 8,
                                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                  fontFamily: "Proxima Nova",
                                  display: "flex",
                                  justifyContent: "center"
                              }}
                          >
                              <MDBox style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40%" }}>
                                  <PeopleAltIcon color="success" fontSize="large" style={{ width: "80%", height: "80%" }} />
                              </MDBox>
                              <MDBox style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", width: "60%" }}>
                                  <MDTypography fontSize="30px" lineHeight={1}> {joinedCount} </MDTypography>
                                  <MDTypography fontSize="15px" lineHeight={1}>Friends Joined</MDTypography>
                              </MDBox>
                          </MDBox>
                      </Grid>

                      <Grid items xs={12} md={6} lg={4}>
                          <MDBox
                              style={{
                                  backgroundColor: "white",
                                  margin: 4, height: 100,
                                  borderRadius: 8,
                                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                  fontFamily: "Proxima Nova",
                                  display: "flex",
                                  justifyContent: "center"
                              }}
                          >
                              <MDBox style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40%" }}>
                                  <CurrencyRupeeIcon color="info" fontSize="large" style={{ width: "80%", height: "80%" }} />
                              </MDBox>
                              <MDBox style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", width: "60%" }}>
                                  <MDTypography fontSize="30px" lineHeight={1}>{(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(earnings))}</MDTypography>
                                  <MDTypography fontSize="15px" lineHeight={1}>Earnings (Signup) in INR</MDTypography>
                              </MDBox>
                          </MDBox>
                      </Grid>
                  </Grid>
              </MDBox>

              <MDBox mt={1}>
              <Grid container >
                  <Grid items xs={12} md={6} lg={4}>
                      <MDBox
                          style={{
                              backgroundColor: "white",
                              margin: 4, height: 100,
                              borderRadius: 8,
                              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                              fontFamily: "Proxima Nova",
                              display: "flex",
                              justifyContent: "center"
                          }}
                      >
                          <MDBox style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40%" }}>
                              <PeopleAltIcon color="success" fontSize="large" style={{ width: "80%", height: "80%" }} />
                          </MDBox>
                          <MDBox style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", width: "60%" }}>
                              <MDTypography fontSize="30px" lineHeight={1}> {affiliateSummery?.count || 0} </MDTypography>
                              <MDTypography fontSize="15px" lineHeight={1}>Product Transactions</MDTypography>
                          </MDBox>
                      </MDBox>
                  </Grid>

                  <Grid items xs={12} md={6} lg={4}>
                      <MDBox
                          style={{
                              backgroundColor: "white",
                              margin: 4, height: 100,
                              borderRadius: 8,
                              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                              fontFamily: "Proxima Nova",
                              display: "flex",
                              justifyContent: "center"
                          }}
                      >
                          <MDBox style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40%" }}>
                              <CurrencyRupeeIcon color="info" fontSize="large" style={{ width: "80%", height: "80%" }} />
                          </MDBox>
                          <MDBox style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", width: "60%" }}>
                              <MDTypography fontSize="30px" lineHeight={1}>{affiliateSummery?.payout ? (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(affiliateSummery?.payout)) : 0}</MDTypography>
                              <MDTypography fontSize="15px" lineHeight={1}>Earnings (Product) in INR</MDTypography>
                          </MDBox>
                      </MDBox>
                  </Grid>

                  <Grid items xs={12} md={6} lg={4}>
                      <MDBox
                          style={{
                              backgroundColor: "white",
                              margin: 4, height: 100,
                              borderRadius: 8,
                              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                              fontFamily: "Proxima Nova",
                              display: "flex",
                              justifyContent: "center"
                          }}
                      >
                          <MDBox style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40%" }}>
                              < ViewStreamIcon color="success"  fontSize="large" style={{ width: "80%", height: "80%" }} />
                          </MDBox>
                          <MDBox style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", width: "60%" }}>
                              <MDTypography fontSize="30px" lineHeight={1}>{(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format((earnings || 0) + (affiliateSummery?.payout || 0)))}</MDTypography>
                              <MDTypography fontSize="15px" lineHeight={1}>Total Earnings in INR</MDTypography>
                          </MDBox>
                      </MDBox>
                  </Grid>
                  </Grid>
              </MDBox>

            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12} md={12} lg={12}>
                        <Card>
                            <MDBox
                                mx={2}
                                mt={-3}
                                py={1}
                                px={2}
                                variant="gradient"
                                bgColor="dark"
                                borderRadius="lg"
                                coloredShadow="dark"
                                sx={{
                                    display: 'flex',
                                    justifyContent: "space-between",
                                }}>
                                <MDTypography variant="h6" color="white" py={1}>
                                    Referral Leaderboard
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={2}>
                                <DataTable
                                    table={{ columns, rows }}
                                    isSorted={false}
                                    entriesPerPage={false}
                                    showTotalEntries={false}
                                    noEndBorder
                                />
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>

            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12} md={12} lg={12}>
                        <Card>
                            <MDBox
                                mx={2}
                                mt={-3}
                                py={1}
                                px={2}
                                variant="gradient"
                                bgColor="dark"
                                borderRadius="lg"
                                coloredShadow="dark"
                                sx={{
                                    display: 'flex',
                                    justifyContent: "space-between",
                                }}>
                                <MDTypography variant="h6" color="white" py={1}>
                                    Your friends who joined the platform
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={2}>
                                <DataTable
                                    table={{ columns : referralColumns, rows : referralRows }}
                                    isSorted={false}
                                    entriesPerPage={false}
                                    showTotalEntries={false}
                                    noEndBorder
                                />
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>


            <ReferredProduct setAffiliateSummery={setAffiliateSummery} />
            {renderSuccessSB}
        </MDBox>
    </>
  );
}

export default ReferralHomePage;
