import * as React from 'react';
import {useContext, useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import { Document, Page } from 'react-pdf';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton"
import axios from "axios";
import { CircularProgress } from "@mui/material";
import MDSnackbar from "../../components/MDSnackbar";
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

const ITEM_HEIGHT = 30;
const ITEM_PADDING_TOP = 10;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      maxWidth: "100%",
    },
  },
};


function Index() {

    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const location = useLocation();
    const  id  = location?.state?.data;
    console.log("Broker Report:",id)
    let [photo,setPhoto] = useState(id ? id?.document : '')
    const [pdfFile, setPDFFile] = useState(id ? id?.document : '');
    const [previewUrl, setPreviewUrl] = useState('');
    const [brokerReport,setBrokerReport] = useState([]);
    const [isSubmitted,setIsSubmitted] = useState(false);
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [isLoading,setIsLoading] = useState(id ? true : false)
    const [editing,setEditing] = useState(id ? false : true)
    const [saving,setSaving] = useState(false)
    const [creating,setCreating] = useState(false)
    const [pnlDetails, setPnlDetails] = useState({});
    const navigate = useNavigate();
    const [formState,setFormState] = useState({
        printDate: dayjs(id?.printDate) ?? dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0),
        brokerName:'' || id?.brokerName,
        clientCode:'' || id?.clientCode,
        fromDate: dayjs(id?.fromDate) ?? dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0),
        toDate: dayjs(id?.toDate) ?? dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0),
        document:'' || id?.document,
        cummulativeNSETurnover:'' || id?.cummulativeNSETurnover,
        cummulativeBSETurnover: '' || id?.cummulativeBSETurnover,
        cummulativeNSEFuturesTurnover: '' || id?.cummulativeNSEFuturesTurnover,
        cummulativeOptionsTurnover: '' || id?.cummulativeOptionsTurnover,
        cummulativeTotalPurchaseTurnover: '' || id?.cummulativeTotalPurchaseTurnover,
        cummulativeTotalSaleTurnover: '' || id?.cummulativeTotalSaleTurnover,
        cummulativeTransactionCharge: '' || id?.cummulativeTransactionCharge,
        cummulativeGrossPNL: '' || id?.cummulativeGrossPNL,
        cummulativeNetPNL: '' || id?.cummulativeNetPNL,
        cummulativeInterestCharge: '' || id?.cummulativeInterestCharge,
        cummulativeLotCharge: '' || id?.cummulativeLotCharge,
        cummulativeIDCharge: '' || id?.cummulativeIDCharge,
    });
    console.log("Initial FormState:", formState)

    useEffect(()=>{
      setTimeout(()=>{
          id && setBrokerReport(id)
          getPnlDetails(dayjs(id?.printDate))
          setIsLoading(false);
          console.log("Initial Form Data: ", formState);
      },500)
    },[id,isSubmitted])

    async function onSubmit(e,data){
        e.preventDefault();
        setCreating(true)
        console.log("Form Data: ",data)
        try{
          const formData = new FormData();
          Object.keys(data).forEach((key) => {
            console.log("data to be appended")
            formData.append(key, data[key])
            console.log("data appended",formData)
            console.log("formState",formState)
          });
          
            if(
              !formState.printDate || 
              !formState.brokerName || 
              !formState.clientCode || 
              !formState.fromDate ||
              !formState.toDate || 
              !formState.document || 
              !formState.cummulativeNSETurnover ||
              !formState.cummulativeBSETurnover || 
              !formState.cummulativeNSEFuturesTurnover || 
              !formState.cummulativeOptionsTurnover ||
              !formState.cummulativeTotalPurchaseTurnover ||
              !formState.cummulativeTotalSaleTurnover ||
              !formState.cummulativeTransactionCharge ||
              !formState.cummulativeGrossPNL ||
              !formState.cummulativeNetPNL ||
              !formState.cummulativeInterestCharge ||
              !formState.cummulativeLotCharge ||
              !formState.cummulativeIDCharge
              ) 
            {
              setCreating(false);
              return openErrorSB("Error","Please fill the mandatory fields.")
            }
          console.log("Calling API")
          const res = await fetch(`${baseUrl}api/v1/brokerreport`, {
  
            method: "POST",
            credentials:"include",
            headers: {
                // "content-type" : "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: formData 
          });

          let data1 = await res.json()
          console.log("Response:",data1)
          if (data1.data) {
            openSuccessSB("Success", data1.message)
            setIsSubmitted(true)
            setTimeout(() => { setCreating(false); setIsSubmitted(true); setEditing(false) }, 500)
          } else {
            setTimeout(() => { setCreating(false); setIsSubmitted(false); setEditing(false) }, 500)
          }
          }catch(e){
            console.log(e);
          }
    }

    async function onEdit(e, data) {
      e.preventDefault();
      console.log("Form Data: ", formState);
      setSaving(true);

      try {
        const formData1 = new FormData();
        Object.keys(data).forEach((key) => {
          formData1.append(key, data[key]);
        });

        if(
          !formState.printDate || 
          !formState.brokerName || 
          !formState.clientCode || 
          !formState.fromDate ||
          !formState.toDate || 
          !formState.document || 
          formState.cummulativeNSETurnover === '' ||
          formState.cummulativeBSETurnover === '' || 
          formState.cummulativeNSEFuturesTurnover === '' || 
          formState.cummulativeOptionsTurnover === '' ||
          formState.cummulativeTotalPurchaseTurnover === '' ||
          formState.cummulativeTotalSaleTurnover === '' ||
          formState.cummulativeTransactionCharge === '' ||
          formState.cummulativeGrossPNL === '' ||
          formState.cummulativeNetPNL === '' ||
          formState.cummulativeInterestCharge === '' ||
          formState.cummulativeLotCharge === '' ||
          formState.cummulativeIDCharge === ''
          ) 
        {
          setSaving(false)
          return openErrorSB("Error", "Please upload the required fields.")
        }
          
        setTimeout(() => { setIsSubmitted(true); }, 500);
    
        const res = await fetch(`${baseUrl}api/v1/brokerreport/${id?._id}`, {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Access-Control-Allow-Credentials": true,
          },
          body: formData1
        });
    
        const response = await res.json();
        const updatedData = response?.data;
        if (updatedData) {
          openSuccessSB("Report Edited", response.message);
          setTimeout(() => { setSaving(false); setEditing(false); }, 500);
        } else {
          openErrorSB("Error", "data.error");
        }
      } catch(e) {
        console.log(e);
      }
    }

    const handlePdfLoad = (event) => {
      const file = event.target.files[0];
      setPDFFile(file);
  
      // Create a FileReader instance
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    };

    const getPnlDetails = async (e)=>{
      console.log('ee hai',e.toDate().toISOString().substr(0,10));
      const res = await axios.get(`${baseUrl}api/v1/infinityTrade/live/companypnlreport/${e.toDate().toISOString().substr(0,10)}/${e.toDate().toISOString().substr(0,10)}`);
      if(res.data.data[0]){
        setPnlDetails(res.data.data[0]);
      }else{
        setPnlDetails({});
      }
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

    console.log("Saving: ",saving)
    console.log("Editing: ",editing)
    console.log("Loading: ",isLoading)
    // console.log("Id:",id)

    return (
    <>
    {isLoading ? (
        <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
        <CircularProgress color="info" />
        </MDBox>
    )
        :
      ( 
        <MDBox pl={2} pr={2} mt={4}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
          Fill Report Details
        </MDTypography>
        </MDBox>

        <Grid container display="flex" flexDirection="row" justifyContent="space-between">
            <Grid container spacing={1} mt={0.5} mb={0} xs={12} md={9} xl={12}>
                
                {/* <Grid item xs={12} md={6} xl={3}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['MobileDateTimePicker']}>
                        <DemoItem>
                          <MobileDateTimePicker 
                            label="Print Date"
                            disabled={((isSubmitted || id) && (!editing || saving))}
                            value={formState?.printDate || brokerReport?.printDate}
                            onChange={(e) => {
                              setFormState(prevState => ({
                                ...prevState,
                                printDate: dayjs(e)
                              }));
                              await getPnlDetails(e)
                            }}
                            minDateTime={null}
                            sx={{ width: '100%' }}
                          />
                        </DemoItem>
                      </DemoContainer>
                    </LocalizationProvider>
                </Grid> */}

                <Grid item xs={12} md={6} xl={3}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker
                        label="Print Date *"
                        disabled={((isSubmitted || id) && (!editing || saving))}
                        value={formState?.printDate || brokerReport?.printDate}
                        onChange={ async (e) => {
                          setFormState(prevState => ({
                            ...prevState,
                            printDate: dayjs(e)
                          }));
                          await getPnlDetails(e)
                        }}
                        sx={{ width: '100%' }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={6} xl={3} mt={1}>
                  <TextField
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      id="outlined-required"
                      label='Broker Name *'
                      fullWidth
                      defaultValue={formState?.brokerName || brokerReport?.brokerName}
                      onChange={(e) => {setFormState(prevState => ({
                          ...prevState,
                          brokerName: e.target.value
                        }))}}
                    />
                </Grid>

                <Grid item xs={12} md={6} xl={3} mt={1}>
                  <TextField
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      id="outlined-required"
                      label='Client Code *'
                      fullWidth
                      value={formState?.clientCode}
                      onChange={(e) => {setFormState(prevState => ({
                          ...prevState,
                          clientCode: e.target.value
                        }))}}
                    />
                </Grid>

                <Grid item xs={12} md={6} xl={3}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker
                        label="From Date *"
                        disabled={((isSubmitted || id) && (!editing || saving))}
                        value={formState?.fromDate || brokerReport?.fromDate}
                        onChange={(e) => {
                          setFormState(prevState => ({
                            ...prevState,
                            fromDate: dayjs(e)
                          }))
                        }}
                        sx={{ width: '100%' }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={6} xl={3}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker
                        label="To Date *"
                        disabled={((isSubmitted || id) && (!editing || saving))}
                        value={formState?.toDate || brokerReport?.toDate}
                        onChange={(e) => {
                          setFormState(prevState => ({
                            ...prevState,
                            toDate: dayjs(e)
                          }))
                        }}
                        sx={{ width: '100%' }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={6} xl={3} mt={1}>
                  <TextField
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      id="outlined-required"
                      label='Cum. NSE Turn *'
                      fullWidth
                      type="number"
                      value={formState?.cummulativeNSETurnover}
                      onChange={(e) => {setFormState(prevState => ({
                          ...prevState,
                          cummulativeNSETurnover: e.target.value
                        }))}}
                    />
                </Grid>

                <Grid item xs={12} md={6} xl={3} mt={1}>
                  <TextField
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      id="outlined-required"
                      label='Cum. BSE Turn *'
                      fullWidth
                      type="number"
                      value={formState?.cummulativeBSETurnover}
                      onChange={(e) => {setFormState(prevState => ({
                          ...prevState,
                          cummulativeBSETurnover: e.target.value
                        }))}}
                    />
                </Grid>

                <Grid item xs={12} md={6} xl={3} mt={1}>
                  <TextField
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      id="outlined-required"
                      label='Cum. NSE FUT Turn *'
                      fullWidth
                      type="number"
                      value={formState?.cummulativeNSEFuturesTurnover}
                      onChange={(e) => {setFormState(prevState => ({
                          ...prevState,
                          cummulativeNSEFuturesTurnover: e.target.value
                        }))}}
                    />
                </Grid>

                <Grid item xs={12} md={6} xl={3} mt={1}>
                  <TextField
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      id="outlined-required"
                      label='Cum. OPT Turn *'
                      fullWidth
                      type="number"
                      value={formState?.cummulativeOptionsTurnover}
                      onChange={(e) => {setFormState(prevState => ({
                          ...prevState,
                          cummulativeOptionsTurnover: e.target.value
                        }))}}
                    />
                </Grid>

                <Grid item xs={12} md={6} xl={3} mt={1}>
                  <TextField
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      id="outlined-required"
                      label='Cum. Pur Turn *'
                      fullWidth
                      type="number"
                      value={formState?.cummulativeTotalPurchaseTurnover}
                      onChange={(e) => {setFormState(prevState => ({
                          ...prevState,
                          cummulativeTotalPurchaseTurnover: e.target.value
                        }))}}
                    />
                </Grid>

                <Grid item xs={12} md={6} xl={3} mt={1}>
                  <TextField
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      id="outlined-required"
                      label='Cum. Sale Turn *'
                      fullWidth
                      type="number"
                      value={formState?.cummulativeTotalSaleTurnover}
                      onChange={(e) => {setFormState(prevState => ({
                          ...prevState,
                          cummulativeTotalSaleTurnover: e.target.value
                        }))}}
                    />
                </Grid>

                <Grid item xs={12} md={6} xl={3} mt={1}>
                  <TextField
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      id="outlined-required"
                      label='Cum. Trans. Chg *'
                      fullWidth
                      type="number"
                      value={formState?.cummulativeTransactionCharge}
                      onChange={(e) => {setFormState(prevState => ({
                          ...prevState,
                          cummulativeTransactionCharge: e.target.value
                        }))}}
                    />
                </Grid>

                <Grid item xs={12} md={6} xl={3} mt={1}>
                  <TextField
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      id="outlined-required"
                      label='Cum. Gross P/L *'
                      fullWidth
                      type="number"
                      value={formState?.cummulativeGrossPNL}
                      onChange={(e) => {setFormState(prevState => ({
                          ...prevState,
                          cummulativeGrossPNL: e.target.value
                        }))}}
                    />
                </Grid>

                <Grid item xs={12} md={6} xl={3} mt={1}>
                  <TextField
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      id="outlined-required"
                      label='Cum. Net P/L *'
                      fullWidth
                      type="number"
                      value={formState?.cummulativeNetPNL}
                      onChange={(e) => {setFormState(prevState => ({
                          ...prevState,
                          cummulativeNetPNL: e.target.value
                        }))}}
                    />
                </Grid>

                <Grid item xs={12} md={6} xl={3} mt={1}>
                  <TextField
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      id="outlined-required"
                      label='Cum. Interest Chg *'
                      fullWidth
                      type="number"
                      value={formState?.cummulativeInterestCharge}
                      onChange={(e) => {setFormState(prevState => ({
                          ...prevState,
                          cummulativeInterestCharge: e.target.value
                        }))}}
                    />
                </Grid>

                <Grid item xs={12} md={6} xl={3} mt={1}>
                  <TextField
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      id="outlined-required"
                      label='Cum. Lot Chg *'
                      fullWidth
                      type="number"
                      value={formState?.cummulativeLotCharge}
                      onChange={(e) => {setFormState(prevState => ({
                          ...prevState,
                          cummulativeLotCharge: e.target.value
                        }))}}
                    />
                </Grid>

                <Grid item xs={12} md={6} xl={3} mt={1}>
                  <TextField
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      id="outlined-required"
                      label='Cum. ID Chg *'
                      fullWidth
                      type="number"
                      value={formState?.cummulativeIDCharge}
                      onChange={(e) => {setFormState(prevState => ({
                          ...prevState,
                          cummulativeIDCharge: e.target.value
                        }))}}
                    />
                </Grid>

                <Grid item xs={12} md={6} xl={3} mt={1}>
                    <MDButton variant="outlined" style={{fontSize:10}} fullWidth color="success" component="label">
                      {!formState?.document?.name ? "Upload Report PDF" : "Upload Another File?"}
                      <input 
                      hidden 
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      accept="application/pdf" 
                      type="file" 
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          document: e.target.files[0]
                        }));
                        handlePdfLoad(e);
                      }}
                      />
                    </MDButton>
                </Grid>

                <Grid item xs={12} md={6} xl={3} mt={.75} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <TextField
                          disabled
                          id="outlined-required"
                          fullWidth
                          value={id ? id?.document.split("/")[6]  : (formState?.document?.name ? formState?.document?.name : "No File Uploaded")}
                      />
                </Grid>
                
            </Grid>

            {/* <Grid container spacing={1} mt={0.5} mb={0} xs={12} md={3} xl={3}>
            <Grid item xs={12} md={6} lg={12}>
              {previewUrl ? (
                <Document file={previewUrl} onLoadSuccess={handlePdfLoad}>
                  <Page pageNumber={1} width={250} />
                </Document>
              ) : (
                <img
                  src={pdfFile}
                  style={{ height: '250px', width: '250px', borderRadius: '5px', border: '1px #ced4da solid' }}
                />
              )}
            </Grid>
            </Grid> */}
        </Grid>

         <Grid container mt={2} xs={12} md={12} xl={12} >
            <Grid item display="flex" justifyContent="flex-end" xs={12} md={6} xl={12}>
                    {!isSubmitted && !id && (
                    <>
                    <MDButton 
                        variant="contained" 
                        color="success" 
                        size="small" 
                        sx={{mr:1, ml:2}} 
                        disabled={creating} 
                        onClick={(e)=>{onSubmit(e,formState)}}
                        >
                        {creating ? <CircularProgress size={20} color="inherit" /> : "Save"}
                    </MDButton>
                    <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={()=>{navigate("/brokerreports")}}>
                        Cancel
                    </MDButton>
                    </>
                    )}
                    {(isSubmitted || id) && !editing && (
                      <>
                    <MDButton variant="contained" color="warning" size="small" sx={{mr:1, ml:2}} onClick={()=>{setEditing(true)}}>
                        Edit
                    </MDButton>
                    <MDButton variant="contained" color="info" size="small" onClick={()=>{id ? navigate("/brokerreports") : setIsSubmitted(false)}}>
                        Back
                    </MDButton>
                    </>
                    )}
                    {(isSubmitted || id) && editing && (
                      <>
                    <MDButton 
                        variant="contained" 
                        color="warning" 
                        size="small" 
                        sx={{mr:1, ml:2}} 
                        disabled={saving} 
                        onClick={(e)=>{onEdit(e,formState)}}
                        >
                        {saving ? <CircularProgress size={20} color="inherit" /> : "Save"}
                    </MDButton>
                    <MDButton 
                        variant="contained" 
                        color="error" 
                        size="small" 
                        disabled={saving} 
                        onClick={()=>{setEditing(false)}}
                        >
                        Cancel
                    </MDButton>
                    {/* <MDTypography>P&L for the print date(StoxHero)</MDTypography> */}
                    </>
                    )}
            </Grid>
         </Grid>
        {Object.keys(pnlDetails).length>0 && 
        <MDBox>
          <MDTypography>P&L for the print date(StoxHero){formState?.printDate?.toISOString()?.substr(0,10)}</MDTypography>
          <MDTypography>GPNL:{pnlDetails?.gpnl}</MDTypography>
          <MDTypography>NPNL:{pnlDetails?.gpnl}</MDTypography>
          <MDTypography>Brokerage:{pnlDetails?.gpnl}</MDTypography>
        </MDBox>}
          {renderSuccessSB}
          {renderErrorSB}
    </MDBox>
    )
                }
    </>
    )
}
export default Index;