import { Box, Grid,Tooltip } from '@mui/material'
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
      })
    }, [])

    return (
        <Box p={5}>
            <Grid container spacing={2}>
            
            
              {career.map((elem)=>{
                  return(
                    <Grid key={elem._id} item xs={12} md={6} lg={4}>
                      <MDBox style={{borderRadius:4}}>
                        <Tooltip title="Click me!">
                          <MDButton variant="contained" color="light" size="small" style={{minWidth:'100%'}}
                          component={Link} 
                          to={{
                            pathname: `/jobdescription`,
                          }}
                          state= {{data: elem}}
                          >
                              <Grid item xs={12} md={6} lg={12} mb={1} display="flex" alignContent="center" alignItems="center">
                                  <MDAvatar src={jobs} size="xl" display="flex" justifyContent="left"/>
                                  <MDBox ml={2} display="flex" flexDirection="column">
                                    <MDTypography fontSize={20} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>{`${elem?.jobTitle} (${elem?.jobType})`}</MDTypography>
                                    <MDTypography fontSize={15} fontWeight="bold" display="flex" justifyContent="center" style={{color:"black"}}>Apply Now</MDTypography>
                                  </MDBox>
                              </Grid>  
                          </MDButton>
                        </Tooltip>
                      </MDBox>
                    </Grid>
                  )
              })}

            </Grid>

        </Box>
    )
}

export default Internship
