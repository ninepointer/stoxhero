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
import Create from './create';
import { apiUrl } from '../../../../constants/constants';
import StyleIcon from '@mui/icons-material/Style';
import SubTopic from '../subtopic/list';
import DeleteIcon from '@mui/icons-material/Delete';

const List = ({ courseId }) => {

    let columns = [
        { Header: "Edit", accessor: "edit", align: "center" },
        { Header: "Delete", accessor: "delete", align: "center" },
        { Header: "Order", accessor: "order", align: "center" },
        { Header: "Topic", accessor: "topic", align: "center" },
        { Header: "SubTopic", accessor: "subtopic", align: "center" },
    ];

    let rows = [];
    const [createForm, setCreateForm] = useState(false);
    const [contentData, setContentData] = useState([]);
    const [id, setId] = useState({});

    useEffect(() => {
        axios.get(`${apiUrl}courses/${courseId}/content`, {withCredentials: true})
            .then((res) => {
                setContentData(res?.data?.data?.courseContent);
            }).catch((err) => {
                return new Error(err);
            })
    }, [createForm])

    contentData?.map((elem) => {
        let obj = {}

        obj.edit = (
            <AiOutlineEdit onClick={() => { setCreateForm(true); setId(elem) }} style={{cursor: "pointer"}} />
        );
        obj.delete = (
            <DeleteIcon onClick={()=>{deleteData(elem?._id)}} style={{cursor: "pointer"}} />
        );
        obj.order = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                {elem.order}
            </MDTypography>
        );
        obj.topic = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                {elem.topic}
            </MDTypography>
        );
        obj.subtopic = (
            <SubTopic courseId={courseId} contentId={elem?._id} subTopics={elem?.subtopics} />
        );

        rows.push(obj)
    })

    async function deleteData(id){
        const del = await axios.delete(`${apiUrl}courses/${courseId}/content/${id}`, {withCredentials: true});
        setContentData(del?.data?.data?.courseContent)
    }
    return (

        <Card>
            <MDBox display="flex" justifyContent="space-between" alignItems="left">
                <MDBox width="100%" display="flex" justifyContent="space-between" alignItems="center" sx={{ backgroundColor: "lightgrey", borderRadius: "2px" }} p={1}>
                    <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
                        Content
                    </MDTypography>
                    <MDButton hidden={true} variant="outlined" size="small" color="black" onClick={() => setCreateForm(true)}>
                        Create Content
                    </MDButton>

                </MDBox>
            </MDBox>
            {createForm && <>
                <Create createForm={createForm} setCreateForm={setCreateForm} courseId={courseId} content={id} />
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

export default List;