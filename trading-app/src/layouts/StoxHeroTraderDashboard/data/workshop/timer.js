import { Grid, Typography } from '@mui/material';
import React, { memo, useState, useEffect } from 'react';

const Timer = ({socket, courseData, isPaid}) => {
  const [remainingTime, setRemainingTime] = useState(null);
  const [serverTime, setServerTime] = useState();

  useEffect(()=>{
    socket.on("serverTime", (data)=>{
      setServerTime(data)
    })
  }, [])

  useEffect(() => {
    const targetDate = isPaid ? new Date(courseData?.courseStartTime) :  new Date(courseData?.registrationEndTime); // Replace with your specific courseData and time
    const now = new Date(serverTime);
    const timeDifference = targetDate - now;

    // setTimeDifference(prevArray => {
    //   const index = prevArray.findIndex(item => item.id === id);

    //   if (index !== -1) {
    //     // If id exists, update the value
    //     const updatedArray = [...prevArray];
    //     updatedArray[index].value = timeDifference;
    //     return updatedArray;
    //   } else {
    //     // If id doesn't exist, push a new element
    //     return [...prevArray, { id, value: timeDifference }];
    //   }
    // });

    if (timeDifference > 0) {
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      setRemainingTime(`${days}D ${hours}H ${minutes}M ${seconds}S`);
    } else if(timeDifference <= 0) {

      setRemainingTime('Timer end');
    }
  }, [serverTime]);


    return (
        <>
            {remainingTime !== 'Timer end' &&
                <Grid
                    container
                    justify="center"
                    alignItems="center"
                >
                    <Grid item xs={12} style={{ textAlign: 'center' }}>
                        <Typography variant="body1" fontWeight={600} style={{ color: '#344767', fontSize: '15px' }}>
                            {isPaid ? 'Workshop starts in' : 'Registration ends in'}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} style={{ textAlign: 'center' }}>
                        <Typography variant="body2" fontWeight={700} style={{ color: '#344767', fontSize: '17px' }}>
                            {remainingTime}
                        </Typography>
                    </Grid>
                </Grid>
            }
        </>
    );
};

export default memo(Timer);
