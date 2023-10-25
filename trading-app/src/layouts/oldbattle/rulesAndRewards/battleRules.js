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


import battleRuleData from "../data/battleRuleData";
import CreateRuleForm from "./createRules"

const BattleRules = ({battle}) => {

    const [reRender, setReRender] = useState(true);
    const [createRuleForm,setCreateRuleForm] = useState(false);
    const [battleRules,setbattleRules] = useState([]);
    const { columns, rows } = battleRuleData();
    const [id,setId] = useState();

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

    useEffect(()=>{
  
      axios.get(`${baseUrl}api/v1/battles/${battle}/rules`)
      .then((res)=>{
                setbattleRules(res.data.data);
                // console.log(res.data.data);
        }).catch((err)=>{
          return new Error(err);
      })
  },[createRuleForm])

  battleRules?.map((elem)=>{
    let battleRule = {}

    battleRule.edit = (
      // <MDButton variant="text" color="info" size="small" sx={{fontSize:10}} fontWeight="medium">
        <AiOutlineEdit onClick={()=>{setCreateRuleForm(true);setId(elem)}}/>
      // </MDButton>
    );
    battleRule.rule= (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.rule}
      </MDTypography>
    );
    battleRule.order = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.order}
      </MDTypography>
    );
    battleRule.status = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.status}
      </MDTypography>
    );

    rows.push(battleRule)
  })

      // console.log(rows)

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
                      <MDButton hidden={true} variant="outlined" size="small" onClick={()=>setCreateRuleForm(true)}>
                          Create battle Rule
                      </MDButton>
                  </MDBox>
                    {createRuleForm && <>
                      <CreateRuleForm createRuleForm={createRuleForm} setCreateRuleForm={setCreateRuleForm} battle={battle} ruleObj={id}/>
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

  export default BattleRules;