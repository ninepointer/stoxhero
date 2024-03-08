
import React, {useState} from 'react'
import { useMediaQuery, CircularProgress, Divider } from "@mui/material";
import theme from "../../../HomePage/utils/theme/index";
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import DownloadIcon from "@mui/icons-material/Download";


const Notes = ({topics}) => {

    const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
    const headingColor = '#000000';
    const lightGrey = '#D3D3D3';
    const [isDownload, setIsDownload] = useState({});

    function downloadPdf(pdfUrlArr, fileName, id) {
        // setIsDownload(prev => {
        //     const updatedIsDownload = [...prev]; // Create a copy of the previous state array
        //     updatedIsDownload[id] = true; // Update the specific element at index subindex
        //     return updatedIsDownload; // Return the updated state array
        // });

        setIsDownload(prev => ({
            ...prev,
            [id]: true
        }));
        
        return;
        for (const [index, pdfUrl] of pdfUrlArr.entries()) {
            const link = document.createElement('a');
            link.download = `${fileName}-${index}`; // Using index in the file name
            link.href = pdfUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }   
        setIsDownload(prev => ({
            ...prev,
            [id]: false
        }));   
    }

    return (
        <>
            <MDTypography style={{ fontSize: '25px', fontWeight: 800, color: headingColor, padding: '10px 10px 10px 15px', borderBottom: `.5px solid ${lightGrey}` }} >Notes</MDTypography>
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
                                                {isDownload[subelem?._id] ? <CircularProgress
                                                    size={20}
                                                    color="dark"
                                                />
                                                    :
                                                    <DownloadIcon sx={{ cursor: 'pointer' }} onClick={() => { downloadPdf(subelem?.videoUrl, subelem?.topic, subelem?._id) }} />
                                                }
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