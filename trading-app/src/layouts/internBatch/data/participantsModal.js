import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';
import {Box} from '@mui/material';
import axios from 'axios';
import { apiUrl } from '../../../constants/constants';
import MDTypography from '../../../components/MDTypography';
import {Grid} from '@mui/material';
import {Select} from '@mui/material';
import {FormControl} from '@mui/material';
import {InputLabel} from '@mui/material';
import {OutlinedInput} from '@mui/material';
import {MenuItem} from '@mui/material';
import MDButton from '../../../components/MDButton';



const ParticipantsModal = ( {open, handleClose, gd}) => {
  const [colleges, setColleges] = useState([]); 
  const [gds, setGds] = useState([]); 
  const [college, setCollege] = useState();
  const [participants, setParticipants] = useState();
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
  //   border: '2px solid #000',
    borderRadius:2,
    boxShadow: 24,
    p: 4,
  };

  const getParticipants = async() =>{
    try{
        console.log('getting')
        const res = await axios.get(`${apiUrl}gd/${gd}`);
        console.log(res.data.data[0].participants);
        setParticipants(prev=>res.data.data[0].participants);
      }catch(e){
        console.log(e);
      }
    }

  useEffect(()=>{
    getParticipants();
  },[open]);
  return (
   <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
   >
    <Box sx={style}>
      <MDTypography>Group Discussion participants</MDTypography>
      {participants?.map((elem, index)=>{
        return<>
            <MDTypography>
                {elem.user}
            </MDTypography>
        </>
      })}
    </Box>
   </Modal>
  )
}

export default ParticipantsModal;