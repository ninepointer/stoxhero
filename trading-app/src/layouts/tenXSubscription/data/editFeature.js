import * as React from 'react';
import {useState, useEffect} from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MDButton from '../../../components/MDButton';
import TextField from '@mui/material/TextField';
// import Select, { SelectChangeEvent } from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
// import InputLabel from '@mui/material/InputLabel';
// import FormControl from '@mui/material/FormControl';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import MDSnackbar from "../../../components/MDSnackbar";



const EditFeature = ({data, setUpdatedDocument}) => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };



  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  const [editData, setEditData] = useState(data);

  const [orderNo, setOrderNo] = useState();
  const [description, setDescription] = useState();


  useEffect(() => {
    setOrderNo(editData.orderNo)
    setDescription(editData.description);
    //   setRequestToken(editData[0].requestToken);
    //   setStatus(editData[0].status);

  }, [editData])
  const [formstate, setformstate] = useState({
      OrderNo: "",
      Description: ""
  });


  async function formbtn() {

      formstate.OrderNo = orderNo;
      formstate.Description = description;

      setformstate(formstate);


      const { OrderNo, Description} = formstate;
                                      
      const res = await fetch(`${baseUrl}api/v1/tenX/feature/${editData._id}`, {
          method: "PATCH",
          credentials: "include",
          headers: {
              "Accept": "application/json",
              "content-type": "application/json"
          },
          body: JSON.stringify({
            orderNo: OrderNo, description: Description
          })
      });
      const dataResp = await res.json();
      //console.log(dataResp);
      if (dataResp.status === 422 || dataResp.error || !dataResp) {
        //   window.alert(dataResp.error);
        openErrorSB("Error", "unexpected error");
          //console.log("Failed to Edit");
      } else {
          //console.log(dataResp);
          setUpdatedDocument(dataResp?.data)
          openSuccessSB("Success", "Feature edited")
        //   window.alert("Edit succesfull");
          //console.log("Edit succesfull");
      }
       
      setOpen(false);
    //   reRender ? setReRender(false) : setReRender(true)
  }

  const [title,setTitle] = useState('')
  const [content,setContent] = useState('')

  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = (title,content) => {
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

  return (
    <div>
      <MDButton variant="outlined" color="secondary" onClick={handleClickOpen}>
        <EditSharpIcon/>
      </MDButton>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {""}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ display: "flex", flexDirection: "column" }}>
            <TextField
              id="outlined-basic" label="Order No" variant="standard" value={orderNo}
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{setOrderNo( e.target.value)}}/>

            <TextField
              id="outlined-basic" label="Description" variant="standard" value={description}
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{setDescription( e.target.value)}}/>

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={formbtn}>
            OK
          </Button>
          <Button onClick={handleClose} autoFocus>
            CLOSE
          </Button>
        </DialogActions>
      </Dialog>
      {renderSuccessSB}
      {renderErrorSB}
    </div>
  );
}

export default EditFeature