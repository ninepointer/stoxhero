import { Box, Grid,Stack,Tooltip, Typography } from '@mui/material'
import MDButton from '../../../components/MDButton'
import MDBox from '../../../components/MDBox'
import MDTypography from '../../../components/MDTypography'
import MDAvatar from '../../../components/MDAvatar'
// import Title from '../components/Title/index'
import { CircularProgress, formLabelClasses } from "@mui/material";
import React, {useEffect, useState} from 'react'
// import theme from '../utils/theme/index'
// import ServiceCard from '../components/Cards/ServiceCard'
import { Link } from 'react-router-dom';
// import Logo from "../../../assets/images/logo1.jpeg"
import jobs from "../../../assets/images/jobs.png"
import axios from "axios";


const Internship = ({campaignCode}) => {
  // console.log('campaignCode', campaignCode);
  const [isLoading,setIsLoading] = useState(false);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const [career, setCareer] = useState([]);
    useEffect(()=>{
      setIsLoading(true)
      axios.get(`${baseUrl}api/v1/career?type=Workshop`)
      .then((res)=>{
        setCareer(res.data?.data);
        // console.log(career.length) 
        setTimeout(()=>{
          setIsLoading(false);
        },1000) 
      })
    }, [])

    return (
      <Box p={2} mt={0} >
        <Grid container flexDirection="column" spacing={2}>
        {!isLoading ?
        <>
          {career.length > 0 ? (
            career.map((elem) => (
              <Grid key={elem._id} item xs={16} md={15} lg={20}>
                <MDBox style={{ borderRadius: 4 }}>
                  <Tooltip title="Click me!">
                    <MDButton
                      variant="contained"
                      color="light"
                      size="small"
                      style={{ minWidth: "100%" }}
                      component={Link}
                      to={{
                        pathname: `/jobdescription`,
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
                        <Grid container display="flex" justifyContent="center" alignItems="center" minWidth='40vH'>
                          {/* <Grid item lg={2} display="flex" justifyContent="left" alignItems="center">
                            <MDAvatar src={jobs} size="xl" />
                          </Grid> */}
                          <Grid item lg={10} display="flex" justifyContent="center">
                            <MDBox>
                              <MDTypography fontSize={20} fontWeight="bold" display="flex" justifyContent="center" style={{ color: "black" }}>
                                {elem?.jobTitle}
                              </MDTypography>
                              <MDTypography color='info' fontSize={15} fontWeight="bold" display="flex" justifyContent="center">
                                {elem?.listingType}
                              </MDTypography>
                              <MDTypography fontSize={15} fontWeight="bold" display="flex" justifyContent="center" style={{ color: "black" }}>
                                Job Location: {elem?.jobLocation}
                              </MDTypography>
                              <MDTypography fontSize={10} fontWeight="bold" display="flex" justifyContent="center" style={{ color: "black" }}>
                                Click Here to Apply!
                              </MDTypography>
                          </MDBox>
                          </Grid>
                        </Grid>
                        {/* <MDBox display="flex" justifyContent="flex-start">
                        <MDAvatar src={jobs} size="xl" />
                        </MDBox>
                        <MDBox ml={2} display="flex" flexDirection="column" justifyContent="center">
                          <MDBox>
                          <MDTypography fontSize={20} fontWeight="bold" style={{ color: "black" }}>
                            {`${elem?.jobTitle} (${elem?.jobType})`}
                          </MDTypography>
                          </MDBox>
                          <MDBox>
                          <MDTypography fontSize={15} fontWeight="bold" style={{ color: "black" }}>
                            Click Here to Apply!
                          </MDTypography>
                          </MDBox>
                        </MDBox> */}
                      </Grid>
                    </MDButton>
                  </Tooltip>
                </MDBox>
              </Grid>
            ))
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

        <CircularProgress size={100} color="light" />
                  
        }
        </Grid>
      </Box>
    );
    
}

export default Internship
