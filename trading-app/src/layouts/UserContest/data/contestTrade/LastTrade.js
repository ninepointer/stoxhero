import React,{useState, useEffect, useContext, memo} from 'react'
import Grid from '@mui/material/Grid'
import MDTypography from '../../../../components/MDTypography'
import MDButton from '../../../../components/MDButton'
import axios from "axios";
import { CircularProgress } from "@mui/material";
import MDBox from '../../../../components/MDBox';
import { renderContext } from '../../../../renderContext';



function LastTrade({contestId, Render}){

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [orders, setOrders] = useState([]);
    const [isLoading,setIsLoading] = useState(true)
    let [skip, setSkip] = useState(0);
    const limitSetting = 5;
    const [count, setCount] = useState(0);
    // const {render, setRender} = Render;
    const {render} = useContext(renderContext);


    useEffect(()=>{
        console.log("in trade useeffect", skip, limitSetting)

        axios.get(`${baseUrl}api/v1/contest/${contestId}/trades/tradesByPagination?skip=${skip}&limit=${limitSetting}`,{
          withCredentials: true,
          headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true
          },
        })
        .then((res) => {
            console.log("lastTrade",res.data)
            setOrders(res.data.data)
            setIsLoading(false)
        }).catch((err) => {
            console.log(err)
            return new Error(err);
        })

        axios.get(`${baseUrl}api/v1/contest/${contestId}/trades/countTrades`,{
            withCredentials: true,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
          })
          .then((res) => {
              console.log("lastTrade",res.data)
              setCount(res.data.data)
            //   setSkip(prev => prev+limitSetting);
              setIsLoading(false)
          }).catch((err) => {
              console.log(err)
              return new Error(err);
          })

    }, [render])

    function backHandler(){
        if(skip <= 0){
            return;
        }
        setSkip(prev => prev-limitSetting);
        setOrders([]);
        axios.get(`${baseUrl}api/v1/contest/${contestId}/trades/tradesByPagination?skip=${skip-limitSetting}&limit=${limitSetting}`,{
            withCredentials: true,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
        })
        .then((res) => {
            console.log("lastTrade",res.data)
            setOrders(res.data.data)
            setIsLoading(false)
        }).catch((err) => {
            console.log(err)
            return new Error(err);
        })
    }

    function nextHandler(){
        if(skip+limitSetting >= count){
            return;
        }
        setSkip(prev => prev+limitSetting);
        setOrders([]);
        axios.get(`${baseUrl}api/v1/contest/${contestId}/trades/tradesByPagination?skip=${skip+limitSetting}&limit=${limitSetting}`,{
            withCredentials: true,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
        })
        .then((res) => {
            console.log("lastTrade",res.data)
            setOrders(res.data.data)
            setIsLoading(false)
        }).catch((err) => {
            console.log(err)
            return new Error(err);
        })
    }
    

return (
    <>
        <Grid container>
            <Grid item xs={12} md={12} lg={12}>
                <MDTypography fontSize={13} style={{fontWeight:500}} color="light">Battle Order</MDTypography>
            </Grid>
        </Grid>


        {isLoading ?
        <Grid mt={1} mb={1} display="flex" width="100%" justifyContent="center" alignItems="center">
            <CircularProgress color="light" />
        </Grid>

        :
        <>
        <Grid container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
            
            <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                <MDTypography fontSize={10} color="light" style={{fontWeight:700, fontSize: "9px"}}>INSTRUMENT</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={1.5} display="flex" justifyContent="center">
                <MDTypography fontSize={10} color="light" style={{fontWeight:700, fontSize: "9px"}}>TYPE</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={1.5} display="flex" justifyContent="center">
                <MDTypography fontSize={10} color="light" style={{fontWeight:700, fontSize: "9px"}}>PRODUCT</MDTypography>
            </Grid>

            <Grid item xs={15} md={12} lg={1.5} display="flex" justifyContent="center">
                <MDTypography fontSize={10} color="light" style={{fontWeight:700, fontSize: "9px"}}>QUANTITY</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={1.5} display="flex" justifyContent="center">
            <MDTypography fontSize={10} color="light" style={{fontWeight:700, fontSize: "9px"}}>AVG. PRICE</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={1.5} display="flex" justifyContent="center">
                <MDTypography fontSize={10} color="light" style={{fontWeight:700, fontSize: "9px"}}>AMOUNT</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={1.5} display="flex" justifyContent="center">
                <MDTypography fontSize={10} color="light" style={{fontWeight:700, fontSize: "9px"}}>STATUS</MDTypography>
            </Grid>

        </Grid>

        {orders.map((elem)=>{

            return(
            <Grid container mt={1} p={1} style={{border:'1px solid white',borderRadius:4}} alignItems="center">
        
                <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                    <MDTypography fontSize={11.5} color="light" style={{fontWeight:500, fontSize: "10px"}}>{elem.symbol}</MDTypography>
                </Grid>
    
                <Grid item xs={12} md={12} lg={1.5} display="flex" justifyContent="center">
                    <MDTypography fontSize={11.5} color={elem.buyOrSell == "BUY" ? 'success' : 'error'} style={{fontWeight:500, fontSize: "10px"}}>{elem.buyOrSell}</MDTypography>
                </Grid>
    
                <Grid item xs={12} md={12} lg={1.5} display="flex" justifyContent="center">
                    <MDTypography fontSize={11.5} color="light" style={{fontWeight:500, fontSize: "10px"}}>{elem.Product}</MDTypography>
                </Grid>
    
                <Grid item xs={12} md={12} lg={1.5} display="flex" justifyContent="center">
                    <MDTypography fontSize={11.5} color="light" style={{fontWeight:500, fontSize: "10px"}}>
                        {elem.Quantity}
                    </MDTypography>
                </Grid>
                <Grid item xs={12} md={12} lg={1.5} display="flex" justifyContent="center">
                    <MDTypography fontSize={11.5} color="light" style={{fontWeight:500, fontSize: "10px"}}>
                        {elem.average_price ? "₹"+elem.average_price.toFixed(2) : "₹"+0.00}
                    </MDTypography>
                </Grid>
                

    
                <Grid item xs={12} md={12} lg={1.5} display="flex" justifyContent="center">
                    <MDTypography fontSize={11.5} color="light" style={{fontWeight:500, fontSize: "10px"}}>
                        {"₹"+Math.abs(elem.amount).toFixed(0)}
                    </MDTypography>
                </Grid>

                <Grid item xs={12} md={12} lg={1.5} display="flex" justifyContent="center">
                    <MDTypography fontSize={11.5} color={elem.status == "COMPLETE" ? "success" : "error"} style={{fontWeight:500, fontSize: "10px"}}>
                        {elem.status}
                    </MDTypography>
                </Grid>
    
            </Grid>
            )
        })}
        {count !== 0 &&
        <MDBox mt={1} display="flex" justifyContent="space-between">
            <MDButton size="small" color="light" sx={{marginRight:0.5,minWidth:2,minHeight:3}} onClick={backHandler}>Back</MDButton>
            <MDButton size="small" color="light" sx={{marginRight:0.5,minWidth:2,minHeight:3}} onClick={nextHandler}>Next</MDButton>
        </MDBox>
        }
        </>
        }
    </>
);
}

export default memo(LastTrade);