import React, { memo, useContext } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import Nifty from '../../../assets/images/niftycharticon.png'
import BNifty from '../../../assets/images/bniftycharticon.png'
import FNifty from '../../../assets/images/fniftycharticon.png'

// import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
// import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { NetPnlContext } from "../../../PnlContext";
// import upicon from '../../../assets/images/arrow.png'
// import downicon from '../../../assets/images/down.png'
// import MDAvatar from '../../../components/MDAvatar';
// import niftyicon from '../../../assets/images/nifty50icon.png'
// import bankniftyicon from '../../../assets/images/bankniftyicon.png'
import MDButton from "../../../components/MDButton";

// import bankniftyicon from '../../../assets/images/bankniftyicon.png'

function StockIndexDailyContest({ socket }) {
    // console.log("rendering : infinity stockindex")
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [indexData, setIndexData] = useState([]);
    const [indexLiveData, setIndexLiveData] = useState([]);
    const pnl = useContext(NetPnlContext);
    // const lightTheme = createTheme({ palette: { mode: 'light' } });
    // const gpnlcolor = pnl.netPnl >= 0 ? "success" : "error"

    useEffect(() => {
        axios.get(`${baseUrl}api/v1/stockindex`, {withCredentials: true})
            .then((res) => {
                setIndexData(res.data);
            }).catch((err) => {
                return new Error(err);
            })
    }, [])

    useEffect(() => {
        socket.on("index-tick", (data) => {
            // console.log("index ticks", data)
            setIndexLiveData(prevInstruments => {
                const instrumentMap = new Map(prevInstruments.map(instrument => [instrument.instrument_token, instrument]));
                data.forEach(instrument => {
                    instrumentMap.set(instrument.instrument_token, instrument);
                });
                return Array.from(instrumentMap.values());
            });

        })
    }, [])

    let finalArr = [];
    indexLiveData?.map((elem) => {
        let obj = {};
        let name = indexData.filter((subElem) => {
            return subElem.instrumentToken == elem.instrument_token;
        })

        let previousPrice = (elem?.last_price * 100) / (100 + elem?.change);
        obj.instrument = (
            <MDTypography variant="caption" fontWeight="medium">
                {name[0]?.displayName}
            </MDTypography>
        );
        obj.ltp = (
            <MDTypography variant="caption" fontWeight="medium">
                {elem?.last_price?.toFixed(2)}
            </MDTypography>
        );
        obj.percentageChange = (
            <MDTypography variant="caption" color="text" fontWeight="medium">
                {elem?.change?.toFixed(2)}
            </MDTypography>
        );
        obj.valueChange = (
            <MDTypography variant="caption" color="text" fontWeight="medium">
                {(elem?.last_price - previousPrice)?.toFixed(2)}
            </MDTypography>
        );
        obj.elevation = (
            <MDTypography variant="caption" color="text" fontWeight="medium">
                {2}
            </MDTypography>
        );

        finalArr.push(obj);
    })


    // //console.log("finalArr", finalArr)
    return (
        <>
            {finalArr.map((e) => {
                return (
                    <Grid item xs={12} md={6} lg={3} key={e.instrument.props.children}>
                        <MDButton style={{ minWidth: '100%' }}>
                            <MDBox display='flex' alignItems='center'>
                                <MDBox display='flex' justifyContent='flex-start'><img src={e.instrument.props.children === "FINNIFTY" ? FNifty : e.instrument.props.children === "BANK NIFTY" ? BNifty : e.instrument.props.children === "NIFTY 50" && Nifty} width='40px' height='40px' /></MDBox>
                                <MDBox><MDTypography ml={1} fontSize={11} fontWeight='bold'>{e.instrument.props.children}:</MDTypography></MDBox>
                                <MDBox><MDTypography ml={1} fontSize={11} color={e.percentageChange.props.children >= 0 ? "success" : "error"}>{(e.ltp.props.children) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(e.ltp.props.children)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-e.ltp.props.children))}</MDTypography></MDBox>
                            </MDBox>
                        </MDButton>
                    </Grid>
                )
            })}
        </>
    )
}

export default memo(StockIndexDailyContest);
