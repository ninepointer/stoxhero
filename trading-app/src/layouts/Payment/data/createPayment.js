import React, {useState} from 'react';
import MDTypography from "../../../components/MDTypography";
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton"
import { CircularProgress, Grid, TextField } from '@mui/material';
// import {Link} from 'react-router-dom'
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import MDSnackbar from "../../../components/MDSnackbar";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
// import { IoMdAddCircle } from 'react-icons/io';
import OutlinedInput from '@mui/material/OutlinedInput';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// import FeatureData from './featureData';
// import TenXSubscriptionPurchaseIntent from './tenXSubscriptionPurchaseIntent'

const ITEM_HEIGHT = 30;
const ITEM_PADDING_TOP = 10;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function CreatePayment() {
const location = useLocation();
const navigate = useNavigate();
const  id  = location?.state?.data;
// const [purchaseIntentCount, setPurchaseIntentCount] = useState(0);
// const [tenXSubs,setTenXSubs] = useState([]);
// const [portfolios,setPortfolios] = useState([]);
const [isLoading,setIsLoading] = useState(id ? true : false)
// const [saving,setSaving] = useState(false)
// const [editing,setEditing] = useState(false)
const [isSubmitted,setIsSubmitted] = useState(false);
const [creating,setCreating] = useState(false);
const [subscriptionData, setSubscriptionData] = useState([]);
// const [updatedDocument, setUpdatedDocument] = useState([]);
const [userData,setUserData] = useState([])


let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

const [formState,setFormState] = useState({
    paymentTime:'',
    referenceNo:'',
    transactionId:'',
    amount: "",
    userId:'',
    subscriptionId:'',
    paymentMode:'',
    paymentStatus: ""
});

React.useEffect(()=>{
    axios.get(`${baseUrl}api/v1/allusersNameAndId`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
    })
    .then((res)=>{
    //   console.log("userdetail", res)
      setUserData(res?.data?.data);
    }).catch((err)=>{
        return new Error(err)
    })

    axios.get(`${baseUrl}api/v1/tenX/active`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        }
    })
    .then((res)=>{
        // console.log("userdetail 2", res)
      setSubscriptionData(res?.data?.data);
      setTimeout(()=>{
        setIsLoading(false)
      },500)
    //   setIsLoading(false).setTimeout(30000);
    }).catch((err)=>{
        return new Error(err)
    })
},[])

  async function onSubmit(e,formState){
    e.preventDefault()
    console.log(formState)
    if(!formState.paymentTime || !formState.referenceNo || !formState.transactionId || !formState.amount || !formState.userId || !formState.subscriptionId || !formState.paymentMode || !formState.paymentStatus){
    
        setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
        return openErrorSB("Missing Field","Please fill all the mandatory fields")
    }
    setTimeout(()=>{setCreating(false);setIsSubmitted(true)},500)
    const {paymentTime, referenceNo, transactionId, amount, userId, subscriptionId, paymentMode, paymentStatus } = formState;
    const res = await fetch(`${baseUrl}api/v1/payment`, {
        method: "POST",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
            paymentTime, referenceNo, transactionId, amount, userId, subscriptionId, paymentMode, paymentStatus
        })
    });
    
    
    const data = await res.json();
    if (data.status === 422 || data.error || !data) {
        setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
    } else {
        // setNewObjectId(data?.data._id)
        openSuccessSB("Payment Created",data.message)
        setIsSubmitted(true)
        setTimeout(()=>{setCreating(false);setIsSubmitted(true)},500)
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
    return (
    <>
    {isLoading ? (
        <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
        <CircularProgress color="info" />
        </MDBox>
    )
    :
    ( 
        <MDBox pl={2} pr={2} mt={4} mb={5}>
            <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                Fill Payment Details
            </MDTypography>
            </MDBox>

            <Grid container display="flex" flexDirection="row" justifyContent="space-between">
            <Grid container spacing={2} mt={0.5} mb={0} xs={12} md={9} xl={12}>
            <Grid item xs={12} md={6} xl={3} mt={-1} mb={2.5}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['MobileDateTimePicker']}>
                  <DemoItem>
                    <MobileDateTimePicker 
                      label="Payment Time"
                      disabled={isSubmitted}
                      defaultValue={dayjs(new Date())}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          paymentTime: dayjs(e)
                        }))
                      }}
                      minDateTime={null}
                      sx={{ width: '100%' }}
                    />
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
          </Grid>

            <Grid item xs={12} md={6} xl={3}>
                <TextField
                    disabled={isSubmitted}
                    id="outlined-required"
                    label='Reference No *'
                    type='text'
                    fullWidth
                    // defaultValue={portfolioData?.portfolioName}
                    // value={formState?.actual_price || tenXSubs?.actual_price}
                    onChange={(e) => {setFormState(prevState => ({
                        ...prevState,
                        referenceNo: e.target.value
                    }))}}
                />
            </Grid>

            <Grid item xs={12} md={6} xl={3}>
                <TextField
                    disabled={isSubmitted}
                    id="outlined-required"
                    label='Transaction Id *'
                    type='text'
                    fullWidth
                    // defaultValue={portfolioData?.portfolioName}
                    // value={formState?.discounted_price || tenXSubs?.discounted_price}
                    onChange={(e) => {setFormState(prevState => ({
                        ...prevState,
                        transactionId: e.target.value
                    }))}}
                />
            </Grid>

            <Grid item xs={12} md={6} xl={3}>
                <TextField
                    disabled={isSubmitted}
                    id="outlined-required"
                    label='Amount *'
                    type='number'
                    fullWidth
                    // defaultValue={portfolioData?.portfolioName}
                    // value={formState?.profitCap || tenXSubs?.profitCap}
                    onChange={(e) => {setFormState(prevState => ({
                        ...prevState,
                        amount: e.target.value
                    }))}}
                />
            </Grid>

            <Grid item xs={12} md={6} xl={3}>
                <FormControl 
                sx={{ minHeight:10, minWidth:263 }}
                >
                  <InputLabel id="demo-multiple-name-label">User(s)</InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    disabled={isSubmitted}
                    // defaultValue={id ? portfolios?.portfolio : ''}
                    // value={formState?.portfolio?.name || tenXSubs?.portfolio?.portfolioName}
                    onChange={(e) => {setFormState(prevState => ({
                        ...prevState,
                        userId: e.target.value
                    }))}}
                    input={<OutlinedInput label="User" />}
                    sx={{minHeight:45}}
                    MenuProps={MenuProps}
                  >
                    {userData?.map((user) => (
                      <MenuItem
                        key={user?._id}
                        value={user?._id}
                      >
                        {`${user.first_name} ${user.last_name}`}
                      </MenuItem>
                    ))}
                  </Select>
            </FormControl>
            </Grid>

            <Grid item xs={12} md={6} xl={3}>
                <FormControl sx={{ minHeight:10, minWidth:263 }}>
                  <InputLabel id="demo-multiple-name-label">Subscription(s)</InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    disabled={isSubmitted}
                    // defaultValue={id ? portfolios?.portfolio : ''}
                    // value={formState?.portfolio?.name || tenXSubs?.portfolio?.portfolioName}
                    onChange={(e) => {setFormState(prevState => ({
                        ...prevState,
                        subscriptionId: e.target.value
                    }))}}
                    input={<OutlinedInput label="Subscription" />}
                    sx={{minHeight:45}}
                    MenuProps={MenuProps}
                  >
                    {subscriptionData?.map((subs) => (
                      <MenuItem
                        key={subs?._id}
                        value={subs?._id}
                      >
                        {`${subs.plan_name}`}
                      </MenuItem>
                    ))}
                  </Select>
            </FormControl>
            </Grid>

            <Grid item xs={12} md={6} xl={3}>
                <FormControl sx={{width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Validity Period *</InputLabel>
                    <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    // value={formState?.validityPeriod || tenXSubs?.validityPeriod}
                    // value={oldObjectId ? contestData?.status : formState?.status}
                    disabled={isSubmitted}
                    onChange={(e) => {setFormState(prevState => ({
                        ...prevState,
                        paymentMode: e.target.value
                    }))}}
                    label="Validity Period"
                    sx={{ minHeight:43 }}
                    >
                        <MenuItem value="GooglePay">GooglePay</MenuItem>
                        <MenuItem value="PhonePay">PhonePay</MenuItem>
                        <MenuItem value="Upi">Upi</MenuItem>
                        <MenuItem value="PayTM">PayTM</MenuItem>
                        <MenuItem value="AmazonPay">AmazonPay</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6} xl={3}>
                <FormControl sx={{width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Status *</InputLabel>
                    <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    // value={formState?.status || tenXSubs?.status}
                    // value={oldObjectId ? contestData?.status : formState?.status}
                    disabled={isSubmitted}
                    onChange={(e) => {setFormState(prevState => ({
                        ...prevState,
                        paymentStatus: e.target.value
                    }))}}
                    label="Payment Status"
                    sx={{ minHeight:43 }}
                    >
                    <MenuItem value="succeeded">Succeeded</MenuItem>
                    <MenuItem value="failed">Failed</MenuItem>
                    <MenuItem value="processing">Processing</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
                
            </Grid>

            </Grid>

            <Grid container mt={2} xs={12} md={12} xl={12} >
                <Grid item display="flex" justifyContent="flex-end" xs={12} md={6} xl={12}>
                        {!isSubmitted  && (
                        <>
                        <MDButton 
                            variant="contained" 
                            color="success" 
                            size="small" 
                            sx={{mr:1, ml:2}} 
                            // disabled={creating} 
                            onClick={(e)=>{onSubmit(e,formState)}}
                            >
                            {creating ? <CircularProgress size={20} color="inherit" /> : "Save"}
                        </MDButton>
                        <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={()=>{navigate("/payment")}}>
                            Cancel
                        </MDButton>
                        </>
                        )}
                        {/* {(isSubmitted || id) && !editing && (
                        <>
                        <MDButton variant="contained" color="warning" size="small" sx={{mr:1, ml:2}} onClick={()=>{setEditing(true)}}>
                            Edit
                        </MDButton>
                        <MDButton variant="contained" color="info" size="small" onClick={()=>{(id || newObjectId) ? navigate("/tenxsubscriptions") : setIsSubmitted(false)}}>
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
                        </>
                        )} */}
                </Grid>

                {/* {(isSubmitted || id) && !editing && 
                <Grid item xs={12} md={6} xl={12}>
                    
                    <Grid container spacing={1}>

                    <Grid item xs={12} md={6} xl={12} mt={-3} mb={-1}>
                    <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                        Add Features
                    </MDTypography>
                    </Grid>
                    
                    <Grid item xs={12} md={1.35} xl={2.7}>
                        <TextField
                            id="outlined-required"
                            label='Order No. *'
                            fullWidth
                            type="number"
                            // value={formState?.features?.orderNo}
                            onChange={(e) => {setFormState(prevState => ({
                                ...prevState,
                                orderNo: e.target.value
                            }))}}
                        />
                    </Grid>
        
                    <Grid item xs={12} md={1.35} xl={2.7}>
                        <TextField
                            id="outlined-required"
                            label='Description *'
                            fullWidth
                            type="text"
                            // value={formState?.features?.description}
                            onChange={(e) => {setFormState(prevState => ({
                                ...prevState,
                                description: e.target.value
                            }))}}
                        />
                    </Grid>
            
                    <Grid item xs={12} md={0.6} xl={1.2} mt={-0.7}>
                        <IoMdAddCircle cursor="pointer" onClick={(e)=>{onAddFeature(e,formState,setFormState)}}/>
                    </Grid>
    
                    </Grid>
    
                </Grid>}

                {(isSubmitted || id) && <Grid item xs={12} md={12} xl={12} mt={2}>
                    <MDBox>
                        <FeatureData updatedDocument={updatedDocument} setUpdatedDocument={setUpdatedDocument}/>
                    </MDBox>
                </Grid>}

                {(id || newObjectId) && <Grid item xs={12} md={12} xl={12} mt={2}>
                    <MDBox>
                        <TenXSubscriptionPurchaseIntent tenXSubscription={newObjectId ? newObjectId : id} purchaseIntentCount={purchaseIntentCount} setPurchaseIntentCount={setPurchaseIntentCount}/>
                    </MDBox>
                </Grid>} */}

            </Grid>

            {renderSuccessSB}
            {renderErrorSB}
        </MDBox>
    )
                }
    </>
    );
}