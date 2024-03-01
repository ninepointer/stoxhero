import { useState, useEffect } from "react"
import axios from "axios"
// @mui material components
import Switch from '@mui/material/Switch';
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
// Material Dashboard 2 React examples
import DataTable from "../../../examples/Tables/DataTable";
import {apiUrl} from '../../../constants/constants';

function LiveTraderwiseCompantPNL(props) {
    const [isLive, setIsLive] = useState(false);
    const [action, setAction] = useState(false);
    const label = { inputProps: { 'aria-label': 'Switch demo' } };
    const getContest = async() =>{
        const res = await axios.get(`${apiUrl}dailycontest/contest/${props.id}`, {withCredentials:true});
        console.log('live status', res.data.data);
        if(res?.data?.data?.currentLiveStatus == 'Live'){
            console.log('setting live')
            setIsLive(true);
        }
    }
    const switchToMock = async() =>{
        if(isLive){
            const id = props.id;
            try{
                const res = await axios.get(`${baseUrl}api/v1/switchRealToMockContest/${id}`, {withCredentials:true});
                if(res.status == 200){
                setIsLive(false);
                setAction(!action);
                }
                console.log(res.data);
            }catch(e){
                console.log(e);
            }
        }
    }

    useEffect(()=>{
        getContest();
    },[action]);

    let columns = [
        { Header: "Trader Name", accessor: "traderName", width: "15%", align: "center" },
        { Header: "Gross P&L", accessor: "grossPnl", width: "12.5%", align: "center" },
        { Header: "# of Trades", accessor: "noOfTrade", width: "12.5%", align: "center" },
        { Header: "Running Lots", accessor: "runningLots", width: "12.5%", align: "center" },
        { Header: "Abs.Running Lots", accessor: "absRunningLots", width: "12.5%", align: "center" },
        { Header: "Lots Used", accessor: "lotUsed", width: "12.5%", align: "center" },
        { Header: "Brokerage", accessor: "brokerage", width: "12.5%", align: "center" },
        { Header: "Net P&L", accessor: "netPnl", width: "12.5%", align: "center" },
    ]

    let rows = []

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

    const [allTrade, setAllTrade] = useState([]);
    const [marketData, setMarketData] = useState([]);
    const [trackEvent, setTrackEvent] = useState({});

    useEffect(() => {

        axios.get(`${baseUrl}api/v1/getliveprice`)
            .then((res) => {
                //console.log("live price data", res)
                setMarketData(res.data);
                // setDetails.setMarketData(data);
            }).catch((err) => {
                return new Error(err);
            })

        props.socket.on("tick", (data) => {
            //console.log("this is live market data", data);
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

    useEffect(() => {

        axios.get(`${baseUrl}api/v1/dailycontest/live/traderWiseCompany/${props.id}`, {withCredentials: true})
            .then((res) => {
                setAllTrade(res.data.data);
            }).catch((err) => {
                return new Error(err);
            })
    }, [trackEvent])

    useEffect(() => {
        props.socket.on('updatePnl', (data) => {
            // console.log("in the pnl event", data)
            setTimeout(() => {
                setTrackEvent(data);
            })
        })
    }, [])


    if (allTrade.length !== 0) {
        let mapForParticularUser = new Map();
        for (let i = 0; i < allTrade.length; i++) {
            if (mapForParticularUser.has(allTrade[i].traderId)) {
                let marketDataInstrument = marketData.filter((elem) => {
                    return (elem.instrument_token == Number(allTrade[i].symbol) || elem.instrument_token == Number(allTrade[i].exchangeInstrumentToken))
                })

                let obj = mapForParticularUser.get(allTrade[i].traderId)
                obj.totalPnl += ((allTrade[i].amount + ((allTrade[i].lots) * marketDataInstrument[0]?.last_price)));
                obj.lotUsed += Math.abs(allTrade[i].lotUsed)
                obj.runninglots += allTrade[i].lots;
                obj.brokerage += allTrade[i].brokerage;
                obj.noOfTrade += allTrade[i].trades;
                obj.absRunninglots += Math.abs(allTrade[i].lots);

            } else {
                let marketDataInstrument = marketData.filter((elem) => {
                    return elem !== undefined && (elem.instrument_token == Number(allTrade[i].symbol) || elem.instrument_token == Number(allTrade[i].exchangeInstrumentToken))
                })
                mapForParticularUser.set(allTrade[i].traderId, {
                    name: allTrade[i].traderName,
                    totalPnl: ((allTrade[i].amount + ((allTrade[i].lots) * marketDataInstrument[0]?.last_price))),
                    lotUsed: Math.abs(allTrade[i].lotUsed),
                    runninglots: allTrade[i].lots,
                    absRunninglots: Math.abs(allTrade[i].lots),
                    brokerage: allTrade[i].brokerage,
                    noOfTrade: allTrade[i].trades,
                    userId: allTrade[i].traderId,
                    algoName: allTrade[i].algoName
                })
            }
        }


        let finalTraderPnl = [];
        for (let value of mapForParticularUser.values()) {
            finalTraderPnl.push(value);
        }

        finalTraderPnl.sort((a, b) => {
            return (b.totalPnl - b.brokerage) - (a.totalPnl - a.brokerage)
        });

        // console.log("finalTraderPnl", finalTraderPnl)


        let totalGrossPnlGrid = 0;
        let totalTransactionCost = 0;
        let totalNoRunningLots = 0;
        let totalTrades = 0;
        let totalLotsUsed = 0;
        let totalTraders = 0;
        let totalAbsRunningLots = 0;

        finalTraderPnl.map((subelem, index) => {
            let obj = {};

            let npnlcolor = ((subelem.totalPnl) - (subelem.brokerage)) >= 0 ? "success" : "error"
            let tradercolor = ((subelem.totalPnl) - (subelem.brokerage)) >= 0 ? "success" : "error"
            let gpnlcolor = (subelem.totalPnl) >= 0 ? "success" : "error"
            let runninglotscolor = subelem.runninglots > 0 ? "info" : (subelem.runninglots < 0 ? "error" : "dark")
            let traderbackgroundcolor = subelem.runninglots != 0 ? "white" : "#e0e1e5"
            let runninglotsbgcolor = subelem.runninglots > 0 ? "#ffff00" : ""

            totalGrossPnlGrid += (subelem.totalPnl);
            //console.log("Gross P&L: ",subelem.name,subelem.totalPnl );
            totalTransactionCost += (subelem.brokerage);
            totalNoRunningLots += (subelem.runninglots);
            totalLotsUsed += (subelem.lotUsed);
            totalTrades += (subelem.noOfTrade);
            totalTraders += 1;
            totalAbsRunningLots += subelem.absRunninglots;

            obj.userId = (
                <MDTypography component="a" variant="caption" fontWeight="medium">
                    {subelem.userId}
                </MDTypography>
            );

            obj.traderName = (
                <MDTypography component="a" variant="caption" color={tradercolor} fontWeight="medium" backgroundColor={traderbackgroundcolor} padding="5px" borderRadius="5px">
                    {(subelem.name)}
                </MDTypography>
            );

            obj.grossPnl = (
                <MDTypography component="a" variant="caption" color={gpnlcolor} fontWeight="medium">
                    {(subelem.totalPnl) > 0.00 ? "+₹" + ((subelem.totalPnl).toFixed(2)) : "-₹" + (-subelem.totalPnl).toFixed(2)}
                </MDTypography>
            );

            obj.noOfTrade = (
                <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                    {subelem.noOfTrade}
                </MDTypography>
            );

            obj.runningLots = (
                <MDTypography component="a" variant="caption" color={runninglotscolor} backgroundColor={runninglotsbgcolor} fontWeight="medium">
                    {subelem.runninglots}
                </MDTypography>
            );

            obj.absRunningLots = (
                <MDTypography component="a" variant="caption" color={runninglotscolor} backgroundColor={runninglotsbgcolor} fontWeight="medium">
                    {subelem.absRunninglots}
                </MDTypography>
            );

            obj.lotUsed = (
                <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                    {subelem.lotUsed}
                </MDTypography>
            );

            obj.brokerage = (
                <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                    {"₹" + (subelem.brokerage).toFixed(2)}
                </MDTypography>
            );

            obj.netPnl = (
                <MDTypography component="a" variant="caption" color={npnlcolor} fontWeight="medium">
                    {((subelem.totalPnl) - (subelem.brokerage)) > 0.00 ? "+₹" + (((subelem.totalPnl) - (subelem.brokerage)).toFixed(2)) : "-₹" + ((-((subelem.totalPnl) - (subelem.brokerage))).toFixed(2))}
                </MDTypography>
            );
            //  obj.view = (
            //   <LiveViewTradeDetail userId={subelem.userId}/>
            // );
            // obj.orders = (
            //   <LiveTraderwiseOrders userId={subelem.userId}/>
            // );

            rows.push(obj);
        })


        console.log("this is rows", finalTraderPnl)
        let obj = {};

        const totalGrossPnlcolor = totalGrossPnlGrid >= 0 ? "success" : "error"
        const totalnetPnlcolor = (totalGrossPnlGrid - totalTransactionCost) >= 0 ? "success" : "error"


        obj.traderName = (
            <MDTypography component="a" variant="caption" padding="5px" borderRadius="5px" backgroundColor="#e0e1e5" fontWeight="medium">
                Traders: {totalTraders}
            </MDTypography>
        );

        obj.grossPnl = (
            <MDTypography component="a" variant="caption" color={totalGrossPnlcolor} padding="5px" borderRadius="5px" backgroundColor="#e0e1e5" fontWeight="medium">
                {totalGrossPnlGrid >= 0.00 ? "+₹" + (totalGrossPnlGrid.toFixed(2)) : "-₹" + ((-totalGrossPnlGrid).toFixed(2))}
            </MDTypography>
        );

        obj.noOfTrade = (
            <MDTypography component="a" variant="caption" padding="5px" borderRadius="5px" backgroundColor="#e0e1e5" fontWeight="medium">
                {totalTrades}
            </MDTypography>
        );

        obj.runningLots = (
            <MDTypography component="a" variant="caption" color="dark" padding="5px" borderRadius="5px" backgroundColor="#e0e1e5" fontWeight="medium">
                {totalNoRunningLots}
            </MDTypography>
        );

        obj.absRunningLots = (
            <MDTypography component="a" variant="caption" color="dark" padding="5px" borderRadius="5px" backgroundColor="#e0e1e5" fontWeight="medium">
                {totalAbsRunningLots}
            </MDTypography>
        );

        obj.lotUsed = (
            <MDTypography component="a" variant="caption" color="dark" padding="5px" borderRadius="5px" backgroundColor="#e0e1e5" fontWeight="medium">
                {totalLotsUsed}
            </MDTypography>
        );


        obj.brokerage = (
            <MDTypography component="a" variant="caption" color="dark" padding="5px" borderRadius="5px" backgroundColor="#e0e1e5" fontWeight="medium">
                {"₹" + (totalTransactionCost).toFixed(2)}
            </MDTypography>
        );

        obj.netPnl = (
            <MDTypography component="a" variant="caption" color={totalnetPnlcolor} padding="5px" borderRadius="5px" backgroundColor="#e0e1e5" fontWeight="medium">
                {(totalGrossPnlGrid - totalTransactionCost) >= 0.00 ? "+₹" + ((totalGrossPnlGrid - totalTransactionCost).toFixed(2)) : "-₹" + ((-(totalGrossPnlGrid - totalTransactionCost)).toFixed(2))}
            </MDTypography>
        );

        rows.push(obj);
    }



    return (
        <MDBox display='flex' justifyContent='center' flexDirection='column' m={1}>
            <MDBox bgColor='grey' p={1} borderRadius={3} display='flex' justifyContent='space-between' alignItems='center'>
                <MDBox><MDTypography fontSize={15} fontWeight='bold' color='light'>Traderwise P&L Live (Company Side)</MDTypography></MDBox>
                <MDBox display='flex' justifyContent='space-between' alignItems='center'>
                    <MDBox><MDTypography fontSize={15} fontWeight='bold' color='light'>Current Status:Mock</MDTypography></MDBox>
                    <MDBox><Switch checked={isLive} onChange={() => {switchToMock()}} /></MDBox>
                    <MDBox><MDTypography fontSize={15} fontWeight='bold' color='light'>Live</MDTypography></MDBox>
                </MDBox>
            </MDBox>
            <DataTable
                table={{ columns, rows }}
                showTotalEntries={false}
                isSorted={false}
                noEndBorder
            />
        </MDBox>
    );
}
export default LiveTraderwiseCompantPNL;
