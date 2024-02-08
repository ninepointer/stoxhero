import React, { memo, useContext, useEffect, useState } from 'react';
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from "axios";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Title from '../../HomePage/components/Title'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Button from '@mui/material/Button';
import { Grid, TextField, Typography } from '@mui/material';
import paymentQr from '../../../assets/images/paymentQrc.jpg';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { apiUrl } from '../../../constants/constants';
import MDSnackbar from '../../../components/MDSnackbar';
import Checkbox from '@mui/material/Checkbox';
import Input from '@mui/material/Input';
import { userContext } from '../../../AuthContext';


const ariaLabel = { 'aria-label': 'description' };

const EditProfile = () => {
    const [open, setOpen] = React.useState(false);
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [successSB, setSuccessSB] = useState(false);
    const openSuccessSB = (title, content) => {
        setTitle(title)
        setContent(content)
        setSuccessSB(true);
    }
    const closeSuccessSB = () => setSuccessSB(false);

    const renderSuccessSB = (
        <MDSnackbar
            color="success"
            icon="check"
            title={title}
            content={content}
            open={successSB}
            onClose={closeSuccessSB}
            close={closeSuccessSB}
            bgWhite="info"
        />
    );

    const [errorSB, setErrorSB] = useState(false);
    const openErrorSB = (title, content) => {
        setTitle(title)
        setContent(content)
        setErrorSB(true);
    }
    const closeErrorSB = () => setErrorSB(false);

    const renderErrorSB = (
        <MDSnackbar
            color="error"
            icon="warning"
            title={title}
            content={content}
            open={errorSB}
            onClose={closeErrorSB}
            close={closeErrorSB}
            bgWhite
        />
    );

    async function edit() {

    }

    return (

        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    <MDBox display="flex" alignItems="center" justifyContent="center" >
                        Edit Profile
                    </MDBox>
                </DialogTitle>
                <DialogContent>
                        <Grid item xs={12} md={6} xl={4}>
                            <TextField
                                // disabled={((isSubmitted || quiz) && (!editing || saving))}
                                id="outlined-required"
                                label='Full Name *'
                                name='full_name'
                                fullWidth
                                defaultValue={formState?.full_name}
                                onChange={handleChange}
                            />
                        </Grid>

                    <Grid item xs={12} md={6} xl={4}>
                        <TextField
                            // disabled={((isSubmitted || quiz) && (!editing || saving))}
                            id="outlined-required"
                            label='Grade *'
                            name='grade'
                            fullWidth
                            defaultValue={formState?.grade}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} xl={4}>
                        <TextField
                            // disabled={((isSubmitted || quiz) && (!editing || saving))}
                            id="outlined-required"
                            label='School *'
                            name='school'
                            fullWidth
                            defaultValue={formState?.school}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} xl={4}>
                        <CustomAutocomplete
                            id="country-select-demo"
                            sx={{
                                width: "100%",
                                '& .MuiAutocomplete-clearIndicator': {
                                    color: 'dark',
                                },
                            }}
                            options={cityData}
                            value={value}
                            onChange={handleCityChange}
                            autoHighlight
                            getOptionLabel={(option) => option ? option.name : 'City'}
                            renderOption={(props, option) => (
                                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                    {option.name}
                                </Box>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Choose a City"
                                    inputProps={{
                                        ...params.inputProps,
                                        autoComplete: 'new-password', // disable autocomplete and autofill
                                        style: { color: 'dark', height: "10px" }, // set text color to dark
                                    }}
                                    InputLabelProps={{
                                        style: { color: 'dark' },
                                    }}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} xl={4}>
                        <MDButton variant="outlined" style={{ fontSize: 10 }} fullWidth color={(quizData?.image?.url && !quizImage) ? "warning" : ((quizData?.image?.url && quizImage) || quizImage) ? "error" : "success"} component="label">
                            Upload Image(1080X720)
                            <input
                                hidden
                                // disabled={((quizData || quiz) && (!editing))}
                                accept="image/*"
                                type="file"
                                // onChange={(e)=>{setTitleImage(e.target.files)}}
                                onChange={(e) => {
                                    setFormState(prevState => ({
                                        ...prevState,
                                        quizImage: e.target.files
                                    }));
                                    // setTitleImage(e.target.files);
                                    handleImage(e);
                                }}
                            />
                        </MDButton>
                    </Grid>


                </DialogContent >
                <DialogActions>
                    <MDButton color={"success"} onClick={() => edit()} autoFocus>
                        Edit
                    </MDButton>
                </DialogActions>
                {renderSuccessSB}
                {renderErrorSB}
            </Dialog >
        </>
    );

}

export default memo(EditProfile);

