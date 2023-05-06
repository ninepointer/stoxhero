import { KeyboardArrowRight } from '@mui/icons-material'
import { Button } from '@mui/material'
import React from 'react'

const LaunchButton = ({sx={}, ...props}) => {
  return (
    <Button variant='contained' sx={{borderRadius:4,...sx}} {...props}>
      Launch app
      <KeyboardArrowRight/>
    </Button>
  )
}

export default LaunchButton