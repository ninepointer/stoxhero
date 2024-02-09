import React, { useState } from 'react';
import MDTypography from "../../../components/MDTypography";
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton"
import { Checkbox, CircularProgress, FormControlLabel, Grid, TextField, FormGroup } from '@mui/material';
import { Link } from 'react-router-dom'
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import MDSnackbar from "../../../components/MDSnackbar";
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { IoMdAddCircle } from 'react-icons/io';
import OutlinedInput from '@mui/material/OutlinedInput';
import FeatureData from './featureData';
import TenXSubscriptionPurchaseIntent from './tenXSubscriptionPurchaseIntent'
import TenXSubscriptionTutorialView from './tenXSubscriptionTutorialVideoView'
import TenXSubscribers from './tenXSubscriber'
import ActiveTenXSubscribers from './ActivetenXSubscriber'
import ExpiredTenXSubscribers from './ExpiredtenXSubscribers'

const ITEM_HEIGHT = 30;
const ITEM_PADDING_TOP = 10;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export default function TenXSubsDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const id = location?.state?.data;
    const [purchaseIntentCount, setPurchaseIntentCount] = useState(0);
    const [tutorialVideoViewCount, setTutorialVideoViewCount] = useState(0);
    const [tenXSubs, setTenXSubs] = useState([]);
    const [portfolios, setPortfolios] = useState([]);
    const [isLoading, setIsLoading] = useState(id ? true : false)
    const [saving, setSaving] = useState(false)
    const [editing, setEditing] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newObjectId, setNewObjectId] = useState("");
    const [updatedDocument, setUpdatedDocument] = useState([]);
    const [tenXData, setTenXData] = useState([])
    const [subscriptionCount, setSubscriptionCount] = useState([]);
    const [LiveTenXSubs, setLiveTenXSubs] = useState([]);
    const [ExpiredTenXSubs, setExpiredTenXSubs] = useState([]);

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

    const [formState, setFormState] = useState({
        plan_name: '',
        actual_price: '',
        discounted_price: '',
        isRecommended: '',
        expiryDays: "",
        payoutPercentage: "",
        features: {
            orderNo: "",
            description: ""
        },
        profitCap: '',
        validity: '',
        validityPeriod: '',
        portfolio: {
            id: "",
            name: ""
        },
        status: '',
        allowPurchase: '',
        allowRenewal: '',
        rewardType: "",
        tdsRelief: ""
    });

    React.useEffect(() => {
        axios.get(`${baseUrl}api/v1/portfolio/tenx`, { withCredentials: true })
            .then((res) => {
                setPortfolios(res?.data?.data);
            }).catch((err) => {
                return new Error(err)
            })

        axios.get(`${baseUrl}api/v1/tenX/${id}`, { withCredentials: true })
            .then((res) => {
                setTenXSubs(res?.data?.data);
                setLiveTenXSubs(res?.data?.data?.users?.filter(user => user.status === 'Live'))
                setExpiredTenXSubs(res?.data?.data?.users?.filter(user => user.status === 'Expired'))
                setTimeout(() => {
                    setIsLoading(false)
                }, 500)
                //   setIsLoading(false).setTimeout(30000);
            }).catch((err) => {
                return new Error(err)
            })

    }, [])

    React.useEffect(() => {

        axios.get(`${baseUrl}api/v1/tenX/${id}`, { withCredentials: true })
            .then((res) => {
                setTenXData(res.data.data);
                setUpdatedDocument(res.data.data)
                setFormState({
                    plan_name: res.data.data?.plan_name || '',
                    actual_price: res.data.data?.actual_price || '',
                    discounted_price: res.data.data?.discounted_price || '',
                    status: res.data.data?.status || '',
                    profitCap: res.data.data?.profitCap || '',
                    validity: res.data.data?.validity || '',
                    validityPeriod: res.data.data?.validityPeriod || '',
                    portfolio: res.data.data?.portfolio?.portfolioName || '',
                    allowPurchase: res.data.data?.allowPurchase || '',
                    allowRenewal: res.data.data?.allowRenewal || '',
                    expiryDays: res.data.data?.expiryDays || '',
                    payoutPercentage: res.data.data?.payoutPercentage || '',

                    rewardType: res.data.data?.rewardType || '',
                    tdsRelief: res.data.data?.tdsRelief || ''
                });
                setTimeout(() => { setIsLoading(false) }, 500)
                // setIsLoading(false)
            }).catch((err) => {
                //window.alert("Server Down");
                return new Error(err);
            })

    }, [])

    async function onEdit(e, formState) {
        e.preventDefault()
        setSaving(true)

        if (!formState.rewardType || !formState.plan_name || !formState.profitCap || !formState.portfolio || !formState.actual_price || !formState.discounted_price || !formState.validityPeriod || !formState.status) {
            setTimeout(() => { setSaving(false); setEditing(true) }, 500)
            return openErrorSB("Missing Field", "Please fill all the mandatory fields")
        }

        if (Number(formState.validity) > Number(formState.expiryDays)) {
            return openErrorSB("Error", "Expiry days should be greater then validity.")
        }
        const {rewardType, tdsRelief, plan_name, actual_price, isRecommended, discounted_price, validity, validityPeriod, status, portfolio, profitCap, allowPurchase, allowRenewal, payoutPercentage, expiryDays } = formState;

        const res = await fetch(`${baseUrl}api/v1/tenX/${id}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "content-type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                rewardType, tdsRelief, plan_name, actual_price, isRecommended, discounted_price, validity, validityPeriod, status, portfolio: portfolio.id, profitCap, allowPurchase, allowRenewal, payoutPercentage, expiryDays
            })
        });

        const data = await res.json();
        if (data.status === 422 || data.error || !data) {
            openErrorSB("Error", data.error)
        } else {
            openSuccessSB("Slab Edited", "Edited Successfully")
            setTimeout(() => { setSaving(false); setEditing(false) }, 500)
            console.log("entry succesfull");
        }
    }

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        // setRuleName(value)
        let portfolioId = portfolios?.filter((elem) => {
            return elem.portfolioName === value;
        })

        // console.log("portfolioId", portfolioId)
        setFormState(prevState => ({
            ...prevState,
            portfolio: { id: portfolioId[0]?._id, name: portfolioId[0]?.portfolioName }
        }))
    };

    async function onSubmit(e, formState) {
        e.preventDefault()
        if (!formState.rewardType || !formState.plan_name || !formState.profitCap || !formState.portfolio || !formState.actual_price || !formState.discounted_price || !formState.validity || !formState.validityPeriod || !formState.status) {
            setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
            return openErrorSB("Missing Field", "Please fill all the mandatory fields")
        }

        if (Number(formState.validity) > Number(formState.expiryDays)) {
            return openErrorSB("Error", "Expiry days should be greater then validity.")
        }
        setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
        const {rewardType, tdsRelief, plan_name, actual_price, isRecommended, discounted_price, validity, validityPeriod, status, portfolio, profitCap, allowPurchase, allowRenewal, payoutPercentage, expiryDays } = formState;
        const res = await fetch(`${baseUrl}api/v1/tenX/create`, {
            method: "POST",
            credentials: "include",
            headers: {
                "content-type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                rewardType, tdsRelief, plan_name, actual_price, isRecommended, discounted_price, validity, payoutPercentage, expiryDays,
                validityPeriod, status, portfolio: portfolio.id, profitCap, allowPurchase, allowRenewal
            })
        });


        const data = await res.json();
        if (data.status === 422 || data.error || !data) {
            setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
        } else {
            setNewObjectId(data?.data._id)
            openSuccessSB("Subscription Created", data.message)
            setIsSubmitted(true)
            setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
        }
    }

    async function onAddFeature(e, childFormState, setChildFormState) {
        e.preventDefault()
        setSaving(true)
        if (!childFormState?.orderNo || !childFormState?.description) {
            setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
            return openErrorSB("Missing Field", "Please fill all the mandatory fields")
        }
        const { orderNo, description } = childFormState;

        const res = await fetch(`${baseUrl}api/v1/tenX/${id ? id : newObjectId}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "content-type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                features: { orderNo, description }
            })
        });
        const data = await res.json();
        if (data.status === 422 || data.error || !data) {
            openErrorSB("Error", data.error)
        } else {
            setUpdatedDocument(data?.data);
            openSuccessSB("Feature added", "New Feature line item has been added in the TenX")
            setTimeout(() => { setSaving(false); setEditing(false) }, 500)
            setChildFormState(prevState => ({
                ...prevState,
                rewards: {}
            }))
        }
    }

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    const [successSB, setSuccessSB] = useState(false);
    const openSuccessSB = (title, content) => {
        setTitle(title)
        setContent(content)
        setSuccessSB(true);
    }
    const closeSuccessSB = () => setSuccessSB(false);
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


    const handleEdit = (e) => {
        const { name, value } = e.target;
        if (!formState[name]?.includes(e.target.value)) {
            setFormState(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    }

    return (
        <>
            {isLoading ? (
                <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
                    <CircularProgress color="info" />
                </MDBox>
            )
                :
                (
                    <MDBox pl={2} pr={2} mt={4} mb={5}>
                        <MDBox display="flex" justifyContent="space-between" alignItems="center">
                            <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                                Fill Subscription Details
                            </MDTypography>
                        </MDBox>

                        <Grid container display="flex" flexDirection="row" justifyContent="space-between">
                            <Grid container spacing={2} mt={0.5} mb={0} xs={12} md={9} xl={12}>
                                <Grid item xs={12} md={6} xl={3}>
                                    <TextField
                                        disabled={((isSubmitted || id) && (!editing || saving))}
                                        id="outlined-required"
                                        label='Plan Name *'
                                        name='plan_name'
                                        fullWidth
                                        value={formState?.plan_name || tenXSubs?.plan_name}
                                        defaultValue={editing ? formState?.plan_name : tenXSubs?.plan_name}
                                        onChange={(e) => {
                                            setFormState(prevState => ({
                                                ...prevState,
                                                plan_name: e.target.value
                                            }))
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6} xl={3}>
                                    <TextField
                                        disabled={((isSubmitted || id) && (!editing || saving))}
                                        id="outlined-required"
                                        label='Actual Price *'
                                        name='actual_price'
                                        type='number'
                                        fullWidth
                                        value={formState?.actual_price || tenXSubs?.actual_price}
                                        defaultValue={editing ? formState?.actual_price : tenXSubs?.actual_price}
                                        onChange={(e) => {
                                            setFormState(prevState => ({
                                                ...prevState,
                                                actual_price: e.target.value
                                            }))
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6} xl={3}>
                                    <TextField
                                        disabled={((isSubmitted || id) && (!editing || saving))}
                                        id="outlined-required"
                                        label='Discounted Price *'
                                        name='discounted_price'
                                        type='number'
                                        fullWidth
                                        value={formState?.discounted_price || tenXSubs?.discounted_price}
                                        defaultValue={editing ? formState?.discounted_price : tenXSubs?.discounted_price}
                                        onChange={(e) => {
                                            setFormState(prevState => ({
                                                ...prevState,
                                                discounted_price: e.target.value
                                            }))
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6} xl={3}>
                                    <TextField
                                        disabled={((isSubmitted || id) && (!editing || saving))}
                                        id="outlined-required"
                                        label='Profit Cap *'
                                        name='profitCap'
                                        type='number'
                                        fullWidth
                                        value={formState?.profitCap || tenXSubs?.profitCap}
                                        defaultValue={editing ? formState?.profitCap : tenXSubs?.profitCap}
                                        onChange={(e) => {
                                            setFormState(prevState => ({
                                                ...prevState,
                                                profitCap: e.target.value
                                            }))
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6} xl={3}>
                                    <TextField
                                        disabled={((isSubmitted || id) && (!editing || saving))}
                                        id="outlined-required"
                                        label='Payout Percentage *'
                                        name='payoutPercentage'
                                        type='number'
                                        fullWidth
                                        value={formState?.payoutPercentage || tenXSubs?.payoutPercentage}
                                        defaultValue={editing ? formState?.payoutPercentage : tenXSubs?.payoutPercentage}
                                        onChange={(e) => {
                                            setFormState(prevState => ({
                                                ...prevState,
                                                payoutPercentage: e.target.value
                                            }))
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6} xl={3}>
                                    <TextField
                                        disabled={((isSubmitted || id) && (!editing || saving))}
                                        id="outlined-required"
                                        label='Expiry Days *'
                                        name='expiryDays'
                                        type='number'
                                        fullWidth
                                        value={formState?.expiryDays || tenXSubs?.expiryDays}
                                        defaultValue={editing ? formState?.expiryDays : tenXSubs?.expiryDays}
                                        onChange={(e) => {
                                            setFormState(prevState => ({
                                                ...prevState,
                                                expiryDays: e.target.value
                                            }))
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={3} xl={3} mb={-3}>
                                    <FormControl sx={{ minHeight: 10, minWidth: 263 }}>
                                        <InputLabel id="demo-multiple-name-label">Portfolio</InputLabel>
                                        <Select
                                            labelId="demo-multiple-name-label"
                                            id="demo-multiple-name"
                                            name='portfolio'
                                            disabled={((isSubmitted || id) && (!editing || saving))}
                                            value={formState?.portfolio?.name || tenXSubs?.portfolio?.portfolioName}
                                            onChange={handleChange}
                                            input={<OutlinedInput label="Portfolio" />}
                                            sx={{ minHeight: 45 }}
                                            MenuProps={MenuProps}
                                        >
                                            {portfolios?.map((portfolio) => (
                                                <MenuItem
                                                    key={portfolio?.portfolioName}
                                                    value={portfolio?.portfolioName}
                                                >
                                                    {portfolio.portfolioName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={6} xl={3}>
                                    <TextField
                                        disabled={((isSubmitted || id) && (!editing || saving))}
                                        id="outlined-required"
                                        label='Validity *'
                                        type='number'
                                        name='validity'
                                        fullWidth
                                        value={formState?.validity || tenXSubs?.validity}
                                        defaultValue={editing ? formState?.validity : tenXSubs?.validity}
                                        onChange={(e) => {
                                            setFormState(prevState => ({
                                                ...prevState,
                                                validity: e.target.value
                                            }))
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6} xl={3}>
                                    <FormControl sx={{ width: "100%" }}>
                                        <InputLabel id="demo-simple-select-autowidth-label">Validity Period *</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-autowidth-label"
                                            id="demo-simple-select-autowidth"
                                            name='validityPeriod'
                                            value={formState?.validityPeriod || tenXSubs?.validityPeriod}
                                            disabled={((isSubmitted || id) && (!editing || saving))}
                                            onChange={(e) => {
                                                setFormState(prevState => ({
                                                    ...prevState,
                                                    validityPeriod: e.target.value
                                                }))
                                            }}
                                            label="Validity Period"
                                            sx={{ minHeight: 43 }}
                                        >
                                            <MenuItem value="days">Day(s)</MenuItem>
                                            <MenuItem value="month">Month(s)</MenuItem>
                                            <MenuItem value="year">Year(s)</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={6} xl={3}>
                                    <FormControl sx={{ width: "100%" }}>
                                        <InputLabel id="demo-simple-select-autowidth-label">Status *</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-autowidth-label"
                                            id="demo-simple-select-autowidth"
                                            name='status'
                                            value={formState?.status || tenXSubs?.status}
                                            disabled={((isSubmitted || id) && (!editing || saving))}
                                            onChange={(e) => {
                                                setFormState(prevState => ({
                                                    ...prevState,
                                                    status: e.target.value
                                                }))
                                            }}
                                            label="Status"
                                            sx={{ minHeight: 43 }}
                                        >
                                            <MenuItem value="Active">Active</MenuItem>
                                            <MenuItem value="Inactive">Inactive</MenuItem>
                                            <MenuItem value="Draft">Draft</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={6} xl={3}>
                                    <FormControl sx={{ width: "100%" }}>
                                        <InputLabel id="demo-simple-select-autowidth-label">Allow Purchase</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-autowidth-label"
                                            id="demo-simple-select-autowidth"
                                            name='allowPurchase'
                                            value={formState?.allowPurchase || tenXSubs?.allowRenewal}
                                            disabled={((isSubmitted || id) && (!editing || saving))}
                                            onChange={(e) => {
                                                setFormState(prevState => ({
                                                    ...prevState,
                                                    allowPurchase: e.target.value
                                                }))
                                            }}
                                            label="Allow Purchase"
                                            sx={{ minHeight: 43 }}
                                        >
                                            <MenuItem value={true}>True</MenuItem>
                                            <MenuItem value={false}>False</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid><Grid item xs={12} md={6} xl={3}>
                                    <FormControl sx={{ width: "100%" }}>
                                        <InputLabel id="demo-simple-select-autowidth-label">Allow Renewal</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-autowidth-label"
                                            id="demo-simple-select-autowidth"
                                            name='allowRenewal'
                                            value={formState?.allowRenewal || tenXSubs?.allowRenewal}
                                            disabled={((isSubmitted || id) && (!editing || saving))}
                                            onChange={(e) => {
                                                setFormState(prevState => ({
                                                    ...prevState,
                                                    allowRenewal: e.target.value
                                                }))
                                            }}
                                            label="Allow Renewal"
                                            sx={{ minHeight: 43 }}
                                        >
                                            <MenuItem value={true}>True</MenuItem>
                                            <MenuItem value={false}>False</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={6} xl={3}>
                                    <FormControl sx={{ width: "100%" }}>
                                        <InputLabel id="demo-simple-select-autowidth-label">Reward Type *</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-autowidth-label"
                                            id="demo-simple-select-autowidth"
                                            name='rewardType'
                                            value={formState?.rewardType || tenXSubs?.rewardType}
                                            disabled={((isSubmitted || id) && (!editing || saving))}
                                            onChange={(e) => {
                                                setFormState(prevState => ({
                                                    ...prevState,
                                                    rewardType: e.target.value
                                                }))
                                            }}
                                            label="Batch Status"
                                            sx={{ minHeight: 43 }}
                                        >
                                            <MenuItem value="Cash">Cash</MenuItem>
                                            <MenuItem value="HeroCash">HeroCash</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={6} xl={3}>
                                    <FormGroup>
                                        <FormControlLabel
                                            checked={(tenXSubs?.tdsRelief !== undefined && !editing && formState?.tdsRelief === undefined) ? tenXSubs?.tdsRelief : formState?.tdsRelief}
                                            disabled={((isSubmitted || id) && (!editing || saving))}
                                            onChange={(e) => {
                                                console.log('checkbox', e.target.checked, e.target.value);
                                                setFormState(prevState => ({
                                                    ...prevState,
                                                    tdsRelief: e.target.checked
                                                }))
                                            }}
                                            control={<Checkbox />}
                                            label="TDS Relief" />
                                    </FormGroup>
                                </Grid>

                            </Grid>

                        </Grid>

                        <Grid container mt={2} xs={12} md={12} xl={12} >
                            <Grid item display="flex" justifyContent="flex-end" xs={12} md={6} xl={12}>
                                {!isSubmitted && !id && (
                                    <>
                                        <MDButton
                                            variant="contained"
                                            color="success"
                                            size="small"
                                            sx={{ mr: 1, ml: 2 }}
                                            disabled={creating}
                                            onClick={(e) => { onSubmit(e, formState) }}
                                        >
                                            {creating ? <CircularProgress size={20} color="inherit" /> : "Save"}
                                        </MDButton>
                                        <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={() => { navigate("/tenxsubscriptions") }}>
                                            Cancel
                                        </MDButton>
                                    </>
                                )}
                                {(isSubmitted || id) && !editing && (
                                    <>
                                        <MDButton variant="contained" color="warning" size="small" sx={{ mr: 1, ml: 2 }} onClick={() => { setEditing(true) }}>
                                            Edit
                                        </MDButton>
                                        <MDButton variant="contained" color="info" size="small" onClick={() => { (id || newObjectId) ? navigate("/tenxsubscriptions") : setIsSubmitted(false) }}>
                                            Back
                                        </MDButton>
                                    </>
                                )}
                                {(isSubmitted || id) && editing && (
                                    <>
                                        <MDButton
                                            variant="contained"
                                            color="warning"
                                            size="small"
                                            sx={{ mr: 1, ml: 2 }}
                                            disabled={saving}
                                            onClick={(e) => { onEdit(e, formState) }}
                                        >
                                            {saving ? <CircularProgress size={20} color="inherit" /> : "Save"}
                                        </MDButton>
                                        <MDButton
                                            variant="contained"
                                            color="error"
                                            size="small"
                                            disabled={saving}
                                            onClick={() => { setEditing(false) }}
                                        >
                                            Cancel
                                        </MDButton>
                                    </>
                                )}
                            </Grid>

                            {(isSubmitted || id) && !editing &&
                                <Grid item xs={12} md={6} xl={12}>

                                    <Grid container spacing={1}>

                                        <Grid item xs={12} md={6} xl={12} mt={-3} mb={-1}>
                                            <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                                                Add Features
                                            </MDTypography>
                                        </Grid>

                                        <Grid item xs={12} md={1.35} xl={2.7}>
                                            <TextField
                                                id="outlined-required"
                                                label='Order No. *'
                                                fullWidth
                                                type="number"
                                                onChange={(e) => {
                                                    setFormState(prevState => ({
                                                        ...prevState,
                                                        orderNo: e.target.value
                                                    }))
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={1.35} xl={2.7}>
                                            <TextField
                                                id="outlined-required"
                                                label='Description *'
                                                fullWidth
                                                type="text"
                                                onChange={(e) => {
                                                    setFormState(prevState => ({
                                                        ...prevState,
                                                        description: e.target.value
                                                    }))
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={0.6} xl={1.2} mt={-0.7}>
                                            <IoMdAddCircle cursor="pointer" onClick={(e) => { onAddFeature(e, formState, setFormState) }} />
                                        </Grid>

                                    </Grid>

                                </Grid>}

                            {(isSubmitted || id) && <Grid item xs={12} md={12} xl={12} mt={2}>
                                <MDBox>
                                    <FeatureData updatedDocument={updatedDocument} setUpdatedDocument={setUpdatedDocument} />
                                </MDBox>
                            </Grid>}

                            {(id || newObjectId) && <Grid item xs={12} md={12} xl={12} mt={2}>
                                <MDBox>
                                    <ActiveTenXSubscribers tenXSubscription={LiveTenXSubs} subscriptionCount={LiveTenXSubs?.length} />
                                </MDBox>
                            </Grid>}

                            {(id || newObjectId) && <Grid item xs={12} md={12} xl={12} mt={2}>
                                <MDBox>
                                    <TenXSubscribers tenXSubscription={tenXSubs} subscriptionCount={subscriptionCount} setSubscriptionCount={setSubscriptionCount} />
                                </MDBox>
                            </Grid>}

                            {(id || newObjectId) && <Grid item xs={12} md={12} xl={12} mt={2}>
                                <MDBox>
                                    <ExpiredTenXSubscribers tenXSubscription={ExpiredTenXSubs} />
                                </MDBox>
                            </Grid>}

                            {(id || newObjectId) && <Grid item xs={12} md={12} xl={12} mt={2}>
                                <MDBox>
                                    <TenXSubscriptionPurchaseIntent tenXSubscription={newObjectId ? newObjectId : id} purchaseIntentCount={purchaseIntentCount} setPurchaseIntentCount={setPurchaseIntentCount} />
                                </MDBox>
                            </Grid>}

                            {(id || newObjectId) && <Grid item xs={12} md={12} xl={12} mt={2}>
                                <MDBox>
                                    <TenXSubscriptionTutorialView tenXSubscription={newObjectId ? newObjectId : id} tutorialVideoViewCount={tutorialVideoViewCount} setTutorialVideoViewCount={setTutorialVideoViewCount} />
                                </MDBox>
                            </Grid>}

                        </Grid>

                        {renderSuccessSB}
                        {renderErrorSB}
                    </MDBox>
                )
            }
        </>
    );
}