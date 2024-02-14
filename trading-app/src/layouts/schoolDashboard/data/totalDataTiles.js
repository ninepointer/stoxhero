
import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActionArea, Divider, Grid } from '@mui/material';
import MDTypography from "../../../components/MDTypography/index.js";


const TotalDataTile = ({overallRevenue}) => {

    return (
    <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{minWidth: '100%',height: 'auto'}}>
        <Grid item xs={12} md={12} lg={4}>
            <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1, borderRadius:50, 
            backgroundColor: '#F0360E',
            transition: 'background-color 0.3s, color 0.3s',
            '&:hover': {
              backgroundColor: '#FFFFFF', // Change background color on hover
              color: '#F0360E', // Change text color on hover
              '& .MuiTypography-root': {
                color: '#F0360E', // Change text color of MuiTypography components on hover
              },
            } }} >
                <CardActionArea>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%', height: 'auto'}}>
                        <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                            <Grid mt={1} xs={12} md={12} lg={12} display='flex' flexDirection='column' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%', height:'auto'}}>
                            <MDTypography variant="h6" fontWeight="bold" fontFamily='Segoe UI' color='light' style={{textAlign:'center'}}>
                            Total Registrations
                                </MDTypography>

                                <MDTypography variant="h" fontFamily='Segoe UI' color='light' style={{textAlign:'center'}}>
                            Total registrations is number of students who registered in quiz.
                                </MDTypography>
                            </Grid>
                                <Divider style={{width:'100%'}}/>
                            <Grid mb={-1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                                <MDTypography variant='h6'  color='light'>
                                    {new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue?.totalRevenue || 800)}
                                </MDTypography>
                            </Grid>
                        </CardContent>
                    </Grid>
                </CardActionArea>
            </Card>
        </Grid>

        <Grid item xs={12} md={12} lg={4}>
            <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1,  borderRadius:50, 
            backgroundColor: '#5BB35F', 
            transition: 'background-color 0.3s, color 0.3s',
            '&:hover': {
              backgroundColor: '#FFFFFF', // Change background color on hover
              color: '#5BB35F', // Change text color on hover
              '& .MuiTypography-root': {
                color: '#5BB35F', // Change text color of MuiTypography components on hover
              },
            } }} >
                <CardActionArea>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%', height: 'auto'}}>
                        <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                            <Grid mt={1} xs={12} md={12} lg={12} display='flex' flexDirection='column' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%', height:'auto'}}>
                                <MDTypography variant="h6" fontWeight="bold"  color='light' fontFamily='Segoe UI' style={{textAlign:'center'}}>
                                    Total Participants
                                </MDTypography>

                                <MDTypography variant="h7"  color='light' fontFamily='Segoe UI' style={{textAlign:'center'}}>
                                    Total Participants is number of students who participated in quiz.
                                </MDTypography>
                            </Grid>
                                <Divider style={{width:'100%'}}/>
                            <Grid mb={-1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                                <MDTypography variant='h6'  color='light'>
                                    {new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue?.totalOrder || 200)}
                                </MDTypography>
                            </Grid>
                        </CardContent>
                    </Grid>
                </CardActionArea>
            </Card>
        </Grid>

        <Grid item xs={12} md={12} lg={4}>
            {/* <Card sx={{ 
                minWidth: '100%', 
                cursor:'pointer', 
                borderRadius:1, 
                borderRadius:50, 
                backgroundColor: '#3B9AF5',
                color: '#ffffff',
                transition: 'background-color 0.3s, color 0.3s',
                '&:hover': {
                    backgroundColor: '#ffffff', // Change background color on hover
                    color: '#3B9AF5', // Change text color on hover
                  },
             }} >
                <CardActionArea>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%', height: 'auto'}}>
                        <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                            <Grid mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' flexDirection='column' alignContent='center' alignItems='center' style={{width:'100%', height:'auto'}}>
                                <MDTypography variant="h6" fontWeight="bold" fontFamily='Segoe UI' style={{textAlign:'center'}} sx={{
                                    // '&:hover': {
                                    //     color: '#3B9AF5', // Color of the scrollbar thumb on hover
                                    // }
                                }}>
                                    Total Fee
                                </MDTypography>

                                <MDTypography variant="h7" fontFamily='Segoe UI' style={{textAlign:'center'}}>
                                    Total fee is the sum of amount of quiz fee in which student participated.
                                </MDTypography>
                            </Grid>
                                <Divider style={{width:'100%'}}/>
                            <Grid mb={-1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                                <MDTypography variant='h6'>
                                    ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue?.totalDiscount || 500)}
                                </MDTypography>
                            </Grid>
                        </CardContent>
                    </Grid>
                </CardActionArea>
            </Card> */}

<Card sx={{
  minWidth: '100%',
  cursor: 'pointer',
  borderRadius: 50,
  backgroundColor: '#3B9AF5',
  transition: 'background-color 0.3s, color 0.3s',
  '&:hover': {
    backgroundColor: '#FFFFFF', // Change background color on hover
    color: '#3B9AF5', // Change text color on hover
    '& .MuiTypography-root': {
      color: '#3B9AF5', // Change text color of MuiTypography components on hover
    },
  }
}}>
  <CardActionArea>
    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
      <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
        <Grid mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' flexDirection='column' alignContent='center' alignItems='center' style={{ width: '100%', height: 'auto' }}>
          <MDTypography color='light' variant="h6" fontWeight="bold" fontFamily='Segoe UI' style={{ textAlign: 'center' }}>
            Total Fee
          </MDTypography>

          <MDTypography color='light' variant="h7" fontFamily='Segoe UI' style={{ textAlign: 'center' }}>
            Total fee is the sum of the amount of quiz fee in which the student participated.
          </MDTypography>
        </Grid>
        <Divider style={{ width: '100%' }} />
        <Grid mb={-1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
          <MDTypography variant='h6' color='light'>
            ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue?.totalDiscount || 500)}
          </MDTypography>
        </Grid>
      </CardContent>
    </Grid>
  </CardActionArea>
</Card>


        </Grid>
    </Grid>

)}



export default TotalDataTile;