import { Grid, Typography } from "@mui/material";
import React, { memo, useState, useEffect } from "react";
import { useMediaQuery } from "@mui/material";
import theme from "../../../HomePage/utils/theme/index";
import MDTypography from "../../../../components/MDTypography";

const Timer = ({ socket, courseData, isPaid }) => {
  const [remainingTime, setRemainingTime] = useState(null);
  const [serverTime, setServerTime] = useState();

  useEffect(() => {
    socket.on("serverTime", (data) => {
      setServerTime(data);
    });
  }, []);

  useEffect(() => {
    const targetDate = isPaid
      ? new Date(courseData?.courseStartTime)
      : new Date(courseData?.registrationEndTime); // Replace with your specific courseData and time
    const now = new Date(serverTime);
    const timeDifference = targetDate - now;

    if (timeDifference > 0) {
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      setRemainingTime(`${days}D ${hours}H ${minutes}M ${seconds}S`);
    } else if (timeDifference <= 0) {
      setRemainingTime("Timer end");
    }
  }, [serverTime]);

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <>
      {remainingTime !== "Timer end" ? (
        <Grid
          container
          justify={isMobile ? "center" : "flex-start"}
          alignItems={isMobile ? "center" : "flex-start"}
        >
          <Grid
            item
            xs={12}
            style={{ textAlign: isMobile ? "center" : "flex-start" }}
          >
            <Typography
              variant="body1"
              fontWeight={600}
              style={{ color: "#344767", fontSize: "15px" }}
            >
              {isPaid ? "Workshop starts in" : "Registration ends in"}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            style={{ textAlign: isMobile ? "center" : "flex-start" }}
          >
            <Typography
              variant="body2"
              fontWeight={700}
              style={{ color: "#344767", fontSize: "17px" }}
            >
              {remainingTime}
            </Typography>
          </Grid>
        </Grid>
      ) : (
        <Typography fontSize={16} fontWeight={500}>
          Happening now. Please Join.
        </Typography>
      )}
    </>
  );
};

export default memo(Timer);
