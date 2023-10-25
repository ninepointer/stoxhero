import { React, useState, useEffect, useContext, useCallback, useMemo } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import moment from 'moment'
// import ReactGA from "react-ga"


// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";

// Material Dashboard 2 React base styles

// Images
// import MDButton from "../../../components/MDButton";
import MDAvatar from "../../../components/MDAvatar";
import MDTypography from "../../../components/MDTypography";
// import AMargin from '../../../assets/images/amargin.png'
// import logo from '../../../assets/images/logo1.jpeg'
// import TwitterIcon from '@mui/icons-material/Twitter';
// import FacebookIcon from '@mui/icons-material/Facebook';
// import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { CircularProgress, Divider } from "@mui/material";
import DefaultProfilePic from "../../../assets/images/default-profile.png";
import { userContext } from "../../../AuthContext";
import { NetPnlContext } from "../../../PnlContext";
// import axios from "axios";


function MyRank({ socket, id, data}) {

    const [myRank, setMyRankData] = useState();
    const getDetails = useContext(userContext);
    const pnl = useContext(NetPnlContext);
    const [loading, setIsLoading] = useState(true);
    // const [reward, setReward] = useState([]);
    // let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"


    // useEffect(() => {
    //     axios.get(`${baseUrl}api/v1/battles/prizedetail/${id}`,{
    //       withCredentials: true,
    //       headers: {
    //           Accept: "application/json",
    //           "Content-Type": "application/json",
    //           "Access-Control-Allow-Credentials": true
    //       }}
    //       ).then((res)=>{
    //         setReward(res.data.data?.prizeDistribution);
    //       })
          
    //   }, []);

    useEffect(() => {
        socket?.on(`contest-myrank${getDetails.userDetails?._id}${id}`, (data) => {

            console.log("leaderboard rank", data)
            setMyRankData((prev) => (data !== null ? data : prev));
            setIsLoading(false);

        })

    }, [])

    let myReward = pnl?.netPnl*data?.allData?.payoutPercentage/100>0?pnl?.netPnl*data?.allData?.payoutPercentage/100:0;
    

    console.log("myRank", myRank, myReward)

    return (
        <>

            {loading ?
                <MDBox display="flex" justifyContent="center" flexDirection='column' alignItems="center">
                    <MDBox ml={1} display="flex" justifyContent="center" alignItems="center"><CircularProgress color="black" /></MDBox>
                    <MDBox display="flex" justifyContent="center" alignItems="center"><MDTypography fontSize={15} fontWeight='bold' color='black'>Loading Your Rank</MDTypography></MDBox>
                </MDBox>
                :
                <MDBox color="black" mt={0} mb={0} borderRadius={10} minHeight='auto'>
                    <MDBox display='flex' p={0} borderRadius={10}>
                        <MDBox width='100%' minHeight='auto' display='flex' justifyContent='center'>

                            <Grid container spacing={0.5} xs={12} md={12} lg={12}>


                                {myRank ?
                                    <>
                                        <Grid item xs={12} lg={12} display={"flex"} justifyContent='center' alignItems='center'>
                                            <Grid item xs={12} lg={4}>

                                                <Grid item xs={12} lg={12}>
                                                    <Grid item xs={12} md={6} lg={12} display='flex' justifyContent='center' alignItems='center'>
                                                        <Grid item xs={12} lg={2} display='flex' justifyContent='center' alignItems='center'>
                                                            <MDTypography fontSize={25} color='black' fontWeight='bold'>#{myRank}</MDTypography>
                                                        </Grid>
                                                    </Grid>
                                                    {/* <Divider style={{ backgroundColor: 'white' }} /> */}
                                                </Grid>

                                            </Grid>

                                            <Grid item xs={12} lg={4}>

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
                                                        </Grid>                                                </Grid>
                                                    {/* <Divider style={{ backgroundColor: 'white' }} /> */}
                                                </Grid>
                                                {/* <Divider style={{ backgroundColor: 'white' }} /> */}
                                            </Grid>

                                            <Grid item xs={12} lg={4}  display='flex' justifyContent='center' alignItems='center'>

                                                <Grid item xs={12} lg={12} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                                                    <Grid item xs={12} md={6} lg={12} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                                                        <Grid item xs={12} lg={12} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                                                            <MDTypography fontSize={25} color='black' fontWeight='bold'>Reward: {(myReward) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(myReward)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(-myReward))}</MDTypography>
                                                        </Grid>
                                                    </Grid>
                                                    {/* <Divider style={{backgroundColor:'white'}}/> */}
                                                </Grid>

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