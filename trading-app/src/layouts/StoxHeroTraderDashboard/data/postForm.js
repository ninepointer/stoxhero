import React, {useEffect, useState, useContext} from 'react'
import { userContext } from "../../../AuthContext";
import MDBox from '../../../components/MDBox'
import MDButton from '../../../components/MDButton';
import ReactGA from "react-ga"
import { CircularProgress, formLabelClasses } from "@mui/material";
import { Grid, Input, TextField } from '@mui/material'
import MDTypography from '../../../components/MDTypography';
import MDSnackbar from "../../../components/MDSnackbar";
import MDAvatar from '../../../components/MDAvatar';
import axios from "axios";
import {useLocation} from 'react-router-dom';

const PostForm = ({postCount, setPostCount}) => {
  const setDetails = useContext(userContext);
  const [submitted,setSubmitted] = useState(false)
  const [saving,setSaving] = useState(false)
  const [creating,setCreating] = useState(false)
  const [post,setPost] = useState()
  const location = useLocation();
  const postedBy = setDetails?.userDetails?._id
  let postedOn = ''
  const [formState, setFormState] = useState({
    post: '',
  });

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

  useEffect(()=>{
    ReactGA.pageview(window.location.pathname)
  },[])

  async function onSubmit(e, formState) {
    e.preventDefault()
    if (!formState.post) {
      setTimeout(() => { setCreating(false); setSubmitted(false) }, 500)
      return 
    //   openErrorSB("Missing Field", "Please fill all the mandatory fields")
    }

    setTimeout(() => { setCreating(false); setSubmitted(true) }, 500)
    const { post } = formState;
    const res = await fetch(`${baseUrl}api/v1/post/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        post, postedBy, postedOn : new Date()
      })
    });


    const data = await res.json();
    if (data.status !== 'success') {
      setTimeout(() => { setCreating(false); setSubmitted(false) }, 500)
    //   openErrorSB("Post not created", data?.message)
    } else {
      openSuccessSB("Posted Successfully",data?.message, data?.status)
      setSubmitted(true)
      setPost(data?.data);
      setTimeout(() => { setCreating(false); setSubmitted(true) }, 500)
      setFormState(prevState => ({...prevState, post: ''}))
      console.log("Post Count",data?.count)
      setPostCount(data?.count)
    }
  }

  const [successSB, setSuccessSB] = useState(false);
  const [msgDetail, setMsgDetail] = useState({
    title: "",
    content: "",
    // successSB: false,
    color: "",
    icon: ""
  })
  const openSuccessSB = (title,content,message) => {
    msgDetail.title = title;
    msgDetail.content = content;
    if(message === "success"){
      msgDetail.color = 'success';
      msgDetail.icon = 'check'
    } else {
      msgDetail.color = 'error';
      msgDetail.icon = 'warning'
    }
    // console.log(msgDetail)
    setMsgDetail(msgDetail)
    setSuccessSB(true);
  }

  const closeSuccessSB = () =>{
    setSuccessSB(false);
  }


  const renderSuccessSB = (
  <MDSnackbar
      color={msgDetail.color}
      icon={msgDetail.icon}
      title={msgDetail.title}
      content={msgDetail.content}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
  />
  );

  return (
        <MDBox sx={{height:"auto"}} style={{ backgroundColor:'white'}}>

                <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                    
                    <Grid item xs={1} md={1} lg={1} display='flex' justifyContent='center' alignItems='center'>
                        <MDAvatar
                        style={{ backgroundColor: 'lightgrey' }}
                        src={setDetails?.userDetails?.profilePhoto?.url ? setDetails?.userDetails?.profilePhoto?.url : ''}
                        alt={setDetails?.userDetails?.first_name}
                        />
                    </Grid>
                    <Grid item xs={9.5} md={9.5} lg={9.5} display='flex' justifyContent='center' alignItems='center'>
                    <TextField
                        required
                        // disabled={otpGenerated}
                        id="outlined-required"
                        label="What's on your mind?"
                        type="text"
                        fullWidth
                        multiline
                        rowsMax={10}
                        onKeyDown={(e) => {
                          if(e.keyCode === 13 && !e.shiftKey) {
                            e.preventDefault();
                            setFormState(prevState => ({...prevState, post: ''}))
                          }
                        }}
                        value = {formState.post}
                        onChange={(e)=>{setFormState(prevState => ({...prevState, post: e.target.value}))}}
                      />
                    </Grid>

                    <Grid item xs={1.5} md={1.5} lg={1.5} display='flex' justifyContent='center' alignItems='center'>
                    <MDBox>
                      <MDButton 
                        variant="gradient" 
                        color="info"
                        onClick={(e) => { onSubmit(e, formState) }}
                       >
                        Post
                      </MDButton>
                    </MDBox>
                    </Grid>
                </Grid>
                {renderSuccessSB} 
            </MDBox>     
  )
}

export default PostForm