import React from 'react';
import {useState, useEffect, memo, useContext} from "react"
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
import { NetPnlContext } from '../../../../PnlContext';
import moment from 'moment';

function PnlSummary({contestId}) {

  const [pnlData, setPnlData] = useState([]);
  const { netPnl, grossPnlAndBrokerage } = useContext(NetPnlContext); 
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


  pnlData?.map((elem) => {
    let featureObj = {};
    totalGpnl += elem.gpnl;
    totalNpnl += elem.npnl;
    totalBrokerage += elem.brokerage;
    totalTrade += elem.trades;

    featureObj.date = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {moment.utc(elem?.date).utcOffset('+00:00').format('DD-MMM')}
      </MDTypography>
    );
    featureObj.gpnl = (
      <MDTypography component="a" variant="caption" color={elem?.gpnl > 0 ? "success" : "error"} fontWeight="medium">
        { elem?.gpnl >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(elem?.gpnl))) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(elem?.gpnl)))}
      </MDTypography>
    );
    featureObj.brokerage = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(elem?.brokerage))}
      </MDTypography>
    );
    featureObj.npnl = (
      <MDTypography component="a" variant="caption" color={elem?.npnl > 0 ? "success" : "error"} fontWeight="medium">
        { elem?.npnl >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(elem?.npnl))) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(elem?.npnl)))}
      </MDTypography>
    );
    featureObj.trades = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.trades}
      </MDTypography>
    );

    rows.push(featureObj)
  })

  let obj = {};
  obj.date = (
    <MDTypography component="a" variant="caption" color="black" fontWeight="bold" backgroundColor='#D3D3D3' borderRadius='5px' p={1}>
    TOTAL
    </MDTypography>
  );
  obj.gpnl = (
    <MDTypography component="a" variant="caption" color={grossPnlAndBrokerage.grossPnl > 0 ? "success" : "error"} fontWeight="bold" backgroundColor='#D3D3D3' borderRadius='5px' p={1}>
        { grossPnlAndBrokerage.grossPnl >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(grossPnlAndBrokerage.grossPnl))) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(grossPnlAndBrokerage.grossPnl)))}
    </MDTypography>
  );
  obj.brokerage = (
    <MDTypography component="a" variant="caption" color="black" fontWeight="bold" backgroundColor='#D3D3D3' borderRadius='5px' p={1}>
      ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(grossPnlAndBrokerage.brokerage))}
    </MDTypography>
  );
  obj.npnl = (
    <MDTypography component="a" variant="caption" color={grossPnlAndBrokerage.grossPnl-grossPnlAndBrokerage.brokerage > 0 ? "success" : "error"} fontWeight="bold" backgroundColor='#D3D3D3' borderRadius='5px' p={1}>
      { grossPnlAndBrokerage.grossPnl-grossPnlAndBrokerage.brokerage >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(netPnl))) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(netPnl)))}
    </MDTypography>
  );
  obj.trades = (
    <MDTypography component="a" variant="caption" color="black" fontWeight="bold" backgroundColor='#D3D3D3' borderRadius='5px' p={1}>
      {grossPnlAndBrokerage.trades}
    </MDTypography>
  );

  rows.push(obj)


  let featureObj = {}
  featureObj.date = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
    {moment.utc(new Date()).utcOffset('+00:00').format('DD-MMM')}
    </MDTypography>
  );
  featureObj.gpnl = (
    <MDTypography component="a" variant="caption" color={grossPnlAndBrokerage.grossPnl-totalGpnl > 0 ? "success" : "error"} fontWeight="medium">
        { grossPnlAndBrokerage.grossPnl-totalGpnl >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(totalGpnl-grossPnlAndBrokerage.grossPnl))) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(totalGpnl-grossPnlAndBrokerage.grossPnl)))}
    </MDTypography>
  );
  featureObj.brokerage = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(totalBrokerage-grossPnlAndBrokerage.brokerage))}
    </MDTypography>
  );
  featureObj.npnl = (
    <MDTypography component="a" variant="caption" color={netPnl-totalNpnl > 0 ? "success" : "error"} fontWeight="medium">
        { netPnl-totalNpnl >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(netPnl-totalNpnl))) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(netPnl-totalNpnl)))}
    </MDTypography>
  );
  featureObj.trades = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {Math.abs(totalTrade-grossPnlAndBrokerage.trades)}
    </MDTypography>
  );

  rows.unshift(featureObj)

  // console.log("rows", rows)

  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography fontSize={14} fontWeight= {700} >
          Contest Net P&L : &nbsp; 
            <span style={{fontWeight: 700, color: netPnl >= 0 ? "#7EC581" : "#FF3737"}} >
              { netPnl >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(netPnl))) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(netPnl)))}
            </span>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {rows.length > 0 ?
          <Card>
            <MDBox display="flex" justifyContent="space-between" alignItems="left">
              {/* <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ backgroundColor: "lightgrey", borderRadius: "2px" }}>
                <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center">
                  Day Wise Profit & Loss Table
                </MDTypography>
              </MDBox> */}
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
          <Typography>Your daily pnl will visible here</Typography>}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default memo(PnlSummary);