
import React from 'react'
import { useMediaQuery, Box, Typography, Divider } from "@mui/material";
import theme from "../../../HomePage/utils/theme/index";
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import DownloadIcon from "@mui/icons-material/Download";


const Notes = ({topics}) => {

    const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
    const headingColor = '#000000';
    const lightGrey = '#D3D3D3';

    function downloadPdf(pdfUrl, fileName) {
        // Create a link element
        const link = document.createElement('a');
        // Set the download attribute to the desired file name
        link.download = fileName;
        // Set the href attribute to the URL of the PDF file
        link.href = pdfUrl;
        // Append the link to the document body
        document.body.appendChild(link);
        // Trigger a click event on the link to initiate the download
        link.click();
        // Remove the link from the document body
        document.body.removeChild(link);
    }

    return (
        <>
            <MDTypography style={{ fontSize: '25px', fontWeight: 800, color: headingColor, padding: '10px', borderBottom: `.5px solid ${lightGrey}` }} >Notes</MDTypography>
            <MDBox sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', alignContent: 'center', gap: 1 }}>
                {topics?.map((elem, index)=>{
                    return(
                        <React.Fragment key={elem?._id}>
                            {
                                elem?.subtopics?.map((subelem, subindex)=>{
                                    return(
                                        <React.Fragment key={subelem?._id}>
                                            <MDBox display='flex' justifyContent='space-between' alignContent='center' alignItems='center' textAlign='justify' gap={2} style={{width: !isMobile && '400px', padding: '0px 20px 0px 20px'}}>
                                                <MDTypography style={{ fontSize: '16px', fontWeight: 600, color: headingColor}} >{index+1}.{subindex+1} : {subelem?.topic}</MDTypography>
                                                <DownloadIcon sx={{cursor: 'pointer'}} onClick={()=>{downloadPdf(subelem?.videoUrl, subelem?.topic)}} />
                                            </MDBox>

                                            <Divider style={{ margin: 1 }} />
                                        </React.Fragment>
                                    )
                                })
                            }
                        </React.Fragment>
                    )
                })}
            </MDBox>
        </>
    )
}



export default Notes;