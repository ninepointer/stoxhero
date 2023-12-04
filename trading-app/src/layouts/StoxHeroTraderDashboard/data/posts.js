import React, { useEffect, useState, useContext } from 'react';
import { userContext } from '../../../AuthContext';
import MDBox from '../../../components/MDBox';
import { CircularProgress, colors, formLabelClasses } from '@mui/material';
import MDTypography from '../../../components/MDTypography';
import MDSnackbar from '../../../components/MDSnackbar';
import MDAvatar from '../../../components/MDAvatar';
import moment from 'moment'
import VerifiedIcon from '@mui/icons-material/Verified';
import { Grid, Input, TextField } from '@mui/material'
import InputBase from '@mui/material/InputBase';
import { styled } from '@mui/material';

function Posts({ posts }) {
  const setDetails = useContext(userContext);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  

  let baseUrl = process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:5001/';

  // refreshPosts();
  const getTimeElapsed = (postedOn) => {
    const currentTime = moment();
    const postedTime = moment(postedOn);
    const duration = moment.duration(currentTime.diff(postedTime));
  
    const minutes = duration.minutes();
    const hours = duration.hours();
    const days = duration.days();
  
    if (days > 0) {
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }
  };
  
  

  return (
    <MDBox sx={{ height: 'auto' }}>
      
        {posts?.map((elem) => (
          
          <>
          <Grid container key={elem?._id} xs={12} md={12} lg={12} p={1} mb={1} display="flex" justifyContent="center" alignItems="top" style={{ backgroundColor:'white', borderRadius:5 }}>
          <Grid item xs={1} md={1} lg={1} display="flex" justifyContent="left" alignItems="top">
            <MDAvatar
              style={{ backgroundColor: 'lightgrey' }}
              src={elem?.postedBy?.profilePhoto?.url ? elem?.postedBy?.profilePhoto?.url : ''}
              alt={elem?.postedBy?.first_name}
            />
          </Grid>
          <Grid xs={1} md={1} lg={9.5} display="flex" justifyContent="left" alignItems="top">
            <MDBox mt={0.5} display='flex' justifyContent='left' alignItems='flex-start' flexDirection='row'>
              <MDTypography fontSize={15} fontWeight='bold'>{elem?.postedBy?.first_name} {elem?.postedBy?.last_name}</MDTypography>
              <MDTypography fontSize={15} fontWeight='bold' ml={1} mt={0.4}><VerifiedIcon color='warning'/></MDTypography>
              <MDTypography fontSize={10} ml={1} mt={0.5}>{getTimeElapsed(elem?.postedOn)}</MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={1} md={1} lg={1} display="flex" justifyContent="left" alignItems="center">
            {/* <MDTypography color="dark">{elem?.post}</MDTypography> */}
          </Grid>
          <Grid item xs={1} md={1} lg={9.5} display="flex" justifyContent="left" alignItems="center">
              <InputBase
                  fullWidth
                  multiline
                  rowsMax={4}
                  value={elem?.post}
                  // onChange={(e)=>{setFormState(prevState => ({...prevState, post: e.target.value}))}}
                  disabled
                  sx={{
                    color: 'black',
                    fontSize: 15,
                    '&.Mui-disabled': {
                      // opacity: 'none',
                      color: 'black'
                    }
                  }}
                />
          </Grid>
        </Grid>
        </>
        ))}
      
    </MDBox>
  );
}

export default Posts;
