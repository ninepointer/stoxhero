import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Grid, Paper } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';

function Example({leaderboard}) {
    console.log(leaderboard[0])
    function formatName(name) {
        // Check if the name is not empty
        if (name) {
          // Convert the first letter to uppercase and the rest to lowercase
          return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        }
        // Return an empty string or handle it as per your requirements
        return '';
      }
    var items = [
        {
            description: `${formatName(leaderboard[0]?.first_name)} has earned ₹${new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(leaderboard[0]?.reward)} in TestZone so far! 🚀`,
        },
        {
            description: `${formatName(leaderboard[1]?.first_name)} has earned ₹${new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(leaderboard[1]?.reward)} in TestZone so far! 🚀`,
        },
        {
            description: `${formatName(leaderboard[2]?.first_name)} has earned ₹${new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(leaderboard[2]?.reward)} in TestZone so far! 🚀`,
        },
        {
            description: `${formatName(leaderboard[3]?.first_name)} has earned ₹${new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(leaderboard[3]?.reward)} in TestZone so far! 🚀`,
        },
        {
            description: `${formatName(leaderboard[4]?.first_name)} has earned ₹${new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(leaderboard[4]?.reward)} in TestZone so far! 🚀`,
        },
        {
            description: `${formatName(leaderboard[5]?.first_name)} has earned ₹${new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(leaderboard[5]?.reward)} in TestZone so far! 🚀`,
        },
        {
            description: `${formatName(leaderboard[6]?.first_name)} has earned ₹${new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(leaderboard[6]?.reward)} in TestZone so far! 🚀`,
        },
        {
            description: `${formatName(leaderboard[7]?.first_name)} has earned ₹${new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(leaderboard[7]?.reward)} in TestZone so far! 🚀`,
        },
        {
            description: `${formatName(leaderboard[8]?.first_name)} has earned ₹${new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(leaderboard[8]?.reward)} in TestZone so far! 🚀`,
        },
        {
            description: `${formatName(leaderboard[9]?.first_name)} has earned ₹${new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(leaderboard[9]?.reward)} in TestZone so far! 🚀`,
        }
    ];

    return (
        <Carousel 
            sx={{ width: '100%', display:'flex', justifyContent:'center'}}
            autoPlay={true}
            animation="slide" // Use "fade" animation for smoother transitions
            timeout={500} // Adjust the timeout to control transition speed (in milliseconds)
            // navButtonsAlwaysVisible
            indicators={false} // Hide default dots
            navButtonsAlwaysInvisible={true}
        >
            {items.map((item, i) => <Item key={i} item={item}/>)}
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
        <Grid xs={12} md={12} lg={12} container display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'90%'}} >
            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width: '100%', minWidth: '100%'}}>
                <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width: '100%', minWidth: '100%'}}>
                    <MDTypography style={{color:'#65BA0D', textAlign:'center'}} fontSize={12} fontWeight="bold">{props.item.description}</MDTypography>
                </MDBox>
            </Grid>
        </Grid>
    );
}

export default Example;
