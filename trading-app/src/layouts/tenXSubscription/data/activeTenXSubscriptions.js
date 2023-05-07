import React, { useState } from 'react'
import MDBox from '../../../components/MDBox'
import MDTypography from '../../../components/MDTypography'
import MDButton from '../../../components/MDButton'
import { Grid } from '@mui/material'
import axios from "axios";

export default function ActiveTenXSubscriptions() {
    const [tenX,setTenX] = useState([])
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

    React.useEffect(()=>{
        axios.get(`${baseUrl}api/v1/tenx/active`)
        .then((res)=>{
          console.log(res?.data?.data)
          setTenX(res?.data?.data);
        }).catch((err)=>{
            return new Error(err)
        })
    })

  return (
    <MDBox>
       <Grid container spacing={2}>
            {
            <Grid item xs={12} md={6} lg={4}>
                <MDBox bgColor='light'>
                    <MDTypography>Hello</MDTypography>
                </MDBox>
            </Grid>
            }
       </Grid>
    </MDBox>
  )
}

// export default ActiveTenXSubscriptions