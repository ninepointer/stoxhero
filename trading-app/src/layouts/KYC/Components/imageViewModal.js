import React, { useEffect, useState, useContext } from "react";
import Modal from "@mui/material/Modal";
import { Checkbox, TextField } from "@mui/material";
import { Box } from "@mui/material";
import axios from "axios";
import { apiUrl } from "../../../constants/constants";
import MDTypography from "../../../components/MDTypography";
import { Grid } from "@mui/material";
import { Select } from "@mui/material";
import { FormControl } from "@mui/material";
import { InputLabel } from "@mui/material";
import { OutlinedInput } from "@mui/material";
import { MenuItem } from "@mui/material";
import MDButton from "../../../components/MDButton";
import MDBox from "../../../components/MDBox";
import DataTable from "../../../examples/Tables/DataTable";
import MDSnackbar from "../../../components/MDSnackbar";
import { userContext } from "../../../AuthContext";

const ImageViewModal = ({
  open,
  handleClose,
  user,
  action,
  setAction,
  type,
}) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    // width: 400,
    // bgcolor: "background.paper",
    height: "85vh",
    //   border: '2px solid #000',
    borderRadius: 2,
    // boxShadow: 24,
    p: 4,
  };

  const getDetails = useContext(userContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = (title, content) => {
    console.log("status success");
    setTitle(title);
    setContent(content);
    setSuccessSB(true);
  };
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
    setTitle(title);
    setContent(content);
    setErrorSB(true);
  };
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

  const handleSubmit = async () => {
    if (!rejectionReason) {
      return openErrorSB("error", "Rejection reason is required.");
    }
    const res = await axios.patch(
      `${apiUrl}KYC/reject/${user._id}`,
      { rejectionReason },
      { withCredentials: true }
    );
    console.log(res.data);
    if (res.data.status == "success") {
      openSuccessSB("Success", "KYC rejected.");
      setAction(!action);
      handleClose();
    } else {
      openErrorSB("Error", res.data.message);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <MDTypography fontWeight="bold" style={{ color: "#ffffff" }}>
            Doc No.{type == "aadhaar" ? user?.aadhaarNumber : user?.panNumber}
          </MDTypography>
          <MDBox
            mt={1}
            style={{ height: "85vh", display: "flex", flexDirection: "column" }}
          >
            <img
              src={
                type == "aadhaar"
                  ? user?.aadhaarCardFrontImage?.url
                  : user?.panCardFrontImage?.url
              }
              style={{ maxHeight: "80vh", maxWidth: "600px" }}
            />
          </MDBox>
        </Box>
      </Modal>
      {renderSuccessSB}
      {renderErrorSB}
    </>
  );
};

export default ImageViewModal;
