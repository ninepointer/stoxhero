// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
// import Icon from "@mui/material/Icon";
// import Tooltip from "@mui/material/Tooltip";
// import MDAlert from "../../../../components/MDAlert";
import MDSnackbar from "../../../../components/MDSnackbar";
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';

import { MdModeEditOutline } from 'react-icons/md';

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
// import MDButton from "../../../../components/MDButton";

import React, {useState, useEffect, useContext} from 'react'
import axios from "axios";
// import Grid from "@mui/material/Grid";
// import { useMaterialUIController } from "../../../../context";

// // Material Dashboard 2 React components
// import axios from "axios";
import { userContext } from '../../../../AuthContext';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';

function PlatformSettings({settingData, setReRender, reRender}) {

  const [AppStartTime, setAppStartTime] = React.useState(dayjs('2018-01-01T00:00:00.000Z'));
  const [AppEndTime, setAppEndTime] = React.useState(dayjs('2018-01-01T00:00:00.000Z'));
  const [appLiveValue, setAppLiveValue] = useState();
  const [infinityLiveValue, setInfinityLiveValue] = useState();
  const [editable, setEditable] = useState(false);
  const [infinityPrice, setInfinityPrice] = useState(0);
  const [maxWithdrawal, setMaxWithdrawal] = useState(0);
  const [minWithdrawal, setMinWithdrawal] = useState(0);
  const [fund, setFund] = useState(0);
  const [usedMargin, setUsedMargin] = useState(0);
  const [accountData, setAccountData] = useState({
    upiId: "",
    email: "",
    mobile: ""
  });
  const [LeaderBoardTimming, setLeaderBoardTimming] = useState(0);

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  

  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/usedMargin/infinity`)
      .then((res) => {
        // console.log(res.data);
        setUsedMargin(res.data.data)
        // setIsLoadMockMargin(true)
      }).catch((err) => {
        return new Error(err);
      })
  }, [])

  useEffect(()=>{
    // console.log("settingData", settingData)

      setLeaderBoardTimming(settingData[0]?.leaderBoardTimming)
      setAppStartTime(dayjs(settingData[0]?.AppStartTime))
      setAppEndTime(dayjs(settingData[0]?.AppEndTime))
      setAppLiveValue(settingData[0]?.isAppLive)
      setInfinityLiveValue(settingData[0]?.infinityLive)
      setInfinityPrice(settingData[0]?.infinityPrice)
      setMaxWithdrawal(settingData[0]?.maxWithdrawal)
      setMinWithdrawal(settingData[0]?.minWithdrawal)
      accountData.upiId = settingData[0]?.contest?.upiId
      accountData.email = settingData[0]?.contest?.email
      accountData.mobile = settingData[0]?.contest?.mobile
      setAccountData(accountData);

  },[reRender, settingData])

  function setAppLiveValueFun(appLiveValue){
    if(appLiveValue){
      appLiveValue = false
    } else{
      appLiveValue = true
    }
  }



  async function setSettingsValue(id, value, from){
    console.log("Value in setSettingsValue function: ",value);
      const res = await fetch(`${baseUrl}api/v1/applive/${id}`, {
          method: "PATCH",
          credentials: "include",
          headers: {
              "Accept": "application/json",
              "content-type": "application/json"
          },
          body: JSON.stringify({
              // isAppLive: appLiveValue, modifiedBy, modifiedOn
              ...value
          })
      }); 
      const dataResp = await res.json();
      console.log(dataResp);
      if (!dataResp) {
          // window.alert(dataResp.error);
          // console.log("Failed to Edit");
          openSuccessSB("err", "");
      } else {
        console.log("data", appLiveValue, infinityLiveValue)
          setEditable(false)
          if(from === "App" && !appLiveValue){
            openSuccessSB("appOn", "");
          } else if(from === "App"){
            openSuccessSB("appOff", "");
          }
          if(from === "Infinity" && !infinityLiveValue){
            openSuccessSB("infinityOn", "");
          } else if(from === "Infinity"){
            openSuccessSB("infinityOff", "");
          }
      }
      reRender ? setReRender(false) : setReRender(true)
  }

  async function saveSetting(){
    setEditable(false);
    const {upiId, email, mobile} = accountData;
    console.log("upiId, email", upiId, email)
    const res = await fetch(`${baseUrl}api/v1/settings/${ settingData[0]?._id}`, {
      method: "PATCH",
      credentials:"include",
      headers: {
          "Accept": "application/json",
          "content-type": "application/json"
      },
      body: JSON.stringify({
        ...settingData[0],
        leaderBoardTimming: LeaderBoardTimming,
        infinityPrice: infinityPrice,
        maxWithdrawal,
        minWithdrawal,
        upiId, email, mobile
      }),
  }); 
  const dataResp = await res.json();
  console.log(dataResp);
  if (dataResp.status === 422 || dataResp.error || !dataResp) {
      // window.alert(dataResp.error);
      openSuccessSB('err', "")
  } else {
      setEditable(false)
      openSuccessSB("saveOthers", "");
  }
  reRender ? setReRender(false) : setReRender(true)

  }


  const [messageObj, setMessageObj] = useState({
    color: '',
    icon: '',
    title: '',
    content: ''
  })

  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = (value,content) => {
    // //console.log("Value: ",value)
    if(value === "appOn"){
        messageObj.color = 'success'
        messageObj.icon = 'check'
        messageObj.title = "App Live";
        messageObj.content = `App is online for all`;

    };
    if(value === "appOff"){
      messageObj.color = 'error'
      messageObj.icon = 'error'
      messageObj.title = "App Offline";
      messageObj.content = "App is offline for all";
    };
    if(value === "infinityOn"){
      messageObj.color = 'success'
      messageObj.icon = 'check'
      messageObj.title = "Infinity Live";
      messageObj.content = `App is online for Infinity`;
  };
    if(value === "infinityOff"){
      messageObj.color = 'error'
      messageObj.icon = 'error'
      messageObj.title = "Infinity Offline";
      messageObj.content = "App is offline for Infinity";
    };
    if(value === "saveOthers"){
      messageObj.color = 'success'
      messageObj.icon = 'check'
      messageObj.title = "Success";
      messageObj.content = `Settings updated successfully`;
    } 
    if(value === "err"){
      messageObj.color = 'error'
      messageObj.icon = 'error'
      messageObj.title = "Error";
      messageObj.content = "Something went wrong";

    }

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
    <Card sx={{ boxShadow: "none" }}>
      <MDBox p={2} display="flex" justifyContent="space-between">
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          Settings 
        </MDTypography>
        <MDBox>
          {editable ?
          <LibraryAddCheckIcon cursor="pointer" onClick={saveSetting} />
          :
          <MdModeEditOutline cursor="pointer" onClick={()=>{setEditable(true)}} />
          }
        </MDBox>
      </MDBox>
      <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>

        <TextField
          disabled={!editable}
          id="outlined-required"
          label='LeaderBoard Timming(second)'
          fullWidth
          // defaultValue={LeaderBoardTimming ? LeaderBoardTimming : settingData[0]?.leaderBoardTimming}
          value={LeaderBoardTimming}
          type="number"
          onChange={(e)=>{setLeaderBoardTimming(e.target.value)}}
        />

        <TextField
          disabled={!editable}
          id="outlined-required"
          label='Infinity Price'
          fullWidth
          type="number"
          value={infinityPrice}
          
          sx={{marginTop: "15px"}}
          // defaultValue={infinityPrice ? infinityPrice: settingData[0]?.infinityPrice}
          onChange={(e)=>{setInfinityPrice(e.target.value)}}
        />
        <TextField
          disabled={!editable}
          id="outlined-required"
          label='Maximum Withdrawal Amount'
          fullWidth
          type="number"
          value={maxWithdrawal}
          
          sx={{marginTop: "15px"}}
          // defaultValue={infinityPrice ? infinityPrice: settingData[0]?.infinityPrice}
          onChange={(e)=>{setMaxWithdrawal(e.target.value)}}
        />
        <TextField
          disabled={!editable}
          id="outlined-required"
          label='Minimum Withdrawal Amount'
          fullWidth
          type="number"
          value={minWithdrawal}
          
          sx={{marginTop: "15px"}}
          // defaultValue={infinityPrice ? infinityPrice: settingData[0]?.infinityPrice}
          onChange={(e)=>{setMinWithdrawal(e.target.value)}}
        />

        <MDBox>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={3} mt={2} mb={1}>
            
            <MobileTimePicker
              label="Trading Start Time"
              value={AppStartTime}
              disabled={!editable}
              onChange={(e) => {setAppStartTime(e)}}
              // onAccept={(e) => {setSettingsValue(settingData[0]._id,{AppStartTime: e})}}
              renderInput={(params) => <TextField {...params} />}
            />

          </Stack>
        </LocalizationProvider>
        </MDBox>

        <MDBox>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={3} mt={2} mb={1}>
            
            <MobileTimePicker
              label="Trading End Time"
              value={AppEndTime}
              disabled={!editable}
              // onChange={(e) => {setAppEndTime(e)}}
              onChange={(e) => {setAppStartTime(e)}}
              // onAccept={(e) => {setSettingsValue(settingData[0]._id,{AppEndTime: e})}}
              renderInput={(params) => <TextField {...params} />}
            />
            
          </Stack>
        </LocalizationProvider>
        </MDBox>

        <TextField
          disabled={!editable}
          id="outlined-required"
          label='Fund'
          fullWidth
          // defaultValue={LeaderBoardTimming ? LeaderBoardTimming : settingData[0]?.leaderBoardTimming}
          value={fund}
          type="number"
          onChange={(e)=>{setFund(e.target.value)}}
        />

        <TextField
          disabled={true}
          id="outlined-required"
          label='Availble Fund:'
          fullWidth
          value={fund-usedMargin}
          sx={{marginTop: "15px"}}
          type="number"
          onChange={(e)=>{setFund(e.target.value)}}
        />

        <TextField
          disabled={!editable}
          id="outlined-required"
          label="Upi Id"
          fullWidth
          value={accountData.upiId}
          sx={{marginTop: "15px"}}
          type="text"
          onChange={(e) => setAccountData({ ...accountData, upiId: e.target.value })}
        />

        <TextField
          disabled={!editable}
          id="outlined-required"
          label='Email Id'
          fullWidth
          value={accountData.email}
          sx={{marginTop: "15px"}}
          type="text"
          onChange={(e) => { setAccountData({ ...accountData, email: e.target.value }) }}
        />
        
        <TextField
          disabled={!editable}
          id="outlined-required"
          label='Mobile'
          fullWidth
          value={accountData.mobile}
          sx={{marginTop: "15px"}}
          type="text"
          onChange={(e) => { setAccountData({ ...accountData, mobile: e.target.value }) }}
        />


        <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox mt={0.5}>
              <Switch checked={settingData[0]?.isAppLive} onChange={() => {setAppLiveValueFun(settingData[0]?.isAppLive); setAppLiveValue(!appLiveValue); setSettingsValue(settingData[0]._id,{isAppLive: !settingData[0].isAppLive}, "App")}}/>
          </MDBox>
          <MDBox width="80%" ml={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="dark">
              {(settingData[0]?.isAppLive ? "Trading Enabled" : "Trading Disabled")}    
            </MDTypography>
            {renderSuccessSB}
          </MDBox>
        </MDBox>
        <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox mt={0.5}>
              <Switch checked={settingData[0]?.infinityLive} onChange={() => {setAppLiveValueFun(settingData[0]?.infinityLive); setInfinityLiveValue(!infinityLiveValue); setSettingsValue(settingData[0]._id,{infinityLive: !settingData[0].infinityLive}, "Infinity")}}/>
          </MDBox>
          <MDBox width="80%" ml={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="dark">
              {(settingData[0]?.infinityLive ? "Infinity Trading Enabled" : "Infinity Trading Disabled")}    
            </MDTypography>
            {renderSuccessSB}
          </MDBox>
        </MDBox>

        <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox mt={0.5}>
              <Switch checked={true}/>
          </MDBox>
          <MDBox width="80%" ml={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="dark">
              {(true ? "Cron Job Email Notifications On" : "Cron Job Email Notifications Off")}    
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox mt={0.5}>
              <Switch checked={true}/>
          </MDBox>
          <MDBox width="80%" ml={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="dark">
              {(true ? "Daily Report Email On" : "Daily Report Email Off")}    
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default PlatformSettings;
