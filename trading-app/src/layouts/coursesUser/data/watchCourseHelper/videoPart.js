
import React, {useEffect, useState} from 'react'
import { useMediaQuery, Typography } from "@mui/material";
import theme from "../../../HomePage/utils/theme/index";


const Video = ({videoData}) => {

    const [data, setData] = useState(videoData);

    useEffect(()=>{
        setData(videoData);
    }, [videoData])

    const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
    // videoLink = 'https://dmt-trade.s3.ap-south-1.amazonaws.com/courses/video/65e562a0b2fab02b3c43d7cd-About+Intraday+Trading-1709799773981';
    return (
        <>
            <video src={data?.videoUrl} alt={'video'} controls style={{ height: isMobile ? '230px' : '460px', width: '100%' }} />
        </>
    )
}



export default Video;