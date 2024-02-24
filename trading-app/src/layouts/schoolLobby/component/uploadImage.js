import React, { memo, useState } from 'react';
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import MDAvatar from '../../../components/MDAvatar';
import { Grid } from '@mui/material';
import { apiUrl } from '../../../constants/constants';
import MDTypography from "../../../components/MDTypography";
import logo from '../../../assets/images/logo1.jpeg'
import axios from 'axios';


const UploadImage = ({ selected, getDetails, id, setRegistrationMessage ,quizData, setConfirmRegistration }) => {

    const user = getDetails.userDetails;
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    // const getDetails = useContext(userContext);

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
        setConfirmRegistration(true);
    }
    async function registration() {
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
    }
    const initiatePayment = async() => {
        try{
          const res = await axios.post(`${apiUrl}payment/initiate`,{amount:Number(quizData?.entryFee*100), redirectTo:window.location.href, paymentFor:'Challenge', productId:id},{withCredentials: true});
          console.log(res?.data?.data?.instrumentResponse?.redirectInfo?.url);
          window.location.href = res?.data?.data?.instrumentResponse?.redirectInfo?.url;
      }catch(e){
          console.log(e);
      }
      }

    return (
        <>
            <MDBox >
                <MDBox style={{ color: '#353535', fontSize: '20px', fontFamily: 'Work Sans , sans-serif', textAlign: 'center', marginBottom: "30px" }}>Please upload your profile photo</MDBox>

                <Grid
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    style={{ overflow: 'visible' }}
                >
                    <MDAvatar src={previewUrl || user?.schoolDetails?.profilePhoto || logo} size='md' alt='your image' style={{ border: '1px solid grey' }} />
                </Grid>

                <Grid item xs={12} md={12} xl={12} mt={1}>
                    <MDButton variant="outlined" style={{ fontSize: 10 }} fullWidth color={(user?.profilePhoto?.url && !image) ? "warning" : ((user?.profilePhoto?.url && image) || image) ? "error" : "success"} component="label">
                        Upload Profile Image(1080X720)
                        <input
                            hidden
                            // disabled={((quizData || quiz) && (!editing))}
                            accept="image/*"
                            type="file"
                            // onChange={(e)=>{setTitleImage(e.target.files)}}
                            onChange={(e) => {
                                handleImage(e);
                            }}
                        />
                    </MDButton>
                </Grid>

                <Grid item xs={12} md={12} xl={12} mt={1}>
                    <MDTypography fontSize={13} sx={{ color: '#353535' }} style={{ fontFamily: 'Work Sans , sans-serif', textAlign: 'justify' }}>
                        <b>Please upload your photo for better identification on the leaderboard and social media. Your photo will enhance your presence and ensure clear recognition.</b>
                    </MDTypography>
                </Grid>

                <Grid item xs={12} md={12} xl={12} mt={2} display='flex' justifyContent={'flex-end'} alignContent={'center'} gap={1}>
                    <MDButton size='small' color={"error"} onClick={async (e) => await register(e)} autoFocus>
                        Skip
                    </MDButton>
                    <MDButton size='small' color={"success"} onClick={(e) => edit(e)} autoFocus>
                        Save
                    </MDButton>
                </Grid>

            </MDBox>
        </>
    )
}

export default memo(UploadImage);