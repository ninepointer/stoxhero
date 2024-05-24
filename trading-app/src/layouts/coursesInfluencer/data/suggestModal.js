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

const SuggestChange = ({ id }) => {
    const [open, setOpen] = React.useState(false);
    const [change, setChange] = useState('');
    const [message, setMessage] = useState('');

    const saveChange = async () => {
        try {
            const data = await axios.patch(`${apiUrl}courses/influencer/${id}/suggestchange`, { change: change }, { withCredentials: true });
            setMessage(data?.data?.message);
        } catch (err) {
            setMessage(err?.message);
        }
    }


    const handleClickOpen = () => {
        setMessage('');
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (

        <>
            <MDBox>
                <MDButton
                    variant='contained'
                    color='error'
                    size='small'
                    onClick={() => { handleClickOpen() }}
                >
                    Suggest Changes
                </MDButton>
            </MDBox>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >

                <DialogContent>
                    {message ?
                        message
                        :
                        <TextField
                            id="outlined-multiline-static"
                            label="Enter your changes"
                            multiline
                            rows={8} // Adjust the number of rows as needed
                            variant="outlined"
                            sx={{ width: '500px' }}
                            onChange={(e) => { setChange(e.target.value) }}
                        />
                    }
                </DialogContent>

                
                    <DialogActions>
                        <MDButton color='error' onClick={handleClose} autoFocus>
                            Close
                        </MDButton>
                        {!message &&
                        <MDButton color={"success"} onClick={() => saveChange()} autoFocus>
                            Submit
                        </MDButton>}
                    </DialogActions>
            </Dialog>
        </>
    );

}

export default memo(SuggestChange);

