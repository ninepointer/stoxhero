import { KeyboardArrowRight } from '@mui/icons-material'
import { Button } from '@mui/material'
import React from 'react'
import MDTypography from '../../../../components/MDTypography'
import MDButton from '../../../../components/MDButton'

const LaunchButton = ({sx={}, ...props}) => {
  return (
    <MDButton variant='contained' style={{backgroundColor:'#65BA0D', color:'white'}} sx={{borderRadius:4,...sx}} {...props}>
      <MDTypography fontSize={13} fontWeight='bold' color='light'>Download App</MDTypography>
      <KeyboardArrowRight color='white'/>
    </MDButton>
  )
}

export default LaunchButton