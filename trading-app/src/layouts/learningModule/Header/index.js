import React, {useState} from 'react';
import { CircularProgress } from '@mui/material';
import MDBox from '../../../components/MDBox';
import {Grid} from '@mui/material';
import MDButton from '../../../components/MDButton';
import {Link} from 'react-router-dom'
import { Card } from '@material-ui/core';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import MDTypography from '../../../components/MDTypography';
import learningmodule from "../../../assets/images/learningmodule.png";
//data
import ActiveModules from '../data/activeModules'

export default function LabTabs() {
  const [value, setValue] = React.useState('1');
  const [isLoading,setIsLoading] = useState(false);

  const handleChange = (event, newValue) => {
    setIsLoading(true)
    setValue(newValue);
    setTimeout(() => {
      setIsLoading(false)
    }, 500);
  };

  return (
    <MDBox color="light" mt={2} mb={1} p={2} borderRadius={10} minHeight='auto'>
        <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
        <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='flex-end'>
            <MDBox display='flex' justifyContent='center'>
              <MDBox pr={1} display='flex' justifyContent='center'>
                <MDButton 
                    variant="contained" 
                    color="success" 
                    size="small"
                    component={Link}
                    to='/learningmoduledetails/New'
                >
                    Create Module
                </MDButton>
              </MDBox>
              <MDBox pl={1} display='flex' justifyContent='center'>
                <MDButton 
                    variant="contained" 
                    color="success" 
                    size="small"
                    component={Link}
                    to='/modulechapterdetails/New'
                >
                    Create Chapter
                </MDButton>
              </MDBox>
            </MDBox>
        </Grid>
        </Grid>

        <Grid container spacing={1} mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' sx={{ minWidth: '100%' }}>
          
          <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center'>
            <Card style={{background:'linear-gradient(195deg, #66BB6A, #43A047)'}} sx={{ minWidth: '100%' }}>
            <CardContent>
              <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                  <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                    <img src={learningmodule} width={100}/>
                  </Grid>
                  <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                  <MDTypography color='light' fontSize={15} fontWeight='bold'>
                      Learning Modules
                  </MDTypography>
                  </Grid>
              </Grid>
            </CardContent>
            <CardActions>
                <Grid container xs={12} md={12} lg={12} mt={-2} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='flex-end' alignItems='center' alignContent='center'>
                        <MDButton 
                            size="small"
                            variant='text'
                            component = {Link}
                            to={{
                                pathname: `/testzoneprofile`,
                            }}
                            // state={{data: e}}
                        >
                            View
                        </MDButton>
                    </Grid>
                </Grid>
            </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center'>
            <Card style={{background:'linear-gradient(195deg, #49a3f1, #1A73E8)'}} sx={{ minWidth: '100%' }}>
            <CardContent>
              <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                  <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                    <img src={learningmodule} width={100}/>
                  </Grid>
                  <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                  <MDTypography color='light' fontSize={15} fontWeight='bold'>
                      Module Chapters
                  </MDTypography>
                  </Grid>
              </Grid>
            </CardContent>
            <CardActions>
                <Grid container xs={12} md={12} lg={12} mt={-2} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='flex-end' alignItems='center' alignContent='center'>
                        <MDButton 
                            size="small"
                            variant='text'
                            component = {Link}
                            to={{
                                pathname: `/testzoneprofile`,
                            }}
                            // state={{data: e}}
                        >
                            View
                        </MDButton>
                    </Grid>
                </Grid>
            </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center'>
            <Card style={{background:'linear-gradient(195deg, #FFA726, #FB8C00)'}} sx={{ minWidth: '100%' }}>
            <CardContent>
              <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                  <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                    <img src={learningmodule} width={100}/>
                  </Grid>
                  <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                  <MDTypography color='light' fontSize={15} fontWeight='bold'>
                      Module Learners
                  </MDTypography>
                  </Grid>
              </Grid>
            </CardContent>
            <CardActions>
                <Grid container xs={12} md={12} lg={12} mt={-2} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='flex-end' alignItems='center' alignContent='center'>
                        <MDButton 
                            size="small"
                            variant='text'
                            component = {Link}
                            to={{
                                pathname: `/testzoneprofile`,
                            }}
                            // state={{data: e}}
                        >
                            View
                        </MDButton>
                    </Grid>
                </Grid>
            </CardActions>
            </Card>
          </Grid>

        </Grid>

        <Grid container spacing={1} mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' sx={{ minWidth: '100%' }}>
            <ActiveModules/>
        </Grid>
      
    </MDBox>
  );
}