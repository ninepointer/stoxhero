import React,{useState, useEffect, memo, useMemo, useCallback, useRef, useContext} from 'react'
import MDBox from '../../../../components/MDBox'
import Grid from '@mui/material/Grid'
import ReactGA from "react-ga"
import MDTypography from '../../../../components/MDTypography'
import { Divider } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import MDAvatar from "../../../../components/MDAvatar";
import FastRewindIcon from '@mui/icons-material/FastRewind';
import Button from '@mui/material/Button'
import { userContext } from '../../../../AuthContext';
import winnerCup from "../../../../assets/images/winnerImage.jpg"
import loose from "../../../../assets/images/lost.jpg"
import { CircularProgress } from "@mui/material";
import { NetPnlContext } from "../../../../PnlContext";
import DefaultProfilePic from "../../../../assets/images/default-profile.png";




function BattleResultPage () {
    const getDetails = useContext(userContext);
    const [myRank, setMyRankProps] = useState([]);
    // const [myPnl, setMyPnl] = useState([]);
    const location = useLocation();
    const battleId = location?.state?.battleId;
    const nevigate = useNavigate();
    const [isLoading,setIsLoading] = useState(true)
    const [battleData, setBattle] = useState([]);
    const pnl = useContext(NetPnlContext);

    useEffect(() => {
        ReactGA.pageview(window.location.pathname)
      }, []);
      
    let style = {
      textAlign: "center", 
      fontSize: ".99rem", 
      color: "#003366", 
      backgroundColor: "white", 
      borderRadius: "5px", 
      padding: "5px",  
      fontWeight: "600",
      display: "flex", 
      alignItems: "center"
    }

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

    React.useEffect(()=>{
      
      axios.get(`${baseUrl}api/v1/battles/${battleId}/user`, {withCredentials: true})
      .then((res)=>{
            setBattle(res?.data?.data);
            // console.log("data is", res?.data?.data)
            setIsLoading(false)
      }).catch((err)=>{
          return new Error(err);
      })

    },[])


    const xFactor = battleData?.battleTemplate?.portfolioValue / battleData?.battleTemplate?.entryFee;
    const reward = battleData?.battleTemplate?.entryFee + (pnl?.netPnl)/xFactor;
   
    return (
        <>
            {isLoading ?
                <Grid mt={1} mb={1} display="flex" width="100%" justifyContent="center" alignItems="center">
                    <CircularProgress color="light" />
                </Grid>

                :
                <MDBox key={battleData?._id} width="100%" bgColor="dark" color="light" p={2}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6} lg={1} mb={2}>
                            <MDBox display="flex" alignItems="center" gap={"130px"} mt={1.3} >
                                <Button color="light" style={{ border: "1px solid white", borderRadius: "7px" }} onClick={() => { nevigate('/battles') }}>< FastRewindIcon /></Button>
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={6} lg={11} mb={2}>
                            <MDTypography style={style} mt={1.5} color="light" display="flex" justifyContent="center">
                                {`${battleData?.battleName} has Ended`}
                            </MDTypography>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6} lg={6} >
                            <MDBox color="light" >
                                {pnl?.netPnl >= 0 ?
                                    <div style={{ position: 'relative' }}>
                                        <img style={{ marginTop: '10px', maxWidth: '100%', height: 'auto', borderRadius: '5px', display: 'block' }} src={winnerCup} />
                                        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translate(-50%, -50%)', color: '#ffffff', textAlign: 'center', width: '100%', maxWidth: '600px' }}>
                                            <MDTypography mt={5} style={{ fontWeight: 700, fontSize: "15px" }} color="dark" display="flex" justifyContent="center">
                                                {`Congratulations ${getDetails?.userDetails?.first_name} ${getDetails?.userDetails?.last_name}`}
                                            </MDTypography>
                                            <MDTypography mt={2} style={{ fontWeight: 600, fontSize: "13px" }} color="dark" display="flex" justifyContent="center">
                                                {reward ? `You have won ₹${reward.toFixed(2)}` : "Please wait while your return is loading"}
                                            </MDTypography>
                                            <MDTypography mt={2} style={{ fontWeight: 700 }} color="dark" display="flex" justifyContent="center">
                                                {/* {`${myReward[0]?.reward} ${myReward[0]?.currency}`} */}
                                            </MDTypography>
                                        </div>
                                    </div>
                                    :
                                    <div style={{ position: 'relative' }}>
                                        <img style={{ marginTop: '10px', maxWidth: '100%', height: 'auto', borderRadius: '5px', display: 'block' }} src={loose} />
                                    </div>
                                }
                            </MDBox>
                        </Grid>

                        <Grid item xs={0} md={0} lg={0.5}>
                            <Divider orientation="vertical" style={{ backgroundColor: 'white', height: '100%' }} />
                        </Grid>

                        <Grid item xs={12} md={6} lg={5.5} mb={2}>
                            <MDBox color="light" >
                                <MDBox color="light" mt={0} mb={0} borderRadius={10} minHeight='auto'>
                                    <MDBox display='flex' p={0} borderRadius={10} mt={5}>
                                        <MDBox width='100%' minHeight='auto' display='flex' justifyContent='center'>

                                            <Grid container spacing={0.5} xs={12} md={12} lg={12}>

                                                <Grid item xs={12} lg={12} mt={2}>

                                                    <Grid item xs={12} lg={12}>

                                                        {/* <Grid item xs={12} md={6} lg={12} display='flex' justifyContent='center' alignItems='center'>


                                                            <Grid item xs={12} lg={2} display='flex' justifyContent='center' alignItems='center'>
                                                                <MDAvatar
                                                                    src={logo}
                                                                    alt="Profile"
                                                                    size="sm"
                                                                    sx={({ borders: { borderWidth }, palette: { white } }) => ({
                                                                        border: `${borderWidth[2]} solid ${white.main}`,
                                                                        cursor: "pointer",
                                                                        position: "relative",
                                                                        ml: 0,

                                                                        "&:hover, &:focus": {
                                                                            zIndex: "10",
                                                                        },
                                                                    })}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} lg={6} display='flex' justifyContent='left' alignItems='center'>
                                                                <MDTypography fontSize={15} color='light' fontWeight='bold'>My Rank</MDTypography>
                                                            </Grid>
                                                            <Grid item xs={12} lg={4} display='flex' justifyContent='right' alignItems='center'>
                                                                <MDBox><MDTypography fontSize={15} color='light' fontWeight='bold' style={{ cursor: 'pointer' }}><MDButton variant='text' size='small'><TwitterIcon /></MDButton></MDTypography></MDBox>
                                                                <MDBox><MDTypography fontSize={15} color='light' fontWeight='bold' style={{ cursor: 'pointer' }}><MDButton variant='text' size='small'><FacebookIcon /></MDButton></MDTypography></MDBox>
                                                                <MDBox><MDTypography fontSize={15} color='light' fontWeight='bold' style={{ cursor: 'pointer' }}><MDButton variant='text' size='small'><WhatsAppIcon /></MDButton></MDTypography></MDBox>
                                                            </Grid>

                                                        </Grid> */}

                                                        <Divider style={{ backgroundColor: 'white' }} />
                                                    </Grid>

                                                </Grid>

                                              
                                                    <>
                                                        {/* <Grid item xs={12} lg={12} mt={5}>

                                                            <Grid item xs={12} lg={12}>
                                                                <Grid item xs={12} md={6} lg={12} display='flex' justifyContent='center' alignItems='center'>
                                                                    <Grid item xs={12} lg={2} display='flex' justifyContent='center' alignItems='center'>
                                                                        <MDTypography fontSize={25} color='light' fontWeight='bold'>#{myRank}</MDTypography>
                                                                    </Grid>
                                                                </Grid>
                                                                <Divider style={{ backgroundColor: 'white' }} />
                                                            </Grid>

                                                        </Grid> */}

                                                        <Grid item xs={12} lg={12}>

                                                            <Grid item xs={12} lg={12} display='flex' justifyContent='center'>
                                                                <Grid item xs={12} md={6} lg={12} display='flex' justifyContent='center' alignItems='center'>
                                                                    <Grid item xs={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                                                                        <MDAvatar
                                                                            src={getDetails?.userDetails?.profilePhoto?.url ? getDetails?.userDetails?.profilePhoto?.url : DefaultProfilePic}
                                                                            alt="Profile"
                                                                            size="sm"
                                                                            sx={({ borders: { borderWidth }, palette: { white } }) => ({
                                                                                border: `${borderWidth[2]} solid ${white.main}`,
                                                                                cursor: "pointer",
                                                                                position: "relative",
                                                                                ml: 0,

                                                                                "&:hover, &:focus": {
                                                                                    zIndex: "10",
                                                                                },
                                                                            })}
                                                                        />
                                                                        <MDBox ml={1}><MDTypography fontSize={20} color='light' fontWeight='bold'>{getDetails?.userDetails?.first_name + " " + getDetails?.userDetails?.last_name}</MDTypography></MDBox>
                                                                    </Grid>
                                                                </Grid>
                                                                <Divider style={{ backgroundColor: 'white' }} />
                                                            </Grid>
                                                            <Divider style={{ backgroundColor: 'white' }} />
                                                        </Grid>

                                                        <Grid item xs={12} lg={12} mt={-1} mb={1.5} display='flex' justifyContent='center' alignItems='center'>

                                                            <Grid item xs={12} lg={12} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                                                                <Grid item xs={12} md={6} lg={12} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                                                                    <Grid item xs={12} lg={12} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                                                                        <MDTypography fontSize={20} color='light' fontWeight='bold'>Net P&L: {((pnl?.netPnl)) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format((pnl?.netPnl))) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-(pnl?.netPnl)))}</MDTypography>
                                                                    </Grid>
                                                                </Grid>
                                                                <Divider style={{ backgroundColor: 'white' }} />
                                                                <Grid item xs={12} md={6} lg={12} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                                                                    <Grid item xs={12} lg={12} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                                                                        <MDTypography fontSize={20} color='light' fontWeight='bold'>Return: {(reward) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(reward)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-reward))}</MDTypography>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>

                                                        </Grid>
                                                    </>


                                            </Grid>

                                        </MDBox>
                                    </MDBox>
                                </MDBox>
                            </MDBox>
                        </Grid>
                    </Grid>
                </MDBox>
            }
        </>
    )

}
export default memo(BattleResultPage);

