
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
import { apiUrl } from '../../../constants/constants';
import LeaderboardTable from './leaderboardTable';
import {Link, useNavigate} from 'react-router-dom'



const LeaderBoard = ({value, handleChange}) => {

  const [newValue, setNewValue] = useState(value);

  useEffect(()=>{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
  
    // Get the value of the "mobile" parameter
    const paramsValue = urlParams.get("value");
    setNewValue(paramsValue);
  }, [value])

  const unseenArray = [`Today's`, `Weekly`, `Monthly`];
  const filteredArray = unseenArray.filter(item => item !== newValue);

  return (
    <>
      <Grid
        display="flex"
        justifyContent="space-between"
        alignContent="center"
        alignItems="center"
        container
        xs={12}
        md={12}
        lg={12}
        // gap={1}
        mb={1}
        style={{ maxWidth: "auto", height: "auto" }}
      >
        {filteredArray?.map((elem, index) => {
          return (
            <Grid
              item
              xs={12}
              md={5.9}
              lg={5.9}
              pb={1}
              onClick={()=>{
                handleChange(elem)
              }}
            >
              <Card
                xs={12}
                md={6}
                lg={6}
                key={index}
                sx={{ display: 'flex', flexDirection: 'row', minWidth: '100%', justifyContent: 'center', cursor: 'pointer' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flex: '1 0 auto', padding: '20px' }}>
                    <Typography style={{ fontWeight: 600 }}>
                      {`View ${elem} Leaderboard`}
                    </Typography>
                  </CardContent>
                </Box>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      <LeaderboardTable value={newValue} />
    </>
  )
}

export default LeaderBoard;