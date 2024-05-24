import * as React from "react";
import { useContext, useState, useRef } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton";
import { userContext } from "../../AuthContext";
import { CircularProgress } from "@mui/material";
import MDSnackbar from "../../components/MDSnackbar";
import { useLocation, useNavigate } from "react-router-dom";
import Instuctor from './data/addInstructor/viewList';
import Faq from './data/faq/list';
import Content from './data/Content/list';
import Benefits from './data/Benefits/list'

function CreateCourse({setActiveStep, activeStep, steps}) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  // Get the value of the "mobile" parameter
  const courseId = urlParams.get('id');
  const navigate = useNavigate();
  const location = useLocation();
  const id = location?.state?.data;
  const [courseData, setCourseData] = useState(id ? id : "");
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState(courseData?.courseName || "");



  const [ntitle, setNtitle] = useState("");
  const [content, setContent] = useState("");

  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = (ntitle, content) => {
    setTitle(ntitle);
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
    setTitle(ntitle);
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

  return (
    <>
      {isLoading ? (
        <MDBox
          mt={10}
          mb={10}
          display="flex"
          width="100%"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress color="info" />
        </MDBox>
      ) : (
        <MDBox
          display="flex"
          flexDirection='column'
          justifyContent="center"
          gap={2}
        >
          <Instuctor courseId={courseId} />
          <Faq courseId={courseId} />
          <Content courseId={courseId} />
          <Benefits courseId={courseId} />

            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              spacing={2}
              mt={2}
            >

              {activeStep !== 0 && activeStep !== steps.length - 1 && (
                <Grid
                  item
                >
                  <MDButton
                    variant="contained"
                    color="dark"
                    size="small"
                    onClick={() => { setActiveStep(activeStep - 1); navigate(`/coursedetails?id=${courseId}&activestep=${activeStep - 1}`) }}
                  >
                    Previous
                  </MDButton>
                </Grid>
              )}
              <Grid
                item
                spacing={2}
              >
                {activeStep !== steps.length - 1 && (
                  <>
                 
                    <MDButton
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => { setActiveStep(activeStep + 1); navigate(`/coursedetails?id=${courseId}&activestep=${activeStep + 1}`) }}
                    >
                      Continue
                    </MDButton>
                  </>
                )}
                
              </Grid>
            </Grid>



          {renderSuccessSB}
          {renderErrorSB}
        </MDBox>
      )}
    </>
  );
}
export default CreateCourse;
