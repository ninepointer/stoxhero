import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import MDBox from "../../../components/MDBox";
import Card from "@mui/material/Card";
import {
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  Select,
} from "@mui/material";
import MDTypography from "../../../components/MDTypography";
import dayjs from "dayjs";
import { apiUrl } from "../../../constants/constants";
import MDSnackbar from "../../../components/MDSnackbar";
import { userContext } from "../../../AuthContext";
// import EarningsChart from '../data/last30daysEarningsChart'
import { adminRole, userRole } from "../../../variables";
import ChooseAfiliate from "../data/chooseAffiliate";
import InfluencerUserData from "../data/InfluencerUserData";
import moment from "moment";
import { socketContext } from "../../../socketContext";
import InfluencerRevenueData from "../data/InfluencerRevenueData";
import InfluencerUserLiveData from "../data/influencerUserLiveData";

export default function Dashboard() {
  const getDetails = useContext(userContext);
  const userDetails = getDetails.userDetails;
  // const [period, setPeriod] = React.useState('Today');
  let [isLoading, setIsLoading] = useState(false);
  const date = new Date();
  // const [startDate, setStartDate] = React.useState(dayjs(date).startOf('day'));
  // const [endDate, setEndDate] = useState(dayjs(date).endOf('day'));
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [successSB, setSuccessSB] = useState(false);
  const [influencerData, setInfluencerData] = useState(null);
  // const [showDetailClicked, setShowDetailClicked] = useState(false);
  const socket = useContext(socketContext);

  const [userData, setUserData] = React.useState({});
  const [normalUserRevenue, setNormalUserRevenue] = React.useState({});
  const [influencerUserRevenue, setInfluencerUserRevenue] = React.useState({});

  useEffect(() => {
    socket?.on(
      `influencer-user:${getDetails.userDetails._id.toString()}`,
      (data) => {
        if (data?.influencerUser) {
          setUserData(data?.data);
        }
        if (data?.influencerRevenue) {
          setNormalUserRevenue(data?.data?.normalUser);
          setInfluencerUserRevenue(data?.data?.influencerUser);
        }
      }
    );
  }, []);

  useEffect(() => {
    // socket.on("connect", ()=>{
    socket.emit("company-ticks", true);
    // })
  }, []);

  const openSuccessSB = (title, content) => {
    setTitle(title);
    setContent(content);
    setSuccessSB(true);
  };
  const closeSuccessSB = () => setSuccessSB(false);

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title={title}
      content={content}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
    />
  );

  const [errorSB, setErrorSB] = useState(false);
  const openErrorSB = (title, content) => {
    setTitle(title);
    setContent(content);
    setErrorSB(true);
  };
  const closeErrorSB = () => setErrorSB(false);

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title={title}
      content={content}
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  return (
    <MDBox
      mt={userDetails?.role?.roleName === adminRole ? 0 : 2}
      mb={1}
      borderRadius={10}
      minHeight="auto"
      width="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Grid
        container
        xs={12}
        md={12}
        lg={12}
        display="flex"
        justifyContent="center"
      >
        <Grid item xs={12} md={12} lg={12}>
          <MDTypography fontSize={15} ml={1.5} fontWeight="bold">
            My Dashboard
          </MDTypography>
        </Grid>
        {userDetails?.role?.roleName === adminRole && (
          <ChooseAfiliate setInfluencerData={setInfluencerData} />
        )}

        {isLoading ? (
          <Grid
            container
            display="flex"
            justifyContent="center"
            alignContent="center"
            alignItems="center"
          >
            <Grid
              item
              display="flex"
              justifyContent="center"
              alignContent="center"
              alignItems="center"
              lg={12}
            >
              <MDBox mt={5} mb={5}>
                <CircularProgress color="info" />
              </MDBox>
            </Grid>
          </Grid>
        ) : (
          <>
            <Grid
              item
              xs={12}
              md={12}
              lg={12}
              mt={1}
              display="flex"
              justifyContent="center"
            >
              <Grid
                container
                spacing={2}
                xs={12}
                md={12}
                lg={12}
                display="flex"
                justifyContent="center"
                style={{ width: "100%" }}
              >
                <Grid
                  item
                  xs={12}
                  md={12}
                  lg={12}
                  style={{ width: "100%", height: "auto" }}
                >
                  <InfluencerUserData
                    userData={userData}
                    setUserData={setUserData}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid
              item
              xs={12}
              md={12}
              lg={12}
              mt={1}
              display="flex"
              justifyContent="center"
            >
              <Grid
                container
                spacing={2}
                xs={12}
                md={12}
                lg={12}
                display="flex"
                justifyContent="center"
                style={{ width: "100%" }}
              >
                <Grid
                  item
                  xs={12}
                  md={12}
                  lg={12}
                  style={{ width: "100%", height: "auto" }}
                >
                  <InfluencerRevenueData
                    normalUserRevenue={normalUserRevenue}
                    setNormalUserRevenue={setNormalUserRevenue}
                    influencerUserRevenue={influencerUserRevenue}
                    setInfluencerUserRevenue={setInfluencerUserRevenue}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              md={12}
              lg={12}
              mt={1}
              display="flex"
              justifyContent="center"
            >
              <Grid
                container
                spacing={2}
                xs={12}
                md={12}
                lg={12}
                display="flex"
                justifyContent="center"
                style={{ width: "100%" }}
              >
                <Grid
                  item
                  xs={12}
                  md={12}
                  lg={12}
                  style={{ width: "100%", height: "auto" }}
                >
                  <InfluencerUserLiveData socket={socket} />
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
      {renderSuccessSB}
      {renderErrorSB}
    </MDBox>
  );
}
