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


// import battleRewardData from "../data/battleRewardData";
// import CreateRewardForm from "./createReward"
import CreateRewards from './createReward';

const ContestRewards = ({ contest }) => {

    // const [reRender, setReRender] = useState(true);
    let columns = [
        { Header: "Edit", accessor: "edit", align: "center" },
        { Header: "Rank Start", accessor: "rankStart", align: "center" },
        { Header: "Rank End", accessor: "rankEnd", align: "center" },
        { Header: "Prize", accessor: "prize", align: "center" },
        // { Header: "Prize Value", accessor: "prizeValue", align: "center" },
    ];

    let rows = [];
    const [createRewardForm, setCreateRewardForm] = useState(false);
    const [contestRewards, setContestRewards] = useState([]);
    // const { columns, rows } = battleRewardData();
    const [id, setId] = useState();

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

    useEffect(() => {

        axios.get(`${baseUrl}api/v1/dailycontest/${contest}/rewards`)
            .then((res) => {
                setContestRewards(res.data.data);
                // console.log(res.data.data);
            }).catch((err) => {
                return new Error(err);
            })
    }, [createRewardForm])

    contestRewards?.map((elem) => {
        let contestReward = {}

        contestReward.edit = (
            // <MDButton variant="text" color="info" size="small" sx={{fontSize:10}} fontWeight="medium">
            <AiOutlineEdit onClick={() => { setCreateRewardForm(true); setId(elem) }} />
            // </MDButton>
        );
        contestReward.rankStart = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                {elem.rankStart}
            </MDTypography>
        );
        contestReward.rankEnd = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                {elem.rankEnd}
            </MDTypography>
        );
        contestReward.prize = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                {elem.prize}
            </MDTypography>
        );
        contestReward.prizeValue = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                {elem.prizeValue}
            </MDTypography>
        );

        rows.push(contestReward)
    })

    return (

        <Card>
            <MDBox display="flex" justifyContent="space-between" alignItems="left">
                <MDBox width="100%" display="flex" justifyContent="space-between" alignItems="center" sx={{ backgroundColor: "lightgrey", borderRadius: "2px" }} p={1}>
                    <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
                        Contest Rewards
                    </MDTypography>
                    <MDButton hidden={true} variant="outlined" size="small" color="black" onClick={() => setCreateRewardForm(true)}>
                        Create Contest Reward
                    </MDButton>

                </MDBox>
            </MDBox>
            {createRewardForm && <>
                <CreateRewards createRewardForm={createRewardForm} setCreateRewardForm={setCreateRewardForm} contest={contest} reward={id} />
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

export default ContestRewards;