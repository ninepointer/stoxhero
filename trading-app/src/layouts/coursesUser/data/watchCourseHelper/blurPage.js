import React from 'react';
import Grid from '@mui/material/Grid';
import { Box, Typography } from '@mui/material';
import Payment from '../payment';
import { useMediaQuery } from "@mui/material";
import theme from "../../../HomePage/utils/theme/index";

const EnrollPage = ({ course, message }) => {

    const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

    return (
        <Grid
            container
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            mt={25}
            display='flex'
            justifyContent='center'
            position='absolute'
            alignItems='center'
        >
            <Grid item xs={12} sx={{ zIndex: 4 }}>
                <Typography variant="h6" align="center" color='#000000'>
                    {message}
                </Typography>
                <Grid
                    container
                    spacing={1}
                    xs={12}
                    md={12}
                    lg={12}
                    mt={1}
                    display="flex"
                    justifyContent={
                        isMobile ? "center" : "center"
                    }
                    alignContent="center"
                    alignItems={
                        isMobile ? "center" : "flex-start"
                    }
                >
                    <Grid
                        item
                        xs={12}
                        md={6}
                        lg={2}
                        display="flex"
                        justifyContent={
                            isMobile ? "center" : "center"
                        }
                        alignContent="center"
                        alignItems={
                            isMobile ? "center" : "center"
                        }
                    >
                        <Payment data={course} checkPaid={false} isBlur={true} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default EnrollPage;
