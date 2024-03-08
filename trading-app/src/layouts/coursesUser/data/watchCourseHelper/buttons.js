
import React from 'react'
import { useMediaQuery, ToggleButtonGroup, ToggleButton } from "@mui/material";
import theme from "../../../HomePage/utils/theme/index";

const style = {
    fontSize: '15px', // Adjust the font size as needed
    fontWeight: 'bold', // Make the text bold
    // color: '#ffffff', // Change text color
    // backgroundColor: '#363737', // Change background color,
    '&:hover': {
        backgroundColor: '#D3D3D3', // Change background color on hover
    }
}

const Buttons = ({selectedButton, setSelectedButton}) => {
    const handleChange = (event, newAlignment) => {
        newAlignment && setSelectedButton(newAlignment);
    };

    const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
    return (
        <>
            <ToggleButtonGroup
                value={selectedButton}
                exclusive
                onChange={handleChange}
                aria-label="Platform"
                sx={{padding: 1}}
            >
                <ToggleButton sx={style} value="Overview">Overview</ToggleButton>
                {isMobile && <ToggleButton sx={style} value="Topics">Topics</ToggleButton>}
                <ToggleButton sx={style} value="Notes">Notes</ToggleButton>
            </ToggleButtonGroup>
        </>
    )
}



export default Buttons;