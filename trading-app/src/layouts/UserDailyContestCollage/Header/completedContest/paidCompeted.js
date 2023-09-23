import { React, useState, useEffect, useContext } from "react";
import axios from "axios";
// @mui material components
import Grid from "@mui/material/Grid";
import MDBox from "../../../../components/MDBox";
import MDButton from "../../../../components/MDButton";
import MDTypography from "../../../../components/MDTypography";
import MDSnackbar from "../../../../components/MDSnackbar";
import WinnerImage from '../../../../assets/images/cup-image.png'
import { Link, useNavigate } from "react-router-dom";
import DownloadIcon from '@mui/icons-material/Download';



function Header({ contest }) {
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [serverTime, setServerTime] = useState();
    const [loading, setIsLoading] = useState(true);
    let [pnlData, setPnlData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (serverTime) {
            setTimeout(() => {
                setIsLoading(false)
            }, 1000)
        }
    }, [serverTime])

    useEffect(() => {
        axios.get(`${baseUrl}api/v1/servertime`)
            .then((res) => {
                setServerTime(res.data.data);
            })

        axios.get(`${baseUrl}api/v1/dailycontest/trade/allcontestPnl`, {
            withCredentials: true,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            }
        })
            .then((res) => {
                setPnlData(res.data.data);
            }).catch((err) => {
                return new Error(err);
            })
    }, [])
    const handleDownload = async (id) => {
        try {
          const response = await axios.get(`${baseUrl}api/v1/dailycontest/download/${id}`, {
            responseType: 'blob',
            withCredentials: true
          });
            console.log(response.data);
            console.log(response.data.size, response.data.type);
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'certificate.pdf');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);  
          // const blob = new Blob([response.data], { type: 'application/pdf' });
          // const url = window.URL.createObjectURL(blob);
          // const link = document.createElement('a');
          // link.href = url;
          // link.setAttribute('download', 'certificate.pdf');
          // document.body.appendChild(link);
          // link.click();
      } catch (error) {
          console.error('Error generating certificate:', error);
      }
      }
    function changeDateFormat(givenDate) {

        const date = new Date(givenDate);

        // Convert the date to IST
        date.setHours(date.getHours());
        date.setMinutes(date.getMinutes());

        // Format the date as "dd Month yyyy | hh:mm AM/PM"
        const formattedDate = `${date.getDate()} ${getMonthName(date.getMonth())} ${date.getFullYear()} | ${formatTime(date.getHours(), date.getMinutes())}`;

        // console.log(formattedDate);

        // Helper function to get the month name
        function getMonthName(month) {
            const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            return monthNames[month];
        }

        // Helper function to format time as "hh:mm AM/PM"
        function formatTime(hours, minutes) {
            const meridiem = hours >= 12 ? "PM" : "AM";
            const formattedHours = hours % 12 || 12;
            const formattedMinutes = minutes.toString().padStart(2, "0");
            return `${formattedHours}:${formattedMinutes} ${meridiem}`;
        }

        return formattedDate;

    }



    async function handleNavigate(id, name) {

        axios.get(`${baseUrl}api/v1/dailycontest/trade/${id}/my/todayorders`, {
            withCredentials: true,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            }
        })
            .then((res) => {
                if (res.data.count > 0) {
                    navigate(`/completedcollegecontests/${name}`, {
                        state: { data: id }
                    });
                } else {
                    openSuccessSB("error", "You dont have any trade for this contest.")
                }
            }).catch((err) => {
                return new Error(err);
            })
    }

    const [messageObj, setMessageObj] = useState({
        color: '',
        icon: '',
        title: '',
        content: ''
    })

    const [successSB, setSuccessSB] = useState(false);
    const openSuccessSB = (value, content) => {
        if (value === "error") {
            messageObj.color = 'error'
            messageObj.icon = 'error'
            messageObj.title = "Error";
            messageObj.content = content;
        };

        setMessageObj(messageObj);
        setSuccessSB(true);
    }
    const closeSuccessSB = () => setSuccessSB(false);

    const renderSuccessSB = (
        <MDSnackbar
            color={messageObj.color}
            icon={messageObj.icon}
            title={messageObj.title}
            content={messageObj.content}
            open={successSB}
            onClose={closeSuccessSB}
            close={closeSuccessSB}
            bgWhite="info"
            sx={{ borderLeft: `10px solid ${messageObj.icon == 'check' ? "green" : "red"}`, borderRight: `10px solid ${messageObj.icon == 'check' ? "green" : "red"}`, borderRadius: "15px", width: "auto" }}
        />
    );

    return (
        <>
            <MDBox>
                <>
                    {/* <MDTypography color="light" fontWeight="bold" >Premium Contest(s)</MDTypography> */}

                    <MDBox display='flex' justifyContent='center' alignItems='center'>
                        <Grid container xs={12} md={12} lg={12}>
                            {
                                contest.map((elem) => {
                                    if (elem?.entryFee !== 0) {
                                        let contestOn = [];
                                        if (elem.isNifty) {
                                            contestOn.push("NIFTY")
                                        }
                                        if (elem.isBankNifty) {
                                            contestOn.push("BANKNIFTY")
                                        }
                                        if (elem.isFinNifty) {
                                            contestOn.push("FINNIFTY")
                                        }
                                        if (elem.isAllIndex) {
                                            contestOn = ['NIFTY', 'BANKNIFTY', 'FINNIFTY']
                                        }

                                        contestOn.push(elem.contestExpiry.toUpperCase());

                                        const pnl = pnlData.filter((subelem) => {
                                            return subelem?.contestId?.toString() === elem?._id?.toString()
                                        })
                                        if (pnl[0]?.contestId) {
                                            return (
                                                <>
                                                    {/* <MDTypography color="light" fontWeight="bold" >Premium Contest(s)</MDTypography> */}
                                                    <Grid py={1} px={1} item xs={12} md={12} lg={6} borderRadius={3}>
                                                        <MDButton variant="contained" style={{ backgroundColor: "#252525" }} color={"#252525"} size="small">
                                                            <Grid container display='flex' justifyContent='space-between' alignItems='center'>
                                                                <Grid item xs={3} md={3} lg={3} display='flex' justifyContent='flex-start' alignItems='center'>
                                                                    <img src={WinnerImage} width='40px' height='40px' />
                                                                </Grid>
                                                                <Grid item xs={9} md={9} lg={9} display='flex' justifyContent='flex-end' alignItems='center'>
                                                                    <MDBox display='flex' justifyContent='flex-start' flexDirection='column'>
                                                                        <MDBox display='flex' justifyContent='flex-start' flexDirection='column'>
                                                                            <MDBox display='flex' justifyContent='flex-start'><MDTypography fontSize={15} fontWeight='bold' sx={{ color: "#DBB670" }}>{elem.contestName}</MDTypography></MDBox>
                                                                        </MDBox>
                                                                        <MDBox display='flex' justifyContent='flex-start' flexDirection='row' alignItems='center'>
                                                                            <MDBox mr={1} display='flex' justifyContent='flex-start'><MDTypography fontSize={10} sx={{ color: "#DBB670" }}>{changeDateFormat(elem.contestStartTime)}</MDTypography></MDBox>
                                                                            <MDBox mr={1} display='flex' justifyContent='flex-start'><MDTypography fontSize={10} sx={{ color: "#DBB670" }}>{changeDateFormat(elem.contestEndTime)}</MDTypography></MDBox>
                                                                            {
                                                                                contestOn.map((elem, index) => {
                                                                                    return (
                                                                                        <MDBox key={elem}>
                                                                                            <MDBox mr={1} display='flex' justifyContent='flex-start' alignItems='center'><MDTypography fontSize={10} style={{ backgroundColor: (contestOn?.length - 1 === index) ? "#4169E1" : '#fb8c00', padding: '1px 1px 0px 1px', border: (contestOn?.length - 1 === index) ? "1px solid #4169E1" : '1px solid #fb8c00', borderRadius: '2px', alignItems: 'center' }} fontWeight='bold' color='light'>{elem}</MDTypography></MDBox>
                                                                                        </MDBox>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </MDBox>
                                                                    </MDBox>
                                                                </Grid>

                                                                <Grid item mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                                                                    <MDBox display='flex' justifyContent='flex-start' flexDirection='column'>
                                                                        <MDBox display='flex' justifyContent='flex-start' flexDirection='column'>
                                                                            <MDBox display='flex' justifyContent='center'><MDTypography fontSize={15} fontWeight='bold' color='success'>Reward</MDTypography></MDBox>
                                                                            <MDBox display='flex' justifyContent='center'><MDTypography fontSize={15} fontWeight='bold' sx={{ color: "#DBB670" }}>{elem.payoutPercentage}% of the net P&L</MDTypography></MDBox>
                                                                        </MDBox>
                                                                    </MDBox>
                                                                </Grid>

                                                                <Grid item mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                                                                    <MDBox display='flex' justifyContent='flex-start' flexDirection='column'>
                                                                        <MDTypography style={{ color: "white", fontSize: 12, fontWeight: 600 }}>
                                                                            CONTEST COMPLETED
                                                                        </MDTypography>
                                                                    </MDBox>
                                                                </Grid>

                                                                <Grid item mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                                                                    <MDBox display='flex' justifyContent='flex-start' flexDirection='column'>
                                                                        <MDTypography style={{ color: "#DBB670", fontSize: 12, fontWeight: 600 }}>
                                                                            RANK: {pnl[0]?.rank}
                                                                        </MDTypography>
                                                                    </MDBox>
                                                                </Grid>

                                                                <Grid item mt={1} xs={12} md={12} lg={12} display="flex" justifyContent="space-between" alignItems="center" alignContent="center">
                                                                    <MDBox color="light" fontSize={10} display="flex" justifyContent="center" alignItems='center'>
                                                                        <MDBox color="dark"><MDTypography fontSize={10} style={{ backgroundColor: "#DBB670", padding: '2px 2px 1px 2px', border: '1px solid grey', borderRadius: '2px', alignItems: 'center', color: "black" }} fontWeight='bold' color='light'>ENTRY FEE : {elem.entryFee ? "+₹" + elem.entryFee : "FREE"}</MDTypography></MDBox>
                                                                    </MDBox>

                                                                    <MDBox color="light" fontSize={10} display="flex" justifyContent="center" alignItems='center'>
                                                                        <MDBox color="dark"><MDTypography fontSize={10} style={{ backgroundColor: "#DBB670", padding: '2px 2px 1px 2px', border: '1px solid grey', borderRadius: '2px', alignItems: 'center', color: "black" }} fontWeight='bold' color='light'>NET P&L: {(pnl[0]?.npnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(pnl[0]?.npnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-pnl[0]?.npnl))}</MDTypography></MDBox>
                                                                    </MDBox>

                                                                    <MDBox color="light" fontSize={10} display="flex" justifyContent="center" alignItems='center'>
                                                                        <MDBox color="dark"><MDTypography fontSize={10} style={{ backgroundColor: "#DBB670", padding: '2px 2px 1px 2px', border: '1px solid grey', borderRadius: '2px', alignItems: 'center', color: "black" }} fontWeight='bold' color='light'>PAYOUT: {pnl[0]?.payoutAmount > 0 ? "₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(pnl[0]?.payoutAmount)) : "₹0"}</MDTypography></MDBox>
                                                                    </MDBox>

                                                                    <MDBox color="light" fontSize={10} display="flex" justifyContent="center" alignItems='center'>
                                                                        <MDBox color="dark"><MDTypography fontSize={10} style={{ backgroundColor: "#DBB670", padding: '2px 2px 1px 2px', border: '1px solid grey', borderRadius: '2px', alignItems: 'center', color: "black" }} fontWeight='bold' color='light'>PORTFOLIO: {"₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(pnl[0]?.portfolioValue))}</MDTypography></MDBox>
                                                                    </MDBox>
                                                                </Grid>

                                                                <Grid item mb={1} xs={12} md={12} lg={12} display='flex' justifyContent='space-between' alignItems='center'>
                                                                    <MDBox display='flex' justifyContent='space-between' flexDirection='row' width='100%'>


                                                                        <MDBox display='flex' justifyContent='flex-start' width='50%'>
                                                                        </MDBox>

                                                                        <MDBox mt={1} display='flex' justifyContent='flex-end' width='50%'>
                                                                            <MDButton
                                                                                variant='outlined'
                                                                                color='warning'
                                                                                size='small'
                                                                                component={Link}

                                                                                onClick={() => { handleNavigate(elem?._id, elem?.contestName) }}

                                                                            >
                                                                                <MDTypography color='warning' fontWeight='bold' fontSize={10}>VIEW ORDERS</MDTypography>
                                                                            </MDButton>
                                                                            <MDBox width='20px'></MDBox>
                                                                            <MDButton
                                                                                variant='outlined'
                                                                                color='warning'
                                                                                size='small'
                                                                                component={Link}

                                                                                onClick={() => { handleDownload(elem?._id) }}

                                                                            >
                                                                                <MDTypography color='warning' fontWeight='bold' fontSize={10}>PARTICIPATION CERTIFICATE <DownloadIcon/></MDTypography>
                                                                            </MDButton>
                                                                        </MDBox>
                                                                    </MDBox>
                                                                </Grid>


                                                            </Grid>
                                                        </MDButton>

                                                    </Grid>
                                                </>
                                            )
                                        }
                                    }

                                })
                            }
                        </Grid>
                    </MDBox>
                </>
                {renderSuccessSB}
            </MDBox>
        </>
    );
}

export default Header;