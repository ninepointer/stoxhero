import * as React from "react";
import {
  useContext,
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import {Box, Typography} from "@mui/material";
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
import moment from 'moment'

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

  let data = {};

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
          {/* <h2>Preview</h2> */}


        <MDBox style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', marginBottom: '12px', padding: '12px', borderRadius: '16px', boxShadow: "0px 4px 6px -2px rgba(0, 0, 0, 0.5)", width: '100%' }}>
          <MDBox sx={{ display: 'flex', flexDirection: "column" }}>
          <MDTypography style={{ fontSize: '14px', marginBottom: '12px', fontWeight: 800, color: '#000000' }} >Course Basic Details</MDTypography>
          
            <MDBox>
              <MDBox sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Course Name: <span style={{ fontWeight: 600 }}>{`${course.courseName}`}</span></MDTypography>
                <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Course Language: <span style={{ fontWeight: 600 }}>{`${course?.courseLanguages}`}</span></MDTypography>
                <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Course Duration: <span style={{ fontWeight: 600 }}>{`${course?.courseDurationInMinutes}`}</span></MDTypography>
                <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Max Enrollments: <span style={{ fontWeight: 600 }}>{`${course?.maxEnrolments}`}</span></MDTypography>
              </MDBox>

              <MDBox sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Type: <span style={{ fontWeight: 600 }}>{`${course.type}`}</span></MDTypography>
                <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Course Type: <span style={{ fontWeight: 600 }}>{`${course?.courseType}`}</span></MDTypography>
                <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Course Category: <span style={{ fontWeight: 600 }}>{`${course?.category}`}</span></MDTypography>
                <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Level: <span style={{ fontWeight: 600 }}>{`${course?.level}`}</span></MDTypography>
              </MDBox>

              {(course.courseStartTime || course.courseEndTime) &&
                <MDBox sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Registration Starts: <span style={{ fontWeight: 600 }}>{`${moment(course?.registrationStartTime).format('DD MM YY hh:mm a')}`}</span></MDTypography>
                  <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Registration Ends: <span style={{ fontWeight: 600 }}>{`${moment(course?.registrationEndTime).format('DD MM YY hh:mm a')}`}</span></MDTypography>
                  <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Course Starts: <span style={{ fontWeight: 600 }}>{`${moment(course?.courseStartTime).format('DD MM YY hh:mm a')}`}</span></MDTypography>
                  <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Course Ends: <span style={{ fontWeight: 600 }}>{`${moment(course?.courseEndTime).format('DD MM YY hh:mm a')}`}</span></MDTypography>
                </MDBox>
              }

              <MDBox sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Course Overview: <span style={{ fontWeight: 600 }}>{`${course.courseOverview}`}</span></MDTypography>
              </MDBox>
            </MDBox>
          
            <MDTypography style={{ fontSize: '14px', marginBottom: '2px', fontWeight: 800, color: '#000000' }} >Course Description</MDTypography>
            <MDBox style={{ maxWidth: '100%', width: '100%', height: 'auto' }}>
              <div dangerouslySetInnerHTML={{ __html: course?.courseDescription }} />
            </MDBox>

            <MDTypography style={{ fontSize: '14px', marginBottom: '2px', fontWeight: 800, color: '#000000' }} >Pricing Details</MDTypography>
            <MDBox sx={{ display: 'flex', justifyContent: 'center', flexDirection: "column" }}>
              <MDBox sx={{ display: 'flex', gap: 5 }}>
                <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Actual Price: <span style={{ fontWeight: 600 }}>{course?.coursePrice}</span></MDTypography>
                <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Discounted Price: <span style={{ fontWeight: 600 }}>{`${course?.discountedPrice}`}</span></MDTypography>
                <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Commission %: <span style={{ fontWeight: 600 }}>{`${course?.commissionPercentage}`}</span></MDTypography>
              </MDBox>
            </MDBox>

            {/* <MDTypography style={{ fontSize: '14px', marginBottom: '12px', fontWeight: 600, color: '#000000' }} >Item Details</MDTypography>
            <MDBox sx={{ display: 'flex', justifyContent: 'center', flexDirection: "column" }}>
              <ItemTable items={data.item_details} />
            </MDBox> */}

            <MDTypography style={{ fontSize: '14px', margin: '2px 0px 2px 0px', fontWeight: 800, color: '#000000' }} >Instructor Details</MDTypography>
            <MDBox sx={{ display: 'flex', justifyContent: 'space-between' }}>
              {course?.courseInstructors?.map((elem) => {
                return (
                  <>
                    <MDBox>
                      <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Instructor Name: <span style={{ fontWeight: 600 }}>{`${elem?.id?.first_name + " " + elem?.id?.last_name}`}</span></MDTypography>
                      <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >About Instructor: <span style={{ fontWeight: 600 }}>{`${elem?.about}`}</span></MDTypography>
                    </MDBox>
                    <MDBox>
                      <img src={elem?.image} alt="image" style={{ height: '70px', width: '70px' }} />
                    </MDBox>
                  </>
                )
              })}
              
            </MDBox>

            <MDTypography style={{ fontSize: '14px', margin: '2px 0px 2px 0px', fontWeight: 800, color: '#000000' }} >Course Topics</MDTypography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              {course?.courseContent?.map((elem) => (
                <Box key={elem._id} sx={{ margin: '2px' }}>
                  <Typography style={{ fontSize: '16px' }}> <span>{elem?.order}.</span> {elem?.topic}</Typography>
                  <ul style={{ marginLeft: "30px" }}>
                    {elem?.subtopics?.map((item, index) => (
                      <li key={index}>
                        <Typography style={{ fontSize: '14px', marginBottom: '1px' }}> {item?.topic}</Typography>
                      </li>
                    ))}
                  </ul>
                </Box>
              ))}
            </Box>

            <MDTypography style={{ fontSize: '14px', margin: '2px 0px 2px 0px', fontWeight: 800, color: '#000000' }} >Course Benefits</MDTypography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              {course?.courseBenefits?.map((elem) => (
                <Box key={elem._id} sx={{ margin: '2px' }}>
                  <Typography style={{ fontSize: '16px', marginBottom: '2px' }}> <span>{elem?.order}.</span> {elem?.benefits}</Typography>
                </Box>
              ))}
            </Box>

            <MDTypography style={{ fontSize: '14px', margin: '2px 0px 2px 0px', fontWeight: 800, color: '#000000' }} >FAQ's</MDTypography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              {course?.faqs?.map((elem) => (
                <Box key={elem._id} sx={{ margin: '2px' }}>
                  <Typography style={{ fontSize: '16px', marginBottom: '2px' }}> <span>{"Question"} : </span> {elem?.question}</Typography>
                  <Typography style={{ fontSize: '16px', marginBottom: '2px' }}> <span>{"Answer"} : </span> {elem?.answer}</Typography>
                </Box>
              ))}
            </Box>
          </MDBox>

        </MDBox>



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

          {((course?.status !== 'Sent To Creator') && !buttonClicked ) &&
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
