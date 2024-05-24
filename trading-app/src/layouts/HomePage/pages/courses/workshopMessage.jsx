import React, { memo, useEffect } from "react";
import MDButton from "../../../../components/MDButton/index.js";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MDTypography from "../../../../components/MDTypography/index.js";
// import theme from "../../utils/theme/index";
// import { useMediaQuery } from "@mui/material";
import {useNavigate} from 'react-router-dom';

const Form = ({ message, setOpenParent, success }) => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
    setOpen(true);
  }, [message]);

  const handleClose = () => {
    setOpen(false);
    setOpenParent(false);
    success && navigate(`/courses`);
  };

  // const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <MDTypography
            fontSize={20}
            fontColor="dark"
            fontWeight="bold"
            textAlign="center"
          >

          </MDTypography>
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MDTypography
            fontSize={18}
            // color="error"
            // fontWeight="bold"
            textAlign="center"
          >
            {message}
          </MDTypography>
        </DialogContent>
        <DialogActions>
          <MDButton
            variant="gradient"
            size="small"
            color="error"
            onClick={handleClose}
            autoFocus
          >
            Close
          </MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default memo(Form);
