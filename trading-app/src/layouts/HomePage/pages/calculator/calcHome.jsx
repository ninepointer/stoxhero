import React, {useEffect, useState} from 'react'
import MDBox from '../../../../components/MDBox';
import MDButton from '../../../../components/MDButton';
import MDTypography from '../../../../components/MDTypography';
import { Grid, useMediaQuery } from '@mui/material';
import { Input, inputClasses } from '@mui/base/Input';
import { styled } from '@mui/system';
import AnimationNumber from "./animationNumber";
import { AnimatedCounter } from "react-animated-counter";
import { useNavigate } from 'react-router-dom';
import theme from "../../utils/theme/index";

export default function CalculatorHome() {

    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

    return (
        <>
            <Grid container xs={12} md={12} lg={12} mt={isMobile ? 35 : 22} p={5} display='flex' justifyContent={'center'} alignContent={'center'} alignItems={'center'}>
                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent={'center'} alignContent={'center'} alignItems={'center'} textAlign={'center'}>
                    <MDTypography style={{ fontSize: isMobile ? 30 : 40, fontWeight: 800 }} >
                        Caclulate Your Net Worth
                    </MDTypography>
                </Grid>

                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent={'center'} alignContent={'center'} alignItems={'center'} gap={1}>
                    <MDButton
                     variant="outlined"
                     style={{
                       padidng: "12px",
                       fontSize: "16px",
                       borderRadius: "10px",
                       backgroundColor: "#315C45",
                       textAlign: "center",
                       fontFamily:
                         "Work Sans , sans-serif",
                       fontWeight: 500,
                       textTransform: "capitalize",
                       color: "white",
                     }}
                     size="small"
                     disabled={true}
                     onClick={()=>{navigate(`/calculators?value=past`)}}
                    >
                        Past Invested
                    </MDButton>

                    <MDButton
                    variant="outlined"
                    style={{
                      padidng: "12px",
                      fontSize: "16px",
                      borderRadius: "10px",
                      backgroundColor: "#315C45",
                      textAlign: "center",
                      fontFamily:
                        "Work Sans , sans-serif",
                      fontWeight: 500,
                      textTransform: "capitalize",
                      color: "white",
                    }}
                    onClick={()=>{navigate(`/calculators?value=future`)}}
                    size="small"
                    >
                        Future Plan
                    </MDButton>
                </Grid>
            </Grid>
        </>
    );
}



const StyledInput = styled(Input)(
  ({ theme }) => `
  display: inline-block;

  .${inputClasses.input} {
    width: 150px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

    &:hover {
      border-color: ${blue[400]};
    }

    &:focus {
      outline: 0;
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[200] : blue[200]};
    }
  }

  &.filled .${inputClasses.input} {
    box-shadow: 0 0 2px 2px rgba(125, 200, 0, 0.25);
  }
`,
);

const OkMark = styled('span')`
  margin-left: 8px;
  margin-top: 10px;
  position: absolute;
  color: rgb(125 200 0 / 1);
`;

const blue = {
  100: '#DAECFF',
  200: '#80BFFF',
  400: '#3399FF',
  600: '#0072E5',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};