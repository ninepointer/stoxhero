import { useState, useEffect } from 'react';
import axios from "axios";
// import Box from '@mui/material/Box';
import DataTable from "../../../../examples/Tables/DataTable";
import MDButton from "../../../../components/MDButton"
import MDBox from "../../../../components/MDBox"
import MDTypography from "../../../../components/MDTypography"
import Grid from "@mui/material/Grid";
import { Card, Button } from "@mui/material";
import { AiOutlineEdit } from 'react-icons/ai';
import CreateOptions from './createOptions';
import { apiUrl } from '../../../../constants/constants';
import StyleIcon from '@mui/icons-material/Style';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';


const Options = ({ questionId, quizId, optionData }) => {

    let columns = [
        { Header: "Edit", accessor: "edit", align: "center" },
        { Header: "Option Key", accessor: "optionKey", align: "center" },
        { Header: "Option Text", accessor: "optionText", align: "center" },
        { Header: "Correct", accessor: "isCorrect", align: "center" },
        { Header: "Image", accessor: "optionImage", align: "center" },
    ];

    let rows = [];
    const [createQuestionForm, setCreateQuestionForm] = useState(false);
    const [quizQue, setQuizQue] = useState([]);
    const [id, setId] = useState({});
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [data, setData] = useState(optionData);

    const handleClose = async (e) => {
        setOpen(false);
    };

    data?.map((elem) => {
        let optObj = {}

        optObj.edit = (
            <AiOutlineEdit onClick={() => { setCreateQuestionForm(true); setId(elem) }} style={{ cursor: "pointer" }} />
        );

        optObj.optionKey = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                {elem.optionKey}
            </MDTypography>
        );
        optObj.optionText = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                {elem.optionText}
            </MDTypography>
        );
        optObj.isCorrect = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                {elem.isCorrect ? 'Yes' : 'No'}
            </MDTypography>
        );
        optObj.optionImage = (
            <img src={elem?.optionImage} style={{ width: "100px", height: "100px" }} />
        );

        rows.push(optObj)
    })

    return (
        <>
            <StyleIcon
                style={{ cursor: "pointer" }}
                onClick={() => { setOpen(true) }}
            />
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title">
                <DialogTitle id="responsive-dialog-title" sx={{ textAlign: 'center' }}>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ display: "flex", flexDirection: "column", marginLeft: 2 }}>
                        <Card>
                            <MDBox display="flex" justifyContent="space-between" alignItems="left">
                                <MDBox width="100%" display="flex" justifyContent="space-between" alignItems="center" sx={{ backgroundColor: "lightgrey", borderRadius: "2px" }} p={1}>
                                    <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
                                        Option
                                    </MDTypography>
                                    <MDButton hidden={true} variant="outlined" size="small" color="black" onClick={() => setCreateQuestionForm(true)}>
                                        Create Option
                                    </MDButton>

                                </MDBox>
                            </MDBox>
                            {createQuestionForm && <>
                                <CreateOptions createQuestionForm={createQuestionForm} setCreateQuestionForm={setCreateQuestionForm} quizId={quizId} questionId={questionId} option={id} data={data} setData={setData} />
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
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>

    );
}

export default Options;