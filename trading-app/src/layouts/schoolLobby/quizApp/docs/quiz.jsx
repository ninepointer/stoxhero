const segment = {
  basic: 'Basic',
  medium: 'Medium',
  advanced: 'Advanced',
};

const quiz = {
  quizTitle: 'StoxHero',
  quizSynopsis: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim',
  nrOfQuestions: '4',
  questions: [
    {
      question: 'What is Stoxhero ?',
      // questionPic: 'https://dummyimage.com/600x400/000/fff&text=X',
      questionType: 'text',
      answerSelectionType: 'single',
      answers: [
        'Game',
        'Company',
      ],
      correctAnswer: '2',
      messageForCorrectAnswer: 'Correct answer. Good job.',
      messageForIncorrectAnswer: 'Incorrect answer. Please try again.',
      explanation: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      point: '20',
      segment: segment.advanced,
    },
    {
      question: 'Can you learn trading from stoxhero ?',
      questionType: 'text',
      answerSelectionType: 'single',
      answers: [
        'Yes',
        'No',
      ],
      correctAnswer: '1',
      messageForCorrectAnswer: 'Correct answer. Good job.',
      messageForIncorrectAnswer: 'Incorrect answer. Please try again.',
      explanation: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      point: '20',
      segment: segment.basic,
    },
    {
      question: 'Can you earn money from stoxhero?',
      questionType: 'text',
      answerSelectionType: 'single',
      answers: [
        'True',
        'False',
      ],
      correctAnswer: '1',
      messageForCorrectAnswer: 'Correct answer. Good job.',
      messageForIncorrectAnswer: 'Incorrect answer. Please try again.',
      explanation: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      point: '10',
    },
    {
      question: 'Which is not belong to stoxhero ?',
      questionType: 'text',
      answerSelectionType: 'single',
      answers: [
        'Tenx',
        'TestZone',
        'PrepZone',
      ],
      correctAnswer: '3',
      messageForCorrectAnswer: 'Correct answer. Good job.',
      messageForIncorrectAnswer: 'Incorrect answer. Please try again.',
      explanation: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      point: '30',
      segment: segment.medium,
    },
  ],
};

export default quiz;

// function formatData(data){
//   let que = [];
//   data.questions.map((elem)=>{
//     let checkTextOrPhoto = true;
//     const option = [];
//     const answer = [];
//     elem.options.map((subelem, index)=>{
//       subelem.optionText && option.push(subelem.optionText);
//       subelem.optionImage && option.push(subelem.optionImage);

//       if(subelem.isCorrect){
//         answer.push(index+1)
//       }
      
//       if(subelem.optionImage){
//         checkTextOrPhoto = false;
//       }
//     })
//     let obj = {
//       question: elem.title,
//       questionType: checkTextOrPhoto ? 'text' : 'photo',
//       answerSelectionType: elem.type==='Single Correct' ? 'single' : 'multiple',
//       answers: option,
//       correctAnswer: answer.length === 1 ? `${answer[0]}` : answer,
//       point: elem.score
//     };

//     if(elem.questionImage) obj.questionPic = elem.questionImage;
//     que.push(obj)
//   })

//   return que;
// }

// export default formatData;
