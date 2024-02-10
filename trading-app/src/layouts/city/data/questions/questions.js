import { useState, useEffect } from 'react';
import axios from "axios";
// import Box from '@mui/material/Box';
import DataTable from "../../../../examples/Tables/DataTable";
import MDButton from "../../../../components/MDButton"
import MDBox from "../../../../components/MDBox"
import MDTypography from "../../../../components/MDTypography"
import Grid from "@mui/material/Grid";
import {Card, Button} from "@mui/material";
import { AiOutlineEdit } from 'react-icons/ai';
import CreateQuestion from './createQuestions';
import { apiUrl } from '../../../../constants/constants';
import StyleIcon from '@mui/icons-material/Style';
import Options from '../options/options';

const Question = ({ quiz }) => {

    // const [reRender, setReRender] = useState(true);
    let columns = [
        { Header: "Edit", accessor: "edit", align: "center" },
        { Header: "Options", accessor: "options", align: "center" },
        { Header: "Title", accessor: "title", align: "center" },
        { Header: "Type", accessor: "type", align: "center" },
        { Header: "Score", accessor: "score", align: "center" },
        { Header: "Image", accessor: "questionImage", align: "center" },
    ];

    let rows = [];
    const [createQuestionForm, setCreateQuestionForm] = useState(false);
    const [quizQue, setQuizQue] = useState([]);
    const [id, setId] = useState({});

    useEffect(() => {
        axios.get(`${apiUrl}quiz/${quiz}/question`, {withCredentials: true})
            .then((res) => {
                setQuizQue(res?.data?.data);
            }).catch((err) => {
                return new Error(err);
            })
    }, [createQuestionForm])

    quizQue?.questions?.map((elem) => {
        let queObj = {}

        queObj.edit = (
            <AiOutlineEdit onClick={() => { setCreateQuestionForm(true); setId(elem) }} style={{cursor: "pointer"}} />
        );

        queObj.options = (
            // <StyleIcon 
            // style={{cursor: "pointer"}}
            // // onClick={() => { setCreateQuestionForm(true); setId(elem) }}
            //  />
            <Options quizId={quizQue?._id} questionId={elem?._id} optionData={elem?.options} />
        );
        queObj.title = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                {elem.title}
            </MDTypography>
        );
        queObj.type = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                {elem.type}
            </MDTypography>
        );
        queObj.score = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                {elem.score}
            </MDTypography>
        );
        queObj.questionImage = (
            <img src={elem?.questionImage} style={{width: "100px", height: "100px"}} />
        );

        rows.push(queObj)
    })

    console.log("quiz data", quizQue);
    return (

        <Card>
            <MDBox display="flex" justifyContent="space-between" alignItems="left">
                <MDBox width="100%" display="flex" justifyContent="space-between" alignItems="center" sx={{ backgroundColor: "lightgrey", borderRadius: "2px" }} p={1}>
                    <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
                        Question
                    </MDTypography>
                    <MDButton hidden={true} variant="outlined" size="small" color="black" onClick={() => setCreateQuestionForm(true)}>
                        Create Question
                    </MDButton>

                </MDBox>
            </MDBox>
            {createQuestionForm && <>
                <CreateQuestion createQuestionForm={createQuestionForm} setCreateQuestionForm={setCreateQuestionForm} quiz={quiz} question={id} />
            </>
            }
            <MDBox mt={1}>
                <DataTable
                    table={{ columns, rows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                />
            </MDBox>
        </Card>
    );
}

export default Question;