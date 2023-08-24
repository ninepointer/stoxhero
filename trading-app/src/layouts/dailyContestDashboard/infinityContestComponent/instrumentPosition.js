import { useState, useEffect } from "react"
import axios from "axios";
// @mui material components
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";

// Material Dashboard 2 React examples
import DataTable from "../../../examples/Tables/DataTable";

// Data

// function OverallCompantPNL({socket}) {
function LiveOverallCompantPNL({ socket, id }) {

    let columns = [
        { Header: "Product", accessor: "Product", width: "10%", align: "center" },
        { Header: "Instrument", accessor: "symbol", width: "10%", align: "center" },
        { Header: "Quantity", accessor: "Quantity", width: "10%", align: "center" },
        { Header: "Avg. Price", accessor: "avgPrice", width: "10%", align: "center" },
        { Header: "LTP", accessor: "last_price", width: "10%", align: "center" },
        { Header: "Gross P&L", accessor: "grossPnl", width: "10%", align: "center" },
        { Header: "Change(%)", accessor: "change", width: "10%", align: "center" },]

    let rows = []
    const [menu, setMenu] = useState(null);

    // const openMenu = ({ currentTarget }) => setMenu(currentTarget);
    const closeMenu = () => setMenu(null);

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    // let date = new Date();
    let totalTransactionCost = 0;
    const [marketData, setMarketData] = useState([]);
    const [tradeData, setTradeData] = useState([]);
    const [trackEvent, setTrackEvent] = useState({});


    // let liveDetailsArr = [];
    let totalGrossPnl = 0;
    let totalRunningLots = 0;

    useEffect(() => {

        axios.get(`${baseUrl}api/v1/getliveprice`)
            .then((res) => {
                //console.log("live price data", res)
                setMarketData(res.data);
                // setDetails.setMarketData(data);
            }).catch((err) => {
                return new Error(err);
            })

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

    useEffect(() => {
        socket.on('updatePnl', (data) => {
            // console.log("in the pnl event", data)
            setTimeout(() => {
                setTrackEvent(data);
            })
        })
    }, [])

    useEffect(() => {

        axios.get(`${baseUrl}api/v1/dailycontest/livePnlCompany/${id}`, {withCredentials: true})
            .then((res) => {
                setTradeData(res.data.data);
            }).catch((err) => {
                return new Error(err);
            })

    }, [trackEvent])


    // if(tradeData.length != 0){
    tradeData.map((elem) => {
        totalTransactionCost += Number(elem.brokerage);
    })

    tradeData.map((subelem, index) => {
        let obj = {};
        totalRunningLots += Number(subelem.lots)

        const liveDetail = marketData.filter((elem) => {
            console.log("liveDetail2", elem.instrument_token, subelem.exchangeInstrumentToken, (subelem.exchangeInstrumentToken == elem.instrument_token))
            return elem !== undefined && (subelem.instrumentToken == elem.instrument_token || subelem.exchangeInstrumentToken == elem.instrument_token)
        })

        console.log("liveDetail", liveDetail[0]?.instrument_token, subelem?.instrumentToken)
        let updatedValue = (subelem.amount + (subelem.lots) * liveDetail[0]?.last_price);
        totalGrossPnl += updatedValue;

        const instrumentcolor = subelem.symbol.slice(-2) == "CE" ? "success" : "error"
        const quantitycolor = subelem.lots >= 0 ? "success" : "error"
        const gpnlcolor = updatedValue >= 0 ? "success" : "error"
        const pchangecolor = (liveDetail[0]?.change) >= 0 ? "success" : "error"
        const productcolor = subelem.product === "NRML" ? "info" : subelem.product == "MIS" ? "warning" : "error"

        obj.Product = (
            <MDTypography component="a" variant="caption" color={productcolor} fontWeight="medium">
                {(subelem.product)}
            </MDTypography>
        );

        obj.symbol = (
            <MDTypography component="a" variant="caption" color={instrumentcolor} fontWeight="medium">
                {(subelem.symbol)}
            </MDTypography>
        );

        obj.Quantity = (
            <MDTypography component="a" variant="caption" color={quantitycolor} fontWeight="medium">
                {subelem.lots}
            </MDTypography>
        );

        obj.avgPrice = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                {"₹" + subelem.lastaverageprice.toFixed(2)}
            </MDTypography>
        );

        if ((liveDetail[0]?.last_price)) {
            obj.last_price = (
                <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                    {"₹" + (liveDetail[0]?.last_price).toFixed(2)}
                </MDTypography>
            );
        } else {
            obj.last_price = (
                <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
                    {"₹" + (liveDetail[0]?.last_price)}
                </MDTypography>
            );
        }

        obj.grossPnl = (
            <MDTypography component="a" variant="caption" color={gpnlcolor} fontWeight="medium">
                {updatedValue >= 0.00 ? "+₹" + (updatedValue.toFixed(2)) : "-₹" + ((-updatedValue).toFixed(2))}
            </MDTypography>
        );

        if ((liveDetail[0]?.change)) {
            obj.change = (
                <MDTypography component="a" variant="caption" color={pchangecolor} fontWeight="medium">
                    {(liveDetail[0]?.change).toFixed(2) + "%"}
                </MDTypography>
            );
        } else {
            obj.change = (
                <MDTypography component="a" variant="caption" color={pchangecolor} fontWeight="medium">
                    {(((liveDetail[0]?.last_price - liveDetail[0]?.average_price) / liveDetail[0]?.average_price) * 100).toFixed(2) + "%"}
                </MDTypography>
            );
        }
        //console.log(obj)
        if (subelem.lots != 0) {
            rows.unshift(obj);
        } else {
            rows.push(obj);
        }
    })


    let obj = {};

    const totalGrossPnlcolor = totalGrossPnl >= 0 ? "success" : "error"
    const totalnetPnlcolor = (totalGrossPnl - totalTransactionCost) >= 0 ? "success" : "error"

    obj.symbol = (
        <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
            { }
        </MDTypography>
    );

    obj.Quantity = (
        <MDTypography component="a" variant="caption" backgroundColor="#e0e1e5" borderRadius="5px" padding="5px" fontWeight="medium">
            Running Lots : {totalRunningLots}
        </MDTypography>
    );

    obj.avgPrice = (
        <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
            { }
        </MDTypography>
    );

    obj.last_price = (
        <MDTypography component="a" variant="caption" color="dark" backgroundColor="#e0e1e5" borderRadius="5px" padding="5px" fontWeight="medium">
            Brokerage : {"₹" + (totalTransactionCost).toFixed(2)}
        </MDTypography>
    );


    obj.grossPnl = (
        <MDTypography component="a" variant="caption" color={totalGrossPnlcolor} backgroundColor="#e0e1e5" borderRadius="5px" padding="5px" fontWeight="medium">
            Gross P&L : {totalGrossPnl >= 0.00 ? "+₹" + (totalGrossPnl.toFixed(2)) : "-₹" + ((-totalGrossPnl).toFixed(2))}
        </MDTypography>
    );

    obj.change = (
        <MDTypography component="a" variant="caption" color={totalnetPnlcolor} backgroundColor="#e0e1e5" borderRadius="5px" padding="5px" fontWeight="medium">
            Net P&L : {(totalGrossPnl - totalTransactionCost) >= 0.00 ? "+₹" + ((totalGrossPnl - totalTransactionCost).toFixed(2)) : "-₹" + ((-(totalGrossPnl - totalTransactionCost)).toFixed(2))}
        </MDTypography>
    );


    rows.push(obj);
    // }

    const renderMenu = (
        <Menu
            id="simple-menu"
            anchorEl={menu}
            anchorOrigin={{
                vertical: "top",
                horizontal: "left",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={Boolean(menu)}
            onClose={closeMenu}
        >
            <MenuItem onClick={closeMenu}>Action</MenuItem>
            <MenuItem onClick={closeMenu}>Another action</MenuItem>
            <MenuItem onClick={closeMenu}>Something else</MenuItem>
        </Menu>
    );



    return (
        <MDBox display='flex' justifyContent='center' flexDirection='column' m={1}>
            <MDBox bgColor='lightgrey' p={1} borderRadius={3}>
                <MDTypography fontSize={15} fontWeight='bold'>Instruments Wise P&L (Company Side)</MDTypography>
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
export default LiveOverallCompantPNL;
