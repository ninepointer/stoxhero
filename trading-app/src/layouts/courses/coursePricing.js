import * as React from "react";
import {
  useState,
  useEffect,
} from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import MDSnackbar from "../../components/MDSnackbar";
import { useLocation, useNavigate } from "react-router-dom";
import { apiUrl } from "../../constants/constants";

const CoursePricing = ({setActiveStep, activeStep, steps}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formState, setFormState] = useState({});
  const [checkFilled, setCheckFilled] = useState(false);
  const queryString = location.search;
  const urlParams = new URLSearchParams(queryString);
  const [editClicked, setEditClicked] = useState(false);

  // Get the value of the "mobile" parameter
  const courseId = urlParams.get('id');
  const paramsActiveSteps = urlParams.get('activestep');

  useEffect(()=>{
    if(courseId){
      fetchCourseData();
    }
  }, [paramsActiveSteps, courseId])

  async function fetchCourseData(){
    try{
      const data = await axios.get(`${apiUrl}courses/${courseId}`, {withCredentials: true});

      setFormState({
        coursePrice: data?.data?.data?.coursePrice,
        discountedPrice: data?.data?.data?.discountedPrice,
        commissionPercentage: data?.data?.data?.commissionPercentage,
      });
      if(data?.data?.data?.coursePrice || data?.data?.data?.discountedPrice || data?.data?.data?.commissionPercentage){
        setCheckFilled(true);
        setEditing(true);
      } 
    } catch(err){

    }
  }

  async function onSubmit() {

    if(checkFilled){
      setActiveStep(activeStep + 1)
      return navigate(`/coursedetails?id=${courseId}&activestep=${activeStep + 1}`)
    }

    const { coursePrice, discountedPrice, commissionPercentage } = formState;
    if(discountedPrice > coursePrice){
      return openErrorSB("Error", 'Discounted price should not be greater then course price!');
    }
    const res = await fetch(`${apiUrl}courses/${courseId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        coursePrice, discountedPrice, commissionPercentage
      })
    });

    const data = await res.json();

    if (res.status === 200 || data) {
      openSuccessSB("Pricing Stored", data.message);
      setActiveStep(activeStep + 1)
      navigate(`/coursedetails?id=${courseId}&activestep=${activeStep + 1}`)

    } else {

    }
  }

  async function onEdit() {
    const {commissionPercentage, discountedPrice, coursePrice} = formState;

    if(Number(discountedPrice) > Number(coursePrice)){
      return openErrorSB("Error", 'Discounted price should not be greater then course price!');
    }
    
    const res = await fetch(`${apiUrl}courses/${courseId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        commissionPercentage, discountedPrice, coursePrice
      }),
    });

    const data = await res.json();
    const updatedData = data?.data;
    if (updatedData || res.status === 200) {
      openSuccessSB(
        "Pricing Edited",
        ""
      );
      setEditClicked(false);
      setEditing(true);
    
    } else {
      openErrorSB("Error", data.message);
    }
  }

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [successSB, setSuccessSB] = useState(false);
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

  async function editAndSave(){
    if(editing){
      setEditing(false);
      setEditClicked(true);
    } else{
      onEdit();
    }
  }

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
          bgColor="light"
          color="dark"
          mb={1}
          borderRadius={10}
          minHeight="auto"
          display="flex"
          justifyContent="center"
          alignItems="center"
          style={{ minWidth: "100%" }}
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
          >
            <Grid
              item
              xs={12}
              md={6}
              lg={4}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <TextField
                disabled={editing}
                id="outlined-required"
                // label='Course Name *'
                placeholder="Course Price"
                value={formState?.coursePrice || ''}
                fullWidth
                type="number"
                onChange={(e) => {
                  setFormState((prevState) => ({
                    ...prevState,
                    coursePrice: Math.abs(e.target.value),
                  }));
                }}
              />
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
              lg={4}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <TextField
                disabled={editing}
                id="outlined-required"
                // label='Course Name *'
                placeholder="Course Discounted Price"
                value={
                  formState?.discountedPrice || ''
                }
                fullWidth
                type="number"
                onChange={(e) => {
                  setFormState((prevState) => ({
                    ...prevState,
                    discountedPrice: Math.abs(e.target.value),
                  }));
                }}
              />
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
              lg={4}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <TextField
                disabled={editing}
                id="outlined-required"
                // label='Course Name *'
                placeholder="Commission Percentage"
                value={
                  formState?.commissionPercentage || ''
                }
                fullWidth
                type="number"
                onChange={(e) => {
                  setFormState((prevState) => ({
                    ...prevState,
                    commissionPercentage: Math.abs(e.target.value),
                  }));
                }}
              />
            </Grid>



              <Grid
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                spacing={2}
                mt={2}
              >
                {activeStep !== 0 && activeStep !== steps.length - 1 && (
                  <Grid item>
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

                {activeStep !== steps.length - 1 && (
                  <>
                    <Grid item>
                      <MDButton
                        variant="contained"
                        color="warning"
                        size="small"
                        onClick={onEdit}
                      >
                        Save as Draft
                      </MDButton>
                    </Grid>

                    <Grid item>
                      <MDButton
                        variant="contained"
                        color="success"
                        size="small"
                        disabled={Object.keys(formState).length === 0}
                        onClick={editAndSave}
                      >
                        {editing ? 'Edit' : 'Edit & Save'}
                      </MDButton>
                    </Grid>

                    <Grid item>
                      <MDButton
                        variant="contained"
                        color="success"
                        disabled={editClicked}
                        size="small"
                        onClick={() => {
                          onSubmit();
                        }}
                      >
                        Save & Continue
                      </MDButton>
                    </Grid>
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
export default CoursePricing;
