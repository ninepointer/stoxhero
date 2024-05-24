import { KeyboardArrowRight } from '@mui/icons-material'
import { Button } from '@mui/material'
import React from 'react'
import MDTypography from '../../../../components/MDTypography'
import MDButton from '../../../../components/MDButton'
import SignupLoginPopup from "../../pages/courses/signupLoginPopup1";

const LaunchButton = ({contestDetails,couponReferrerCode}) => {
  return (
    <SignupLoginPopup
      data={contestDetails}
      testzone={true}
      referrerCode={couponReferrerCode}
    />
  )
}

export default LaunchButton