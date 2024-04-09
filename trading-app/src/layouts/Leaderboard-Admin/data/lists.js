
import React, { useState, useEffect } from 'react'
import Card from '@mui/material/Card';
import { CardContent, CardMedia, Box, Typography, CardActionArea, Divider, Grid, CircularProgress } from '@mui/material';
import lives from "../../../assets/images/lives.png";
import champions from "../../../assets/images/champions.png";
import indeximage from "../../../assets/images/indeximage.png";
import twoTrophy from "../../../assets/images/twoTrophy.jpg";
import reachToCup from "../../../assets/images/reachToCup.jpg";
import { useMediaQuery } from "@mui/material";
import theme from "../../HomePage/utils/theme/index";
import MDButton from "../../../components/MDButton";


const List = ({leaderboardFor, handleChange}) => {

  const handlePageChange = (event, value) => {
    // setSkip((Number(value) - 1) * limitSetting)
  };

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const images = [lives, indeximage, reachToCup, twoTrophy, champions];

  return (
    <>
      <Grid
        display="flex"
        justifyContent="center"
        alignContent="center"
        alignItems="center"
        container
        xs={12}
        md={12}
        lg={12}
        mb={1}
        style={{ maxWidth: "auto", height: "auto" }}
      >
        <Card
          xs={12}
          md={12}
          lg={12}
          sx={{ display: 'flex', flexDirection: 'row', minWidth: '100%', justifyContent: 'space-between', cursor: 'pointer' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: '1 0 auto', padding: '20px' }}>
              <Typography style={{ fontWeight: 600 }}>
                {`${leaderboardFor} Leaderboard`}
              </Typography>
            </CardContent>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
            {images.map((elem, index) => {
              return (
                <React.Fragment key={index}>
                  <CardMedia
                    component="img"
                    sx={{ width: 80, margin: 0 }}
                    image={elem}
                    alt="image"
                  />
                </React.Fragment>
              )
            })}
          </Box>

          <Box sx={{ padding: '20px' }}>
            <MDButton
             variant="contained"
             color='info'
             size="small"
             onClick={()=>{handleChange(leaderboardFor)}}
            >
              View Leaderboard
            </MDButton>
          </Box>
        </Card>
      </Grid>
    </>
  )
}

export default List;