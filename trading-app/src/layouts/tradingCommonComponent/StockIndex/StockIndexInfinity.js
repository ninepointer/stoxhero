import React, {memo, useContext} from "react";
import Grid from "@mui/material/Grid";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";

// import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
// import Paper from '@mui/material/Paper';
import {useState, useEffect} from 'react';
import axios from 'axios';
import { NetPnlContext } from "../../../PnlContext";
import upicon from '../../../assets/images/arrow.png'
import downicon from '../../../assets/images/down.png'
import MDAvatar from '../../../components/MDAvatar';
import niftyicon from '../../../assets/images/nifty50icon.png'
import bankniftyicon from '../../../assets/images/bankniftyicon.png'

// import bankniftyicon from '../../../assets/images/bankniftyicon.png'

function StockIndex({socket}) {
    console.log("rendering : infinity stockindex")
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [indexData, setIndexData] = useState([]);
    const [indexLiveData, setIndexLiveData] = useState([]);
    const pnl = useContext(NetPnlContext);
    // const lightTheme = createTheme({ palette: { mode: 'light' } });
    // const gpnlcolor = pnl.netPnl >= 0 ? "success" : "error"

    useEffect(()=>{
        axios.get(`${baseUrl}api/v1/stockindex`)
        .then((res) => {
            setIndexData(res.data);
        }).catch((err) => {
            return new Error(err);
        })
    }, [])

    useEffect(()=>{
        socket.on("index-tick", (data) => {
            console.log("index ticks", data)
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
    indexLiveData?.map((elem)=>{
        let obj = {};
        let name = indexData.filter((subElem)=>{
            return subElem.instrumentToken == elem.instrument_token;
        })

        let previousPrice = (elem?.last_price*100)/(100+elem?.change);
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
        {finalArr.map((e)=>{
            return(
                <Grid item xs={12} md={6} lg={3}>
                <MDBox bgColor="light" borderRadius={5} p={2} display="flex" justifyContent="space-between">
                    <Grid container display="flex" justifyContent="space-around">
        
                        <Grid item xs={12} md={6} lg={2.5}>
                        <MDAvatar src={e.instrument.props.children === "NIFTY 50" ? niftyicon : bankniftyicon} size="sm"/>
                        </Grid>
                    
                        <Grid item xs={12} md={6} lg={5}>
                        <MDTypography fontSize={11} fontWeight="bold" display="flex" justifyContent="left" alignContent="left" alignItems="left">{e.instrument.props.children}</MDTypography>
                        <MDBox display="flex">
                            <MDTypography fontSize={10}>{e.valueChange.props.children>=0 ? '+₹' : '-₹'}{Math.abs(e.valueChange.props.children).toFixed(2)}</MDTypography>
                            <MDAvatar src={e.valueChange.props.children>=0 ? upicon : downicon} style={{width:15, height:15}} display="flex" justifyContent="left"/>
                        </MDBox>
                        </Grid>
                    
                        <Grid item xs={12} md={6} lg={4.5}>
                        <MDTypography fontSize={12} fontWeight="bold" display="flex" justifyContent="right">{e.ltp.props.children>=0 ? '+₹' : '-₹'}{Math.abs(e.ltp.props.children).toFixed(2)}</MDTypography>
                        <MDBox display="flex" justifyContent="right">
                            <MDTypography fontSize={10} display="flex" justifyContent="right">({e.percentageChange.props.children>0 ? '+' : ''}{e.percentageChange.props.children}%)</MDTypography>
                            <MDAvatar src={e.valueChange.props.children >= 0 ? upicon : downicon} style={{width:15, height:15}} display="flex" justifyContent="right"/>
                        </MDBox>   
                        </Grid>
                    </Grid>
                    
                </MDBox>
            </Grid>
            )
        })}
    </>
    )
}

export default memo(StockIndex);
