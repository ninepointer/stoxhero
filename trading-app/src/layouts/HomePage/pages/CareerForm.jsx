import React, {useState} from 'react'
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

  const [detail, setDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    rollNo: "",
    dob: "",
    collageName: "",
    tradingExp: "",
    applyingFor: "",
    source: "",

  })
  const location = useLocation();
  const career = location?.state?.data;

  const [file, setFile] = useState(null);
  // const [uploadedData, setUploadedData] = useState([]);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  const handleFileChange = (event) => {
    setFile(event.target.files);
  };

  const handleUpload = async () => {
    setDetails(detail);
    // console.log(detail);

    if(!detail.firstName || !detail.lastName || !detail.email || !detail.mobile || !detail.rollNo || !detail.dob || !detail.collageName || !detail.tradingExp || !detail.applyingFor || !detail.source){
      openSuccessSB("Alert", "Please fill all fields", "FAIL")
      return;
    }

    if (!file) {
      openSuccessSB("Alert", "Please select your resume", "FAIL")
      return;
    }

    if(file.length > 1){
      openSuccessSB("Fail", "Please upload single file", "FAIL")
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
      formData.append('rollNo', detail.rollNo);
      formData.append('dob', detail.dob);
      formData.append('collageName', detail.collageName);
      formData.append('tradingExp', detail.tradingExp);
      formData.append('applyingFor', detail.applyingFor);
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
        <MDBox bgColor="black" height="auto">

            <MDBox mt={'65px'} p={4}>
                <MDBox display='flex' justifyContent='center'>
                    <MDTypography color="white">Please fill your details!</MDTypography>
                </MDBox>
                <MDBox display="flex" justifyContent="center">
                <Grid container spacing={2} mt={1} xs={12} md={12} lg={9} display='flex' alignContent="center" justifyContent='center'>
                    <Grid item xs={12} md={6} lg={3}>
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
                    <Grid item xs={12} md={6} lg={3}>
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
                    <Grid item xs={12} md={6} lg={3}>
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
                    <Grid item xs={12} md={6} lg={3}>
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
                    <Grid item xs={12} md={6} lg={3}>
                    <TextField
                        required
                        // disabled={showEmailOTP}
                        id="outlined-required"
                        label="Roll No."
                        type="text"
                        fullWidth
                        onChange={(e)=>{detail.rollNo = e.target.value}}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                    <TextField
                        required
                        // disabled={showEmailOTP}
                        id="outlined-required"
                        label="Collage Name"
                        type="text"
                        fullWidth
                        onChange={(e)=>{detail.collageName = e.target.value}}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
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

                    <Grid item xs={12} md={6} xl={3}>
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

                    <Grid item xs={12} md={6} lg={3}>
                    <TextField
                        required
                        // disabled={showEmailOTP}
                        id="outlined-required"
                        label="Applying For"
                        type="text"
                        fullWidth
                        onChange={(e)=>{detail.applyingFor = e.target.value}}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                    <TextField
                        required
                        // disabled={showEmailOTP}
                        id="outlined-required"
                        label="From where you hear about us ?"
                        type="text"
                        fullWidth
                        onChange={(e)=>{detail.source = e.target.value}}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
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
                </Grid>
                </MDBox>
            </MDBox>

            <MDBox mb={1} display="flex" justifyContent="space-around">
              <MDButton onClick={handleUpload} variant="gradient" color="info">
                Submit
              </MDButton>
            </MDBox>

        </MDBox>
        <MDBox bgColor="black" mt={5}>
        <Footer/>
        </MDBox>
        {renderSuccessSB}
        </ThemeProvider>
    </div>
  )
}

export default CareerForm