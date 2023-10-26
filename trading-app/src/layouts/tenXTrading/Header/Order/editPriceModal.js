import React, { useContext, useState, memo } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import MDButton from '../../../../components/MDButton';
import { Box, TextField, Typography } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

import EditIcon from '@mui/icons-material/Edit';
import MDBox from '../../../../components/MDBox';
import { renderContext } from '../../../../renderContext';
import { userContext } from '../../../../AuthContext';
import { apiUrl } from '../../../../constants/constants';
import MDSnackbar from '../../../../components/MDSnackbar';

function ModifyPopUp({id, lots, symbol, type, buyOrSell, ltp}) {

    const newLtp = parseFloat(ltp.slice(1))
    const [errorMessageStopLoss, setErrorMessageStopLoss] = useState("");
    const [errorMessageStopProfit, setErrorMessageStopProfit] = useState("");  
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedValue, setSelectedValue] = React.useState('a');
    const open = Boolean(anchorEl);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const {render, setRender} = useContext(renderContext);
    const getDetails = React.useContext(userContext);
    const tradeSound = getDetails.tradeSound;
    const [messageObj, setMessageObj] = useState({
      color: '',
      icon: '',
      title: '',
      content: ''
    })
    const [price, setPrice] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const stopSLSP = (e) => {
      setErrorMessageStopLoss("")
      setErrorMessageStopProfit("")
      if(type === "StopLoss"){
        if(buyOrSell === "SELL"){
          if(Number(newLtp) < Number(e.target.value)){//errorMessage
            const text  = "Stop Loss price should be less then LTP.";
            setErrorMessageStopLoss(text)
          }
        } else{
          if(Number(newLtp) > Number(e.target.value)){//errorMessage
            const text  = "Stop Loss price should be greater then LTP.";
            setErrorMessageStopLoss(text)
          }
        }
      } else if(type === "StopProfit"){
        if(buyOrSell === "SELL"){
          if(Number(newLtp) > Number(e.target.value)){
            setErrorMessageStopProfit("Stop Profit price should be greater then LTP.")
          }
        } else{
          if(Number(newLtp) < Number(e.target.value)){
            setErrorMessageStopProfit("Stop Profit price should be less then LTP.")
          }
        }
      }
      setPrice(e.target.value)
    };

  const modifyOrder = async () => {

    if((!price)){
      openSuccessSB('error', "Please enter price.");
      return;
    }
    const res = await fetch(`${apiUrl}pendingorder/editprice/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        execution_price: price 
      })
    });
    const dataResp = await res.json();
    if (dataResp.status === 422 || dataResp.error || !dataResp) {
      openSuccessSB('error', dataResp.error)
    } else {
      tradeSound.play();
      openSuccessSB(dataResp.status, dataResp.message)
    }
    setPrice(0);
    render ? setRender(false) : setRender(true)
    handleClose();
  }
    
  const [successSB, setSuccessSB] = useState(false);

  const openSuccessSB = (value,content) => {
    if(value === "Success"){
        messageObj.color = 'success'
        messageObj.icon = 'check'
        messageObj.title = "Successful";
        messageObj.content = content;
        setSuccessSB(true);
    };
    if(value === "error"){
      messageObj.color = 'error'
      messageObj.icon = 'error'
      messageObj.title = "Error";
      messageObj.content = content;
    };

    setMessageObj(messageObj);
    setSuccessSB(true);
  }
  const closeSuccessSB = () => setSuccessSB(false);
  const renderSuccessSB = (
    <MDSnackbar
      color= {messageObj.color}
      icon= {messageObj.icon}
      title={messageObj.title}
      content={messageObj.content}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
      sx={{ borderLeft: `10px solid ${messageObj.icon == 'check' ? "green" : "red"}`, borderRight: `10px solid ${messageObj.icon == 'check' ? "green" : "red"}`, borderRadius: "15px", width: "auto"}}
    />
  );

  return (
    <div>
      <MDBox onClick={handleClick}>
        <EditIcon sx={{ mr: 2 }} /> Modify Price
      </MDBox>
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title">
          <DialogTitle id="responsive-dialog-title" sx={{ textAlign: 'center', display: "flex", justifyContent: "space-between" }}>
            <Box sx={{color: "#FFFFFF", backgroundColor: "#FB8C00", fontWeight: 600, borderRadius: "5px", fontSize: "11px", textAlign: "center", padding: "2px", paddingTop: "7px" }}>
              {type}
            </Box>

            <Box sx={{fontSize: "15px"}} >
              Edit Price
            </Box>

            <Box sx={{color: "#FFFFFF", backgroundColor: "#FB8C00", fontWeight: 600, borderRadius: "5px", fontSize: "11px", textAlign: "center", padding: "2px", paddingTop: "7px" }}>
              {buyOrSell}
            </Box>
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "200px" }}>
              <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between",  }} mb={1}>
                <Box sx={{color: "#FFFFFF", backgroundColor: "#1A72E5", fontWeight: 600, padding: "5px", borderRadius: "5px", fontSize: "11px" }}>
                  <Box>
                  {`Symbol : ${(symbol)?.slice(-7)}`}
                  </Box>
                </Box> 
                
                <Box sx={{color: "#FFFFFF", backgroundColor: "#00D100", fontWeight: 600, padding: "5px", borderRadius: "5px", fontSize: "11px" }}>
                  <Box>
                  {`LTP : ${ltp}`}
                  </Box>
                </Box>
              </Box>
              <Box 
              sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", gap: 2 }}
              >

                <TextField
                  id="outlined-basic" label={<Typography sx={{fontSize: "12px"}} >Quantity</Typography> }
                  variant="outlined"
                  disabled={true}
                  sx={{ 
                    marginTop: 1,
                    width: "100px" 
                  }}
                  type="number"
                  value={lots}
                />

                <TextField
                  id="outlined-basic" label={<Typography sx={{fontSize: "12px"}} >{type==="StopProfit" ? "SP Price" : "SL Price"}</Typography> }
                  variant="outlined" onChange={(e) => { { stopSLSP(e) } }}
                  sx={{
                    marginTop: 1,
                    width: "100px" 
                  }}
                  type="number" />

              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: "10px" }}>
              {type==="StopLoss" ?
                <Typography fontSize={13} color={"error"}> {(price && errorMessageStopLoss) && errorMessageStopLoss}</Typography>
                :
                <Typography fontSize={13} color={"error"}>{(price && errorMessageStopProfit) && errorMessageStopProfit}</Typography>
              }
              </Box>

            </DialogContentText>
          </DialogContent>
          <DialogActions>
          <MDButton variant="contained" color="error" onClick={handleClose} autoFocus sx={{fontSize: "10px"}}>
              CANCEL
            </MDButton>
            <MDButton
              disabled={
                type==="StopProfit" ?
                buyOrSell==="SELL" ?
                (price && (newLtp > price))
                :
                (price && (newLtp < price))

                :

                buyOrSell==="SELL" ?
                (price && (newLtp < price))
                :
                (price && (newLtp > price))

              } 
              autoFocus variant="contained" color="warning" onClick={modifyOrder} sx={{fontSize: "10px"}}>
              EDIT
            </MDButton>

          </DialogActions>
        </Dialog>
      </div >
      {renderSuccessSB}
    </div >
  );

}
export default memo(ModifyPopUp);