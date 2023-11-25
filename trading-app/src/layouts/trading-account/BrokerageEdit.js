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
import MDButton from '../../components/MDButton';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import { zerodhaAccountType, xtsAccountType} from '../../variables';



const BrokerageEdit = ({data, id, Render}) => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

  let date = new Date();
  // let lastModified = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`

//   const { reRender, setReRender } = Render;
  const [editData, setEditData] = useState(data);

  const [Name, setName] = useState();
  const [Transaction, setTransaction] = useState();
  const [Type, setType] = useState();
  const [Exchange, setExchange] = useState();
  const [BrokerageCharge, setBrokerageCharge] = useState();
  const [ExchangeCharge, setexchangeCharge] = useState();
  const [Gst, setgst] = useState();
  const [SebiCharge, setSebiCharge] = useState();
  const [StampDutyCharge, setstampDutyCharge] = useState();
  const [Sst, setsst] = useState();
  const [Ctt, setctt] = useState();
  const [DpCharge, setdpCharge] = useState();
  const [AccountType, setAccountType] = useState();
 
//   useEffect(() => {
//       let updatedData = data.filter((elem) => {
//           return elem._id === id
//       })
//       setEditData(updatedData)
//   }, [])
  console.log("edit",editData ,data)

  useEffect(() => {
      setName(editData?.brokerName)
      setTransaction(editData?.transaction);
      setType(editData?.type);
      setExchange(editData?.exchange);
      setBrokerageCharge(editData?.brokerageCharge)
      setexchangeCharge(editData?.exchangeCharge);
      setgst(editData?.gst);
      setSebiCharge(editData?.sebiCharge);
      setstampDutyCharge(editData?.stampDuty)
      setsst(editData?.sst);
      setctt(editData?.ctt);
      setdpCharge(editData?.dpCharge);
      setAccountType(editData?.accountType);

  }, [editData,])

  const [formstate, setformstate] = React.useState({
    name: "",
    transaction: "",
    type: "",
    exchange: "",
    brokerageCharge: "",
    exchangeCharge: "",
    gst: "",
    sebiCharge: "",
    stampDutyCharge: "",
    sst: "",
    ctt: "",
    dpCharge: "",
    accountType: ""
  });

  //console.log(formstate);


  async function formbtn() {

      formstate.name = Name;
      formstate.transaction = Transaction;
      formstate.type = Type;
      formstate.exchange = Exchange;
      formstate.brokerageCharge = BrokerageCharge;
      formstate.exchangeCharge = ExchangeCharge;
      formstate.gst = Gst;
      formstate.sebiCharge = SebiCharge;
      formstate.stampDutyCharge = StampDutyCharge;
      formstate.sst = Sst;
      formstate.ctt = Ctt;
      formstate.dpCharge = DpCharge;
      formstate.accountType = AccountType;
       
      setformstate(formstate);


      const {accountType, name, transaction, type, exchange, brokerageCharge, exchangeCharge, gst, sebiCharge, stampDutyCharge, sst, ctt, dpCharge} = formstate;
                                      
      const res = await fetch(`${baseUrl}api/v1/readBrokerage/${id}`, {
          method: "PUT",
          credentials: "include",
          headers: {
              "Accept": "application/json",
              "content-type": "application/json"
          },
          body: JSON.stringify({
            accountType, brokerName: name, transaction, type, exchange, brokerageCharge, exchangeCharge, gst, sebiCharge, stampDuty: stampDutyCharge, sst, ctt, dpCharge
        })
      });
      const dataResp = await res.json();
      //console.log(dataResp);
      if (dataResp.status === 422 || dataResp.error || !dataResp) {
          window.alert(dataResp.error);
          //console.log("Failed to Edit");
      } else {
          //console.log(dataResp);
          window.alert("Edit succesfull");
          //console.log("Edit succesfull");
      }
       
      setOpen(false);
    //   reRender ? setReRender(false) : setReRender(true)
  }

  async function Ondelete() {
      //console.log(editData)
      const res = await fetch(`${baseUrl}api/v1/readRequestToken/${id}`, {
          method: "DELETE",
          credentials: "include"
      });

      const dataResp = await res.json();
      //console.log(dataResp);
      if (dataResp.status === 422 || dataResp.error || !dataResp) {
          window.alert(dataResp.error);
          //console.log("Failed to Delete");
      } else {
          //console.log(dataResp);
          window.alert("Delete succesfull");
          //console.log("Delete succesfull");
      }

      setOpen(false);
    //   reRender ? setReRender(false) : setReRender(true)
  }




  return (
    <div>
      <MDButton variant="outlined" color="info" onClick={handleClickOpen}>
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
              id="outlined-basic" label="Broker" variant="standard"
              sx={{ margin: 1, padding: 1, width: "300px" }} value={Name} onChange={(e)=>{ setName(e.target.value)}}/>

            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">Transaction</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Transaction"
                sx={{ margin: 1, padding: 1, width: "300px" }}
                value={Transaction} onChange={(e)=>{ setTransaction(e.target.value)}}
              >
                <MenuItem value="BUY">BUY</MenuItem>
                <MenuItem value="SELL">SELL</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">Account Type</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Account Type"
                sx={{ margin: 1, padding: 1, width: "300px" }}
                value={AccountType} onChange={(e)=>{ setAccountType(e.target.value)}}
              >
                <MenuItem value={zerodhaAccountType}>ZERODHA</MenuItem>
                <MenuItem value={xtsAccountType}>XTS</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">Type</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Type"
                sx={{ margin: 1, padding: 1, width: "300px" }}
                value={Type} onChange={(e)=>{ setType(e.target.value)}}
              >
                <MenuItem value="Stocks">Stocks</MenuItem>
                <MenuItem value="Option">Option</MenuItem>
                <MenuItem value="Futures">Futures</MenuItem>
                <MenuItem value="Currency">Currency</MenuItem>
                <MenuItem value="Commodities">Commodities</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">Exchange</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Exchange"
                sx={{ margin: 1, padding: 1, width: "300px" }}
                value={Exchange} onChange={(e)=>{ setExchange(e.target.value)}}
              >
                <MenuItem value="NSE">NSE</MenuItem>
                <MenuItem value="BSE">BSE</MenuItem>
              </Select>
            </FormControl>

            <TextField
              id="outlined-basic" label="Brokerage Change" variant="standard" type="number"
              sx={{ margin: 1, padding: 1, width: "300px" }} value={BrokerageCharge} onChange={(e)=>{ setBrokerageCharge(e.target.value)}}/>

            <TextField
              id="outlined-basic" label="Exchange Charge" variant="standard" type="number"
              sx={{ margin: 1, padding: 1, width: "300px" }} value={ExchangeCharge} onChange={(e)=>{ setexchangeCharge(e.target.value)}} />

            <TextField
              id="outlined-basic" label="GST" variant="standard" type="number"
              sx={{ margin: 1, padding: 1, width: "300px" }} value={Gst} onChange={(e)=>{ setgst(e.target.value)}} />
            
            <TextField
              id="outlined-basic" label="SEBI Charges" variant="standard" type="number"
              sx={{ margin: 1, padding: 1, width: "300px" }} value={SebiCharge} onChange={(e)=>{ setSebiCharge(e.target.value)}} />

            <TextField
              id="outlined-basic" label="Stamp Duty Charges" variant="standard" type="number"
              sx={{ margin: 1, padding: 1, width: "300px" }} value={StampDutyCharge} onChange={(e)=>{ setstampDutyCharge(e.target.value)}} />

            <TextField
              id="outlined-basic" label="SST" variant="standard" type="number"
              sx={{ margin: 1, padding: 1, width: "300px" }} value={Sst} onChange={(e)=>{ setsst(e.target.value)}} />

            <TextField
              id="outlined-basic" label="CTT" variant="standard" type="number"
              sx={{ margin: 1, padding: 1, width: "300px" }} value={Ctt} onChange={(e)=>{ setctt(e.target.value)}} />

            <TextField
              id="outlined-basic" label="DP Charges" variant="standard" type="number"
              sx={{ margin: 1, padding: 1, width: "300px" }} value={DpCharge} onChange={(e)=>{ setdpCharge(e.target.value)}} />





          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={formbtn}>
            OK
          </Button>
          <Button onClick={Ondelete} autoFocus>
            DELETE
          </Button>
          <Button onClick={handleClose} autoFocus>
            CLOSE
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default BrokerageEdit