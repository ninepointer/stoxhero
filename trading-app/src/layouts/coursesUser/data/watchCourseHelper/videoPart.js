import React, { useEffect, useState, useRef, useContext } from "react";
import { useMediaQuery, Typography } from "@mui/material";
import theme from "../../../HomePage/utils/theme/index";
import ReactPlayer from "react-player";
import { userContext } from "../../../../AuthContext";

const Video = ({ videoData }) => {
  const [data, setData] = useState(videoData);
  const getDetails = useContext(userContext);
  const userDetails = getDetails.userDetails;
  const [showText, setShowText] = useState(false);
  // No need for videoRef since ReactPlayer does not use it in the same way as a native video element
  const intervalRef = useRef(null); // To keep track of the interval

  // Function to start showing text
  const startTextDisplay = () => {
    // Clear existing interval if any
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setShowText(true);

      // Hide text after 5 seconds
      setTimeout(() => {
        setShowText(false);
      }, 5000);
    }, 30000); // every 30 seconds
  };

  // Function to stop showing text
  const stopTextDisplay = () => {
    clearInterval(intervalRef.current);
    setShowText(false); // Hide text immediately
  };

  useEffect(() => {
    setData(videoData);
  }, [videoData]);

  const textStyle = {
    position: "absolute",
    bottom: "80px",
    left: "80px",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    display: showText ? "block" : "none", // Only change to make text appear/disappear
  };

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <div style={{ position: "relative" }}>
      <ReactPlayer
        url={data?.videoUrl}
        controls={true}
        width="100%"
        height={isMobile ? "230px" : "460px"}
        onPlay={startTextDisplay} // Handle video play
        onPause={stopTextDisplay} // Handle video pause
        onEnded={stopTextDisplay} // Handle video end
        config={{
          file: {
            attributes: {
              controlsList: "nodownload", // This will remove the download option from the video controls
            },
          },
        }}
      />
      {showText && (
        <div style={textStyle}>
          <p style={{ fontSize: 14 }}>
            {userDetails.mobile}
            <br />
            {userDetails.email}
            <br />
          </p>
        </div>
      )}
    </div>
  );
};

export default Video;
