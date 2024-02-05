const segment = {
  basic: 'Basic',
  medium: 'Medium',
  advanced: 'Advanced',
};

const quiz = {
  timer: 600000,
  quizId: '797667',
  quizTitle: 'StoxHero',
  quizSynopsis: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim',
  nrOfQuestions: '4',
  questions: [
    {
      questionId: "5555",
      question: 'What is Stoxhero ?',
      // questionPic: 'https://dummyimage.com/600x400/000/fff&text=X',
      questionType: 'text',
      answerSelectionType: 'single',
      answers: [
        {option: 'Game', _id: 'asdf'},
        {option: 'Company', _id: 'asdf1'},
      ],
      correctAnswer: '2',
      messageForCorrectAnswer: 'Correct answer. Good job.',
      messageForIncorrectAnswer: 'Incorrect answer. Please try again.',
      explanation: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      point: '20',
      segment: segment.advanced,
    },
    {
      questionId: "55553",
      question: 'Can you learn trading from stoxhero ?',
      questionType: 'text',
      answerSelectionType: 'single',
      answers: [
        {option: 'Yes', _id: 'asdf'},
        {option: 'No', _id: 'asdf1'},

      ],
      correctAnswer: '1',
      messageForCorrectAnswer: 'Correct answer. Good job.',
      messageForIncorrectAnswer: 'Incorrect answer. Please try again.',
      explanation: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      point: '20',
      segment: segment.basic,
    },
    {
      questionId: "55553",
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
      questionId: "55557",
      question: 'Which is not belong to stoxhero ?',
      questionType: 'text',
      answerSelectionType: 'multiple',
      answers: [
        {option: 'Tenx', _id: '123456'},
        {option: 'TestZone', _id: '123456'},
        {option: 'PrepZone', _id: '123456'}
      ],
      correctAnswer: [1,2],
      messageForCorrectAnswer: 'Correct answer. Good job.',
      messageForIncorrectAnswer: 'Incorrect answer. Please try again.',
      explanation: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      point: '30',
      segment: segment.medium,
    },
  ],
};

// export default quiz;

function formatData(data){
  const quiz = {
    timer: data?.durationInSeconds,
    quizId: data?._id,
    quizTitle: data?.title,
    nrOfQuestions: data?.questions?.length,
  }
  let que = [];
  data.questions.map((elem)=>{
    let checkTextOrPhoto = true;
    const option = [];
    const answer = [];
    elem.options.map((subelem, index)=>{
      subelem.optionText && option.push({option: subelem.optionText, _id: subelem?._id});
      subelem.optionImage && option.push({option: subelem.optionImage, _id: subelem?._id});
      
      if(subelem.optionImage){
        checkTextOrPhoto = false;
      }
    })
    let obj = {
      questionId: elem?._id,
      question: elem?.title,
      questionType: checkTextOrPhoto ? 'text' : 'photo',
      answerSelectionType: elem?.type==='Single Correct' ? 'single' : 'multiple',
      answers: option,
      correctAnswer: answer?.length === 1 ? `${answer[0]}` : answer,
      point: elem?.score
    };

    if(elem?.questionImage) obj.questionPic = elem?.questionImage;
    que.push(obj)
  })

  quiz.questions = que;

  return quiz;
}

export default formatData;
