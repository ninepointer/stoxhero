import React from 'react';
import { styled } from '@mui/system';
import { Button } from '@mui/material';
import { Paper } from '@mui/material';
import { Carousel } from 'react-material-ui-carousel';

export default function Item({item}) {
  
  return(

  <Paper>
    <img src={item.imageUrl} alt={item.caption} />
    <h2>{item.caption}</h2>
  </Paper>

  )
};
