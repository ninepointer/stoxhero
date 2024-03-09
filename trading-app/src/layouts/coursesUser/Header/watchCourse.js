
import React, { useState, useEffect } from 'react'
import axios from "axios";
import { apiUrl } from "../../../constants/constants.js"
import { CircularProgress, Grid, Typography } from '@mui/material';
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox/index.js";
import { useMediaQuery } from "@mui/material";
import theme from "../../HomePage/utils/theme/index";
import TopicNav from "../data/watchCourseHelper/topicNav.js"
import Video from "../data/watchCourseHelper/videoPart.js"
import Overview from "../data/watchCourseHelper/overview.js"
import Buttons from '../data/watchCourseHelper/buttons.js'
import Notes from '../data/watchCourseHelper/notes.js'
import BlurPage from '../data/watchCourseHelper/blurPage.js'


const Courses = () => {
    const [selectedSubtopic, setSelectedSubtopic] = useState({});
    const [selectedTopic, setSelectedTopic] = useState({});
    const [selectedButton, setSelectedButton] = React.useState('Overview');
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const slug = urlParams.get('course');
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        let call1 = axios.get(`${apiUrl}courses/user?slug=${slug}`, {
            withCredentials: true,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
        })
        Promise.all([call1])
            .then(([api1Response]) => {
                // Process the responses here
                setCourses(api1Response?.data?.data)
                setSelectedSubtopic(api1Response?.data?.data?.courseContent?.[0]?.subtopics?.[0]);
                setSelectedTopic(api1Response?.data?.data?.courseContent?.[0]);

            })
            .catch((error) => {
                // Handle errors here
                console.error(error);
            });
    }, [])

    const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

    return (
        <>
            {courses ?
                <MDBox
                    style={{
                        flexGrow: 1,
                        height: 'auto',
                        marginTop: '15px',
                        //  zIndex: 1,
                        position: 'relative',
                    }}
                >
                  <BlurPage />

                    <MDBox
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backdropFilter: 'blur(3px)',
                            zIndex: 2,
                        }}
                    ></MDBox>
                    
                    <Grid
                        container
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        style={{ margin: 0 }}
                        display='flex'
                        justifyContent={'center'}
                        alignContent='center'
                        flexWrap='wrap'
                    >                        <Grid item xs={12} sm={12} md={12} lg={8.4} xl={8.4}>
                            <MDBox>
                                <MDBox style={{ backgroundColor: '#000000' }}>
                                    <Video videoData={selectedSubtopic} />
                                </MDBox>
                                <Typography fontSize={16} fontWeight={700} sx={{ color: '#000000', padding: '5px 0px 5px 15px' }}>
                                    <span>Topic&nbsp;{selectedTopic?.order}.{selectedSubtopic?.order}&nbsp;:&nbsp;</span>
                                    {selectedSubtopic?.topic}
                                </Typography>
                                <MDBox>
                                    <Buttons selectedButton={selectedButton} setSelectedButton={setSelectedButton} />
                                </MDBox>
                            </MDBox>
                            <MDBox>
                                {selectedButton === 'Overview' ?
                                    <Overview courses={courses} />
                                    :
                                    selectedButton === 'Notes' ?
                                        <Notes topics={courses?.courseContent} />
                                        :
                                        selectedButton === 'Topics' &&
                                        <TopicNav topics={courses?.courseContent} setSelectedSubtopic={setSelectedSubtopic} setSelectedTopic={setSelectedTopic} />}
                            </MDBox>
                        </Grid>

                        {!isMobile && <Grid item xs={12} sm={12} md={12} lg={3.6} xl={3.6}>
                            <MDBox style={{ position: 'fixed', top: 82, right: 0, height: '100%', width: '30%', backgroundColor: '#FAFAFA', color: '#fff', boxShadow: "6px 0px 4px -2px rgba(0, 0, 0, 0.5)" }}>
                                <TopicNav topics={courses?.courseContent} setSelectedSubtopic={setSelectedSubtopic} setSelectedTopic={setSelectedTopic} />
                            </MDBox>
                        </Grid>}
                    </Grid>
                </MDBox>
                :
                <Grid container spacing={1} xs={12} md={6} lg={12}>
                    <Grid item mt={2} xs={6} md={3} lg={12} style={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress color='dark' />
                    </Grid>
                </Grid>
            }
        </>
    )
}



export default Courses;