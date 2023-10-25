import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Grid, Paper } from '@mui/material';
import MDBox from '../../../components/MDBox';
import signup from '../../../assets/images/signup.png'
import aboutjob from '../../../assets/images/aboutjob.png'
import MDTypography from '../../../components/MDTypography';

function Example(props) {
    var items = [
        {
            text: 'Learn F&O trading!',
            description: 'Risk-free trading with cirtual currency',
            image: signup,
            altText: "Image 1",
        },
    ];

    return (
        <Carousel 
            sx={{ width: '100%', display:'flex', justifyContent:'center' }}
            autoPlay={false}
            // animation="slide" // Use "fade" animation for smoother transitions
            // timeout={0} // Adjust the timeout to control transition speed (in milliseconds)
            // navButtonsAlwaysVisible
            indicators={false} // Hide default dots
            navButtonsAlwaysInvisible={true}
        >
            {items.map((item, i) => <Item key={i} item={item} />)}
        </Carousel>
    );
}

function Item(props) {
    const imageSizeStyles = {
        maxWidth: '200px', // Adjust the desired width as needed
        height: 'auto',
        display: 'flex',
        alignItems: 'center',
        alignContent: 'center'
    };

    return (
        <Grid xs={12} md={12} lg={12} container spacing={1} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'90%'}} >
            
            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                    <MDTypography color='text' fontSize={10} fontWeight="bold">{props.item.description}</MDTypography>
                </MDBox>
            </Grid>
            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                    <img src={props.item.image} alt={props.item.altText} style={imageSizeStyles} />
                </MDBox>
            </Grid>
        </Grid>
    );
}

export default Example;
