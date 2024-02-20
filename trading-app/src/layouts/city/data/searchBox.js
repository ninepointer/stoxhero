import React from "react";
import axios from "axios";
import { useEffect, useState, useContext, useRef, useReducer } from "react";
// @mui material components
import MDButton from "../../../components/MDButton";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import TextField from '@mui/material/TextField';
// import { createTheme } from '@mui/material/styles';
import { RxCross2 } from 'react-icons/rx';
import { AiOutlineSearch } from 'react-icons/ai';
// import { userContext } from "../../AuthContext";
import { userContext } from "../../../AuthContext";
import { apiUrl } from "../../../constants/constants";

const initialState = {
  searchData: [],
  successSB: false,
  text: '',
  timeoutId: null,
  addOrRemoveCheck: null,
  instrumentName: ''
};

function reducer(state, action) {
  switch (action.type) {
    case 'setEmptySearchData':
      return { ...state, searchData: action.payload };
    case 'setSearchData':
      return { ...state, searchData: action.payload };
    case 'setText':
      return { ...state, text: action.payload };
    case 'setEmptyText':
      return { ...state, text: action.payload };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}


function SearchBox({setData}) {

  let textRef = useRef(null);
//   const PAGE_SIZE = 20;
  const [timeoutId, setTimeoutId] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const getDetails = useContext(userContext);



  function sendSearchReq(e) {
    const value = e.target.value;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    setTimeoutId(
      setTimeout(() => {
        // window.webengage.track('search_instrument_clicked', {
        //   user: getDetails?.userDetails?._id,
        //   searchString: value
        // })
        sendRequest(value);
      }, 400)
    );
  }


  function sendRequest(data){

    if(data == ""){
      dispatch({ type: 'setEmptySearchData', payload: [] });
      return;
    }

    if (data) {
      axios.get(`${apiUrl}cities/bysearch?search=${data}`, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
      })
        .then((res) => {
          dispatch({ type: 'setSearchData', payload: (res.data) });
          setData(res.data?.data)
        }).catch((err) => {
          //console.log(err);
        })
    }
  }




  return (
    <MDBox sx={{backgroundColor:"white", display:"flex", borderRadius:2, marginBottom:2}}>
      <MDBox display="flex" flexDirection="column" justifyContent="space-between" sx={{width:"100%"}}>
        <TextField
          id="outlined-basic" 
          variant="outlined" 
          type="text"
          placeholder="Search city or state here!"
          value={state.text}
          inputRef={textRef}
          sx={{margin: 0, background:"white",padding : 0, borderRadius:2 ,width:"100%",'& label': { color: '#49a3f1', fontSize:20, padding:0.4 }}} 
          onChange={(e)=>{dispatch({ type: 'setText', payload: e.target.value });sendSearchReq(e)}} //e.target.value.toUpperCase()
        />
      </MDBox>
    </MDBox>
)
}

export default SearchBox;
