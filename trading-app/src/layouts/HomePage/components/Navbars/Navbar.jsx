import { AppBar, Box, Container, Drawer, IconButton, List, ListItemButton, ListItemText, Stack, Typography, useMediaQuery } from '@mui/material'
import React, { useState } from 'react'
// import { NAVBAR_HIEGHT } from '../../constants'
import useScrollPosition from '../../hooks/useScrollPosition'
import { navbarContent } from '../../utils/content'
import logo from '../../assets/images/Logo.png'
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { CallMade, Language, Menu } from '@mui/icons-material'
import LaunchButton from '../Buttons/LaunchButton'
import { useTheme } from 'styled-components'
import CancelIcon from '@mui/icons-material/Cancel';




const NAVBAR_HIEGHT = 72;
const LinkButton = ({ children, ...props }) => (
  <Stack
    direction="row"
    alignItems="center"
    spacing={0.2}
    sx={{
      cursor: "pointer",
      color: "text.secondary",
      "&:hover": { color: "text.primary" },
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

    e.preventDefault()

    

    if(isMobile){
      setOpen(true)
    }

    
    
  }

  


  return (
    <AppBar elevation={0} sx={{ height: NAVBAR_HIEGHT, bgcolor: scrollPosition > 10 ? "rgba(7,7,16,.7)" : "transparent", backdropFilter: scrollPosition > 10 && "blur(60px)", }}>

      <Container sx={{ [theme.breakpoints.down("lg")]: { maxWidth: "1300!important" } }}>
        <Stack direction='row' justifyContent='space-between' alignItems="center" flexWrap="wrap" >
          {/* Logo */}

          <img src={logo} style={{ objectFit: "contain", height: "100%", marginTop: "9px" }} />


          {!isMobile && (<Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={6}
            sx={{ flex: 1 }}
            flexWrap="wrap"
          >
            <LinkButton>
              <Typography variant="body2">Products</Typography>
              <KeyboardArrowDownIcon fontSize="small" />
            </LinkButton>

            <LinkButton>
              <Typography variant="body2">Developers</Typography>
              <KeyboardArrowDownIcon fontSize="small" />
            </LinkButton>

            <LinkButton>
              <Typography variant="body2">Governance</Typography>
              <KeyboardArrowDownIcon fontSize="small" />
            </LinkButton>

            <LinkButton>
              <Typography variant="body2">About</Typography>
              <KeyboardArrowDownIcon fontSize="small" />
            </LinkButton>

            <LinkButton spacing={0.5}>
              <Typography variant="body2">Blog</Typography>
              <CallMade sx={{ fontSize: 12 }} />
            </LinkButton>
          </Stack>)}

          {open&& (
            
            <Stack
            direction="column"
            alignItems="center"
            justifyContent="flex-start"
            spacing={4}
            sx={{ flex: 1, background:"rgb(3,2,22)",width:"100%",height:"100vh" }}
            flexWrap="wrap"
            position="absolute"
            top="0"
            right={0}
          
            
          >
            < CancelIcon sx={{position:"absolute",right:"14px",top:"7px",color:"white", fontSize:"65px"}} onClick={()=>setOpen(false)}/>
            <LinkButton>
              <Typography variant="body2">Products</Typography>
              <KeyboardArrowDownIcon fontSize="small" />
            </LinkButton>

            <LinkButton>
              <Typography variant="body2">Developers</Typography>
              <KeyboardArrowDownIcon fontSize="small" />
            </LinkButton>

            <LinkButton>
              <Typography variant="body2">Governance</Typography>
              <KeyboardArrowDownIcon fontSize="small" />
            </LinkButton>

            <LinkButton>
              <Typography variant="body2">About</Typography>
              <KeyboardArrowDownIcon fontSize="small" />
            </LinkButton>

            <LinkButton spacing={0.5}>
              <Typography variant="body2">Blog</Typography>
              <CallMade sx={{ fontSize: 12 }} />
            </LinkButton>
            </Stack>
          )}

          {/* Action buttons */}


          {isMobile ? (
            <IconButton>
              <Menu onClick={Handle} sx={{ color: "text.secondary" }} />
            </IconButton>
          ) : (<Stack direction="row" spacing={5} alignItems="center">
            <LinkButton spacing={1}>
              <Language fontSize="small" />
              <Typography variant="body2">EN</Typography>
            </LinkButton>

            <LaunchButton sx={{ borderRadius: 3 }} />
          </Stack>)
          }


        </Stack>
      </Container>

    </AppBar>
  )
}

export default Navbar