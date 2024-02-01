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

function SwitchWindow(props) {
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


    useEffect(()=>{
        getContest();
    },[action]);

    let columns = [
        { Header: "Trader Name", accessor: "traderName", width: "15%", align: "center" },
        { Header: "Gross P&L", accessor: "grossPnl", width: "12.5%", align: "center" },
        { Header: "Running Lots", accessor: "runningLots", width: "12.5%", align: "center" },
        // { Header: "Abs.Running Lots", accessor: "absRunningLots", width: "12.5%", align: "center" },
        { Header: "Net P&L", accessor: "netPnl", width: "12.5%", align: "center" },

        { Header: "Total TestZone", accessor: "totalContest", width: "12.5%", align: "center" },
        { Header: "Paid TestZone", accessor: "paidContest", width: "12.5%", align: "center" },
        { Header: "Free TestZone", accessor: "freeContest", width: "12.5%", align: "center" },
        { Header: "Trading Day", accessor: "tradingDay", width: "12.5%", align: "center" },

        { Header: "Mock/Live", accessor: "mockLive", width: "12.5%", align: "center" },
        
    ]

    let rows = []

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

    const [allTrade, setAllTrade] = useState([]);
    const [marketData, setMarketData] = useState([]);
    const [userContestDetail, setUserContestDetails] = useState([]);
    let [switchResponse, setSwitchResponse] = useState(true);

    useEffect(() => {

        axios.get(`${baseUrl}api/v1/getliveprice`)
            .then((res) => {
                //console.log("live price data", res)
                setMarketData(res.data);
                // setDetails.setMarketData(data);
            }).catch((err) => {
                return new Error(err);
            })

    }, [])

    useEffect(() => {

        axios.get(`${baseUrl}api/v1/dailycontest/live/singleswitchcontest/${props.id}`, {withCredentials: true})
            .then((res) => {
                setAllTrade(res.data.data);
                console.log("res.data.data", res.data.data)
            }).catch((err) => {
                return new Error(err);
            })
    }, [switchResponse])

    useEffect(() => {
        axios.get(`${baseUrl}api/v1/dailycontest/usercontestdata/${props.id}`, {withCredentials: true})
            .then((res) => {
                setUserContestDetails(res.data.data);
            }).catch((err) => {
                return new Error(err);
            })
    }, [])

    async function switchUser(userId){
        axios.get(`${baseUrl}api/v1/contestrealmocksingleuser/${userId}/${props.id}`, {withCredentials: true})
        .then((res) => {
            setSwitchResponse(!switchResponse);
        }).catch((err) => {
            return new Error(err);
        })
    }

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
                    algoName: allTrade[i].algoName,
                    isLive: allTrade[i].isLive,
                    
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

            const userContestInfo = userContestDetail.filter((elem)=>{
                return elem?.userId?.toString() === subelem?.userId?.toString();
            })

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

            // obj.absRunningLots = (
            //     <MDTypography component="a" variant="caption" color={runninglotscolor} backgroundColor={runninglotsbgcolor} fontWeight="medium">
            //         {subelem.absRunninglots}
            //     </MDTypography>
            // );

            obj.totalContest = (
                <MDTypography component="a" variant="caption" backgroundColor={runninglotsbgcolor} fontWeight="medium">
                    {userContestInfo[0]?.totalContestsCount}
                </MDTypography>
            );

            obj.paidContest = (
                <MDTypography component="a" variant="caption" backgroundColor={runninglotsbgcolor} fontWeight="medium">
                    {userContestInfo[0]?.totalPaidContests}
                </MDTypography>
            );

            obj.freeContest = (
                <MDTypography component="a" variant="caption" backgroundColor={runninglotsbgcolor} fontWeight="medium">
                    {userContestInfo[0]?.totalFreeContests}
                </MDTypography>
            );

            obj.tradingDay = (
                <MDTypography component="a" variant="caption" backgroundColor={runninglotsbgcolor} fontWeight="medium">
                    {userContestInfo[0]?.totalTradingDays}
                </MDTypography>
            );

            obj.netPnl = (
                <MDTypography component="a" variant="caption" color={npnlcolor} fontWeight="medium">
                    {((subelem.totalPnl) - (subelem.brokerage)) > 0.00 ? "+₹" + (((subelem.totalPnl) - (subelem.brokerage)).toFixed(2)) : "-₹" + ((-((subelem.totalPnl) - (subelem.brokerage))).toFixed(2))}
                </MDTypography>
            );

            obj.mockLive = (
                <MDTypography component="a" variant="caption" color={npnlcolor} fontWeight="medium">
                    <Switch checked={subelem.isLive} onChange={() => {switchUser(subelem?.userId)}} />
                </MDTypography>
            );


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
                <MDBox><MDTypography fontSize={15} fontWeight='bold' color='light'>Switch Window</MDTypography></MDBox>
                {/* <MDBox display='flex' justifyContent='space-between' alignItems='center'>
                    <MDBox><MDTypography fontSize={15} fontWeight='bold' color='light'>Current Status:Mock</MDTypography></MDBox>
                    <MDBox><Switch checked={isLive} onChange={() => {switchToMock()}} /></MDBox>
                    <MDBox><MDTypography fontSize={15} fontWeight='bold' color='light'>Live</MDTypography></MDBox>
                </MDBox> */}
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
export default SwitchWindow;
