import React from 'react';
import { Link } from 'react-router-dom';
// import {makeStyles} from '@mui/styles';
import {AppBar} from '@mui/material';
import { Toolbar } from '@mui/material';
import {Typography} from '@mui/material';
import {Button} from '@mui/material';
import {Container} from '@mui/material';
import {Grid} from '@mui/material';
import {Card} from '@mui/material';
import {CardMedia} from '@mui/material';
import {CardContent} from '@mui/material';

export default function LandingPage() {
//   const classes = useStyles();

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            StoxHero
          </Typography>
          <Grid container display='flex' justifyContent='flex-end'>
            <Link to="/about" target="_blank" rel="noopener noreferrer"><Button color="inherit">About Us</Button></Link>
            <Link to="/contact" target="_blank" rel="noopener noreferrer"><Button color="inherit">Contact</Button></Link>
            <Link to="/login" target="_blank" rel="noopener noreferrer"><Button color="inherit">Sign In</Button></Link>
            <Link to="/signup" target="_blank" rel="noopener noreferrer"><Button color="inherit">Sign Up</Button></Link>
          </Grid>
        </Toolbar>
      </AppBar>
      <div>
        <Container maxWidth="sm" minHeight='100vh'>
          <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
            Welcome to StoxHero
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            This is a sample landing page built with React Material UI.
          </Typography>
          <div>
            <Grid container spacing={2} justify="center">
              <Grid item>
                <Button variant="contained" color="primary">
                  Learn More
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" color="primary">
                  Get Started
                </Button>
              </Grid>
            </Grid>
          </div>
        </Container>
      </div>
      <Container maxWidth="md">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                image="https://source.unsplash.com/random"
                title="Image title"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Image Title
                </Typography>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas euismod, ipsum
                  eget efficitur eleifend, ex diam hendrerit dolor, eu tincidunt arcu risus eu enim.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        </Container>
    </div>
    )
    }
