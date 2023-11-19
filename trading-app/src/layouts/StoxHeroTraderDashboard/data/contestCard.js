import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Paper } from "@material-ui/core";
import map from "lodash/map";
import range from "lodash/range";
import MDButton from "../../../components/MDButton";
import { Grid } from "@material-ui/core";
import {useNavigate} from 'react-router-dom';
import FreeContest from '../../../assets/images/freecontests.gif'
import PaidContest from '../../../assets/images/paidcontest.png'
import MDTypography from "../../../components/MDTypography";

export default function App() {

  return (
    <div className="App">
      <div style={{ width: "100%", overflow: "auto", display: "flex"}}>
        {/* {map(range(2), _ => ( */}
          <Grid container lg={12} xs={12} md={12}>
            <Grid item lg={12} xs={12} md={12}>
                <Container width='100%' />
            </Grid>
          </Grid>
        {/* ))} */}
      </div>
    </div>
  );
}

const Container = () => {
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
    const [contest, setContest] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [loading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true)
        axios.get(`${baseUrl}api/v1/dailycontest/contests/onlyupcoming`, {
            withCredentials: true,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
        })
            .then((res) => {
                console.log("Contest:",res.data.data)
                setContest(res.data.data);
                setTimeout(() => {
                    setIsLoading(false)
                }, 1000)

            }).catch((err) => {
                setIsLoading(false)
                return new Error(err);
            })


            axios.get(`${baseUrl}api/v1/dailycontest/contests/ongoing`, {
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                },
            })
                .then((res) => {
                    console.log("Contest:",res.data.data)
                    setUpcoming(res.data.data);
                    if(contest.length === 0){
                        setContest(res.data.data)
                    }
                    setTimeout(() => {
                        setIsLoading(false)
                    }, 0)
    
                }).catch((err) => {
                    setIsLoading(false)
                    return new Error(err);
                })
    }, [])

    function changeDateFormat(givenDate) {

        const date = new Date(givenDate);

        // Convert the date to IST
        date.setHours(date.getHours());
        date.setMinutes(date.getMinutes());

        // Format the date as "dd Month yyyy | hh:mm AM/PM"
        const formattedDate = `${date.getDate()} ${getMonthName(date.getMonth())} ${date.getFullYear()} | ${formatTime(date.getHours(), date.getMinutes())}`;

        console.log(formattedDate);

        // Helper function to get the month name
        function getMonthName(month) {
            const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            return monthNames[month];
        }

        // Helper function to format time as "hh:mm AM/PM"
        function formatTime(hours, minutes) {
            const meridiem = hours >= 12 ? "PM" : "AM";
            const formattedHours = hours % 12 || 12;
            const formattedMinutes = minutes.toString().padStart(2, "0");
            return `${formattedHours}:${formattedMinutes} ${meridiem}`;
        }

        return formattedDate;

    }

    const handleButtonClick = () => {
        navigate(`/contests`);
    }
  return (
    <div style={{ height: "180px", width: "100%", margin: "0px", overflowX: "auto", whiteSpace: "nowrap" }}>
      {/* <Paper style={{ height: "100%", width: "514px" }}>Hello</Paper> */}
        {contest?.map((e)=>{
            return(
                <MDButton 
                key={e.id}
                style={{
                  width: '100%',
                  height: '180px',
                  padding: 2,
                  margin: 0,
                  display: 'inline-block',
                //   borderRadius: 5,
                  position: 'relative',
                  overflow: 'hidden', // Ensure text doesn't overflow outside the button
                }}
                onClick={() => handleButtonClick()}
              >
                <img
                  src={e?.entryFee !== 0 ? PaidContest : FreeContest}
                  alt="Contest Image"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                {/* Top Text */}
                <div
                  style={{
                    position: 'absolute',
                    top: '10px', // Adjust the top position as needed
                    // right: '10px', // Adjust the right position as needed
                    color: 'black', // Text color
                    fontSize: '14px', // Text font size
                    fontWeight: 'bold', // Text font weight
                    textAlign: 'center',
                    zIndex: 1, // Ensure text appears above the image
                  }}
                >
                  {e?.contestName}
                </div>
                {/* Bottom Text */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '10px', // Adjust the bottom position as needed
                    left: '10px', // Adjust the right position as needed
                    color: 'black', // Text color
                    fontSize: '12px', // Text font size
                    zIndex: 1, // Ensure text appears above the image
                  }}
                >
                  Entry : {e?.entryFee !== 0 ? 'Paid' : 'Free'}
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '10px', // Adjust the bottom position as needed
                    right: '40px', // Adjust the right position as needed
                    color: 'black', // Text color
                    fontSize: '12px', // Text font size
                    zIndex: 1, // Ensure text appears above the image
                  }}
                >
                  {e?.portfolio?.portfolioValue}
                </div>
              </MDButton>
              
            )
        })}
    </div>
  );
};
