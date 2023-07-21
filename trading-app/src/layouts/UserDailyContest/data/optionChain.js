import React, { useContext, useState, useEffect } from "react";
import { memo } from 'react';
import axios from "axios";
import { debounce } from 'lodash';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MDButton from '../../../components/MDButton';
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import Chain from '../../../assets/images/chain.png'
import { Grid, MenuItem, TextField } from "@mui/material";
import BuyModel from "../../tradingCommonComponent/BuyModel";
import SellModel from "../../tradingCommonComponent/SellModel";
import { dailyContest, maxLot_BankNifty, maxLot_Nifty, maxLot_FinNifty, maxLot_Nifty_DailyContest } from "../../../variables";


const OptionChain = ({ socket, data }) => {
    let isNifty = data?.isNifty;
    let isBank = data?.isBank;
    let isFin = data?.isFin;
    let isAll = data?.isAll;
    let contestId = data?.data;

    let initialValue = isNifty ? "NIFTY50" : isBank ? "BANKNIFTY" : isFin ? "FINNIFTY" : isAll && "NIFTY50" ;
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    // console.log("initialValue", initialValue, isNifty, isBank, isFin, isAll, data?.isBank )
    const [selectIndex, setSelectIndex] = useState(initialValue);
    const [belowCE, setBelowCE] = useState([]);
    const [aboveCE, setAboveCE] = useState([]);
    const [belowPE, setBelowPE] = useState([]);
    const [abovePE, setAbovePE] = useState([]);
    const [buyState, setBuyState] = useState(false);
    const [sellState, setSellState] = useState(false);
    const [marketData, setMarketData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(()=>{
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
    })
    }, [])

    useEffect(() => {
        setIsLoading(true)
        console.log("Inside Use Effect")
        axios.get(`${baseUrl}api/v1/optionChain/${selectIndex}`, {withCredentials: true})
            .then((res) => {
                console.log(res.data)

                let belowCEData = (res.data.belowSpot).filter((elem) => {
                    return elem.instrument_type === "CE"
                })
                let belowPEData = (res.data.belowSpot).filter((elem) => {
                    return elem.instrument_type === "PE"
                })
                let aboveCEData = (res.data.aboveSpot).filter((elem) => {
                    return elem.instrument_type === "CE"
                })
                let abovePEData = (res.data.aboveSpot).filter((elem) => {
                    return elem.instrument_type === "PE"
                })
                setBelowCE(belowCEData);
                setAboveCE(aboveCEData);
                setBelowPE(belowPEData);
                setAbovePE(abovePEData);
                // setBelow(res.data.belowSpot);
                // setAbove(res.data.aboveSpot);
                setIsLoading(false)
            }).catch((err) => {
                //window.alert("Server Down");
                setTimeout(() => {
                    setIsLoading(false)
                }, 500)
                return new Error(err);
            })
    }, [selectIndex])

    useEffect(() => {
        return () => {
          socket?.close();
        }
    }, []);

    const handleClickOpen = async () => {
        setOpen(true);
    };

    const handleClose = async (e) => {

        setOpen(false);
    };

    const [hoveredRows, setHoveredRows] = useState([]);
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

    // console.log("data", data)


    return (
        <div>

            <MDButton style={{ minWidth: '100%' }} onClick={handleClickOpen}>
                <MDBox display='flex' alignItems='center'>
                    <MDBox display='flex' justifyContent='flex-start'><img src={Chain} width='40px' height='40px' /></MDBox>
                    <MDBox><MDTypography ml={1} fontSize={13} fontWeight='bold'>Option Chain</MDTypography></MDBox>
                </MDBox>
            </MDButton>
            <div>
                <Dialog
                    fullScreen={fullScreen}
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="responsive-dialog-title">
                    <DialogTitle id="responsive-dialog-title" sx={{ textAlign: 'center' }}>
                        {"Option Chain"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ display: "flex", flexDirection: "column", marginLeft: 2 }}>
                            <MDBox sx={{ display: 'flex', alignItems: 'center', marginBottom: "10px" }}>
                                <MDTypography color="dark" fontSize={15}>Select Index</MDTypography>
                                <TextField
                                    select
                                    label=""
                                    color="success"
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
                                    {(data?.isBank || data?.isAll) &&
                                    <MenuItem value={"BANKNIFTY"} minHeight="4em">
                                        {"BANKNIFTY"}
                                    </MenuItem>}

                                    {(data?.isNifty || data?.isAll) &&
                                    <MenuItem value={"NIFTY50"} minHeight="4em">
                                        {"NIFTY50"}
                                    </MenuItem>}

                                    {(data?.isFin || data?.isAll) &&
                                    <MenuItem value={"FINNIFTY"} minHeight="4em">
                                        {"FINNIFTY"}
                                    </MenuItem>}
                                </TextField>
                            </MDBox>
                            <Grid container >
                                <Grid display="flex" justifyContent="center" alignContent="center" alignItems="center" style={{ border: '1px solid white', borderRadius: 5, width: "100%" }}>

                                    <Grid container p={1} lg={5.25}>
                                        <Grid item xs={12} md={2} lg={3}>
                                            <MDTypography color="dark" fontSize={11} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">OI(Lakh)</MDTypography>
                                        </Grid>
                                        <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                            <MDTypography color="dark" fontSize={11} fontWeight="bold">Bid</MDTypography>
                                        </Grid>
                                        <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                            <MDTypography color="dark" fontSize={11} fontWeight="bold">Offer</MDTypography>
                                        </Grid>
                                        <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                            <MDTypography color="dark" fontSize={11} fontWeight="bold">LTP</MDTypography>
                                        </Grid>
                                    </Grid>

                                    <Grid container p={1} lg={1.5}>
                                        <Grid item xs={12} md={2} lg={12} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                            <MDTypography color="dark" fontSize={11} fontWeight="bold">STRIKE</MDTypography>
                                        </Grid>
                                    </Grid>

                                    <Grid container p={1} lg={5.25}>
                                        <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                            <MDTypography color="dark" fontSize={11} fontWeight="bold">LTP</MDTypography>
                                        </Grid>
                                        <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                            <MDTypography color="dark" fontSize={11} fontWeight="bold">Offer</MDTypography>
                                        </Grid>
                                        <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                            <MDTypography color="dark" fontSize={11} fontWeight="bold">Bid</MDTypography>
                                        </Grid>
                                        <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                            <MDTypography color="dark" fontSize={11} fontWeight="bold">OI(Lakh)</MDTypography>
                                        </Grid>
                                    </Grid>
                                </Grid>


                                {
                                    aboveCE?.map((elem, index) => {
                                        let maxLot = (elem.tradingsymbol)?.includes("BANKNIFTY") ? maxLot_BankNifty : (elem.tradingsymbol)?.includes("FINNIFTY") ? maxLot_FinNifty : maxLot_Nifty_DailyContest;

                                        const isRowHovered = hoveredRows.includes(index);
                                        let PE = abovePE.filter((subelem) => {
                                            return elem?.strike == subelem?.strike ;
                                        })

                                        

                                        let liveData = marketData.filter((subelem) => {
                                            return elem.instrument_token == subelem.instrument_token || elem.exchange_token == subelem.instrument_token
                                        })

                                        let liveDataPE = marketData.filter((subelem) => {
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
                                                    {isRowHovered && liveData[0]?.last_price ?
                                                        <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center">
                                                            <BuyModel isOption={true} setOpenOptionChain={setOpen} setBuyState={setBuyState} buyState={buyState} contestId={contestId} from={dailyContest} socket={socket} symbol={elem.tradingsymbol} exchange={elem.exchange} instrumentToken={elem.instrument_token} symbolName={`${elem.strike} ${elem.instrument_type}`} lotSize={elem.lot_size} maxLot={maxLot} ltp={(liveData[0]?.last_price)?.toFixed(2)} fromSearchInstrument={true} expiry={elem.expiry} exchangeInstrumentToken={elem.exchange_token} exchangeSegment={elem.segment} />
                                                            <SellModel isOption={true} setOpenOptionChain={setOpen}  setSellState={setSellState} sellState={sellState} contestId={contestId} from={dailyContest} socket={socket} symbol={elem.tradingsymbol} exchange={elem.exchange} instrumentToken={elem.instrument_token} symbolName={`${elem.strike} ${elem.instrument_type}`} lotSize={elem.lot_size} maxLot={maxLot} ltp={(liveData[0]?.last_price)?.toFixed(2)} fromSearchInstrument={true} expiry={elem.expiry} exchangeInstrumentToken={elem.exchange_token} exchangeSegment={elem.segment} />
                                                        </Grid>
                                                        :
                                                        <Grid item xs={12} md={2} lg={3}>
                                                            <MDTypography color="dark" fontSize={11} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">{liveData[0]?.last_price ? (liveData[0]?.oi / 100000)?.toFixed(2) : "-"}</MDTypography>
                                                        </Grid>
                                                    }

                                                    <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                                        <MDTypography color="dark" fontSize={11} fontWeight="bold">{liveData[0]?.last_price ? bid : "-"}</MDTypography>
                                                    </Grid>
                                                    <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                                        <MDTypography color="dark" fontSize={11} fontWeight="bold">{liveData[0]?.last_price ? offer : "-"}</MDTypography>
                                                    </Grid>
                                                    <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                                        <MDTypography color="dark" fontSize={11} fontWeight="bold">{liveData[0]?.last_price ? liveData[0]?.last_price : "-"}</MDTypography>
                                                    </Grid>
                                                </Grid>



                                                <Grid container p={1} lg={1.5} sx={{ backgroundColor: '#FFFFFF' }}>
                                                    <Grid item xs={12} md={2} lg={12} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                                        <MDTypography color="dark" fontSize={11} fontWeight="bold">{elem?.strike}</MDTypography>
                                                    </Grid>
                                                </Grid>

                                                <Grid container p={1} lg={5.25}>
                                                    <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                                        <MDTypography color="dark" fontSize={11} fontWeight="bold">{liveDataPE[0]?.last_price ? liveDataPE[0]?.last_price: "-"}</MDTypography>
                                                    </Grid>

                                                    <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                                        <MDTypography color="dark" fontSize={11} fontWeight="bold">{liveDataPE[0]?.last_price ? offerPe : "-"}</MDTypography>
                                                    </Grid>


                                                    <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                                        <MDTypography color="dark" fontSize={11} fontWeight="bold">{liveDataPE[0]?.last_price ? bidPe : "-"}</MDTypography>
                                                    </Grid>
                                                    {isRowHovered && liveDataPE[0]?.last_price ?
                                                        <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center">
                                                            <BuyModel isOption={true} setOpenOptionChain={setOpen} setBuyState={setBuyState} buyState={buyState} contestId={contestId} from={dailyContest} socket={socket} symbol={PE[0]?.tradingsymbol} exchange={PE[0]?.exchange} instrumentToken={PE[0]?.instrument_token} symbolName={`${PE[0]?.strike} ${PE[0]?.instrument_type}`} lotSize={PE[0]?.lot_size} maxLot={maxLot} ltp={(liveDataPE[0]?.last_price)?.toFixed(2)} fromSearchInstrument={true} expiry={PE[0]?.expiry} exchangeInstrumentToken={PE[0]?.exchange_token} exchangeSegment={PE[0]?.segment} />
                                                            <SellModel isOption={true} setOpenOptionChain={setOpen} setSellState={setSellState} sellState={sellState} contestId={contestId} from={dailyContest} socket={socket} symbol={PE[0]?.tradingsymbol} exchange={PE[0]?.exchange} instrumentToken={PE[0]?.instrument_token} symbolName={`${PE[0]?.strike} ${PE[0]?.instrument_type}`} lotSize={PE[0]?.lot_size} maxLot={maxLot} ltp={(liveDataPE[0]?.last_price)?.toFixed(2)} fromSearchInstrument={true} expiry={PE[0]?.expiry} exchangeInstrumentToken={PE[0]?.exchange_token} exchangeSegment={PE[0]?.segment} />

                                                        </Grid>
                                                        :
                                                        <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                                            <MDTypography color="dark" fontSize={11} fontWeight="bold">{liveDataPE[0]?.last_price ? (liveDataPE[0]?.oi / 100000)?.toFixed(2) : "-"}</MDTypography>
                                                        </Grid>
                                                    }
                                                </Grid>
                                            </Grid>

                                        )
                                    })
                                }

                                {
                                    belowCE?.map((elem, index) => {
                                        let maxLot = (elem.tradingsymbol)?.includes("BANKNIFTY") ? maxLot_BankNifty : (elem.tradingsymbol)?.includes("FINNIFTY") ? maxLot_FinNifty : maxLot_Nifty_DailyContest;
                                        const isRowHovered = hoveredRows.includes(index);

                                        let PE = belowPE.filter((subelem) => {
                                            return elem?.strike == subelem?.strike;
                                        })

                                        console.log("checking pe", elem?.instrument_type)

                                        let liveData = marketData.filter((subelem) => {
                                            return elem.instrument_token == subelem.instrument_token || elem.exchange_token == subelem.instrument_token
                                        })

                                        let liveDataPE = marketData.filter((subelem) => {
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

                                                <Grid container p={1} lg={5.25} sx={index === 0 && { backgroundColor: '#FFFFFF' }} >
                                                    {/* <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                                        <MDTypography color="dark" fontSize={11} fontWeight="bold">OI(%)</MDTypography>
                                                    </Grid> */}
                                                    {isRowHovered && liveData[0]?.last_price ?
                                                        <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center">
                                                            <BuyModel isOption={true} setOpenOptionChain={setOpen} setBuyState={setBuyState} buyState={buyState} contestId={contestId} from={dailyContest} socket={socket} symbol={elem.tradingsymbol} exchange={elem.exchange} instrumentToken={elem.instrument_token} symbolName={`${elem.strike} ${elem.instrument_type}`} lotSize={elem.lot_size} maxLot={maxLot} ltp={(liveData[0]?.last_price)?.toFixed(2)} fromSearchInstrument={true} expiry={elem.expiry} exchangeInstrumentToken={elem.exchange_token} exchangeSegment={elem.segment} />
                                                            <SellModel isOption={true} setOpenOptionChain={setOpen} setSellState={setSellState} sellState={sellState} contestId={contestId} from={dailyContest} socket={socket} symbol={elem.tradingsymbol} exchange={elem.exchange} instrumentToken={elem.instrument_token} symbolName={`${elem.strike} ${elem.instrument_type}`} lotSize={elem.lot_size} maxLot={maxLot} ltp={(liveData[0]?.last_price)?.toFixed(2)} fromSearchInstrument={true} expiry={elem.expiry} exchangeInstrumentToken={elem.exchange_token} exchangeSegment={elem.segment} />
                                                        </Grid>
                                                        :
                                                        <Grid item xs={12} md={2} lg={3}>
                                                            <MDTypography color="dark" fontSize={11} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">{liveData[0]?.last_price ? (liveData[0]?.oi / 100000)?.toFixed(2) : "-"}</MDTypography>
                                                        </Grid>
                                                    }
                                                    <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                                        <MDTypography color="dark" fontSize={11} fontWeight="bold">{liveData[0]?.last_price ? bid : "-"}</MDTypography>
                                                    </Grid>
                                                    <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                                        <MDTypography color="dark" fontSize={11} fontWeight="bold">{liveData[0]?.last_price ? offer : "-"}</MDTypography>
                                                    </Grid>
                                                    <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                                        <MDTypography color="dark" fontSize={11} fontWeight="bold">{liveData[0]?.last_price ? liveData[0]?.last_price : "-"}</MDTypography>
                                                    </Grid>
                                                </Grid>

                                                <Grid container p={1} lg={1.5} sx={{ backgroundColor: '#FFFFFF' }}>
                                                    <Grid item xs={12} md={2} lg={12} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                                        <MDTypography color="dark" fontSize={11} fontWeight="bold">{elem?.strike}</MDTypography>
                                                    </Grid>
                                                </Grid>
                                                <Grid container p={1} lg={5.25} sx={index !== 0 ? { backgroundColor: '#FFFFE0' } : { backgroundColor: '#FFFFFF' }}>
                                                    <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                                        <MDTypography color="dark" fontSize={11} fontWeight="bold">{liveDataPE[0]?.last_price ? liveDataPE[0]?.last_price : "-"}</MDTypography>
                                                    </Grid>
                                                    <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                                        <MDTypography color="dark" fontSize={11} fontWeight="bold">{liveDataPE[0]?.last_price ? offerPe : "-"}</MDTypography>
                                                    </Grid>
                                                    <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                                        <MDTypography color="dark" fontSize={11} fontWeight="bold">{liveDataPE[0]?.last_price ? bidPe : "-"}</MDTypography>
                                                    </Grid>
                                                    {isRowHovered && liveDataPE[0]?.last_price ?
                                                        <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center">
                                                            <BuyModel isOption={true} setOpenOptionChain={setOpen} setBuyState={setBuyState} buyState={buyState} contestId={contestId} from={dailyContest} socket={socket} symbol={PE[0]?.tradingsymbol} exchange={PE[0]?.exchange} instrumentToken={PE[0]?.instrument_token} symbolName={`${PE[0]?.strike} ${PE[0]?.instrument_type}`} lotSize={PE[0]?.lot_size} maxLot={maxLot} ltp={(liveDataPE[0]?.last_price)?.toFixed(2)} fromSearchInstrument={true} expiry={PE[0]?.expiry} exchangeInstrumentToken={PE[0]?.exchange_token} exchangeSegment={PE[0]?.segment} />
                                                            <SellModel isOption={true} setOpenOptionChain={setOpen} setSellState={setSellState} sellState={sellState} contestId={contestId} from={dailyContest} socket={socket} symbol={PE[0]?.tradingsymbol} exchange={PE[0]?.exchange} instrumentToken={PE[0]?.instrument_token} symbolName={`${PE[0]?.strike} ${PE[0]?.instrument_type}`} lotSize={PE[0]?.lot_size} maxLot={maxLot} ltp={(liveDataPE[0]?.last_price)?.toFixed(2)} fromSearchInstrument={true} expiry={PE[0]?.expiry} exchangeInstrumentToken={PE[0]?.exchange_token} exchangeSegment={PE[0]?.segment} />
                                                        </Grid>
                                                        :
                                                        <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                                            <MDTypography color="dark" fontSize={11} fontWeight="bold">{liveDataPE[0]?.last_price ? (liveDataPE[0]?.oi / 100000)?.toFixed(2) : "-"}</MDTypography>
                                                        </Grid>
                                                    }
                                                    {/* <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                                        <MDTypography color="dark" fontSize={11} fontWeight="bold">OI(%)</MDTypography>
                                                    </Grid> */}
                                                </Grid>
                                            </Grid>

                                        )
                                    })
                                }

                            </Grid>
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
            </div >
        </div >
    );
}

export default memo(OptionChain);