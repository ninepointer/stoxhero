import { Box, Grid,Stack,Tooltip, Typography } from '@mui/material'
import MDButton from '../../../components/MDButton'
import MDBox from '../../../components/MDBox'
import MDTypography from '../../../components/MDTypography'
import MDAvatar from '../../../components/MDAvatar'
// import Title from '../components/Title/index'
import React, {useEffect, useState} from 'react'
// import theme from '../utils/theme/index'
// import ServiceCard from '../components/Cards/ServiceCard'
import { Link } from 'react-router-dom';
// import Logo from "../../../assets/images/logo1.jpeg"
import jobs from "../../../assets/images/jobs.png"
import axios from "axios";


const Internship = () => {
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const [career, setCareer] = useState([]);
    useEffect(()=>{
      axios.get(`${baseUrl}api/v1/career`)
      .then((res)=>{
        setCareer(res.data?.data);
        console.log(career.length)
        
        
      })
    }, [])

    return (
      <Box p={5}>
        <Grid container flexDirection="column" spacing={4}>
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
                      state={{ data: elem }}
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
                      >
                        <MDAvatar src={jobs} size="xl" display="flex" justifyContent="left" />
                        <MDBox ml={2} display="flex" flexDirection="column">
                          <MDTypography fontSize={20} fontWeight="bold" display="flex" justifyContent="left" style={{ color: "black" }}>
                            {`${elem?.jobTitle} (${elem?.jobType})`}
                          </MDTypography>
                          <MDTypography fontSize={15} fontWeight="bold" display="flex" justifyContent="center" style={{ color: "black" }}>
                            Click Here to Apply!
                          </MDTypography>
                        </MDBox>
                      </Grid>
                    </MDButton>
                  </Tooltip>
                </MDBox>
              </Grid>
            ))
          ) : (

            <Grid container spacing={10} flexWrap="wrap-reverse" alignItems="center">
        {/* Left */}
        <Grid item border="1px solid transparent" xs={12} md={6}>
          <Stack border="1px solid transparent" spacing={2} sx={{ maxWidth: 480 }}>

          
            
         < Typography variant="h5" color="#fff" sx={{ pb: 2 }}>
          Thank you for showing your intrest ! 
         </Typography>

            <Typography variant="body1" color="rgba(255, 255, 255, 0.6)" sx={{ pb: 2 }}>

             But sorry , No job possitions avilable at this moment. Kindly visit after some time or contact us for more information...
              
            </Typography>

            
          </Stack>
        </Grid>

        {/* Right */}
        <Grid item xs={12} md={6}>
          <img
            src="https://static.wixstatic.com/media/b9acc2_008499800fb54c848577218f49d05660~mv2.png/v1/fill/w_640,h_580,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/b9acc2_008499800fb54c848577218f49d05660~mv2.png"
            style={{ width: "100%", objectFit: "contain",}}
          />
        </Grid>
      </Grid>









            // <Grid lg={12} xs={10}  alignItems="center" justifyContent="center" container border="1px solid transparent" sx={{background:"linear-gradient(120deg,#5f5f61,transparent) border-box"}} color="#fff" borderRadius="10px" >
            
            //   <Grid height="290px" item flexDirection="column" justifyContent='center' alignItems="center">

            //     <img src="https://static.wixstatic.com/media/b9acc2_008499800fb54c848577218f49d05660~mv2.png/v1/fill/w_640,h_580,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/b9acc2_008499800fb54c848577218f49d05660~mv2.png" sx={{height:"30px"}} />
                

            //   </Grid>
            // </Grid>
          )}
        </Grid>
      </Box>
    );
    
}

export default Internship
