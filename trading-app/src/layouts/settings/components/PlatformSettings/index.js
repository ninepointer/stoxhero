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

  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const [LeaderBoardTimming, setLeaderBoardTimming] = useState(0);

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  

  useEffect(()=>{
    // console.log("settingData", settingData)

      setLeaderBoardTimming(settingData[0]?.leaderBoardTimming)
      setAppStartTime(dayjs(settingData[0]?.AppStartTime))
      setAppEndTime(dayjs(settingData[0]?.AppEndTime))
      setAppLiveValue(settingData[0]?.isAppLive)
      setInfinityLiveValue(settingData[0]?.infinityLive)
      setInfinityPrice(settingData[0]?.infinityPrice)

  },[reRender, settingData])

  function setAppLiveValueFun(appLiveValue){
    if(appLiveValue){
      appLiveValue = false
    } else{
      appLiveValue = true
    }
  }



  async function setSettingsValue(id, value){
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
      if (dataResp.status === 422 || dataResp.error || !dataResp) {
          window.alert(dataResp.error);
          // console.log("Failed to Edit");
      } else {
          setEditable(false)
          if(appLiveValue){
              //window.alert("Trading Enabled");
              openSuccessSB();
          } else{
              //window.alert("Trading Disabled");
              openSuccessSB();
          }
      }
      reRender ? setReRender(false) : setReRender(true)
  }

  async function saveSetting(){
    setEditable(false);
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
      }),
  }); 
  const dataResp = await res.json();
  console.log(dataResp);
  if (dataResp.status === 422 || dataResp.error || !dataResp) {
      window.alert(dataResp.error);
      // console.log("Failed to Edit");
  } else {
      setEditable(false)
      if(appLiveValue){
          //window.alert("Trading Enabled");
          openSuccessSB();
      } else{
          //window.alert("Trading Disabled");
          openSuccessSB();
      }
  }
  reRender ? setReRender(false) : setReRender(true)

  }


  let appstatus = settingData[0]?.isAppLive === true ? "Online" : "Offline"
  let today = new Date();
  let timestamp = `${(today.getHours())}:${String(today.getMinutes()).padStart(2, '0')}:${String(today.getSeconds()).padStart(2, '0')}`
  let title =  "App " + appstatus
  let enablestatus = settingData[0]?.isAppLive === true ? "enabled" : "disabled"
  let content = "Trading is " + enablestatus + " now"
  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title={title}
      content={content}
      dateTime={timestamp}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
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

        <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox mt={0.5}>
              <Switch checked={settingData[0]?.isAppLive} onChange={() => {setAppLiveValueFun(settingData[0]?.isAppLive); setAppLiveValue(!appLiveValue); setSettingsValue(settingData[0]._id,{isAppLive: !settingData[0].isAppLive})}}/>
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
              <Switch checked={settingData[0]?.infinityLive} onChange={() => {setAppLiveValueFun(settingData[0]?.infinityLive); setInfinityLiveValue(!infinityLiveValue); setSettingsValue(settingData[0]._id,{infinityLive: !settingData[0].infinityLive})}}/>
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
