import { Box, Container, Grid, Stack, Typography } from '@mui/material'
import React from 'react'
import { section2Content } from '../utils/content'
import CountUp from "react-countup";
import Title  from '../components/Title';

const {items} = section2Content
// const countUpRef = React.useRef(null);
const CustomCounter = ({
  before = "",
  after = "",
  counter,
  subtitle,
  decimals = false,
  name,
  data
}) => (
  <Stack textAlign="center" spacing={{ xs: 1, md: 2 }} alignItems="center">
    <CountUp start={0} prefix={before} suffix={after} end={counter + data?.[name]} decimals={decimals} duration={3} useEasing={true} redraw>
      {({ countUpRef }) => (
        <Title variant={{ xs: "h4", md: "h2" }} style={{color:"white"}} sx={{ fontWeight: 400 }}>
          <span sx={{color:"white"}} ref={countUpRef} />
        </Title>
      )}
    </CountUp>

    <Typography variant="body2" color="gray">
      {subtitle}
    </Typography>
  </Stack>
);

const Section2 = ({data}) => {
  return (
    <Container sx={{ mt:{xs:"-12px"} }}>
     <Box
     bgcolor={'#06070A'}
        sx={(theme) => ({
          position: "relative",
          py: 5,
          
          borderRadius: "50px",
          [theme.breakpoints.up("sm")]: {
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              border: "2px solid transparent",
              borderRadius: "50px",
              background: "linear-gradient(180deg,grey,transparent) border-box",
              WebkitMask:
                "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exlude",
            },
          },
        })}
      >
        <Grid container spacing={3} justifyContent="space-between">
          {items.map((item, index)=>(
            <Grid item xs={6} md={4} lg={3} key={item.subtitle}>
              <CustomCounter  {...item} data={data} />
            </Grid>
            
          ))}
        </Grid>
      </Box>
    </Container>
  )
}

export default Section2