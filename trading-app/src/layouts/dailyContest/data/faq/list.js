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
    { Header: "Question", accessor: "que", align: "center" },
    { Header: "Answer", accessor: "ans", align: "center" },
  ];

  let rows = [];
  const [createForm, setCreateForm] = useState(false);
  const [faqData, setFaqData] = useState([]);
  // const { columns, rows } = battleRewardData();
  const [id, setId] = useState();

  // let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  useEffect(() => {
    axios
      .get(`${apiUrl}dailycontest/${contestId}/faq`, { withCredentials: true })
      .then((res) => {
        setFaqData(res.data.data?.faqs);
        // console.log(res.data.data);
      })
      .catch((err) => {
        return new Error(err);
      });
  }, [createForm]);

  faqData?.map((elem) => {
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
    obj.que = (
      <MDTypography
        component="a"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {elem.question}
      </MDTypography>
    );
    obj.ans = (
      <MDTypography
        component="a"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {elem.answer}
      </MDTypography>
    );

    rows.push(obj);
  });

  async function deleteData(id) {
    const del = await axios.delete(
      `${apiUrl}dailycontest/${contestId}/faq/${id}`,
      { withCredentials: true }
    );
    setFaqData(del?.data?.data?.faqs);
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
            FAQ
          </MDTypography>
          <MDButton
            hidden={true}
            variant="outlined"
            size="small"
            color="black"
            onClick={() => setCreateForm(true)}
          >
            Create FAQ
          </MDButton>
        </MDBox>
      </MDBox>
      {createForm && (
        <>
          <Create
            createForm={createForm}
            setCreateForm={setCreateForm}
            contestId={contestId}
            faq={id}
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
