import React from "react";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
// import { userContext } from '../../../AuthContext';
import moment from 'moment';
//

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import {CircularProgress, MenuItem, TextField} from "@mui/material";
import { Grid } from "@mui/material";
import BuyModel from "../../tradingCommonComponent/BuyModel";
import SellModel from "../../tradingCommonComponent/SellModel";
import { debounce } from 'lodash';
import {dailyContest, maxLot_BankNifty, maxLot_Nifty, maxLot_FinNifty, maxLot_Nifty_DailyContest} from "../../../variables";


export default function OptionChainTable({socket, setShowChain}) {
  console.log("socket 4th", socket.id)
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  const [isLoading,setIsLoading] = useState(false);
  const [selectIndex, setSelectIndex] = useState("NIFTY50");
  const [belowCE, setBelowCE] = useState([]);
  const [aboveCE, setAboveCE] = useState([]);
  const [belowPE, setBelowPE] = useState([]);
  const [abovePE, setAbovePE] = useState([]);
  const [buyState, setBuyState] = useState(false);
  const [sellState, setSellState] = useState(false);


  const [marketData, setMarketData] = useState([]);

  // const getDetails = useContext(userContext);
  // console.log("getDetails", getDetails)
//   let url = selectIndex === "Today" ? "infinityTrade/live/userorderstoday" : "infinityTrade/live/userorders";
useEffect(()=>{

  axios.get(`${baseUrl}api/v1/getliveprice`)
  .then((res) => {
      //console.log("live price data", res)
      setMarketData(res.data);
      // setDetails.setMarketData(data);
  }).catch((err) => {
      return new Error(err);
  })
  socket.emit("company-ticks", true)
  socket.on("tick", (data) => {
    console.log("this is live market data", data);
    setMarketData(prevInstruments => {
      const instrumentMap = new Map(prevInstruments.map(instrument => [instrument.instrument_token, instrument]));
      data.forEach(instrument => {
        instrumentMap.set(instrument.instrument_token, instrument);
      });
      return Array.from(instrumentMap.values());
    });
    // setDetails.setMarketData(data);
  })
}, [])

  useEffect(()=>{
      setIsLoading(true)
      console.log("Inside Use Effect")
      axios.get(`${baseUrl}api/v1/optionChain/${selectIndex}`)
      .then((res)=>{
          console.log(res.data)

          let belowCEData = (res.data.belowSpot).filter((elem)=>{
            return elem.instrument_type === "CE"
          })
          let belowPEData = (res.data.belowSpot).filter((elem)=>{
            return elem.instrument_type === "PE"
          })
          let aboveCEData = (res.data.aboveSpot).filter((elem)=>{
            return elem.instrument_type === "CE"
          })
          let abovePEData = (res.data.aboveSpot).filter((elem)=>{
            return elem.instrument_type === "PE"
          })
          setBelowCE(belowCEData);
          setAboveCE(aboveCEData);
          setBelowPE(belowPEData);
          setAbovePE(abovePEData);
          // setBelow(res.data.belowSpot);
          // setAbove(res.data.aboveSpot);
          setIsLoading(false)
      }).catch((err)=>{
          //window.alert("Server Down");
          setTimeout(()=>{
            setIsLoading(false)
          },500) 
          return new Error(err);
      })
  },[selectIndex])

  // useEffect(() => {
  //   return () => {
  //     socket?.close();
  //   }
  // }, []);

  // console.log("liveData", marketData)

  const [hoveredRows, setHoveredRows] = useState([]);

  // const handleMouseOver = (index) => {
  //   // setHoveredRows((prevHoveredRows) => [...prevHoveredRows, index]);
  //   setHoveredRows([index]);

  // };

  // const handleMouseLeave = (index) => {
  //   // setHoveredRows((prevHoveredRows) =>
  //   //   prevHoveredRows.filter((rowIndex) => rowIndex !== index)
  //   // );
  //   setHoveredRows([]);
  // };

  const handleMouseOver = debounce((index) => {
    // setHoveredRows((prevHoveredRows) => [...prevHoveredRows, index]);
    setHoveredRows([index]);
  }, 250);
  
  const handleMouseLeave = debounce((index) => {
    // setHoveredRows((prevHoveredRows) =>
    //   prevHoveredRows.filter((rowIndex) => rowIndex !== index)
    // );
    setHoveredRows([]);
  }, 250);
console.log("hoveredRows", hoveredRows)

  return (

    <MDBox bgColor="light" color="light" mb={0} borderRadius={10} minWidth='100%' minHeight='auto' width="100%">
      <MDBox sx={{ display: 'flex', alignItems: 'center', marginBottom: "10px" }}>
        <MDTypography color="dark" fontSize={15}>Select Index</MDTypography>
        <TextField
          select
          label=""
          color= "success"
          value={selectIndex}
          minHeight="4em"
          // helperText="Please select subscription"
          InputProps={{
            style: { color: "dark" } // Change the color value to the desired text color
          }}
          sx={{
            marginLeft: 1,
            padding: 1,
            width: "150px"
          }}
          variant="outlined"
          // sx={{ marginḶeft: 1, padding: 1, width: "150px", color: "success" }}
          onChange={(e) => { setSelectIndex(e.target.value) }}
        >
          <MenuItem value={"BANKNIFTY"} minHeight="4em">
            {"BANKNIFTY"}
          </MenuItem>
          <MenuItem value={"NIFTY50"} minHeight="4em">
            {"NIFTY50"}
          </MenuItem>
          <MenuItem value={"FINNIFTY"} minHeight="4em">
            {"FINNIFTY"}
          </MenuItem>
        </TextField>
      </MDBox>
      <Grid container >
        <Grid display="flex" justifyContent="center" alignContent="center" alignItems="center" style={{ border: '1px solid white', borderRadius: 5, width: "100%" }}>

          <Grid container p={1} lg={5.25}>
            <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="dark" fontSize={11} fontWeight="bold">OI(%)</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={2.4}>
              <MDTypography color="dark" fontSize={11} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">OI(Lakh)</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="dark" fontSize={11} fontWeight="bold">Bid</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="dark" fontSize={11} fontWeight="bold">Offer</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="dark" fontSize={11} fontWeight="bold">LTP</MDTypography>
            </Grid>
          </Grid>

          <Grid container p={1} lg={1.5}>
            <Grid item xs={12} md={2} lg={12} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="dark" fontSize={11} fontWeight="bold">STRIKE</MDTypography>
            </Grid>
          </Grid>

          <Grid container p={1} lg={5.25}>
            <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="dark" fontSize={11} fontWeight="bold">LTP</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="dark" fontSize={11} fontWeight="bold">Offer</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="dark" fontSize={11} fontWeight="bold">Bid</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="dark" fontSize={11} fontWeight="bold">OI(Lakh)</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="dark" fontSize={11} fontWeight="bold">OI(%)</MDTypography>
            </Grid>
          </Grid>
        </Grid>

        
            {
              aboveCE?.map((elem, index)=>{
                let maxLot = (elem.tradingsymbol)?.includes("BANKNIFTY") ? maxLot_BankNifty : (elem.tradingsymbol)?.includes("FINNIFTY") ? maxLot_FinNifty : maxLot_Nifty_DailyContest;

                const isRowHovered = hoveredRows.includes(index);
                let PE = abovePE.filter((subelem)=>{
                  return elem.strike == subelem.strike
                })

                let liveData = marketData.filter((subelem)=>{
                  return elem.instrument_token == subelem.instrument_token || elem.exchange_token == subelem.instrument_token
                })

                let liveDataPE = marketData.filter((subelem)=>{
                  return PE[0]?.instrument_token == subelem.instrument_token || PE[0]?.exchange_token == subelem.instrument_token
                })


                let bid = liveData[0]?.depth?.buy[0]?.price
                let offer = liveData[0]?.depth?.sell[0]?.price

                let bidPe = liveDataPE[0]?.depth?.buy[0]?.price
                let offerPe = liveDataPE[0]?.depth?.sell[0]?.price

                // const typecolor = elem?.buyOrSell === 'BUY' ? 'success' : 'error'
                console.log("is hover", elem.isHover)
                return (
                  <Grid
                    onMouseOver={() => handleMouseOver(index)}
                    onMouseLeave={() => handleMouseLeave(index)} 
                    display="flex" justifyContent="center" alignContent="center" alignItems="center" style={{ border: '1px solid white', borderRadius: 5, width: "100%", cursor: "pointer" }}>
                    
                    <Grid container p={1} lg={5.25} sx={{ backgroundColor: '#FFFFE0' }}>
                      <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color="dark" fontSize={11} fontWeight="bold">OI(%)</MDTypography>
                      </Grid>
                      {isRowHovered ?
                        <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center">
                          <BuyModel setBuyState={setBuyState} buyState={buyState} contestId={"64915f71a276d74a55f5d1a3"} from={dailyContest} socket={socket} symbol={elem.tradingsymbol} exchange={elem.exchange} instrumentToken={elem.instrument_token} symbolName={`${elem.strike} ${elem.instrument_type}`} lotSize={elem.lot_size} maxLot={maxLot} ltp={(liveData[0]?.last_price)?.toFixed(2)} fromSearchInstrument={true} expiry={elem.expiry} exchangeInstrumentToken={elem.exchange_token} exchangeSegment={elem.segment} />
                          <SellModel setSellState={setSellState} sellState={sellState} contestId={"64915f71a276d74a55f5d1a3"} from={dailyContest} socket={socket} symbol={elem.tradingsymbol} exchange={elem.exchange} instrumentToken={elem.instrument_token} symbolName={`${elem.strike} ${elem.instrument_type}`} lotSize={elem.lot_size} maxLot={maxLot} ltp={(liveData[0]?.last_price)?.toFixed(2)} fromSearchInstrument={true} expiry={elem.expiry} exchangeInstrumentToken={elem.exchange_token} exchangeSegment={elem.segment} />
                        </Grid>
                        :
                        <Grid item xs={12} md={2} lg={2.4}>
                          <MDTypography color="dark" fontSize={11} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">{(liveData[0]?.oi / 100000)?.toFixed(2)}</MDTypography>
                        </Grid>
                      }

                      <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color="dark" fontSize={11} fontWeight="bold">{bid}</MDTypography>
                      </Grid>
                      <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color="dark" fontSize={11} fontWeight="bold">{offer}</MDTypography>
                      </Grid>
                      <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color="dark" fontSize={11} fontWeight="bold">{liveData[0]?.last_price}</MDTypography>
                      </Grid>
                    </Grid>



                    <Grid container p={1} lg={1.5} sx={{ backgroundColor: '#FFFFFF' }}>
                      <Grid item xs={12} md={2} lg={12} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color="dark" fontSize={11} fontWeight="bold">{elem?.strike}</MDTypography>
                      </Grid>
                    </Grid>

                    <Grid container p={1} lg={5.25}>
                      <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color="dark" fontSize={11} fontWeight="bold">{liveDataPE[0]?.last_price}</MDTypography>
                      </Grid>

                        <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                          <MDTypography color="dark" fontSize={11} fontWeight="bold">{offerPe}</MDTypography>
                        </Grid>
                      

                      <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color="dark" fontSize={11} fontWeight="bold">{bidPe}</MDTypography>
                      </Grid>
                      {isRowHovered ?
                        <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center">
                          <BuyModel setBuyState={setBuyState} buyState={buyState} contestId={"64915f71a276d74a55f5d1a3"} from={dailyContest} socket={socket} symbol={elem.tradingsymbol} exchange={elem.exchange} instrumentToken={elem.instrument_token} symbolName={`${elem.strike} ${elem.instrument_type}`} lotSize={elem.lot_size} maxLot={maxLot} ltp={(liveDataPE[0]?.last_price)?.toFixed(2)} fromSearchInstrument={true} expiry={elem.expiry} exchangeInstrumentToken={elem.exchange_token} exchangeSegment={elem.segment} />
                          <SellModel setSellState={setSellState} sellState={sellState} contestId={"64915f71a276d74a55f5d1a3"} from={dailyContest} socket={socket} symbol={elem.tradingsymbol} exchange={elem.exchange} instrumentToken={elem.instrument_token} symbolName={`${elem.strike} ${elem.instrument_type}`} lotSize={elem.lot_size} maxLot={maxLot} ltp={(liveDataPE[0]?.last_price)?.toFixed(2)} fromSearchInstrument={true} expiry={elem.expiry} exchangeInstrumentToken={elem.exchange_token} exchangeSegment={elem.segment} />
                          
                        </Grid>
                        :
                        <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                          <MDTypography color="dark" fontSize={11} fontWeight="bold">{(liveDataPE[0]?.oi / 100000)?.toFixed(2)}</MDTypography>
                        </Grid>
                      }
                      <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color="dark" fontSize={11} fontWeight="bold">OI(%)</MDTypography>
                      </Grid>
                    </Grid>
                  </Grid>

                )
              })
            }

            {
              belowCE?.map((elem, index)=>{
                let maxLot = (elem.tradingsymbol)?.includes("BANKNIFTY") ? maxLot_BankNifty : (elem.tradingsymbol)?.includes("FINNIFTY") ? maxLot_FinNifty : maxLot_Nifty_DailyContest;
                const isRowHovered = hoveredRows.includes(index);

                let PE = belowPE.filter((subelem)=>{
                  return elem.strike == subelem.strike
                })

                let liveData = marketData.filter((subelem)=>{
                  return elem.instrument_token == subelem.instrument_token || elem.exchange_token == subelem.instrument_token
                })

                let liveDataPE = marketData.filter((subelem)=>{
                  return PE[0]?.instrument_token == subelem.instrument_token || PE[0]?.exchange_token == subelem.instrument_token
                })

                // console.log("liveData", liveData)
                let bid = liveData[0]?.depth?.buy[0]?.price
                let offer = liveData[0]?.depth?.sell[0]?.price

                let bidPe = liveDataPE[0]?.depth?.buy[0]?.price
                let offerPe = liveDataPE[0]?.depth?.sell[0]?.price

                // const typecolor = elem?.buyOrSell === 'BUY' ? 'success' : 'error'
                return (
                  <Grid  
                    onMouseOver={() => handleMouseOver(index)}
                    onMouseLeave={() => handleMouseLeave(index)} 
                    display="flex" justifyContent="center" alignContent="center" alignItems="center" style={{ border: '1px solid white', borderRadius: 5, width: "100%", cursor: "pointer", }}>

                    <Grid container p={1} lg={5.25} sx = {index === 0 && { backgroundColor: '#FFFFFF' }} >
                      <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color="dark" fontSize={11} fontWeight="bold">OI(%)</MDTypography>
                      </Grid>
                      {isRowHovered ?
                        <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center">
                          <BuyModel setBuyState={setBuyState} buyState={buyState} contestId={"64915f71a276d74a55f5d1a3"} from={dailyContest} socket={socket} symbol={elem.tradingsymbol} exchange={elem.exchange} instrumentToken={elem.instrument_token} symbolName={`${elem.strike} ${elem.instrument_type}`} lotSize={elem.lot_size} maxLot={maxLot} ltp={(liveData[0]?.last_price)?.toFixed(2)} fromSearchInstrument={true} expiry={elem.expiry} exchangeInstrumentToken={elem.exchange_token} exchangeSegment={elem.segment} />
                          <SellModel setSellState={setSellState} sellState={sellState} contestId={"64915f71a276d74a55f5d1a3"} from={dailyContest} socket={socket} symbol={elem.tradingsymbol} exchange={elem.exchange} instrumentToken={elem.instrument_token} symbolName={`${elem.strike} ${elem.instrument_type}`} lotSize={elem.lot_size} maxLot={maxLot} ltp={(liveData[0]?.last_price)?.toFixed(2)} fromSearchInstrument={true} expiry={elem.expiry} exchangeInstrumentToken={elem.exchange_token} exchangeSegment={elem.segment} />
                        </Grid>
                        :
                        <Grid item xs={12} md={2} lg={2.4}>
                          <MDTypography color="dark" fontSize={11} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">{(liveData[0]?.oi / 100000)?.toFixed(2)}</MDTypography>
                        </Grid>
                      }
                      <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color="dark" fontSize={11} fontWeight="bold">{bid}</MDTypography>
                      </Grid>
                      <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color="dark" fontSize={11} fontWeight="bold">{offer}</MDTypography>
                      </Grid>
                      <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color="dark" fontSize={11} fontWeight="bold">{liveData[0]?.last_price}</MDTypography>
                      </Grid>
                    </Grid>

                    <Grid container p={1} lg={1.5} sx={ { backgroundColor: '#FFFFFF' }}>
                      <Grid item xs={12} md={2} lg={12} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color="dark" fontSize={11} fontWeight="bold">{elem?.strike}</MDTypography>
                      </Grid>
                    </Grid>
                    {/* sx={{ backgroundColor: '#FFFFE0' }} */}
                    <Grid container p={1} lg={5.25} sx={index !== 0 ? { backgroundColor: '#FFFFE0' } : { backgroundColor: '#FFFFFF' }}>
                      <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color="dark" fontSize={11} fontWeight="bold">{liveDataPE[0]?.last_price}</MDTypography>
                      </Grid>
                      <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color="dark" fontSize={11} fontWeight="bold">{offerPe}</MDTypography>
                      </Grid>
                      <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color="dark" fontSize={11} fontWeight="bold">{bidPe}</MDTypography>
                      </Grid>
                      {isRowHovered ?
                        <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center">
                          <BuyModel setBuyState={setBuyState} buyState={buyState} contestId={"64915f71a276d74a55f5d1a3"} from={dailyContest} socket={socket} symbol={elem.tradingsymbol} exchange={elem.exchange} instrumentToken={elem.instrument_token} symbolName={`${elem.strike} ${elem.instrument_type}`} lotSize={elem.lot_size} maxLot={maxLot} ltp={(liveDataPE[0]?.last_price)?.toFixed(2)} fromSearchInstrument={true} expiry={elem.expiry} exchangeInstrumentToken={elem.exchange_token} exchangeSegment={elem.segment} />
                          <SellModel setSellState={setSellState} sellState={sellState} contestId={"64915f71a276d74a55f5d1a3"} from={dailyContest} socket={socket} symbol={elem.tradingsymbol} exchange={elem.exchange} instrumentToken={elem.instrument_token} symbolName={`${elem.strike} ${elem.instrument_type}`} lotSize={elem.lot_size} maxLot={maxLot} ltp={(liveDataPE[0]?.last_price)?.toFixed(2)} fromSearchInstrument={true} expiry={elem.expiry} exchangeInstrumentToken={elem.exchange_token} exchangeSegment={elem.segment} />
                        </Grid>
                        :
                        <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                          <MDTypography color="dark" fontSize={11} fontWeight="bold">{(liveDataPE[0]?.oi / 100000)?.toFixed(2)}</MDTypography>
                        </Grid>
                      }
                      <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color="dark" fontSize={11} fontWeight="bold">OI(%)</MDTypography>
                      </Grid>
                    </Grid>
                  </Grid>

                )
              })
            }

      </Grid>
    </MDBox>

  );
}
