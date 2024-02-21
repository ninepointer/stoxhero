import React, { useState, useEffect } from 'react';
import Quiz from '../lib/Quiz';
import formatData from './quiz';
import axios from 'axios';
import { apiUrl } from '../../../../constants/constants';
// import quiz from './quiz';

function Cover() {
  const [quizResult, setQuizResult] = useState({});
  const id = "65d470cf0f3ddaecf5ffca39";
  useEffect(() => {
    // initiateQuiz();
    fetchData();
  }, [])

  async function fetchData() {
    try {
      const initiate = await axios.post(`${apiUrl}quiz/response/${id}`, null, { withCredentials: true });
    } catch (err) {

    }

    const data = await axios.get(`${apiUrl}quiz/${id}`, { withCredentials: true });
    const question = await axios.get(`${apiUrl}quiz/response/${id}`, { withCredentials: true });
    const quizData = formatData(data?.data?.data, question?.data?.data?.questions)
    setQuizResult(quizData);
  }

  console.log('quizResult', quizResult)
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

