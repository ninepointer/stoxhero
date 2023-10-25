
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


const ActiveCareers = ({type}) => {
const [applicationCount, setApplicationCount] = useState(0);
const [activeCareer,setActiveCareer] = useState([]);
let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

// React.useEffect(()=>{
//     // console.log("Inside Use Effect")
//     // console.log("Inside Use Effect Id & Old Object Id: ",id,oldObjectId)
//     axios.get(`${baseUrl}api/v1/career/${career}`)
//     .then((res)=>{
//         setContestData(res?.data?.data);
//         console.log("Contest Data in Create Contest Form: ",res?.data?.data)
//         setLinkedContestRule(res?.data?.data?.contestRule._id)
//             setTimeout(()=>{setIsLoading(false)},500) 
//         // setIsLoading(false)
//     }).catch((err)=>{
//         //window.alert("Server Down");
//         return new Error(err);
//     })

// },[id,isSubmitted])

  useEffect(()=>{
    let call1 = axios.get(`${baseUrl}api/v1/career?type=Workshop`,{
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
      console.log(api1Response.data.data);
      setActiveCareer(api1Response.data.data)
    })
    .catch((error) => {
      // Handle errors here
      console.error(error);
    });
  },[])
  console.log("Applicant Count: ",applicationCount)
    return (
      <>
      {activeCareer.length > 0 ?
        
          <MDBox>
            <Grid container spacing={2} bgColor="dark">
              {activeCareer?.map((e)=>{

                    return (
                      
                      <Grid key={e._id} item xs={12} md={12} lg={12} bgColor="dark">
                      <MDBox padding={0} style={{borderRadius:4}}>
                      <MDButton 
                        variant="contained" 
                        color={"light"} 
                        size="small" 
                        component = {Link}
                        to={{
                            pathname: `/careerdetails`,
                          }}
                        state={{data: e}}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={20} style={{color:"black",paddingLeft:4,paddingRight:4,fontWeight:'bold'}}>Job Title: {e?.jobTitle}</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}} display="flex" alignContent="center" alignItems="center">
                                  <MDBox display="flex" flexDirection="column">
                                  <MDTypography fontSize={15} display="flex" justifyContent="flex-start" style={{color:"black",paddingLeft:4,paddingRight:4,fontWeight:'bold'}}>Job Description</MDTypography>
                                  <MDTypography fontSize={15} display="flex" justifyContent="flex-start" style={{color:"black",paddingLeft:4,paddingRight:4, textAlign:'left'}}>{e?.jobDescription}</MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"black"}}>No. of Applicants: <span style={{fontSize:11,fontWeight:700}}>{e?.applicants?.length}</span></MDTypography>
                              </Grid>
      
                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                                  <MDTypography fontSize={9} style={{color:"black"}}>Status: <span style={{fontSize:11,fontWeight:700}}>{e?.status ? e?.status : 'Status not available'}</span></MDTypography>
                              </Grid>
      
                          </Grid>
                      </MDButton>
                      </MDBox>
                      </Grid>
                      
                    )
                  // }
                // let color = (myPortfolio === e._id) ? "warning" : "light";
              })}
            </Grid>
          </MDBox>
          :
         <Grid container spacing={1} xs={12} md={6} lg={12}>
          <Grid item mt={2} xs={6} md={3} lg={12} display="flex" justifyContent="center">
            <MDTypography color="light">No active Workshop(s)</MDTypography>
          </Grid>
         </Grid>
         } 

      </>
)}



export default ActiveCareers;