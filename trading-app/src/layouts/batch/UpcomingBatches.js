import React, {useState} from 'react'
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";


// Material Dashboard 2 React example components
import MDButton from "../../components/MDButton";
import { CircularProgress, Icon } from "@mui/material";


// Data
import ContestCard from './BatchCard'
// import CreateContest from './CreateContest'
import CreateBatch from "./CreateBatch";


const UpcomingBatches = () => {
  
    const [isLoading,setIsLoading] = useState(false);
    const [createBatchForm,setCreateBatchForm] = useState(false);
    const [isObjectNew,setIsObjectNew] =useState(false);

    return (
      <>
      {isLoading ?    
      <>
      <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
      <CircularProgress color="info" />
      </MDBox>
      </>
      :
      <>
      
      <MDBox pt={0} pb={1}>
        <MDBox>
          {(!createBatchForm && !isObjectNew) && 
          <MDButton 
            variant="contained" 
            size="small" 
            color="success" 
            sx={{marginLeft:1.5}}
            onClick={()=>{setCreateBatchForm(true);setIsObjectNew(true)}}
            >
            Create Batch
          </MDButton>
          }
        </MDBox>
      
      
      {!createBatchForm ?
        <Grid container spacing={2} mt={-4}>
          
          <ContestCard createBatchForm={createBatchForm} setCreateBatchForm={setCreateBatchForm} isObjectNew={isObjectNew} setIsObjectNew={setIsObjectNew}/>

        </Grid>
        :
        
        <CreateBatch setCreateBatchForm={setCreateBatchForm}/>
      }
      </MDBox> 
      </>
      }
    </>
     )
}


export default UpcomingBatches;