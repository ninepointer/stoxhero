import { useEffect } from 'react';
import { useContext, useState } from "react";
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton"
import { userContext } from "../../AuthContext";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import MDSnackbar from "../../components/MDSnackbar";
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useLocation, useNavigate } from "react-router-dom";
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import dayjs from 'dayjs';
import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { apiUrl } from '../../constants/constants';
import SuccessfullAppliedUser from "./data/SuccessAppliedUser"
import AppliedUser from "./data/AppliedUsers"


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


function CreateCoupon() {
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const getDetails = useContext(userContext);
  const location = useLocation();
  const id = location?.state?.data;
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(id?.eligibleProducts ? id?.eligibleProducts : []);
  const [couponData, setCouponData] = useState(id ? id : '');
  const [isObjectNew, setIsObjectNew] = useState(id ? true : false)
  const [isLoading, setIsLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [creating, setCreating] = useState(false)
  const [formState, setFormState] = useState({
    code: id?.code || '',
    description: id?.description || '',
    discount: id?.discount || '',
    isOneTimeUse: id?.isOneTimeUse || false,
    discountType: id?.discountType || 'Percentage',
    rewardType: id?.rewardType || 'Discount',
    status: id?.status || 'Active',
    liveDate: dayjs(id?.liveDate) || dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0),
    expiryDate: dayjs(id?.expiryDate) || dayjs(new Date()).set('hour', 23).set('minute', 59).set('second', 59),
    eligibleProducts: id?.eligibleProducts || [],
    maxDiscount: id?.maxDiscount || '',
    minOrderValue: id?.minOrderValue || '',
  });
  async function getProducts() {
    const res = await axios.get(`${apiUrl}products`, { withCredentials: true });
    if (res.status == 200) {
      setProducts(res?.data?.data?.filter((item) => item?.productName != 'Internship'));
    }
  }
  useEffect(() => {
    getProducts();
  }, [])

  async function onSubmit(e, formState) {
    e.preventDefault()

    setCreating(true)

    if (!formState?.code || !formState?.discount || !formState?.discountType || !formState?.liveDate || !formState?.expiryDate || !formState?.maxDiscount) {
      setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500);
      return openErrorSB("Missing Field", "Please fill all the mandatory fields");
    }

    setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
    const { code, discount, discountType, rewardType, liveDate, expiryDate, status, eligibleProducts, isOneTimeUse, description, maxDiscount, minOrderValue } = formState;
    const res = await fetch(`${apiUrl}coupons`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        maxDiscount, code, discount, discountType, rewardType, liveDate, expiryDate, status, eligibleProducts, isOneTimeUse, description, minOrderValue
      })
    });


    const data = await res.json();

    if (res.status === 200 || data) {
      openSuccessSB("Coupon Created", data.message)
      setIsSubmitted(true)
      setCouponData(data?.data)
      setIsObjectNew(true);
      setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
    } else {
      setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
    }
  }


  async function onEdit(e, formState) {
    e.preventDefault()
    setSaving(true)
    if (!formState?.code || !formState?.discount || !formState?.discountType || !formState?.liveDate || !formState?.expiryDate || !formState?.maxDiscount) {
      // setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500);
      return openErrorSB("Missing Field", "Please fill all the mandatory fields");
    }

    const { code, discount, discountType, rewardType, liveDate, expiryDate, status, eligibleProducts, isOneTimeUse, description, maxDiscount, minOrderValue } = formState;
    const res = await fetch(`${apiUrl}coupons/${id?._id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        code, discount, discountType, rewardType, liveDate, expiryDate, status, eligibleProducts, isOneTimeUse, description, maxDiscount, minOrderValue
      })

    });

    const data = await res.json();
    const updatedData = data?.data
    if (updatedData || res.status === 200) {
      openSuccessSB("Coupon Edited", `Successfully Edited Coupon`);
      setTimeout(() => { setSaving(false); setEditing(false) }, 500)
    } else {
      openErrorSB("Error", "data.error")
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
  const handleChange = (event) => {
    const selectedIds = event.target.value;
    setSelectedProduct(selectedIds);

    setFormState(prevState => ({
      ...prevState,
      eligibleProducts: selectedIds
    }));
  };

  return (
    <>
      {isLoading ? (
        <MDBox mt={10} mb={10} display="flex" width="100%" justifyContent="center" alignItems="center">
          <CircularProgress color="info" />
        </MDBox>
      )
        :
        (
          <MDBox bgColor="light" color="dark" mt={2} mb={1} p={2} borderRadius={10} minHeight='auto'>
            <MDBox display="flex" mb={1} justifyContent="space-between" alignItems="center">
              <MDTypography color='dark' variant="caption" fontWeight="bold" textTransform="uppercase">
                Coupon Details
              </MDTypography>
            </MDBox>

            <Grid container spacing={2} mt={0.5}>
              <Grid item xs={12} md={6} xl={3}>
                <TextField
                  disabled={((isSubmitted || id) && (!editing || saving))}
                  id="outlined-required"
                  label='Code *'
                  value={formState?.code || editing ? formState?.code : couponData?.code}
                  fullWidth
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      code: e.target.value
                    }))
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} xl={3}>
                <TextField
                  disabled={((isSubmitted || id) && (!editing || saving))}
                  id="outlined-required"
                  label='Description *'
                  value={formState?.description || editing ? formState?.description : couponData?.description}
                  fullWidth
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      description: e.target.value
                    }))
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} xl={3}>
                <TextField
                  disabled={((isSubmitted || id) && (!editing || saving))}
                  id="outlined-required"
                  type="number"
                  label='Discount *'
                  value={formState?.discount || editing ? formState?.discount : couponData?.discount}
                  fullWidth
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      discount: e.target.value
                    }))
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6} xl={3}>
                <TextField
                  disabled={((isSubmitted || id) && (!editing || saving))}
                  id="outlined-required"
                  type="number"
                  label='Max Discount *'
                  value={formState?.maxDiscount || editing ? formState?.maxDiscount : couponData?.maxDiscount}
                  fullWidth
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      maxDiscount: e.target.value
                    }))
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6} xl={3}>
                <FormControl sx={{ width: '100%' }}>
                  <InputLabel id="demo-simple-select-autowidth-label">One Time Use*</InputLabel>
                  <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    disabled={((isSubmitted || id) && (!editing || saving))}
                    value={(formState?.isOneTimeUse) || (couponData?.isOneTimeUse)}
                    onChange={(e) => {
                      setFormState((prevState) => ({
                        ...prevState,
                        isOneTimeUse: e.target.value,
                      }));
                    }}
                    label="One Time Use*"
                    sx={{
                      minHeight: 43,
                    }}
                  >
                    <MenuItem value={true}>True</MenuItem>
                    <MenuItem value={false}>False</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} xl={3}>
                <FormControl sx={{ width: '100%' }}>
                  <InputLabel id="demo-simple-select-autowidth-label">Discount Type*</InputLabel>
                  <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    disabled={((isSubmitted || id) && (!editing || saving))}
                    value={formState?.discountType || couponData?.discountType}
                    onChange={(e) => {
                      setFormState((prevState) => ({
                        ...prevState,
                        discountType: e.target.value,
                      }));
                    }}
                    label="Discount Type*"
                    sx={{
                      minHeight: 43,
                    }}
                  >
                    <MenuItem value={'Percentage'}>Percentage</MenuItem>
                    <MenuItem value={'Flat'}>Flat</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} xl={3}>
                <FormControl sx={{ width: '100%' }}>
                  <InputLabel id="demo-simple-select-autowidth-label">Reward Type*</InputLabel>
                  <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    disabled={((isSubmitted || id) && (!editing || saving))}
                    value={formState?.rewardType || couponData?.rewardType}
                    onChange={(e) => {
                      setFormState((prevState) => ({
                        ...prevState,
                        rewardType: e.target.value,
                      }));
                    }}
                    label="Reward Type*"
                    sx={{
                      minHeight: 43,
                    }}
                  >
                    <MenuItem value={'Discount'}>Discount</MenuItem>
                    <MenuItem value={'Cashback'}>Cashback</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} xl={3}>
                <FormControl sx={{ width: '100%' }}>
                  <InputLabel id="demo-simple-select-autowidth-label">Status*</InputLabel>
                  <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    disabled={((isSubmitted || id) && (!editing || saving))}
                    value={formState?.status || couponData?.status}
                    onChange={(e) => {
                      setFormState((prevState) => ({
                        ...prevState,
                        status: e.target.value,
                      }));
                    }}
                    label="Status*"
                    sx={{
                      minHeight: 43,
                    }}
                  >
                    <MenuItem value={'Active'}>Active</MenuItem>
                    <MenuItem value={'Inactive'}>Inactive</MenuItem>
                    <MenuItem value={'Draft'}>Draft</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6} xl={3} mt={-1} mb={1}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['MobileDateTimePicker']}>
                    <DemoItem>
                      <MobileDateTimePicker
                        label="Live Date"
                        disabled={((isSubmitted || id) && (!editing || saving))}
                        value={formState?.liveDate || dayjs(id?.liveDate)}
                        onChange={(newValue) => {
                          if (newValue && newValue.isValid()) {
                            setFormState(prevState => ({ ...prevState, liveDate: newValue }))
                          }
                        }}
                        minDateTime={null}
                        sx={{ width: '100%' }}
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={6} xl={3} mt={-1} mb={1}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['MobileDateTimePicker']}>
                    <DemoItem>
                      <MobileDateTimePicker
                        label="Expiry Date"
                        disabled={((isSubmitted || id) && (!editing || saving))}
                        value={formState?.expiryDate || dayjs(id?.expiryDate)}
                        onChange={(newValue) => {
                          if (newValue && newValue.isValid()) {
                            setFormState(prevState => ({ ...prevState, expiryDate: newValue }))
                          }
                        }}
                        minDateTime={null}
                        sx={{ width: '100%' }}
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6} xl={4} mt={-1} mb={1}>
                <FormControl sx={{ m: 1, width:'100%'}}>
                  <InputLabel id="demo-multiple-checkbox-label">Select Products</InputLabel>
                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    disabled={((isSubmitted || id) && (!editing || saving))}
                    value={selectedProduct}
                    onChange={handleChange}
                    input={<OutlinedInput label="Tag" />}
                    renderValue={(selectedIds) =>
                      selectedIds.map(id => products.find(prod => prod._id === id)?.productName).join(', ')
                    }
                    sx={{ minHeight: "44px" }}
                    MenuProps={MenuProps}
                  >
                    {products?.map((elem) => (
                      <MenuItem key={elem?._id} value={elem?._id}>
                        <Checkbox checked={selectedProduct.indexOf(elem?._id) > -1} />
                        <ListItemText primary={elem?.productName} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} xl={2}>
                <TextField
                  disabled={((isSubmitted || id) && (!editing || saving))}
                  id="outlined-required"
                  type="number"
                  label='Min Order Value *'
                  value={formState?.minOrderValue || editing ? formState?.minOrderValue : couponData?.minOrderValue}
                  fullWidth
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      minOrderValue: e.target.value
                    }))
                  }}
                />
              </Grid>



              <Grid item display="flex" justifyContent="flex-end" alignContent="center" xs={12} md={12} xl={12}>
                {!isSubmitted && !isObjectNew && (
                  <>
                    <MDButton mr={1} variant="contained" color="success" size="small" sx={{ mr: 1, ml: 2 }} disabled={creating} onClick={(e) => { onSubmit(e, formState) }}>
                      {creating ? <CircularProgress size={20} color="inherit" /> : "Submit"}
                    </MDButton>
                    <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={() => { navigate("/coupons") }}>
                      Cancel
                    </MDButton>
                  </>
                )}

                {(isSubmitted || id) && !editing && (
                  <>
                    <MDButton sx={{ mr: 1, ml: 2 }} variant="contained" color="info" size="small" disabled={editing} onClick={() => { setEditing(true) }}>
                      Edit
                    </MDButton>
                    <MDButton variant="contained" color="error" size="small" disabled={editing} onClick={() => { navigate("/coupons") }}>
                      Back
                    </MDButton>
                  </>
                )}

                {(isSubmitted || id) && editing && (
                  <>
                    <MDButton variant="contained" color="warning" size="small" sx={{ mr: 1, ml: 2 }} disabled={saving}
                      onClick={(e) => { onEdit(e, formState) }}

                    >
                      {saving ? <CircularProgress size={20} color="inherit" /> : "Save"}
                    </MDButton>
                    <MDButton variant="contained" color="error" size="small" disabled={saving} onClick={() => { setEditing(false) }}>
                      Cancel
                    </MDButton>
                  </>
                )}
              </Grid>


              {(id || isObjectNew) && <Grid item xs={12} md={12} xl={12} mt={2} mb={2}>
                <MDBox>
                  <SuccessfullAppliedUser couponData={id?._id ? id : couponData} />
                </MDBox>
              </Grid>}

              {(id || isObjectNew) && <Grid item xs={12} md={12} xl={12} mt={2} mb={2}>
                <MDBox>
                  <AppliedUser couponData={id?._id ? id : couponData} />
                </MDBox>
              </Grid>}
            </Grid>
            {renderSuccessSB}
            {renderErrorSB}
          </MDBox>
        )
      }
    </>
  )
}
export default CreateCoupon;