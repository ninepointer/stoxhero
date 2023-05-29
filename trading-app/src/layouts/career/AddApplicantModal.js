import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';
import {Box} from '@mui/material';
import axios from 'axios';
import { apiUrl } from '../../constants/constants';
import MDTypography from '../../components/MDTypography';
import {Grid} from '@mui/material';
import {Select} from '@mui/material';
import {FormControl} from '@mui/material';
import {InputLabel} from '@mui/material';
import {OutlinedInput} from '@mui/material';
import {MenuItem} from '@mui/material';
import MDButton from '../../components/MDButton';
import { CircularProgress } from "@mui/material";
import MDSnackbar from "../../components/MDSnackbar";



const AddApplicantModal = ( {open, handleClose, applicant, applicantName, career}) => {
  const [colleges, setColleges] = useState([]); 
  const [gds, setGds] = useState([]); 
  const [college, setCollege] = useState();
  const [gd, setGd] = useState();
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
  const [title,setTitle] = useState('')
  const [content,setContent] = useState('')

  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = (title,content) => {
  console.log('status success')  
  setTitle(title)
  setContent(content)
  setSuccessSB(true);
  }
  const closeSuccessSB = () => setSuccessSB(false);
    useEffect(()=>{
      getColleges();
      getGroupDiscussionsByCareer();
    },[open]);
  
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
      const openErrorSB = (title,content) => {
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
  const getColleges = async () => {
    try{
      const res = await axios.get(`${apiUrl}college`);
      setColleges(prev=>res.data.data);
    }catch(e){
      console.log(e);
    }
  }
  const getGroupDiscussionsByCareer = async () => {
    try{
      const res = await axios.get(`${apiUrl}gd/career/${career}`);
      console.log("in gd", res.data);
      setGds(prev=>res.data.data);
    }catch(e){
      console.log(e);
    }
  }

  const addApplicant = async() => {
    try{
      console.log(college, gd, applicant);
      const res = await axios.patch(`${apiUrl}gd/add/${gd}/${applicant}`,{collegeId: college}, {withCredentials: true});
      console.log(res.data);
      console.log('Status', res.status);
      if(res.status == 200){
        console.log('success response');
        console.log(res.data);
        openSuccessSB('Added', res.data.message);
      }else{
        openErrorSB('Error', res.data.message);
      }
      console.log('stat');
      handleClose();
    }catch(e){
      console.log(e);
    }
  }
  const handleCollegeChange = (e) =>{
    const val = e.target.value;
    let collegeId = colleges?.filter((elem)=>elem.collegeName==val);
    console.log(collegeId);
    setCollege(collegeId[0]._id);
  }
  const handleGdChange= (e) =>{
    const val = e.target.value;
    let gdId = gds?.filter((elem)=>elem.gdTitle==val);
    setGd(gdId[0]._id);
  }
  
  return (
    <>
   <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
   >
    <Box sx={style}>
      <MDTypography>Add applicant {applicantName}</MDTypography>
      <Grid item xs={12} md={3} xl={3} sx={{marginTop: '12px'}}>
                <FormControl sx={{ minHeight:10, minWidth:263 }}>
                  <InputLabel id="demo-multiple-name-label">College</InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    // defaultValue={id ? portfolios?.portfolio : ''}
                    // value={formState?.portfolio?.name || batch?.portfolio?.portfolioName}
                    onChange={handleCollegeChange}
                    input={<OutlinedInput label="College" />}
                    sx={{minHeight:45}}
                    // MenuProps={MenuProps}
                  >
                    {colleges?.map((college) => (
                      <MenuItem
                        key={college?.collegeName}
                        value={college?.collegeName}
                      >
                        {college.collegeName}
                      </MenuItem>
                    ))}
                  </Select>
            </FormControl>
            </Grid>
            <Grid item xs={12} md={3} xl={3} sx={{marginTop: '12px'}}>
                <FormControl sx={{ minHeight:10, minWidth:263 }}>
                  <InputLabel id="demo-multiple-name-label">Group Discussion</InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    // defaultValue={id ? portfolios?.portfolio : ''}
                    // value={formState?.portfolio?.name || batch?.portfolio?.portfolioName}
                    onChange={handleGdChange}
                    input={<OutlinedInput label="Group Discussion" />}
                    sx={{minHeight:45}}
                    // MenuProps={MenuProps}
                  >
                    {gds?.map((gd) => (
                      <MenuItem
                        key={gd?.gdTitle}
                        value={gd?.gdTitle}
                      >
                        {gd?.gdTitle}
                      </MenuItem>
                    ))}
                  </Select>
            </FormControl>
            </Grid>
            <Grid sx={{marginTop: '12px', alignSelf: 'center' }}>
              <MDButton variant='contained' size='small' color='info' onClick={()=>{addApplicant()}}>
                Add to GD
              </MDButton>
            </Grid>
    </Box>
   </Modal>
   {renderSuccessSB}
   {renderErrorSB}
   </>
  )
}

export default AddApplicantModal