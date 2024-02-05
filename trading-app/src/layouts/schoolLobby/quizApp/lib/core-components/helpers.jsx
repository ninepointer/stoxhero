import snarkdown from 'snarkdown';
import dompurify from 'dompurify';
import axios from 'axios';
import { apiUrl } from '../../../../../constants/constants';

export const rawMarkup = (data) => {
  const sanitizer = dompurify.sanitize;
  return { __html: snarkdown(sanitizer(data)) };
};

export const checkAnswer = async (index, quizId, questionId, selectedOption, correctAnswer, answerSelectionType, answers, {
  userInput,
  userAttempt,
  currentQuestionIndex,
  continueTillCorrect,
  showNextQuestionButton,
  incorrect,
  correct,
  setButtons,
  setIsCorrect,
  setIncorrectAnswer,
  setCorrect,
  setIncorrect,
  setShowNextQuestionButton,
  setUserInput,
  setUserAttempt,
}) => {
  // const indexStr = `${selectedOption}`;
  const disabledAll = {
    0: { disabled: true },
    1: { disabled: true },
    2: { disabled: true },
    3: { disabled: true },
  };

  console.log("in check answer",quizId, questionId, selectedOption, correctAnswer, answerSelectionType, answers, {
    userInput,
    userAttempt,
    currentQuestionIndex,
    continueTillCorrect,
    showNextQuestionButton,
    incorrect,
    correct,
  })
  // const userInputCopy = [...userInput];

  // console.log("userInputCopy", userInputCopy)
  
  if (answerSelectionType === 'single') {
    // if (userInputCopy[currentQuestionIndex] === undefined) {
    //   userInputCopy[currentQuestionIndex] = index;
    // }

    const getAnswer = await axios.get(`${apiUrl}quiz/response/correctanswer/${quizId}/${questionId}/${selectedOption?._id}`, {withCredentials: true});

    if (getAnswer?.data?.data) {
      // if (incorrect.indexOf(currentQuestionIndex) < 0 && correct.indexOf(currentQuestionIndex) < 0) {
      //   correct.push(currentQuestionIndex);
      // }


      // console.log("correct", correct)

      setButtons((prevState) => ({
        ...prevState,
        ...disabledAll,
        [index - 1]: {
          className: (getAnswer?.data?.data) ? 'correct' : 'incorrect',
        },
      }));

      setIsCorrect(true);
      setIncorrectAnswer(false);
      // setCorrect(correct);
      setShowNextQuestionButton(true);
    } else {
      // if (correct.indexOf(currentQuestionIndex) < 0 && incorrect.indexOf(currentQuestionIndex) < 0) {
      //   incorrect.push(currentQuestionIndex);
      // }

      // console.log("incorrect", incorrect)
      setButtons((prevState) => (
        {

          ...prevState,
          ...disabledAll,
          [index - 1]: {
            className: (getAnswer?.data?.data) ? 'correct' : 'incorrect',
          },
        }
      ));

      setShowNextQuestionButton(true);

      setIncorrectAnswer(true);
      setIsCorrect(false);
      // setIncorrect(incorrect);
    }
  } else {
    const maxNumberOfMultipleSelection = correctAnswer.length;

    // if (userInputCopy[currentQuestionIndex] === undefined) {
    //   userInputCopy[currentQuestionIndex] = [];
    // }

    // if (userInputCopy[currentQuestionIndex].length < maxNumberOfMultipleSelection) {
    //   userInputCopy[currentQuestionIndex].push(index);

    //   if (correctAnswer.includes(index)) {
    //     if (userInputCopy[currentQuestionIndex].length <= maxNumberOfMultipleSelection) {
    //       setButtons((prevState) => ({
    //         ...prevState,
    //         [index - 1]: {
    //           disabled: !prevState[index - 1],
    //           className: (correctAnswer.includes(index)) ? 'correct' : 'incorrect',
    //         },
    //       }));
    //     }
    //   } else if (userInputCopy[currentQuestionIndex].length <= maxNumberOfMultipleSelection) {
    //     setButtons((prevState) => ({
    //       ...prevState,
    //       [index - 1]: {
    //         className: (correctAnswer.includes(index)) ? 'correct' : 'incorrect',
    //       },
    //     }));
    //   }
    // }

    // if (maxNumberOfMultipleSelection === userAttempt) {
    //   let cnt = 0;
    //   for (let i = 0; i < correctAnswer.length; i += 1) {
    //     if (userInputCopy[currentQuestionIndex].includes(correctAnswer[i])) {
    //       cnt += 1;
    //     }
    //   }

    //   for (let i = 0; i < answers.length; i += 1) {
    //     if (correctAnswer.includes(i + 1)) {
    //       setButtons((prevState) => ({
    //         ...prevState,
    //         [i]: {},
    //       }));
    //     }
    //   }

    //   if (cnt === maxNumberOfMultipleSelection) {
    //     correct.push(currentQuestionIndex);

    //     setIsCorrect(true);
    //     setIncorrectAnswer(false);
    //     setCorrect(correct);
    //     setShowNextQuestionButton(true);
    //     setUserAttempt(1);
    //   } else {
    //     incorrect.push(currentQuestionIndex);

    //     setIncorrectAnswer(true);
    //     setIsCorrect(false);
    //     setIncorrect(incorrect);
    //     setShowNextQuestionButton(true);
    //     setUserAttempt(1);
    //   }
    // } else if (!showNextQuestionButton) {
    //   setUserAttempt(userAttempt + 1);
    // }
  }
  // setUserInput(userInputCopy);
};

export const selectAnswer = (index, correctAnswer, answerSelectionType, {
  userInput,
  currentQuestionIndex,
  setButtons,
  setShowNextQuestionButton,
  incorrect,
  correct,
  setCorrect,
  setIncorrect,
  setUserInput,
}) => {
  const selectedButtons = {
    0: { selected: false },
    1: { selected: false },
    2: { selected: false },
    3: { selected: false },
  };

  console.log("in select answer",   userInput,
  currentQuestionIndex,
  incorrect,
  correct)
  const userInputCopy = [...userInput];
  if (answerSelectionType === 'single') {
    correctAnswer = Number(correctAnswer);
    userInputCopy[currentQuestionIndex] = index;

    if (index === correctAnswer) {
      if (correct.indexOf(currentQuestionIndex) < 0) {
        correct.push(currentQuestionIndex);
      }
      if (incorrect.indexOf(currentQuestionIndex) >= 0) {
        incorrect.splice(incorrect.indexOf(currentQuestionIndex), 1);
      }
    } else {
      if (incorrect.indexOf(currentQuestionIndex) < 0) {
        incorrect.push(currentQuestionIndex);
      }
      if (correct.indexOf(currentQuestionIndex) >= 0) {
        correct.splice(correct.indexOf(currentQuestionIndex), 1);
      }
    }
    setCorrect(correct);
    setIncorrect(incorrect);

    setButtons((prevState) => ({
      ...prevState,
      ...selectedButtons,
      [index - 1]: {
        className: 'selected',
      },
    }));

    setShowNextQuestionButton(true);
  } else {
    if (userInputCopy[currentQuestionIndex] === undefined) {
      userInputCopy[currentQuestionIndex] = [];
    }
    if (userInputCopy[currentQuestionIndex].includes(index)) {
      userInputCopy[currentQuestionIndex].splice(userInputCopy[currentQuestionIndex].indexOf(index), 1);
    } else {
      userInputCopy[currentQuestionIndex].push(index);
    }

    if (userInputCopy[currentQuestionIndex].length === correctAnswer.length) {
      let exactMatch = true;
      // eslint-disable-next-line no-restricted-syntax
      for (const input of userInput[currentQuestionIndex]) {
        if (!correctAnswer.includes(input)) {
          exactMatch = false;
          if (incorrect.indexOf(currentQuestionIndex) < 0) {
            incorrect.push(currentQuestionIndex);
          }
          if (correct.indexOf(currentQuestionIndex) >= 0) {
            correct.splice(correct.indexOf(currentQuestionIndex), 1);
          }
          break;
        }
      }
      if (exactMatch) {
        if (correct.indexOf(currentQuestionIndex) < 0) {
          correct.push(currentQuestionIndex);
        }
        if (incorrect.indexOf(currentQuestionIndex) >= 0) {
          incorrect.splice(incorrect.indexOf(currentQuestionIndex), 1);
        }
      }
    } else {
      if (incorrect.indexOf(currentQuestionIndex) < 0) {
        incorrect.push(currentQuestionIndex);
      }
      if (correct.indexOf(currentQuestionIndex) >= 0) {
        correct.splice(correct.indexOf(currentQuestionIndex), 1);
      }
    }
    setCorrect(correct);
    setIncorrect(incorrect);
    setButtons((prevState) => ({
      ...prevState,
      [index - 1]: {
        className: userInputCopy[currentQuestionIndex].includes(index) ? 'selected' : undefined,
      },
    }));

    if (userInputCopy[currentQuestionIndex].length > 0) {
      setShowNextQuestionButton(true);
    }
  }
  setUserInput(userInputCopy);
};
