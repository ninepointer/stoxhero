import React, { useState, useEffect } from "react";
import moment from "moment";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
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

const DeactivateUser = () => {
  const [reRender, setReRender] = useState(true);
  const [data, setData] = useState([]);
  const [channelsData, setChannelsData] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
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
    const payload = {
      city,
      state,
      tags,
      about,
      myReferralCode: selectedUser?.myReferralCode,
      slug: selectedUser?.slug || setInfluencerData?.slug,
    };
    try {
      const res = await axios.post(
        `${apiUrl}user/influencer/${selectedUser?._id}`,
        payload,
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      if (res.status == 201 && res.data.status == "success") {
        setCreated(true);
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
                <MDTypography>Selected User</MDTypography>
                <MDTypography>
                  Name:{" "}
                  {selectedUser?.first_name + " " + selectedUser?.last_name}
                </MDTypography>
                <MDTypography>Email: {selectedUser?.email}</MDTypography>
                <MDTypography>Mobile: {selectedUser?.mobile}</MDTypography>
                <TextField label="City" name="city" onChange={handleChange} />
                <TextField label="State" name="state" onChange={handleChange} />
                <TextField label="Tags" name="tags" onChange={handleChange} />
                <TextField label="About" name="about" onChange={handleChange} />
                <TextField
                  label="Slug"
                  name="slug"
                  value={selectedUser?.slug || influencerData?.slug}
                  onChange={handleChange}
                />
                <TextField
                  label="Referral Code"
                  name="myReferralC0de"
                  value={selectedUser?.myReferralCode}
                  onChange={handleChange}
                />
                <MDButton
                  onClick={() => {
                    handleAddInfluencer();
                  }}
                >
                  Add Influencer
                </MDButton>
                <MDButton
                  onClick={() => {
                    setSelectedUser();
                  }}
                >
                  Discard
                </MDButton>
              </MDBox>
            )}
            {created && (
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
      </MDBox>
    </>
  );
};

export default DeactivateUser;
