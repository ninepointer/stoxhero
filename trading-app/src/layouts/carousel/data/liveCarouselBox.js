import React from 'react';
import MDBox from '../../../components/MDBox';
import { Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';
import { Navigate, useNavigate } from 'react-router-dom';

const CarouselBox = ({ image, name, startDate, endDate, link, elem }) => {
    const navigate = useNavigate();
  return (
    <Grid container spacing={2} display='flex' justifyContent='center'>
      <Grid item display='flex' justifyContent='center'>
        <MDButton 
            style={{padding:0}} 
            disableRipple
            component = {Link}
            to={{
                pathname: `/carouseldetails`,
                }}
            state={{data: elem}}
        >
            <img src={image} width='250px' height='250px' alt="Box" />
        </MDButton>
      </Grid>
      {/* <Grid display='flex' justifyContent='center' item bgColor='light'>
        <Grid container display='flex' justifyContent='center' flexDirection='column'>
            <Grid item xs={12} md={12} lg={12}>
                <MDTypography pl={1} pt={1} fontSize={10} color='light'>{name}</MDTypography>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
                <MDTypography pl={1} fontSize={10} color='light'>Start Date: {startDate}</MDTypography>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
                <MDTypography pl={1} fontSize={10} color='light'>End Date: {endDate}</MDTypography>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
                <MDButton onClick={()=>{navigate(link)}}>Link to Carousel</MDButton>
            </Grid>
        </Grid>
      </Grid> */}
    </Grid>
  );
};

export default CarouselBox;