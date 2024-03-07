import { Button } from "@mui/material";
import React from "react";
import MDButton from '../../../../components/MDButton'
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import MDTypography from '../../../../components/MDTypography'

const OutlinedButton = ({ sx = {}, arrow, children, fit, ...props }) => {
  return (
    <MDButton variant='outlined' style={{color:'black'}} sx={{borderRadius:4,...sx}} {...props}>
      <MDTypography fontSize={13} fontWeight='bold' color='light'>Download App</MDTypography>
      {/* <KeyboardArrowRight color='black'/> */}
    </MDButton>
  );
};

export default OutlinedButton;