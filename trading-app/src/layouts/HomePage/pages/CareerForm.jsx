import React, {useEffect, useState} from 'react'
import MDBox from '../../../components/MDBox'
import MDButton from '../../../components/MDButton';
import { Grid, Input, TextField } from '@mui/material'
import theme from '../utils/theme/index';
import { ThemeProvider } from 'styled-components';
import Navbar from '../components/Navbars/Navbar';
import Footer from '../components/Footers/Footer';
import MDTypography from '../../../components/MDTypography';
import MDSnackbar from "../../../components/MDSnackbar";
import axios from "axios";
import {useLocation} from 'react-router-dom';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';




const CareerForm = () => {
  const [submitted,setSubmitted] = useState(false)
  const [saving,setSaving] = useState(false)
  const [detail, setDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    dob: "",
    collegeName: "",
    tradingExp: "",
    source: "",

  })
  const location = useLocation();
  const career = location?.state?.data;
  console.log("Career: ",career)
  const [file, setFile] = useState(null);
  // const [uploadedData, setUploadedData] = useState([]);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  const handleFileChange = (event) => {
    setFile(event.target.files);
  };

  const handleUpload = async () => {
    setDetails(detail);
    setSaving(true)
    console.log(detail);

    if(!detail.firstName || !detail.lastName || !detail.email || !detail.mobile || !detail.dob || !detail.collegeName || !detail.tradingExp || !detail.source){
      openSuccessSB("Alert", "Please fill all fields", "FAIL")
      setSaving(false)
      return;
    }

    if (!file) {
      openSuccessSB("Alert", "Please select your resume", "FAIL")
      setSaving(false)
      return;
    }

    if(file.length > 1){
      openSuccessSB("Fail", "Please upload single file", "FAIL")
      setSaving(false)
      return;
    }
  
    try {
      const formData = new FormData();
      for (let i = 0; i < file.length; i++) {
        formData.append("files", file[i]);
      }
      formData.append('firstName', detail.firstName);
      formData.append('lastName', detail.lastName);
      formData.append('email', detail.email);
      formData.append('mobile', detail.mobile);
      // formData.append('rollNo', detail.rollNo);
      formData.append('dob', detail.dob);
      formData.append('collegeName', detail.collegeName);
      formData.append('tradingExp', detail.tradingExp);
      // formData.append('applyingFor', career.jobTitle);
      formData.append('source', detail.source);
      formData.append('career', career._id);

      console.log(formData, file, file.name)
      const { data } = await axios.post(`${baseUrl}api/v1/career/userDetail`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
  
      console.log("if file uploaded before", data);
      openSuccessSB("Success", data.message, "SUCCESS")
      // alert("File upload successfully");
      // console.log("if file uploaded", data);
      setFile(null)
      setSubmitted(true);
      setSaving(false);
    } catch (error) {
      console.log(error, file);
      // alert('File upload failed');
      openSuccessSB("Error", "Unexpected error", "FAIL")
    }
  };

  const [successSB, setSuccessSB] = useState(false);
  const [msgDetail, setMsgDetail] = useState({
    title: "",
    content: "",
    // successSB: false,
    color: "",
    icon: ""
  })
  const openSuccessSB = (title,content, message) => {
    msgDetail.title = title;
    msgDetail.content = content;
    if(message == "SUCCESS"){
      msgDetail.color = 'success';
      msgDetail.icon = 'check'
    } else {
      msgDetail.color = 'error';
      msgDetail.icon = 'warning'
    }
    console.log(msgDetail)
    setMsgDetail(msgDetail)
    setSuccessSB(true);
  }

  const closeSuccessSB = () =>{
    setSuccessSB(false);
  }


  const renderSuccessSB = (
  <MDSnackbar
      color={msgDetail.color}
      icon={msgDetail.icon}
      title={msgDetail.title}
      content={msgDetail.content}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
  />
  );

  return (
    <div>
        <ThemeProvider theme={theme}>
        <Navbar/>
        <MDBox sx={{height:"auto"}} bgColor="light">

            {(!submitted) ? <MDBox mt={'65px'} p={4} display="flex" justifyContent='center' alignItems='center' flexDirection='column'>
                <MDBox display='flex' justifyContent='center'>
                    <MDTypography color="black">Please fill your details!</MDTypography>
                </MDBox>
                <Grid container spacing={2} mt={1} xs={12} md={12} lg={6} display='flex' justifyContent='center' alignItems='center'>
                    <Grid item xs={12} md={6} lg={6}>
                    <TextField
                        required
                        // disabled={showEmailOTP}
                        id="outlined-required"
                        label="First Name"
                        type="text"
                        fullWidth
                        onChange={(e)=>{detail.firstName = e.target.value}}
                      />
                    </Grid>

                    <Grid item xs={12} md={6} lg={6}>
                    <TextField
                        required
                        // disabled={showEmailOTP}
                        id="outlined-required"
                        label="Last Name"
                        type="text"
                        fullWidth
                        onChange={(e)=>{detail.lastName = e.target.value}}
                      />
                    </Grid>

                    <Grid item xs={12} md={6} lg={6}>
                    <TextField
                        required
                        // disabled={showEmailOTP}
                        id="outlined-required"
                        label="Email"
                        type="email"
                        fullWidth
                        onChange={(e)=>{detail.email = e.target.value}}
                      />
                    </Grid>

                    <Grid item xs={12} md={6} lg={6}>
                    <TextField
                        required
                        // disabled={showEmailOTP}
                        id="outlined-required"
                        label="Mobile"
                        type="text"
                        fullWidth
                        onChange={(e)=>{detail.mobile = e.target.value}}
                      />
                    </Grid>

                    <Grid item xs={12} md={6} lg={6}>
                    <TextField
                        required
                        // disabled={showEmailOTP}
                        id="outlined-required"
                        label="College Name"
                        type="text"
                        fullWidth
                        onChange={(e)=>{detail.collegeName = e.target.value}}
                      />
                    </Grid>

                    <Grid item xs={12} md={6} lg={6}>
                    <TextField
                        required
                        // disabled={showEmailOTP}
                        id="outlined-required"
                        label="Date of Birth"
                        type="date"
                        fullWidth
                        onChange={(e)=>{detail.dob = e.target.value}}
                      />
                    </Grid>

                    <Grid item xs={12} md={6} xl={6}>
                      <FormControl sx={{width: "100%" }}>
                        <InputLabel id="demo-simple-select-autowidth-label">Trading Exp *</InputLabel>
                        <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        // value={formState?.jobType}
                        // value={oldObjectId ? contestData?.status : formState?.status}
                        // disabled={((isSubmitted || id) && (!editing || saving))}
                        onChange={(e)=>{detail.tradingExp = e.target.value}}
                        label="Trading Exp."
                        sx={{ minHeight:43 }}
                        >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* <Grid item xs={12} md={6} lg={6}>
                    <TextField
                        required
                        disabled
                        id="outlined-required"
                        label="Applying For"
                        type="text"
                        fullWidth
                        value={career?.applyingFor}
                      />
                    </Grid> */}

                    <Grid item xs={12} md={6} xl={6}>
                      <FormControl sx={{width: "100%" }}>
                        <InputLabel id="demo-simple-select-autowidth-label">From where you hear about us ? *</InputLabel>
                        <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        // value={formState?.jobType}
                        // value={oldObjectId ? contestData?.status : formState?.status}
                        // disabled={((isSubmitted || id) && (!editing || saving))}
                        onChange={(e)=>{detail.source = e.target.value}}
                        label="From where you hear about us ?"
                        sx={{ minHeight:43 }}
                        >
                        <MenuItem value="LinkedIn">LinkedIn</MenuItem>
                        <MenuItem value="Friend">Friend</MenuItem>
                        <MenuItem value="Facebook">Facebook</MenuItem>
                        <MenuItem value="Instagram">Instagram</MenuItem>
                        <MenuItem value="Twitter">Twitter</MenuItem>
                        <MenuItem value="Google">Google</MenuItem>
                        <MenuItem value="Others">Others</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* <Grid item xs={12} md={6} lg={6}>
                    <TextField
                        required
                        // disabled={showEmailOTP}
                        id="outlined-required"
                        label="From where you hear about us ?"
                        type="text"
                        fullWidth
                        onChange={(e)=>{detail.source = e.target.value}}
                      />
                    </Grid> */}

                    <Grid item xs={12} md={6} lg={6}>
                    <Input
                        required
                        // disabled={showEmailOTP}
                        id="outlined-required"
                        label="Resume"
                        type="file"
                        fullWidth
                        onChange={handleFileChange}
                      />
                    </Grid>

                    <Grid item xs={12} md={6} lg={12}>
                    <MDBox mb={1} display="flex" justifyContent="space-around">
                      <MDButton onClick={handleUpload} variant="gradient" color="info">
                        Submit
                      </MDButton>
                    </MDBox>
                    </Grid>
                </Grid>
                
            </MDBox>
            :
            <MDBox minHeight='50vH' marginTop="65px" display="flex" justifyContent='center' alignItems='center' alignContent='center'>
              <Grid container>
                <Grid item p={2} m={2} xs={12} md={12} lg={12} display="flex" justifyContent='center' alignItems='center' alignContent='center' style={{textAlign: 'center'}}>
                  <MDTypography>Your application was submitted successfully, our team will get back to you soon!</MDTypography>
                </Grid>
              </Grid>
            </MDBox>
            }

        </MDBox>
        <MDBox bgColor="black" sx={{marginTop:-2}}>

        <Footer/>
        </MDBox>
        {renderSuccessSB}
        </ThemeProvider>
    </div>
  )
}

export default CareerForm