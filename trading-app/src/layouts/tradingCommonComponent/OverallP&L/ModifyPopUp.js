import React, { useContext, useState, memo, useEffect } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import MDButton from '../../../components/MDButton';
import { Box, Checkbox, TextField, Typography } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { maxLot_BankNifty, maxLot_Nifty, maxLot_FinNifty, lotSize_BankNifty, lotSize_FinNifty, lotSize_Nifty, paperTrader } from "../../../variables";
import EditIcon from '@mui/icons-material/Edit';
import MDBox from '../../../components/MDBox';
import { renderContext } from '../../../renderContext';
import { userContext } from '../../../AuthContext';
import { apiUrl } from '../../../constants/constants';
import MDSnackbar from '../../../components/MDSnackbar';
import { NetPnlContext } from '../../../PnlContext';

function ModifyPopUp({ data, id, handleCloseMenu, setMsg, from }) {

  const lots = Math.abs(data?.Quantity?.props?.children);
  const symbolName = data?.symbol?.props?.children;
  const ltp = data?.last_price?.props?.children;
  const newLtp = parseFloat(ltp.slice(1))
  const change = data?.change?.props?.children;
  const type = data?.Quantity?.props?.children > 0 ? "BUY" : "SELL"
  const { pendingOrderQuantity } = useContext(NetPnlContext);

  const [errorMessageStopLoss, setErrorMessageStopLoss] = useState("");
  const [errorMessageStopProfit, setErrorMessageStopProfit] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedValue, setSelectedValue] = React.useState('a');
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { render, setRender } = useContext(renderContext);
  const getDetails = React.useContext(userContext);
  const tradeSound = getDetails.tradeSound;

  const [modifyData, setModifyData] = useState({
    stopLossQuantity: 0,
    stopProfitQuantity: 0,
    stopLossPrice: "",
    stopProfitPrice: ""
  });
  let index = symbolName.includes("BANK") ? "BANKNIFTY" : symbolName.includes("FIN") ? 'FINNIFTY' : "NIFTY";
  let lotSize = symbolName.includes("BANK") ? lotSize_BankNifty : symbolName.includes("FIN") ? lotSize_FinNifty : lotSize_Nifty;
  let maxLot = symbolName.includes("BANK") ? maxLot_BankNifty : symbolName.includes("FIN") ? maxLot_FinNifty : maxLot_Nifty;

  const instrumentsPendingOrder = pendingOrderQuantity.filter((elem)=>{
    return elem.symbol === symbolName;
  })
  const slPendingQuantity = instrumentsPendingOrder?.reduce((acc, item) => {
    return item.type === "StopLoss" ? acc + item.quantity : acc;
  }, 0);


  const spPendingQuantity = instrumentsPendingOrder?.reduce((acc, item) => {
    return item.type === "StopProfit" ? acc + item.quantity : acc;
  }, 0)

  // console.log("slPendingQuantity", lots-slPendingQuantity, lots-spPendingQuantity)

  id = from === paperTrader ? "6433e2e5500dc2f2d20d686d" : id;

  let finalLotSL = Math.abs((lots - slPendingQuantity) > maxLot ? maxLot : (lots - slPendingQuantity)) / lotSize;
  let optionDataSL = [];
  for (let i = 1; i <= finalLotSL; i++) {
    optionDataSL.push(<MenuItem value={i * lotSize}>{i * lotSize}</MenuItem>)
  }

  let finalLotSP = Math.abs((lots - spPendingQuantity) > maxLot ? maxLot : (lots - spPendingQuantity)) / lotSize;
  let optionDataSP = [];
  for (let i = 1; i <= finalLotSP; i++) {
    optionDataSP.push(<MenuItem value={i * lotSize}>{i * lotSize}</MenuItem>)
  }

  const handleClick = (event) => {
    if (data?.Quantity?.props?.children === 0) {
      return openSuccessSB("error", "You do not have any open position for modify.")
    }

    window.webengage.track('modify_order_clicked', {
      user: getDetails?.userDetails?._id,
      instrument_token: data?.instrumentToken?.props?.children,
    })
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const stopLoss = (e) => {
    setErrorMessageStopLoss("")
    if (type === "BUY") {
      if (Number(newLtp) < Number(e.target.value)) {//errorMessage
        const text = "Stop Loss price should be less then LTP.";
        setErrorMessageStopLoss(text)
      }
    } else {
      if (Number(newLtp) > Number(e.target.value)) {//errorMessage
        const text = "Stop Loss price should be greater then LTP.";
        setErrorMessageStopLoss(text)
      }
    }

    setModifyData(prev => ({ ...prev, stopLossPrice: e.target.value }))
  };

  const stopProfit = (e) => {
    setErrorMessageStopProfit("")
    if (type === "BUY") {
      if (Number(newLtp) > Number(e.target.value)) {
        setErrorMessageStopProfit("Stop Profit price should be greater then LTP.")
      }
    } else {
      if (Number(newLtp) < Number(e.target.value)) {
        setErrorMessageStopProfit("Stop Profit price should be less then LTP.")
      }
    }
    setModifyData(prev => ({ ...prev, stopProfitPrice: e.target.value }))
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

  const modifyOrder = async () => {
    const { stopLossQuantity, stopProfitQuantity, stopLossPrice, stopProfitPrice } = modifyData;
    // console.log(modifyData)
    if (!stopLossQuantity && !stopLossPrice && !stopProfitQuantity && !stopProfitPrice) {
      openSuccessSB('error', `Please select quantity or price.`);
      return;
    }

    // if ((!stopProfitQuantity && !stopProfitPrice) || (!stopLossQuantity || !stopLossPrice)) {
    //   openSuccessSB('error', "Please select stop profit quantity or price.");
    //   return;
    // }

    if (((stopLossQuantity && !stopLossPrice) || (!stopLossQuantity && stopLossPrice))
    || (stopProfitQuantity && !stopProfitPrice) || (!stopProfitQuantity && stopProfitPrice)
    ) {
      openSuccessSB('error', `Please select quantity or price.`);
      return;
    }
    
    window.webengage.track('modify_process_order_clicked', {
      user: getDetails?.userDetails?._id,
      instrument_token: data?.instrumentToken?.props?.children,
      exchange: data?.exchange?.props?.children,
      stopLossQuantity, stopProfitQuantity, stopLossPrice, stopProfitPrice
    })

    const res = await fetch(`${apiUrl}pendingorder/modify`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        exchange: data?.exchange?.props?.children, symbol: data?.symbol?.props?.children,
        buyOrSell: type, id: id, Product: data?.Product?.props?.children,
        order_type: "SL/SP-M", stopProfitPrice, stopLossPrice, stopLossQuantity, stopProfitQuantity,
        exchangeInstrumentToken: data?.exchangeInstrumentToken?.props?.children,
        validity: data?.validity?.props?.children, variety: data?.variety?.props?.children,
        instrumentToken: data?.instrumentToken?.props?.children, last_price: data?.last_price?.props?.children,
        from
        // Quantity: stopLossQuantity

      })
    });
    const dataResp = await res.json();
    if (dataResp.status === 422 || dataResp.error || !dataResp) {
      setMsg(prev => ({ ...prev, error: dataResp.error }))
      // openSuccessSB('error', dataResp.error)
    } else {
      tradeSound.play();
      setMsg(prev => ({ ...prev, success: dataResp.message }))
      // openSuccessSB(dataResp.status, dataResp.message)
    }
    setModifyData({});
    render ? setRender(false) : setRender(true)
    handleClose();
    handleCloseMenu();
  }

  const [messageObj, setMessageObj] = useState({
    color: '',
    icon: '',
    title: '',
    content: ''
  })
  const [successSB, setSuccessSB] = useState(false);

  const openSuccessSB = (value, content) => {
    if (value === "Success") {
      messageObj.color = 'success'
      messageObj.icon = 'check'
      messageObj.title = "Successful";
      messageObj.content = content;
      setSuccessSB(true);
    };
    if (value === "error") {
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
      color={messageObj.color}
      icon={messageObj.icon}
      title={messageObj.title}
      content={messageObj.content}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
      sx={{ borderLeft: `10px solid ${messageObj.icon == 'check' ? "green" : "red"}`, borderRight: `10px solid ${messageObj.icon == 'check' ? "green" : "red"}`, borderRadius: "15px", width: "auto" }}
    />
  );

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
            <Box sx={{ color: "#FFFFFF", backgroundColor: "#FB8C00", fontWeight: 600, borderRadius: "5px", fontSize: "11px", textAlign: "center", padding: "2px", paddingTop: "7px" }}>
              {index}
            </Box>

            <Box sx={{ fontSize: "17px" }} >
              Modify Order
            </Box>

            <Box sx={{ color: "#FFFFFF", backgroundColor: "#FB8C00", fontWeight: 600, borderRadius: "5px", fontSize: "11px", textAlign: "center", padding: "2px", paddingTop: "7px" }}>
              {type}
            </Box>
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "300px" }}>
              <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", }} mb={1}>
                <Box sx={{ color: "#FFFFFF", backgroundColor: "#1A72E5", fontWeight: 600, padding: "5px", borderRadius: "5px", fontSize: "11px" }}>
                  <Box>
                    {`Symbol : ${(symbolName)?.slice(-7)}`}
                  </Box>
                  <Box>
                    {`Open Lots : ${lots}`}
                  </Box>
                </Box>

                <Box sx={{ color: "#FFFFFF", backgroundColor: change.includes("-") ? "#FF0000" : "#00D100", fontWeight: 600, padding: "5px", borderRadius: "5px", fontSize: "11px" }}>
                  <Box>
                    {`LTP : ${ltp}`}
                  </Box>
                  <Box>
                    {`Change : ${change}`}
                  </Box>
                </Box>

              </Box>
              <Box
                sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", gap: "5px" }}
              >
                <FormControl variant="outlined"
                  sx={{ minWidth: 150, marginTop: 1 }} mt={1}
                >
                  <InputLabel id="outlined-select-currency" sx={{ fontSize: "13px" }}>SL Quantity</InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="outlined-select-currency"
                    label={<Typography >SL Quantity</Typography>}
                    onChange={(e) => { setModifyData(prev => ({ ...prev, stopLossQuantity: e.target.value })) }}
                    sx={{ minHeight: 43 }}
                    disabled={!Math.abs(lots - slPendingQuantity)}
                  >
                    {optionDataSL.map((elem) => {
                      return (
                        <MenuItem value={elem.props.value}>
                          {elem.props.children}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>

                <TextField
                  id="outlined-basic" variant="outlined"
                  label={<Typography sx={{ fontSize: "12px" }} >SL Price</Typography>}
                  onChange={(e) => { { stopLoss(e) } }}
                  value={Math.abs(modifyData?.stopLossPrice)===0 ? "" : Math.abs(modifyData?.stopLossPrice)}
                  disabled={!Math.abs(lots - slPendingQuantity)}
                  sx={{
                    marginTop: 1,
                    width: "150px",
                  }}
                  type="number" />
              </Box>


              <Box
                sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", gap: "5px" }}
              >
                <FormControl variant="outlined"
                  sx={{ minWidth: 150, marginTop: 1 }} mt={1}
                >
                  <InputLabel id="outlined-select-currency" sx={{ fontSize: "13px" }}>SP Quantity</InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="outlined-select-currency"
                    label={<Typography >SP Quantity</Typography>}
                    onChange={(e) => { setModifyData(prev => ({ ...prev, stopProfitQuantity: e.target.value })) }}
                    sx={{ minHeight: 43 }}
                    disabled={!Math.abs(lots - spPendingQuantity)}
                  >
                    {optionDataSP.map((elem) => {
                      return (
                        <MenuItem value={elem.props.value}>
                          {elem.props.children}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>

                <TextField
                  id="outlined-basic" label={<Typography sx={{ fontSize: "12px" }} >SP Price</Typography>}
                  variant="outlined" onChange={(e) => { { stopProfit(e) } }}
                  disabled={!Math.abs(lots - spPendingQuantity)}
                  value={Math.abs(modifyData?.stopProfitPrice)===0 ? "" : Math.abs(modifyData?.stopProfitPrice)}
                  sx={{
                    marginTop: 1,
                    //  padding: 1, 
                    width: "150px"
                  }}
                  type="number" />

              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: "10px" }}>
                <Typography fontSize={13} color={"error"}> {modifyData.stopLossPrice && errorMessageStopLoss && errorMessageStopLoss}</Typography>
                <Typography fontSize={13} color={"error"}>{modifyData.stopProfitPrice && errorMessageStopProfit && errorMessageStopProfit}</Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginLeft: "-9px" }}>
                <Checkbox {...controlProps('a')} size='small' />
                <Typography sx={{ fontSize: "11px", display: "flex" }} >SL/SP-M</Typography>
              </Box>

{Math.abs(lots - slPendingQuantity)===0 && 
  <Typography fontSize={12} mt={1} color={"red"}>
 You can not modify stop loss order as you have already pending stop loss order.
</Typography>
}

{Math.abs(lots - spPendingQuantity)===0 && 
  <Typography fontSize={12} mt={1} color={"red"}>
 You can not modify stop profit order as you have already pending stop profit order.
</Typography>
}
            

            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <MDButton variant="contained" color="error" onClick={handleClose} autoFocus sx={{ fontSize: "10px" }}>
              CANCEL
            </MDButton>
            <MDButton
              disabled={
                type === "BUY" ?
                  (modifyData.stopLossPrice && (newLtp < modifyData.stopLossPrice)) || (modifyData.stopProfitPrice && (newLtp > modifyData.stopProfitPrice))
                  :
                  (modifyData.stopLossPrice && (newLtp > modifyData.stopLossPrice)) || (modifyData.stopProfitPrice && (newLtp < modifyData.stopProfitPrice))
              }
              autoFocus variant="contained" color="warning" onClick={modifyOrder} sx={{ fontSize: "10px" }}>
              MODIFY
            </MDButton>

          </DialogActions>
        </Dialog>
      </div >
      {renderSuccessSB}
    </div >
  );

}
export default memo(ModifyPopUp);