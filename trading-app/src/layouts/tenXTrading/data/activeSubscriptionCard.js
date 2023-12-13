import { React, useState, useEffect, useContext } from "react";
import { userContext } from '../../../AuthContext';
import { useNavigate, useLocation } from "react-router-dom";
import ShareIcon from '@mui/icons-material/Share';
import ReactGA from "react-ga"

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDAvatar from "../../../components/MDAvatar";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import Button from '@mui/material/Button';
import { Grid } from '@mui/material';
import moment from 'moment'
import axios from "axios"; 


import TenXB from '../../../assets/images/TenXB.png'
import TenXI from '../../../assets/images/TenXI.png'
import TenXA from '../../../assets/images/TenXA.png'
import TenXS from '../../../assets/images/TenXS.png'
import TenXG from '../../../assets/images/TenXG.png'
import TenXD from '../../../assets/images/TenXD.png'
import checklist from '../../../assets/images/checklist.png'
import Dialogue from "../Header/dialogueBox";
import DialogueAnalytics from "../Header/dialogueBoxAnalytics";

function Header({ subscription, checkPayment, setCheckPayment, amount, name, id, walletCash, bonusCash, allowRenewal}) {
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [timeDifference, setTimeDifference] = useState([]);
    const getDetails = useContext(userContext);
    const navigate = useNavigate();
    console.log('allow renewal', allowRenewal, amount);
    const [userCount,setUserCount] = useState(0);
    let TenXIcon = TenXB

    useEffect(() => {
        ReactGA.pageview(window.location.pathname)
    }, []);

    if(subscription?.plan_name === 'TenX - Beginner Plan')
    {
        TenXIcon = TenXB
    }
    if(subscription?.plan_name === 'TenX - Intermediate Plan')
    {
        TenXIcon = TenXI
    }
    if(subscription?.plan_name === 'TenX - Advance Plan')
    {
        TenXIcon = TenXA
    }
    if(subscription?.plan_name === 'TenX - Silver Plan')
    {
        TenXIcon = TenXS
    }
    if(subscription?.plan_name === 'TenX - Gold Plan')
    {
        TenXIcon = TenXG
    }
    if(subscription?.plan_name === 'TenX - Diamond Plan')
    {
        TenXIcon = TenXD
    }

    useEffect(()=>{
  
        let call2 = axios.get(`${baseUrl}api/v1/tenX/subscribercount/${subscription?._id}`, {
          withCredentials:true
        })            
        Promise.all([call2])
        .then(([api2Response]) => {
          // Process the responses here
          console.log("Count:",api2Response.data.data)
          setUserCount(api2Response?.data?.data[0]?.count);
        })
        .catch((error) => {
          // Handle errors here
          console.error(error);
        });
    
    
      },[subscription])


    return (
        <>
        <Grid container spacing={0.5} xs={12} md={12} lg={12} display='flex' justifyContent='flex-start'>
              <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start'>
                  <MDBox 
                      style={{background: 'linear-gradient(to bottom, #FFFAF0 0%, #F0EBE1 100%)'}}
                      height='auto' 
                      minWidth='100%' 
                      borderRadius={5}
                  >
                      <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignItems='center'>
                          {/* <Grid item xs={12} md={12} lg={12} mt={1} display='flex' justifyContent='center'>
                              <img src={TenXIcon} width='75px' height='75px'/>
                          </Grid> */}
                          <Grid item xs={12} md={12} lg={12} mt={1} display='flex' justifyContent='center'>
                              <MDTypography 
                                  color='dark' 
                                  fontWeight='bold' 
                                  fontSize={13} 
                                  textAlign='center'
                                  style={{padding:'2px 4px 2px 4px', borderRadius:5}}
                              >
                                  {subscription?.plan_name}
                                  {/* TenX Beginner - 20 Trading Days */}
                              </MDTypography>
                          </Grid>
  
                          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{minWidth:'100%'}}>
                              <MDBox display='flex' justifyContent='center' flexDirection='column' style={{minWidth:'100%'}}>
                                  {/* <MDBox display='flex' justifyContent='center' style={{minWidth:'100%'}}>
                                      <MDTypography 
                                          fontSize={10} 
                                          fontWeight='bold'
                                          color='dark'
                                          sx={{background:'linear-gradient(110.8deg, rgb(86, 238, 225) 11.4%, rgb(176, 255, 39) 84.5%)',padding:'2px 6px 2px 6px', borderRadius:2}}
                                      >
                                          Subscription Price: ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(subscription?.discounted_price)}
                                      </MDTypography>
                                  </MDBox> */}
                                  <MDBox mt={0.5} display='flex' justifyContent='center'>
                                      <MDTypography 
                                          fontSize={12} 
                                          fontWeight='bold'
                                          color='light'
                                          sx={{background:'linear-gradient(195deg, #49a3f1, #1A73E8)',padding:'2px 6px 2px 6px', borderRadius:2}}
                                      >
                                           Subscription: ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(subscription?.fee)}
                                      </MDTypography>
                                  </MDBox>
                              </MDBox>
                          </Grid>
  
                          <Grid item xs={12} md={12} lg={12} mt={0.5} display='flex' justifyContent='center'>
                              <MDBox display='flex' justifyContent='center' flexDirection='column'>
                              {subscription?.features?.map((e)=>{
                                  console.log(e?.description)
                                  return(
                                  <MDBox mt={0.5} display='flex' justifyContent='flex-start' alignItems='center'>
                                     <MDBox mr={0.5} display='flex' justifyContent='center'>
                                      <MDAvatar 
                                              src={checklist} 
                                              sx={{ width: '10px', height: '8px' }}
                                          />
                                      </MDBox>
                                      <MDBox display='flex' justifyContent='center'>
                                          <MDTypography color='dark' fontSize="9px" fontWeight='bold'>{e?.description}</MDTypography>
                                      </MDBox>
                                  </MDBox>
                                  )
                              })}
                              </MDBox>
                          </Grid>
                          <Grid item xs={12} md={12} lg={12} mt={1.5} mb={1} display='flex' justifyContent='center' style={{width:'100%'}}>
                            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                                <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='center'>
                                    <MDTypography fontSize={10} fontWeight='bold'>{moment.utc(subscription?.subscribedOn).utcOffset('+05:30').format("DD-MMM-YY hh:mm a")}</MDTypography>
                                </Grid>
                                <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='center'>
                                    <MDTypography fontSize={10} fontWeight='bold'>{moment.utc(subscription?.subscribedOn).utcOffset('+05:30').add(subscription?.expiryDays-1, 'days').hours(16).minutes(0).format("DD-MMM-YY hh:mm a")}</MDTypography>
                                </Grid>
                            </Grid>
                        </Grid>    
                          <Grid item xs={12} md={12} lg={12} mt={1} mb={1} display='flex' justifyContent='center' alignItems='center' alignContent='center' style={{width:'100%'}}>
                              <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' alignContent='center' style={{width:'100%'}}>
                              {/* <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' alignContent='center' style={{width:'100%'}}>
                                <DialogueAnalytics subscription={subscription} isActive={true} />
                              </Grid> */}
                              <Grid item xs={12} md={12} lg={12} mt={.5} display='flex' justifyContent='center' alignItems='center' alignContent='center' style={{width:'100%'}}>
                                  {/* <MDButton varaint='contained' color='error' size="small" style={{fontSize:'8px',width:'88%', padding:2}} onClick={captureTutorialViews}>Watch Tutorial Video</MDButton> */}
                                  <Dialogue subscription={subscription} checkPayment={checkPayment} setCheckPayment={setCheckPayment} amount={amount} name={name} id={id} walletCash={walletCash} bonusCash={bonusCash} allowRenewal={allowRenewal} />   
                              </Grid>
                              <Grid item xs={12} md={12} lg={12} mt={1} display='flex' justifyContent='center' alignItems='center' alignContent='center' style={{width:'100%'}}>
                                  {/* <ActiveDialogue subscription={subscription} checkPayment={checkPayment} setCheckPayment={setCheckPayment} amount={amount} name={name} id={id} walletCash={walletCash} bonusCash={bonusCash} allowRenewal={allowRenewal} /> */}
                              </Grid>
                              </Grid>
                          </Grid>
                          
                          <Grid item xs={12} md={12} lg={12} mb={2} display='flex' justifyContent='center' alignItems='center' alignContent='center' style={{width:'100%'}}>
                              <MDTypography fontSize={8} fontWeight='bold'>{55 + userCount} Traders have already purchased this subscription</MDTypography>
                          </Grid>
                      </Grid>   
                  </MDBox>
              </Grid>
        </Grid>
        </>
    );
}

export default Header;


{/* <>
      <Grid container spacing={0.5} xs={12} md={12} lg={12} display='flex' justifyContent='flex-start'>
            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start'>
                <MDBox 
                    style={{background: 'linear-gradient(to bottom, #FFFAF0 0%, #F0EBE1 100%)'}}
                    height='auto' 
                    minWidth='100%' 
                    borderRadius={5}
                >
                    <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='flex-start'>
                        <Grid item xs={12} md={12} lg={12} mt={1} display='flex' justifyContent='center'>
                            <img src={TenXIcon} width='75px' height='75px'/>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                            <MDTypography 
                                color='dark' 
                                fontWeight='bold' 
                                fontSize={15} 
                                textAlign='center'
                                style={{padding:'2px 4px 2px 4px', borderRadius:5}}
                            >
                                {subscription?.plan_name}
                            </MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12} mt={0.5} display='flex' justifyContent='center'>
                            <MDBox display='flex' justifyContent='center' flexDirection='column'>
                                <MDBox display='flex' justifyContent='center'>
                                    <MDTypography 
                                        fontSize={15} 
                                        fontWeight='bold'
                                        color='light'
                                        sx={{background:'linear-gradient(195deg, #49a3f1, #1A73E8)',padding:'2px 6px 2px 6px', borderRadius:2}}
                                    >
                                        Subscription: ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(subscription?.fee)}
                                    </MDTypography>
                                </MDBox>
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12} mt={1} display='flex' justifyContent='center'>
                            <MDBox display='flex' justifyContent='center' flexDirection='column'>
                            {subscription?.features?.map((e)=>{
                                console.log(e?.description)
                                return(
                                <MDBox mt={0.1} display='flex' justifyContent='flex-start' alignItems='center'>
                                   <MDBox mr={1} display='flex' justifyContent='center'>
                                    <MDAvatar 
                                            src={checklist} 
                                            size="xs" 
                                        />
                                    </MDBox>
                                    <MDBox display='flex' justifyContent='center'>
                                        <MDTypography color='dark' fontSize={12} fontWeight='bold'>{e?.description}</MDTypography>
                                    </MDBox>
                                </MDBox>
                                )
                            })}
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12} mt={1.5} mb={1} display='flex' justifyContent='center' style={{width:'100%'}}>
                            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                                <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='center'>
                                    <MDTypography fontSize={12} fontWeight='bold'>{moment.utc(subscription?.subscribedOn).utcOffset('+05:30').format("DD-MMM-YY hh:mm a")}</MDTypography>
                                </Grid>
                                <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='center'>
                                    <MDTypography fontSize={12} fontWeight='bold'>{moment.utc(subscription?.subscribedOn).utcOffset('+05:30').add(subscription?.expiryDays, 'days').hours(19).minutes(0).format("DD-MMM-YY hh:mm a")}</MDTypography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12} mt={1} mb={1} display='flex' justifyContent='center' alignItems='center' alignContent='center' style={{width:'100%'}}>
                            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' alignContent='center' style={{width:'100%'}}>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
                                <DialogueAnalytics subscription={subscription} checkPayment={checkPayment} setCheckPayment={setCheckPayment} amount={amount} name={name} id={id} walletCash={walletCash} allowRenewal={allowRenewal} />
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' alignContent='center' style={{width:'100%'}}>
                                <Dialogue subscription={subscription} checkPayment={checkPayment} setCheckPayment={setCheckPayment} amount={amount} name={name} id={id} walletCash={walletCash} bonusCash={bonusCash} allowRenewal={allowRenewal} />
                            </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12} mb={2} display='flex' justifyContent='center' alignItems='center' alignContent='center' style={{width:'100%'}}>
                            <MDTypography fontSize={10} fontWeight='bold'>{55 + userCount} Traders have already purchased this subscription</MDTypography>
                        </Grid>
                    </Grid>   
                </MDBox>
            </Grid>
      </Grid>
      </> */}