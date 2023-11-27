import React,{useState, useEffect, memo, useContext} from 'react'
// import MDBox from '../../../../components/MDBox'
import Grid from '@mui/material/Grid'
import MDTypography from '../../../../components/MDTypography'
// import Logo from '../../../assets/images/logo1.jpeg'
// import { Divider } from '@mui/material'
// import { HiUserGroup } from 'react-icons/hi';
// import { Link } from 'react-router-dom';
// import TaskAltIcon from '@mui/icons-material/TaskAlt';
// import { useLocation } from 'react-router-dom'; marketDetails.contestMarketData
import axios from "axios";
import  { marketDataContext } from '../../../../MarketDataContext';
import BuyModel from "./BuyModel";
import SellModel from "./SellModel";
import { CircularProgress } from "@mui/material";
import MDButton from "../../../../components/MDButton";
import { renderContext } from '../../../../renderContext';



function InstrumentsData({contestId, socket, portfolioId, Render, isFromHistory}){

// let Details = useContext(marketDetails.contestMarketDataContext);
    const {render, setRender} = useContext(renderContext);
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
    const [instrumentData, setInstrumentData] = useState([]);
    // const [marketDetails.contestMarketData, marketDetails.setContestMarketData] = useState([]);
    const [isLoading,setIsLoading] = useState(true)
    // const {render, setRender} = Render;
    const marketDetails = useContext(marketDataContext)
    const [buyState, setBuyState] = useState(false);
    const [sellState, setSellState] = useState(false);
  


    useEffect(()=>{
        axios.get(`${baseUrl}api/v1/getliveprice`)
        .then((res) => {
          marketDetails.setContestMarketData(res.data);
        }).catch((err) => {
            return new Error(err);
        })
        // socket.on('check', (data)=>{
        //   console.log("data from socket in instrument in parent", data)
        // })
        // socket.on("connect", () => {
            console.log("in event 2")
            socket.emit('userId', contestId)
    
            // socket.emit('contest', contestId)
            socket.emit("contest", true)
        //   })
        // socket.on("tick", (data) => {
        socket.on("contest-ticks", (data) => {
          console.log('data from socket in instrument in parent', data);
          marketDetails.setContestMarketData(prevInstruments => {
            const instrumentMap = new Map(prevInstruments.map(instrument => [instrument.instrument_token, instrument]));
            data.forEach(instrument => {
              instrumentMap.set(instrument.instrument_token, instrument);
            });
            return Array.from(instrumentMap.values());
          });
    
        })
    }, [])

    
    // useEffect(() => {
    //     return () => {
    //         socket.close();
    //     }
    // }, [])

    useEffect(()=>{
        // console.log("contestId", contestId)
        axios.get(`${baseUrl}api/v1/contestInstrument/${contestId}`,{
          withCredentials: true,
          headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true
          },
        })
        .then((res) => {
            setInstrumentData(res.data)
            setIsLoading(false)
        }).catch((err) => {
            return new Error(err);
        })
        render ? setRender(false) : setRender(true)
        // setTimeout(()=>{setIsLoading(false)},500)

    }, [])

    function getDaySuffix(day) {
        if (day >= 11 && day <= 13) {
          return 'th';
        }
        switch (day % 10) {
          case 1: return 'st';
          case 2: return 'nd';
          case 3: return 'rd';
          default: return 'th';
        }
    }

    const handleSellClick = (index) => {
        setSellState(true)
        const newRows = [...instrumentData];
        newRows[index].sellState = true;
        instrumentData = (newRows);
      };
      const handleBuyClick = (index) => {
        setBuyState(true)
        const newRows = [...instrumentData];
        newRows[index].sellState = true;
        instrumentData = (newRows);
      };
    // console.log("instrument", contestId, portfolioId, marketDetails.contestMarketData)

return (
    <>
        <Grid container>
            <Grid item xs={12} md={12} lg={12}>
                <MDTypography fontSize={13} color="light">Instruments</MDTypography>
            </Grid>
        </Grid>


        {isLoading ?
        <Grid mt={1} mb={1} display="flex" width="100%" justifyContent="center" alignItems="center">
            <CircularProgress color="light" />
        </Grid>

        :
        <>

        <Grid container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
            
            <Grid item xs={12} md={12} lg={2.5} display="flex" justifyContent="center">
                <MDTypography fontSize={13} color="light" style={{fontWeight:700, fontSize: "10px"}}>Contract Date</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                <MDTypography fontSize={13} color="light" style={{fontWeight:700, fontSize: "10px"}}>Symbol</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
                <MDTypography fontSize={13} color="light" style={{fontWeight:700, fontSize: "10px"}}>LTP</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
                <MDTypography fontSize={13} color="light" style={{fontWeight:700, fontSize: "10px"}}>Change(%)</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
            <MDTypography fontSize={13} color="light" style={{fontWeight:700, fontSize: "10px"}}>Buy</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={0.5} display="flex" justifyContent="center">
            
            </Grid>

            <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
                <MDTypography fontSize={13} color="light" style={{fontWeight:700, fontSize: "10px"}}>Sell</MDTypography>
            </Grid>

        </Grid>

        {instrumentData.map((elem, index)=>{
            elem.sellState = false;
            elem.buyState = false;
            let perticularInstrumentMarketData = marketDetails.contestMarketData.filter((subelem)=>{
                return elem.instrumentToken === subelem.instrument_token
            })
            const date = new Date(elem.contractDate);
            const options = { day: 'numeric', month: 'short' };
            const formattedDate = date.toLocaleDateString('en-US', options);
            const day = formattedDate.split(' ')[1];
            const month = formattedDate.split(' ')[0];
            // console.log();
            return(
            <Grid container mt={1} p={1} style={{border:'1px solid white',borderRadius:4}} alignItems="center">
        
                <Grid item xs={12} md={12} lg={2.5} display="flex" justifyContent="center">
                    <MDTypography fontSize={13} color="light" style={{fontWeight:500, fontSize: "10px"}}>{`${day}${getDaySuffix(day)} ${month}`}</MDTypography>
                </Grid>
    
                <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                    <MDTypography fontSize={13} color="light" style={{fontWeight:500, fontSize: "10px"}}>{elem.symbol}</MDTypography>
                </Grid>
    
                <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
                    <MDTypography fontSize={13} color="light" style={{fontWeight:500, fontSize: "10px"}}>{"₹"+(perticularInstrumentMarketData[0]?.last_price)?.toFixed(2)}</MDTypography>
                </Grid>
    
                {perticularInstrumentMarketData[0]?.change !== undefined ?
                <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
                    <MDTypography fontSize={13} color="light" style={{fontWeight:500, fontSize: "10px"}}>
                        {perticularInstrumentMarketData[0]?.change >= 0 ? "+" + ((perticularInstrumentMarketData[0]?.change)?.toFixed(2))+"%" : ((perticularInstrumentMarketData[0]?.change)?.toFixed(2))+"%"}
                    </MDTypography>
                </Grid>
                :
                <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
                    <MDTypography fontSize={13} color="light" style={{fontWeight:500, fontSize: "10px"}}>
                        {(((perticularInstrumentMarketData[0]?.last_price - perticularInstrumentMarketData[0]?.average_price) / perticularInstrumentMarketData[0]?.average_price)*100) >= 0 ? "+" + (((perticularInstrumentMarketData[0]?.last_price - perticularInstrumentMarketData[0]?.average_price) / perticularInstrumentMarketData[0]?.average_price)*100)?.toFixed(2)+"%" : (((perticularInstrumentMarketData[0]?.last_price - perticularInstrumentMarketData[0]?.average_price) / perticularInstrumentMarketData[0]?.average_price)*100)?.toFixed(2)+"%"}
                    </MDTypography>
                </Grid>
                }

    
                <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
                {!elem.buyState ?
                    <BuyModel 
                    setBuyState={setBuyState}
                    buyState={buyState}
                    render={render} 
                    setRender={setRender} 
                    symbol={elem.symbol} 
                    exchange={elem.exchange} 
                    instrumentToken={elem.instrumentToken} 
                    symbolName={elem.instrument} 
                    lotSize={elem.lotSize} 
                    maxLot={elem.maxLot} 
                    ltp={(perticularInstrumentMarketData[0]?.last_price)?.toFixed(2)} 
                    contestId={contestId} 
                    portfolioId={portfolioId}
                    isFromHistory={isFromHistory}
                    />
                    :
                    <MDButton  size="small" color="info" sx={{marginRight:0.5,minWidth:2,minHeight:3}} onClick={()=>{handleBuyClick(index)}} >
                    B
                    </MDButton>
                }


                </Grid>

                <Grid item xs={12} md={12} lg={0.5} display="flex" justifyContent="center">
                </Grid>

                <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
                {!elem.sellState ?
                    <SellModel 
                    setSellState={setSellState}
                    sellState={sellState}
                    render={render} 
                    setRender={setRender} 
                    symbol={elem.symbol} 
                    exchange={elem.exchange} 
                    instrumentToken={elem.instrumentToken} 
                    symbolName={elem.instrument} 
                    lotSize={elem.lotSize} 
                    maxLot={elem.maxLot} 
                    ltp={(perticularInstrumentMarketData[0]?.last_price)?.toFixed(2)} 
                    contestId={contestId} 
                    portfolioId={portfolioId}
                    isFromHistory={isFromHistory}
                    />
                    :
                    <MDButton  size="small" color="error" sx={{marginRight:0.5,minWidth:2,minHeight:3}} onClick={()=>{handleSellClick(index)}} >
                    S
                    </MDButton>
                }
                    
                    

                </Grid>
    
            </Grid>
            )
        })}
        </>
        }
    </>
);
}

export default memo(InstrumentsData);