import React, { useContext, useState, memo, useEffect } from 'react'
// import axios from "axios";
import { userContext } from '../../../AuthContext';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// import uniqid from "uniqid"
import MDSnackbar from '../../../components/MDSnackbar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import MDButton from '../../../components/MDButton';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { Box, Checkbox, TextField, Typography } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { renderContext } from '../../../renderContext';
import { Howl } from "howler";
import sound from "../../../assets/sound/tradeSound.mp3"
import { marginX, paperTrader, infinityTrader, tenxTrader, internshipTrader, dailyContest, battle } from "../../../variables";
import { maxLot_BankNifty, maxLot_Nifty, maxLot_FinNifty, lotSize_BankNifty, lotSize_FinNifty, lotSize_Nifty } from "../../../variables";

import EditIcon from '@mui/icons-material/Edit';
import MDBox from '../../../components/MDBox';


function ModifyPopUp({data}) {

    const lots=data?.Quantity?.props?.children;
    const symbolName=data?.symbol?.props?.children;
    const ltp=data?.last_price?.props?.children;
    const change=data?.change?.props?.children;

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedValue, setSelectedValue] = React.useState('a');
    const open = Boolean(anchorEl);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [modifyData, setModifyData] = useState({
      Quantity: 0,
      stopLossPrice: 0,
      stopProfitPrice: 0
    });
    let index = symbolName.includes("BANK") ? "BANKNIFTY" : symbolName.includes("FIN") ? 'FINNIFTY' : "NIFTY";
    let lotSize = symbolName.includes("BANK") ? lotSize_BankNifty : symbolName.includes("FIN") ? lotSize_FinNifty : lotSize_Nifty;

    let finalLot = lots/lotSize;
    let optionData = [];
    for(let i =1; i<= finalLot; i++){
        optionData.push( <MenuItem value={i * lotSize}>{ i * lotSize}</MenuItem>)      
    }
    const handleClick = (event) => {
        console.log("in open")
        setAnchorEl(event.currentTarget);
      };

    const handleClose = () => {
        console.log("in close")
        setAnchorEl(null);
    };

    const stopLoss = (e) => {
      // setModifyData(prev => {...prev, prev.stopLossPrice: e.target.value})
    };

    const stopProfit = () => {
        
    };

    const handleRadioChange = (event) => {
      setSelectedValue(event.target.value);
    };
    
    const controlProps = (item) => ({
      checked: selectedValue === item,
      onChange: handleRadioChange,
      value: item,
      name: 'size-radio-button-demo',
      inputProps: { 'aria-label': item },
    });
    


  return (
    <div>
      <MDBox onClick={handleClick}>
        <EditIcon sx={{ mr: 2 }} /> Modify Order
      </MDBox>
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title">
          <DialogTitle id="responsive-dialog-title" sx={{ textAlign: 'center', display: "flex", justifyContent: "space-between" }}>
            <Box >
              &nbsp; &nbsp; &nbsp; &nbsp;
            </Box>

            <Box sx={{fontSize: "17px"}} >
              Modify Order
            </Box>

            <Box sx={{color: "#FFFFFF", backgroundColor: "#FB8C00", fontWeight: 600, borderRadius: "5px", fontSize: "11px", textAlign: "center", padding: "2px", paddingTop: "7px" }}>
              {index}
            </Box>
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "300px" }}>
              <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between"  }}>
                <Box sx={{color: "#FFFFFF", backgroundColor: "#1A72E5", fontWeight: 600, padding: "5px", borderRadius: "5px", fontSize: "11px" }}>
                  <Box>
                  {`Symbol : ${(symbolName)?.slice(-7)}`}
                  </Box>
                  <Box>
                  {`Open Lots : ${lots}`}
                  </Box>
                </Box> 
                
                <Box sx={{color: "#FFFFFF", backgroundColor: change.includes("-") ? "#FF0000" : "#00D100", fontWeight: 600, padding: "5px", borderRadius: "5px", fontSize: "11px" }}>
                  <Box>
                  {`LTP : ${ltp}`}
                  </Box>
                  <Box>
                  {`Change : ${change}`}
                  </Box>
                </Box>

              </Box>
              <Box 
              sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
              >
                <FormControl variant="outlined"
                 sx={{ minWidth: 100, marginTop: 1 }} mt={1}
                 >
                  <InputLabel id="outlined-select-currency" sx={{fontSize: "13px"}}>Quantity</InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="outlined-select-currency"
                    label={<Typography >Quantity</Typography> }
                    // onChange={(e) => { { buyFormDetails.Quantity = (e.target.value) } }}
                    sx={{ 
                       minHeight: 43 }}
                  >
                    {optionData.map((elem)=>{
                        return(
                          <MenuItem value={elem.props.value}>
                            {elem.props.children}
                          </MenuItem>
                        )
                    })}
                  </Select>
                </FormControl>

                <TextField
                 id="outlined-basic" variant="outlined"
                  label={<Typography sx={{fontSize: "12px"}} >SL Price</Typography> } 
                  onChange={(e) => { { stopLoss(e) } }}
                  sx={{ margin: 1, 
                    width: "100px", 
                  }} 
                  type="number" />

                <TextField
                  id="outlined-basic" label={<Typography sx={{fontSize: "12px"}} >SP Price</Typography> }
                  variant="outlined" onChange={(e) => { { stopProfit(e) } }}
                  sx={{ 
                    marginTop: 1,
                    //  padding: 1, 
                    width: "100px" 
                  }}
                  type="number" />

              </Box>

              {/* <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: "10px" }}>
                      <Typography fontSize={15} color={"error"}> {buyFormDetails.stopLossPrice && errorMessageStopLoss && errorMessageStopLoss}</Typography>
                      <Typography fontSize={15} color={"error"}>{buyFormDetails.stopProfitPrice && errorMessageStopProfit && errorMessageStopProfit}</Typography>
                  </Box> */}

              <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginLeft: "-9px" }}>
                <Checkbox {...controlProps('a')} size='small' />
                <Typography sx={{ fontSize: "11px", display: "flex" }} >SL/SP-M</Typography>
              </Box>

              <Typography fontSize={12} mt={1} color={"black"}>
                <b>Note:</b> After modifying this order, all existing pending stop loss orders will be cancelled.
              </Typography>

            </DialogContentText>
          </DialogContent>
          <DialogActions>
          <MDButton variant="contained" color="error" onClick={handleClose} autoFocus sx={{fontSize: "10px"}}>
              CANCEL
            </MDButton>
            <MDButton
              // disabled={(buyFormDetails.stopLossPrice && (ltp < buyFormDetails.stopLossPrice)) || (buyFormDetails.stopProfitPrice && (ltp > buyFormDetails.stopProfitPrice))} 
              autoFocus variant="contained" color="warning" onClick={handleClose} sx={{fontSize: "10px"}}>
              MODIFY
            </MDButton>

          </DialogActions>
        </Dialog>
      </div >
      {/* {renderSuccessSB} */}
    </div >
  );

}
export default memo(ModifyPopUp);