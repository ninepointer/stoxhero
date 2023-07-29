import React, { useEffect, useState } from 'react'
import axios from "axios"
import uniqid from "uniqid";
import MDBox from "../../components/MDBox";
import Switch from "@mui/material/Switch";



export default function TraderSetting({setUpdatedData, userId, isRealTradeEnable}) {

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
    const [isChecked, setIsChecked] = useState(isRealTradeEnable)


    const placeLiveOrder = async ()=>{
        
            axios.get(`${baseUrl}api/v1/switchRealToMockSingleUser/${userId}`, {
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                },
            })
            .then((res)=>{
                setUpdatedData(res.data)
            }).catch((err)=>{
                console.log(err);
            })

    }

  return (

    <MDBox mt={0.5}>
        <Switch  checked={isChecked}   onChange={() => {placeLiveOrder()}} />
    </MDBox>

  )
}