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
import MDButton from "../../components/MDButton";
// import MDSnackbar from "../../../components/MDSnackbar";
// import { userContext } from "../../../AuthContext";
// import { Tooltip } from '@mui/material';




// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import TextField from '@mui/material/TextField';
// import { createTheme } from '@mui/material/styles';
import { RxCross2 } from 'react-icons/rx';
import { AiOutlineSearch } from 'react-icons/ai';
// import { userContext } from "../../AuthContext";
// import BuyModel from "../BuyModel";
// import SellModel from "../SellModel";
import { marketDataContext } from "../../MarketDataContext";
// import uniqid from "uniqid"
import { renderContext } from "../../renderContext";
// import { paperTrader, infinityTrader, tenxTrader, internshipTrader } from "../../../variables";
import { userContext } from "../../AuthContext";

const initialState = {
  userData: [],
  successSB: false,
  text: '',
  timeoutId: null,
  addOrRemoveCheck: null,
  userInstrumentData: [],
  instrumentName: ''
};

function reducer(state, action) {
  switch (action.type) {
    case 'setEmptyUserData':
      return { ...state, userData: action.payload };
    case 'setUser':
      return { ...state, userData: action.payload };
    case 'openSuccess':
      return { ...state, successSB: action.payload };
    case 'closeSuccess':
      return { ...state, successSB: action.payload };
    case 'setText':
      return { ...state, text: action.payload };
    case 'setEmptyText':
      return { ...state, text: action.payload };
    case 'setValueInText':
      return { ...state, text: action.payload };
    case 'setAddOrRemoveCheckFalse':
      return { ...state, addOrRemoveCheck: action.payload };
    case 'setAddOrRemoveCheckTrue':
      return { ...state, addOrRemoveCheck: action.payload };
    case 'setUserInstrumentData':
      return { ...state, userInstrumentData: action.payload };
    case 'setInstrumentName':
      return { ...state, instrumentName: action.payload };
  

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}


function Users({contestId, setUpdatedDocument}) {

  //console.log("rendering in userPosition: Users", from)
  const {render, setRender} = useContext(renderContext);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  let textRef = useRef(null);
  const PAGE_SIZE = 20;
  const marketDetails = useContext(marketDataContext)
  const [timeoutId, setTimeoutId] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [buyState, setBuyState] = useState(false);
  const [sellState, setSellState] = useState(false);
  const getDetails = useContext(userContext);

  const openSuccessSB = () => {
    return dispatch({ type: 'openSuccess', payload: true });
  }
  const closeSuccessSB = () => {
    return dispatch({ type: 'closeSuccess', payload: false });
  }

//   useEffect(()=>{
//     if(isGetStartedClicked){
//       textRef.current.focus();
//       // setValueInText
//       dispatch({ type: 'setValueInText', payload: 'NIFTY' });
//       // setText('17300CE');
//       sendSearchReq('NIFTY');
//       setIsGetStartedClicked(false)
//     }
//   },[isGetStartedClicked])


//   useEffect(()=>{
//     axios.get(`${baseUrl}api/v1/instrumentDetails`,{
//       withCredentials: true,
//       headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//           "Access-Control-Allow-Credentials": true
//       },
//     })
//     .then((res) => {
//         ////console.log("live price data", res)
//         dispatch({ type: 'setUserInstrumentData', payload: (res.data.data) });
//         // setUserInstrumentData(res.data);
//         // setDetails.setMarketData(data);
//     }).catch((err) => {
//         return new Error(err);
//     })
//   }, [render])


  function sendSearchReq(e) {
    // let newData += data
    // clear previous timeout if there is one
    const value = e?.target?.value ? e.target.value : e;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    setTimeoutId(
      setTimeout(() => {
        sendRequest(value);
      }, 400)
    );
  }

  function handleClear() {
    // setText('');
    dispatch({ type: 'setEmptyText', payload: '' });
    dispatch({ type: 'setEmptyUserData', payload: [] });
  }

  function sendRequest(data){


    //console.log("input value", data)
    if(data == ""){
      dispatch({ type: 'setEmptyUserData', payload: [] });
      return;
    }


    axios.get(`${baseUrl}api/v1/dailycontest/contestusers?search=${data}`, {
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      },
    })
    .then((res)=>{
      //console.log("instrumentData", res.data)
      // setUser(res.data)
      dispatch({ type: 'setUser', payload: (res?.data?.data) });


    }).catch((err)=>{
      //console.log(err);
    })
  }

  async function addUser(userId){
    axios.put(`${baseUrl}api/v1/dailycontest/contest/${contestId}/allow/${userId}`, {
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      },
    })
    .then((res)=>{
      //console.log("instrumentData", res.data)
      // setUser(res.data)
      dispatch({ type: 'setUser', payload: (res?.data?.data) });
      setUpdatedDocument(res?.data?.data)

    }).catch((err)=>{
      //console.log(err);
    })
  }



  return (
    <MDBox sx={{ backgroundColor: "white", display: "flex", borderRadius: 2, marginBottom: 2 }}>
      <MDBox display="flex" flexDirection="column" justifyContent="space-between" sx={{ width: "100%" }}>
        <TextField
          id="outlined-basic"
          // label="Click here to search any symbol and add them in your watchlist to start trading" 
          variant="outlined"
          type="text"
          placeholder="Type here to search any symbol and add them in your watchlist to start trading"
          value={state.text}
          inputRef={textRef}
          InputProps={{
            onFocus: () => textRef.current.select(),
            endAdornment: (
              <MDButton variant="text" color={"light"} onClick={handleClear}>{state.text && <RxCross2 />}</MDButton>
            ),
            startAdornment: (
              <>{<AiOutlineSearch />}</>
            ),
          }}
          sx={{ margin: 0, background: "white", padding: 0, borderRadius: 2, width: "100%", '& label': { color: '#49a3f1', fontSize: 20, padding: 0.4 } }} onChange={(e) => { dispatch({ type: 'setText', payload: e.target.value }); sendSearchReq(e) }} //e.target.value.toUpperCase()
        />
        <MDBox>
          {state.userData?.length > 0 &&
            (state.userData.map((elem, index) => {
              return (

                <>
                  {state.text && (
                    <Grid container lg={12} key={elem._id}
                      sx={{
                        fontSize: 13,
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        border: "0.25px solid white",
                        borderRadius: 2,
                        backgroundColor: 'white',
                        color: "lightgray",
                        padding: "0.5px",
                        '&:hover': {
                          color: '#1e2e4a',
                          backgroundColor: 'lightgray',
                          cursor: 'pointer',
                          fontWeight: 600
                        }
                      }}
                    >
                      <Grid sx={{ color: "white", textAlign: "center", display: { xs: 'none', lg: 'block' } }} xs={0} lg={3}>{elem.first_name + " " + elem.last_name}</Grid>
                      <Grid sx={{ display: { xs: 'none', lg: 'block' } }} xs={0} lg={3}>{elem.email}</Grid>
                      <Grid xs={5} lg={3}>{elem.mobile}</Grid>
                      <Grid xs={5} lg={3} mr={4} display="flex" justifyContent="space-between">
                        {/* {perticularInstrumentData.length ? */}
                        {/* <Grid lg={3}>
                          <MDButton size="small" color="secondary" sx={{ marginRight: 0.5, minWidth: 2, minHeight: 3 }} onClick={() => { removeUser(elem._id, "Remove") }}>-</MDButton>
                        </Grid>
                        : */}
                        <Grid lg={3}>
                          {/* <Tooltip title="Add Instrument" placement="top"> */}
                          <MDButton size="small" color="warning" sx={{ marginRight: 0.5, minWidth: 2, minHeight: 3 }} onClick={() => { addUser(elem._id, "Add") }}>+</MDButton>
                          {/* </Tooltip> */}
                        </Grid>
                        {/* } */}
                      </Grid>
                    </Grid>
                  )}
                  {/* {renderSuccessSB} */}
                </>
              )
            }))
          }
        </MDBox>
        {/* <Users userData={userData} render={render} setRender={setRender} uId={uId} /> */}
      </MDBox>
    </MDBox>
  )
}

export default Users;
