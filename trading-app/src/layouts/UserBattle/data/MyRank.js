import { React, useState, useEffect, useContext, useCallback, useMemo } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import moment from 'moment'
import ReactGA from "react-ga"


// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";

// Material Dashboard 2 React base styles

// Images
import MDButton from "../../../components/MDButton";
import MDAvatar from "../../../components/MDAvatar";
import MDTypography from "../../../components/MDTypography";
import AMargin from '../../../assets/images/amargin.png'
import logo from '../../../assets/images/logo1.jpeg'
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { CircularProgress, Divider } from "@mui/material";
import DefaultProfilePic from "../../../assets/images/default-profile.png";
import { userContext } from "../../../AuthContext";
import { NetPnlContext } from "../../../PnlContext";



function MyRank({socket}) {

    const [myRank, setMyRankData] = useState();
    const getDetails = useContext(userContext);
    const pnl = useContext(NetPnlContext);
    const [loading, setIsLoading] = useState(true);

    useEffect(()=>{
        socket?.on(`battle-myrank${getDetails.userDetails?._id}`, (data) => {

            console.log("leaderboard rank", data)
            setMyRankData((prev) => (data !== null ? data : prev));
            setIsLoading(false);
    
        })
    
      }, [])

    return (
        <>

            {loading ?
                <MDBox display="flex" justifyContent="center" alignItems="center">
                    <MDBox display="flex" justifyContent="center" alignItems="center"><MDTypography fontSize={15} fontWeight='bold' color='black'>Loading Your Rank</MDTypography></MDBox>
                    <MDBox ml={1} display="flex" justifyContent="center" alignItems="center"><CircularProgress color="black" /></MDBox>
                </MDBox>
                :
                <MDBox color="black" mt={0} mb={0} borderRadius={10} minHeight='auto'>
                    <MDBox display='flex' p={0} borderRadius={10}>
                        <MDBox width='100%' minHeight='auto' display='flex' justifyContent='center'>

                            <Grid container spacing={0.5} xs={12} md={12} lg={12}>

                                <Grid item xs={12} lg={12} mt={2}>

                                    <Grid item xs={12} lg={12}>

                                        <Grid item xs={12} md={6} lg={12} display='flex' justifyContent='center' alignItems='center'>


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
                                                <MDTypography fontSize={15} color='black' fontWeight='bold'>My Rank</MDTypography>
                                            </Grid>
                                            <Grid item xs={12} lg={4} display='flex' justifyContent='right' alignItems='center' gap={1} mr={1}>
                                                <MDBox><MDTypography fontSize={15} color='#000000' backgroundColor='#000000' fontWeight='bold' style={{ cursor: 'pointer', borderRadius: "5px" }}><MDButton variant='text' size='small'><TwitterIcon /></MDButton></MDTypography></MDBox>
                                                <MDBox><MDTypography fontSize={15} color='#000000' backgroundColor='#000000' fontWeight='bold' style={{ cursor: 'pointer', borderRadius: "5px" }}><MDButton variant='text' size='small'><FacebookIcon /></MDButton></MDTypography></MDBox>
                                                <MDBox><MDTypography fontSize={15} color='#000000' backgroundColor='#000000' fontWeight='bold' style={{ cursor: 'pointer', borderRadius: "5px" }}><MDButton variant='text' size='small'><WhatsAppIcon /></MDButton></MDTypography></MDBox>
                                            </Grid>

                                        </Grid>

                                        <Divider style={{ backgroundColor: 'white' }} />
                                    </Grid>

                                </Grid>

                                {myRank !== null ?
                                    <>
                                        <Grid item xs={12} lg={12}>

                                            <Grid item xs={12} lg={12}>
                                                <Grid item xs={12} md={6} lg={12} display='flex' justifyContent='center' alignItems='center'>
                                                    <Grid item xs={12} lg={2} display='flex' justifyContent='center' alignItems='center'>
                                                        <MDTypography fontSize={25} color='black' fontWeight='bold'>#{myRank}</MDTypography>
                                                    </Grid>
                                                </Grid>
                                                <Divider style={{ backgroundColor: 'white' }} />
                                            </Grid>

                                        </Grid>

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
                                                        <MDBox ml={1}><MDTypography fontSize={20} color='black' fontWeight='bold'>{getDetails?.userDetails?.first_name + " " + getDetails?.userDetails?.last_name}</MDTypography></MDBox>
                                                    </Grid>
                                                    {/* <Grid item xs={12} lg={8} ml={1} display='flex' justifyContent='center'>
                                                <MDTypography fontSize={20} color='black' fontWeight='bold'>{getDetails?.userDetails?.first_name + " " + getDetails?.userDetails?.last_name}</MDTypography>
                                            </Grid> */}
                                                </Grid>
                                                <Divider style={{ backgroundColor: 'white' }} />
                                            </Grid>
                                            <Divider style={{ backgroundColor: 'white' }} />
                                        </Grid>

                                        <Grid item xs={12} lg={12} mt={-1} mb={1.5} display='flex' justifyContent='center' alignItems='center'>

                                            <Grid item xs={12} lg={12} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                                                <Grid item xs={12} md={6} lg={12} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                                                    <Grid item xs={12} lg={12} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                                                        <MDTypography fontSize={25} color='black' fontWeight='bold'>Net P&L: {(pnl?.netPnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(pnl?.netPnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-pnl?.netPnl))}</MDTypography>
                                                    </Grid>
                                                </Grid>
                                                {/* <Divider style={{backgroundColor:'white'}}/> */}
                                            </Grid>

                                        </Grid>
                                    </>
                                    :

                                    <Grid item xs={12} md={6} lg={12} display='flex' justifyContent='center'>
                                        <MDBox mb={2}><MDTypography fontSize={15} color='black' fontWeight='bold' style={{ cursor: 'pointer' }}>Your ranking will be displayed here.</MDTypography></MDBox>
                                    </Grid>

                                }

                            </Grid>

                        </MDBox>
                    </MDBox>
                </MDBox>
            }
        </>
    );
}

export default MyRank;