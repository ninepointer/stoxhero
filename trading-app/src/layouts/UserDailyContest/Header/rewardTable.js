import * as React from 'react';
import DataTable from "../../../examples/Tables/DataTable";
// import MDButton from "../../../components/MDButton"
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import MDButton from '../../../components/MDButton';
import { Typography } from '@mui/material';



export default function RewardTable({ data, paid }) {

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

    data?.rewards?.map((elem) => {
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

    const pricePool = data?.rewards.reduce((total, acc)=>{
        return total + (acc.rankEnd - acc.rankStart + 1)*Number(acc.prize);
    }, 0)

    return (
        <>
            <MDBox onClick={handleClickOpen} color={paid ? "#DBB670" : "dark"}>
                {data?.payoutType !== "Reward" ?
                paid ?
                 `${data.payoutPercentage}% of the net P&L${data?.payoutCapPercentage?`(upto ₹${new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(data?.entryFee * (data?.payoutCapPercentage??1000)/100)})`:''}. Click to know more!` : 
                 `${data.payoutPercentage}% of the net P&L${data?.payoutCapPercentage?`(upto ₹${new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(data?.portfolio?.portfolioValue * (data?.payoutCapPercentage??10)/100)})`:''}. Click to know more!` : 
                 `Reward worth upto ₹${pricePool}. Click to know more!`}
            </MDBox>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    {
                        data?.payoutType !== "Reward" ?
                            <Typography textAlign="justify" fontSize={15} sx={{ width: "100%" }} color="#000" variant="body2">
                            <b>GST Charges</b>:  The government has implemented a 28% GST on wallet top-ups, but here's the good news: You won't need to worry about paying this GST yourself because we've got it covered. We'll be taking care of the GST on your behalf.
                            </Typography>
                            :
                            <Card>
                                <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ backgroundColor: "lightgrey", borderRadius: "2px" }}>
                                    <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
                                        Reward Table
                                    </MDTypography>
                                </MDBox>
                                <MDBox mt={1}>
                                    <DataTable
                                        table={{ columns, rows }}
                                        showTotalEntries={false}
                                        isSorted={false}
                                        entriesPerPage={false}
                                    />
                                </MDBox>
                            </Card>
                    }
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

