import { useState, useEffect, useContext } from "react";
import axios from "axios";
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import Card from "@mui/material/Card";
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
import { CardActionArea, Divider, Grid } from "@mui/material";
// import { userContext } from '../../../AuthContext';
import MDTypography from "../../../components/MDTypography";
import { CircularProgress } from "@mui/material";
import LifetimeAffiliateData from "../data/lifetimeAffiliateData";
import LifetimeYouTubeAffiliateData from "../data/lifetimeYouTubeAffiliateData";
import LifetimeStoxHeroAffiliateData from "../data/lifetimeStoxHeroAffiliateData";
import LifetimeOfflineAffiliateData from "../data/lifetimeOfflineAffiliateData";
import { saveAs } from "file-saver";
import moment from "moment";
import LeaderBoard from "../data/leaderboard";

export default function Dashboard() {
  let baseUrl =
    process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/";
  let [isLoading, setIsLoading] = useState([]);
  const [affiliateOverview, setAffiliateOverview] = useState([]);
  const [affiliateReferrals, setAffiliateReferrals] = useState([]);
  const [ytaffiliateReferrals, setYTAffiliateReferrals] = useState([]);
  const [ytaffiliateOverview, setYTAffiliateOverview] = useState([]);
  const [shaffiliateReferrals, setSHAffiliateReferrals] = useState([]);
  const [shaffiliateOverview, setSHAffiliateOverview] = useState([]);
  const [oiaffiliateReferrals, setOIAffiliateReferrals] = useState([]);
  const [oiaffiliateOverview, setOIAffiliateOverview] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [downloadingOverall, setDownloadingOverall] = useState(false);
  const [downloadingYoutube, setDownloadingYoutube] = useState(false);
  const [downloadingStoxhero, setDownloadingStoxhero] = useState(false);
  const [downloadingOffline, setDownloadingOffline] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    let call1 = axios.get(`${baseUrl}api/v1/affiliate/affiliateoverview`, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
    });
    let call2 = axios.get(`${baseUrl}api/v1/affiliate/ytaffiliateoverview`, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
    });
    let call3 = axios.get(`${baseUrl}api/v1/affiliate/shaffiliateoverview`, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
    });
    let call4 = axios.get(`${baseUrl}api/v1/affiliate/oiaffiliateoverview`, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
    });
    let call5 = axios.get(`${baseUrl}api/v1/affiliate/leaderboard`, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
    });
    Promise.all([call1, call2, call3, call4, call5])
      .then(
        ([
          api1Response,
          api2Response,
          api3Response,
          api4Response,
          api5Response,
        ]) => {
          setAffiliateOverview(api1Response?.data?.data[0]);
          setAffiliateReferrals(api1Response?.data?.referrals);
          setYTAffiliateOverview(api2Response?.data?.data[0]);
          setYTAffiliateReferrals(api2Response?.data?.referrals);
          setSHAffiliateOverview(api3Response?.data?.data[0]);
          setSHAffiliateReferrals(api3Response?.data?.referrals);
          setOIAffiliateOverview(api4Response?.data?.data[0]);
          setOIAffiliateReferrals(api4Response?.data?.referrals);
          setLeaderboard(api5Response?.data?.data);
          setIsLoading(false);
        }
      )
      .catch((error) => {
        //   Handle errors here
        console.error(error);
      });
  }, []);

  function TruncatedName(name) {
    const originalName = name;
    const convertedName = originalName
      .toLowerCase() // Convert the entire name to lowercase
      .split(" ") // Split the name into words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(" "); // Join the words back together with a space

    // Trim the name to a maximum of 30 characters
    const truncatedName =
      convertedName.length > 30
        ? convertedName.substring(0, 30) + "..."
        : convertedName;

    return truncatedName;
  }

  const downloadOverall = () => {
    setDownloadingOverall(true);
    return new Promise((resolve, reject) => {
      axios
        .get(`${baseUrl}api/v1/affiliate/downloadaffiliateoverview`, {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
        })
        .then((res) => {
          resolve(res.data.data); // Resolve the promise with the data
          setDownloadingOverall(false);
        })
        .catch((err) => {
          console.log(err);
          reject(err); // Reject the promise with the error'
          setDownloadingOverall(false);
        });
    });
  };

  const downloadYoutube = () => {
    setDownloadingYoutube(true);
    return new Promise((resolve, reject) => {
      axios
        .get(`${baseUrl}api/v1/affiliate/downloadytaffiliateoverview`, {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
        })
        .then((res) => {
          resolve(res.data.data); // Resolve the promise with the data
          setDownloadingYoutube(false);
        })
        .catch((err) => {
          console.log(err);
          reject(err); // Reject the promise with the error'
          setDownloadingYoutube(false);
        });
    });
  };

  const downloadStoxhero = () => {
    setDownloadingStoxhero(true);
    return new Promise((resolve, reject) => {
      axios
        .get(`${baseUrl}api/v1/affiliate/downloadshaffiliateoverview`, {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
        })
        .then((res) => {
          resolve(res.data.data); // Resolve the promise with the data
          setDownloadingStoxhero(false);
        })
        .catch((err) => {
          console.log(err);
          reject(err); // Reject the promise with the error'
          setDownloadingStoxhero(false);
        });
    });
  };

  const downloadOffline = () => {
    setDownloadingOffline(true);
    return new Promise((resolve, reject) => {
      axios
        .get(`${baseUrl}api/v1/affiliate/downloadoiaffiliateoverview`, {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
        })
        .then((res) => {
          resolve(res.data.data); // Resolve the promise with the data
          setDownloadingOffline(false);
        })
        .catch((err) => {
          console.log(err);
          reject(err); // Reject the promise with the error'
          setDownloadingOffline(false);
        });
    });
  };

  const handleDownload = async (nameVariable) => {
    console.log("Name:", nameVariable);
    try {
      // Wait for downloadContestData() to complete and return data
      let data = [];
      let csvData = [];
      if (nameVariable === "Overall Affiliate Data") {
        data = await downloadOverall();
        csvData = downloadHelper(data);
      }
      if (nameVariable === "Youtube Affiliate Data") {
        data = await downloadYoutube();
        csvData = downloadHelper(data);
      }
      if (nameVariable === "Stoxhero Affiliate Data") {
        data = await downloadStoxhero();
        csvData = downloadHelper(data);
      }
      if (nameVariable === "Offline Affiliate Data") {
        data = await downloadOffline();
        csvData = downloadHelper(data);
      }
      // Create the CSV content
      const csvContent = csvData?.map((row) => {
        return row?.map((row1) => row1.join(",")).join("\n");
      });

      // Create a Blob object with the CSV content
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });

      // Save the file using FileSaver.js
      saveAs(blob, `${nameVariable}.csv`);
    } catch (error) {
      console.error("Error downloading revenue data:", error);
    }
  };

  function downloadHelper(data) {
    let csvDataFile = [[]];
    let csvDataDailyPnl = [
      [
        "Full Name",
        "Code",
        "Email",
        "Mobile",
        "Signup User",
        "Total Revenue",
        "Affiliate Earning",
      ],
    ];
    if (data) {
      // dates = Object.keys(data)
      let csvpnlData = Object.values(data);
      csvDataFile = csvpnlData?.map((elem, index) => {
        return [
          TruncatedName(elem?.name),
          elem?.code,
          elem?.email,
          elem?.mobile,
          elem?.signupUsers,
          elem?.totalProductDiscountedPrice,
          elem?.totalAffiliatePayout,
        ];
      });
    }

    return [[...csvDataDailyPnl, ...csvDataFile]];
  }

  return (
    <MDBox
      mb={1}
      borderRadius={10}
      minHeight="auto"
      width="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      {!isLoading ? (
        <Grid
          container
          mb={1}
          spacing={1}
          xs={12}
          md={12}
          lg={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
          style={{ minWidth: "100%", minHeight: "auto" }}
        >
          <Grid
            item
            xs={12}
            md={12}
            lg={12}
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{ width: "100%", minHeight: "auto" }}
          >
            <Grid
              container
              spacing={1}
              xs={12}
              md={12}
              lg={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
              style={{ minWidth: "100%", minHeight: "auto" }}
            >
              <Grid
                item
                xs={12}
                md={12}
                lg={12}
                display="flex"
                justifyContent="center"
                alignContent="center"
                alignItems="center"
              >
                <Card
                  sx={{
                    minWidth: "100%",
                    cursor: "pointer",
                    borderRadius: 1,
                    backgroundColor: "lightgrey",
                  }}
                >
                  <Grid container xs={12} md={12} lg={12}>
                    <Grid
                      item
                      p={1}
                      xs={12}
                      md={12}
                      lg={8}
                      display="flex"
                      justifyContent="flex-start"
                    >
                      <MDTypography
                        variant="h6"
                        style={{ textAlign: "center" }}
                      >
                        Affiliate Program Overview
                      </MDTypography>
                    </Grid>
                    {!downloadingOverall ? (
                      <Grid
                        item
                        xs={12}
                        md={12}
                        lg={4}
                        display="flex"
                        justifyContent="flex-end"
                        alignContent="center"
                        alignItems="center"
                      >
                        <MDButton
                          variant="text"
                          color="success"
                          onClick={() => {
                            handleDownload(`Overall Affiliate Data`);
                          }}
                        >
                          Download Data
                        </MDButton>
                      </Grid>
                    ) : (
                      <Grid
                        item
                        xs={12}
                        md={12}
                        lg={4}
                        display="flex"
                        justifyContent="flex-end"
                        alignContent="center"
                        alignItems="center"
                      >
                        <MDTypography
                          mr={5}
                          fontSize={15}
                          color="warning"
                          fontWeight="bold"
                        >
                          Downloading
                        </MDTypography>
                      </Grid>
                    )}
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          <Grid
            item
            xs={12}
            md={12}
            lg={12}
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{ width: "100%", minHeight: "auto" }}
          >
            <Grid
              container
              spacing={1}
              xs={12}
              md={12}
              lg={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
              style={{ minWidth: "100%", minHeight: "auto" }}
            >
              <Grid
                item
                xs={12}
                md={12}
                lg={12}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                {affiliateOverview && (
                  <LifetimeAffiliateData
                    affiliateOverview={affiliateOverview}
                    affiliateReferrals={affiliateReferrals}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid
          container
          mb={1}
          spacing={1}
          xs={12}
          md={12}
          lg={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
          style={{ minWidth: "100%", minHeight: "380px" }}
        >
          <CircularProgress />
        </Grid>
      )}

      {!isLoading ? (
        <Grid
          container
          mb={1}
          spacing={1}
          xs={12}
          md={12}
          lg={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
          style={{ minWidth: "100%", minHeight: "auto" }}
        >
          <Grid
            item
            xs={12}
            md={12}
            lg={12}
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{ width: "100%", minHeight: "auto" }}
          >
            <Grid
              container
              spacing={1}
              xs={12}
              md={12}
              lg={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
              style={{ minWidth: "100%", minHeight: "auto" }}
            >
              <Grid
                item
                xs={12}
                md={12}
                lg={12}
                display="flex"
                justifyContent="center"
                alignContent="center"
                alignItems="center"
              >
                <Card
                  sx={{
                    minWidth: "100%",
                    cursor: "pointer",
                    borderRadius: 1,
                    backgroundColor: "lightgrey",
                  }}
                >
                  <Grid container xs={12} md={12} lg={12}>
                    <Grid
                      item
                      p={1}
                      xs={12}
                      md={12}
                      lg={8}
                      display="flex"
                      justifyContent="flex-start"
                    >
                      <MDTypography
                        variant="h6"
                        style={{ textAlign: "center" }}
                      >
                        YouTube Affiliates Overview
                      </MDTypography>
                    </Grid>
                    {!downloadingYoutube ? (
                      <Grid
                        item
                        xs={12}
                        md={12}
                        lg={4}
                        display="flex"
                        justifyContent="flex-end"
                        alignContent="center"
                        alignItems="center"
                      >
                        <MDButton
                          variant="text"
                          color="success"
                          onClick={() => {
                            handleDownload(`Youtube Affiliate Data`);
                          }}
                        >
                          Download Data
                        </MDButton>
                      </Grid>
                    ) : (
                      <Grid
                        item
                        xs={12}
                        md={12}
                        lg={4}
                        display="flex"
                        justifyContent="flex-end"
                        alignContent="center"
                        alignItems="center"
                      >
                        <MDTypography
                          mr={5}
                          fontSize={15}
                          color="warning"
                          fontWeight="bold"
                        >
                          Downloading
                        </MDTypography>
                      </Grid>
                    )}
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          <Grid
            item
            xs={12}
            md={12}
            lg={12}
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{ width: "100%", minHeight: "auto" }}
          >
            <Grid
              container
              spacing={1}
              xs={12}
              md={12}
              lg={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
              style={{ minWidth: "100%", minHeight: "auto" }}
            >
              <Grid
                item
                xs={12}
                md={12}
                lg={12}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                {ytaffiliateOverview ? (
                  <LifetimeYouTubeAffiliateData
                    ytaffiliateOverview={ytaffiliateOverview}
                    ytaffiliateReferrals={ytaffiliateReferrals}
                  />
                ) : (
                  <Card
                    sx={{
                      minWidth: "100%",
                      cursor: "pointer",
                      borderRadius: 1,
                    }}
                  >
                    <CardActionArea>
                      <MDBox
                        display="flex"
                        justifyContent="center"
                        alignContent="center"
                        alignItems="center"
                        style={{ minHeight: "20vH", width: "100%" }}
                      >
                        <MDTypography>No Data</MDTypography>
                      </MDBox>
                    </CardActionArea>
                  </Card>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid
          container
          mb={1}
          spacing={1}
          xs={12}
          md={12}
          lg={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
          style={{ minWidth: "100%", minHeight: "380px" }}
        >
          <CircularProgress />
        </Grid>
      )}

      {!isLoading ? (
        <Grid
          container
          mb={1}
          spacing={1}
          xs={12}
          md={12}
          lg={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
          style={{ minWidth: "100%", minHeight: "auto" }}
        >
          <Grid
            item
            xs={12}
            md={12}
            lg={12}
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{ width: "100%", minHeight: "auto" }}
          >
            <Grid
              container
              spacing={1}
              xs={12}
              md={12}
              lg={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
              style={{ minWidth: "100%", minHeight: "auto" }}
            >
              <Grid
                item
                xs={12}
                md={12}
                lg={12}
                display="flex"
                justifyContent="center"
                alignContent="center"
                alignItems="center"
              >
                <Card
                  sx={{
                    minWidth: "100%",
                    cursor: "pointer",
                    borderRadius: 1,
                    backgroundColor: "lightgrey",
                  }}
                >
                  <Grid container xs={12} md={12} lg={12}>
                    <Grid
                      item
                      p={1}
                      xs={12}
                      md={12}
                      lg={8}
                      display="flex"
                      justifyContent="flex-start"
                    >
                      <MDTypography
                        variant="h6"
                        style={{ textAlign: "center" }}
                      >
                        StoxHero Affiliates Overview
                      </MDTypography>
                    </Grid>
                    {!downloadingStoxhero ? (
                      <Grid
                        item
                        xs={12}
                        md={12}
                        lg={4}
                        display="flex"
                        justifyContent="flex-end"
                        alignContent="center"
                        alignItems="center"
                      >
                        <MDButton
                          variant="text"
                          color="success"
                          onClick={() => {
                            handleDownload(`Stoxhero Affiliate Data`);
                          }}
                        >
                          Download Data
                        </MDButton>
                      </Grid>
                    ) : (
                      <Grid
                        item
                        xs={12}
                        md={12}
                        lg={4}
                        display="flex"
                        justifyContent="flex-end"
                        alignContent="center"
                        alignItems="center"
                      >
                        <MDTypography
                          mr={5}
                          fontSize={15}
                          color="warning"
                          fontWeight="bold"
                        >
                          Downloading
                        </MDTypography>
                      </Grid>
                    )}
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          <Grid
            item
            xs={12}
            md={12}
            lg={12}
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{ width: "100%", minHeight: "auto" }}
          >
            <Grid
              container
              spacing={1}
              xs={12}
              md={12}
              lg={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
              style={{ minWidth: "100%", minHeight: "auto" }}
            >
              <Grid
                item
                xs={12}
                md={12}
                lg={12}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                {shaffiliateOverview ? (
                  <LifetimeStoxHeroAffiliateData
                    shaffiliateOverview={shaffiliateOverview}
                    shaffiliateReferrals={shaffiliateReferrals}
                  />
                ) : (
                  <Card
                    sx={{
                      minWidth: "100%",
                      cursor: "pointer",
                      borderRadius: 1,
                    }}
                  >
                    <CardActionArea>
                      <MDBox
                        display="flex"
                        justifyContent="center"
                        alignContent="center"
                        alignItems="center"
                        style={{ minHeight: "20vH", width: "100%" }}
                      >
                        <MDTypography>No Data</MDTypography>
                      </MDBox>
                    </CardActionArea>
                  </Card>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid
          container
          mb={1}
          spacing={1}
          xs={12}
          md={12}
          lg={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
          style={{ minWidth: "100%", minHeight: "380px" }}
        >
          <CircularProgress />
        </Grid>
      )}

      {!isLoading ? (
        <Grid
          container
          mb={1}
          spacing={1}
          xs={12}
          md={12}
          lg={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
          style={{ minWidth: "100%", minHeight: "auto" }}
        >
          <Grid
            item
            xs={12}
            md={12}
            lg={12}
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{ width: "100%", minHeight: "auto" }}
          >
            <Grid
              container
              spacing={1}
              xs={12}
              md={12}
              lg={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
              style={{ minWidth: "100%", minHeight: "auto" }}
            >
              <Grid
                item
                xs={12}
                md={12}
                lg={12}
                display="flex"
                justifyContent="center"
                alignContent="center"
                alignItems="center"
              >
                <Card
                  sx={{
                    minWidth: "100%",
                    cursor: "pointer",
                    borderRadius: 1,
                    backgroundColor: "lightgrey",
                  }}
                >
                  <Grid container xs={12} md={12} lg={12}>
                    <Grid
                      item
                      p={1}
                      xs={12}
                      md={12}
                      lg={8}
                      display="flex"
                      justifyContent="flex-start"
                    >
                      <MDTypography
                        variant="h6"
                        style={{ textAlign: "center" }}
                      >
                        Offline Institute Affiliates Overview
                      </MDTypography>
                    </Grid>
                    {!downloadingOffline ? (
                      <Grid
                        item
                        xs={12}
                        md={12}
                        lg={4}
                        display="flex"
                        justifyContent="flex-end"
                        alignContent="center"
                        alignItems="center"
                      >
                        <MDButton
                          variant="text"
                          color="success"
                          onClick={() => {
                            handleDownload(`Offline Affiliate Data`);
                          }}
                        >
                          Download Data
                        </MDButton>
                      </Grid>
                    ) : (
                      <Grid
                        item
                        xs={12}
                        md={12}
                        lg={4}
                        display="flex"
                        justifyContent="flex-end"
                        alignContent="center"
                        alignItems="center"
                      >
                        <MDTypography
                          mr={5}
                          fontSize={15}
                          color="warning"
                          fontWeight="bold"
                        >
                          Downloading
                        </MDTypography>
                      </Grid>
                    )}
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          <Grid
            item
            xs={12}
            md={12}
            lg={12}
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{ width: "100%", minHeight: "auto" }}
          >
            <Grid
              container
              spacing={1}
              xs={12}
              md={12}
              lg={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
              style={{ minWidth: "100%", minHeight: "auto" }}
            >
              <Grid
                item
                xs={12}
                md={12}
                lg={12}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                {oiaffiliateOverview ? (
                  <LifetimeOfflineAffiliateData
                    oiaffiliateOverview={oiaffiliateOverview}
                    oiaffiliateReferrals={oiaffiliateReferrals}
                  />
                ) : (
                  <Card
                    sx={{
                      minWidth: "100%",
                      cursor: "pointer",
                      borderRadius: 1,
                    }}
                  >
                    <CardActionArea>
                      <MDBox
                        display="flex"
                        justifyContent="center"
                        alignContent="center"
                        alignItems="center"
                        style={{ minHeight: "20vH", width: "100%" }}
                      >
                        <MDTypography>No Data</MDTypography>
                      </MDBox>
                    </CardActionArea>
                  </Card>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid
          container
          mb={1}
          spacing={1}
          xs={12}
          md={12}
          lg={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
          style={{ minWidth: "100%", minHeight: "380px" }}
        >
          <CircularProgress />
        </Grid>
      )}

      {!isLoading ? (
        // <Grid container mb={1} spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{ minWidth: '100%', minHeight: 'auto' }}>
        <Grid
          item
          xs={12}
          md={12}
          lg={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
          style={{ width: "100%", minHeight: "auto" }}
        >
          <Grid
            container
            spacing={1}
            xs={12}
            md={12}
            lg={12}
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{ minWidth: "100%", minHeight: "auto" }}
          >
            <Grid
              item
              xs={12}
              md={12}
              lg={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <LeaderBoard leaderboard={leaderboard} />
            </Grid>
          </Grid>
        </Grid>
      ) : (
        // </Grid>
        <Grid
          container
          mb={1}
          spacing={1}
          xs={12}
          md={12}
          lg={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
          style={{ minWidth: "100%", minHeight: "380px" }}
        >
          <CircularProgress />
        </Grid>
      )}
    </MDBox>
  );
}
