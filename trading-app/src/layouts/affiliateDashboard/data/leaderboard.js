
import React, { useState, useEffect } from 'react'
// import axios from "axios";
// import {apiUrl} from "../../../constants/constants.js"
import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import { CardActionArea, Divider, Grid } from '@mui/material';
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox/index.js";
import MDTypography from "../../../components/MDTypography/index.js";
// import { Link} from "react-router-dom";
// import moment from 'moment'
import DataTable from '../../../examples/Tables/DataTable/index.js';
import { CardActionArea, CircularProgress, Grid } from '@mui/material';
import FilteredUsers from './filteredUser.js';
// import FilteredUsers from "./filteredUser";

const LeaderBoard = () => {

    const [leaderboard, setFilteredUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
        }, 10000)
    }, [leaderboard])

    let columns = [
        { Header: "#", accessor: "index", align: "center" },
        { Header: "Name", accessor: "fullname", align: "center" },
        { Header: "Code", accessor: "code", align: "center" },

        // { Header: "TenX", accessor: "tenx", align: "center" },
        { Header: "Tenx Referred", accessor: "tenxReferred", align: "center" },
        { Header: "Tenx Payout", accessor: "tenxPayout", align: "center" },

        // { Header: "TestZone", accessor: "testzone", align: "center" },
        { Header: "TestZone Referred", accessor: "testzoneReferred", align: "center" },
        { Header: "TestZone Payout", accessor: "testzonePayout", align: "center" },

        { Header: "MarginX Referred", accessor: "marginxReferred", align: "center" },
        { Header: "MarginX Payout", accessor: "marginxPayout", align: "center" },
        { Header: "SignUps", accessor: "signup", align: "center" },
        { Header: "SignUp Payout", accessor: "signupPayout", align: "center" },
        { Header: "Total", accessor: "total", align: "center" },

    ]

    let rows = [];

    let arr = [];
    leaderboard?.map((elem, index) => {
        let totalAmount = (
            (elem?.tenx_payout || 0) +
            (elem?.testzone_payout || 0) +
            (elem?.marginx_payout || 0) +
            ((elem?.signup || 0) * 15)
        );
        elem.total = totalAmount;

        arr.push(JSON.parse(JSON.stringify(elem)));
    });


    arr.sort((a, b) => {
        // Extract numerical values from the strings and remove commas
        // const aValue = parseFloat(a.total.props.children.replace(/[^0-9.-]+/g,""));
        // const bValue = parseFloat(b.total.props.children.replace(/[^0-9.-]+/g,""));

        // Compare numerical values in descending order
        if (a.total > b.total) {
            return -1; // a should come before b
        } else if (a.total < b.total) {
            return 1; // b should come before a
        } else {
            return 0; // a is equal to b
        }
    });

    console.log("Arr", arr)

    arr?.map((elem, index) => {

        // totalAmount += (elem?.tenx_payout || 0 + elem?.testzone_payout || 0 + elem?.marginx_payout || 0 + (elem?.signup*15) || 0);

        let featureObj = {}
        featureObj.index = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                {index + 1}
            </MDTypography>
        );

        featureObj.fullname = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                {elem?.first_name} {elem?.last_name}
            </MDTypography>
        );

        featureObj.code = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                {elem?.code || "-"}
            </MDTypography>
        );
        featureObj.tenxReferred = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                {elem?.tenx_payout_count || "-"}
            </MDTypography>
        );

        featureObj.tenxPayout = (
            <MDTypography component="a" variant="caption" fontWeight="medium">
                {/* {elem?.tenx_payout || "-"} */}
                {elem?.tenx_payout ? ("₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.tenx_payout))) : "-"}
            </MDTypography>
        );

        featureObj.testzoneReferred = (
            <MDTypography component="a" variant="caption" fontWeight="medium">
                {elem?.testzone_payout_count || "-"}
            </MDTypography>
        );

        featureObj.testzonePayout = (
            <MDTypography component="a" variant="caption" fontWeight="medium">
                {/* {elem?.testzone_payout || "-"} */}
                {elem?.testzone_payout ? ("₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.testzone_payout))) : "-"}
            </MDTypography>
        );

        featureObj.marginxReferred = (
            <MDTypography component="a" variant="caption" fontWeight="medium">
                {elem?.marginx_payout_count || "-"}
            </MDTypography>
        );


        featureObj.marginxPayout = (
            <MDTypography component="a" variant="caption" fontWeight="medium">
                {/* {elem?.marginx_payout || "-"} */}
                {elem?.marginx_payout ? ("₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.marginx_payout))) : "-"}
            </MDTypography>
        );

        featureObj.signup = (
            <MDTypography component="a" variant="caption" fontWeight="medium">
                {/* {elem?.marginx_payout || "-"} */}
                {elem?.signup || "-"}
            </MDTypography>
        );

        featureObj.signupPayout = (
            <MDTypography component="a" variant="caption" fontWeight="medium">
                {/* {elem?.marginx_payout || "-"} */}
                {elem?.signup ? ("₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.signup * 15))) : "-"}
            </MDTypography>
        );

        featureObj.total = (
            <MDTypography component="a" variant="caption" fontWeight="medium">
                {("₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.total))) || "-"}
                {/* {("₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalAmount))) || "-"} */}
            </MDTypography>
        );

        rows.push(featureObj)
    })

    return (
        <Card>
            <MDBox display="flex" justifyContent="space-between" alignItems="left">
                {/* <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ backgroundColor: "lightgrey", borderRadius: "2px" }}>
                    <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
                        LeaderBoard({leaderboard?.length})
                    </MDTypography>
                </MDBox> */}

                <Grid item p={1} xs={12} md={12} lg={8} display='flex' justifyContent='flex-start'
                    sx={{ minWidth: '100%', cursor: 'pointer', borderRadius: 1, backgroundColor: 'lightgrey' }}
                >
                    <MDTypography variant="h6" style={{ textAlign: 'center' }}>Affiliate Program Overview</MDTypography>
                </Grid>
            </MDBox>

            <Grid mt={2} p={1} container style={{ border: '1px solid white', borderRadius: 5 }}>
                <FilteredUsers setFilteredUsers={setFilteredUsers} />
            </Grid>
            {rows.length > 0 ?
                <MDBox mt={1}>
                    <DataTable
                        table={{ columns, rows }}
                        showTotalEntries={false}
                        isSorted={false}
                        entriesPerPage={false}
                    />
                </MDBox>
                :
                isLoading ?
                    <Grid container mb={1} spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{ minWidth: '100%', minHeight: '380px' }}>
                        <CircularProgress />
                    </Grid>
                    :
                    <Card sx={{ minWidth: '100%', cursor: 'pointer', borderRadius: 1 }} >
                        <CardActionArea>
                            <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ minHeight: '20vH', width: '100%' }}>
                                <MDTypography>No Data</MDTypography>
                            </MDBox>
                        </CardActionArea>
                    </Card>
            }
        </Card>

    )
}



export default LeaderBoard;