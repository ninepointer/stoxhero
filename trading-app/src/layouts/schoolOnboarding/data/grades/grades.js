import { useState, useEffect } from 'react';
import axios from "axios";
// import Box from '@mui/material/Box';
import DataTable from "../../../../examples/Tables/DataTable";
import MDButton from "../../../../components/MDButton"
import MDBox from "../../../../components/MDBox"
import MDTypography from "../../../../components/MDTypography"
import {Card, Button} from "@mui/material";
import { apiUrl } from '../../../../constants/constants';
import CreateSection from './createSection'

const Grades = ({ school, updatedDocument }) => {

    // const [reRender, setReRender] = useState(true);
    let columns = [
        // { Header: "Edit", accessor: "edit", align: "center" },
        { Header: "Sections", accessor: "sections", align: "center" },
        { Header: "Grade", accessor: "grade", align: "center" },
        { Header: "Add Section", accessor: "add", align: "center" }
    ];

    let rows = [];
    const [createSections, setCreateSections] = useState(false);
    const [grade, setGrade] = useState([]);
    const [id, setId] = useState({});

    useEffect(() => {
        axios.get(`${apiUrl}school/${school}/grades`, {withCredentials: true})
            .then((res) => {
                setGrade(res?.data?.data);
            }).catch((err) => {
                return new Error(err);
            })
    }, [createSections, updatedDocument])

    grade?.map((elem) => {
        let section = '';
        for(let subelem of elem.sections){
            section += `${subelem} | `
        }

        const stringWithoutLastCharacter = section.slice(0, -2);
        const obj = {}

        obj.sections = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                {stringWithoutLastCharacter}
            </MDTypography>
        );
        obj.grade = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                {elem.grade?.grade}
            </MDTypography>
        );
        obj.add = (
            <MDButton hidden={true} variant="outlined" size="small" color="success" 
            onClick={() => {setCreateSections(true); setId(elem)}}
            >
                Add
            </MDButton>
        );

        rows.push(obj)
    })

    return (

        <Card>
            <MDBox display="flex" justifyContent="space-between" alignItems="left">
                <MDBox width="100%" display="flex" justifyContent="space-between" alignItems="center" sx={{ backgroundColor: "lightgrey", borderRadius: "2px" }} p={1}>
                    <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
                        Grades
                    </MDTypography>
                </MDBox>
            </MDBox>

            {createSections && <>
                <CreateSection createSections={createSections} setCreateSections={setCreateSections} school={school} grade={id} data={grade} />
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

export default Grades;