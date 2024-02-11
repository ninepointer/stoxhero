import React, {useEffect, useState} from 'react'
import axios from "axios";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
// import MDButton from "../../../components/MDTypography";

// Material Dashboard 2 React example components
// import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
// import Footer from "../../../examples/Footer";
import DataTable from "../../../examples/Tables/DataTable";
// import EditSharpIcon from '@mui/icons-material/EditSharp';


// Data
// import authorsTableData from "./data/authorsTableData";
// import projectsTableData from "./data/projectsTableData";
// import AlgoHeader from "../Header";
import XtsToken from '../data/xtsToken/XtsTokenData';
import XtsTokenExpired from '../data/xtsToken/XtsTokenDataExpired';
// import TradingARTokenModel from './XTSTokenModel';
// import TradingAccessEditModel from "./TradingAccessEditModel";
import XTSTokenModel from './XTSTokenModel';
import { Switch } from '@mui/material';
import MDButton from '../../../components/MDButton';
// import AutoLogin from './AutoLogin';

const XTSToken = () => {
  const { columns, rows } = XtsToken();
  const { columns: pColumns, rows: pRows } = XtsTokenExpired();
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

  const [activeData, setActiveData] = useState([]);
  const [inactiveData, setInactiveData] = useState([]);
  const [reRender, setReRender] = useState(true);

  useEffect(()=>{

      axios.get(`${baseUrl}api/v1/xtsTokenActive`)
      .then((res)=>{
          setActiveData(res.data.data);
      }).catch((err)=>{
          return new Error(err);
      })
      axios.get(`${baseUrl}api/v1/xtsTokenInactive`)
      .then((res)=>{
         setInactiveData(res.data.data);
      }).catch((err)=>{
          return new Error(err);
      })
  },[reRender])

  //console.log(activeData);

  async function changeStatus(id, status){
    if(status === "Active"){
        status = "Inactive";
    } else{
        status = "Active";
    }
    console.log("status", status)
    const res = await fetch(`${baseUrl}api/v1/changeStatus/${id}`, {
        credentials: "include",
        method: "PATCH",
        headers: {
            "Accept": "application/json",
            "content-type": "application/json"
        },
        body: JSON.stringify({
            status
        })
    });
    const dataResp = await res.json();
    console.log("isDefault", dataResp)
    console.log(dataResp);
    if (dataResp.status === 422 || dataResp.error) {
        window.alert(dataResp.error);
        // console.log("Failed to Edit");
    } else {
        if(status === "Active"){
            window.alert(`Token Active`);
        } else{
            window.alert(`Token Inactive`);
        }
    }
    reRender ? setReRender(false) : setReRender(true)
  }

  async function autoGenerate(){
    axios.get(`${baseUrl}api/v1/autoLoginXTS`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      },
      })
    .then(()=>{
        window.alert("added succesfully");
        reRender ? setReRender(false) : setReRender(true)
    }).catch((err)=>{
        return new Error(err);
    })
    
  }
  
  activeData.map((elem)=>{
    let activeparameter = {}
    activeparameter.accountid = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.accountId}
      </MDTypography>
    );
    activeparameter.accesstoken = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.accessToken}
      </MDTypography>
    );
    activeparameter.status = (
      <MDBox mt={0.5}>
        <Switch checked={elem.status === "Active"} onChange={() => {changeStatus(elem._id, elem.status)}} />
      </MDBox>
    );
    activeparameter.generatedon = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.generatedOn}
      </MDTypography>
    );
   
    rows.push(activeparameter)
  })

  inactiveData.map((elem)=>{
    let inactiveparameter = {}
    inactiveparameter.accountid = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.accountId}
      </MDTypography>
    );
    inactiveparameter.accesstoken = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.accessToken}
      </MDTypography>
    );
    inactiveparameter.status = (
      <MDBox mt={0.5}>
        <Switch checked={elem.status === "Active"} onChange={() => {changeStatus(elem._id, elem.status)}} />
      </MDBox>
    );
    inactiveparameter.generatedon = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.generatedOn}
      </MDTypography>
    );
   
    pRows.push(inactiveparameter)
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
                              Active XTS Token
                          </MDTypography>
                          <MDButton variant="outlined" onClick={autoGenerate}>
                            Auto Generate
                          </MDButton>
                          <XTSTokenModel Render={{reRender, setReRender}}/>
                          
                      </MDBox>
                      <MDBox pt={3}>
                          <DataTable
                              table={{ columns, rows }}
                              isSorted={false}
                              entriesPerPage={false}
                              showTotalEntries={false}
                              noEndBorder
                          />
                      </MDBox>
                  </Card>
              </Grid>
              <Grid item xs={12} md={12} lg={12}>
                  <Card>
                      <MDBox
                          mx={2}
                          mt={-3}
                          py={3}
                          px={2}
                          variant="gradient"
                          bgColor="info"
                          borderRadius="lg"
                          coloredShadow="info"
                      >
                          <MDTypography variant="h6" color="white">
                              Expired Access & Request Token
                          </MDTypography>
                      </MDBox>
                      <MDBox pt={3}>
                          <DataTable
                              table={{ columns: pColumns, rows: pRows }}
                              isSorted={false}
                              entriesPerPage={false}
                              showTotalEntries={false}
                              noEndBorder
                          />
                      </MDBox>
                  </Card>
              </Grid>
          </Grid> 
      </MDBox> 
    </>
  )
}

export default XTSToken;