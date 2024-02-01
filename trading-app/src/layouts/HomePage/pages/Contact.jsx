import { Box, Button, Card, CardContent, Grid, Stack, TextField,Typography } from '@mui/material'
import theme from '../utils/theme/index'
import Navbar from '../components/Navbars/Navbar'
import React, { useState, useEffect } from 'react'
import Footer from '../../authentication/components/Footer'
import { ThemeProvider } from 'styled-components';
import MDBox from '../../../components/MDBox';
import { apiUrl } from '../../../constants/constants'
import axios from 'axios';
import MDTypography from '../../../components/MDTypography'
import MDSnackbar from '../../../components/MDSnackbar'
import { Helmet } from 'react-helmet';

const Contact = () => {

    let [data, setData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        message:""
    })

    useEffect(()=>{
        window.webengage.track('contact_us_clicked', {
        })
    }, [])

    let [newData, setNewData] = useState([])

    let[sucess,setSucess] = useState(false);
    let [invalidDetail, setInvalidDetail] = useState('');
    const [successSB, setSuccessSB] = useState(false);
    const [messageObj, setMessageObj] = useState({
        color: '',
        icon: '',
        title: '',
        content: ''
      });
  const openSuccessSB = (value,content) => {
    // console.log("Value: ",value)
    if(value === "submitted"){
        messageObj.color = 'info'
        messageObj.icon = 'check'
        messageObj.title = "Success";
        messageObj.content = content;

    };
    if(value === "error"){
      messageObj.color = 'error'
      messageObj.icon = 'error'
      messageObj.title = "Error";
      messageObj.content = content;

  }
    if(value === "resent otp"){
      messageObj.color = 'info'
      messageObj.icon = 'check'
      messageObj.title = "OTP Resent";
      messageObj.content = content;
    };

    setMessageObj(messageObj);
    setSuccessSB(true);
  }
  const closeSuccessSB = () => setSuccessSB(false);

  const renderSuccessSB = (
    <MDSnackbar
      color= {messageObj.color}
      icon= {messageObj.icon}
      title={messageObj.title}
      content={messageObj.content}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
      sx={{ borderLeft: `10px solid ${"blue"}`, borderRadius: "15px"}}
    />
  );
    

    const HandleChange = (e) => {

     let { name, value } = e.target;

        setData((prev) => {
            return {
                ...prev, [name]: value
            }
        })

    }

    const HandleSubmit = (e) => {

        e.preventDefault();
        setNewData([...newData, data]);    
        setSucess(true)
        setData({fname:"",lname:"",email:"",contact:""})
    }

    const onSubmit = async (e) =>{
        e.preventDefault();
        const{first_name, last_name, email, phone, message} = data;
        if(!first_name || !last_name || !email || !phone){
            //show error
            openSuccessSB('error', 'Fill all required fields');
            return;
        }
        if(phone.length !== 10){

            if(phone.length === 12 && phone.startsWith('91')){
              
            }else if(phone.length === 11 && phone.startsWith('0')){

            }
             else{
              return openSuccessSB("error", `Please Check Your Number Again${phone}`);
            }
          }
        try{
            const res = await axios.post(`${apiUrl}contactus`,{first_name,last_name,email,phone,message});
            console.log(res.data);
            //Show the success message
            if(res.status == 201 || res.status == 200){
                openSuccessSB('submitted', 'Entry submitted. We\'ll get back to you soon.' );
            }else{
                openSuccessSB('error', res.data.message);
            }
            //Clear the state
            setData((prev)=>{
                return {
                    first_name: "",
                    last_name: "",
                    email: "",
                    phone: "",
                    message:""
                }
            });
        }catch(e){
            console.log(e);
            openSuccessSB('error', e?.response?.data?.message);
        }
        
    }    
    setTimeout(()=>{
        if(sucess===true){
            setSucess(false)
        }

    },3000)
    
    
    return (

        <div>
            <ThemeProvider theme={theme}>
            <Helmet>
                <title>Contact StoxHero - Reach Out for Support, Queries & Feedback</title>
                <meta name='description' content='Connect with StoxHero for any inquiries or support needs. Our team is ready to assist you with your questions and provide timely help.' />
                <meta name='keywords' content='learn stock market, learn stock market trading, stock market learning course, learn how to invest in stock market, how to learn stock market trading in india, best way to learn stock market, trading, stock market learning app, best app for virtual trading, trading chart patterns, social trading,stock price today, online trading, trading competition, share trading competition, trading competition in india' />
            </Helmet>
            <Box style={{  width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", background: "grey" }}>
            <Navbar/>


            
            <Card style={{ maxWidth: 470,margin: "80px auto", padding: "15px 5px", textAlign: "left" }} sx={{ xs: "20px" }} >
                <CardContent>

                    <Typography gutterBottom variant='h5' style={{textAlign:'center'}}>Get in Touch with StoxHero - Contact Us Today</Typography>
                    <Typography gutterBottom variant='body2' style={{textAlign:'center'}} component="p" color="gray">Fill up the form and our team will get back to you within 24 hours.</Typography>

                    <form onSubmit={HandleSubmit} >


                        <Grid container spacing={2}>

                            <Grid item xs={12} sm={12} lg={12}>

                                <TextField value={data.first_name} name='first_name' label="First Name" placeholder='Enter first name' variant='outlined' fullWidth required onChange={HandleChange} />

                            </Grid>

                            <Grid item xs={12} sm={12} lg={12}>

                                <TextField value={data.last_name} name='last_name' label="Last Name" placeholder='Enter last name' variant='outlined' fullWidth required onChange={HandleChange} />

                            </Grid>

                            <Grid item xs={12} sm={12}  lg={12}>

                                <TextField value={data.email} name='email' type='email' label="Email" placeholder='Enter email' variant='outlined' fullWidth required onChange={HandleChange} />

                            </Grid>

                            <Grid item xs={12} sm={12}  lg={12}  >

                                <TextField value={data.phone} name='phone' type='number' label="Phone" placeholder='Enter 10 digit phone number' variant='outlined' fullWidth required onChange={HandleChange} />

                            </Grid>

                             <Grid item xs={12} sm={12}  lg={12}  >
                             <TextField
                                id="outlined-multiline-static"
                                value={data.message}
                                label="Message"
                                name='message'
                                multiline
                                fullWidth
                                rows={4}
                                placeholder='Enter message'
                                onChange={HandleChange}
                                />     
                            </Grid>

                            <Grid item xs={12} sm={12}  lg={12}  >

                                <Button type='submit' variant='contained' style={{backgroundColor:'#65BA0D', color:'white'}} fullWidth onClick={onSubmit}>Submit</Button>

                            </Grid>
                        </Grid>

                    </form>
                </CardContent>
            </Card>
            
            


            
        </Box>
        {renderSuccessSB}
        </ThemeProvider>
        <MDBox>
            <Footer/>
        </MDBox>
        </div>
    )
}

export default Contact