import React, {useState, useEffect} from 'react'
import Grid from "@mui/material/Grid";
import axios from "axios";
// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton";
import Paper from '@mui/material/Paper';
import MDTypography from "../../components/MDTypography";
import ContestIcon from "../../assets/images/contest.png";
import BatchDetailsForm from './CreateBatch'
import StockIcon from '../../assets/images/contest.gif'
import MDAvatar from "../../components/MDAvatar";
import { HiUserGroup } from 'react-icons/hi';
import Timer from './timer'
import { Tooltip } from '@mui/material';



const BatchCard = ({createContestForm,setCreateContestForm,isObjectNew,setIsObjectNew}) => {
  const [batchData,setBatchData] = useState([]);
  const [batchDetailsForm,setBatchDetailsForm] = useState(false)
  const [objectId,setObjectId] = useState('')
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

    useEffect(()=>{
  
      axios.get(`${baseUrl}api/v1/batch/active`)
      .then((res)=>{
                setBatchData(res.data.data);
                console.log(res.data.data)
        }).catch((err)=>{
          return new Error(err);
      })
  },[createContestForm])

      // console.log("Contest Data: ",batchData)

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
        
        console.log(finalFormattedDate); // Output: "3rd April, 9:27 PM"
        
     

      return finalFormattedDate
    }
      
    

    return (
      <>
       {     
      !batchDetailsForm ?
      <>
      {batchData?.map((e)=>(

      <Grid item xs={12} md={6} lg={4}>
      <button style={{border: 'none',width:"100%", cursor:"pointer"}} onClick={()=>{setObjectId(e._id);setBatchDetailsForm(true);setIsObjectNew(true)}}>
          <Paper 
            elevation={3}
            style={{
              position: 'relative', 
              backgroundColor: '#1c2127', 
              width: '100%', // Add this line to set the width to 100%
              height: 200,
              // width:280,
              borderRadius: 6,
            }}
          >
            <MDBox>
              <MDBox style={{
                backgroundImage: `url(${ContestIcon})`,
                backgroundPosition: 'top left',
                backgroundSize: '50px 50px',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '50px',
                height: '50px',
                margin: '8px',
                borderRadius:"10%"
              }}>
              </MDBox>
                <Grid key={e._id} item xs={12} md={6} lg={12} >
                <MDBox style={{borderRadius:4}}>
                <Tooltip title="Click me!">
                <MDBox variant="contained" bgColor="#ffffff" size="small" 
                  borderRadius='5px' padding={"10px"}
                >
                    
                    <Grid container height={180}>
                      {/* <Grid  container spacing={1} display="flex" justifyContent="center" alignContent="center" alignItem="center"> */}
                          <Grid item xs={12} md={6} lg={12} mb={1} >
                              {/* <MDAvatar src={e?.contestOn === 'NIFTY 50' ? nifty : banknifty} size="xl" display="flex" justifyContent="left"/> */}
                              <MDBox ml={2} display="flex" alignContent="center" justifyContent="center" alignItems="center" flexDirection='column'>
                                <MDTypography fontSize={20} fontWeight="bold" style={{color:"black"}}>
                                  {e?.batchName}
                                </MDTypography>
                                <MDTypography fontSize={10} fontWeight="bold" style={{color:"black"}}>
                                  Batch Starts on: {dateConvert(e?.batchStartDate)}
                                </MDTypography>
                                <MDTypography fontSize={10} fontWeight="bold" style={{color:"black"}}>
                                  Application Start on: {dateConvert(e?.applicationStartDate)}
                                </MDTypography>
                                <MDTypography fontSize={10} fontWeight="bold" style={{color:"black"}}>
                                  Application Ends on: {dateConvert(e?.applicationEndDate)}
                                </MDTypography>
                              </MDBox>
                          </Grid>
                        
                      {/* </Grid> */}
                        
                        {/* <Grid item xs={12} md={6} lg={12} mb={1}  display="flex" justifyContent="center">
                          <MDButton color={"dark"} onClick={()=>{registration(e._id)}}>
                              Register Now
                          </MDButton>
                        </Grid> */}

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
              </MDBox>
          </Paper>
        </button>
      </Grid>

      ))}
      </>
      :
      <>
      <BatchDetailsForm oldObjectId={objectId} setOldObjectId={setObjectId} setCreateContestFormCard={setBatchDetailsForm}/>
      </>
      }
      </>
)}



export default BatchCard;