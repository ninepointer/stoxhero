import React from "react";
import axios from "axios";
import { useEffect, useState, useContext, useRef, useReducer } from "react";
// @mui material components
// import { Chart } from 'chart.js/auto';
import Grid from "@mui/material/Grid";
import MDButton from "../../../components/MDButton";
import MDBox from "../../../components/MDBox";
import TextField from '@mui/material/TextField';
import { RxCross2 } from 'react-icons/rx';
import { AiOutlineSearch } from 'react-icons/ai';
import { apiUrl } from '../../../constants/constants';
import MDSnackbar from "../../../components/MDSnackbar";

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


function Users({setUpdated, id}) {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  let textRef = useRef(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);

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
    if(data == ""){
      dispatch({ type: 'setEmptyUserData', payload: [] });
      return;
    }


    axios.get(`${baseUrl}api/v1/user/searchuser?search=${data}`, {
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      },
    })
    .then((res)=>{
      dispatch({ type: 'setUser', payload: (res?.data?.data) });
    }).catch((err)=>{
      //console.log(err);
    })
  }

  async function addAffiliate(elem){

        const res = await fetch(`${apiUrl}affiliate/${id}/${elem._id}`, {
          method: "PATCH",
          credentials: "include",
          headers: {
            "content-type": "application/json",
            "Access-Control-Allow-Credentials": true
          },
          body: JSON.stringify({
            myReferralCode: elem.myReferralCode
          })
    
        });
    
        const data = await res.json();
        const updatedData = data?.data
        if (updatedData || res.status === 200) {
            setUpdated(data.data)
            openSuccessSB("User Added to Affiliate Program", data.message)
        } else {
            openErrorSB("Notification", data.message)
        }
    
  }

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = (title, content) => {
    setTitle(title)
    setContent(content)
    setSuccessSB(true);
  }
  const closeSuccessSB = () => setSuccessSB(false);


  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title={title}
      content={content}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
    />
  );

  const [errorSB, setErrorSB] = useState(false);
  const openErrorSB = (title, content) => {
    setTitle(title)
    setContent(content)
    setErrorSB(true);
  }
  const closeErrorSB = () => setErrorSB(false);

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title={title}
      content={content}
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  return (
    <MDBox sx={{ backgroundColor: "white", display: "flex", borderRadius: 2, marginBottom: 2 }}>
      <MDBox display="flex" flexDirection="column" justifyContent="space-between" sx={{ width: "100%" }}>
        <TextField
          id="outlined-basic"
          // label="Click here to search any symbol and add them in your watchlist to start trading" 
          variant="outlined"
          type="text"
          placeholder="Add user to affiliate program"
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
                    <Grid container lg={12} key={elem._id} mt={1}
                      sx={{
                        
                        fontSize: 13,
                        display: "flex",
                        // gap: "2px",
                        alignItems: "center",
                        alignContent: "center",
                        // // flexDirection: "row",
                        justifyContent: "center",
                        border: "0.25px solid white",
                        // borderRadius: 2,
                        // backgroundColor: 'white',
                        // color: "lightgray",
                        marginLeft: "2px",
                        paddingLeft: "1px",
                        '&:hover': {
                          color: '#1e2e4a',
                          backgroundColor: 'lightgray',
                          cursor: 'pointer',
                          fontWeight: 600
                        }
                      }}
                    >
                      <Grid xs={3} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem?.first_name + " " + elem?.last_name}</Grid>
                      <Grid xs={3} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem.mobile}</Grid>
                      <Grid xs={3} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem.email}</Grid>
                      <Grid xs={3} lg={3} >

                        {/* <SearchModel reRender={reRender} setReRender={setReRender} elem={elem} /> */}
                        <MDButton onClick={()=>{addAffiliate(elem)}}>
                            Add
                        </MDButton>
                      </Grid>
                    </Grid>
                  )}
                </>
              )
            }))
          }
        </MDBox>
          {renderSuccessSB}
          {renderErrorSB}
      </MDBox>
    </MDBox>
  )
}
export default Users;