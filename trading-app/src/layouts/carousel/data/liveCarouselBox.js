import React from 'react';
// import MDBox from '../../../components/MDBox';
import { Grid } from '@mui/material';
import { Link } from 'react-router-dom';
// import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';
// import { Navigate, useNavigate } from 'react-router-dom';
import moment from 'moment'

const CarouselBox = ({ image, elem }) => {

  // console.log( "dates checking", elem?.carouselStartDate, elem?.carouselEndDate)
  return (
    <Grid container lg={12} md={4} xs={12} spacing={1} display='flex' justifyContent='center' alignItems='center'>
      <Grid item lg={12} md={4} xs={12} display='flex' justifyContent='center'>
          <MDButton 
            style={{padding:0}} 
            disableRipple
            component={Link}
            to={{
              pathname: `/carouseldetails`,
            }}
            state={{data: elem}}
          >
            <div style={{position: 'relative'}}>
              <img src={image} width='270px' height='180px' alt="Box" />
              <div style={{position: 'absolute', bottom: 10, right: 10}}>
                <span style={{backgroundColor: 'green', padding: '2px 4px', color:'white', fontSize: 10, borderRadius:3}}>
                  {moment.utc(elem?.carouselEndDate).utcOffset('+05:30').format("DD-MMM HH:mm")}
                </span>
              </div>
              <div style={{position: 'absolute', bottom: 10, left: 10}}>
                <span style={{backgroundColor: 'green', padding: '2px 4px', color:'white', fontSize: 10, borderRadius:3}}>
                  {moment.utc(elem?.carouselStartDate).utcOffset('+05:30').format("DD-MMM HH:mm")}
                </span>
              </div>
              <div style={{position: 'absolute', bottom: 35, right: 10}}>
                <span style={{backgroundColor: 'green', padding: '2px 4px', color:'white', fontSize: 10, borderRadius:3}}>
                  {elem?.status}
                </span>
              </div>
              <div style={{position: 'absolute', bottom: 35, left: 10}}>
                <span style={{backgroundColor: 'green', padding: '2px 4px', color:'white', fontSize: 10, borderRadius:3}}>
                  {elem?.visibility}
                </span>
              </div>
            </div>
          </MDButton>
      </Grid>

    </Grid>
  );
};

export default CarouselBox;