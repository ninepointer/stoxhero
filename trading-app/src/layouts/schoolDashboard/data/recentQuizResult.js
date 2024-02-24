import * as React from 'react';
import DataTable from "../../../examples/Tables/DataTable";
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import MDButton from '../../../components/MDButton';
import { Typography } from '@mui/material';
import { settingContext } from '../../../settingContext';
import moment from "moment"
import DialogTitle from '@mui/material/DialogTitle';
import { userContext } from '../../../AuthContext';


export default function RecentQuizResults() {

    let columns = [
        { Header: "Quiz Name", accessor: "quizName", align: "center" },
        { Header: "Topic", accessor: "quizTopic", align: "center" },
        { Header: "Total Students", accessor: "totalStudents", align: "center" },
        { Header: "Your Students", accessor: "yourStudents", align: "center" },
        { Header: "Avg. Performance", accessor: "avgPerformance", align: "center" },
    ];

    let rows = [];

    const data = [
        {
            quizName: 'StoxHero Challenge Dalal Street 2024',
            quizTopic: 'Integer',
            totalStudents: 100,
            yourStudents: 20,
            avgPerformance: "60%"
        },
        {
            quizName: 'StoxHero Challenge Dalal Street 2024',
            quizTopic: 'Integer',
            totalStudents: 100,
            yourStudents: 20,
            avgPerformance: "60%"
        },
        {
            quizName: 'StoxHero Challenge Dalal Street 2024',
            quizTopic: 'Integer',
            totalStudents: 100,
            yourStudents: 20,
            avgPerformance: "60%"
        }
    ]

    data?.map((elem) => {
        let featureObj = {}

        featureObj.quizName = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                 {elem?.quizName}
            </MDTypography>
        );
        featureObj.quizTopic = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
               {elem?.quizTopic}
            </MDTypography>
        );
        featureObj.totalStudents = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
               {elem?.totalStudents}
            </MDTypography>
        );
        featureObj.yourStudents = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
               {elem?.yourStudents}
            </MDTypography>
        );
        featureObj.avgPerformance = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                {elem?.avgPerformance}
            </MDTypography>
        );

        rows.push(featureObj)
    })



    return (
        <>
            <Card sx={{ marginTop: "10px", height: '500px' }}>
                <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ backgroundColor: "lightgrey", borderRadius: "2px" }} >
                    <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
                        Recent Quiz Results
                    </MDTypography>
                </MDBox>
                <MDBox >
                    <DataTable
                        table={{ columns, rows }}
                        showTotalEntries={false}
                        isSorted={false}
                        entriesPerPage={false}
                    />
                </MDBox>
            </Card>
        </>
    );
}

