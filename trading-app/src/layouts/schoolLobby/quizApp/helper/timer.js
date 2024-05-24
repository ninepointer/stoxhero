import React, {useState, useEffect} from 'react';
import {Grid} from "@mui/material";
import MDTypography from "../../../../components/MDTypography";



export default function Timer({timer}){
    const [timeRemaining, setTimeRemaining] = useState(timer);
    const [isRunning, setIsRunning] = useState(true);
  
    useEffect(() => {
        let countdown;
    
        if (timer && isRunning && timeRemaining > 0) {
          countdown = setInterval(() => {
            setTimeRemaining((prevTime) => prevTime - 1);
          }, 1000);
        }
        return () => timer && clearInterval(countdown);
    }, [isRunning, timeRemaining, timer]);
    
    const formatTime = (time) => (time < 10 ? '0' : '');
    const displayTime = (time) => {
      const hours = Math.floor(time / 3600);
      const minutes = Math.floor((time % 3600) / 60);
      const seconds = time % 60;
  
      return `${formatTime(hours)}${hours}:${formatTime(minutes)}${minutes}:${
        formatTime(seconds)
      }${seconds}`;
    };

    // const handleTimeUp = async () => {
    //     await axios.patch(`${apiUrl}quiz/response/submit/${quizId}`, { submittedBy: "System" }, { withCredentials: true });
    //     setIsRunning(false);
    //     setEndQuiz(true);
    //     getUnansweredQuestions();
    // };

    // async function submit() {
        // await axios.patch(`${apiUrl}quiz/response/submit/${quizId}`, { submittedBy: "Student" }, { withCredentials: true });
    //     setEndQuiz(true);
    // }

    return(
        <>
            <Grid item>
                <MDTypography fontSize={15} fontWeight={500} color='light'>
                    <b>
                        Time remains : {displayTime(timeRemaining)}
                    </b>
                </MDTypography>
            </Grid>
        </>
    )
}