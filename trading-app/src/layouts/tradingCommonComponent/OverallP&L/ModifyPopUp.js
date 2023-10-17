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
import { Box, TextField } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { renderContext } from '../../../renderContext';
import { Howl } from "howler";
import sound from "../../../assets/sound/tradeSound.mp3"
import { marginX, paperTrader, infinityTrader, tenxTrader, internshipTrader, dailyContest, battle } from "../../../variables";
import EditIcon from '@mui/icons-material/Edit';
import MDBox from '../../../components/MDBox';


function ModifyPopUp() {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  

    const handleClick = (event) => {
        console.log("in open")
        setAnchorEl(event.currentTarget);
      };

    const handleClose = () => {
        console.log("in close")
        setAnchorEl(null);
    };

    const stopLoss = () => {
        
    };

    const stopProfit = () => {
        
    };


console.log("anchorEl, anchorEl", anchorEl, open)
    return (
        <div>
    
    <MDBox onClick={handleClick}>
    <EditIcon sx={{ mr: 2 }} /> Modify Order
    </MDBox>
          <div>
            <Dialog
            //   fullScreen={fullScreen}
              open={open}
              onClose={handleClose}
              aria-labelledby="responsive-dialog-title">
              <DialogTitle id="responsive-dialog-title" sx={{ textAlign: 'center' }}>
                {"Modify Order"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText sx={{ display: "flex", flexDirection: "column", marginLeft: 2 }}>
                  {/* <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", margin: 2 }}><Box sx={{ backgroundColor: "#ccccb3", fontWeight: 600, padding:"5px", borderRadius:"5px" }}>{symbolName}</Box> &nbsp; &nbsp; &nbsp; <Box sx={{ backgroundColor: "#ccccb3", fontWeight: 600, padding:"5px", borderRadius:"5px" }}>₹{ltp}</Box></Box> */}

    
                  <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120, }}>
                      <InputLabel id="demo-simple-select-standard-label">Quantity</InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        label="Quantity"
                        // onChange={(e) => { { buyFormDetails.Quantity = (e.target.value) } }}
                        sx={{ margin: 1, padding: 0.5, }}
                      >
                        {/* {optionData.map((elem)=>{
                            return(
                                <MenuItem value={elem.props.value}>
                                {elem.props.children}
                                </MenuItem>
                            )
                        }) 
                        } */}
                      </Select>
                    </FormControl>
        
                    <TextField
                      id="outlined-basic"  label="StopLoss Price" variant="standard" onChange={(e) => { { stopLoss(e) } }}
                      sx={{ margin: 1, padding: 1, width: "300px", marginRight: 1, marginLeft: 1 }} type="number" />
                   
                    <TextField
                      id="outlined-basic"  label="StopProfit Price" variant="standard" onChange={(e) => { { stopProfit(e) } }}
                      sx={{ margin: 1, padding: 1, width: "300px" }} type="number" />
                      
                  </Box>
    
                  {/* <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: "10px" }}>
                      <Typography fontSize={15} color={"error"}> {buyFormDetails.stopLossPrice && errorMessageStopLoss && errorMessageStopLoss}</Typography>
                      <Typography fontSize={15} color={"error"}>{buyFormDetails.stopProfitPrice && errorMessageStopProfit && errorMessageStopProfit}</Typography>
                  </Box> */}
    
                  <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
                    <FormControl  >
                      <FormLabel id="demo-controlled-radio-buttons-group" ></FormLabel>
                      <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        // value={market}
                        // onChange={marketHandleChange}
                        sx={{ display: "flex", flexDirection: "row" }}
                      >
                        {/* <FormControlLabel value="MARKET" control={<Radio />} label="MARKET" />
                        <FormControlLabel disabled="false" value="LIMIT" control={<Radio />} label="LIMIT" /> */}
                        <FormControlLabel disabled="false" value="SL/SP-M" control={<Radio />} label="SL/SP-M" />
    
                      </RadioGroup>
                    </FormControl>
    
                  </Box>

                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <MDButton 
                // disabled={(buyFormDetails.stopLossPrice && (ltp < buyFormDetails.stopLossPrice)) || (buyFormDetails.stopProfitPrice && (ltp > buyFormDetails.stopProfitPrice))} 
                autoFocus variant="contained" color="info" onClick={handleClose}>
                  MODIFY
                </MDButton>
                <MDButton variant="contained" color="info" onClick={handleClose} autoFocus>
                  Close
                </MDButton>
              </DialogActions>
            </Dialog>
          </div >
          {/* {renderSuccessSB} */}
        </div >
      );

}
export default memo(ModifyPopUp);
