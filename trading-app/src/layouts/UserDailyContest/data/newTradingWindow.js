import { React, useState, useCallback, useMemo } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "../../../components/MDBox";
import OverallPnl from '../../tradingCommonComponent/OverallP&L/OverallGrid'
import { dailyContest } from '../../../variables';

function Header({ socket, data }) {
    const [isGetStartedClicked, setIsGetStartedClicked] = useState(false);
    const contestId = data?.data;

    const handleSetIsGetStartedClicked = useCallback((value) => {
        setIsGetStartedClicked(value);
    }, []);


    const memoizedOverallPnl = useMemo(() => {
        return <OverallPnl
            socket={socket}
            isGetStartedClicked={isGetStartedClicked}
            setIsGetStartedClicked={handleSetIsGetStartedClicked}
            from={dailyContest}
            subscriptionId={contestId}
            //   setAvailbleMargin={setAvailbleMargin}
            moduleData={data}
        />;
    }, [data, contestId, handleSetIsGetStartedClicked, isGetStartedClicked, socket]);


    return (
        <>

            <MDBox color="dark" mt={1} mb={1} borderRadius={10}>

                <Grid container p={1} mt={1} sx={{ backgroundColor: '#D3D3D3' }} borderRadius={3}>
                    <Grid item xs={12} md={6} lg={12} >
                        {memoizedOverallPnl}
                    </Grid>
                </Grid>

            </MDBox>


        </>
    );
}

export default Header;
