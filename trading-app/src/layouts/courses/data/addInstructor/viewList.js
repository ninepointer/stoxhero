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
import DeleteIcon from '@mui/icons-material/Delete';

const List = ({ courseId }) => {

    let columns = [
        { Header: "Edit", accessor: "edit", align: "center" },
        { Header: "Delete", accessor: "delete", align: "center" },
        { Header: "Name", accessor: "name", align: "center" },
        { Header: "Mobile", accessor: "mobile", align: "center" },
        { Header: "Image", accessor: "instructorImage", align: "center" },
    ];

    let rows = [];
    const [createForm, setCreateForm] = useState(false);
    const [instructor, setInstructor] = useState([]);
    const [id, setId] = useState({});

    useEffect(() => {
        axios.get(`${apiUrl}courses/${courseId}/instructor`, {withCredentials: true})
            .then((res) => {
                setInstructor(res?.data?.data?.courseInstructors);
            }).catch((err) => {
                return new Error(err);
            })
    }, [createForm])

    async function deleteData(id){
        const del = await axios.delete(`${apiUrl}courses/${courseId}/instructor/${id}`, {withCredentials: true});
        setInstructor(del?.data?.data?.courseInstructors)
    }

    instructor?.map((elem) => {
        let queObj = {}

        queObj.edit = (
            <AiOutlineEdit onClick={() => { setCreateForm(true); setId(elem) }} style={{cursor: "pointer"}} />
        );

        queObj.delete = (
            <DeleteIcon onClick={()=>{deleteData(elem?._id)}} style={{cursor: "pointer"}} />
        );
        queObj.name = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                {elem?.id?.first_name + " " + elem?.id?.last_name}
            </MDTypography>
        );
        queObj.mobile = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                {elem?.id?.mobile}
            </MDTypography>
        );
        queObj.instructorImage = (
            elem?.image ?
            <img src={elem?.image} style={{width: "100px", height: "100px"}} />
            :
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                {'No Image'}
            </MDTypography>
        );

        rows.push(queObj)
    })

    console.log("courseId data", instructor);
    return (

        <Card width="100%">
            <MDBox display="flex" justifyContent="space-between" alignItems="left">
                <MDBox width="100%" display="flex" justifyContent="space-between" alignItems="center" sx={{ backgroundColor: "lightgrey", borderRadius: "2px" }} p={1}>
                    <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
                        Instructor
                    </MDTypography>
                    <MDButton hidden={true} variant="outlined" size="small" color="black" onClick={() => setCreateForm(true)}>
                        Create Instructor
                    </MDButton>

                </MDBox>
            </MDBox>
            {createForm && <>
                <Create createForm={createForm} setCreateForm={setCreateForm} courseId={courseId} instructor={id} />
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