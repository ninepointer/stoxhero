import React, { useState, useContext, useEffect } from "react"
import { useNavigate } from 'react-router-dom';
import background from '../../../../assets/images/finowledge.png'
// import logo from '../../assets/images/logo1.jpeg'
import ReactGA from "react-ga";
// @mui material components
import { Grid, Stack, Pagination } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import MDButton from "../../../../components/MDButton";
import { userContext } from "../../../../AuthContext";
import axios from 'axios';
import { apiUrl } from "../../../../constants/constants";
import Timer from './timer';
import { useMediaQuery } from '@mui/material'
import theme from '../../../HomePage/utils/theme/index';

function Cover({ quiz, timer }) {
  const getDetails = useContext(userContext)
  const limitSetting = 1;
  const [skip, setSkip] = useState(0);
  const [questions, setQuestions] = useState(quiz?.questions);
  let [page, setPage] = useState(1);
  const count = quiz?.questions?.length;
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"))
  const [selectedAnswers, setSelectedAnswers] = useState([]);


  useEffect(()=>{
    setQuestions(quiz?.questions?.slice(skip, skip + limitSetting))
  },[skip])

  useEffect(()=>{
    console.log('isMobile works')
    setSelectedAnswers(questions[0]?.answers?.map((elem, index) => questions[0]?.responses?.includes(elem?._id) ? index : null).filter(index => index !== null) || [])
  },[questions])


  console.log('isMobile',questions[0]  )

  const handlePageChange = (event, value) => {
    console.log( 'isMobile value', value)
    setPage(value);
    setSkip((Number(value)-1)*limitSetting);
    // setSelectedAnswers([]);
  };

  const handleNext = async () => {
    if(page !== count){
      await axios.patch(`${apiUrl}quiz/response/insertresponse/${quiz?.quizId}`,{questionId: questions?.[0]?.questionId, optionId: selectedAnswers.map(elem => questions?.[0]?.answers[elem]?._id)}, {withCredentials: true});
      quiz.questions[skip].responses = selectedAnswers.map(elem => questions?.[0]?.answers[elem]?._id);
      setSkip((Number(page+1)-1)*limitSetting)
      setPage(++page);
    } else if (page === count){
      await axios.patch(`${apiUrl}quiz/response/insertresponse/${quiz?.quizId}`,{questionId: questions?.[0]?.questionId, optionId: selectedAnswers.map(elem => questions?.[0]?.answers[elem]?._id)}, {withCredentials: true});
      await axios.patch(`${apiUrl}quiz/response/submit/${quiz?.quizId}`, { student: true }, { withCredentials: true });
    }
  };

  const handleBack = () => {
    if(page !== 1){
      setSkip((Number(page-1)-1)*limitSetting);
      setPage(--page);
      // setSelectedAnswers([]);
    }
  };

  const submitQuiz = async () =>{
    await axios.patch(`${apiUrl}quiz/response/submit/${quiz?.quizId}`, { student: true }, { withCredentials: true });
  }


  const handleButtonClick = (index) => {
    // If answer selection type is 'Single', clear previous selection and set the new one
    if (questions?.[0]?.answerSelectionType.includes('Single')) {
      setSelectedAnswers([index]);
    } else {
      // If answer selection type is 'Multiple', toggle selection
      setSelectedAnswers((prevSelectedAnswers) => {
        if (prevSelectedAnswers.includes(index)) {
          return prevSelectedAnswers.filter((item) => item !== index);
        } else {
          return [...prevSelectedAnswers, index];
        }
      });
    }
  };

  return (
    <>
      <MDBox display='flex' justifyContent='center' flexDirection='column' alignContent='center' alignItems='center' style={{
        minHeight: '100vh',
        backgroundColor: '#353535'
      }}>

        <Grid container item xs={12} md={12} lg={10} p={1} justifyContent="space-between" alignContent={'center'}>
          <Timer timer={timer} />
          <Grid item>
            <MDButton
              variant="contained"
              size="small"
              color="success"
              onClick={submitQuiz}
            >
              SUBMIT
            </MDButton>
          </Grid>
        </Grid>

        <Grid container item xs={12} mt={5} md={12} lg={12} display="flex" justifyContent="center" alignItems='center' >
          <Stack spacing={2}>
            <Pagination
              count={Math.ceil(count / limitSetting)}
              onChange={handlePageChange} 
              page={page}
              siblingCount={isMobile ? 1 : (Math.ceil(count / limitSetting))}
              color="success"
              hidePrevButton
              hideNextButton
              sx={{
                '& .MuiPaginationItem-page': {
                  color: '#ffffff',
                },
                '& .Mui-selected': {
                  color: '#ffffff',
                },
              }}
            />
          </Stack>
        </Grid>


        <Grid container item xs={12} mt={10} md={12} lg={12} display="flex" justifyContent="center" alignItems='center' >
          <Grid item xs={10} md={8} lg={6}>
            <MDTypography fontSize={25} fontWeight={1000} color='light' align="center">
              {/* What is the capital of India? Please explain in brief. */}
              {questions?.[0]?.question}
            </MDTypography>
          </Grid>
        </Grid>

        <Grid container item xs={12} mt={2} md={12} lg={12} display="flex" justifyContent="center" alignItems='center' >
          <Grid item xs={10} md={8} lg={6}>
            <MDTypography fontSize={15} fontWeight={500} color='light' align="center">
              {questions?.[0]?.answerSelectionType}
            </MDTypography>
          </Grid>
        </Grid>


        <Grid container item xs={12} mt={2} md={12} lg={10} p={1} display="flex" justifyContent="center" alignItems="center" spacing={2}>
          {
            questions?.[0]?.answers.map((elem, index) => (
              <Grid item key={elem?._id} xs={12} sm={6} md={3}>
                <MDButton
                  variant="contained"
                  size="small"
                  color={selectedAnswers.includes(index) ? 'warning' : "success"}
                  onClick={()=>{handleButtonClick(index)}}
                  style={{textTransform: 'none', minWidth: '100%', minHeight: '20vh', fontSize: '1.2rem', fontWeight: 'normal' }} // Adjust styles for mobile
                >
                  {elem?.option}
                </MDButton>
              </Grid>
            ))
          }
        </Grid>

        <Grid container item xs={12} mt={10} md={12} lg={10} p={1} justifyContent="flex-end" gap={2}>
          <MDButton
            variant="contained"
            size="small"
            color="success"
            onClick={handleBack}
            disabled={page === 1}
          >
            Back
          </MDButton>

          <MDButton
            variant="contained"
            size="small"
            color="success"
            onClick={handleNext}
            // disabled={page === count}
          >
            {page === count ? 'Submit' : 'Confirm'}
          </MDButton>
        </Grid>
      </MDBox>
    </>

  );
}

export default Cover;