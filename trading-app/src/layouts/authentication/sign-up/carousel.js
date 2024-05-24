import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Grid, Paper } from '@mui/material';
import MDBox from '../../../components/MDBox';
import register from '../../../assets/images/freeaccess.png'
import strategy from '../../../assets/images/strategy.png'
import learnfno from '../../../assets/images/learnfno.png'
import MDTypography from '../../../components/MDTypography';

function Example(props) {
    var items = [
        {
            text: 'Learn Futures & Options trading!',
            description: 'Risk-free trading with virtual currency',
            image: learnfno,
            altText: "Image 1",
        },
        {
            text: 'All of it for free!',
            description: 'Simply signup and gain access',
            image: register,
            altText: "Image 2",
        },
        {
            text: 'Minimize learning cost!',
            description: 'Test your strategies before trading',
            image: strategy,
            altText: "Image 3",
        }
    ];

    return (
        <Carousel 
            sx={{ width: '100%', display:'flex', justifyContent:'center' }}
            autoPlay={true}
            animation="slide" // Use "fade" animation for smoother transitions
            timeout={500} // Adjust the timeout to control transition speed (in milliseconds)
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
        maxWidth: '190px', // Adjust the desired width as needed
        height: 'auto',
        display: 'flex',
        alignItems: 'center',
        alignContent: 'center'
    };

    return (
        <Grid xs={12} md={12} lg={12} container spacing={1} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'90%'}} >
            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width: '100%', minWidth: '100%'}}>
                <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width: '100%', minWidth: '100%'}}>
                    <MDTypography fontSize={15} fontWeight="bold">{props.item.text}</MDTypography>
                </MDBox>
            </Grid>
            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width: '100%', minWidth: '100%'}}>
                <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width: '100%', minWidth: '100%'}}>
                    <MDTypography color='text' fontSize={13} fontWeight="bold">{props.item.description}</MDTypography>
                </MDBox>
            </Grid>
            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width: '100%', minWidth: '100%'}}>
                <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center'style={{width: '100%', minWidth: '100%'}}>
                    <img src={props.item.image} alt={props.item.altText} style={imageSizeStyles} />
                </MDBox>
            </Grid>
        </Grid>
    );
}

export default Example;
