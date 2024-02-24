import React, { memo, useState, useEffect } from 'react';
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import MDAvatar from '../../../components/MDAvatar';
import { Grid } from '@mui/material';
import { apiUrl } from '../../../constants/constants';
import MDTypography from "../../../components/MDTypography";
import logo from '../../../assets/images/logo1.jpeg'
import axios from 'axios';
import moment from 'moment';


const RegistrationDetail = ({ selected, getDetails, id, setRegistrationMessage ,quizData, setOpen, resetStates }) => {
    const user = getDetails.userDetails;
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const[setting, setSetting] = useState({});
    // const getDetails = useContext(userContext);
    useEffect(() => {

        axios.get(`${apiUrl}readsetting`, { withCredentials: true })
            .then((res) => {
                setSetting(res.data[0]);
            });

    }, []);

    console.log('setting', setting);


    async function edit(e) {
        e.preventDefault()

        const formData = new FormData();
        if (image) {
            formData.append("profilePhoto", image[0]);
        }

        const res = await fetch(`${apiUrl}student/image`, {
            method: "PATCH",
            credentials: "include",
            body: formData
        });

        const data = await res.json();

        if (data.status === 500 || data.status == 400 || data.status == 401 || data.status == 'error' || data.error || !data) {
            // openErrorSB("Error", data.error)
        } else if (data.status == 'success') {
            await register();
            getDetails.setUserDetail(data?.data);
            // openSuccessSB("Profile Edited", "Edited Successfully");
            // setOpen(false);
        } else {
            // openErrorSB("Error", data.message);
        }
    }

    const handleImage = (event) => {
        const file = event.target.files[0];
        setImage(event.target.files);
        // Create a FileReader instance
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    async function register() {
        console.log('');
    }
    const initiatePayment = async() => {
        try{
          const res = await axios.post(`${apiUrl}payment/initiate`,{amount:Number(quizData?.entryFee*100), redirectTo:window.location.href, paymentFor:'Challenge', productId:id, coupon:'', bonusRedemption:0, productDetails:{slotId:selected?.slotId}},{withCredentials: true});
          console.log(res?.data?.data?.instrumentResponse?.redirectInfo?.url);
          window.location.href = res?.data?.data?.instrumentResponse?.redirectInfo?.url;
      }catch(e){
          console.log(e);
      }
      }
    async function registration() {
        if(!quizData?.entryFee > 0){
            const res = await fetch(`${apiUrl}quiz/user/registration/${id}`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "content-type": "application/json",
                    "Access-Control-Allow-Credentials": false
                },
                body: JSON.stringify({
                    slotId: selected?.slotId
                })
            });
    
            const data = await res.json();
            if (res.status === 200 || res.status === 201) {
                setRegistrationMessage(data?.message)
            } else {
                setRegistrationMessage(data?.message)
            }
        }else{
            purchaseIntent();
            initiatePayment();
        }
    }

    const purchaseIntent = async () => {
        try{
            const res = await axios.post(`${apiUrl}quiz/purchaseintent/${id}`, {withCredentials:true});
        }catch(e){
            console.log(e);
        }
    }
    

    return (
        <>
            <MDBox >
                <MDBox style={{ color: '#353535', fontSize: '20px', fontFamily: 'Work Sans , sans-serif', textAlign: 'center', marginBottom: "30px" }}>Confirm Your Registration</MDBox>


                <Grid item xs={12} md={12} xl={12} mt={1}>
                    <MDTypography fontSize={15} sx={{ color: '#353535', fontWeight:'600'}} style={{ fontFamily: 'Work Sans , sans-serif', textAlign: 'justify' }}>
                        {`${quizData?.title}`}
                    </MDTypography>
                </Grid>
                <Grid item xs={12} md={12} xl={12} mt={1}>
                    <MDTypography fontSize={13} sx={{ color: '#353535' }} style={{ fontFamily: 'Work Sans , sans-serif', textAlign: 'justify' }}>
                        {`Challenge Date: ${moment(selected?.slotTime).format('DD-MM-YY')}`}
                    </MDTypography>
                </Grid>
                <Grid item xs={12} md={12} xl={12} mt={1}>
                    <MDTypography fontSize={13} sx={{ color: '#353535' }} style={{ fontFamily: 'Work Sans , sans-serif', textAlign: 'justify' }}>
                        {`Selected Time Slot: ${moment(selected?.slotTime).format('HH:mm A')}`}
                    </MDTypography>
                </Grid>
                <Grid item xs={12} md={12} xl={12} mt={3}>
                    <MDTypography fontSize={15} sx={{ color: '#353535', fontWeight:'600'}} style={{ fontFamily: 'Work Sans , sans-serif', textAlign: 'justify' }}>
                        {`Fee Breakdown`}
                    </MDTypography>
                </Grid>
                <Grid item xs={12} md={12} xl={12} mt={1}>
                    <MDTypography fontSize={13} sx={{ color: '#353535' }} style={{ fontFamily: 'Work Sans , sans-serif', textAlign: 'justify' }}>
                        {`Challenge Fee: ${quizData?.entryFee >0 ? `₹${quizData?.entryFee}` : 'Free'}`}
                    </MDTypography>
                </Grid>
                {quizData?.entryFee >0 && <Grid item xs={12} md={12} xl={12} mt={1}>
                    <MDTypography fontSize={13} sx={{ color: '#353535' }} style={{ fontFamily: 'Work Sans , sans-serif', textAlign: 'justify' }}>
                        {`GST(${setting?.gstPercentage}% on Fee): ₹${setting?.gstPercentage*quizData?.entryFee}`}
                    </MDTypography>
                </Grid>}
                {quizData?.entryFee >0 && <Grid item xs={12} md={12} xl={12} mt={1}>
                    <MDTypography fontSize={13} sx={{ color: '#353535' }} style={{ fontFamily: 'Work Sans , sans-serif', textAlign: 'justify' }}>
                        {`Net Transaction Amount: ₹${quizData?.entryFee >0 ? quizData?.entryFee : 'Free'}`}
                    </MDTypography>
                </Grid>}

                <Grid item xs={12} md={12} xl={12} mt={2} display='flex' justifyContent={'flex-end'} alignContent={'center'} gap={1}>
                    <MDButton size='small' color={"error"} onClick={(e) => {resetStates();setOpen(false)}} autoFocus>
                        Cancel
                    </MDButton>
                    <MDButton size='small' color={"success"} onClick={(e) => registration()} autoFocus>
                        {quizData?.entryFee > 0 ?`Pay ₹${quizData?.entryFee}`:'Register'}
                    </MDButton>
                </Grid>

            </MDBox>
        </>
    )
}

export default memo(RegistrationDetail);