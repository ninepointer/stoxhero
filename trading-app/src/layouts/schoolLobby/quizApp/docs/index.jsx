import React, { useState, useEffect } from 'react';
import Quiz from '../lib/Quiz';
import formatData from './quiz';
import axios from 'axios';
import { apiUrl } from '../../../../constants/constants';
// import quiz from './quiz';

function Cover() {
  const [quizResult, setQuizResult] = useState({});
  const id = "65bd1597d0283f5f82e70cd9";
  useEffect(()=>{
    fetchData();
    initiateQuiz();
  }, [])

  async function fetchData(){
    const data = await axios.get(`${apiUrl}quiz/${id}`, {withCredentials: true});
    const quizData = formatData(data?.data?.data)
    setQuizResult(quizData);
  }

  async function initiateQuiz(){
    const data = await axios.post(`${apiUrl}quiz/response/${id}`,null, {withCredentials: true});
  }

  return (
    <div style={{ margin: 'auto', width: '500px' }}>
      {quizResult.timer &&
      <Quiz
        quiz={quizResult}
        shuffle
        shuffleAnswer
        // showInstantFeedback
      // continueTillCorrect
        onComplete={setQuizResult}
        onQuestionSubmit={(obj) => console.log('user question results:', obj)}
        disableSynopsis
        timer={quizResult?.timer}
        // allowPauseTimer
      />}
    </div>
  );
}

export default Cover;

