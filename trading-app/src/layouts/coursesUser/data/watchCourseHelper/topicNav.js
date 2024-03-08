
import React, { useState, useEffect } from 'react'
import { Typography, Divider } from '@mui/material';
// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox/index.js";
import MDTypography from "../../../../components/MDTypography/index.js";
import { useMediaQuery } from "@mui/material";
import theme from "../../../HomePage/utils/theme/index";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const TopicNav = ({topics, setSelectedSubtopic, setSelectedTopic}) => {

    const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

    return (
        <>
        {topics?.map((elem, index) => {
          return (
            
            <div key={index}>
              <Accordion
               elevation={0}
               square
               sx={{ borderRadius: '0px', borderBottom: '.5px solid #D3D3D3', padding: isMobile ? 0 : '5px 0px 5px 0px' }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography fontSize={18} fontWeight={700}>
                    <span>Topic&nbsp;{index + 1}&nbsp;:&nbsp;</span>
                    {elem?.topic}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {elem?.subtopics?.map((subelem, subIndex) => {
                    return (
                        <div key={subelem?._id}
                           
                        >
                            <MDBox
                                display="flex"
                                justifyContent="flex-start"
                                //   alignItems="left"
                                gap={1}
                                style={{
                                    transition: 'background-color 0.3s',
                                    cursor: 'pointer',
                                    backgroundColor: 'transparent'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#F1F2F3';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }}

                                onClick={()=>{setSelectedSubtopic(subelem); setSelectedTopic(elem)}}
                            >
                                <video
                                    src={subelem?.videoUrl}
                                    style={{ height: '50px', width: '100px' }}
                                />
                                <MDTypography
                                    variant="caption"
                                    color="text"
                                    fontWeight="medium"
                                    fontSize={16}
                                    display="flex"
                                    justifyContent="center"
                                    flexDirection="column"
                                    alignItems="center"
                                    textAlign="center"
                                >
                                    {subIndex + 1}. {subelem?.topic}
                                </MDTypography>
                            </MDBox>
                            <MDBox>
                                {subIndex !== elem.subtopics.length - 1 && (
                                    <Divider style={{ width: '100%' }} />
                                )}
                            </MDBox>
                        </div>
                    );
                  })}
                </AccordionDetails>
              </Accordion>
              {/* <Divider /> */}
            </div>
          );
        })}
      </>
      


    )
}



export default TopicNav;