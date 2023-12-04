import React, {useState, useEffect, memo} from 'react'
// import { Link } from 'react-router-dom';
import Grid from "@mui/material/Grid";
import axios from "axios";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import {Tooltip} from '@mui/material';
import MDAvatar from "../../../components/MDAvatar";
import MDTypography from "../../../components/MDTypography";
// import ContestIcon from "../../../assets/images/contest.png";
import { HiUserGroup } from 'react-icons/hi';
// import Timer from '../timer'
// import { Typography } from '@mui/material';
// import LinearProgress from '@mui/material/LinearProgress';
// import AvTimerIcon from '@mui/icons-material/AvTimer';
// import ProgressBar from '../data/ProgressBar'
import { CircularProgress } from "@mui/material";
// import Logo from "../../../assets/images/logo1.jpeg"
import nifty from "../../../assets/images/nifty.png"
import banknifty from "../../../assets/images/banknifty.png"
import upcoming from "../../../assets/images/upcoming.png"
import MDSnackbar from "../../../components/MDSnackbar";


const BatchCard = ({Render}) => {
  const {render, setReRender} = Render;
  const [batchData,setBatchData] = useState([]);
  const [isLoading,setIsLoading] = useState(false);

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
  useEffect(()=>{
  
    // promise.all[]
    let call1 = axios.get(`${baseUrl}api/v1/batch/active`)
    let call2 = axios.get(`${baseUrl}api/v1/batch/appliedBatch`,{
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                  },
                })
    Promise.all([call1, call2])
    .then(([api1Response, api2Response]) => {
      // Process the responses here
      console.log(api1Response.data.data);
      console.log(api2Response.data.data);
      let activeData = api1Response.data.data;
      let myData = api2Response.data.data;

      activeData = activeData.filter((elem1) => !myData.some((elem2) => elem1._id === elem2._id));

      console.log(activeData);
      setBatchData(activeData);
      setIsLoading(true)
    
    })
    .catch((error) => {
      // Handle errors here
      console.error(error);
    });  
              
  },[render])


    function dateConvert(dateConvert){
        const dateString = dateConvert;
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: 'numeric', 
            minute: 'numeric' 
        };
        
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
        
        // get day of month and add ordinal suffix
        const dayOfMonth = date.getDate();
        let suffix = "th";
        if (dayOfMonth === 1 || dayOfMonth === 21 || dayOfMonth === 31) {
            suffix = "st";
        } else if (dayOfMonth === 2 || dayOfMonth === 22) {
            suffix = "nd";
        } else if (dayOfMonth === 3 || dayOfMonth === 23) {
            suffix = "rd";
        }
        
        // combine date and time string with suffix
        const finalFormattedDate = `${dayOfMonth}${suffix} ${formattedDate?.split(" ")[0]}, ${date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`;
        

        return finalFormattedDate
    }
        
    async function registration(id){
        const res = await fetch(`${baseUrl}api/v1/batch/${id}/apply`, {
            method: "PATCH",
            credentials:"include",
            headers: {
                "content-type" : "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
            })
        });
        
        const data = await res.json();
        console.log("data", data)
        if(data.message){
            console.log("data if", data.message)
            openSuccessSB("Sucsess", data.message, "SUCCESS")
        }

        setReRender(!render);
    }

    const [successSB, setSuccessSB] = useState(false);
    const [msgDetail, setMsgDetail] = useState({
      title: "",
      content: "",
      color: "",
      icon: ""
    })
    const openSuccessSB = (title,content, message) => {
      msgDetail.title = title;
      msgDetail.content = content;
      // msgDetail.successSB = true;
      if(message == "SUCCESS"){
        msgDetail.color = 'success';
        msgDetail.icon = 'check'
      } else {
        msgDetail.color = 'error';
        msgDetail.icon = 'warning'
      }
      console.log(msgDetail)
      setMsgDetail(msgDetail)
      // setTitle(title)
      // setContent(content)
      setSuccessSB(true);
    }
  
    const closeSuccessSB = () =>{
      setSuccessSB(false);
    }
  

    const renderSuccessSB = (
    <MDSnackbar
        color={msgDetail.color}
        icon={msgDetail.icon}
        title={msgDetail.title}
        content={msgDetail.content}
        open={successSB}
        onClose={closeSuccessSB}
        close={closeSuccessSB}
        bgWhite="info"
    />
    );

    return (
    <>
      {!isLoading ?    
      <>
      <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
        <CircularProgress color="info" />
      </MDBox>
      </>
      :
      <>
      {batchData.length > 0 ? 
      <MDBox minWidth="100%" minHeight='auto'>
        
        <Grid container spacing={2}>
        {batchData?.map((e)=>{

          return <>
          
              <Grid key={e._id} item xs={12} md={6} lg={4} >
              <MDBox style={{borderRadius:4}}>
              <Tooltip title="Click me!">
              <MDBox variant="contained" bgColor="#ffffff" size="small" 
                borderRadius='5px' padding={"10px"}
              >
                  
                  <Grid container>
                    <Grid  container spacing={1} display="flex" justifyContent="center" alignContent="center" alignItem="center">
                        <Grid item xs={12} md={6} lg={12} mb={1} display="flex" alignContent="center" alignItems="center">
                            <MDAvatar src={e?.contestOn === 'NIFTY 50' ? nifty : banknifty} size="xl" display="flex" justifyContent="left"/>
                            <MDBox ml={2} display="flex" flexDirection="column">
                                <MDTypography fontSize={20} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>{e?.batchName}</MDTypography>
                                <MDTypography fontSize={10} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Batch Starts on: {dateConvert(e?.batchStartDate)}</MDTypography>
                                <MDTypography fontSize={10} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Application Start on: {dateConvert(e?.applicationStartDate)}</MDTypography>
                                <MDTypography fontSize={10} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Application Ends on: {dateConvert(e?.applicationEndDate)}</MDTypography>
                            </MDBox>
                        </Grid>
                      
                    </Grid>
                      
                      <Grid item xs={12} md={6} lg={12} mb={1}  display="flex" justifyContent="center">
                        <MDButton color={"dark"} onClick={()=>{registration(e._id)}}>
                            Register Now
                        </MDButton>
                      </Grid>

                      <Grid item xs={12} md={12} lg={12} display="flex" mt={1} mb={1} justifyContent="space-between" alignItems="center" alignContent="center">
                          <MDBox color="light" p={0.5} borderRadius={4} bgColor="success" fontSize={9} display="flex" justifyContent="center">
                              <HiUserGroup /><MDBox color="light" style={{marginLeft:2,fontWeight:700}}>Seats Left: {e?.batchLimit-e?.participants?.length}</MDBox>
                          </MDBox>
                          <MDBox color="light" p={0.5} borderRadius={4} bgColor="success" fontSize={9} display="flex" justifyContent="center">
                              <HiUserGroup /><MDBox display="flex" color="light" bgColor="success" justifyContent="center" alignContent="center" alignItems="center" style={{marginLeft:2,fontWeight:700}}>Total Seats: {e?.batchLimit}</MDBox>
                          </MDBox>
                      </Grid>

                  </Grid>

              </MDBox>
              </Tooltip>
              </MDBox>
              </Grid>
          
          </>
          })}
        </Grid>
        {renderSuccessSB}
      </MDBox>
      :
      <MDBox style={{border:'1px solid white', borderRadius:5, minHeight:'20vh'}}>
        <Grid container>
          <Grid item xs={12} md={6} lg={12}>
            <MDBox style={{minHeight:"20vh"}} display="flex" justifyContent="center" flexDirection="column" alignContent="center" alignItems="center">
            <img src={upcoming} width={50} height={50}/>
            <MDTypography color="light" fontSize={15}>Keep watching this space for upcoming batches!</MDTypography>
            </MDBox>
          </Grid>
        </Grid>
        
      </MDBox>
      }
      </>
      }
    </>
)}

export default memo(BatchCard);