import * as React from 'react';
import MDButton from '../../../components/MDButton';
import {useState} from "react";
import LoginIcon from '@mui/icons-material/Login';

const AutoLogin = ({data}) => {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const [accessAndRequest, setAccessAndRequest] = useState([])

  // useEffect(()=>{
  //   axios.get(`${baseUrl}api/v1/readRequestToken`)
  //   .then((res)=>{
  //     let data = res.data;
  //     let active = data.filter((elem) => {
  //         return elem.status === "Active" && elem.generatedOn !== generatedOn;
  //     })
  //     setAccessAndRequest(active);

  //   }).catch((err)=>{
  //       return new Error(err);
  //   })
  // }, [])

  // let optionData = [];
  // for(let i =0; i< activeApiKey.length; i++){
  //     optionData.push( <MenuItem value={activeApiKey[i].accountId}>{activeApiKey[i].accountId}</MenuItem>)      
  // }

  // console.log("option data", optionData, activeApiKey)

  async function formbtn() {

      const res = await fetch(`${baseUrl}api/v1/autologin`, {
          method: "POST",
          credentials: "include",
          headers: {
              "content-type": "application/json"
          },
          body: JSON.stringify({
              accountId: data.accountId, apiKey: data.apiKey, apiSecret: data.apiSecret, status: "Active"
          })
      });

      const resp = await res.json();
      console.log(resp);
      if (resp.status === 422 || resp.error || !resp) {
          window.alert(resp.error);
          console.log("invalid entry");
      } else {
          window.alert("entry succesfull");
          console.log("entry succesfull");
      }

      // console.log("accessAndRequest", accessAndRequest)

      // accessAndRequest.map(async (elem)=>{

      //   const res2 = await fetch(`${baseUrl}api/v1/inactiveRequestToken/${elem._id}`, {
      //     method: "PATCH",
      //     headers: {
      //         "content-type": "application/json"
      //     },
      //     body: JSON.stringify({
      //         lastModified, status: "Inactive"
      //     })
      //   });
  
      //   const data2 = await res2.json();
      //   console.log(data2);
      //   if (data2.status === 422 || data2.error || !data2) {
      //       window.alert("Error in inactivating access token");
      //       console.log("invalid entry");
      //   } else {
      //       // window.alert("Inactive succesfull");
      //       console.log("entry succesfull");
      //   }

      // })

      // reRender ? setReRender(false) : setReRender(true)
  }

  return (
    <>
      <MDButton variant="" color="black"  onClick={formbtn}>
        <LoginIcon />
      </MDButton>
    </>
  );
}

export default AutoLogin