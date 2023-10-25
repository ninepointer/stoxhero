import { React, useState, useEffect, useContext } from "react";
import axios from "axios";

// Material Dashboard 2 React components
import MDTypography from "../../../components/MDTypography";


function Header({ battle }) {
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [participantCount, setParticipantCount] = useState(0);

    useEffect(() => {
        axios.get(`${baseUrl}api/v1/battletemplates/participantcount/${battle?.battleTemplate?._id}`, {
            withCredentials: true,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
        })
        .then((res) => {
            console.log("Participant Data:",res.data.data)
            setParticipantCount(res.data.data[0].count);
        })
    }, [battle]);


    // console.log("timediffrence", timeDifference)

    return (
        <>
            <MDTypography color='white' fontSize={7} mr={0.5} fontWeight='bold' style={{ backgroundColor: "green", padding: '0px 2px 0px 2px', border: "1px solid green", borderRadius: '5px 5px 5px 5px' }}>{participantCount > 15 ? participantCount + ' TRADERS HAVE ALREADY TRIED THIS BATTLE!' : 'NEW'}</MDTypography>
        </>
    );
}

export default Header;