import { Box, Container, Grid, Stack } from '@mui/material'
import Title from '../components/Title/index'
import React from 'react'
import ServiceCard from '../components/Cards/ServiceCard'


const About = () => {
    return (
        <Box>

            

            <Container sx={{border:"2px solid red",height:"1200"}} >
                <Grid container spacing={10} flexWrap="wrap-reverse" alignItems="center" sx={{mt:{xs:10,md:15}}}>
                    <Grid item xs={12} md={6}  >
                        <Stack spacing={2} sx={{ maxWidth: 480 }}>
                            <Title variant={{ xs: 'h3', sm: 'h2', md: 'h1' }} sx={{ letterSpacing: "0.02em", mb: 1 }}>StoxHero</Title>
                            <Title variant={{ xs: 'body1', sm: 'body1', md: "body1" }} sx={{ fontWeight: 500, letterSpacing: "0.05em", mb: 6 }} >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Placeat culpa explicabo modi, officiis illum, cum sed molestiae, accusamus aliquid aut neque ullam!</Title>

                        </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <img src="https://www.purple-trading.com/PurpleTrading/media/static-media/3fe36968-891e-4e97-9584-d041e4161cc1@w1000.png" style={{width:"100%",objectFit:"contain"}} />
                    </Grid>
                </Grid>
            </Container>

            <Container sx={{}}>
                <ServiceCard image="https://w7.pngwing.com/pngs/78/399/png-transparent-communication-community-connection-diversity-exchange-networking-relationship-digital-marketing-gradient-rave-and-glow-icon.png" title="This is stox market" subtitle="You cana do a lot things with investing"/>
            </Container>

        </Box>
    )
}

export default About