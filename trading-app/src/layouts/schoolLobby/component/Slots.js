
import React, { memo, useEffect, useState } from 'react';
import MDBox from '../../../components/MDBox';
import axios from "axios";
import { Grid } from '@mui/material';
import { apiUrl } from '../../../constants/constants';
import moment from 'moment';
import MDTypography from '../../../components/MDTypography';


const Slots = ({quizData, id, selected, setSelected, setError, setRegistrationMessage, getDetails }) => {

    const [slots, setSlots] = useState([]);

    useEffect(() => {
        fetchData();
    }, [])

    async function fetchData() {
        const data = await axios.get(`${apiUrl}quiz/user/slots/${id}`, { withCredentials: true });
        setSlots(data?.data?.data);
    }

    

    return (
        <>
            <MDBox>
                <MDBox style={{ textAlign: 'center'}}>
                    <MDTypography variant="h6" fontFamily='Work Sans , sans-serif'>Olympiad Date: {moment(quizData?.startDateTime).format('DD-MMM-YYYY') }</MDTypography>
                </MDBox>
                <MDBox style={{textAlign:'center'}}>
                    <MDTypography variant="h6" fontFamily='Work Sans , sans-serif'>Please select your Olympiad slot</MDTypography>
                </MDBox>
                <Grid container spacing={1} item md={12} lg={12} xs={12}
                >
                    {slots.map(elem => (
                        <Grid item md={12} lg={6} xs={12} mt={1}
                        display='flex'  justifyContent={'center'} alignItems={'center'} alignContent={'center'}
                        >
                            <button
                                key={elem}
                                onClick={
                                    () => {
                                        setSelected(elem);
                                        setError('')
                                    }
                                }
                                disabled={elem?.spotLeft <= 0}
                                style={{
                                    borderRadius: '12px',
                                    border: "0.5px solid grey",
                                    cursor: 'pointer',
                                    backgroundColor: selected == elem ? '#532b9e' : 'white',
                                    color: selected == elem ? 'white' : 'black',
                                    width: '250px',
                                    height: '50px'
                                }}
                            >
                                <span style={{ fontFamily: 'Work Sans , sans-serif', padding: '20px' }}>
                                    {`${moment(elem?.slotTime).format('hh:mm A')} - ${elem?.spotLeft} Spots Left`}
                                </span>
                            </button>
                        </Grid >
                    ))}
                </Grid>

            </MDBox>
        </>
    )
}


export default memo(Slots);