import React, { useEffect, useState } from 'react';
import MDBox from '../../components/MDBox';
import { useLocation, useNavigate } from 'react-router-dom';
import MDTypography from '../../components/MDTypography';
import { apiUrl } from '../../constants/constants';
import axios from 'axios';

const PaymentStatus = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading');
    useEffect(() => {
        // Inducing a delay of 2 seconds before checking the payment status
        setTimeout(checkStatus, 2000);
    }, [location]);

    console.log('mtid is', location.search.split('=')[2]);

    const checkStatus = async () => {
        try {
            const res = await axios.get(`${apiUrl}payment/checkstatus/${location.search.split('=')[1].split('&')[0]}`, { withCredentials: true });
            console.log(res.data);
            if (res.data.data.code === 'PAYMENT_SUCCESS') {
                setStatus('succeeded');
                if (location.search.includes('redirectTo')) {
                    setTimeout(()=>{
                        window.location.href = location.search.split('=')[2];
                    },1200);
                }
            } else if (res.data.data.code === 'PAYMENT_ERROR') {
                setStatus('failed');
            } else {
                setStatus('processing');
            }
        } catch (e) {
            console.log('error', e);
        }
    }

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
        maxWidth: '500px',
        margin: 'auto',
        marginTop: '100px'
    };

    const titleStyle = {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px'
    };

    const messageStyle = {
        fontSize: '18px',
        color: status === 'succeeded' ? 'green' : (status === 'failed' ? 'red' : 'orange')
    };

    return (
        <MDBox style={containerStyle}>
            <MDTypography style={titleStyle}>
                Payment Status
            </MDTypography>
            {status === 'loading' && <MDTypography>We're verifying your transaction. Please don't refresh or go back. This may take a minute.</MDTypography>}
            {status === 'succeeded' && <MDTypography style={messageStyle}>Payment Successful.</MDTypography>}
            {status === 'failed' && <MDTypography style={messageStyle}>Payment Failed</MDTypography>}
            {status === 'processing' && <MDTypography style={messageStyle}>Payment Processing</MDTypography>}
        </MDBox>
    )
}

export default PaymentStatus;
