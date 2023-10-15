import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
// import { userContext } from '../../../AuthContext';
import moment from 'moment';


// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDButton from "../../../../components/MDButton";
import MDTypography from "../../../../components/MDTypography";
import { Card, CircularProgress, Paper, TableContainer, Typography } from "@mui/material";
import { renderContext } from "../../../../renderContext";
import { apiUrl } from "../../../../constants/constants";
import { RiStockFill } from "react-icons/ri";
import OrderHelper from "../Order/PendingOrderHelper";
// import { Grid } from "@mui/material";
// import { useLocation, Link } from "react-router-dom";


export default function PendingOrders({ subscriptionId }) {


    let styleTD = {
        textAlign: "center",
        fontSize: "11px",
        fontWeight: "900",
        color: "#7b809a",
        opacity: 0.7
    }

    let [skip, setSkip] = useState(0);
    const limitSetting = 5;
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const [data, setData] = useState([]);
    // const getDetails = useContext(userContext);
    const { render } = useContext(renderContext);

    let url =  `pendingorder/my/today/${subscriptionId}/TenX`;
    useEffect(() => {
        setIsLoading(true)
        console.log("Inside Use Effect")
        axios.get(`${apiUrl}${url}?skip=${skip}&limit=${limitSetting}`, { withCredentials: true })
            .then((res) => {
                console.log(res.data)
                setData(res.data.data);
                setCount(res.data.count);
                setIsLoading(false)
            }).catch((err) => {
                //window.alert("Server Down");
                setTimeout(() => {
                    setIsLoading(false)
                }, 500)
                return new Error(err);
            })
    }, [render])

    function backHandler() {
        if (skip <= 0) {
            return;
        }
        setSkip(prev => prev - limitSetting);
        setData([]);
        setIsLoading(true)
        axios.get(`${apiUrl}${url}?skip=${skip - limitSetting}&limit=${limitSetting}`, {
            withCredentials: true,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": false
            },
        })
            .then((res) => {
                console.log("Orders:", res.data)
                setData(res.data.data)
                setCount(res.data.count)
                setTimeout(() => {
                    setIsLoading(false)
                }, 500)
            }).catch((err) => {
                console.log(err)
                setIsLoading(false)
                return new Error(err);
            })
    }

    function nextHandler() {
        if (skip + limitSetting >= count) {
            console.log("inside skip", count, skip + limitSetting)
            return;
        }
        console.log("inside next handler")
        setSkip(prev => prev + limitSetting);
        setData([]);
        setIsLoading(true)
        axios.get(`${apiUrl}${url}?skip=${skip + limitSetting}&limit=${limitSetting}`, {
            withCredentials: true,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": false
            },
        })
            .then((res) => {
                console.log("orders", res.data)
                setData(res.data.data)
                setCount(res.data.count)
                setTimeout(() => {
                    setIsLoading(false)
                }, 500)
            }).catch((err) => {
                console.log(err)
                setIsLoading(false)
                return new Error(err);
            })
    }


    const orderArr = [];
    data.map((elem) => {

        let orderObj = {}

        orderObj.symbol = (
            <MDTypography variant="caption" color={"text"} fontWeight="medium">
                {elem?.symbol}
            </MDTypography>
        );
        orderObj.averagePrice = (
            <MDTypography variant="caption" color={"text"} fontWeight="medium">
                {new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(elem?.execution_price))}
            </MDTypography>
        );
        orderObj.quantity = (
            <MDTypography variant="caption" color="text" fontWeight="medium">
                {elem?.Quantity}
            </MDTypography>
        );
        orderObj.amount = (
            <MDTypography variant="caption" color="text" fontWeight="medium">
                {new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(elem?.amount))}
            </MDTypography>
        );
        orderObj.buyOrSell = (
            <MDTypography component="a" href="#" variant="caption" color="dark" fontWeight="medium">
                {elem?.buyOrSell}
            </MDTypography>
        );

        orderObj.type = (
            <MDTypography component="a" href="#" variant="caption" color={"text"} fontWeight="medium">
                {elem?.type}
            </MDTypography>
        );

        orderObj.status = (
            <MDTypography component="a" href="#" variant="caption" color={"text"} fontWeight="medium">
                {elem?.status}
            </MDTypography>
        );

        orderObj._id = (
            <MDTypography component="a" href="#" variant="caption" color={"text"} fontWeight="medium">
                {elem?._id}
            </MDTypography>
        );

        orderObj.time = (
            <MDTypography component="a" href="#" variant="caption" color={"text"} fontWeight="medium">
                {moment.utc(elem?.time).utcOffset('+00:00').format('DD-MMM HH:mm:ss')}
            </MDTypography>
        );



        orderArr.push(orderObj)
    })


    console.log(orderArr)
    return (
        <>

            {isLoading ?
                <MDBox mt={10} mb={10} display="flex" width="100%" justifyContent="center" alignItems="center">
                    <CircularProgress color='light' />
                </MDBox>
                :
                <Card>

                    <MDBox display="flex" justifyContent="space-between" alignItems="center" pl={2} pr={2} pt={2} pb={2}>
                        <MDBox display="flex">
                            <MDTypography variant="h6" gutterBottom>
                                My Pending Orders
                            </MDTypography>
                            <MDBox display="flex" alignItems="center" lineHeight={0}>
                            </MDBox>
                        </MDBox>
                    </MDBox>
                    {orderArr?.length === 0 ? (
                        <MDBox display="flex" flexDirection="column" mb={4} sx={{ alignItems: "center" }}>
                            <RiStockFill style={{ fontSize: '30px' }} />
                            <Typography style={{ fontSize: '20px', color: "grey" }}>Nothing here</Typography>
                            <Typography mb={2} fontSize={15} color="grey">Please Take Trade.</Typography>
                        </MDBox>)
                        :
                        (<MDBox>
                            <TableContainer component={Paper}>
                                <table style={{ borderCollapse: "collapse", width: "100%", borderSpacing: "10px 5px" }}>
                                    <thead>
                                        <tr style={{ borderBottom: "1px solid #D3D3D3" }}>
                                            <td style={styleTD}>SYMBOL</td>
                                            <td style={styleTD} >QUANTITY</td>
                                            <td style={styleTD} >SL/SP PRICE</td>
                                            <td style={styleTD} >AMOUNT</td>
                                            <td style={styleTD} >STOP TYPE</td>
                                            <td style={styleTD} >TYPE</td>
                                            <td style={styleTD} >STATUS</td>
                                            <td style={styleTD} >TIME</td>
                                            <td style={styleTD} >ACTION</td>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {orderArr.map((elem, index) => {
                                            return (
                                                <tr
                                                    style={{ borderBottom: "1px solid #D3D3D3" }} key={elem._id.props.children}
                                                >
                                                    <OrderHelper
                                                        symbol={elem.symbol.props.children}
                                                        averagePrice={elem.averagePrice.props.children}
                                                        amount={elem.amount.props.children}
                                                        quantity={elem.quantity.props.children}
                                                        buyOrSell={elem.buyOrSell.props.children}
                                                        status={elem.status.props.children}
                                                        time={elem.time.props.children}
                                                        type={elem.type.props.children}
                                                        id={elem._id.props.children}
                                                    />
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>


                                {!isLoading && count !== 0 &&
                                    <MDBox mt={1} display="flex" justifyContent="space-between" alignItems='center' width='100%' p={2}>
                                        <MDButton variant='outlined' color='secondary' disabled={(skip + limitSetting) / limitSetting === 1 ? true : false} size="small" onClick={backHandler}>Back</MDButton>
                                        <MDTypography color="secondary" fontSize={15} fontWeight='bold'>Total Order: {!count ? 0 : count} | Page {(skip + limitSetting) / limitSetting} of {!count ? 1 : Math.ceil(count / limitSetting)}</MDTypography>
                                        <MDButton variant='outlined' color='secondary' disabled={Math.ceil(count / limitSetting) === (skip + limitSetting) / limitSetting ? true : !count ? true : false} size="small" onClick={nextHandler}>Next</MDButton>
                                    </MDBox>
                                }


                            </TableContainer>

                        </MDBox>
                        )}
                </Card>

            }
        </>

    );
}
