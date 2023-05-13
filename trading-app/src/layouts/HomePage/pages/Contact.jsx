import { Box, Button, Card, CardContent, Container, Grid, Stack, TextField,Typography } from '@mui/material'
import theme from '../utils/theme/index'
import Navbar from '../components/Navbars/Navbar'
import React, { useState } from 'react'
import Footer from '../components/Footers/Footer'
import { ThemeProvider } from 'styled-components';


const Contact = () => {

    let [data, setData] = useState({
        fname: "",
        lname: "",
        email: "",
        contact: ""
    })

    let [newData, setNewData] = useState([])

    let[sucess,setSucess] = useState(false);
    

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

    setTimeout(()=>{
        if(sucess===true){
            setSucess(false)
        }

    },3000)
    
    
    return (

        
        <div style={{  width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", background: "black" }}>
            <ThemeProvider theme={theme}>
            <Navbar/>



            <Card style={{ maxWidth: 450, margin: "150px auto", padding: "20px 5px", textAlign: "left" }} sx={{ sx: "20px" }} >
                <CardContent>

                    <Typography gutterBottom variant='h5'>Contact US</Typography>
                    <Typography gutterBottom variant='body2' component="p" color="gray">Fill up the form and our team will get back to you within 24 hours.</Typography>

                    <form onSubmit={HandleSubmit} >


                        <Grid container spacing={5}>

                            <Grid item xs={12} sm={6} >

                                <TextField value={data.fname} name='fname' label="First Name" placeholder='Enter first name' variant='outlined' fullWidth required onChange={HandleChange} />

                            </Grid>

                            <Grid item xs={12} sm={6} >

                                <TextField value={data.lname} name='lname' label="Last Name" placeholder='Enter last name' variant='outlined' fullWidth required onChange={HandleChange} />

                            </Grid>

                            <Grid item xs={12}  >

                                <TextField value={data.email} name='email' type='email' label="Email" placeholder='Enter email' variant='outlined' fullWidth required onChange={HandleChange} />

                            </Grid>

                            <Grid item xs={12}  >

                                <TextField value={data.contact} name='contact' type='number' label="Phone" placeholder='Enter phone number' variant='outlined' fullWidth required onChange={HandleChange} />

                            </Grid>

                            <Grid item xs={12}  >

                                <Button type='submit' variant='contained' sx={{color:"#fff"}} fullWidth>Submit</Button>

                            </Grid>


                            

                        </Grid>
                            {
                                sucess && (<Grid sx={{background:"green",color:"white",textAlign:"center", borderRadius:"20px",mt:"10px",pl:"-5px"}} item xs={10}>Submitted Sucessfully!</Grid>)
                            }

                    </form>
                </CardContent>
            </Card>


        </ThemeProvider>
            <Footer/>
        </div>
    )
}

export default Contact