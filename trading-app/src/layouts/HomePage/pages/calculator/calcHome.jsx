import React from 'react'
import MDButton from '../../../../components/MDButton';
import MDTypography from '../../../../components/MDTypography';
import { Grid, useMediaQuery } from '@mui/material';
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
                        Calculate Your Net Worth
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
                    //  disabled={true}
                     onClick={()=>{navigate(`/calculators?value=past`)}}
                    >
                        Past Investments
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