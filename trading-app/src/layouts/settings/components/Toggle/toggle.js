import React, { useEffect, useState } from 'react'
import axios from "axios"
import uniqid from "uniqid";
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import Switch from "@mui/material/Switch";
import {zerodhaAccountType, xtsAccountType} from "../../../../variables"


export default function Toggle({ userId, isRealTradeEnable }) {

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [setting, setSetting] = useState([]);
    const [reRender, setReRender] = useState(true);
    useEffect(()=>{
        axios.get(`${baseUrl}api/v1/readsetting`, {withCredentials: true})
        .then((res)=>{
         
            setSetting(res.data);
  
        }).catch((err)=>{
            return new Error(err);
        })
    }, [reRender])


    async function complete(id, complete){
        if(complete === zerodhaAccountType){
            complete = xtsAccountType;
        } else{
            complete = zerodhaAccountType;
        }
        const res = await fetch(`${baseUrl}api/v1/toggleComplete/${id}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Accept": "application/json",
                "content-type": "application/json"
            },
            body: JSON.stringify({
                complete
            })
        });
        const dataResp = await res.json();
        console.log(dataResp);
        if (dataResp.status === 422 || dataResp.error || !dataResp) {
            window.alert(dataResp.error);
            // console.log("Failed to Edit");
        } else {
            // setSetting(dataResp.data)
            if(complete == zerodhaAccountType){
                window.alert("Switched to Zerodha");
            } else{
                window.alert("Switched to Zerodha");
            }
        }
        reRender ? setReRender(false) : setReRender(true)
    }

    async function ltp(id, ltp){
        if(ltp === zerodhaAccountType){
            ltp = xtsAccountType;
        } else{
            ltp = zerodhaAccountType;
        }
        const res = await fetch(`${baseUrl}api/v1/toggleLTP/${id}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Accept": "application/json",
                "content-type": "application/json"
            },
            body: JSON.stringify({
                ltp
            })
        });
        const dataResp = await res.json();
        console.log(dataResp);
        if (dataResp.status === 422 || dataResp.error || !dataResp) {
            window.alert(dataResp.error);
            // console.log("Failed to Edit");
        } else {
            if(ltp == zerodhaAccountType){
                window.alert("Switched to Zerodha");
            } else{
                window.alert("Switched to XTS");
            }
        }
        reRender ? setReRender(false) : setReRender(true)
    }

    async function liveOrder(id, liveOrder){
        if(liveOrder === zerodhaAccountType){
            liveOrder = xtsAccountType;
        } else{
            liveOrder = zerodhaAccountType;
        }
        const res = await fetch(`${baseUrl}api/v1/toggleLiveOrder/${id}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Accept": "application/json",
                "content-type": "application/json"
            },
            body: JSON.stringify({
                liveOrder
            })
        });
        const dataResp = await res.json();
        console.log(dataResp);
        if (dataResp.status === 422 || dataResp.error || !dataResp) {
            window.alert(dataResp.error);
            // console.log("Failed to Edit");
        } else {
            if(liveOrder == zerodhaAccountType){
                window.alert("Switched to Zerodha");
            } else{
                window.alert("Switched to XTS");
            }
        }
        reRender ? setReRender(false) : setReRender(true)
    }

    return (

        <>

            <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
            <MDBox mt={0.5}>
                <Switch checked={setting[0]?.toggle?.complete === zerodhaAccountType} onChange={() => {complete(setting[0]?._id, setting[0]?.toggle?.complete)}} />
            </MDBox>
                <MDBox width="80%" ml={0.5}>
                    <MDTypography variant="button" fontWeight="regular" color="dark">
                        {(setting[0]?.toggle?.complete === zerodhaAccountType ? "Complete Zerodha" : "Complete XTS")}
                    </MDTypography>
                </MDBox>
            </MDBox>

            <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
            <MDBox mt={0.5}>
                <Switch checked={setting[0]?.toggle?.ltp === zerodhaAccountType} onChange={() => {ltp(setting[0]?._id, setting[0]?.toggle?.ltp)}} />
            </MDBox>
                <MDBox width="80%" ml={0.5}>
                    <MDTypography variant="button" fontWeight="regular" color="dark">
                        {(setting[0]?.toggle?.ltp === zerodhaAccountType ? "Zerodha Live Price" : "Xts Live Price")}
                    </MDTypography>
                </MDBox>
            </MDBox>

            <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
            <MDBox mt={0.5}>
                <Switch checked={setting[0]?.toggle?.liveOrder === zerodhaAccountType} onChange={() => {liveOrder(setting[0]?._id, setting[0]?.toggle?.liveOrder)}} />
            </MDBox>
                <MDBox width="80%" ml={0.5}>
                    <MDTypography variant="button" fontWeight="regular" color="dark">
                        {(setting[0]?.toggle?.liveOrder === zerodhaAccountType ? "Zerodha Live Order" : "Xts Live Order")}
                    </MDTypography>
                </MDBox>
            </MDBox>

            {/* <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
                <MDBox mt={0.5}>
                    <Switch checked={true} />
                </MDBox>
                <MDBox width="80%" ml={0.5}>
                    <MDTypography variant="button" fontWeight="regular" color="dark">
                        {(true ? "Zerodha Live Price" : "Xts Live Price")}
                    </MDTypography>
                </MDBox>
            </MDBox> */}



        </>

    )
}