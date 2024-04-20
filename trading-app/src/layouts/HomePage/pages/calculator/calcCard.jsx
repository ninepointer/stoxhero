import React, { useEffect, useState } from 'react'
import MDBox from '../../../../components/MDBox';
import MDTypography from '../../../../components/MDTypography';
import { Grid, Box } from '@mui/material';
import { FormControl } from '@mui/base/FormControl';
import { Input, inputClasses } from '@mui/base/Input';
import { styled } from '@mui/system';
import AnimationNumber from "./animationNumber";
import { AnimatedCounter } from "react-animated-counter";
import MDButton from '../../../../components/MDButton';
import Counter from './counter';


export default function CalculatorCard({ assets, pastStartTime, pastEndTime, liabilities, assetSum, setAssetSum, liabilitiesSum, setLiabilitiesSum, futureInvestmentTime, setFutureInvestmentTime, isMobile }) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const value = urlParams.get('value');
  
    const [formAsset, setFormAsset] = useState({});
    const [formLiabilities, setFormLiabilities] = useState({});
    const [growthRate, setGrowthRate] = useState({});
    const [finalAmount, setFinalAmount] = useState(0);

    const definedROI = {};
    for (const elem of assets) {
        definedROI[elem.keyword] = elem.roi;
    }

    for (const elem of liabilities) {
        definedROI[elem.keyword] = elem.roi;
    }

    function calculateCompoundInterest(principal, rate, time) {
        const ratePart = 1 + (rate / 100);
        const timePart = Math.pow(ratePart, time) - 1;
        const principalPart = timePart * principal + principal;
        return principalPart;
    }

    useEffect(() => {
        calculateAssetSum();
        calculateLiabilitiesSum();
    }, [futureInvestmentTime]);

    useEffect(() => {
        if(value==='past'){
            getYearsDifference(pastEndTime, pastStartTime);
        }
    }, [pastEndTime, pastStartTime]);

    function calculateAssetSum() {
        let sum = 0;
        for (const elem in formAsset) {
            sum += calculateCompoundInterest(formAsset[elem], (growthRate[elem] || definedROI[elem]), futureInvestmentTime);
        }
        setAssetSum(sum || 0);
    }

    function calculateLiabilitiesSum() {
        let sum = 0;
        for (const elem in formLiabilities) {
            sum += calculateCompoundInterest(formLiabilities[elem], (growthRate[elem] || definedROI[elem]), futureInvestmentTime);
        }
        setLiabilitiesSum(sum || 0);
    }

    function finalAmountFunc() {
        setFinalAmount(assetSum - liabilitiesSum)
    }

    function setROI(keyword) {
        const newValue = growthRate?.[keyword]?.split('%')?.[0];
        
        if (!Number(newValue) && newValue?.length > 0) {
            setGrowthRate(prevFormData => ({
                ...prevFormData,
                [keyword]: 0
            }));
        } else {
            setGrowthRate(prevFormData => ({
                ...prevFormData,
                [keyword]: Number(newValue)
            }));
        }

        if(!newValue){
            setGrowthRate(prevFormData => ({
                ...prevFormData,
                [keyword]: definedROI[keyword]
            }));
        }
    }

    function getYearsDifference(endDate, startDate) {
        const d1 = new Date(endDate);
        const d2 = new Date(startDate);
    
        const diffMilliseconds = (d1 - d2);
        const millisecondsInYear = 1000 * 60 * 60 * 24 * 365; // accounting for leap years
        const years = diffMilliseconds / millisecondsInYear;
    
        setFutureInvestmentTime(years);
    }

    return (
        <>
            <Grid item xs={12} md={12} lg={12} display='flex' flexDirection={'column'} justifyContent={'center'} gap={1}>
                <MDBox display='flex' flexDirection={isMobile ? 'column' : 'row'} justifyContent={'center'} gap={1}>
                    <Box
                        sx={{
                            maxWidth: isMobile ? '100%' : "50%",
                            minWidth: isMobile ? '100%' : "50%",
                            // width: '100%',
                            height: '80vh',
                            // overflow: 'scroll',
                            overflowY: 'auto',
                            // height: 380, // Set maxHeight to your desired value
                            '&::-webkit-scrollbar': {
                                width: '6px', // Width of the scrollbar
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'rgba(127,127,127,0.2)', // Color of the scrollbar thumb
                                borderRadius: '3px', // Rounded corners of the scrollbar thumb
                            },
                            '&::-webkit-scrollbar-thumb:hover': {
                                backgroundColor: 'rgba(127,127,127,0.4)', // Color of the scrollbar thumb on hover
                            },
                            backgroundColor: "light",
                            boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)"
                        }}
                    >
                        <Grid item xs={12} md={12} lg={12} bgcolor={'GrayText'} style={{ position: 'sticky', top: '0' }}>
                            <MDTypography style={{ fontSize: 20, fontWeight: 700, padding: 5, paddingLeft: 10, color: 'white', borderTop: '7px solid green' }}>
                                {`Assets: ₹${Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(assetSum?.toFixed(0))}`}
                            </MDTypography>
                        </Grid>
                        <Grid container xs={12} md={12} lg={12} p={2}>
                            {assets?.map((elem) => {
                                return (
                                    <Grid item xs={12} md={12} lg={12} mt={2} mb={2} display='flex' alignContent={'center'} alignItems={isMobile ? '' : 'center'} justifyContent={'space-between'} flexDirection={isMobile ? 'column' : 'row'} gap={1}>
                                        <MDBox style={{ maxWidth: isMobile ? '100%' : '60%' }}>
                                            <MDTypography style={{ fontSize: 15, fontWeight: 700 }}>
                                                {elem?.name}
                                            </MDTypography>
                                            <MDTypography style={{ fontSize: 15, fontWeight: 500 }}>
                                                {elem?.description}
                                            </MDTypography>
                                        </MDBox>
                                        <MDBox display='flex' alignContent={'center'} justifyContent={'center'} alignItems={isMobile ? '' : 'center'} gap={1}>
                                            <FormControl
                                                value={`₹${formAsset[elem?.keyword] || ''}`}
                                                required
                                                onBlur={() => { calculateAssetSum() }}
                                                onChange={(e) => {
                                                    const newValue = e.target.value.split('₹')[1];
                                                    if (!Number(newValue) && newValue?.length > 0) {
                                                        return;
                                                    }

                                                    setFormAsset(prevFormData => ({
                                                        ...prevFormData,
                                                        [elem?.keyword]: Number(newValue)
                                                    }));
                                                }}
                                                
                                            >
                                                {
                                                    ({ filled, focused }) => {
                                                        return (
                                                            <React.Fragment>
                                                                <StyledInput
                                                                    className={filled ? 'filled' : ''}
                                                                />
                                                            </React.Fragment>
                                                        )
                                                    }
                                                }
                                            </FormControl>
                                            <FormControl
                                                value={`${growthRate[elem?.keyword] === undefined ? definedROI[elem?.keyword] : growthRate[elem?.keyword]}%`}
                                                required
                                                onBlur={() => { calculateAssetSum(); setROI(elem?.keyword) }}
                                                onChange={(e) => {
                                                    const newValue = e.target.value.split('%')[0];
                                                    setGrowthRate(prevFormData => ({
                                                        ...prevFormData,
                                                        [elem?.keyword]: (newValue)
                                                    }));
                                                }}
                                            >
                                                {
                                                    ({ filled, focused }) => {
                                                        return (
                                                            <React.Fragment>
                                                                <StyledInput
                                                                    className={filled ? 'filled' : ''}
                                                                />
                                                            </React.Fragment>
                                                        )
                                                    }
                                                }
                                            </FormControl>
                                        </MDBox>
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </Box>

                    <Box
                        sx={{
                            maxWidth: isMobile ? '100%' : "50%",
                            minWidth: isMobile ? '100%' : "50%",
                            // width: '100%',
                            height: '80vh',
                            // overflow: 'scroll',
                            overflowY: 'auto',
                            // height: 380, // Set maxHeight to your desired value
                            '&::-webkit-scrollbar': {
                                width: '6px', // Width of the scrollbar
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'rgba(127,127,127,0.2)', // Color of the scrollbar thumb
                                borderRadius: '3px', // Rounded corners of the scrollbar thumb
                            },
                            '&::-webkit-scrollbar-thumb:hover': {
                                backgroundColor: 'rgba(127,127,127,0.4)', // Color of the scrollbar thumb on hover
                            },
                            backgroundColor: "light",
                            boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)"
                        }}
                    >
                        <Grid item xs={12} md={12} lg={12} bgcolor={'GrayText'} style={{ position: 'sticky', top: '0' }}>
                            <MDTypography style={{ fontSize: 20, fontWeight: 700, padding: 5, paddingLeft: 10, color: 'white', borderTop: '7px solid green' }}>
                                {`Liabilities: ₹${Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(liabilitiesSum?.toFixed(0))}`}
                            </MDTypography>
                        </Grid>
                        <Grid container xs={12} md={12} lg={12} p={2}>
                            {liabilities?.map((elem) => {
                                return (
                                    <Grid item xs={12} md={12} lg={12} mt={2} mb={2} display='flex' alignContent={'center'} alignItems={isMobile ? '' : 'center'} justifyContent={'space-between'} flexDirection={isMobile ? 'column' : 'row'} gap={1}>
                                        <MDBox style={{ maxWidth: isMobile ? '100%' : '60%' }}>
                                            <MDTypography style={{ fontSize: 15, fontWeight: 700 }}>
                                                {elem?.name}
                                            </MDTypography>
                                            <MDTypography style={{ fontSize: 15, fontWeight: 500 }}>
                                                {elem?.description}
                                            </MDTypography>
                                        </MDBox>
                                        <MDBox display='flex' alignContent={'center'} justifyContent={'center'} alignItems={isMobile ? '' : 'center'} gap={1}>
                                            <FormControl
                                                value={`₹${formLiabilities[elem?.keyword] || ''}`}
                                                required
                                                onBlur={() => { calculateLiabilitiesSum() }}
                                                onChange={(e) => {
                                                    const newValue = e.target.value.split('₹')[1];
                                                    if (!Number(newValue) && newValue?.length > 0) {
                                                        return;
                                                    }

                                                    setFormLiabilities(prevFormData => ({
                                                        ...prevFormData,
                                                        [elem?.keyword]: Number(newValue)
                                                    }));
                                                }}
                                            >
                                                <StyledInput
                                                    className={'filled'}
                                                />
                                            </FormControl>
                                            <FormControl
                                                value={`${growthRate[elem?.keyword] === undefined ? definedROI[elem?.keyword] : growthRate[elem?.keyword]}%`}
                                                required
                                                onBlur={() => { calculateLiabilitiesSum(); setROI(elem?.keyword) }}
                                                onChange={(e) => {
                                                    const newValue = e.target.value.split('%')[0];
                                                    setGrowthRate(prevFormData => ({
                                                        ...prevFormData,
                                                        [elem?.keyword]: (newValue)
                                                    }));
                                                }}
                                            >
                                                <StyledInput
                                                    className={'filled'}
                                                />
                                            </FormControl>
                                        </MDBox>
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </Box>
                </MDBox>

                <MDBox display='flex' justifyContent={'center'} alignContent='center' mt={5}>
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
                        // size="small"
                        disabled={new Date(pastStartTime) >= new Date(pastEndTime)}
                        onClick={() => { finalAmountFunc() }}
                    >
                        Calculate Net Worth
                    </MDButton>
                </MDBox>

                {finalAmount ?
                    <MDBox
                        style={{
                            marginTop: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            alignContent: "center", // Optional: Centers text horizontally
                        }}
                    >
                        <MDBox
                            style={{
                                maxWidth: isMobile ? '100%' : "50%",
                                minWidth: isMobile ? '100%' : "50%",
                                backgroundColor: "light",
                                boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)",
                                borderTop: '7px solid green',
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                alignContent: "center", // Optional: Centers text horizontally
                                height: "200px", // Adjust height as needed
                            }}
                        >
                            <Grid item xs={12} md={12} lg={12}>
                                <MDTypography style={{ fontSize: 20, fontWeight: 700, padding: 5, color: 'black', marginTop: 10 }}>
                                    {`Your Net Worth`}
                                </MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <MDTypography style={{ fontSize: 45, fontWeight: 800, padding: 3, color: 'black' }}>
                                    {/* {finalAmount} */}
                                    <Counter initialCount={finalAmount} fontSize={30} color={'black'} />
                                </MDTypography>
                            </Grid>

                            {finalAmount >= 5000000 ?
                                <Grid item xs={12} md={12} lg={12}>
                                    <MDTypography style={{ fontSize: 20, fontWeight: 800, padding: 5, color: 'black', }}>
                                        {`Congrats—you’re an Everyday Millionaire!`}
                                    </MDTypography>
                                </Grid>
                                :
                                <>
                                    <Grid item xs={12} md={12} lg={12}>
                                        <MDTypography style={{ fontSize: 20, fontWeight: 800, padding: 1, color: 'black', textAlign: 'center' }}>
                                            {`You’re off to a good start!`}
                                        </MDTypography>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={12}>
                                        <MDTypography style={{ fontSize: 20, fontWeight: 600, padding: 1, color: 'black', marginBottom: 15, textAlign: 'center' }}>
                                            {`Stay focused and keep chasing down progress.`}
                                        </MDTypography>
                                    </Grid>
                                </>}
                        </MDBox>
                    </MDBox>
                    : <></>}
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