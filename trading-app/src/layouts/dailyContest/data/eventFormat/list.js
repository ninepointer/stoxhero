import { useState, useEffect } from "react";
import axios from "axios";
// import Box from '@mui/material/Box';
import DataTable from "../../../../examples/Tables/DataTable";
import MDButton from "../../../../components/MDButton";
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { AiOutlineEdit } from "react-icons/ai";
// import { CircularProgress } from "@mui/material";
// import TabContext from '@material-ui/lab/TabContext';

import DeleteIcon from "@mui/icons-material/Delete";

// import battleRewardData from "../data/battleRewardData";
// import CreateRewardForm from "./createReward"
import Create from "./create";
import { apiUrl } from "../../../../constants/constants";

const List = ({ contestId }) => {
  let columns = [
    { Header: "Edit", accessor: "edit", align: "center" },
    { Header: "Delete", accessor: "delete", align: "center" },
    { Header: "Order", accessor: "order", align: "center" },
    { Header: "Event", accessor: "event", align: "center" },
    { Header: "Description", accessor: "des", align: "center" },
  ];

  let rows = [];
  const [createForm, setCreateForm] = useState(false);
  const [data, setData] = useState([]);
  // const { columns, rows } = battleRewardData();
  const [id, setId] = useState();

  // let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  useEffect(() => {
    axios
      .get(`${apiUrl}dailycontest/${contestId}/eventformat`, { withCredentials: true })
      .then((res) => {
        setData(res.data.data?.eventFormat);
        // console.log(res.data.data);
      })
      .catch((err) => {
        return new Error(err);
      });
  }, [createForm]);

  data?.map((elem) => {
    let obj = {};

    obj.edit = (
      // <MDButton variant="text" color="info" size="small" sx={{fontSize:10}} fontWeight="medium">
      <AiOutlineEdit
        onClick={() => {
          setCreateForm(true);
          setId(elem);
        }}
        style={{ cursor: "pointer" }}
      />
      // </MDButton>
    );

    obj.delete = (
      <DeleteIcon
        onClick={() => {
          deleteData(elem?._id);
        }}
        style={{ cursor: "pointer" }}
      />
    );
    obj.order = (
      <MDTypography
        component="a"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {elem.order}
      </MDTypography>
    );
    obj.event = (
      <MDTypography
        component="a"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {elem.event}
      </MDTypography>
    );
    obj.des = (
      <MDTypography
        component="a"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {elem.description}
      </MDTypography>
    );

    rows.push(obj);
  });

  async function deleteData(id) {
    const del = await axios.delete(
      `${apiUrl}dailycontest/${contestId}/eventformat/${id}`,
      { withCredentials: true }
    );
    setData(del?.data?.data?.eventFormat);
  }

  return (
    <Card mt={1}>
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
            Event Format
          </MDTypography>
          <MDButton
            hidden={true}
            variant="outlined"
            size="small"
            color="black"
            onClick={() => setCreateForm(true)}
          >
            Create Event Format
          </MDButton>
        </MDBox>
      </MDBox>
      {createForm && (
        <>
          <Create
            createForm={createForm}
            setCreateForm={setCreateForm}
            contestId={contestId}
            eventformat={id}
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

export default List;
