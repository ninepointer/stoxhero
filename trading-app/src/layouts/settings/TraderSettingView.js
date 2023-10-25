import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import Card from "@mui/material/Card";
import DataTable from "../../examples/Tables/DataTable";
import TraderSetting from "./TraderSetting";


function TraderSettingView() {

  const [userData,setUserData] = useState([]);
  const [updatedData, setUpdatedData] = useState([]);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

 useEffect(()=>{
       axios.get(`${baseUrl}api/v1/getLiveUser`, {withCredentials: true})
      .then((res)=>{
          setUserData(res?.data?.data)
      }).catch((err)=>{
          return new Error(err);
      })

  },[updatedData])

  let columns = [
    { Header: "Trader Name", accessor: "name", align: "center" },
    { Header: "Mock/Real", accessor: "mockOrReal", align: "center" },
  ]

  let rows = [];

  userData.sort((a,b)=>{
    if(a.userName > b.userName){
        return 1
    }
    if(a.userName < b.userName){
        return -1
    }
    return 0
  })

  userData.map((elem)=>{
    let obj = {};
    // if(elem.algoName === algo[0]?.algoName){
        obj.name = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                {(elem?.userId?.first_name + " " + elem?.userId?.last_name)}
            </MDTypography>
        );
        obj.mockOrReal = (
            <MDTypography component="a" variant="caption"  fontWeight="medium">
                <TraderSetting setUpdatedData={setUpdatedData} userId={elem?.userId?._id}  isRealTradeEnable={elem?.isRealTradeEnable}/>
            </MDTypography>
        );

        rows.push(obj)
    // }
  })


  return (

    <>
    <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
            <Grid item xs={12} md={12} lg={12}>
                <Card>
                    <MDBox
                        mx={2}
                        mt={-3}
                        py={1}
                        px={2}
                        variant="gradient"
                        bgColor="info"
                        borderRadius="lg"
                        coloredShadow="info"
                        sx={{
                            display: 'flex',
                            justifyContent: "space-between",
                          }}>

                        <MDTypography variant="h6" color="white" py={2.5}>
                        Trader Setting
                        </MDTypography>
                    </MDBox>
                    <MDBox pt={3}>
                        <DataTable
                            table={{ columns, rows }}
                            isSorted={false}
                            entriesPerPage={true}
                            showTotalEntries={false}
                            noEndBorder
                        />
                    </MDBox>
                </Card>
            </Grid>
        </Grid> 
    </MDBox> 
    </>

  );
}

export default TraderSettingView;

