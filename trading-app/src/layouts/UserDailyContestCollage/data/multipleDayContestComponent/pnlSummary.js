import React from 'react';
import {useState, useEffect, memo} from "react"
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from "axios";
import { apiUrl } from '../../../../constants/constants';
import MDTypography from '../../../../components/MDTypography';
import MDBox from '../../../../components/MDBox';
import { Card } from '@mui/material';
import DataTable from '../../../../examples/Tables/DataTable';

function PnlSummary({contestId}) {

  const [pnlData, setPnlData] = useState([]);
  let totalGpnl = 0;
  let totalNpnl = 0;
  let totalBrokerage = 0;
  let totalTrade = 0;
  let columns = [
    { Header: "Date", accessor: "date", align: "center" },
    { Header: "Gross P&L", accessor: "gpnl", align: "center" },
    { Header: "Brokerage", accessor: "brokerage", align: "center" },
    { Header: "Net P&L", accessor: "npnl", align: "center" },
    { Header: "# Trades", accessor: "trades", align: "center" },
  ];
  let rows = [];

  useEffect(() => {
    axios.get(`${apiUrl}dailycontest/trade/${contestId}/mydaywisepnl`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      }}
      ).then((res)=>{
        setPnlData(res.data.data);
      })
      
  }, []);

  console.log("pnl", pnlData)

  pnlData?.map((elem) => {
    let featureObj = {};
    totalGpnl += elem.gpnl;
    totalNpnl += elem.npnl;
    totalBrokerage += elem.brokerage;
    totalTrade += elem.trades;

    featureObj.date = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.date}
      </MDTypography>
    );
    featureObj.gpnl = (
      <MDTypography component="a" variant="caption" color={elem?.gpnl > 0 ? "success" : "error"} fontWeight="medium">
        ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(elem?.gpnl))}
      </MDTypography>
    );
    featureObj.brokerage = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(elem?.brokerage))}
      </MDTypography>
    );
    featureObj.npnl = (
      <MDTypography component="a" variant="caption" color={elem?.npnl > 0 ? "success" : "error"} fontWeight="medium">
        ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(elem?.npnl))}
      </MDTypography>
    );
    featureObj.trades = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.trades}
      </MDTypography>
    );

    rows.push(featureObj)
  })

  let featureObj = {}
  featureObj.date = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
    TOTAL
    </MDTypography>
  );
  featureObj.gpnl = (
    <MDTypography component="a" variant="caption" color={totalGpnl > 0 ? "success" : "error"} fontWeight="medium">
      ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(totalGpnl))}
    </MDTypography>
  );
  featureObj.brokerage = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {totalBrokerage}
    </MDTypography>
  );
  featureObj.npnl = (
    <MDTypography component="a" variant="caption" color={totalNpnl > 0 ? "success" : "error"} fontWeight="medium">
      ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(totalNpnl))}
    </MDTypography>
  );
  featureObj.trades = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {totalTrade}
    </MDTypography>
  );

  rows.push(featureObj)


  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Check your day wise pnl</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {pnlData.length > 0 ?
          <Card>
            <MDBox display="flex" justifyContent="space-between" alignItems="left">
              <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ backgroundColor: "lightgrey", borderRadius: "2px" }}>
                <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
                  Day Wise Profit & Loss Table
                </MDTypography>
              </MDBox>
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
          :
          <Typography>Your daily pnl is visible here</Typography>}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default memo(PnlSummary);