import React, { useState, useEffect } from "react";
import moment from "moment";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDSnackbar from "../../components/MDSnackbar";
import MDTypography from "../../components/MDTypography";
import DataTable from "../../examples/Tables/DataTable";
// import RoleData from './data/RoleData';
import User from "./searchUserInfluencer";
import MDButton from "../../components/MDButton";
import { TextField } from "@mui/material";
import axios from "axios";
import { apiUrl } from "../../constants/constants";
import EditIcon from "@mui/icons-material/Edit";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import UploadImage from "../../assets/images/uploadimage.png";

const DeactivateUser = () => {
  const [reRender, setReRender] = useState(true);
  const [data, setData] = useState([]);
  const [channelsData, setChannelsData] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [titlePreviewUrl, setTitlePreviewUrl] = useState("");
  const [titlePreviewUrlMobile, setTitlePreviewUrlMobile] = useState("");
  const [file, setFile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [fileMobile, setFileMobile] = useState(null);
  const [influencerData, setInfluencerData] = useState({
    state: "",
    city: "",
    tags: "",
    about: "",
  });
  const [influencerChannelData, setInfluencerChannelData] = useState({
    channel: "",
    influencerHandle: "",
    followers: "",
  });
  const [created, setCreated] = useState(false);
  // const { columns, rows } = RoleData(reRender);
  console.log("selected", selectedUser);
  console.log("channels data", channelsData);
  let baseUrl =
    process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/";
  const handleBannerImageWeb = (event) => {
    setFile(event.target.files[0]);
    const file = event.target.files[0];
    // setTitleImage(event.target.files);
    // console.log("Title File:",file)
    // Create a FileReader instance
    const reader = new FileReader();
    reader.onload = () => {
      setTitlePreviewUrl(reader.result);
      // console.log("Title Preview Url:",reader.result)
    };
    reader.readAsDataURL(file);
  };
  const [ntitle, setNtitle] = useState("");
  const [content, setContent] = useState("");

  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = (ntitle, content) => {
    setNtitle(ntitle);
    setContent(content);
    setSuccessSB(true);
  };
  const closeSuccessSB = () => setSuccessSB(false);

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title={ntitle}
      content={content}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
    />
  );

  const [errorSB, setErrorSB] = useState(false);
  const openErrorSB = (ntitle, content) => {
    setNtitle(ntitle);
    setContent(content);
    setErrorSB(true);
  };
  const closeErrorSB = () => setErrorSB(false);

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title={ntitle}
      content={content}
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  const handleBannerImageMobile = (event) => {
    setFileMobile(event.target.files[0]);
    const fileMobile = event.target.files[0];
    // setTitleImage(event.target.files);
    // console.log("Title File:",file)
    // Create a FileReader instance
    const reader = new FileReader();
    reader.onload = () => {
      setTitlePreviewUrlMobile(reader.result);
      // console.log("Title Preview Url:",reader.result)
    };
    reader.readAsDataURL(file);
  };

  const handleEditInfluencer = async (elem) => {
    const res = await axios.get(
      `${baseUrl}api/v1/user/searchuser?search=${elem?.mobile}`,
      {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      }
    );
    if (res.data.status == "success") setEdit(true);
    console.log("edit select", res.data.data[0]);
    setSelectedUser({
      ...res.data.data[0],
      slug: res.data.data[0]?.slug,
      about: res.data.data[0]?.influencerDetails?.about,
      tags: res.data.data[0]?.influencerDetails?.tags.join(),
      state: res.data.data[0]?.influencerDetails?.state,
      city: res.data.data[0]?.influencerDetails?.city,
    });
    setInfluencerData({
      ...res.data.data[0],
      slug: res.data.data[0]?.slug,
      about: res.data.data[0]?.influencerDetails?.about,
      tags: res.data.data[0]?.influencerDetails?.tags.join(),
      state: res.data.data[0]?.influencerDetails?.state,
      city: res.data.data[0]?.influencerDetails?.city,
    });
  };
  console.log("infdata", influencerData);

  useEffect(() => {
    // axios.get(`${baseUrl}api/v1/readmocktradecompanypagination/${skip}/${limit}`)
    axios
      .get(`${baseUrl}api/v1/influencer`, { withCredentials: true })
      .then((res) => {
        setData(res?.data?.data);
        setChannelsData(res?.data?.data?.influencerDetails?.channelDetails);
        console.log(res?.data?.data);
      })
      .catch((err) => {
        //window.alert("Server Down");
        return new Error(err);
      });
  }, [reRender, created]);
  const columns = [
    { Header: "Name", accessor: "name", align: "center" },
    { Header: "Email", accessor: "email", align: "center" },
    { Header: "Mobile", accessor: "mobile", align: "center" },
    { Header: "AddedOn", accessor: "time", align: "center" },
    { Header: "Edit", accessor: "edit", align: "center" },
    { Header: "Remove", accessor: "remove", align: "center" },
  ];

  let rows = [];
  const channelColumns = [
    { Header: "Channel", accessor: "channel", align: "center" },
    { Header: "Handle", accessor: "influencerHandle", align: "center" },
    { Header: "Followers", accessor: "followers", align: "center" },
  ];

  let channelRows = [];

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setInfluencerData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name == "slug" || name == "myReferralCode") {
      setSelectedUser((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  const handleChannelDataChange = async (e) => {
    const { name, value } = e.target;
    setInfluencerChannelData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddInfluencer = async () => {
    const { about, tags, state, city } = influencerData;
    const formData = new FormData();
    if (!file) {
      //return error
    }

    if (file) {
      formData.append("bannerImageWeb", file);
    }
    if (fileMobile) {
      formData.append("bannerImageMobile", file);
    }

    const payload = {
      city,
      state,
      tags,
      about,
      myReferralCode: selectedUser?.myReferralCode,
      slug: selectedUser?.slug || influencerData?.slug,
    };
    for (let elem in payload) {
      if (elem !== "bannerImageWeb") formData.append(`${elem}`, payload[elem]);
    }

    try {
      const res = await axios.post(
        `${apiUrl}user/influencer/${selectedUser?._id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res.data);
      if (res.status == 201 && res.data.status == "success") {
        openSuccessSB("Success", "Influencer Added Successfully");
        setCreated(true);
        setSelectedUser();
        setInfluencerData();
      }
    } catch (e) {
      console.log(e);
    }
  };
  const editInfluencer = async () => {
    const { about, tags, state, city } = influencerData;
    const formData = new FormData();

    if (file) {
      formData.append("bannerImageWeb", file);
    }
    if (fileMobile) {
      formData.append("bannerImageMobile", file);
    }

    const payload = {
      city,
      state,
      tags,
      about,
      myReferralCode: selectedUser?.myReferralCode,
      slug: selectedUser?.slug || influencerData?.slug,
    };
    for (let elem in payload) {
      if (elem !== "bannerImageWeb") formData.append(`${elem}`, payload[elem]);
    }

    try {
      const res = await axios.patch(
        `${apiUrl}user/influencer/${selectedUser?._id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res.data);
      if (res.status == 201 && res.data.status == "success") {
        openSuccessSB("Success", "Influencer Edited Successfully");
        setCreated(true);
        setSelectedUser();
        setInfluencerData();
        setEdit(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const addChannelDetails = async () => {
    const { channel, influencerHandle, followers } = influencerChannelData;
    const payload = {
      channel,
      influencerHandle,
      followers,
    };
    try {
      const res = await axios.patch(
        `${apiUrl}user/influencer/${selectedUser?._id}/channels`,
        payload,
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      if (res.data.status == "success") {
        setCreated(true);
        console.log("ho gaya");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleRemoveInfluencer = async (elem) => {
    console.log("elem is", elem);
    try {
      const res = await axios.delete(`${apiUrl}user/influencer/${elem?._id}`, {
        withCredentials: true,
      });
      console.log(res.data);
      if (res.data.status == "success") {
        setReRender(!reRender);
      }
    } catch (e) {
      console.log(e);
    }
  };

  data?.map((elem) => {
    let obj = {};

    obj.name = (
      <MDTypography
        component="a"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {elem?.first_name + " " + elem?.last_name}
      </MDTypography>
    );
    obj.email = (
      <MDTypography
        component="a"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {elem.email}
      </MDTypography>
    );
    obj.mobile = (
      <MDTypography
        component="a"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {elem?.mobile}
      </MDTypography>
    );
    obj.time = (
      <MDTypography
        component="a"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {moment.utc(elem.createdOn).format("DD-MMM-YY HH:mm:ss")}
      </MDTypography>
    );
    obj.edit = (
      <MDButton
        component="a"
        variant="caption"
        color="text"
        fontWeight="medium"
        onClick={() => {
          handleEditInfluencer(elem);
        }}
      >
        <EditIcon />
      </MDButton>
    );
    obj.remove = (
      <MDButton
        component="a"
        variant="caption"
        color="text"
        fontWeight="medium"
        onClick={() => {
          handleRemoveInfluencer(elem);
        }}
      >
        <PersonRemoveIcon />
      </MDButton>
    );

    rows.push(obj);
  });
  channelsData?.map((elem) => {
    let obj = {};

    obj.channel = (
      <MDTypography
        component="a"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {elem?.channel}
      </MDTypography>
    );
    obj.influencerHandle = (
      <MDTypography
        component="a"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {elem?.influencerHandle}
      </MDTypography>
    );
    obj.followers = (
      <MDTypography
        component="a"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {elem?.followers}
      </MDTypography>
    );

    rows.push(obj);
  });
  return (
    <>
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={12} lg={12}>
            <User
              reRender={reRender}
              setReRender={setReRender}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
            />
            {selectedUser && (
              <MDBox>
                <MDTypography fontWeight="bold" fontSize={22}>
                  Selected User
                </MDTypography>
                <MDTypography fontSize={14}>
                  Name:{" "}
                  {selectedUser?.first_name + " " + selectedUser?.last_name}
                </MDTypography>
                <MDTypography fontSize={14}>
                  Email: {selectedUser?.email}
                </MDTypography>
                <MDTypography fontSize={14} mb={2}>
                  Mobile: {selectedUser?.mobile}
                </MDTypography>
                <TextField
                  label="City"
                  value={selectedUser?.city}
                  name="city"
                  onChange={handleChange}
                />
                <TextField
                  label="State"
                  value={selectedUser?.state}
                  name="state"
                  onChange={handleChange}
                />
                <TextField
                  label="Tags"
                  name="tags"
                  value={selectedUser?.tags}
                  onChange={handleChange}
                />
                <TextField
                  label="About"
                  name="about"
                  value={selectedUser?.about}
                  onChange={handleChange}
                />
                <TextField
                  label="Slug"
                  name="slug"
                  value={influencerData?.slug}
                  onChange={handleChange}
                />
                <TextField
                  label="Referral Code"
                  name="myReferralCode"
                  value={selectedUser?.myReferralCode}
                  onChange={handleChange}
                />
                {titlePreviewUrl ? (
                  <Grid
                    item
                    mt={0.5}
                    xs={12}
                    md={12}
                    lg={12}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    style={{ maxWidth: "100%", border: "1px dashed #ccc" }}
                  >
                    <img
                      src={titlePreviewUrl}
                      alt="Preview"
                      style={{ maxWidth: "100%" }}
                    />
                  </Grid>
                ) : (
                  <Grid
                    item
                    mt={0.5}
                    xs={12}
                    md={12}
                    lg={12}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    style={{
                      maxWidth: "100%",
                      minHeight: "220px",
                      border: "1px dashed #ccc",
                    }}
                  >
                    <input
                      type="file"
                      onChange={handleBannerImageWeb}
                      // disabled={editing}
                      accept="image/*"
                      style={{ display: "none", cursor: "pointer" }}
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" style={{ cursor: "pointer" }}>
                      <Grid
                        container
                        xs={12}
                        md={12}
                        lg={12}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
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
                          <img src={UploadImage} width="20px" />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={12}
                          lg={12}
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <MDTypography variant="caption" component="span">
                            {!influencerData?.bannerImageWeb?.name
                              ? "Upload Banner Image Web(2560 * 480px)"
                              : "Upload Another Image"}
                          </MDTypography>
                        </Grid>
                      </Grid>
                    </label>
                  </Grid>
                )}
                {titlePreviewUrlMobile ? (
                  <Grid
                    item
                    mt={0.5}
                    xs={12}
                    md={12}
                    lg={12}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    style={{ maxWidth: "100%", border: "1px dashed #ccc" }}
                  >
                    <img
                      src={titlePreviewUrlMobile}
                      alt="Preview"
                      style={{ maxWidth: "100%" }}
                    />
                  </Grid>
                ) : (
                  <Grid
                    item
                    mt={0.5}
                    xs={12}
                    md={12}
                    lg={12}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    style={{
                      maxWidth: "100%",
                      minHeight: "220px",
                      border: "1px dashed #ccc",
                    }}
                  >
                    <input
                      type="file"
                      onChange={handleBannerImageMobile}
                      // disabled={editing}
                      accept="image/*"
                      style={{ display: "none", cursor: "pointer" }}
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" style={{ cursor: "pointer" }}>
                      <Grid
                        container
                        xs={12}
                        md={12}
                        lg={12}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
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
                          <img src={UploadImage} width="20px" />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={12}
                          lg={12}
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <MDTypography variant="caption" component="span">
                            {!influencerData?.bannerImageMobile?.name
                              ? "Upload Banner Image Mobile(853*480px)"
                              : "Upload Another Image"}
                          </MDTypography>
                        </Grid>
                      </Grid>
                    </label>
                  </Grid>
                )}
                <MDButton
                  onClick={() => {
                    edit ? editInfluencer() : handleAddInfluencer();
                  }}
                >
                  {edit ? "Edit Influencer" : "Add Influencer"}
                </MDButton>
                <MDButton
                  onClick={() => {
                    setSelectedUser();
                    setEdit(false);
                  }}
                >
                  Discard
                </MDButton>
              </MDBox>
            )}
            {false && (
              <MDBox>
                <MDTypography>Channel Details</MDTypography>
                <TextField
                  label="Channel"
                  name="channel"
                  onChange={handleChannelDataChange}
                />
                <TextField
                  label="Handle"
                  name="influencerHandle"
                  onChange={handleChannelDataChange}
                />
                <TextField
                  label="Followers"
                  number
                  name="followers"
                  onChange={handleChannelDataChange}
                />
                <MDButton
                  onClick={() => {
                    addChannelDetails();
                  }}
                >
                  Add Channel Details
                </MDButton>
                <MDButton onClick={() => {}}>Reset</MDButton>
                <MDTypography variant="h6" py={2.5}>
                  Channels
                </MDTypography>
                <DataTable
                  table={{ channelColumns, channelRows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            )}
            <Card>
              <MDBox
                // mt={2}
                // mx={2}
                mt={2}
                // py={1}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <MDTypography variant="h6" color="white" py={2.5}>
                  Influencers
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
        {renderSuccessSB}
        {renderErrorSB}
      </MDBox>
    </>
  );
};

export default DeactivateUser;
