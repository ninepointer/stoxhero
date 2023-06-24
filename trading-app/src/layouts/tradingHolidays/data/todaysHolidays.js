
import React, {useState, useEffect} from 'react'
import Grid from "@mui/material/Grid";
import axios from "axios";
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDAvatar from "../../../components/MDAvatar";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import money from "../../../assets/images/money.png"
import { Link, useLocation } from "react-router-dom";
import moment from 'moment';


const TodaysHoliday = ({setTodaysHolidayCount}) => {
// const [todaysHolidayCount, setTodaysHolidayCount] = useState(0);
const [todaysHolidays,setTodaysHolidays] = useState([]);
let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  useEffect(()=>{
    let call1 = axios.get(`${baseUrl}api/v1/tradingholiday/today`,{
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                  },
                })
    Promise.all([call1])
    .then(([api1Response]) => {
      // Process the responses here
      setTodaysHolidays(api1Response.data.data)
      setTodaysHolidayCount(api1Response.data.results)
    })
    .catch((error) => {
      // Handle errors here
    });
  },[])
    return (
      <>
      {todaysHolidays.length > 0 ?
        
          <MDBox>
            <Grid container spacing={1} bgColor="dark">
            <Grid item xs={12} md={12} lg={12} bgColor="dark">
            <MDBox padding={0} style={{borderRadius:4}}>
            <MDButton 
                variant="contained" 
                color={"light"} 
                size="small" 
                component = {Link}
                style={{minWidth:'100%'}}
            >
                <Grid container lg={12}>

                    <Grid item xs={4} md={4} lg={2} display="flex" justifyContent="center" >
                        <MDTypography fontSize={15} style={{color:"black",paddingRight:4,fontWeight:'bold'}}>#</MDTypography>
                    </Grid>
                              
                    <Grid item xs={4} md={4} lg={4} display="flex" justifyContent="center" >
                        <MDTypography fontSize={15} style={{color:"black",paddingRight:4,fontWeight:'bold'}}>Holiday Name</MDTypography>
                    </Grid>

                    <Grid item xs={4} md={4} lg={3} display="flex" justifyContent="center" >
                        <MDTypography fontSize={15} style={{color:"black",paddingRight:4, fontWeight:'bold'}}>Holiday Date</MDTypography>
                    </Grid>

                    <Grid item xs={4} md={4} lg={3} display="flex" justifyContent="center" >
                        <MDTypography fontSize={15} style={{color:"black",paddingRight:4, fontWeight:'bold'}}>Day</MDTypography>
                    </Grid>

                </Grid>
            </MDButton>
            </MDBox>
            </Grid>
              {todaysHolidays?.map((e,index)=>{

                    return (
                      
                      <Grid key={e._id} item xs={12} md={12} lg={12} bgColor="dark">
                      <MDBox padding={0} style={{borderRadius:4}}>
                      <MDButton 
                        variant="contained" 
                        color={"light"} 
                        size="small" 
                        component = {Link}
                        style={{minWidth:'100%'}}
                        to={{
                            pathname: `/holidaydetails/${e?.holidayName}`,
                          }}
                        state={{data: e}}
                      >
                          <Grid container spacing={1}>
                              
                             <Grid item xs={4} md={4} lg={2} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={15} style={{color:"black",paddingRight:4}}>{index+1}</MDTypography>
                              </Grid>

                              <Grid item xs={4} md={4} lg={4} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={15} style={{color:"black",paddingRight:4}}>{e?.holidayName}</MDTypography>
                              </Grid>

                              <Grid item xs={4} md={4} lg={3} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={15} style={{color:"black",paddingRight:4}}>{moment.utc(e?.holidayDate).utcOffset('+05:30').format('DD-MMM-YYYY')}</MDTypography>
                              </Grid>

                              <Grid item xs={4} md={4} lg={3} display="flex" justifyContent="center" >
                                  <MDTypography fontSize={15} style={{color:"black",paddingRight:4}}>{moment.utc(e?.holidayDate).utcOffset('+05:30').format('dddd')}</MDTypography>
                              </Grid>
      
                          </Grid>
                      </MDButton>
                      </MDBox>
                      </Grid>
                      
                    )
              })}
            </Grid>
          </MDBox>
          :
         <Grid container spacing={1} xs={12} md={6} lg={12}>
          <Grid item mt={2} xs={6} md={3} lg={12} display="flex" justifyContent="center">
            <MDTypography color="light">No Holiday for Today</MDTypography>
          </Grid>
         </Grid>
         } 

      </>
)}



export default TodaysHoliday;