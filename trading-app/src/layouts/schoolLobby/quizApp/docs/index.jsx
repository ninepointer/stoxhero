import React, { useState, useEffect } from 'react';
import Quiz from '../lib/Quiz';
// import formatData from './quiz';
import axios from 'axios';
import { apiUrl } from '../../../../constants/constants';
import quiz from './quiz';

function Cover() {
  const [data, setData] = useState();
  const [quizResult, setQuizResult] = useState();

  // useEffect(()=>{

  // }, [])

  // async function fetchData(){
  //   const data = await axios.get(`${apiUrl}quiz/`)
  // }
  return (
    <div style={{ margin: 'auto', width: '500px' }}>
      <Quiz
        quiz={quiz}
        shuffle
        shuffleAnswer
        showInstantFeedback
      // continueTillCorrect
        onComplete={setQuizResult}
        onQuestionSubmit={(obj) => console.log('user question results:', obj)}
        disableSynopsis
        timer={60}
        allowPauseTimer
      />
    </div>
  );
}

export default Cover;

