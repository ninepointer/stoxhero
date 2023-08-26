import {useState, useEffect, createFactory} from 'react';
import axios from "axios";
import Box from '@mui/material/Box';
import DataTable from "../../../examples/Tables/DataTable";
import MDButton from "../../../components/MDButton"
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { AiOutlineEdit } from 'react-icons/ai';
import { CircularProgress } from "@mui/material";
// import TabContext from '@material-ui/lab/TabContext';


import battleRewardData from "../data/battleRewardData";
import CreateRewardForm from "./createReward"

const BattleRewards = ({battle}) => {

    const [reRender, setReRender] = useState(true);
    const [createRewardForm,setCreateRewardForm] = useState(false);
    const [battleRewards,setbattleRewards] = useState([]);
    const { columns, rows } = battleRewardData();
    const [id,setId] = useState();

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

    useEffect(()=>{
  
      axios.get(`${baseUrl}api/v1/battles/${battle}/rewards`)
      .then((res)=>{
                setbattleRewards(res.data.data);
                // console.log(res.data.data);
        }).catch((err)=>{
          return new Error(err);
      })
  },[createRewardForm])

  battleRewards?.map((elem)=>{
    let battleReward = {}

    battleReward.edit = (
      // <MDButton variant="text" color="info" size="small" sx={{fontSize:10}} fontWeight="medium">
        <AiOutlineEdit onClick={()=>{setCreateRewardForm(true); setId(elem)}}/>
      // </MDButton>
    );
    battleReward.rankStart= (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.rankStart}
      </MDTypography>
    );
    battleReward.rankEnd = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.rankEnd}
      </MDTypography>
    );
    battleReward.prize = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.prize}
      </MDTypography>
    );
    battleReward.prizeValue = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.prizeValue}
      </MDTypography>
    );

    rows.push(battleReward)
})

return (
    <>
      <MDBox pt={6} pb={3}>
      <Grid container spacing={6}>
          <Grid item xs={12} md={12} lg={12}>
              <Card>
                  <MDBox
                      mx={2}
                      mt={-3}
                      py={1}
                      px={2}
                      variant="gradient"
                      bgColor="info"
                      borderRadius="lg"
                      coloredShadow="info"
                      sx={{
                          display: 'flex',
                          justifyContent: "space-between",
                        }}>

                      <MDTypography variant="h6" color="white" py={0}>
                          Battle Rules
                      </MDTypography>
                      <MDButton hidden={true} variant="outlined" size="small" onClick={()=>setCreateRewardForm(true)}>
                          Create Battle Reward
                      </MDButton>
                  </MDBox>
                        {createRewardForm && <>
                          <CreateRewardForm createRewardForm={createRewardForm} setCreateRewardForm={setCreateRewardForm} battle={battle} reward={id}/>
                        </>
                        }
                  <MDBox pt={3}>
                      <DataTable
                          table={{ columns, rows }}
                          isSorted={false}
                          entriesPerPage={false}
                          showTotalEntries={false}
                          noEndBorder
                      />
                  </MDBox>
              </Card>
          </Grid>
      </Grid> 
  </MDBox>
      </>
    );
  }

  export default BattleRewards;