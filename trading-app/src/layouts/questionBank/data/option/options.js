import { useState, useEffect } from 'react';
import axios from "axios";
import DataTable from "../../../../examples/Tables/DataTable";
import MDButton from "../../../../components/MDButton"
import MDBox from "../../../../components/MDBox"
import MDTypography from "../../../../components/MDTypography"
import { Card, Button } from "@mui/material";
import { AiOutlineEdit } from 'react-icons/ai';
import CreateOption from './createOptions';
import { apiUrl } from '../../../../constants/constants';
import DeleteIcon from '@mui/icons-material/Delete';

const Option = ({ question }) => {

    let columns = [
        { Header: "Edit", accessor: "edit", align: "center" },
        { Header: "Delete", accessor: "delete", align: "center" },
        { Header: "Title", accessor: "title", align: "center" },
        { Header: "Correct", accessor: "isCorrect", align: "center" },
        { Header: "Image", accessor: "image", align: "center" },
    ];

    let rows = [];
    const [createOptionForm, setCreateOptionForm] = useState(false);
    const [optionData, setOptionData] = useState([]);
    const [id, setId] = useState({});

    useEffect(() => {
        axios.get(`${apiUrl}questionbank/${question}/option`, { withCredentials: true })
            .then((res) => {
                setOptionData(res?.data?.data);
            }).catch((err) => {
                return new Error(err);
            })
    }, [createOptionForm])

    async function deleteFunc(id) {
        const data = await axios.delete(`${apiUrl}questionbank/${question}/option/${id}`, { withCredentials: true });
        setOptionData(data?.data?.data);
    }

    optionData?.options?.map((elem) => {
        let queObj = {}

        queObj.edit = (
            <AiOutlineEdit onClick={() => { setCreateOptionForm(true); setId(elem) }} style={{ cursor: "pointer" }} />
        );

        queObj.delete = (
            <DeleteIcon onClick={() => { deleteFunc(elem?._id) }} style={{ cursor: "pointer" }} />
        );

        queObj.title = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                {elem.title}
            </MDTypography>
        );

        queObj.isCorrect = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                {elem.isCorrect ? "Yes" : "No"}
            </MDTypography>
        );

        queObj.image = (
            elem?.image ?
                <img src={elem?.image} style={{ width: "100px", height: "100px" }} />
                :
                <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                    {'No Image'}
                </MDTypography>
        );

        rows.push(queObj)
    })

    return (
        <Card>
            <MDBox display="flex" justifyContent="space-between" alignItems="left">
                <MDBox width="100%" display="flex" justifyContent="space-between" alignItems="center" sx={{ backgroundColor: "lightgrey", borderRadius: "2px" }} p={1}>
                    <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
                        Options
                    </MDTypography>
                    <MDButton hidden={true} variant="outlined" size="small" color="black" onClick={() => setCreateOptionForm(true)}>
                        Create Option
                    </MDButton>

                </MDBox>
            </MDBox>
            {createOptionForm && <>
                <CreateOption createOptionForm={createOptionForm} setCreateOptionForm={setCreateOptionForm} question={question} option={id} />
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

export default Option;