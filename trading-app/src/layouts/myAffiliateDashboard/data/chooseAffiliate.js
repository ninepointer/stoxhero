import {useState, useEffect} from 'react';
import axios from "axios";
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { apiUrl } from '../../../constants/constants';

export default function ChooseAfiliate({setAffiliateData}) {
  let [isLoading,setIsLoading] = useState([])
  const [affiliateType,setAffiliateType] = useState([])
  const [selectedType, setSelectedType] = useState("");
  const [affiliateProgram,setAffiliateProgram] = useState([])
  const [selectedPrograme, setSelectedPrograme] = useState({
    id: "",
    name: ""
  });
  const [affiliate,setAffiliate] = useState([])
  const [selectedAffiliate, setSelectedAffiliate] = useState({
    id: "",
    name: ""
  });

  const handleProgrammeChange = (event) => {
    const {
      target: { value },
    } = event;
    let programeId = affiliateProgram?.filter((elem) => {
      return elem.affiliateProgramName === value;
    })
    setSelectedPrograme({
        id: programeId[0]?._id,
        name: programeId[0]?.affiliateProgramName
      });
    // console.log("portfolioId", portfolioId, formState)
  };

  const handleAffilateChange = (event) => {
    const {
      target: { value },
    } = event;
    let affiliateId = affiliate?.filter((elem) => {
      return elem.affiliateName === value;
    })
    setSelectedPrograme({
        id: affiliateId[0]?.affiliateId,
        name: affiliateId[0]?.affiliateName
      });
    // console.log("portfolioId", portfolioId, formState)
  };
  
  
  useEffect(() => {
    setIsLoading(true)
    let call1 = axios.get((`${apiUrl}affiliate/affiliatetype`), {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
    })
    Promise.all([call1])
      .then(([api1Response]) => {
        setAffiliateType(api1Response?.data?.data)
        setSelectedType(api1Response?.data?.data?.[0]?.type)
        setIsLoading(false)
      })
      .catch((error) => {
        //   Handle errors here
        console.error(error);
      });

  }, [])

  useEffect(() => {
    setIsLoading(true)

    let call1 = axios.get((`${apiUrl}affiliate/programbytype?type=${selectedType}`), {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
    })

    Promise.all([call1])
      .then(([api1Response]) => {
        setAffiliateProgram(api1Response?.data?.data)
        setSelectedPrograme({
            id: api1Response?.data?.data?.[0]?._id,
            name: api1Response?.data?.data?.[0]?.affiliateProgramName
        })
        setIsLoading(false)
      })
      .catch((error) => {
        //   Handle errors here
        console.error(error);
      });

  }, [selectedType])

  useEffect(() => {
    setIsLoading(true)
    let call1 = axios.get((`${apiUrl}affiliate/affiliatebyprograme?id=${selectedPrograme?.id}`), {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
    })
    Promise.all([call1])
      .then(([api1Response]) => {
        setAffiliate(api1Response?.data?.data)
        setSelectedAffiliate({
            id: api1Response?.data?.data?.[0]?.affiliateId,
            name: api1Response?.data?.data?.[0]?.affiliateName
        })
        setIsLoading(false)
      })
      .catch((error) => {
        //   Handle errors here
        console.error(error);
      });

  }, [selectedPrograme])

  useEffect(()=>{
    if(selectedAffiliate?.id){
        setAffiliateData(selectedAffiliate?.id);
    }
  }, [selectedAffiliate])


  return (
    <Grid item xs={12} md={12} lg={12} mt={1} display='flex' justifyContent='center' style={{width:'100%'}}>
    <Grid container spacing={2} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>

      <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center' alignItems='center'>
        <FormControl fullWidth sx={{mt:1}}>
          <InputLabel id="demo-simple-select-label">Affiliate Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedType}
            label="Affiliate Type"
            sx={{minHeight:44}}
            onChange={(e)=>{setSelectedType(e.target.value)}}
          >
            {affiliateType.map((elem)=>{
                return(
                    <MenuItem key={elem?.type} value={elem?.type}>{elem?.type}</MenuItem>
                )
            })}
            </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center' alignItems='center'>
        <FormControl fullWidth sx={{mt:1}}>
          <InputLabel id="demo-simple-select-label">Affiliate Programe</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedPrograme?.name
                // affiliateProgram.filter(elem=> elem?._id?.toString()===selectedPrograme?.toString())?.[0]?.affiliateProgramName
                //  ||  affiliateProgram.filter(elem=> elem?._id?.toString()===e.target.value?.toString)?.[0]?.affiliateProgramName
                }
            label="Affiliate Type"
            sx={{minHeight:44}}
            onChange={
                handleProgrammeChange
                // setSelectedPrograme(e.target.value)
            
            }
          >
            {affiliateProgram.map((elem)=>{
                return(
                    <MenuItem key={elem?._id} value={elem?.affiliateProgramName}>{elem?.affiliateProgramName}</MenuItem>
                )
            })}
            </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center' alignItems='center'>
        <FormControl fullWidth sx={{mt:1}}>
          <InputLabel id="demo-simple-select-label">Affiliate</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedAffiliate?.name
                // affiliate.filter(elem=> elem?.affiliateId?.toString()===selectedAffiliate?.toString())?.[0]?.affiliateName 
                // ||  affiliateProgram.filter(elem=> elem?.affiliateId?.toString()===e.target.value?.toString)?.[0]?.affiliateName
            }
            label="Affiliate Type"
            sx={{minHeight:44}}
            onChange={
                // setSelectedAffiliate(e.target.value)
                handleAffilateChange
            }
          >
            {affiliate.map((elem)=>{
                return(
                    <MenuItem key={elem?.affiliateId} value={elem?.affiliateName}>{elem?.affiliateName}</MenuItem>
                )
            })}
            </Select>
        </FormControl>
      </Grid>
      

      
    </Grid>
  </Grid> 
  );
}