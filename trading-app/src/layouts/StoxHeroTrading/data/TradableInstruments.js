import React from "react";
import axios from "axios";
import { useEffect, useState, useContext, useRef, useReducer } from "react";
// @mui material components
import { Chart } from 'chart.js/auto';
// Chart.register(...registerables);
import Grid from "@mui/material/Grid";
// import Input from "@mui/material/Input";

// Material Dashboard 2 React components

// import MDButton from "../";
import MDButton from "../../../components/MDButton";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import TextField from '@mui/material/TextField';
import { RxCross2 } from 'react-icons/rx';
import { AiOutlineSearch } from 'react-icons/ai';

import uniqid from "uniqid"


function TradableInstrument() {

  
  return (
    <MDBox sx={{backgroundColor:"white", display:"flex", borderRadius:2, marginBottom:2}}>
      <MDBox display="flex" flexDirection="column" justifyContent="space-between" sx={{width:"100%"}}>
        <TextField
          id="outlined-basic" 
          // label="Click here to search any symbol and add them in your watchlist to start trading" 
          variant="outlined" 
          type="text"
          placeholder="Click here to search any symbol and add them in your watchlist to start trading"
          // value={state.text}
          // inputRef={textRef}
          InputProps={{
            // onFocus: () => textRef.current.select(),
            endAdornment: (
              <MDButton variant="text" color="dark" >{<RxCross2/>}</MDButton>
            ),
            startAdornment: (
              <>{<AiOutlineSearch/>}</>
            ),
          }}
          sx={{margin: 0, background:"white",padding : 0, borderRadius:2 ,width:"100%",'& label': { color: '#49a3f1', fontSize:20, padding:0.4 }}}  //e.target.value.toUpperCase()
          />
        <MDBox>
        </MDBox>
      {/* <TradableInstrument instrumentsData={instrumentsData} reRender={reRender} setReRender={setReRender} uId={uId} /> */}
      </MDBox>
    </MDBox>
)
}

export default TradableInstrument;
