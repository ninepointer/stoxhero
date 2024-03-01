import * as React from 'react';
import { useContext, useState } from "react";
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import MDTypography from "../../../../components/MDTypography";
import MDBox from "../../../../components/MDBox";
import MDButton from "../../../../components/MDButton"
// import { userContext } from "../../../../AuthContext";
// import axios from "axios";
import { CircularProgress, Typography } from "@mui/material";
import MDSnackbar from "../../../../components/MDSnackbar";


export default function CreateRewards({ createRewardForm, setCreateRewardForm, contest, reward }) {

    const [isSubmitted, setIsSubmitted] = useState(false);
    // const getDetails = useContext(userContext);
    // const [rewardData, setRewardData] = useState([]);
    const [formState, setFormState] = useState({
        rankStart: "" || reward?.rankStart,
        rankEnd: "" || reward?.rankEnd,
        prize: "" || reward?.prize,
        prizeValue: "" || reward?.prizeValue
    });
    // const [id, setId] = useState();
    // const [isObjectNew, setIsObjectNew] = useState(id ? true : false)
    const [isLoading, setIsLoading] = useState(false)
    // const [editing, setEditing] = useState(false)
    // const [saving, setSaving] = useState(false)
    // const [creating, setCreating] = useState(false)
    // const [newObjectId, setNewObjectId] = useState()
    // const [addRewardObject, setAddRewardObject] = useState(false);



    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

    async function onNext(e, formState) {
        e.preventDefault()
        // setCreating(true)
        console.log("Reward Form State: ", formState)

        if (!formState?.rankStart || !formState?.rankEnd || !formState?.prize) {

            setTimeout(() => {  setIsSubmitted(false) }, 500)
            return openErrorSB("Missing Field", "Please fill all the mandatory fields")

        }

        const { rankStart, rankEnd, prize, prizeValue } = formState;
        if (reward?.rankStart) {
            const res = await fetch(`${baseUrl}api/v1/dailycontest/${contest}/rewards/${reward?._id}`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "content-type": "application/json",
                    "Access-Control-Allow-Credentials": true
                },
                body: JSON.stringify({
                    rankStart: parseInt(rankStart), rankEnd: parseInt(rankEnd), prize, prizeValue
                })
            });

            const data = await res.json();
            console.log(data.error, data);
            if (!data.error) {
                // setNewObjectId(data.data?._id)
                setTimeout(() => {  setIsSubmitted(true) }, 500)
                openSuccessSB(data.message, `Contest Reward Created with prize: ${data.data?.prize}`)
                setCreateRewardForm(!createRewardForm);

            } else {
                setTimeout(() => {  setIsSubmitted(false) }, 500)
                console.log("Invalid Entry");
                return openErrorSB("Couldn't Add Reward", data.error)
            }
        } else {
            const res = await fetch(`${baseUrl}api/v1/dailycontest/${contest}/rewards`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "content-type": "application/json",
                    "Access-Control-Allow-Credentials": true
                },
                body: JSON.stringify({
                    rankStart: parseInt(rankStart), rankEnd: parseInt(rankEnd), prize, prizeValue
                })
            });

            const data = await res.json();
            console.log(data.error, data);
            if (!data.error) {
                // setNewObjectId(data.data?._id)
                setTimeout(() => {  setIsSubmitted(true) }, 500)
                openSuccessSB(data.message, `Contest Reward Created with prize: ${data.data?.prize}`)
                setCreateRewardForm(!createRewardForm);

            } else {
                setTimeout(() => {  setIsSubmitted(false) }, 500)
                console.log("Invalid Entry");
                return openErrorSB("Couldn't Add Reward", data.error)
            }
        }
    }


    // const date = new Date(rewardData.lastModifiedOn);

    // const formattedLastModifiedOn = `${date.getUTCDate()}/${date.toLocaleString('default', { month: 'short' })}/${String(date.getUTCFullYear())} ${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}:${String(date.getUTCSeconds()).padStart(2, '0')}`;



    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    const [successSB, setSuccessSB] = useState(false);
    const openSuccessSB = (title, content) => {
        setTitle(title)
        setContent(content)
        setSuccessSB(true);
    }
    const closeSuccessSB = () => setSuccessSB(false);
    // console.log("Title, Content, Time: ",title,content,time)


    const renderSuccessSB = (
        <MDSnackbar
            color="success"
            icon="check"
            title={title}
            content={content}
            open={successSB}
            onClose={closeSuccessSB}
            close={closeSuccessSB}
            bgWhite="info"
        />
    );

    const [errorSB, setErrorSB] = useState(false);
    const openErrorSB = (title, content) => {
        setTitle(title)
        setContent(content)
        setErrorSB(true);
    }
    const closeErrorSB = () => setErrorSB(false);

    const renderErrorSB = (
        <MDSnackbar
            color="error"
            icon="warning"
            title={title}
            content={content}
            open={errorSB}
            onClose={closeErrorSB}
            close={closeErrorSB}
            bgWhite
        />
    );


    return (
        <>
            {isLoading ? (
                <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
                    <CircularProgress color="info" />
                </MDBox>
            )
                :
                (
                    <MDBox mt={4} p={3}>
                        <MDBox display="flex" justifyContent="space-between" alignItems="center">
                            <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                                Reward Details
                            </MDTypography>
                        </MDBox>

                        <Grid container spacing={1} mt={0.5} alignItems="space-between">

                            <Grid item xs={12} md={5} xl={6}>
                                <TextField
                                    disabled={((isSubmitted))}
                                    id="outlined-required"
                                    label='Rank Start*'
                                    inputMode='numeric'
                                    fullWidth
                                    value={formState?.rankStart}
                                    onChange={(e) => {
                                        setFormState(prevState => ({
                                            ...prevState,
                                            rankStart: e.target.value
                                        }))
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={5} xl={6}>
                                <TextField
                                    disabled={((isSubmitted))}
                                    id="outlined-required"
                                    label='Rank End*'
                                    inputMode='numeric'
                                    fullWidth
                                    value={formState?.rankEnd}
                                    onChange={(e) => {
                                        setFormState(prevState => ({
                                            ...prevState,
                                            rankEnd: e.target.value
                                        }))
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={5} xl={6}>
                                <TextField
                                    disabled={((isSubmitted))}
                                    id="outlined-required"
                                    label='Prize*'
                                    fullWidth
                                    value={formState?.prize}
                                    onChange={(e) => {
                                        setFormState(prevState => ({
                                            ...prevState,
                                            prize: e.target.value
                                        }))
                                    }}
                                />
                            </Grid>
                            {/* <Grid item xs={12} md={5} xl={6}>
                                <TextField
                                    disabled={((isSubmitted))}
                                    id="outlined-required"
                                    label='Prize Value*'
                                    fullWidth
                                    value={formState?.prizeValue}
                                    onChange={(e) => {
                                        setFormState(prevState => ({
                                            ...prevState,
                                            prizeValue: e.target.value
                                        }))
                                    }}
                                />
                            </Grid> */}



                            {!isSubmitted && (
                                <>
                                    <Grid item xs={12} md={2} xl={1} width="100%">
                                        <MDButton variant="contained" size="small" color="success" onClick={(e) => { onNext(e, formState) }}>Next</MDButton>
                                    </Grid>
                                    <Grid item xs={12} md={2} xl={1} width="100%">
                                        <MDButton variant="contained" size="small" color="warning" onClick={(e) => { setCreateRewardForm(!createRewardForm) }}>Back</MDButton>
                                    </Grid>
                                </>
                            )}

                        </Grid>
                        {renderSuccessSB}
                        {renderErrorSB}
                    </MDBox>
                )
            }
        </>
    )
}
