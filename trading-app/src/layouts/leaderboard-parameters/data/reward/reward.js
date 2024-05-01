import { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "../../../../examples/Tables/DataTable";
import MDButton from "../../../../components/MDButton";
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import Card from "@mui/material/Card";
import { AiOutlineEdit } from "react-icons/ai";
import CreateRewards from "./createReward";
import { apiUrl } from "../../../../constants/constants";
import DeleteIcon from "@mui/icons-material/Delete";

const Rewards = ({ leaderboard }) => {
  let columns = [
    { Header: "Edit", accessor: "edit", align: "center" },
    { Header: "Delete", accessor: "delete", align: "center" },
    { Header: "Rank Start", accessor: "rankStart", align: "center" },
    { Header: "Rank End", accessor: "rankEnd", align: "center" },
    { Header: "Reward", accessor: "reward", align: "center" },
    { Header: "Reward Type", accessor: "rewardType", align: "center" },
    { Header: "Reward Value", accessor: "rewardValue", align: "center" },
  ];

  let rows = [];
  const [createRewardForm, setCreateRewardForm] = useState(false);
  const [rewards, setRewards] = useState([]);
  const [id, setId] = useState();

  useEffect(() => {
    axios
      .get(`${apiUrl}leaderboard/${leaderboard}/rewards`)
      .then((res) => {
        setRewards(res.data.data);
      })
      .catch((err) => {
        return new Error(err);
      });
  }, [createRewardForm]);

  rewards?.map((elem) => {
    let obj = {};

    obj.edit = (
      <AiOutlineEdit
        onClick={() => {
          setCreateRewardForm(true);
          setId(elem);
        }}
        style={{ cursor: "pointer" }}
      />
    );
    obj.delete = (
      <DeleteIcon
        onClick={() => {
          deleteData(elem?._id);
        }}
        style={{ cursor: "pointer" }}
      />
    );
    obj.rankStart = (
      <MDTypography
        component="a"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {elem.rankStart}
      </MDTypography>
    );
    obj.rankEnd = (
      <MDTypography
        component="a"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {elem.rankEnd}
      </MDTypography>
    );
    obj.reward = (
      <MDTypography
        component="a"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {elem.reward}
      </MDTypography>
    );
    obj.rewardValue = (
      <MDTypography
        component="a"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {elem.rewardValue}
      </MDTypography>
    );

    obj.rewardType = (
      <MDTypography
        component="a"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {elem.rewardType}
      </MDTypography>
    );

    rows.push(obj);
  });

  async function deleteData(id) {
    const del = await axios.delete(
      `${apiUrl}leaderboard/${leaderboard}/rewards/${id}`,
      { withCredentials: true }
    );
    setCreateRewardForm(del?.data?.data?.rewards);
  }
  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="left">
        <MDBox
          width="100%"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ backgroundColor: "lightgrey", borderRadius: "2px" }}
          p={1}
        >
          <MDTypography
            variant="text"
            fontSize={12}
            color="black"
            mt={0.7}
            alignItems="center"
            gutterBottom
          >
            Rewards
          </MDTypography>
          <MDButton
            hidden={true}
            variant="outlined"
            size="small"
            color="black"
            onClick={() => setCreateRewardForm(true)}
          >
            Create Reward
          </MDButton>
        </MDBox>
      </MDBox>
      {createRewardForm && (
        <>
          <CreateRewards
            createRewardForm={createRewardForm}
            setCreateRewardForm={setCreateRewardForm}
            leaderboard={leaderboard}
            reward={id}
          />
        </>
      )}
      <MDBox mt={1}>
        <DataTable
          table={{ columns, rows }}
          isSorted={false}
          entriesPerPage={false}
          showTotalEntries={false}
          noEndBorder
        />
      </MDBox>
    </Card>
  );
};

export default Rewards;
