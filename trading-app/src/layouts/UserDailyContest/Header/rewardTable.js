import * as React from 'react';
import { useEffect, useState } from "react";
import DataTable from "../../../examples/Tables/DataTable";
// import MDButton from "../../../components/MDButton"
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";
import { Tooltip } from '@mui/material';
// import MDButton from '../../../components/MDButton';
// import axios from "axios";
// import moment from 'moment';
import DownloadIcon from '@mui/icons-material/Download';
import { saveAs } from 'file-saver';
// import html2canvas from 'html2canvas';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import MDButton from '../../../components/MDButton';



export default function RewardTable({ reward, paid }) {

    let columns = [
        { Header: "# Rank", accessor: "rank", align: "center" },
        { Header: "Reward", accessor: "reward", align: "center" },
    ]

    let rows = []

    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    reward?.map((elem) => {
        let featureObj = {}

        featureObj.rank = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                {Number(elem?.rankStart) === Number(elem?.rankEnd) ? Number(elem?.rankStart) : `${Number(elem?.rankStart)}-${Number(elem?.rankEnd)}`}
            </MDTypography>
        );
        featureObj.reward = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                ₹{elem?.prize}
            </MDTypography>
        );

        rows.push(featureObj)
    })

    const pricePool = reward.reduce((total, acc)=>{
        return total + (acc.rankEnd - acc.rankStart + 1)*Number(acc.prize);
    }, 0)

    return (
        <>
            <MDBox onClick={handleClickOpen} color={paid ? "#DBB670" : "dark"}>
                {`Reward worth upto ₹${pricePool}. Click to know more!`}
            </MDBox>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <Card>
                        {/* <MDBox display="flex" justifyContent="space-between" alignItems="left"> */}
                            <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ backgroundColor: "lightgrey", borderRadius: "2px" }}>
                                <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
                                    Reward Table
                                </MDTypography>
                            </MDBox>
                        {/* </MDBox> */}
                        <MDBox mt={1}>
                            <DataTable
                                table={{ columns, rows }}
                                showTotalEntries={false}
                                isSorted={false}
                                entriesPerPage={false}
                            />
                        </MDBox>
                    </Card>
                </DialogContent>
                <DialogActions>
                    <MDButton onClick={handleClose} autoFocus>
                        Close
                    </MDButton>
                </DialogActions>
            </Dialog>
        </>
    );
}

