
import React, {useState, useEffect, useContext} from 'react'
import axios from "axios";
import {apiUrl} from "../../../constants/constants.js"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea, Divider, Grid } from '@mui/material';
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox/index.js";
import MDTypography from "../../../components/MDTypography/index.js";
import { Link} from "react-router-dom";
import moment from 'moment'
import DataTable from '../../../examples/Tables/DataTable/index.js';
import { CircularProgress } from "@mui/material";
import MDButton from '../../../components/MDButton/index.js';
import { adminRole } from '../../../variables';
import { userContext } from '../../../AuthContext.jsx';


const AffiliateRafferals = ({showDetailClicked, start, end, affiliateData }) => {

    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    let [skip, setSkip] = useState(0);
    const limitSetting = 5;
    const getDetails = useContext(userContext)

    useEffect(() => {
        setIsLoading(true)
        axios.get(`${apiUrl}affiliate/${getDetails.userDetails.role.roleName===adminRole ? "adminaffiliaterafferals" : "myaffiliaterafferals"}?startDate=${start}&endDate=${end}&skip=${skip}&limit=${limitSetting}&affiliateId=${affiliateData?.affiliateId}&affiliateType=${affiliateData?.affiliateType}&affiliatePrograme=${affiliateData?.affiliatePrograme}`, { withCredentials: true })
            .then((res) => {
                // console.log(res.data)
                setData(res.data.data);
                setCount(res.data.count);
                setIsLoading(false)
            }).catch((err) => {
                //window.alert("Server Down");
                setTimeout(() => {
                    setIsLoading(false)
                }, 500)
                return new Error(err);
            })
    }, [affiliateData, showDetailClicked])

    function backHandler() {
        if (skip <= 0) {
            return;
        }
        setSkip(prev => prev - limitSetting);
        setData([]);
        setIsLoading(true)
        axios.get(`${apiUrl}affiliate/${getDetails.userDetails.role.roleName===adminRole ? "adminaffiliaterafferals" : "myaffiliaterafferals"}?startDate=${start}&endDate=${end}&skip=${skip - limitSetting}&limit=${limitSetting}&affiliateId=${affiliateData?.affiliateId}&affiliateType=${affiliateData?.affiliateType}&affiliatePrograme=${affiliateData?.affiliatePrograme}`, {
            withCredentials: true,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": false
            },
        })
            .then((res) => {
                // console.log("Orders:", res.data)
                setData(res.data.data);
                setCount(res.data.count)
                setTimeout(() => {
                    setIsLoading(false)
                }, 500)
            }).catch((err) => {
                console.log(err)
                setIsLoading(false)
                return new Error(err);
            })
    }

    function nextHandler() {
        if (skip + limitSetting >= count) {
            // console.log("inside skip", count, skip + limitSetting)
            return;
        }
        // console.log("inside next handler")
        setSkip(prev => prev + limitSetting);
        setData([]);
        setIsLoading(true)
        axios.get(`${apiUrl}affiliate/${getDetails.userDetails.role.roleName===adminRole ? "adminaffiliaterafferals" : "myaffiliaterafferals"}?startDate=${start}&endDate=${end}&skip=${skip + limitSetting}&limit=${limitSetting}&affiliateId=${affiliateData?.affiliateId}&affiliateType=${affiliateData?.affiliateType}&affiliatePrograme=${affiliateData?.affiliatePrograme}`, {
            withCredentials: true,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": false
            },
        })
            .then((res) => {
                // console.log("orders", res.data)
                setData(res.data.data);
                setCount(res.data.count)
                setTimeout(() => {
                    setIsLoading(false)
                }, 500)
            }).catch((err) => {
                console.log(err)
                setIsLoading(false)
                return new Error(err);
            })
    }

    let columns = [
        { Header: "Serial No.", accessor: "sNo", align: "center" },
        { Header: "Name", accessor: "name", align: "center" },
        { Header: "Joining Date", accessor: "joiningDate", align: "center" },
        { Header: "Earnings", accessor: "earnings", align: "center" },
        { Header: "Status", accessor: "status", align: "center" },
    ];
    let rows = [];
    //   console.log('checking',referralRanks, getDetails.userDetails.employeeid);
    data?.map((elem, index) => {
        let refData = {}
        let userStatus = elem?.paidDetails?.paidStatus ? (elem?.paidDetails?.paidStatus === 'Active' ? 'Paid' : 'Free') : (elem?.activationDetails?.activationStatus ? elem?.activationDetails?.activationStatus : 'Inactive')

        refData.sNo = (
            <MDTypography variant="Contained" color='dark' >
                {index + 1}
            </MDTypography>
        );
        refData.name = (
            <MDTypography variant="Contained" color='dark' >
                {elem?.name}
            </MDTypography>
        );
        refData.joiningDate = (
            <MDTypography variant="Contained" color='dark' >
                {moment.utc(elem?.joining_date).format('DD-MMM-YY HH:mm:ss')}
            </MDTypography>
        );
        refData.earnings = (
            <MDTypography variant="Contained" color='dark' >
                ₹{elem?.payout}
            </MDTypography>
        );
        refData.status = (
            <MDTypography variant="Contained" color='dark' >
                {userStatus}
            </MDTypography>
        );


        rows.push(refData);
      
    });

    return (
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
                                Referrals
                            </MDTypography>
                        </MDBox>
                        {!isLoading ?
                        <MDBox pt={2}>
                            <DataTable
                                table={{ columns, rows }}
                                isSorted={false}
                                entriesPerPage={false}
                                showTotalEntries={false}
                                noEndBorder
                            />
                        </MDBox>
                        :
                        <Grid container display="flex" justifyContent="center" alignContent='center' alignItems="center">
                        <Grid item display="flex" justifyContent="center" alignContent='center' alignItems="center" lg={12}>
                            <MDBox mt={5} mb={5}>
                                <CircularProgress color="info" />
                            </MDBox>
                        </Grid>
                    </Grid>
                }
                        {
                            count==0 &&
                            <MDTypography color="secondary" mb={2} fontSize={15} fontWeight='bold' display='flex' alignItems='center' alignContent='center' justifyContent='center'>No Referrals Yet!</MDTypography>
                        }

                        {!isLoading && count !== 0 &&
                            <MDBox mt={1} p={1} display="flex" justifyContent="space-between" alignItems='center' width='100%'>
                                <MDButton variant='outlined' color='secondary' disabled={(skip + limitSetting) / limitSetting === 1 ? true : false} size="small" onClick={backHandler}>Back</MDButton>
                                <MDTypography color="dark" fontSize={15} fontWeight='bold'>Total Order: {!count ? 0 : count} | Page {(skip + limitSetting) / limitSetting} of {!count ? 1 : Math.ceil(count / limitSetting)}</MDTypography>
                                <MDButton variant='outlined' color='secondary' disabled={Math.ceil(count / limitSetting) === (skip + limitSetting) / limitSetting ? true : !count ? true : false} size="small" onClick={nextHandler}>Next</MDButton>
                            </MDBox>
                        }
                    </Card>
                </Grid>
            </Grid>
        </MDBox>

    )
}



export default AffiliateRafferals;