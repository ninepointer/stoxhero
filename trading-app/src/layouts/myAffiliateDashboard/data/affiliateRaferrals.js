
import React, {useState, useEffect} from 'react'
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


const AffiliateRafferals = ({ affiliateReferrals }) => {

    let columns = [
        { Header: "Serial No.", accessor: "sNo", align: "center" },
        { Header: "Name", accessor: "name", align: "center" },
        { Header: "Joining Date", accessor: "joiningDate", align: "center" },
        { Header: "Earnings", accessor: "earnings", align: "center" },
        { Header: "Status", accessor: "status", align: "center" },
    ];
    let rows = [];
    //   console.log('checking',referralRanks, getDetails.userDetails.employeeid);
    affiliateReferrals?.map((elem, index) => {
        let refData = {}
        let userStatus = elem?.paidDetails?.paidStatus ? (elem?.paidDetails?.paidStatus === 'Active' ? 'Paid' : 'Free') : (elem?.activationDetails?.activationStatus ? elem?.activationDetails?.activationStatus : 'Inactive')

        if(elem?.referredUserId){

        
        refData.sNo = (
            <MDTypography variant="Contained" color='dark' >
                {index + 1}
            </MDTypography>
        );
        refData.name = (
            <MDTypography variant="Contained" color='dark' >
                {elem?.referredUserId?.first_name} {elem?.referredUserId?.last_name}
            </MDTypography>
        );
        refData.joiningDate = (
            <MDTypography variant="Contained" color='dark' >
                {moment.utc(elem?.referredUserId?.joining_date).format('DD-MMM-YY HH:mm:ss')}
            </MDTypography>
        );
        refData.earnings = (
            <MDTypography variant="Contained" color='dark' >
                ₹{elem?.affiliateEarning}
            </MDTypography>
        );
        refData.status = (
            <MDTypography variant="Contained" color='dark' >
                {userStatus}
            </MDTypography>
        );


        rows.push(refData);
        }
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
                        <MDBox pt={2}>
                            <DataTable
                                table={{ columns, rows }}
                                isSorted={false}
                                entriesPerPage={false}
                                showTotalEntries={false}
                                noEndBorder
                            />
                        </MDBox>
                        {
                            !rows.length &&
                            <MDTypography color="secondary" mb={2} fontSize={15} fontWeight='bold' display='flex' alignItems='center' alignContent='center' justifyContent='center'>No Referrals Yet!</MDTypography>
                        }
                    </Card>
                </Grid>
            </Grid>
        </MDBox>

    )
}



export default AffiliateRafferals;