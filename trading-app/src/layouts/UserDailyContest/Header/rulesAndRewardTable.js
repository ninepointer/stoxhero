import * as React from 'react';
import DataTable from "../../../examples/Tables/DataTable";
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import MDButton from '../../../components/MDButton';
import { Typography } from '@mui/material';
import { settingContext } from '../../../settingContext';
import moment from "moment"
import DialogTitle from '@mui/material/DialogTitle';


export default function RewardTable({ data, paid }) {

    const setting = React.useContext(settingContext)
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

    let cap;
    if(paid){
        cap = new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(data?.entryFee * (data?.payoutCapPercentage??1000)/100);
    } else{
        cap = new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(data?.portfolio?.portfolioValue * (data?.payoutCapPercentage??10)/100);
    }

    return (
        <>
            <MDBox onClick={handleClickOpen} color={paid ? "#DBB670" : "dark"}>
                {data?.payoutType !== "Reward" ?
                paid ?
                 `${data.payoutPercentage}% of the net P&L${data?.payoutCapPercentage?`(upto ₹${cap})`:''}. Click to know more!` : 
                 `${data.payoutPercentage}% of the net P&L${data?.payoutCapPercentage?`(upto ₹${cap})`:''}. Click to know more!` : 
                 `Reward worth upto ₹${pricePool}. Click to know more!`}
            </MDBox>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle textAlign={'center'}>
                    Contest Rules
                </DialogTitle>
                <DialogContent>
                    {
                        data?.payoutType !== "Reward" ?
                            <> 
                                <Typography textAlign="justify" fontSize={15} sx={{ width: "100%" }} color="#000" variant="body2">
                                    <b>Contest Details</b>: Contest begins on {moment.utc(data?.contestStartTime).utcOffset('+05:30').format('DD-MMM HH:mm:ss')} and ends on {moment.utc(data?.contestEndTime).utcOffset('+05:30').format('DD-MMM HH:mm:ss')}. The entry fee is ₹{data?.entryFee}.
                                </Typography>

                                <Typography textAlign="justify" fontSize={15} sx={{ width: "100%" }} color="#000" variant="body2">
                                    <b>Payout Criteria</b>:  Payouts are based on individual performance (Net P&L).
                                </Typography>

                                <Typography textAlign="justify" fontSize={15} sx={{ width: "100%" }} color="#000" variant="body2">
                                    <b>Payout Limit</b>:  Receive {data?.payoutPercentage}% of your Net P&L(Only positive net P&Ls), up to a maximum of ₹{cap}.
                                </Typography>

                                <Typography textAlign="justify" fontSize={15} sx={{ width: "100%" }} color="#000" variant="body2">
                                    <b>Tax Deduction</b>:  A {setting[0]?.tdsPercentage}% TDS will be applied to your final winning amount.
                                </Typography>

                                <Typography textAlign="justify" fontSize={15} sx={{ width: "100%" }} color="#000" variant="body2">
                                    <b>Payout Processing</b>:  Payouts are calculated and processed after the contest ends on {moment.utc(data?.contestEndTime).utcOffset('+05:30').format('DD-MMM HH:mm:ss')}, (based on cumulative Net P&L) / (daily based on daily P&L) post {moment.utc(setting[0]?.time?.appEndTime).utcOffset('+05:30').format('HH:mm')}.
                                </Typography>

                                <Typography textAlign="justify" fontSize={15} sx={{ width: "100%" }} color="#000" variant="body2">
                                    <b>Daily Participation</b>:  For contests spanning multiple days, daily trading is required for payout eligibility.
                                </Typography>
                            </>

                            :
                            <>
                                <Typography textAlign="justify" fontSize={15} sx={{ width: "100%" }} color="#000" variant="body2">
                                    <b>Contest Details</b>: Contest begins on {moment.utc(data?.contestStartTime).utcOffset('+05:30').format('DD-MMM HH:mm:ss')} and ends on {moment.utc(data?.contestEndTime).utcOffset('+05:30').format('DD-MMM HH:mm:ss')}. The entry fee is ₹{data?.entryFee}.
                                </Typography>

                                <Typography textAlign="justify" fontSize={15} sx={{ width: "100%" }} color="#000" variant="body2">
                                    <b>Tax Deduction</b>:  A {setting[0]?.tdsPercentage}% TDS will be applied to your final winning amount.
                                </Typography>

                                <Typography textAlign="justify" fontSize={15} sx={{ width: "100%" }} color="#000" variant="body2">
                                    <b>Payout Processing</b>:  Payouts are processed after the contest ends on {moment.utc(data?.contestEndTime).utcOffset('+05:30').format('DD-MMM HH:mm:ss')}, based on reward table post {moment.utc(setting[0]?.time?.appEndTime).utcOffset('+05:30').format('HH:mm')}.
                                </Typography>

                                <Typography textAlign="justify" fontSize={15} sx={{ width: "100%" }} color="#000" variant="body2">
                                    <b>Daily Participation</b>:  For contests spanning multiple days, daily trading is required for payout eligibility.
                                </Typography>

                                <Card sx={{marginTop: "10px"}}>
                                    <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ backgroundColor: "lightgrey", borderRadius: "2px" }} >
                                        <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
                                            Reward Table
                                        </MDTypography>
                                    </MDBox>
                                    <MDBox >
                                        <DataTable
                                            table={{ columns, rows }}
                                            showTotalEntries={false}
                                            isSorted={false}
                                            entriesPerPage={false}
                                        />
                                    </MDBox>
                                </Card>

                            </>
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

