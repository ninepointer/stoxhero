import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import OutlinedButton from "../Buttons/OutlinedButton";
import Title from "../Title";

const ServiceCard = ({ title, subtitle, image }) => {
  return (
    <Box
      sx={{
        height: "100%",
        position: "relative",
        p: 4,
        borderRadius: "30px",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          borderRadius: "30px",
          border: "1px solid transparent",
          background: "linear-gradient(120deg,#5f5f61,transparent) border-box",
          WebkitMask:
            "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exlude",
        },
      }}
    >
      <Stack sx={{ height: "100%" }} justifyContent="flex-start" spacing={1}>

      <img
          src={image}
          style={{
            height: "70px",
            width: "15%",
            objectFit: "contain",
            flex: 1,
          }}
        />

        <Title style={{color:"#fff"}} variant={{ xs: "h5", sm: "h4" }}>{title}</Title>

        <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">
          {subtitle}
        </Typography>

        

        {/* <OutlinedButton arrow fit>
          Learn more
        </OutlinedButton> */}
      </Stack>
    </Box>
  );
};

export default ServiceCard;