import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Tooltip } from "@mui/material";
import Icon from "@mui/material/Icon";
import { userContext } from "../../../../AuthContext";
import MDAvatar from "../../../../components/MDAvatar";
import MDSnackbar from "../../../../components/MDSnackbar";
import axios from "axios";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { MuiFileInput } from "mui-file-input";
import { Radio, RadioGroup, FormControlLabel } from "@material-ui/core";

import { useState, useContext, useEffect } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDButton from "../../../../components/MDButton";
import MDTypography from "../../../../components/MDTypography";
import { Divider, Typography, CircularProgress } from "@mui/material";
import { apiUrl } from "../../../../constants/constants";

function MyProfile({ profilePhoto, setProfilePhoto }) {
  const [editablePD, setEditablePD] = useState(false);
  const [editableBD, setEditableBD] = useState(false);
  const [editableKYC, setEditableKYC] = useState(false);
  const getDetails = useContext(userContext);
  const [aadhaarClientId, setAadhaarClientId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [action, setAction] = useState(false);
  const [selectedOption, setSelectedOption] = useState("automatic");

  console.log("rendering", getDetails?.userDetails);

  const blankImageUrl = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%' height='130px'%3E%3Crect width='100%' height='130px' fill='lightgrey'/%3E%3Ctext x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='15px' fill='black'%3EDocument Preview%3C/text%3E%3C/svg%3E`;

  const [formStatePD, setFormStatePD] = React.useState({
    employeeid: getDetails?.userDetails?.employeeid || "",
    first_name: getDetails?.userDetails?.first_name || "",
    last_name: getDetails?.userDetails?.last_name || "",
    email: getDetails?.userDetails?.email || "",
    mobile: getDetails?.userDetails?.mobile || "",
    whatsApp_number: getDetails?.userDetails?.whatsApp_number || "",
    gender: getDetails?.userDetails?.gender || "",
    designation: getDetails?.userDetails?.designation || "",
    degree: getDetails?.userDetails?.degree || "",
    last_occupation: getDetails?.userDetails?.last_occupation || "",
    address: getDetails?.userDetails?.address || "",
    city: getDetails?.userDetails?.city || "",
    pincode: getDetails?.userDetails?.pincode || "",
    state: getDetails?.userDetails?.state || "",
    country: getDetails?.userDetails?.country || "",
    dob: getDetails?.userDetails?.dob || "",
    joining_date: getDetails?.userDetails?.joining_date || "",
    family_yearly_income: getDetails?.userDetails?.family_yearly_income || "",
    profilePhoto: getDetails?.userDetails?.profilePhoto || "",
    profilePhotoPreview: "",
    role: getDetails?.userDetails?.role,
  });

  const [formStateBD, setFormStateBD] = React.useState({
    upiId: getDetails?.userDetails?.upiId || "",
    googlePay_number: getDetails?.userDetails?.googlePay_number || "",
    phonePe_number: getDetails?.userDetails?.phonePe_number || "",
    payTM_number: getDetails?.userDetails?.payTM_number || "",
    nameAsPerBankAccount: getDetails?.userDetails?.nameAsPerBankAccount || "",
    bankState: getDetails?.userDetails?.bankState || "",
    bankName: getDetails?.userDetails?.bankName || "",
    accountNumber: getDetails?.userDetails?.accountNumber || "",
    ifscCode: getDetails?.userDetails?.ifscCode || "",
    role: getDetails?.userDetails?.role,
  });

  const [formStateKYC, setFormStateKYC] = React.useState({
    aadhaarNumber: getDetails?.userDetails?.aadhaarNumber || "",
    panNumber: getDetails?.userDetails?.panNumber || "",
    passportNumber: getDetails?.userDetails?.passportNumber || "",
    drivingLicenseNumber: getDetails?.userDetails?.drivingLicenseNumber || "",
    aadhaarCardFrontImage:
      getDetails?.userDetails?.aadhaarCardFrontImage || null,
    aadhaarCardBackImage: getDetails?.userDetails?.aadhaarCardBackImage || null,
    panCardFrontImage: getDetails?.userDetails?.panCardFrontImage || null,
    passportPhoto: getDetails?.userDetails?.passportPhoto || null,
    addressProofDocument: getDetails?.userDetails?.addressProofDocument || null,
    aadhaarCardFrontPreview: "",
    aadhaarCardBackPreview: "",
    panCardFrontPreview: "",
    passportPhotoPreview: "",
    addressProofDocumentPreview: "",
    KYCStatus: getDetails?.userDetails?.KYCStatus || "",
    role: getDetails?.userDetails?.role,
    dob: getDetails?.userDetails?.dob || "",
  });

  const [KYCVerification, setKYCVerification] = useState({
    aadhaarNumber: getDetails?.userDetails?.aadhaarNumber || "",
    panNumber: getDetails?.userDetails?.panNumber || "",
    accountNumber: getDetails?.userDetails?.accountNumber || "",
    dob: "",
    aadhaarOtp: "",
    ifsc: getDetails?.userDetails?.ifscCode || "",
  });

  // console.log(formStatePD)
  // console.log(formStateBD)
  // console.log(formStateKYC)
  useEffect(() => {
    getData();
    console.log("setting data again");
  }, [action]);

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const getData = async () => {
    try {
      const res = await axios.get(`${apiUrl}loginDetail`, {
        withCredentials: true,
      });
      console.log("setting", res.data);
      setFormStatePD({
        employeeid: res?.data?.employeeid,
        first_name: res.data?.first_name,
        last_name: res.data?.last_name,
        email: res.data?.email,
        mobile: res.data?.mobile,
        whatsApp_number: res.data?.whatsApp_number,
        gender: res.data?.gender,
        designation: res.data?.designation,
        degree: res.data?.degree,
        last_occupation: res.data?.last_occupation,
        address: res.data?.address,
        city: res.data?.city,
        pincode: res.data?.pincode,
        state: res.data?.state,
        country: res.data?.country,
        dob: res.data?.dob,
        joining_date: res.data?.joining_date,
        family_yearly_income: res.data?.family_yearly_income,
        profilePhoto: res.data?.profilePhoto,
        profilePhotoPreview: "",
        role: res.data?.role,
      });
      setFormStateBD({
        upiId: res?.data?.upiId,
        googlePay_number: res?.data?.googlePay_number,
        phonePe_number: res?.data?.phonePe_number,
        payTM_number: res?.data?.payTM_number,
        nameAsPerBankAccount: res?.data?.nameAsPerBankAccount,
        bankState: res?.data?.bankState,
        bankName: res?.data?.bankName,
        accountNumber: res?.data?.accountNumber,
        ifscCode: res?.data?.ifscCode,
        role: res?.data?.role,
      });
      setFormStateKYC({
        aadhaarNumber: res?.data?.aadhaarNumber,
        panNumber: res?.data?.panNumber,
        passportNumber: res?.data?.passportNumber,
        drivingLicenseNumber: res?.data?.drivingLicenseNumber,
        aadhaarCardFrontImage: res?.data?.aadhaarCardFrontImage || null,
        aadhaarCardBackImage: res?.data?.aadhaarCardBackImage || null,
        panCardFrontImage: res?.data?.panCardFrontImage || null,
        passportPhoto: res?.data?.passportPhoto || null,
        addressProofDocument: res?.data?.addressProofDocument || null,
        aadhaarCardFrontPreview: "",
        aadhaarCardBackPreview: "",
        panCardFrontPreview: "",
        passportPhotoPreview: "",
        addressProofDocumentPreview: "",
        KYCStatus: res?.data?.KYCStatus,
        role: res?.data?.role,
        dob: res.data?.dob,
      });
    } catch (e) {
      console.log(e);
    }
  };

  async function formSubmit(data, section) {
    // console.log("Form Data: ",data)
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key != "KYCStatus") formData.append(key, data[key]);
      });
      if (section === "KYC Details") {
        // console.log("KYC FormData: ",data)
        if (
          !formStateKYC.aadhaarNumber ||
          !formStateKYC.panNumber ||
          !formStateKYC.aadhaarCardFrontImage ||
          !formStateKYC.aadhaarCardBackImage ||
          !formStateKYC.panCardFrontImage ||
          !formStateKYC.dob
        )
          return openErrorSB(
            "KYC Details",
            "Please fill/upload the required fields."
          );
        formData.append("KYCStatus", "Pending Approval");
        // setFormStateKYC(formStateKYC.KYCStatus,"Pending Approval")
      }
      if (section === "Bank Details") {
        if (
          !formStateBD.nameAsPerBankAccount ||
          !formStateBD.bankName ||
          !formStateBD.accountNumber ||
          !formStateBD.ifscCode ||
          !formStateBD.bankState
        )
          return openErrorSB(
            "Bank Details",
            "Please fill all the required fields."
          );
      }

      const res = await fetch(`${baseUrl}api/v1/userdetail/me`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Access-Control-Allow-Credentials": true,
        },
        body: formData,
      });
      let response = await res.json();
      // console.log('response', response);
      if (response.status === "success") {
        // getDetails.setUserDetail(response.data);
        // console.log("Response: ",response.data,data);
        setFormStateKYC((prev) => ({
          ...prev,
          drivingLicenseNumber: response.data?.drivingLicenseNumber ?? "",
          passportNumber: response.data?.passportNumber ?? "",
          panNumber: response.data?.panNumber ?? "",
          aadhaarNumber: response.data?.aadhaarNumber ?? "",
          aadhaarCardBackImage: response.data?.aadhaarCardBackImage ?? "",
          aadhaarCardFrontImage: response.data?.aadhaarCardFrontImage ?? "",
          panCardFrontImage: response.data?.panCardFrontImage ?? "",
          addressProofDocument: response.data?.addressProofDocument ?? "",
          passportPhoto: response.data?.passportPhoto ?? "",
          dob: response.data?.dob ?? "",
        }));
        openSuccessSB(section, `Your ${section} updated successfully`);
      }
    } catch (e) {
      // console.log(e);
    }
  }

  const handleFileSelect = (event, fieldName) => {
    // console.log("Event: ",event)
    if (!event && fieldName === "addressProofDocument") {
      setFormStateKYC((prevState) => ({
        ...prevState,
        addressProofDocument: event,
      }));
    }
    if (!event && fieldName === "aadhaarCardFrontImage") {
      setFormStateKYC((prevState) => ({
        ...prevState,
        aadhaarCardFrontImage: event,
      }));
    }
    if (!event && fieldName === "aadhaarCardBackImage") {
      setFormStateKYC((prevState) => ({
        ...prevState,
        aadhaarCardBackImage: event,
      }));
    }
    if (!event && fieldName === "panCardFrontImage") {
      setFormStateKYC((prevState) => ({
        ...prevState,
        panCardFrontImage: event,
      }));
    }
    if (!event && fieldName === "passportPhoto") {
      setFormStateKYC((prevState) => ({
        ...prevState,
        passportPhoto: event,
      }));
    }
    // const selectedFile = event.target.files[0];
    const selectedFile = event;
    // console.log("Selected file:", selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileDataUrl = reader.result;
        const fileName = selectedFile.name;
        const fileBlob = dataURLtoBlob(fileDataUrl);
        const newFile = new File([fileBlob], selectedFile.name, {
          type: selectedFile.type,
        });
        const previewURL = URL.createObjectURL(selectedFile);
        if (
          selectedFile &&
          selectedFile.type &&
          selectedFile.type.startsWith("image/") &&
          selectedFile?.size <= 2 * 1024 * 1024
        ) {
          if (fieldName === "profilePhoto") {
            setFormStatePD((prevState) => ({
              ...prevState,
              profilePhoto: event,
            }));
            setProfilePhoto(reader.result);
          }
          if (fieldName === "aadhaarCardFront") {
            setFormStateKYC((prevState) => ({
              ...prevState,
              aadhaarCardFrontImage: event,
            }));
          }
          if (fieldName === "aadhaarCardBack") {
            setFormStateKYC((prevState) => ({
              ...prevState,
              aadhaarCardBackImage: event,
            }));
          }
          if (fieldName === "panCardFront") {
            setFormStateKYC((prevState) => ({
              ...prevState,
              panCardFrontImage: event,
            }));
          }
          if (fieldName === "passportPhoto") {
            setFormStateKYC((prevState) => ({
              ...prevState,
              passportPhoto: event,
            }));
          }
          if (fieldName === "addressProofDocument") {
            setFormStateKYC((prevState) => ({
              ...prevState,
              addressProofDocument: event,
            }));
          }
        } else {
          return openErrorSB(
            "KYC Details",
            "Invalid file type. Please select an image under 2MB size."
          );
          // console.log("Error: Invalid file type. Please select an image.");
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // console.log("Address Prrof Doc Name: ",formStateKYC?.addressProofDocument?.name)
  // console.log("rending state set for preview")
  // console.log("Preview for Aadhaar Card Front: ",formStateKYC.aadhaarCardFrontPreview)

  // Helper function to convert data URL to Blob object
  function dataURLtoBlob(dataUrl) {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  function onRemove(fieldPreview) {
    if (fieldPreview === "profilePhoto") {
      setFormStatePD((prevState) => ({
        ...prevState,
        profilePhotoPreview: "",
      }));
    }
    if (fieldPreview === "aadhaarCardFront") {
      setFormStateKYC((prevState) => ({
        ...prevState,
        aadhaarCardFrontPreview: "",
        // aadhaarCardFrontImage:'',
      }));
    }
    if (fieldPreview === "aadhaarCardBack") {
      setFormStateKYC((prevState) => ({
        ...prevState,
        aadhaarCardBackPreview: "",
        aadhaarCardBackImage: "",
      }));
    }
    if (fieldPreview === "panCardFront") {
      setFormStateKYC((prevState) => ({
        ...prevState,
        panCardFrontPreview: "",
        panCardFrontImage: "",
      }));
    }
    if (fieldPreview === "passportPhoto") {
      setFormStateKYC((prevState) => ({
        ...prevState,
        passportPhotoPreview: "",
        passportPhoto: "",
      }));
    }
    if (fieldPreview === "addressProofDocument") {
      setFormStateKYC((prevState) => ({
        ...prevState,
        addressProofDocument: "",
        addressProofDocument: "",
      }));
    }
  }

  let baseUrl =
    process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = (value, content) => {
    if (value === "Personal Details") {
      setTitle(value);
      setContent(content);
    }
    if (value === "Bank Details") {
      setTitle(value);
      setContent(content);
    }
    if (value === "KYC Details") {
      setTitle(value);
      setContent(content);
    }
    setSuccessSB(true);
  };
  const closeSuccessSB = () => setSuccessSB(false);
  // console.log("Title, Content, Time: ",title,content,time)

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

  const openErrorSB = (value, content) => {
    if (value === "Personal Details") {
      setTitle(value);
      setContent(content);
    }
    if (value === "Bank Details") {
      setTitle(value);
      setContent(content);
    }
    if (value === "KYC Details") {
      setTitle(value);
      setContent(content);
    }
    setErrorSB(true);
  };
  const closeErrorSB = () => setErrorSB(false);
  // console.log("Title, Content, Time: ",title,content,time)

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

  // console.log("Condition 1: ",formStateKYC.aadhaarCardBackImage ? formStateKYC.aadhaarCardBackImage : console.log(formStateKYC.aadhaarCardBackPreview))
  // console.log("Condition 2: ",formStateKYC.aadhaarCardBackPreview,blankImageUrl)

  const [file, setFile] = React.useState(null);

  const handleChange = (newFile) => {
    setFile(newFile);
  };

  const generateAadhaarOtp = async () => {
    if (
      !KYCVerification?.aadhaarNumber ||
      !KYCVerification?.panNumber ||
      !KYCVerification?.accountNumber ||
      !KYCVerification?.ifsc
    ) {
      return openErrorSB("KYC Details", "Please fill mandatory fields");
    }
    try {
      setIsVerifying(true);
      const res = await axios.post(
        `${baseUrl}api/v1/KYC/generateotp`,
        { aadhaarNumber: KYCVerification.aadhaarNumber },
        { withCredentials: true }
      );
      if (res.data.data.valid_aadhaar) {
        setAadhaarClientId(res.data.data.client_id);
        openSuccessSB("KYC Details", "Aadhar authentication otp sent.");
        setIsVerifying(false);
      } else {
        openErrorSB("KYC Details", "Please check your aadhaar number again");
      }
    } catch (e) {
      console.log(e);
      openErrorSB(
        "KYC Details",
        `${e?.response?.data?.message}Please check your input again.`
      );
      setIsVerifying(false);
    }
  };
  const verifyAadhaarOtp = async () => {
    if (!KYCVerification?.aadhaarNumber || !KYCVerification?.aadhaarOtp) {
      console.log("KYC verification", KYCVerification);
      return openErrorSB("KYC Details", "Please fill mandatory fields");
    }
    try {
      setIsVerifying(true);
      const res = await axios.post(
        `${baseUrl}api/v1/KYC/verifyotp`,
        {
          client_id: aadhaarClientId,
          otp: KYCVerification?.aadhaarOtp,
          panNumber: KYCVerification?.panNumber,
          bankAccountNumber: KYCVerification?.accountNumber,
          ifsc: KYCVerification?.ifsc,
        },
        { withCredentials: true }
      );
      if (res.status == 200) {
        openSuccessSB("KYC Details", "KYC Verified");
        setIsVerifying(false);
        setAction(!action);
      } else {
        openErrorSB("KYC Details", "Please check your aadhaar number again");
        setIsVerifying(false);
      }
    } catch (e) {
      console.log(e);
      openErrorSB("KYC Details", `${e?.response?.data?.message}`);
      setIsVerifying(false);
    }
  };

  const resetKYCVerification = () => {
    setKYCVerification({
      aadhaarNumber: "",
      panNumber: "",
      accountNumber: "",
      dob: "",
      aadhaarOtp: "",
      ifsc: "",
    });
    setAadhaarClientId("");
  };

  return (
    <Card lg={12} sx={{ boxShadow: "none" }}>
      <Divider
        orientation="horizontal"
        sx={{ ml: 1, mr: 1, color: "rgba(0, 0, 0, 0.87)" }}
      />

      <MDBox pl={2} pr={2}>
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <MDTypography
            variant="caption"
            fontWeight="bold"
            color="text"
            textTransform="uppercase"
          >
            Personal Details
          </MDTypography>
          {!editablePD ? (
            <Tooltip title="Edit Personal Details" placement="top">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  sx={{ marginRight: 1 }}
                >
                  Click on pencil icon to update personal details
                </Typography>
                <Icon
                  sx={{ cursor: "pointer" }}
                  fontSize="small"
                  onClick={() => {
                    setEditablePD(true);
                  }}
                >
                  edit
                </Icon>
              </Box>
            </Tooltip>
          ) : (
            <Tooltip title="Save Personal Details" placement="top">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  sx={{ marginRight: 1 }}
                >
                  Click on tick icon to save personal details
                </Typography>
                <Icon
                  sx={{ cursor: "pointer" }}
                  fontSize="small"
                  onClick={() => {
                    setEditablePD(false);
                    formSubmit(formStatePD, "Personal Details");
                  }}
                >
                  done
                </Icon>
              </Box>
            </Tooltip>
          )}
        </MDBox>

        <Divider
          orientation="horizontal"
          sx={{ ml: 1, mr: 1, color: "rgba(0, 0, 0, 0.87)" }}
        />

        <Grid container spacing={2} mt={0.5} mb={2}>
          <Grid item xs={12} md={6} xl={3}>
            <TextField
              required
              disabled={true}
              id="outlined-required"
              label="User ID"
              value={formStatePD.employeeid}
              fullWidth
              onChange={(e) => {
                setFormStatePD((prevState) => ({
                  ...prevState,
                  employeeid: e.target.value,
                }));
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
              required
              disabled={!editablePD}
              id="outlined-required"
              label="First Name"
              value={formStatePD.first_name}
              fullWidth
              // onChange={(e) => {setFormStatePD({first_name: e.target.value})}}
              onChange={(e) => {
                setFormStatePD((prevState) => ({
                  ...prevState,
                  first_name: e.target.value,
                }));
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
              required
              disabled={!editablePD}
              id="outlined-required"
              label="Last Name"
              value={formStatePD.last_name}
              fullWidth
              onChange={(e) => {
                setFormStatePD((prevState) => ({
                  ...prevState,
                  last_name: e.target.value,
                }));
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
              required
              disabled={!editablePD}
              id="outlined-required"
              label="Email"
              value={formStatePD.email}
              fullWidth
              onChange={(e) => {
                setFormStatePD((prevState) => ({
                  ...prevState,
                  email: e.target.value,
                }));
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
              required
              disabled={true}
              id="outlined-required"
              label="Mobile No."
              value={formStatePD.mobile}
              fullWidth
              onChange={(e) => {
                setFormStatePD((prevState) => ({
                  ...prevState,
                  mobile: e.target.value,
                }));
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
              required
              disabled={!editablePD}
              id="outlined-required"
              label="WhatsApp No."
              value={formStatePD.whatsApp_number}
              fullWidth
              onChange={(e) => {
                setFormStatePD((prevState) => ({
                  ...prevState,
                  whatsApp_number: e.target.value,
                }));
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel id="demo-simple-select-autowidth-label">
                Gender *
              </InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={formStatePD?.gender}
                disabled={!editablePD}
                required
                onChange={(e) => {
                  setFormStatePD((prevState) => ({
                    ...prevState,
                    gender: e.target.value,
                  }));
                }}
                label="Gender"
                sx={{ minHeight: 43 }}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
              required
              disabled={true}
              id="outlined-required"
              label="Position"
              value={formStatePD.designation}
              fullWidth
              onChange={(e) => {
                setFormStatePD((prevState) => ({
                  ...prevState,
                  designation: e.target.value,
                }));
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
              required
              disabled={!editablePD}
              id="outlined-required"
              label="Degree"
              value={formStatePD.degree}
              fullWidth
              onChange={(e) => {
                setFormStatePD((prevState) => ({
                  ...prevState,
                  degree: e.target.value,
                }));
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
              required
              disabled={!editablePD}
              id="outlined-required"
              label="Last Occupation"
              value={formStatePD.last_occupation}
              fullWidth
              onChange={(e) => {
                setFormStatePD((prevState) => ({
                  ...prevState,
                  last_occupation: e.target.value,
                }));
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} xl={6}>
            <TextField
              required
              disabled={!editablePD}
              id="outlined-required"
              label="Address"
              value={formStatePD.address}
              fullWidth
              onChange={(e) => {
                setFormStatePD((prevState) => ({
                  ...prevState,
                  address: e.target.value,
                }));
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
              required
              disabled={!editablePD}
              id="outlined-required"
              label="City"
              value={formStatePD.city}
              fullWidth
              onChange={(e) => {
                setFormStatePD((prevState) => ({
                  ...prevState,
                  city: e.target.value,
                }));
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
              required
              disabled={!editablePD}
              id="outlined-required"
              label="Pin Code"
              value={formStatePD.pincode}
              fullWidth
              onChange={(e) => {
                setFormStatePD((prevState) => ({
                  ...prevState,
                  pincode: e.target.value,
                }));
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
              required
              disabled={!editablePD}
              id="outlined-required"
              label="State"
              value={formStatePD.state}
              fullWidth
              onChange={(e) => {
                setFormStatePD((prevState) => ({
                  ...prevState,
                  state: e.target.value,
                }));
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
              required
              disabled={!editablePD}
              id="outlined-required"
              label="Country"
              value={formStatePD.country}
              fullWidth
              onChange={(e) => {
                setFormStatePD((prevState) => ({
                  ...prevState,
                  country: e.target.value,
                }));
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
              required
              disabled={!editablePD}
              id="outlined-required"
              label="Family Yearly Income"
              value={formStatePD.family_yearly_income}
              fullWidth
              onChange={(e) => {
                setFormStatePD((prevState) => ({
                  ...prevState,
                  family_yearly_income: e.target.value,
                }));
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} xl={3} mt={-1}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Date of Birth"
                  disabled={!editablePD}
                  value={formStatePD.dob ? dayjs(formStatePD.dob) : ""}
                  // onChange={(e) => {setFormStatePD({dob: dayjs(e)})}}
                  onChange={(e) => {
                    setFormStatePD((prevState) => ({
                      ...prevState,
                      dob: dayjs(e),
                    }));
                  }}
                  sx={{ width: "100%" }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={6} xl={3} mt={-1}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Joining Date"
                  disabled={true}
                  value={dayjs(formStatePD.joining_date)}
                  onChange={(e) => {
                    setFormStatePD((prevState) => ({
                      ...prevState,
                      joining_date: dayjs(e),
                    }));
                  }}
                  sx={{ width: "100%" }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={6} xl={3} mt={-2}>
            <MDButton
              variant="outlined"
              style={{ fontSize: 10 }}
              fullWidth
              color={!editablePD ? "secondary" : "success"}
              component="label"
            >
              {!formStatePD?.profilePhoto?.name
                ? "Upload Profile Picture"
                : "Upload Another File?"}
              <input
                hidden
                disabled={!editablePD}
                accept="image/*"
                type="file"
                // value={formStatePD.profilePhoto}
                onChange={(e) => {
                  setFormStatePD((prevState) => ({
                    ...prevState,
                    profilePhoto: e.target.files[0],
                  }));
                }}
              />
            </MDButton>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            xl={3}
            display="flex"
            justifyContent="center"
            alignContent="center"
            alignItems="center"
          >
            <TextField
              disabled
              id="outlined-required"
              // label='Selected Carousel Image'
              fullWidth
              // value={portfolioData?.portfolioName}
              value={
                formStatePD?.profilePhoto?.name
                  ? formStatePD?.profilePhoto?.name
                  : "No Image Uploaded"
              }
            />
          </Grid>
        </Grid>
      </MDBox>

      <Divider
        orientation="horizontal"
        sx={{ ml: 1, mr: 1, color: "rgba(0, 0, 0, 0.87)" }}
      />

      <MDBox pl={2} pr={2}>
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <MDTypography
            variant="caption"
            fontWeight="bold"
            color="text"
            textTransform="uppercase"
          >
            Bank Details
          </MDTypography>

          {!editableBD ? (
            <Tooltip title="Update Bank Details" placement="top">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  sx={{ marginRight: 1 }}
                >
                  Click on pencil icon to update bank details
                </Typography>
                <Icon
                  fontSize="small"
                  onClick={() => {
                    if (formStateKYC.KYCStatus != "Approved") {
                      setEditableBD(true);
                    }
                  }}
                >
                  edit
                </Icon>
              </Box>
            </Tooltip>
          ) : (
            <Tooltip title="Save Bank Details" placement="top">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  sx={{ marginRight: 1 }}
                >
                  Click on tick icon to save bank details
                </Typography>
                <Icon
                  fontSize="small"
                  onClick={() => {
                    setEditableBD(false);
                    formSubmit(formStateBD, "Bank Details");
                  }}
                >
                  done
                </Icon>
              </Box>
            </Tooltip>
          )}
        </MDBox>

        <Divider
          orientation="horizontal"
          sx={{ ml: 1, mr: 1, color: "rgba(0, 0, 0, 0.87)" }}
        />

        <Grid container spacing={2} mt={0.5} mb={2}>
          <Grid item xs={12} md={6} xl={3}>
            <TextField
              disabled={!editableBD}
              id="outlined-required"
              label="UPI ID"
              value={formStateBD.upiId}
              fullWidth
              onChange={(e) => {
                setFormStateBD((prevState) => ({
                  ...prevState,
                  upiId: e.target.value,
                }));
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
              disabled={!editableBD}
              id="outlined-required"
              label="Google Pay Number"
              value={formStateBD.googlePay_number}
              fullWidth
              onChange={(e) => {
                setFormStateBD((prevState) => ({
                  ...prevState,
                  googlePay_number: e.target.value,
                }));
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
              disabled={!editableBD}
              id="outlined-required"
              label="PhonePe Number"
              value={formStateBD.phonePe_number}
              fullWidth
              onChange={(e) => {
                setFormStateBD((prevState) => ({
                  ...prevState,
                  phonePe_number: e.target.value,
                }));
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
              disabled={!editableBD}
              id="outlined-required"
              label="PayTM Number"
              value={formStateBD.payTM_number}
              fullWidth
              onChange={(e) => {
                setFormStateBD((prevState) => ({
                  ...prevState,
                  payTM_number: e.target.value,
                }));
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
              required
              disabled={!editableBD}
              id="outlined-required"
              label="Your Name As per Bank Account"
              value={formStateBD.nameAsPerBankAccount}
              fullWidth
              onChange={(e) => {
                setFormStateBD((prevState) => ({
                  ...prevState,
                  nameAsPerBankAccount: e.target.value,
                }));
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
              required
              disabled={!editableBD}
              id="outlined-required"
              label="Bank Name"
              value={formStateBD.bankName}
              fullWidth
              onChange={(e) => {
                setFormStateBD((prevState) => ({
                  ...prevState,
                  bankName: e.target.value,
                }));
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
              required
              disabled={!editableBD}
              id="outlined-required"
              label="Account Number"
              value={formStateBD.accountNumber}
              fullWidth
              onChange={(e) => {
                setFormStateBD((prevState) => ({
                  ...prevState,
                  accountNumber: e.target.value,
                }));
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
              required
              disabled={!editableBD}
              id="outlined-required"
              label="IFSC Code"
              value={formStateBD.ifscCode}
              fullWidth
              onChange={(e) => {
                setFormStateBD((prevState) => ({
                  ...prevState,
                  ifscCode: e.target.value,
                }));
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel id="demo-simple-select-autowidth-label">
                State(Account State)
              </InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={formStateBD?.bankState}
                disabled={!editableBD}
                required
                onChange={(e) => {
                  setFormStateBD((prevState) => ({
                    ...prevState,
                    bankState: e.target.value,
                  }));
                }}
                label="State(Bank Account State)"
                sx={{ minHeight: 43 }}
              >
                <MenuItem value="Bihar">Bihar</MenuItem>
                <MenuItem value="Chhattisgarh">Chhattisgarh</MenuItem>
                <MenuItem value="Goa">Goa</MenuItem>
                <MenuItem value="Punjab">Punjab</MenuItem>
                <MenuItem value="Andhra Pradesh">Andhra Pradesh</MenuItem>
                <MenuItem value="West Bengal">West Bengal</MenuItem>
                <MenuItem value="Jharkhand">Jharkhand</MenuItem>
                <MenuItem value="Odisha">Odisha</MenuItem>
                <MenuItem value="Rajasthan">Rajasthan</MenuItem>
                <MenuItem value="Maharashtra">Maharashtra</MenuItem>
                <MenuItem value="Nagaland">Nagaland</MenuItem>
                <MenuItem value="Sikkim">Sikkim</MenuItem>
                <MenuItem value="Haryana">Haryana</MenuItem>
                <MenuItem value="Himachal Pradesh">Himachal Pradesh</MenuItem>
                <MenuItem value="Arunachal Pradesh">Arunachal Pradesh</MenuItem>
                <MenuItem value="Gujarat">Gujarat</MenuItem>
                <MenuItem value="Assam">Assam</MenuItem>
                <MenuItem value="Manipur">Manipur</MenuItem>
                <MenuItem value="Madhya Pradesh">Madhya Pradesh</MenuItem>
                <MenuItem value="Tamil Nadu">Tamil Nadu</MenuItem>
                <MenuItem value="Kerala">Kerala</MenuItem>
                <MenuItem value="Mizoram">Mizoram</MenuItem>
                <MenuItem value="Uttar Pradesh">Uttar Pradesh</MenuItem>
                <MenuItem value="Delhi">Delhi</MenuItem>
                <MenuItem value="Tripura">Tripura</MenuItem>
                <MenuItem value="Meghalaya">Meghalaya</MenuItem>
                <MenuItem value="Uttarakhand">Uttarakhand</MenuItem>
                <MenuItem value="Telangana">Telangana</MenuItem>
                <MenuItem value="Jammu & Kashmir">Jammu & Kashmir</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </MDBox>

      {/* <Divider orientation="horizontal" sx={{ ml: 1, mr: 1, color:'rgba(0, 0, 0, 0.87)' }} /> */}

      <Divider
        orientation="horizontal"
        sx={{ ml: 1, mr: 1, color: "rgba(0, 0, 0, 0.87)" }}
      />
      {formStateKYC?.KYCStatus != "Approved" && (
        <MDBox px={2}>
          <MDTypography style={{ fontSize: 18 }}>
            Select your method of KYC Verification
          </MDTypography>
          <FormControl component="fieldset">
            <RadioGroup
              row
              aria-label="mdbox"
              name="mdbox"
              value={selectedOption}
              onChange={handleRadioChange}
            >
              <FormControlLabel
                value="automatic"
                control={<Radio color="blue" />}
                label="Automatic Instant KYC"
              />
              <FormControlLabel
                value="manual"
                control={<Radio color="blue" />}
                label="Admin approved KYC"
              />
            </RadioGroup>
          </FormControl>
        </MDBox>
      )}
      {selectedOption == "automatic" && (
        <MDBox pl={2} pr={2}>
          <MDBox
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <MDBox>
              {/* KYC Details Header */}

              <MDBox display="flex" justifyContent="space-between">
                <MDTypography
                  variant="caption"
                  fontWeight="bold"
                  color="text"
                  textTransform="uppercase"
                >
                  KYC Verification
                </MDTypography>

                <MDBox display="flex">
                  <MDTypography
                    variant="caption"
                    fontWeight="bold"
                    sx={{
                      // pt:0.5,
                      // pb:0.5,
                      ml: 3,
                    }}
                  >
                    STATUS :
                  </MDTypography>
                  <MDTypography
                    variant="caption"
                    ml={1}
                    mt={-0.6}
                    fontWeight="bold"
                    textTransform="uppercase"
                    sx={{
                      border: "1px solid",
                      borderColor: "gray.400",
                      borderRadius: 2,
                      pt: 0.5,
                      pb: 0.5,
                      pr: 1,
                      pl: 1,
                      backgroundColor: `${
                        formStateKYC?.KYCStatus === "Not Initiated"
                          ? "#1A73E8"
                          : formStateKYC?.KYCStatus === "Approved"
                          ? "#4CAF50"
                          : formStateKYC?.KYCStatus === "Rejected"
                          ? "#F44335"
                          : formStateKYC?.KYCStatus === "Under Verification"
                          ? "#fb8c00"
                          : "#1A73E8"
                      }`,
                      color: `${
                        formStateKYC?.KYCStatus === "Not Initiated"
                          ? "white!important"
                          : formStateKYC?.KYCStatus === "Approved"
                          ? "white!important"
                          : formStateKYC?.KYCStatus === "Rejected"
                          ? "white!important"
                          : formStateKYC?.KYCStatus === "Under Verification"
                          ? "black!important"
                          : "white!important"
                      }`,
                    }}
                  >
                    {formStateKYC.KYCStatus ||
                      getDetails?.userDetails?.KYCStatus}
                  </MDTypography>
                </MDBox>
              </MDBox>

              {/* KYC Details Header End */}
            </MDBox>

            {/* {!editableKYC ? 
            <Tooltip title="Edit KYC Details" placement="top">
            <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <Typography
                variant="caption"
                fontWeight="bold"
                sx={{ marginRight: 1 }}
              >
                Click on pencil icon to update KYC details
              </Typography>
              <Icon
                fontSize="small"
                onClick={() => {
                  if(formStateKYC.KYCStatus != 'Approved'){
                    setEditableKYC(true);
                  }
                }}
              >
                edit
              </Icon>
            </Box>
            </Tooltip>
            :
            <Tooltip title="Save KYC Details" placement="top">
              <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  sx={{ marginRight: 1 }}
                >
                  Click on tick icon to save KYC details
                </Typography>
                <Icon
                  fontSize="small"
                  onClick={() => {
                    setEditableKYC(false);
                    formSubmit(formStateKYC,"KYC Details");
                  }}
                >
                  done
                </Icon>
              </Box>
            </Tooltip>
            } */}
          </MDBox>

          {/* <Divider orientation="horizontal" sx={{ ml: 1, mr: 1, color:'rgba(0, 0, 0, 0.87)' }} /> */}
          {formStateKYC?.KYCStatus != "Approved" ? (
            <MDTypography style={{ fontSize: 14 }}>
              Introducing seamless instant KYC Verification. Enter your Aadhaar,
              PAN and Bank Account Number and get your KYC Verified instantly.
            </MDTypography>
          ) : (
            <MDTypography style={{ fontSize: 14 }}>
              Your KYC is verified. To change KYC details and re-verify, contact
              support at team@stoxhero.com.
            </MDTypography>
          )}
          <Grid container spacing={2} mt={0}>
            <Grid item xs={12} md={6} xl={3}>
              <TextField
                disabled={
                  aadhaarClientId || formStateKYC?.KYCStatus == "Approved"
                }
                id="outlined-required"
                label="Aadhaar Number *"
                value={KYCVerification?.aadhaarNumber}
                fullWidth
                onChange={(e) => {
                  setKYCVerification((prevState) => ({
                    ...prevState,
                    aadhaarNumber: e.target.value,
                  }));
                }}
              />
            </Grid>

            <Grid item xs={12} md={6} xl={3}>
              <TextField
                disabled={
                  aadhaarClientId || formStateKYC.KYCStatus == "Approved"
                }
                id="outlined-required"
                label="PAN Number *"
                value={KYCVerification?.panNumber}
                fullWidth
                onChange={(e) => {
                  setKYCVerification((prevState) => ({
                    ...prevState,
                    panNumber: e.target.value,
                  }));
                }}
              />
            </Grid>

            <Grid item xs={12} md={6} xl={3}>
              <TextField
                disabled={
                  aadhaarClientId || formStateKYC?.KYCStatus == "Approved"
                }
                id="outlined-required"
                label="Bank Account Number *"
                value={KYCVerification?.accountNumber}
                fullWidth
                onChange={(e) => {
                  setKYCVerification((prevState) => ({
                    ...prevState,
                    accountNumber: e.target.value,
                  }));
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <TextField
                disabled={
                  aadhaarClientId || formStateKYC?.KYCStatus == "Approved"
                }
                id="outlined-required"
                label="Ifsc Code *"
                value={KYCVerification?.ifsc}
                fullWidth
                onChange={(e) => {
                  setKYCVerification((prevState) => ({
                    ...prevState,
                    ifsc: e.target.value,
                  }));
                }}
              />
            </Grid>

            {/* <Grid item xs={12} md={6} xl={3}>
              <TextField
                disabled={!editableKYC || formStateKYC.KYCStatus == 'Approved'}
                id="outlined-required"
                label="Driving License Number"
                value={formStateKYC?.drivingLicenseNumber}
                fullWidth
                onChange={(e) => {setFormStateKYC(prevState => ({
                  ...prevState,
                  drivingLicenseNumber: e.target.value
                }))}}
              />
          </Grid> */}

            {/* <Grid item xs={12} md={6} xl={3} mt={-1}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker
                  label="Date of Birth"
                  // disabled={!editableKYC}
                  value={KYCVerification.dob ? dayjs(KYCVerification.dob) : ''}
                  // onChange={(e) => {setFormStatePD({dob: dayjs(e)})}}
                  onChange={(e) => {setKYCVerification(prevState => ({
                    ...prevState,
                    dob: dayjs(e)
                  }))}}
                  sx={{ width: '100%' }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Grid> */}

            <Grid
              xl={12}
              ml={2}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <MDBox>
                {aadhaarClientId && formStateKYC?.KYCStatus != "Approved" && (
                  <TextField
                    // disabled={aadhaarClientId}
                    id="outlined-required"
                    label="Aadhaar Otp"
                    value={KYCVerification?.otp}
                    fullWidth
                    onChange={(e) => {
                      setKYCVerification((prevState) => ({
                        ...prevState,
                        aadhaarOtp: e.target.value,
                      }));
                    }}
                  />
                )}
              </MDBox>
              {formStateKYC?.KYCStatus != "Approved" && (
                <MDBox>
                  <MDButton
                    variant="outlined"
                    color="warning"
                    style={{ marginRight: 12 }}
                    onClick={resetKYCVerification}
                  >
                    Reset
                  </MDButton>
                  {!aadhaarClientId ? (
                    <MDButton color="success" onClick={generateAadhaarOtp}>
                      {isVerifying ? (
                        <CircularProgress color="white" size={12} />
                      ) : (
                        "Generate OTP"
                      )}
                    </MDButton>
                  ) : (
                    <MDButton color="success" onClick={verifyAadhaarOtp}>
                      {isVerifying ? (
                        <CircularProgress color="white" size={12} />
                      ) : (
                        "Verify KYC"
                      )}
                    </MDButton>
                  )}
                </MDBox>
              )}
            </Grid>
          </Grid>
        </MDBox>
      )}
      {selectedOption == "manual" && (
        <MDBox pl={2} pr={2}>
          <MDBox
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <MDBox>
              {/* KYC Details Header */}

              <MDBox display="flex" justifyContent="center">
                <MDTypography
                  variant="caption"
                  fontWeight="bold"
                  color="text"
                  textTransform="uppercase"
                >
                  KYC Details
                </MDTypography>

                <MDBox display="flex">
                  <MDTypography
                    variant="caption"
                    fontWeight="bold"
                    sx={{
                      // pt:0.5,
                      // pb:0.5,
                      ml: 3,
                    }}
                  >
                    STATUS :
                  </MDTypography>
                  <MDTypography
                    variant="caption"
                    ml={1}
                    mt={-0.6}
                    fontWeight="bold"
                    textTransform="uppercase"
                    sx={{
                      border: "1px solid",
                      borderColor: "gray.400",
                      borderRadius: 2,
                      pt: 0.5,
                      pb: 0.5,
                      pr: 1,
                      pl: 1,
                      backgroundColor: `${
                        formStateKYC?.KYCStatus === "Not Initiated"
                          ? "#1A73E8"
                          : formStateKYC?.KYCStatus === "Approved"
                          ? "#4CAF50"
                          : formStateKYC?.KYCStatus === "Rejected"
                          ? "#F44335"
                          : formStateKYC?.KYCStatus === "Under Verification"
                          ? "#fb8c00"
                          : "#1A73E8"
                      }`,
                      color: `${
                        formStateKYC?.KYCStatus === "Not Initiated"
                          ? "white!important"
                          : formStateKYC?.KYCStatus === "Approved"
                          ? "white!important"
                          : formStateKYC?.KYCStatus === "Rejected"
                          ? "white!important"
                          : formStateKYC?.KYCStatus === "Under Verification"
                          ? "black!important"
                          : "white!important"
                      }`,
                    }}
                  >
                    {getDetails?.userDetails?.KYCStatus
                      ? getDetails?.userDetails?.KYCStatus
                      : formStateKYC.KYCStatus}
                  </MDTypography>
                </MDBox>
              </MDBox>

              {/* KYC Details Header End */}
            </MDBox>

            {!editableKYC ? (
              <Tooltip title="Edit KYC Details" placement="top">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight="bold"
                    sx={{ marginRight: 1 }}
                  >
                    Click on pencil icon to update KYC details
                  </Typography>
                  <Icon
                    fontSize="small"
                    onClick={() => {
                      if (formStateKYC.KYCStatus != "Approved") {
                        setEditableKYC(true);
                      }
                    }}
                  >
                    edit
                  </Icon>
                </Box>
              </Tooltip>
            ) : (
              <Tooltip title="Save KYC Details" placement="top">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight="bold"
                    sx={{ marginRight: 1 }}
                  >
                    Click on tick icon to save KYC details
                  </Typography>
                  <Icon
                    fontSize="small"
                    onClick={() => {
                      setEditableKYC(false);
                      formSubmit(formStateKYC, "KYC Details");
                    }}
                  >
                    done
                  </Icon>
                </Box>
              </Tooltip>
            )}
          </MDBox>

          <Divider
            orientation="horizontal"
            sx={{ ml: 1, mr: 1, color: "rgba(0, 0, 0, 0.87)" }}
          />

          <Grid container spacing={2} mt={0}>
            <Grid item xs={12} md={6} xl={4}>
              <TextField
                disabled={!editableKYC || formStateKYC.KYCStatus == "Approved"}
                id="outlined-required"
                label="Aadhaar Number *"
                value={formStateKYC?.aadhaarNumber}
                fullWidth
                onChange={(e) => {
                  setFormStateKYC((prevState) => ({
                    ...prevState,
                    aadhaarNumber: e.target.value,
                  }));
                }}
              />
            </Grid>

            <Grid item xs={12} md={6} xl={4}>
              <TextField
                disabled={!editableKYC || formStateKYC.KYCStatus == "Approved"}
                id="outlined-required"
                label="PAN Number *"
                value={formStateKYC?.panNumber}
                fullWidth
                onChange={(e) => {
                  setFormStateKYC((prevState) => ({
                    ...prevState,
                    panNumber: e.target.value,
                  }));
                }}
              />
            </Grid>

            {/* <Grid item xs={12} md={6} xl={3}>
          <TextField
            disabled={!editableKYC || formStateKYC.KYCStatus == 'Approved'}
            id="outlined-required"
            label="Passport Number"
            value={formStateKYC?.passportNumber}
            fullWidth
            onChange={(e) => {setFormStateKYC(prevState => ({
              ...prevState,
              passportNumber: e.target.value
            }))}}
          />
      </Grid> */}

            {/* <Grid item xs={12} md={6} xl={3}>
          <TextField
            disabled={!editableKYC || formStateKYC.KYCStatus == 'Approved'}
            id="outlined-required"
            label="Driving License Number"
            value={formStateKYC?.drivingLicenseNumber}
            fullWidth
            onChange={(e) => {setFormStateKYC(prevState => ({
              ...prevState,
              drivingLicenseNumber: e.target.value
            }))}}
          />
      </Grid> */}

            <Grid item xs={12} md={6} xl={4} mt={-1}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    label="Date of Birth"
                    disabled={!editableKYC}
                    value={formStateKYC.dob ? dayjs(formStateKYC.dob) : ""}
                    // onChange={(e) => {setFormStatePD({dob: dayjs(e)})}}
                    onChange={(e) => {
                      setFormStateKYC((prevState) => ({
                        ...prevState,
                        dob: dayjs(e),
                      }));
                    }}
                    sx={{ width: "100%" }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6} xl={2.4}>
              <MuiFileInput
                value={null}
                disabled={!editableKYC || formStateKYC.KYCStatus == "Approved"}
                placeholder={
                  (formStateKYC?.aadhaarCardFrontImage
                    ? formStateKYC?.aadhaarCardFrontImage?.name?.slice(0, 15)
                    : "Click to upload") +
                  (formStateKYC?.aadhaarCardFrontImage?.name?.length > 15
                    ? "..."
                    : "")
                }
                label="Aadhaar Card Front"
                onChange={(e) => {
                  handleFileSelect(e, "aadhaarCardFront");
                }}
              />
            </Grid>

            <Grid item xs={12} md={6} xl={2.4}>
              <MuiFileInput
                value={null}
                disabled={!editableKYC || formStateKYC.KYCStatus == "Approved"}
                placeholder={
                  (formStateKYC?.aadhaarCardBackImage
                    ? formStateKYC?.aadhaarCardBackImage?.name?.slice(0, 15)
                    : "Click to upload") +
                  (formStateKYC?.aadhaarCardBackImage?.name?.length > 15
                    ? "..."
                    : "")
                }
                label="Aadhaar Card Back"
                onChange={(e) => {
                  handleFileSelect(e, "aadhaarCardBack");
                }}
              />
            </Grid>

            <Grid item xs={12} md={6} xl={2.4}>
              <MuiFileInput
                value={null}
                placeholder={
                  (formStateKYC?.panCardFrontImage
                    ? formStateKYC?.panCardFrontImage?.name?.slice(0, 15)
                    : "Click to upload") +
                  (formStateKYC?.panCardFrontImage?.name?.length > 15
                    ? "..."
                    : "")
                }
                disabled={!editableKYC || formStateKYC.KYCStatus == "Approved"}
                label="PAN Card Photo"
                onChange={(e) => {
                  handleFileSelect(e, "panCardFront");
                }}
              />
            </Grid>

            <Grid item xs={12} md={6} xl={2.4}>
              <MuiFileInput
                value={null}
                disabled={!editableKYC || formStateKYC.KYCStatus == "Approved"}
                placeholder={
                  (formStateKYC?.passportPhoto
                    ? formStateKYC?.passportPhoto?.name?.slice(0, 10)
                    : "Click to upload") +
                  (formStateKYC?.passportPhoto?.name?.length > 15 ? "..." : "")
                }
                label="Passport Size Photo"
                onChange={(e) => {
                  handleFileSelect(e, "passportPhoto");
                }}
              />
            </Grid>

            <Grid item xs={12} md={6} xl={2.4}>
              <MuiFileInput
                placeholder={
                  (formStateKYC?.addressProofDocument
                    ? formStateKYC?.addressProofDocument?.name?.slice(0, 15)
                    : "Click to upload") +
                  (formStateKYC?.addressProofDocument?.name?.length > 15
                    ? "..."
                    : "")
                }
                value={null}
                disabled={!editableKYC || formStateKYC.KYCStatus == "Approved"}
                label="Address Proof"
                onChange={(e) => {
                  handleFileSelect(e, "addressProofDocument");
                }}
              />
            </Grid>

            {!editableKYC && (
              <Grid item xs={12} md={6} xl={2.4}>
                <MDBox position="relative" display="inline-block">
                  <img
                    style={{ width: "100%", height: "130px", fontSize: 15 }}
                    src={formStateKYC?.aadhaarCardFrontImage?.url}
                    alt="Save to upload"
                  />
                  {editableKYC && (
                    <button
                      onClick={(e) => {
                        onRemove("aadhaarCardFront");
                      }}
                      style={{
                        position: "absolute",
                        top: "1px",
                        right: "5px",
                        borderRadius: "50%",
                        backgroundColor: "transparent",
                        border: "none",
                        color: "red",
                        fontSize: "1.5rem",
                        padding: "5px",
                        cursor: "pointer",
                      }}
                    >
                      &times;
                    </button>
                  )}
                </MDBox>
                {formStateKYC?.aadhaarCardFrontPreview ? (
                  <Typography sx={{ fontSize: 10, mt: -1 }}>
                    Aadhaar Card Front Uploaded
                  </Typography>
                ) : (
                  <Typography sx={{ fontSize: 10, mt: -1 }}>
                    Please Upload Aadhaar Card Back
                  </Typography>
                )}
              </Grid>
            )}

            {!editableKYC && (
              <Grid item xs={12} md={6} xl={2.4}>
                <MDBox position="relative" display="inline-block">
                  <img
                    style={{ width: "100%", height: "130px", fontSize: 15 }}
                    src={formStateKYC?.aadhaarCardBackImage?.url}
                    alt="Save to upload"
                  />
                  {editableKYC && (
                    <button
                      onClick={(e) => {
                        onRemove("aadhaarCardBack");
                      }}
                      style={{
                        position: "absolute",
                        top: "1px",
                        right: "5px",
                        borderRadius: "50%",
                        backgroundColor: "transparent",
                        border: "none",
                        color: "red",
                        fontSize: "1.5rem",
                        padding: "5px",
                        cursor: "pointer",
                      }}
                    >
                      &times;
                    </button>
                  )}
                </MDBox>
                {formStateKYC?.aadhaarCardBackPreview ? (
                  <Typography sx={{ fontSize: 10, mt: -1 }}>
                    Aadhaar Card Back Uploaded
                  </Typography>
                ) : (
                  <Typography sx={{ fontSize: 10, mt: -1 }}>
                    Please Upload Aadhaar Card Back
                  </Typography>
                )}
              </Grid>
            )}

            {!editableKYC && (
              <Grid item xs={12} md={6} xl={2.4}>
                <MDBox position="relative" display="inline-block">
                  <img
                    style={{ width: "100%", height: "130px", fontSize: 15 }}
                    src={formStateKYC?.panCardFrontImage?.url}
                    alt="Save to upload"
                  />
                  {editableKYC && (
                    <button
                      onClick={(e) => {
                        onRemove("panCardFront");
                      }}
                      style={{
                        position: "absolute",
                        top: "1px",
                        right: "5px",
                        borderRadius: "50%",
                        backgroundColor: "transparent",
                        border: "none",
                        color: "red",
                        fontSize: "1.5rem",
                        padding: "5px",
                        cursor: "pointer",
                      }}
                    >
                      &times;
                    </button>
                  )}
                </MDBox>
                {formStateKYC?.panCardFrontPreview ? (
                  <Typography sx={{ fontSize: 10, mt: -1 }}>
                    Pan Card Uploaded
                  </Typography>
                ) : (
                  <Typography sx={{ fontSize: 10, mt: -1 }}>
                    Please Upload Pan Card
                  </Typography>
                )}
              </Grid>
            )}

            {!editableKYC && (
              <Grid item xs={12} md={6} xl={2.4}>
                <MDBox position="relative" display="inline-block">
                  <img
                    style={{ width: "100%", height: "130px", fontSize: 15 }}
                    src={formStateKYC?.passportPhoto?.url}
                    alt="Save to upload"
                  />
                  {editableKYC && (
                    <button
                      onClick={(e) => {
                        onRemove("passportPhoto");
                      }}
                      style={{
                        position: "absolute",
                        top: "1px",
                        right: "5px",
                        borderRadius: "50%",
                        backgroundColor: "transparent",
                        border: "none",
                        color: "red",
                        fontSize: "1.5rem",
                        padding: "5px",
                        cursor: "pointer",
                      }}
                    >
                      &times;
                    </button>
                  )}
                </MDBox>
                {formStateKYC?.passportPhotoPreview ? (
                  <Typography sx={{ fontSize: 10, mt: -1 }}>
                    Passport Size Photo Uploaded
                  </Typography>
                ) : (
                  <Typography sx={{ fontSize: 10, mt: -1 }}>
                    Please Upload Passport Size Photo
                  </Typography>
                )}
              </Grid>
            )}

            {!editableKYC && (
              <Grid item xs={12} md={6} xl={2.4}>
                <MDBox position="relative" display="inline-block">
                  <img
                    style={{ width: "100%", height: "130px", fontSize: 15 }}
                    src={formStateKYC?.addressProofDocument?.url}
                    alt="Save to upload"
                  />
                  {editableKYC && (
                    <button
                      onClick={(e) => {
                        onRemove("addressProofDocument");
                      }}
                      style={{
                        position: "absolute",
                        top: "1px",
                        right: "5px",
                        borderRadius: "50%",
                        backgroundColor: "transparent",
                        border: "none",
                        color: "red",
                        fontSize: "1.5rem",
                        padding: "5px",
                        cursor: "pointer",
                      }}
                    >
                      &times;
                    </button>
                  )}
                </MDBox>
                {formStateKYC?.addressProofDocumentPreview ? (
                  <Typography sx={{ fontSize: 10, mt: -1 }}>
                    Address Proof Document Uploaded
                  </Typography>
                ) : (
                  <Typography sx={{ fontSize: 10, mt: -1 }}>
                    Please Upload Address Proof Document
                  </Typography>
                )}
              </Grid>
            )}
          </Grid>
        </MDBox>
      )}

      {renderSuccessSB}
      {renderErrorSB}
    </Card>
  );
}

export default MyProfile;
