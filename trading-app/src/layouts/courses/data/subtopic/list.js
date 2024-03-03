import { useState, useEffect } from "react";
import axios from "axios";
// import Box from '@mui/material/Box';
import DataTable from "../../../../examples/Tables/DataTable";
import MDButton from "../../../../components/MDButton";
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import Grid from "@mui/material/Grid";
import { Card, Button } from "@mui/material";
import { AiOutlineEdit } from "react-icons/ai";
import Create from "./create";
import { apiUrl } from "../../../../constants/constants";
import StyleIcon from "@mui/icons-material/Style";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";

const List = ({ contentId, courseId, subTopics }) => {
  let columns = [
    { Header: "Edit", accessor: "edit", align: "center" },
    { Header: "Delete", accessor: "delete", align: "center" },
    { Header: "Order", accessor: "order", align: "center" },
    { Header: "Sub Topic", accessor: "subtopics", align: "center" },
    { Header: "Video", accessor: "videoUrl", align: "center" },
  ];

  let rows = [];
  const [createForm, setCreateForm] = useState(false);
  // const [quizQue, setQuizQue] = useState([]);
  const [id, setId] = useState({});
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [data, setData] = useState(subTopics);
  console.log("subtopics data", data);
  const handleClose = async (e) => {
    setOpen(false);
  };

  data?.map((elem) => {
    let obj = {};

    obj.edit = (
      <AiOutlineEdit
        onClick={() => {
          setCreateForm(true);
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
    obj.subtopics = (
      <MDTypography
        component="a"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {elem.topic}
      </MDTypography>
    );
    obj.videoUrl = (
      <video
        // poster={elem?.videoUrl}
        src={elem?.videoUrl}
        height={80}
        width={140}
      />
    );

    rows.push(obj);
  });

  async function deleteData(id) {
    const del = await axios.delete(
      `${apiUrl}courses/${courseId}/subtopic/${contentId}/${id}`,
      { withCredentials: true }
    );
    setData(del?.data?.data?.subtopics);
  }

  return (
    <>
      <StyleIcon
        style={{ cursor: "pointer" }}
        onClick={() => {
          setOpen(true);
        }}
      />
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle
          id="responsive-dialog-title"
          sx={{ textAlign: "center" }}
        ></DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{ display: "flex", flexDirection: "column", marginLeft: 2 }}
          >
            <Card>
              <MDBox
                display="flex"
                justifyContent="space-between"
                alignItems="left"
              >
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
                    Sub Topic
                  </MDTypography>
                  <MDButton
                    hidden={true}
                    variant="outlined"
                    size="small"
                    color="black"
                    onClick={() => {
                      setCreateForm(true);
                      setId("");
                    }}
                  >
                    Create Sub Topic
                  </MDButton>
                </MDBox>
              </MDBox>
              {createForm && (
                <>
                  <Create
                    createForm={createForm}
                    setCreateForm={setCreateForm}
                    courseId={courseId}
                    contentId={contentId}
                    subtopic={id}
                    data={data}
                    setData={setData}
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
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default List;
