import { useState, useEffect } from 'react';
import axios from "axios";
// import Box from '@mui/material/Box';
import DataTable from "../../../../examples/Tables/DataTable";
import MDButton from "../../../../components/MDButton"
import MDBox from "../../../../components/MDBox"
import MDTypography from "../../../../components/MDTypography"
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { AiOutlineEdit } from 'react-icons/ai';
// import { CircularProgress } from "@mui/material";
// import TabContext from '@material-ui/lab/TabContext';

import DeleteIcon from '@mui/icons-material/Delete';

// import battleRewardData from "../data/battleRewardData";
// import CreateRewardForm from "./createReward"
import Create from './create';
import { apiUrl } from '../../../../constants/constants';

const List = ({ courseId }) => {

    let columns = [
        { Header: "Edit", accessor: "edit", align: "center" },
        { Header: "Delete", accessor: "delete", align: "center" },
        { Header: "Order", accessor: "order", align: "center" },
        { Header: "Benefits", accessor: "benefits", align: "center" },
    ];

    let rows = [];
    const [createForm, setCreateForm] = useState(false);
    const [benefitData, setBenefitData] = useState([]);
    const [id, setId] = useState();

    useEffect(() => {
        axios.get(`${apiUrl}courses/${courseId}/benefit`, {withCredentials: true})
            .then((res) => {
                setBenefitData(res.data.data?.courseBenefits);
            }).catch((err) => {
                return new Error(err);
            })
    }, [createForm])

    benefitData?.map((elem) => {
        let obj = {}

        obj.edit = (
            // <MDButton variant="text" color="info" size="small" sx={{fontSize:10}} fontWeight="medium">
            <AiOutlineEdit onClick={() => { setCreateForm(true); setId(elem) }} style={{cursor: "pointer"}} />
            // </MDButton>
        );

        obj.delete = (
            <DeleteIcon onClick={()=>{deleteData(elem?._id)}} style={{cursor: "pointer"}} />
        );
        obj.order = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                {elem.order}
            </MDTypography>
        );
        obj.benefits = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                {elem.benefits}
            </MDTypography>
        );

        rows.push(obj)
    })

    async function deleteData(id){
        const del = await axios.delete(`${apiUrl}courses/${courseId}/benefit/${id}`, {withCredentials: true});
        setBenefitData(del?.data?.data?.courseBenefits)
    }

    return (

        <Card mt={1}>
            <MDBox display="flex" justifyContent="space-between" alignItems="left">
                <MDBox width="100%" display="flex" justifyContent="space-between" alignItems="center" sx={{ backgroundColor: "lightgrey", borderRadius: "2px" }} p={1}>
                    <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
                        Benefits
                    </MDTypography>
                    <MDButton hidden={true} variant="outlined" size="small" color="black" onClick={() => setCreateForm(true)}>
                        Create Benefits
                    </MDButton>

                </MDBox>
            </MDBox>
            {createForm && <>
                <Create createForm={createForm} setCreateForm={setCreateForm} courseId={courseId} benefits={id} />
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