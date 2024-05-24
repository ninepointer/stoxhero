import React from 'react';
import { makeStyles } from '@mui/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ImageSrc from '../../../assets/images/optionchain.png'
import MDButton from '../../../components/MDButton';
import MDBox from '../../../components/MDBox';
import {Grid} from '@mui/material';

const useStyles = makeStyles((theme) => ({
  card: {
    width: 'auto',
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
  },
  image: {
    width: '58%',
    height: '58%',
    // borderRadius: '50%',
    objectFit: 'cover',
  },
  footerText: {
    textAlign: 'center',
  },
}));

const SquareBox = ( ) => {
  const classes = useStyles();
  const footerText = 'Option Chain'

  return (
   <MDButton>
        <MDBox style={{width: '100%', height: '100%'}}>
          <Grid contianer>
            <Grid item lg={12}>
              <img src={ImageSrc} alt="Image" className={classes.image} />
            </Grid>
            <Grid item lg={12} style={{border:'1px solid grey'}}>
              <Typography variant="body2" className={classes.footerText}>
                {footerText}
              </Typography>
          </Grid>
          </Grid>
        </MDBox>
    </MDButton>
  );
};

export default SquareBox;
