
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
import { Grid } from '@mui/material';
import FilteredUsers from './filteredUser.js';
// import FilteredUsers from "./filteredUser";

const LeaderBoard = () => {

    const [leaderboard, setFilteredUsers] = useState([]);

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

        // { Header: "MarginX", accessor: "marginx", align: "center" },
        { Header: "MarginX Referred", accessor: "marginxReferred", align: "center" },
        { Header: "MarginX Payout", accessor: "marginxPayout", align: "center" },
        { Header: "Total", accessor: "total", align: "center" },

    ]

    let rows = [];
    let totalAmount = 0;

    leaderboard?.map((elem, index) => {

        totalAmount += (elem?.tenx_payout || 0 + elem?.testzone_payout || 0 + elem?.marginx_payout || 0);

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

        featureObj.total = (
            <MDTypography component="a" variant="caption" fontWeight="medium">
                {/* {totalAmount || "-"} */}
                {("₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalAmount))) || "-"}
            </MDTypography>
        );

        rows.push(featureObj)
    })

    rows.sort((a, b) => {
        if (a.totalAmount > b.totalAmount) {
            return 1;
        } else if (a.totalAmount < b.totalAmount) {
            return -1;
        } else {
            return 0; // a is equal to b
        }
    });

    return (
        <Card>
            <MDBox display="flex" justifyContent="space-between" alignItems="left">
                <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ backgroundColor: "lightgrey", borderRadius: "2px" }}>
                    <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
                        LeaderBoard({leaderboard?.length})
                    </MDTypography>
                </MDBox>
            </MDBox>

            <Grid mt={2} p={1} container style={{ border: '1px solid white', borderRadius: 5 }}>
                <FilteredUsers setFilteredUsers={setFilteredUsers} />
            </Grid>
            <MDBox mt={1}>
                <DataTable
                    table={{ columns, rows }}
                    showTotalEntries={false}
                    isSorted={false}
                    entriesPerPage={false}
                />
            </MDBox>
        </Card>

    )
}



export default LeaderBoard;