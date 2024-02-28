
import React, { useState, useEffect } from 'react'
import axios from "axios";
import { apiUrl } from "../../../constants/constants.js"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea, Divider, Grid } from '@mui/material';
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox/index.js";
import MDTypography from "../../../components/MDTypography/index.js";
import { Link } from "react-router-dom";
import moment from 'moment';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';



const Courses = () => {
  const [data, setData] = useState([]);
  const limitSetting = 9;
  const [skip, setSkip] = useState(0);
  const [count, setCount] = useState(0);


  useEffect(() => {
    let call1 = axios.get(`${apiUrl}courses/adminpendingapproval?skip=${skip}&limit=${limitSetting}`, {
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
        setData(api1Response.data.data)
        setCount(api1Response.data.count)

      })
      .catch((error) => {
        // Handle errors here
        console.error(error);
      });
  }, [skip])

  const handlePageChange = (event, value) => {
    setSkip((Number(value)-1)*limitSetting)
  };

  return (
    <>
      {data.length > 0 ?

        <MDBox>
          <Grid container spacing={4} bgColor="dark" display="flex" justifyContent="flex-start" alignItems='center'>
            {data?.map((elem, index) => {

              return (

                <Grid key={elem?._id} item xs={12} md={4} lg={4} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                  <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                  {/* <Card sx={{ minWidth: '100%', cursor: 'pointer' }} component={Link} to={{ pathname: `/coursedetails?id=${elem?._id}&activestep=${0}` }} state={{ data: elem }} > */}
                  <Card
                      sx={{ minWidth: '100%', cursor: 'pointer' }}
                      component={Link}
                      to={{
                        pathname: `/coursedetails`,
                        search: `?id=${elem?._id}&activestep=${0}`,
                        state: { data: elem }
                      }}
                    >
                      <CardActionArea>
                        <Grid item xs={12} md={4} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                          <img src={elem?.courseImage} style={{ maxWidth: '100%', height: 'auto', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
                        </Grid>
                        <Grid item xs={12} md={4} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                          <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                            <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%', minHeight: 60 }}>
                              <MDTypography variant="h5" fontFamily='Segoe UI' fontWeight={400} style={{ textAlign: 'center' }}>
                                {elem?.courseName}
                              </MDTypography>
                            </MDBox>
                            <Divider style={{ width: '100%' }} />
                            <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                              {/* <MDTypography variant='caption' fontSize={11}>
    {`${moment.utc(elem?.publishedOn).utcOffset('+05:30').format('DD MMM YY')} • ${elem?.readingTime || 1} min read • ${elem?.viewCount || 0} views • ${elem?.reader.length || 0} reader`}
  </MDTypography> */}
                            </MDBox>
                          </CardContent>
                        </Grid>
                      </CardActionArea>
                    </Card>
                  </Grid>
                </Grid>
              )
            })}
          </Grid>
        </MDBox>
        :
        <Grid container spacing={1} xs={12} md={6} lg={12}>
          <Grid item mt={2} xs={6} md={3} lg={12} display="flex" justifyContent="center">
            <MDTypography color="light">No Completed Course(s)</MDTypography>
          </Grid>
        </Grid>
      }

      {data.length > 0 &&
        <Grid item xs={12} md={12} lg={12} mt={2} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
          <Stack spacing={2}>
            <Pagination style={{ backgroundColor: 'transparent' }} count={Math.ceil(count / limitSetting)} color="success" onChange={handlePageChange} />
          </Stack>
        </Grid>}

    </>
  )
}



export default Courses;