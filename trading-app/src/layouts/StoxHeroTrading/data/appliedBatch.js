import React, {useState, useEffect, useContext, memo} from 'react'
// import { Link } from 'react-router-dom';
import Grid from "@mui/material/Grid";
import axios from "axios";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
// import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import {Tooltip} from '@mui/material';
import MDAvatar from "../../../components/MDAvatar";
// import ContestIcon from "../../../assets/images/contest.png";
import { HiUserGroup } from 'react-icons/hi';
// import Timer from '../timer'
// import { Typography } from '@mui/material';
// import AvTimerIcon from '@mui/icons-material/AvTimer';
import { userContext } from '../../../AuthContext';
// import ProgressBar from '../data/ProgressBar';
import { CircularProgress } from "@mui/material";
// import Logo from "../../../assets/images/logo1.jpeg"
import nifty from "../../../assets/images/nifty.png"
import banknifty from "../../../assets/images/banknifty.png"
import sad from "../../../assets/images/sadness.png"

  

const AppliedBatchCard = ({Render}) => {
  const {render, setReRender} = Render;
  const [appliedBatch,setAppliedBatch] = useState([]);
  const [isLoading,setIsLoading] = useState(false);

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/";
  const getDetails = useContext(userContext)


    useEffect(()=>{
        axios.get(`${baseUrl}api/v1/batch/appliedBatch`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
        })
        .then((res)=>{
            setAppliedBatch(res.data.data);
            setIsLoading(true)
            console.log(res.data.data)
        }).catch((err)=>{
            return new Error(err);
        })
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
        
        // console.log(finalFormattedDate);
        
     

      return finalFormattedDate
    }
      
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
      {appliedBatch.length > 0 ? 
      <MDBox minWidth="100%" minHeight='auto'>
        
      <Grid container spacing={2}>
      {appliedBatch?.map((e)=>{

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
                      {/* <MDButton color={"dark"} onClick={()=>{registration(e._id)}}>
                          Register Now
                      </MDButton> */}
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
      {/* {renderSuccessSB} */}
    </MDBox>
      :
      <MDBox style={{border:'1px solid white', borderRadius:5, minHeight:'20vh'}}>
        <Grid container>
          <Grid item xs={12} md={6} lg={12}>
            <MDBox style={{minHeight:"20vh"}} display="flex" justifyContent="center" flexDirection="column" alignContent="center" alignItems="center">
            <img src={sad} width={50} height={50}/>
            <MDTypography color="light" fontSize={15}>You have not registered in any of the batches!</MDTypography>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      }
      </>
      }
    </>
)}

export default memo(AppliedBatchCard);