import React, {useState, useEffect} from 'react'
import moment from 'moment'

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import DataTable from "../../examples/Tables/DataTable";
// import RoleData from './data/RoleData';
import User from './searchUser';
import axios from "axios"


const DeactivateUser = () => {
    const [reRender, setReRender] = useState(true);
    const [data, setData] = useState([]);
    // const { columns, rows } = RoleData(reRender);
    // console.log(rows)
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

    useEffect(()=>{

        // axios.get(`${baseUrl}api/v1/readmocktradecompanypagination/${skip}/${limit}`)
        axios.get(`${baseUrl}api/v1/user/deactivate`, {withCredentials: true})
        .then((res)=>{
            setData(res?.data?.data);
              console.log(res?.data?.data);
        }).catch((err)=>{
            //window.alert("Server Down");
            return new Error(err);
        })
    },[reRender])
    const columns = [
        { Header: "Name", accessor: "name", align: "center"},
        { Header: "Email", accessor: "email", align: "center" },
        { Header: "Mobile", accessor: "mobile", align: "center" },
        { Header: "Time", accessor: "time", align: "center" },
    ];

    let rows = [];

    data?.map((elem)=>{
        let obj = {}
    
        obj.name = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {elem?.deactivatedUser?.first_name + " " + elem?.deactivatedUser?.last_name}
          </MDTypography>
          );
          obj.email = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {elem.email}
          </MDTypography>
        );
        obj.mobile = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {elem?.mobile}
          </MDTypography>
        );
        obj.time = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {moment.utc(elem.createdOn).format('DD-MMM-YY HH:mm:ss')}
          </MDTypography>
        );
    
        rows.push(obj)
      })
    return (
        <>
            <MDBox pt={6} pb={3} >
                <Grid container spacing={6}>
                    <Grid item xs={12} md={12} lg={12}>
                        <User reRender={reRender} setReRender={setReRender} />
                        <Card>
                            <MDBox
                            // mt={2}
                                // mx={2}
                                mt={2}
                                // py={1}
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
                                    Deactivated Users
                                </MDTypography>
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
                </Grid>
            </MDBox>
        </>
    )
}

export default DeactivateUser