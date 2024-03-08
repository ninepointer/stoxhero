
import React from 'react'
import { useMediaQuery, Box, Typography, Divider } from "@mui/material";
import theme from "../../../HomePage/utils/theme/index";
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";

const Overview = ({ courses }) => {

    const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
    const headingColor = '#000000';
    const lightGrey = '#D3D3D3';

    const shortHeadingStyling = { fontSize: '16px', fontWeight: 700, color: headingColor }
    return (
        <>
            <MDTypography style={{ fontSize: '25px', fontWeight: 800, color: headingColor, padding: '10px', borderBottom: `.5px solid ${lightGrey}` }} >Overview</MDTypography>
            <MDBox style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', marginBottom: '12px', padding: '12px', borderRadius: '16px', boxShadow: "0px 4px 4px -2px rgba(0, 0, 0, 0.5)", width: '100%' }}>
                <MDBox sx={{ display: 'flex', flexDirection: "column" }}>

                    <MDBox style={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center', alignItems: 'center' }}>
                        <MDBox>
                            <MDTypography style={shortHeadingStyling} >Basic Informations</MDTypography>
                        </MDBox>
                        {!isMobile ? <>
                            <MDBox>
                                <MDTypography style={{ fontSize: '14px' }} >Language: <span style={{ fontWeight: 600 }}>{`${courses?.courseLanguages}`}</span></MDTypography>
                                <MDTypography style={{ fontSize: '14px' }} >Duration: <span style={{ fontWeight: 600 }}>{`${courses?.courseDurationInMinutes} min`}</span></MDTypography>
                                <MDTypography style={{ fontSize: '14px' }} >Type: <span style={{ fontWeight: 600 }}>{`${courses.type}`}</span></MDTypography>
                            </MDBox>
                            <MDBox>
                                <MDTypography style={{ fontSize: '14px' }} >Course Category: <span style={{ fontWeight: 600 }}>{`${courses?.category}`}</span></MDTypography>
                                <MDTypography style={{ fontSize: '14px' }} >Level: <span style={{ fontWeight: 600 }}>{`${courses?.level}`}</span></MDTypography>
                                <MDTypography style={{ fontSize: '14px' }} >Course Type: <span style={{ fontWeight: 600 }}>{`${courses?.courseType}`}</span></MDTypography>
                            </MDBox>
                        </>
                            :
                            <MDBox>
                                <MDTypography style={{ fontSize: '14px' }} >Language: <span style={{ fontWeight: 600 }}>{`${courses?.courseLanguages}`}</span></MDTypography>
                                <MDTypography style={{ fontSize: '14px' }} >Duration: <span style={{ fontWeight: 600 }}>{`${courses?.courseDurationInMinutes} min`}</span></MDTypography>
                                <MDTypography style={{ fontSize: '14px' }} >Course Category: <span style={{ fontWeight: 600 }}>{`${courses?.category}`}</span></MDTypography>
                                <MDTypography style={{ fontSize: '14px' }} >Level: <span style={{ fontWeight: 600 }}>{`${courses?.level}`}</span></MDTypography>
                                <MDTypography style={{ fontSize: '14px' }} >Course Type: <span style={{ fontWeight: 600 }}>{`${courses?.courseType}`}</span></MDTypography>
                            </MDBox>}
                    </MDBox>

                    <Divider style={{ width: '100%' }} />

                    <MDBox sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', alignContent: 'center', gap: 1 }}>
                        <MDTypography style={shortHeadingStyling} >Instructor Details</MDTypography>
                        {courses?.courseInstructors?.map((courses) => {
                            return (
                                <MDBox sx={{ display: 'flex', justifyContent: 'flex-start', alignContent: 'center', alignItems: 'center', gap: 2 }}>
                                    <MDBox>
                                        <img src={courses?.image} alt="image" style={{ height: '90px', width: '90px', paddingLeft: isMobile ? '0px' : '0px', borderRadius: '50%' }} />
                                    </MDBox>
                                    <MDBox>
                                        <MDTypography style={{ fontSize: '14px', marginBottom: '2px' }} >Name : <span style={{ fontWeight: 600 }}>{`${courses?.id?.first_name + " " + courses?.id?.last_name}`}</span></MDTypography>
                                        <MDTypography style={{ fontSize: '14px', marginBottom: '2px' }} >Info : <span style={{ fontWeight: 600 }}>{`${courses?.about}`}</span></MDTypography>
                                    </MDBox>
                                </MDBox>
                            )
                        })}
                    </MDBox>

                    <Divider style={{ width: '100%' }} />

                    <MDBox sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', alignContent: 'center', gap: 1 }}>
                        <MDTypography style={shortHeadingStyling} >Course Benefits</MDTypography>
                        {courses?.courseBenefits?.map((courses) => (
                            <Box key={courses._id} sx={{ margin: '2px' }}>
                                <Typography style={{ fontSize: '16px', marginBottom: '2px' }}> <span>{courses?.order}.</span> {courses?.benefits}</Typography>
                            </Box>
                        ))}
                    </MDBox>

                    <Divider style={{ width: '100%' }} />

                    <MDBox sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', alignContent: 'center' }}>
                        <MDTypography style={shortHeadingStyling} >Frequent question and answer</MDTypography>
                        {courses?.faqs?.map((courses) => (
                            <Box key={courses._id} sx={{ margin: '2px' }}>
                                <Typography style={{ fontSize: '16px', marginBottom: '2px' }}> <span style={{ fontWeight: 800 }} >{"Question"} : </span> {courses?.question}</Typography>
                                <Typography style={{ fontSize: '16px', marginBottom: '2px' }}> <span style={{ fontWeight: 800 }} >{"Answer"} : </span> {courses?.answer}</Typography>
                            </Box>
                        ))}
                    </MDBox>
                </MDBox>

            </MDBox>
        </>
    )
}



export default Overview;