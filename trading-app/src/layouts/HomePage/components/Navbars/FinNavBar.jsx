import {
  AppBar,
  Box,
  Container,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";

import useScrollPosition from "../../hooks/useScrollPosition";
import logo from "../../../../assets/images/logo_dark.png";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { CallMade, Language, Menu } from "@mui/icons-material";
import LaunchButton from "../Buttons/LaunchButton";
import { useTheme } from "styled-components";
import MDTypography from "../../../../components/MDTypography";
import theme from "../../utils/theme/index";
import { Link } from "react-router-dom";

const NAVBAR_HIEGHT = 60;
const LinkButton = ({ children, ...props }) => (
  <Stack
    direction="row"
    alignItems="center"
    spacing={0.2}
    sx={{
      cursor: "pointer",
      color: theme.palette.text.primary,
      // color:'transparent',
      // color: "white",
      // "&:hover": { color: '#fff'},
      "&:hover": { color: "#D5F47E" },
    }}
    {...props}
  >
    {children}
  </Stack>
);

const Navbar = () => {
  const scrollPosition = useScrollPosition();

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const [open, setOpen] = useState(false);

  const Handle = (e) => {
    if (isMobile) {
      setOpen(true);
    }
  };

  return (
    <AppBar
      elevation={0}
      sx={{
        height: NAVBAR_HIEGHT,
        bgcolor: scrollPosition > 10 ? "transparent" : "transparent",
        backdropFilter: scrollPosition > 10 && "blur(10px)",
        marginBottom: "55px",
        marginTop: "0px",
      }}
    >
      <Container
        sx={{
          [theme?.breakpoints?.down("lg")]: { maxWidth: "100%" },
          marginBottom: 1,
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          alignContent="center"
        >
          {/* Logo */}

          <a href="/">
            <img
              src={logo}
              style={{
                objectFit: "contain",
                height: "30px",
                marginTop: "15px",
                textAlign: "center",
              }}
            />
          </a>

          {!isMobile && (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              spacing={4}
              marginTop={"13px"}
              sx={{ flex: 1 }}
              flexWrap="wrap"
              color="white"
            >
              <a href="/">
                <LinkButton spacing={0.5}>
                  <Typography
                    variant="body2"
                    style={{ fontFamily: "Work Sans , sans-serif" }}
                    sx={{ color: "#000000" }}
                  >
                    HOME
                  </Typography>
                </LinkButton>
              </a>

              <a href="/challenge">
                <LinkButton spacing={0.5}>
                  <Typography
                    variant="body2"
                    color="black"
                    style={{ fontFamily: "Work Sans , sans-serif" }}
                    sx={{ color: "#000000" }}
                  >
                    FINANCE CHALLENGES
                  </Typography>
                </LinkButton>
              </a>

              <a href="/school">
                <LinkButton spacing={0.5}>
                  <Typography
                    variant="body2"
                    style={{ fontFamily: "Work Sans , sans-serif" }}
                    sx={{ color: "#000000" }}
                  >
                    SCHOOL
                  </Typography>
                </LinkButton>
              </a>

              <a href="/aboutus">
                <LinkButton spacing={0.5}>
                  <Typography
                    variant="body2"
                    style={{ fontFamily: "Work Sans , sans-serif" }}
                    sx={{ color: "#000000" }}
                  >
                    ABOUT US
                  </Typography>
                </LinkButton>
              </a>

              <a href="/contactus">
                <LinkButton spacing={0.5}>
                  <Typography
                    variant="body2"
                    style={{ fontFamily: "Work Sans , sans-serif" }}
                  >
                    CONTACT US
                  </Typography>
                </LinkButton>
              </a>
            </Stack>
          )}

          {open && (
            <Stack
              direction="column"
              alignItems="center"
              justifyContent="flex-start"
              spacing={4}
              sx={{
                flex: 1,
                background: "#FBFFFA",
                width: "100%",
                height: "100vh",
              }}
              flexWrap="wrap"
              position="absolute"
              top="0"
              right={0}
            >
              <img
                src="https://icon-library.com/images/x-button-icon/x-button-icon-3.jpg"
                style={{
                  height: "40px",
                  position: "absolute",
                  top: "8px",
                  color: "#fff",
                  right: "14px",
                  zIndex: 999,
                }}
                sx={{ fontSize: "100px" }}
                onClick={() => setOpen(false)}
              />

              <a href="/">
                <LinkButton spacing={0.5}>
                  <MDTypography
                    variant="body2"
                    style={{ fontFamily: "Work Sans , sans-serif" }}
                    sx={{ color: "#000" }}
                  >
                    HOME
                  </MDTypography>
                </LinkButton>
              </a>

              <a href="/challenge">
                <LinkButton spacing={0.5}>
                  <MDTypography
                    variant="body2"
                    style={{ fontFamily: "Work Sans , sans-serif" }}
                    sx={{ color: "#000" }}
                  >
                    FINANCE CHALLENGES
                  </MDTypography>
                </LinkButton>
              </a>

              <a href="/school">
                <LinkButton spacing={0.5}>
                  <Typography
                    variant="body2"
                    style={{ fontFamily: "Work Sans , sans-serif" }}
                    sx={{ color: "#000" }}
                  >
                    SCHOOL
                  </Typography>
                </LinkButton>
              </a>

              <a href="/aboutus">
                <LinkButton spacing={0.5}>
                  <MDTypography
                    variant="body2"
                    style={{ fontFamily: "Work Sans , sans-serif" }}
                    sx={{ color: "#000" }}
                  >
                    ABOUT US
                  </MDTypography>
                </LinkButton>
              </a>

              <a href="/contactus">
                <LinkButton spacing={0.5}>
                  <MDTypography
                    variant="body2"
                    style={{ fontFamily: "Work Sans , sans-serif" }}
                    sx={{ color: "#000" }}
                  >
                    CONTACT US
                  </MDTypography>
                </LinkButton>
              </a>
            </Stack>
          )}

          {/* Action buttons */}

          {isMobile ? (
            <IconButton>
              <Menu onClick={Handle} sx={{ color: "black" }} />
            </IconButton>
          ) : (
            <Stack direction="row" spacing={5} alignItems="center">
              {/* <a href="https://play.google.com/store/apps/details?id=com.stoxhero.app" target='_blank'>
              <LaunchButton sx={{ borderRadius: 3, color: 'light' }} />
            </a> */}
            </Stack>
          )}
        </Stack>
      </Container>
    </AppBar>
  );
};

export default Navbar;
