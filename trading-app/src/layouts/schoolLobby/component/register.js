import React, { memo, useContext, useEffect, useState } from 'react';
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import MDAvatar from '../../../components/MDAvatar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { DialogTitle, DialogContentText, Button } from '@mui/material';
import axios from "axios";
import { Grid, TextField, Tooltip, Box, useMediaQuery } from '@mui/material';
import { apiUrl } from '../../../constants/constants';
// import MDSnackbar from '../../../components/MDSnackbar';
import { userContext } from '../../../AuthContext';
// import { Autocomplete } from "@mui/material";
// import { styled } from '@mui/material';
import MDTypography from "../../../components/MDTypography";
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import logo from '../../../assets/images/logo1.jpeg'
import Slots from "./Slots";
import UploadImage from "./uploadImage"


const Registration = ({ id, setUpdate, setData, update, quizData }) => {
    const [open, setOpen] = React.useState(false);
    const [slotAction, setSlotAction] = useState(true);
    const [error, setError] = useState("");
    const [registrationMessage, setRegistrationMessage] = useState("");
    const [selected, setSelected] = useState();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const getDetails = useContext(userContext);

    const handleClose = () => {
        setOpen(false);
        setUpdate(!update)
    };

    function handleNext() {
        if (!selected) {
            setError('Please select a slot for particiating.');
            return;
        }
        setSlotAction(false);
    }

    return (
        <>
            <MDButton size="small" style={{ fontFamily: 'Work Sans , sans-serif' }}
                onClick={() => { setOpen(true) }}
            >Register</MDButton>

            <Dialog
                // fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title">
                <DialogTitle id="responsive-dialog-title" sx={{ textAlign: 'center' }}>
                    {/* {"Option Chain"} */}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ display: "flex", flexDirection: "column" }}>
                        <MDBox >
                            {slotAction &&
                                <Slots id={id} quizData={quizData} selected={selected} setSelected={setSelected} setError={setError} />}

                            {(!slotAction && !registrationMessage) &&
                                <UploadImage selected={selected} setData={setData} setRegistrationMessage={setRegistrationMessage} id={id} getDetails={getDetails} />}

                            {registrationMessage &&
                                <MDTypography fontSize={15} sx={{ color: '#353535' }} style={{ fontFamily: 'Work Sans , sans-serif', textAlign: 'center' }}>
                                    {registrationMessage}
                                </MDTypography>}

                            {error &&
                                <MDTypography fontSize={11} sx={{ color: '#FF0000' }} style={{ fontFamily: 'Work Sans , sans-serif', textAlign: 'center' }}>
                                    {error}
                                </MDTypography>}

                        </MDBox>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {slotAction &&
                        <MDButton variant='contained' size='small' color='success' style={{ color: '#fff', fontFamily: 'Work Sans , sans-serif' }}
                            onClick={() => { handleNext() }}>Next</MDButton>}

                    {registrationMessage &&
                        <MDButton variant='contained' size='small' color='info' style={{ color: '#fff', fontFamily: 'Work Sans , sans-serif' }}
                            onClick={() => { handleClose() }}>Close</MDButton>}
                </DialogActions>
            </Dialog>

        </>
    );
}

// const Slots = ({ id, selected, setSelected, setError }) => {

//     const [slots, setSlots] = useState([]);

//     useEffect(() => {
//         fetchData();
//     }, [])

//     async function fetchData() {
//         const data = await axios.get(`${apiUrl}quiz/user/slots/${id}`, { withCredentials: true });
//         setSlots(data?.data?.data);
//     }

//     return (
//         <>
//             <MDBox mb={2}>
//                 <MDBox style={{ color: '#353535', fontSize: '20px', fontFamily: 'Work Sans , sans-serif', textAlign: 'center' }}>Please select your slot</MDBox>

//                 <Grid container item md={12} lg={12} xs={12}
//                 // display='flex' justifyContent={'center'} alignItems={'center'} alignContent={'center'}
//                 >
//                     {slots.map(elem => (
//                         <Grid item md={12} lg={6} xs={12} mt={1}>
//                             <button
//                                 key={elem}
//                                 onClick={
//                                     () => {
//                                         // window.webengage.track('tenx_validity_filter_clicked', {
//                                         //     user: getDetails?.userDetails?._id,
//                                         //     elem: elem
//                                         // });
//                                         setSelected(elem);
//                                         setError('')
//                                     }
//                                 }
//                                 style={{
//                                     borderRadius: '12px',
//                                     border: "0.5px solid grey",
//                                     // border: 'none',
//                                     // padding: '4px',
//                                     // marginLeft: '5px',
//                                     // marginTop: '10px'
//                                     cursor: 'pointer',
//                                     backgroundColor: selected == elem ? '#353535' : 'white',
//                                     color: selected == elem ? 'white' : 'black',
//                                     // width: '200px'
//                                     height: '50px'
//                                 }}
//                             >
//                                 <span style={{ fontFamily: 'Work Sans , sans-serif', padding: '25px' }}>
//                                     {`${moment(elem?.slotTime).format('hh:mm A')} - ${elem?.spotLeft} Spot Left`}
//                                 </span>
//                             </button>
//                         </Grid >
//                     ))}
//                 </Grid>

//             </MDBox>
//         </>
//     )
// }

// const UploadImage = ({ selected, getDetails, id, setRegistrationMessage }) => {

//     const user = getDetails.userDetails;
//     const [image, setImage] = useState(null);
//     const [previewUrl, setPreviewUrl] = useState('');

//     async function edit(e) {
//         e.preventDefault()

//         const formData = new FormData();
//         if (image) {
//             formData.append("profilePhoto", image[0]);
//         }

//         const res = await fetch(`${apiUrl}student/image`, {
//             method: "PATCH",
//             credentials: "include",
//             body: formData
//         });

//         const data = await res.json();

//         if (data.status === 500 || data.status == 400 || data.status == 401 || data.status == 'error' || data.error || !data) {
//             // openErrorSB("Error", data.error)
//         } else if (data.status == 'success') {
//             await register();
//             // getDetails.setUserDetail(data?.data);
//             // openSuccessSB("Profile Edited", "Edited Successfully");
//             // setOpen(false);
//         } else {
//             // openErrorSB("Error", data.message);
//         }
//     }

//     const handleImage = (event) => {
//         const file = event.target.files[0];
//         setImage(event.target.files);
//         // Create a FileReader instance
//         const reader = new FileReader();
//         reader.onload = () => {
//             setPreviewUrl(reader.result);
//         };
//         reader.readAsDataURL(file);
//     };

//     async function register() {
//         const res = await fetch(`${apiUrl}quiz/user/registration/${id}`, {
//             method: "PATCH",
//             credentials: "include",
//             headers: {
//                 "content-type": "application/json",
//                 "Access-Control-Allow-Credentials": false
//             },
//             body: JSON.stringify({
//                 slotId: selected?.slotId
//             })
//         });

//         const data = await res.json();
//         if (res.status === 200 || res.status === 201) {

//             // setData(data?.data)
//             // setUpdate(!update)
//             setRegistrationMessage(data?.message)
//             // setOpen(true)

//             // openSuccessSB("Success", data.message);
//         } else {
//             setRegistrationMessage(data?.message)
//             // setOpen(true)
//             // openSuccessSB("Something went wrong", data.mesaage);
//         }
//     }

//     return (
//         <>
//             <MDBox >
//                 <MDBox style={{ color: '#353535', fontSize: '20px', fontFamily: 'Work Sans , sans-serif', textAlign: 'center', marginBottom: "30px" }}>Please upload your profile photo</MDBox>

//                 <Grid
//                     display='flex'
//                     justifyContent='center'
//                     alignItems='center'
//                     style={{ overflow: 'visible' }}
//                 >
//                     <MDAvatar src={previewUrl || user?.schoolDetails?.profilePhoto || logo} size='md' alt='your image' style={{ border: '1px solid grey' }} />
//                 </Grid>

//                 <Grid item xs={12} md={12} xl={12} mt={1}>
//                     <MDButton variant="outlined" style={{ fontSize: 10 }} fullWidth color={(user?.profilePhoto?.url && !image) ? "warning" : ((user?.profilePhoto?.url && image) || image) ? "error" : "success"} component="label">
//                         Upload Profile Image(1080X720)
//                         <input
//                             hidden
//                             // disabled={((quizData || quiz) && (!editing))}
//                             accept="image/*"
//                             type="file"
//                             // onChange={(e)=>{setTitleImage(e.target.files)}}
//                             onChange={(e) => {
//                                 handleImage(e);
//                             }}
//                         />
//                     </MDButton>
//                 </Grid>

//                 <Grid item xs={12} md={12} xl={12} mt={1}>
//                     <MDTypography fontSize={13} sx={{ color: '#353535' }} style={{ fontFamily: 'Work Sans , sans-serif', textAlign: 'justify' }}>
//                         Please upload your photo for better identification on the leaderboard and social media. Your photo will enhance your presence and ensure clear recognition.
//                     </MDTypography>
//                 </Grid>

//                 <Grid item xs={12} md={12} xl={12} mt={2} display='flex' justifyContent={'flex-end'} alignContent={'center'} gap={1}>
//                     <MDButton size='small' color={"error"} onClick={async (e) => await register(e)} autoFocus>
//                         Skip
//                     </MDButton>
//                     <MDButton size='small' color={"success"} onClick={(e) => edit(e)} autoFocus>
//                         Upload
//                     </MDButton>
//                 </Grid>

//             </MDBox>
//         </>
//     )
// }

export default memo(Registration);


