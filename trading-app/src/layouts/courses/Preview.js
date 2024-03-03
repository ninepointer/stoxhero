import * as React from "react";
import {
  useContext,
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton";
import { userContext } from "../../AuthContext";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import MDSnackbar from "../../components/MDSnackbar";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { useLocation, useNavigate } from "react-router-dom";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import dayjs from "dayjs";
import JoditEditor from "jodit-react";
import UploadImage from "../../assets/images/uploadimage.png";
import UploadVideo from "../../assets/images/uploadvideo.png";
import { apiUrl } from "../../constants/constants";

const CoursePricing = ({setActiveStep, activeStep, steps, from}) => {
  console.log('from', from)
  const navigate = useNavigate();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const [course, setCourse] = useState({});
  const [buttonClicked, setButtonClicked] = useState(false);

  // Get the value of the "mobile" parameter
  const courseId = urlParams.get('id');
  const paramsActiveSteps = urlParams.get('activestep');

  useEffect(()=>{
    fetchData()
  },[courseId])

  const fetchData = async ()=>{
    const getData = await axios.get(`${apiUrl}courses/${courseId}`, {withCredentials: true});
    setCourse(getData?.data?.data);
  }

  
  async function publish(){
    try{
      const publish = await axios.get(`${apiUrl}courses/${courseId}/publish`, {withCredentials: true});
      openSuccessSB('Course Published', '')
      setButtonClicked(true);
    } catch(err){
      openErrorSB('Error', err.message)
    }
  }

  async function unpublish(){
    try{
      const publish = await axios.get(`${apiUrl}courses/${courseId}/unpublish`, {withCredentials: true});
      openSuccessSB('Course Published', '');
      setButtonClicked(true);
    } catch(err){
      openErrorSB('Error', err.message)
    }
  }

  async function sendCreatorApproval(){
    try{
      const publish = await axios.get(`${apiUrl}courses/${courseId}/creatorapproval`, {withCredentials: true});
      openSuccessSB('Course sent to approval', '');
      setButtonClicked(true);
    } catch(err){
      openErrorSB('Error', err.message)
    }
  }



  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = (title, content) => {
    setTitle(title)
    setContent(content)
    setSuccessSB(true);
  }
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
    setTitle(title)
    setContent(content)
    setErrorSB(true);
  }
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
    <>
      <MDBox
          bgColor="light"
          color="dark"
          mb={1}
          borderRadius={10}
          minHeight="auto"
          display="flex"
          flexDirection='column'
          justifyContent="center"
          alignItems="center"
          style={{ minWidth: "100%" }}
        >
          <h2>Preview</h2>




            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              spacing={2}
              mt={2}
            >
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

          {((course?.status !== 'Sent To Creator') ) &&
            <Grid item>
              <MDButton
                variant="contained"
                color="warning"
                size="small"
                onClick={course?.status === 'Draft' ? sendCreatorApproval : (course?.status === 'Published') ? unpublish : publish}
              >
                {course?.status === 'Draft' ? 'Send To Creator' : (course?.status === 'Published') ? 'Unpublish' : 'Publish'}
              </MDButton>
            </Grid>}


            </Grid>
          
          {renderSuccessSB}
          {renderErrorSB}
        </MDBox>
    </>
  );
}
export default CoursePricing;
