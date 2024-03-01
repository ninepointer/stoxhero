import { Box, Grid,Stack,Tooltip, Typography } from '@mui/material'
import MDButton from '../../../components/MDButton'
import MDBox from '../../../components/MDBox'
import MDTypography from '../../../components/MDTypography'
import { CircularProgress, formLabelClasses } from "@mui/material";
import React, {useEffect, useState} from 'react'
import ReactGA from "react-ga";
import { Link } from 'react-router-dom';
import jobs from "../../../assets/images/jobs.png"
import axios from "axios";
import {apiUrl} from '../../../constants/constants';


const Internship = ({campaignCode}) => {
  const [isLoading,setIsLoading] = useState(false);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
  const [career, setCareer] = useState([]);
  const [careerApplicationCounts, setCareerApplicationCounts] = useState([]);
    useEffect(()=>{
      setIsLoading(true)
      ReactGA.pageview(window.location.pathname)
      axios.get(`${baseUrl}api/v1/career/live?type=Workshop`)
      .then((res)=>{
        setCareer(res.data?.data);
        // console.log(career.length) 
        setTimeout(()=>{
          setIsLoading(false);
        },500) 
      })
    }, [])

    useEffect(() => {
      async function fetchData() {
        const counts = await Promise.all(
          career.map(async (elem) => {
            try {
              const res = await axios.get(`${apiUrl}career/careerapplicationcount/${elem?._id}`);
              return res?.data?.count;
            } catch (error) {
              console.log(error);
              return 0; // You can handle the error gracefully
            }
          })
        );
        setCareerApplicationCounts(counts);
      }
      fetchData();
    }, [career]);

    return (
      <Box mt={2} style={{width:'100%'}}>
        <Grid container flexDirection="column" spacing={2}>
        {!isLoading ?
        <>
          {career.length > 0 ? (
            career.map((elem, index) => (
                  <Grid key={elem._id} item xs={12} md={12} lg={12}>
                    <MDBox style={{ borderRadius: 4 }}>
                      <Tooltip title="Click me!">
                        <MDButton
                          variant="contained"
                          color="secondary"
                          size="small"
                          style={{minWidth: "100%", backgroundColor:'#315c45', color:'white'}}
                          component={Link}
                          to={{
                            pathname: `/careers/${elem?.jobTitle}/jobdescription`,
                          }}
                          state={{ data: elem, campaignCode: campaignCode }}
                        >
                          <Grid
                            item
                            xs={12}
                            md={6}
                            lg={12}
                            mb={1}
                            display="flex"
                            alignContent="center"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Grid container xs={12} md={12} lg={12} display="flex" justifyContent="center" alignItems="center" style={{ width: "100%" }}>
                              
                              <Grid item xs={12} md={12} lg={12} display="flex" justifyContent="center" style={{ width: "100%" }}>
                                
                                <MDBox display="flex" justifyContent="center" style={{ width: "100%" }}>
                                  
                                  <Grid container xs={12} md={12} lg={12} display="flex" justifyContent="center" style={{ width: "100%" }}>
                                    <Grid item xs={12} md={12} lg={12} display="flex" justifyContent="left" style={{ width: "100%" }}>
                                      <MDTypography fontSize={18} fontWeight="bold" style={{ color: "white" }}>
                                        {elem?.jobTitle}
                                      </MDTypography>
                                    </Grid>
            
                                    <Grid item xs={12} md={12} lg={12} display="flex" justifyContent="left" style={{ width: "100%" }}>
                                      <MDTypography fontSize={14} style={{ color: "#f4f1bb" }}>
                                        {elem?.jobType} | {elem?.jobLocation === "WFH" ? "Remote" : "In-Office"} 
                                      </MDTypography>
                                    </Grid>
            
                                    <Grid item xs={12} md={12} lg={12} display="flex" justifyContent="left" style={{ width: "100%" }}>
                                      <MDTypography fontWeight='bold' fontSize={12} style={{ color: "white" }}>
                                       👩🏻‍💻 {(careerApplicationCounts[index])?.toLocaleString()} applicants {elem?.activelyRecruiting === true ? " | 👨‍💼👩‍💼 Actively recruiting" : ""} 
                                      </MDTypography>
                                    </Grid>
            
                                  </Grid>
                                </MDBox>
                              </Grid>
                            </Grid>
                          </Grid>
                        </MDButton>
                      </Tooltip>
                    </MDBox>
                  </Grid>
                )
            )
          ) : (

            <Grid container spacing={10} flexWrap="wrap-reverse" alignItems="center">
        
              <Grid item border="1px solid transparent" xs={12} md={6}>
                <Stack border="1px solid transparent" spacing={2} sx={{ maxWidth: 480 }}>
              < Typography variant="h5" color="#fff" sx={{ pb: 2 }}>
                Thank you for showing interest! 
              </Typography>

                  <Typography variant="body1" color="rgba(255, 255, 255, 0.6)" sx={{ pb: 2 }}>

                  No currently we don't have any open positions. Kindly visit after sometime or contact us for more information...
                    
                  </Typography>

                  
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <img
                  src="https://static.wixstatic.com/media/b9acc2_008499800fb54c848577218f49d05660~mv2.png/v1/fill/w_640,h_580,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/b9acc2_008499800fb54c848577218f49d05660~mv2.png"
                  style={{ width: "100%", objectFit: "contain",}}
                />
              </Grid>
            </Grid>
          )}
        </>
        :
        <MDBox minHeight="66.5vH" width="100%" display='flex' justifyContent='center' alignItems='center'>
          <CircularProgress size={100} color="light" />
        </MDBox>        
        }
        </Grid>
      </Box>
    );
    
}

export default Internship
