
import React, { useState, useEffect } from 'react'
import axios from "axios";
import { apiUrl } from "../../../constants/constants.js"
import CoursesList from './CoursesList.js';
import Pagination from '@mui/material/Pagination';
import {Stack, Grid} from '@mui/material';


const Courses = () => {


    const [courses, setCourses] = useState(null);
    const limitSetting = 9;
    const [skip, setSkip] = useState(0);
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [workshop, setWorkshop] = useState([]);

    useEffect(() => {
        fetchData();
    }, [skip])

    async function fetchData() {
        let call1 = axios.get(`${apiUrl}courses/influencer/completed?skip=${skip}&limit=${limitSetting}`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
            withCredentials: true
        })
        Promise.all([call1])
            .then(([api1Response]) => {
                setCourses(api1Response?.data?.data);
                setWorkshop(api1Response?.data?.workshop)
                setCount(api1Response?.data?.count);
                setTimeout((() => setIsLoading(false)), 500);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const handlePageChange = (event, value) => {
        setSkip((Number(value) - 1) * limitSetting)
    };

    return (
        <>
            {courses && <CoursesList data={courses} workshop={workshop} isLoading={isLoading} />}
            {courses?.length > 0 &&
                <Grid item xs={12} md={12} lg={12} mt={2} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                    <Stack spacing={2}>
                        <Pagination style={{ backgroundColor: 'transparent' }} count={Math.ceil(count / limitSetting)} color="success" onChange={handlePageChange} />
                    </Stack>
                </Grid>}
        </>


    )
}



export default Courses;



