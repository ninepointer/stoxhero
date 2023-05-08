import { KeyboardArrowRight } from '@mui/icons-material'
import { Button } from '@mui/material'
import React from 'react'
import MDTypography from '../../../../components/MDTypography'

const LaunchButton = ({sx={}, ...props}) => {
  return (
    <Button variant='contained' sx={{borderRadius:4,...sx}} {...props}>
      <MDTypography color='white' fontSize={13} fontWeight='bold'>Launch App</MDTypography>
      <KeyboardArrowRight color='white'/>
    </Button>
  )
}

export default LaunchButton