import {useState, useEffect, useContext} from 'react';
import axios from "axios";
import MDBox from '../../../../components/MDBox';
import MDButton from '../../../../components/MDButton'
import {Card, Grid} from '@mui/material';
import MDTypography from '../../../../components/MDTypography';
import { CircularProgress, LinearProgress, Paper } from '@mui/material';
import { saveAs } from 'file-saver';
import moment from 'moment'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { apiUrl } from '../../../../constants/constants';

export default function Dashboard() {
  let [isLoading,setIsLoading] = useState(false)
  const [period,setPeriod] = useState("Today")


  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };


  return (
   
        <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'auto'}}>
            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1, backgroundColor:'white' }} >
                
                    <Grid container spacing={2} p={2} xs={12} md={12} lg={12} display='flex' flexDirection='row' justifyContent='center' alignItems='center'>
                    
                        <Grid item xs={12} md={12} lg={3} display='flex' justifyContent='flex-start'>
                            <MDTypography variant="h6" style={{textAlign:'center'}}>Onboarded Influencers</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={12} lg={3} display='flex' justifyContent='flex-end' sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">State</InputLabel>
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={period}
                            label="State"
                            sx={{minHeight:44}}
                            onChange={handlePeriodChange}
                            >
                            <MenuItem value={"Uttar Pradesh"}>Uttar Pradesh</MenuItem>
                            <MenuItem value={"Rajasthan"}>Rajasthan</MenuItem>
                            <MenuItem value={"Bihar"}>Bihar</MenuItem>
                            <MenuItem value={"Delhi"}>Delhi</MenuItem>
                            <MenuItem value={"Karnataka"}>Karnataka</MenuItem>
                            </Select>
                        </FormControl>
                        </Grid>

                        <Grid item xs={12} md={12} lg={3} display='flex' justifyContent='flex-end' sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Channel</InputLabel>
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={period}
                            label="State"
                            sx={{minHeight:44}}
                            onChange={handlePeriodChange}
                            >
                            <MenuItem value={"YouTube"}>YouTube</MenuItem>
                            <MenuItem value={"Instagram"}>Instagram</MenuItem>
                            <MenuItem value={"Telegram"}>Telegram</MenuItem>
                            <MenuItem value={"All"}>All</MenuItem>
                            </Select>
                        </FormControl>
                        </Grid>

                        <Grid item xs={12} md={12} lg={3} display='flex' justifyContent='flex-end'>
                            <MDButton fullWidth variant='contained' size='small' color='success'>Show</MDButton>
                        </Grid>

                    </Grid>
                
                </Card>
            </Grid>
        </Grid>

  );
}