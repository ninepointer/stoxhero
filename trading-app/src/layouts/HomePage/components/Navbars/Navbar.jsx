import { AppBar, Box, Container, IconButton, List, ListItemButton, ListItemText, Stack, Typography, useMediaQuery } from '@mui/material'
import React, { useState } from 'react'

import useScrollPosition from '../../hooks/useScrollPosition'

import logo from '../../assets/images/Logo.png'
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { CallMade, Language, Menu } from '@mui/icons-material'
import LaunchButton from '../Buttons/LaunchButton'
import { useTheme } from 'styled-components'


import theme from '../../utils/theme/index';





const NAVBAR_HIEGHT = 65;
const LinkButton = ({ children, ...props }) => (
  <Stack
    direction="row"
    alignItems="center"
    spacing={0.2}
    sx={{
      cursor: "pointer",
      color: theme.palette.text.secondary,
      "&:hover": { color: 'black'},
    }}
    {...props}
  >
    {children}
  </Stack>
);


const Navbar = () => {

  const scrollPosition = useScrollPosition();

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"))

  const[open,setOpen] = useState(false);

  const Handle = (e)=>{

    

    

    if(isMobile){
      setOpen(true)
    }

    
    
  }

  


  return (
    <AppBar elevation={0} sx={{ height: NAVBAR_HIEGHT, bgcolor: scrollPosition > 10 ? "rgba(7,7,16,.7)" : "rgba(7,7,16,.7)", backdropFilter: scrollPosition > 10 && "blur(60px)" }}>

      <Container sx={{ [theme?.breakpoints?.down("lg")]: {maxWidth: "1300!important"}  }}>
        <Stack direction='row' justifyContent='space-between' alignItems="center" flexWrap="wrap"  alignContent='center' >
          {/* Logo */}

          <a href="/home"><img src={logo} style={{ objectFit: "contain", height: "100%", marginTop: "8px" }} /></a>


          {!isMobile && (<Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={6}
            sx={{ flex: 1 }}
            flexWrap="wrap"
            color="white"
          >
            <a href="/Login">
            <LinkButton>
              <Typography variant="body2">Login</Typography>
              
            </LinkButton>
            </a>

            <a href="/Signup">
            <LinkButton>
              <Typography variant="body2">Signup</Typography>
              
            </LinkButton>
            </a>

            <a href="/careers">
            <LinkButton>
              <Typography variant="body2">Careers</Typography>
              
            </LinkButton>
            </a>

            <a href="/about">
            <LinkButton spacing={0.5}>
              <Typography variant="body2">About us</Typography>
              
            </LinkButton>
            </a>
          </Stack>)}

          {open&& (
            
            <Stack
            direction="column"
            alignItems="center"
            justifyContent="flex-start"
            spacing={4}
            sx={{ flex: 1, background:"rgb(3,2,22)",width:"100%",height:"100vh"}}
            flexWrap="wrap"
            position="absolute"
            top="0"
            right={0}
          
            
          >
            < img src ="https://icon-library.com/images/x-button-icon/x-button-icon-3.jpg" style={{height:"40px",position:"absolute",top:"8px",color:"#fff", right:"14px",}} sx={{fontSize:"100px"}} onClick={()=>setOpen(false)}/>
            
            <LinkButton>
              <Typography variant="body2">Products</Typography>
              <KeyboardArrowDownIcon fontSize="small" />
            </LinkButton>

            <LinkButton sx={{color: scrollPosition>10 ? 'rgb(255,250,250)' : 'rgb(255,250,250)'}}>
              <Typography variant="body2">Careers</Typography>
              <KeyboardArrowDownIcon fontSize="small" />
            </LinkButton>

            <LinkButton sx={{color: scrollPosition>10 ? 'rgb(255,250,250)' : 'rgb(255,250,250)'}}>
              <Typography variant="body2">About</Typography>
              <KeyboardArrowDownIcon fontSize="small" />
            </LinkButton>

            <LinkButton spacing={0.5} sx={{color: scrollPosition>10 ? 'rgb(255,250,250)' : 'rgb(255,250,250)'}}>
              <Typography variant="body2">Blog</Typography>
              <CallMade sx={{ fontSize: 12 }} />
            </LinkButton>
            
            </Stack>
          )}

          {/* Action buttons */}


          {isMobile ? (
            <IconButton>
              <Menu onClick={Handle} sx={{ color: "rgba(255, 255, 255, 0.6)" }} />
            </IconButton>
          ) : (<Stack direction="row" spacing={5} alignItems="center">
            <LinkButton spacing={1} sx={{color: scrollPosition>10 ? 'rgb(255,250,250)' : 'rgb(255,250,250)'}}>
              <Language fontSize="small" />
              <Typography variant="body2">EN</Typography>
            </LinkButton>

            <a href="/Login">
            <LaunchButton sx={{ borderRadius: 3, color:'light' }} />
            </a>
          </Stack>)
          }


        </Stack>
      </Container>

    </AppBar>
  )
}

export default Navbar