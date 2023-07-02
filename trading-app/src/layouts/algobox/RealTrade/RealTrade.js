import axios from 'axios';
import React, { useEffect, useState } from 'react'
import MDBox from "../../../components/MDBox";
import Switch from "@mui/material/Switch";



export default function RealTrade({ Render, id, tradingAlgo }) {
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const { reRender, setReRender } = Render;
    const [isReal, setIsReal] = useState();



    useEffect(() => {
        axios.get(`${baseUrl}api/v1/getLiveUser/${id}`)
        .then((res) => {
            setIsReal(res?.data?.result ? true : false)
        }).catch((err) => {
            return new Error(err);
        })
    }, [reRender])


    // async function patchReqForRealTradeSwitching(id, realTrade) {
    //     //console.log("realTrade", realTrade)
    //     if (realTrade) {
    //         realTrade = false;
    //     } else {
    //         realTrade = true;
    //     }
    //     const res = await fetch(`${baseUrl}api/v1/readtradingAlgo/${id}`, {
    //         method: "PATCH",
    //         headers: {
    //             "Accept": "application/json",
    //             "content-type": "application/json"
    //         },
    //         body: JSON.stringify({
    //             realTrade
    //         })
    //     });
    //     const dataResp = await res.json();
    //     //console.log(dataResp);
    //     if (dataResp.status === 422 || dataResp.error || !dataResp) {
    //         window.alert(dataResp.error);
    //         // //console.log("Failed to Edit");
    //     } else {
    //         // //console.log(dataResp);
    //         window.alert("Switched succesfull");
    //         // //console.log("Edit succesfull");
    //     }
    //     reRender ? setReRender(false) : setReRender(true)
    // }

    async function switchTrade(isRealTrade) {

        // patchReqForRealTradeSwitching(id, isRealTrade);


        axios.get(`${baseUrl}api/v1/switchRealToMock`, {
            withCredentials: true,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
        })
        // Promise.all([call1])
        .then((api1Response) => {
            console.dir("api1Response.data", api1Response)
            if(api1Response.data === "ok"){
                console.log("in response")
                window.alert("switched to mock trade succesfull");
                reRender ? setReRender(false) : setReRender(true);
            }
        })
        .catch((error) => {
            // Handle errors here
            window.alert("Error occured");
            console.error("err is", error);
        });
        
    }

    return (
        <>
            <MDBox mt={0.5}>
                <Switch checked={isReal} onChange={() => { switchTrade(isReal) }} />
            </MDBox>

        </>
    )
}







